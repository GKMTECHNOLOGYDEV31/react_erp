<?php

namespace App\Http\Controllers\dashboard;

use Illuminate\Http\Request;
use App\Models\Ticket;
use App\Models\Ticketflujo;
use App\Models\Usuario; // Importamos el modelo Usuario
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;

class AnalyticsController extends Controller
{
    private $idClienteGeneral;

    /**
     * Obtiene el idClienteGeneral del usuario autenticado
     */
    private function getIdClienteGeneral()
    {
        $user = auth()->user();

        if (!$user) {
            Log::error('Usuario no autenticado');
            return null;
        }

        // Log para debugging - veremos todos los campos del usuario
        Log::info('Usuario autenticado:', [
            'id' => $user->idUsuario,
            'nombre' => $user->Nombre . ' ' . $user->apellidoPaterno,
            'correo' => $user->correo,
            'idClienteGeneral' => $user->idClienteGeneral,
            'tipo_usuario' => $user->idTipoUsuario,
            'rol' => $user->idRol
        ]);

        // El campo existe en el modelo como $user->idClienteGeneral
        return $user->idClienteGeneral;
    }

    /**
     * Obtiene todos los datos del dashboard filtrados por idClienteGeneral
     */
    public function dashboard(Request $request)
    {
        try {
            $this->idClienteGeneral = $this->getIdClienteGeneral();

            if (!$this->idClienteGeneral) {
                // En lugar de error, devolvemos datos vacíos pero con estructura
                Log::warning('Usuario sin idClienteGeneral, devolviendo datos vacíos');

                return response()->json([
                    'ticketsPorPeriodo' => [
                        'dia' => 0,
                        'semana' => 0,
                        'mes' => 0,
                        'año' => 0,
                        'tendencia' => [
                            'dia' => 0,
                            'semana' => 0,
                            'mes' => 0,
                            'año' => 0,
                        ]
                    ],
                    'ticketsCerrados' => [
                        'cantidad' => 0,
                        'porcentaje' => 0,
                        'tendencia' => 0
                    ],
                    'tiempoResolucion' => [
                        'horas' => 0,
                        'tendencia' => 0,
                        'meta' => 48
                    ],
                    'reincidencias' => [
                        'porcentaje' => 0,
                        'total' => 0,
                        'reincidentes' => 0,
                        'porTecnico' => [],
                        'tendencia' => 0
                    ],
                ]);
            }

            return response()->json([
                'ticketsPorPeriodo' => $this->getTicketsPorPeriodo(),
                'ticketsCerrados' => $this->getTicketsCerrados(),
                'tiempoResolucion' => $this->getTiempoResolucion(),
                'reincidencias' => $this->getReincidencias(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error en dashboard: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Error al obtener datos del dashboard',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Endpoint de depuración
     */
    public function debug(Request $request)
    {
        $user = auth()->user();

        // Contar tickets del cliente si tiene idClienteGeneral
        $ticketsCount = 0;
        if ($user && $user->idClienteGeneral) {
            $ticketsCount = Ticket::where('idClienteGeneral', $user->idClienteGeneral)->count();
        }

        return response()->json([
            'authenticated' => auth()->check(),
            'user_id' => $user->idUsuario ?? null,
            'user_nombre' => $user ? ($user->Nombre . ' ' . $user->apellidoPaterno) : null,
            'user_correo' => $user->correo ?? null,
            'idClienteGeneral' => $user->idClienteGeneral ?? null,
            'tickets_del_cliente' => $ticketsCount,
            'user_data' => $user ? $user->toArray() : null,
            'headers' => $request->headers->all(),
        ]);
    }

    /**
     * Tickets por período
     */
    private function getTicketsPorPeriodo()
    {
        $now = Carbon::now();

        // Verificar si hay tickets para este cliente
        $totalTickets = Ticket::where('idClienteGeneral', $this->idClienteGeneral)->count();

        Log::info('Total tickets para cliente ' . $this->idClienteGeneral . ': ' . $totalTickets);

        // Query base con filtro por idClienteGeneral
        $baseQuery = Ticket::where('idClienteGeneral', $this->idClienteGeneral);

        // Obtener conteos para diferentes períodos
        $hoy = (clone $baseQuery)->whereDate('fecha_creacion', $now->toDateString())->count();

        $semana = (clone $baseQuery)->whereBetween('fecha_creacion', [
            $now->startOfWeek()->format('Y-m-d H:i:s'),
            $now->copy()->endOfWeek()->format('Y-m-d H:i:s')
        ])->count();

        $mes = (clone $baseQuery)->whereMonth('fecha_creacion', $now->month)
            ->whereYear('fecha_creacion', $now->year)
            ->count();

        $año = (clone $baseQuery)->whereYear('fecha_creacion', $now->year)->count();

        // Calcular tendencias
        $tendenciaHoy = $this->calcularTendenciaPeriodo('dia');
        $tendenciaSemana = $this->calcularTendenciaPeriodo('semana');
        $tendenciaMes = $this->calcularTendenciaPeriodo('mes');
        $tendenciaAño = $this->calcularTendenciaPeriodo('año');

        return [
            'dia' => $hoy,
            'semana' => $semana,
            'mes' => $mes,
            'año' => $año,
            'tendencia' => [
                'dia' => $tendenciaHoy,
                'semana' => $tendenciaSemana,
                'mes' => $tendenciaMes,
                'año' => $tendenciaAño,
            ]
        ];
    }

    /**
     * Tickets cerrados (cuando el último flujo es idEstadflujo = 7)
     */
    private function getTicketsCerrados()
    {
        // Obtener IDs de tickets que tienen su último flujo = 7
        $ticketsCerradosIds = DB::table('ticketflujo as tf')
            ->join(
                DB::raw('(SELECT idTicket, MAX(fecha_creacion) as ultima_fecha 
                             FROM ticketflujo 
                             GROUP BY idTicket) as ultimos'),
                function ($join) {
                    $join->on('tf.idTicket', '=', 'ultimos.idTicket')
                        ->on('tf.fecha_creacion', '=', 'ultimos.ultima_fecha');
                }
            )
            ->where('tf.idEstadflujo', 7)
            ->pluck('tf.idTicket');

        // Contar tickets cerrados del cliente
        $cantidad = Ticket::where('idClienteGeneral', $this->idClienteGeneral)
            ->whereIn('idTickets', $ticketsCerradosIds)
            ->count();

        // Total de tickets del cliente
        $total = Ticket::where('idClienteGeneral', $this->idClienteGeneral)->count();

        // Calcular tendencia vs mes anterior
        $now = Carbon::now();

        // Tickets cerrados este mes
        $ticketsCerradosEsteMes = DB::table('ticketflujo as tf')
            ->join(
                DB::raw('(SELECT idTicket, MAX(fecha_creacion) as ultima_fecha 
                             FROM ticketflujo 
                             GROUP BY idTicket) as ultimos'),
                function ($join) {
                    $join->on('tf.idTicket', '=', 'ultimos.idTicket')
                        ->on('tf.fecha_creacion', '=', 'ultimos.ultima_fecha');
                }
            )
            ->join('tickets as t', 't.idTickets', '=', 'tf.idTicket')
            ->where('tf.idEstadflujo', 7)
            ->where('t.idClienteGeneral', $this->idClienteGeneral)
            ->whereMonth('tf.fecha_creacion', $now->month)
            ->whereYear('tf.fecha_creacion', $now->year)
            ->count();

        // Tickets cerrados mes anterior
        $ticketsCerradosMesAnterior = DB::table('ticketflujo as tf')
            ->join(
                DB::raw('(SELECT idTicket, MAX(fecha_creacion) as ultima_fecha 
                             FROM ticketflujo 
                             GROUP BY idTicket) as ultimos'),
                function ($join) {
                    $join->on('tf.idTicket', '=', 'ultimos.idTicket')
                        ->on('tf.fecha_creacion', '=', 'ultimos.ultima_fecha');
                }
            )
            ->join('tickets as t', 't.idTickets', '=', 'tf.idTicket')
            ->where('tf.idEstadflujo', 7)
            ->where('t.idClienteGeneral', $this->idClienteGeneral)
            ->whereMonth('tf.fecha_creacion', $now->copy()->subMonth()->month)
            ->whereYear('tf.fecha_creacion', $now->copy()->subMonth()->year)
            ->count();

        $tendencia = $ticketsCerradosMesAnterior > 0
            ? round((($ticketsCerradosEsteMes - $ticketsCerradosMesAnterior) / $ticketsCerradosMesAnterior) * 100, 1)
            : 0;

        return [
            'cantidad' => $cantidad,
            'porcentaje' => $total > 0 ? round(($cantidad / $total) * 100) : 0,
            'tendencia' => $tendencia
        ];
    }

    /**
     * Tiempo promedio de resolución
     */
    private function getTiempoResolucion()
    {
        // Obtener tickets cerrados con su fecha de creación y fecha de cierre
        $ticketsCerrados = DB::table('ticketflujo as tf')
            ->join(
                DB::raw('(SELECT idTicket, MAX(fecha_creacion) as ultima_fecha 
                             FROM ticketflujo 
                             GROUP BY idTicket) as ultimos'),
                function ($join) {
                    $join->on('tf.idTicket', '=', 'ultimos.idTicket')
                        ->on('tf.fecha_creacion', '=', 'ultimos.ultima_fecha');
                }
            )
            ->join('tickets as t', 't.idTickets', '=', 'tf.idTicket')
            ->where('tf.idEstadflujo', 7)
            ->where('t.idClienteGeneral', $this->idClienteGeneral)
            ->select('t.fecha_creacion as fecha_apertura', 'tf.fecha_creacion as fecha_cierre')
            ->get();

        if ($ticketsCerrados->isEmpty()) {
            return [
                'horas' => 0,
                'tendencia' => 0,
                'meta' => 48
            ];
        }

        // Calcular promedio en horas
        $totalHoras = 0;
        foreach ($ticketsCerrados as $ticket) {
            $apertura = Carbon::parse($ticket->fecha_apertura);
            $cierre = Carbon::parse($ticket->fecha_cierre);
            $horas = $apertura->diffInHours($cierre);
            $totalHoras += $horas;
        }

        $promedio = round($totalHoras / $ticketsCerrados->count(), 1);

        // Calcular tendencia vs día anterior
        $ayer = Carbon::now()->subDay();
        $promedioAyer = $this->calcularPromedioResolucionDia($ayer);
        $tendencia = round($promedio - $promedioAyer, 1);

        return [
            'horas' => $promedio,
            'tendencia' => $tendencia,
            'meta' => 48
        ];
    }

    /**
     * Reincidencias (misma serie)
     */
    private function getReincidencias()
    {
        // Obtener tickets del cliente agrupados por serie
        $ticketsPorSerie = Ticket::where('idClienteGeneral', $this->idClienteGeneral)
            ->whereNotNull('serie')
            ->where('serie', '!=', '')
            ->select('serie', DB::raw('COUNT(*) as total'))
            ->groupBy('serie')
            ->having('total', '>', 1)
            ->get();

        $totalReincidencias = 0;
        $seriesReincidentes = 0;

        foreach ($ticketsPorSerie as $serie) {
            $totalReincidencias += ($serie->total - 1);
            $seriesReincidentes++;
        }

        $totalTickets = Ticket::where('idClienteGeneral', $this->idClienteGeneral)->count();
        $porcentaje = $totalTickets > 0 ? round(($totalReincidencias / $totalTickets) * 100, 1) : 0;

        // Técnicos con más reincidencias
        $tecnicosReincidencias = DB::table('tickets as t')
            ->join(
                DB::raw('(SELECT serie, COUNT(*) as total 
                             FROM tickets 
                             WHERE idClienteGeneral = ' . $this->idClienteGeneral . '
                             AND serie IS NOT NULL 
                             AND serie != "" 
                             GROUP BY serie 
                             HAVING total > 1) as reincidentes'),
                't.serie',
                '=',
                'reincidentes.serie'
            )
            ->where('t.idClienteGeneral', $this->idClienteGeneral)
            ->select('t.idTecnico', DB::raw('COUNT(*) as total'))
            ->groupBy('t.idTecnico')
            ->orderByDesc('total')
            ->limit(3)
            ->get();

        $porTecnico = [];
        foreach ($tecnicosReincidencias as $tecnico) {
            $nombreTecnico = $this->getNombreTecnico($tecnico->idTecnico);
            $porTecnico[] = [
                'tecnico' => $nombreTecnico,
                'reincidencias' => $tecnico->total
            ];
        }

        // Calcular tendencia
        $now = Carbon::now();
        $reincidenciasEsteMes = $this->contarReincidenciasPeriodo($now->month, $now->year);
        $reincidenciasMesAnterior = $this->contarReincidenciasPeriodo($now->copy()->subMonth()->month, $now->copy()->subMonth()->year);

        $tendencia = $reincidenciasMesAnterior > 0
            ? round((($reincidenciasEsteMes - $reincidenciasMesAnterior) / $reincidenciasMesAnterior) * 100, 1)
            : 0;

        return [
            'porcentaje' => $porcentaje,
            'total' => $totalReincidencias,
            'reincidentes' => $seriesReincidentes,
            'porTecnico' => $porTecnico,
            'tendencia' => $tendencia
        ];
    }

    /**
     * Calcula la tendencia para un período específico
     */
    private function calcularTendenciaPeriodo($periodo)
    {
        $now = Carbon::now();
        $query = Ticket::where('idClienteGeneral', $this->idClienteGeneral);

        switch ($periodo) {
            case 'dia':
                $actual = (clone $query)->whereDate('fecha_creacion', $now->toDateString())->count();
                $anterior = (clone $query)->whereDate('fecha_creacion', $now->copy()->subDay()->toDateString())->count();
                break;
            case 'semana':
                $actual = (clone $query)->whereBetween('fecha_creacion', [$now->startOfWeek(), $now->copy()->endOfWeek()])->count();
                $anterior = (clone $query)->whereBetween('fecha_creacion', [$now->copy()->subWeek()->startOfWeek(), $now->copy()->subWeek()->endOfWeek()])->count();
                break;
            case 'mes':
                $actual = (clone $query)->whereMonth('fecha_creacion', $now->month)->whereYear('fecha_creacion', $now->year)->count();
                $anterior = (clone $query)->whereMonth('fecha_creacion', $now->copy()->subMonth()->month)->whereYear('fecha_creacion', $now->copy()->subMonth()->year)->count();
                break;
            case 'año':
                $actual = (clone $query)->whereYear('fecha_creacion', $now->year)->count();
                $anterior = (clone $query)->whereYear('fecha_creacion', $now->copy()->subYear()->year)->count();
                break;
            default:
                return 0;
        }

        if ($anterior > 0) {
            return round((($actual - $anterior) / $anterior) * 100, 1);
        }

        return 0;
    }

    /**
     * Calcula el promedio de resolución para un día específico
     */
    private function calcularPromedioResolucionDia($fecha)
    {
        $ticketsCerrados = DB::table('ticketflujo as tf')
            ->join(
                DB::raw('(SELECT idTicket, MAX(fecha_creacion) as ultima_fecha 
                             FROM ticketflujo 
                             GROUP BY idTicket) as ultimos'),
                function ($join) {
                    $join->on('tf.idTicket', '=', 'ultimos.idTicket')
                        ->on('tf.fecha_creacion', '=', 'ultimos.ultima_fecha');
                }
            )
            ->join('tickets as t', 't.idTickets', '=', 'tf.idTicket')
            ->where('tf.idEstadflujo', 7)
            ->where('t.idClienteGeneral', $this->idClienteGeneral)
            ->whereDate('tf.fecha_creacion', $fecha->toDateString())
            ->select('t.fecha_creacion as fecha_apertura', 'tf.fecha_creacion as fecha_cierre')
            ->get();

        if ($ticketsCerrados->isEmpty()) {
            return 0;
        }

        $totalHoras = 0;
        foreach ($ticketsCerrados as $ticket) {
            $apertura = Carbon::parse($ticket->fecha_apertura);
            $cierre = Carbon::parse($ticket->fecha_cierre);
            $horas = $apertura->diffInHours($cierre);
            $totalHoras += $horas;
        }

        return round($totalHoras / $ticketsCerrados->count(), 1);
    }

    /**
     * Cuenta reincidencias para un período específico (por serie)
     */
    private function contarReincidenciasPeriodo($mes, $año)
    {
        $tickets = Ticket::where('idClienteGeneral', $this->idClienteGeneral)
            ->whereMonth('fecha_creacion', $mes)
            ->whereYear('fecha_creacion', $año)
            ->whereNotNull('serie')
            ->where('serie', '!=', '')
            ->get();

        $series = [];
        $reincidencias = 0;

        foreach ($tickets as $ticket) {
            if (!isset($series[$ticket->serie])) {
                $series[$ticket->serie] = 1;
            } else {
                $series[$ticket->serie]++;
                if ($series[$ticket->serie] > 1) {
                    $reincidencias++;
                }
            }
        }

        return $reincidencias;
    }

    /**
     * Obtiene el nombre del técnico
     */
    private function getNombreTecnico($idTecnico)
    {
        if (!$idTecnico) return 'Sin asignar';

        $tecnico = Usuario::find($idTecnico);
        if ($tecnico) {
            return $tecnico->Nombre . ' ' . $tecnico->apellidoPaterno;
        }

        return 'Técnico ' . $idTecnico;
    }

    // ==================== MÉTODOS PÚBLICOS PARA ENDPOINTS ESPECÍFICOS ====================

    public function ticketsPorPeriodo(Request $request)
    {
        try {
            $this->idClienteGeneral = $this->getIdClienteGeneral();
            return response()->json($this->getTicketsPorPeriodo());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function ticketsCerrados(Request $request)
    {
        try {
            $this->idClienteGeneral = $this->getIdClienteGeneral();
            return response()->json($this->getTicketsCerrados());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function tiempoResolucion(Request $request)
    {
        try {
            $this->idClienteGeneral = $this->getIdClienteGeneral();
            return response()->json($this->getTiempoResolucion());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function reincidencias(Request $request)
    {
        try {
            $this->idClienteGeneral = $this->getIdClienteGeneral();
            return response()->json($this->getReincidencias());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
