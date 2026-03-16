<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\Usuario;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardService
{

    public function getDashboard($idClienteGeneral)
    {
        return [
            'totalTickets' => $this->getTotalTickets($idClienteGeneral),
            'ticketsCerrados' => $this->getTicketsCerrados($idClienteGeneral),
            'tiempoResolucion' => $this->getTiempoResolucion($idClienteGeneral),
            'reincidencias' => $this->getReincidencias($idClienteGeneral),
            'tendenciaTickets' => $this->getTendenciaTickets($idClienteGeneral),
            'ticketsPorDistrito' => $this->getTicketsPorDistrito($idClienteGeneral),
            'flujoTicketsEstado' => $this->getFlujoTicketsPorEstado($idClienteGeneral),
            'rendimientoTecnico' => $this->getRendimientoPorTecnico($idClienteGeneral),
            'rendimientoPersonal' => $this->getRendimientoPersonal($idClienteGeneral),
            'analisisReincidencias' => $this->getAnalisisReincidencias($idClienteGeneral),
            'ticketsMas2Visitas' => $this->getTicketsMasDe1Visita($idClienteGeneral),
            'tecnicosMasReincidencias' => $this->getTecnicosMasReincidencias($idClienteGeneral),
            'tasaExito' => $this->getTasaExito($idClienteGeneral)
        ];
    }

    /**
     * TOTAL TICKETS
     */
    public function getTotalTickets($idClienteGeneral)
    {
        return Ticket::where('idClienteGeneral', $idClienteGeneral)->count();
    }

    public function getTicketsCerrados($idClienteGeneral)
    {
        $inicioMesActual = Carbon::now()->startOfMonth();
        $inicioMesAnterior = Carbon::now()->subMonth()->startOfMonth();
        $finMesAnterior = Carbon::now()->subMonth()->endOfMonth();

        $totalTickets = DB::table('tickets')
            ->where('idClienteGeneral', $idClienteGeneral)
            ->count();

        /*
    =====================================
    TICKETS CERRADOS (ULTIMO FLUJO = 7)
    =====================================
    */
        $cerrados = DB::table('tickets as t')
            ->join(DB::raw('(
            SELECT idTicket, MAX(fecha_creacion) as ultima_fecha
            FROM ticketflujo
            GROUP BY idTicket
        ) ult'), 't.idTickets', '=', 'ult.idTicket') // <-- CORREGIDO
            ->join('ticketflujo as tf', function ($join) {
                $join->on('tf.idTicket', '=', 'ult.idTicket')
                    ->on('tf.fecha_creacion', '=', 'ult.ultima_fecha');
            })
            ->where('t.idClienteGeneral', $idClienteGeneral)
            ->where('tf.idEstadflujo', 7)
            ->count();

        /*
    =====================================
    % DEL TOTAL
    =====================================
    */
        $porcentajeTotal = $totalTickets > 0
            ? round(($cerrados / $totalTickets) * 100, 2)
            : 0;

        /*
    =====================================
    MES ACTUAL
    =====================================
    */
        $cerradosMesActual = DB::table('tickets as t')
            ->join(DB::raw('(
            SELECT idTicket, MAX(fecha_creacion) as ultima_fecha
            FROM ticketflujo
            GROUP BY idTicket
        ) ult'), 't.idTickets', '=', 'ult.idTicket') // <-- CORREGIDO
            ->join('ticketflujo as tf', function ($join) {
                $join->on('tf.idTicket', '=', 'ult.idTicket')
                    ->on('tf.fecha_creacion', '=', 'ult.ultima_fecha');
            })
            ->where('t.idClienteGeneral', $idClienteGeneral)
            ->where('tf.idEstadflujo', 7)
            ->where('t.fecha_creacion', '>=', $inicioMesActual)
            ->count();

        /*
    =====================================
    MES ANTERIOR
    =====================================
    */
        $cerradosMesAnterior = DB::table('tickets as t')
            ->join(DB::raw('(
            SELECT idTicket, MAX(fecha_creacion) as ultima_fecha
            FROM ticketflujo
            GROUP BY idTicket
        ) ult'), 't.idTickets', '=', 'ult.idTicket') // <-- CORREGIDO
            ->join('ticketflujo as tf', function ($join) {
                $join->on('tf.idTicket', '=', 'ult.idTicket')
                    ->on('tf.fecha_creacion', '=', 'ult.ultima_fecha');
            })
            ->where('t.idClienteGeneral', $idClienteGeneral)
            ->where('tf.idEstadflujo', 7)
            ->whereBetween('t.fecha_creacion', [$inicioMesAnterior, $finMesAnterior])
            ->count();

        /*
    =====================================
    % VS MES ANTERIOR
    =====================================
    */
        $variacionMes = $cerradosMesAnterior > 0
            ? round((($cerradosMesActual - $cerradosMesAnterior) / $cerradosMesAnterior) * 100, 2)
            : 0;

        return [
            "total_cerrados" => $cerrados,
            "porcentaje_total" => $porcentajeTotal,
            "variacion_mes_anterior" => $variacionMes
        ];
    }
    /**
     * TIEMPO PROMEDIO RESOLUCIÓN
     */
    public function getTiempoResolucion($idClienteGeneral)
    {
        $promedio = DB::table('tickets as t')

            // primer flujo
            ->join(DB::raw('(
            SELECT idTicket, MIN(fecha_creacion) as fecha_inicio
            FROM ticketflujo
            GROUP BY idTicket
        ) inicio'), 't.idTickets', '=', 'inicio.idTicket') // <-- CORREGIDO

            // ultimo flujo
            ->join(DB::raw('(
            SELECT idTicket, MAX(fecha_creacion) as fecha_fin
            FROM ticketflujo
            GROUP BY idTicket
        ) fin'), 't.idTickets', '=', 'fin.idTicket') // <-- CORREGIDO

            // obtener estado del ultimo flujo
            ->join('ticketflujo as tf', function ($join) {
                $join->on('tf.idTicket', '=', 'fin.idTicket')
                    ->on('tf.fecha_creacion', '=', 'fin.fecha_fin');
            })

            ->where('t.idClienteGeneral', $idClienteGeneral)
            ->where('tf.idEstadflujo', 7) // <-- cerrado

            ->avg(DB::raw('TIMESTAMPDIFF(HOUR, inicio.fecha_inicio, fin.fecha_fin)'));

        return round($promedio, 1);
    }
    /**
     * REINCIDENCIAS
     */
    public function getReincidencias($idClienteGeneral)
    {
        return DB::table('tickets')
            ->where('idClienteGeneral', $idClienteGeneral)
            ->whereIn('serie', function ($query) use ($idClienteGeneral) {
                $query->select('serie')
                    ->from('tickets')
                    ->where('idClienteGeneral', $idClienteGeneral)
                    ->whereNotNull('serie')
                    ->groupBy('serie')
                    ->havingRaw('COUNT(*) >= 2');
            })
            ->count();
    }
    public function getTicketsPorDia($idClienteGeneral)
    {
        return DB::table('tickets')
            ->select(
                DB::raw('DATE(fecha_creacion) as fecha'),
                DB::raw('COUNT(*) as total')
            )
            ->where('idClienteGeneral', $idClienteGeneral)
            ->where('fecha_creacion', '>=', Carbon::now()->subDays(30))
            ->groupBy(DB::raw('DATE(fecha_creacion)'))
            ->orderBy('fecha')
            ->get();
    }
    public function getTicketsPorMes($idClienteGeneral)
    {
        return DB::table('tickets')
            ->select(
                DB::raw('DATE_FORMAT(fecha_creacion,"%Y-%m") as mes'),
                DB::raw('COUNT(*) as total')
            )
            ->where('idClienteGeneral', $idClienteGeneral)
            ->where('fecha_creacion', '>=', Carbon::now()->subMonths(12))
            ->groupBy('mes')
            ->orderBy('mes')
            ->get();
    }
    public function getTicketsPorAnio($idClienteGeneral)
    {
        return DB::table('tickets')
            ->select(
                DB::raw('YEAR(fecha_creacion) as anio'),
                DB::raw('COUNT(*) as total')
            )
            ->where('idClienteGeneral', $idClienteGeneral)
            ->groupBy('anio')
            ->orderBy('anio')
            ->get();
    }
    /**
     * TENDENCIA DE TICKETS
     */
    public function getTendenciaTickets($idClienteGeneral)
    {
        return [
            "porDia" => $this->getTicketsPorDia($idClienteGeneral),
            "porMes" => $this->getTicketsPorMes($idClienteGeneral),
            "porAnio" => $this->getTicketsPorAnio($idClienteGeneral)
        ];
    }

    /**
     * TICKETS POR DISTRITO
     */
    public function getTicketsPorDistrito($idClienteGeneral)
    {
        // 1️⃣ Obtener tickets agrupados por distrito, corrigiendo collation
        $tickets = DB::table('tickets as t')
            ->join(
                'tickets_cliente_general as tcg',
                DB::raw('t.numero_ticket COLLATE utf8mb4_unicode_ci'),
                '=',
                DB::raw('tcg.numero_ticket COLLATE utf8mb4_unicode_ci')
            )
            ->where('t.idClienteGeneral', $idClienteGeneral)
            ->whereNotNull('tcg.distrito')
            ->select(
                'tcg.distrito as id_ubigeo',
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('tcg.distrito')
            ->orderByDesc('total')
            ->get();

        // 2️⃣ Cargar JSON de distritos
        $distritosJson = json_decode(file_get_contents(public_path('assets/ubigeos/distritos.json')), true);

        // 3️⃣ Mapear los nombres a los resultados
        $result = $tickets->map(function ($item) use ($distritosJson) {
            // Cada distrito en tu JSON está como array bajo la clave id_padre
            $nombre = $distritosJson[$item->id_ubigeo][0]['nombre_ubigeo'] ?? 'Desconocido';
            return [
                'id_ubigeo' => $item->id_ubigeo,
                'nombre_ubigeo' => $nombre,
                'total' => $item->total
            ];
        });

        return $result;
    }

    public function getFlujoTicketsPorEstado($idClienteGeneral)
    {
        return DB::table('tickets as t')

            // obtener ultimo flujo del ticket
            ->join(DB::raw('(
            SELECT idTicket, MAX(fecha_creacion) as ultima_fecha
            FROM ticketflujo
            GROUP BY idTicket
        ) ultimo'), 't.idTickets', '=', 'ultimo.idTicket') // <-- CORREGIDO

            // obtener ese registro
            ->join('ticketflujo as tf', function ($join) {
                $join->on('tf.idTicket', '=', 'ultimo.idTicket')
                    ->on('tf.fecha_creacion', '=', 'ultimo.ultima_fecha');
            })

            // obtener descripcion del estado
            ->join('estado_flujo as ef', 'tf.idEstadflujo', '=', 'ef.idEstadflujo')

            ->where('t.idClienteGeneral', $idClienteGeneral)

            ->select(
                'ef.descripcion',
                'ef.color',
                DB::raw('COUNT(*) as total')
            )

            ->groupBy('ef.descripcion', 'ef.color')

            ->orderByDesc('total')

            ->get();
    }
    public function getRendimientoPorTecnico($idClienteGeneral)
    {
        return DB::table('tickets as t')
            ->join('visitas as v', 't.idTickets', '=', 'v.idTickets') // <-- CORREGIDO
            ->join('usuarios as u', 'v.idUsuario', '=', 'u.idUsuario')
            ->where('t.idClienteGeneral', $idClienteGeneral)
            ->select(
                'u.idUsuario as idTecnico',
                DB::raw("CONCAT(u.Nombre,' ',u.apellidoPaterno,' ',u.apellidoMaterno) as tecnico"),
                DB::raw('COUNT(DISTINCT t.idTickets) as total_tickets'), // <-- CORREGIDO
                DB::raw('COUNT(DISTINCT DATE(t.fecha_creacion)) as dias_activos'),
                DB::raw('COUNT(DISTINCT DATE_FORMAT(t.fecha_creacion,"%Y-%m")) as meses_activos'),
                DB::raw('COUNT(DISTINCT YEAR(t.fecha_creacion)) as anios_activos'),
                DB::raw('SUM(
                CASE 
                    WHEN t.serie IN (
                        SELECT serie 
                        FROM tickets 
                        WHERE idClienteGeneral = ' . $idClienteGeneral . '
                        GROUP BY serie
                        HAVING COUNT(*) > 1
                    )
                THEN 1 ELSE 0 END
            ) as reincidencias'),
                DB::raw('SUM(
                CASE 
                    WHEN t.serie IN (
                        SELECT serie 
                        FROM tickets 
                        WHERE idClienteGeneral = ' . $idClienteGeneral . '
                        GROUP BY serie
                        HAVING COUNT(*) = 1
                    )
                THEN 1 ELSE 0 END
            ) as exitos'),
                DB::raw('ROUND(
                (
                    SUM(
                        CASE 
                            WHEN t.serie IN (
                                SELECT serie 
                                FROM tickets 
                                WHERE idClienteGeneral = ' . $idClienteGeneral . '
                                GROUP BY serie
                                HAVING COUNT(*) = 1
                            )
                        THEN 1 ELSE 0 END
                    ) / COUNT(DISTINCT t.idTickets)  -- <-- CORREGIDO
                ) * 100
            ,2) as tasa_exito')
            )
            ->groupBy(
                'u.idUsuario',
                'u.Nombre',
                'u.apellidoPaterno',
                'u.apellidoMaterno'
            )
            ->orderByDesc('total_tickets')
            ->get();
    }

    public function getRendimientoPersonal($idClienteGeneral)
    {
        // METAS (editables)
        $metaDiaria = 40;
        $metaSemanal = 200;
        $metaMensual = 800;

        $hoy = Carbon::today();
        $inicioSemana = Carbon::now()->startOfWeek();
        $inicioMes = Carbon::now()->startOfMonth();

        /*
    ============================
    CONTADORES DE TICKETS
    ============================
    */
        $ticketsDia = DB::table('tickets')
            ->where('idClienteGeneral', $idClienteGeneral)
            ->whereDate('fecha_creacion', $hoy)
            ->count();

        $ticketsSemana = DB::table('tickets')
            ->where('idClienteGeneral', $idClienteGeneral)
            ->whereBetween('fecha_creacion', [$inicioSemana, Carbon::now()])
            ->count();

        $ticketsMes = DB::table('tickets')
            ->where('idClienteGeneral', $idClienteGeneral)
            ->whereBetween('fecha_creacion', [$inicioMes, Carbon::now()])
            ->count();

        /*
    ============================
    PROMEDIO GENERAL POR TECNICO (HOY)
    ============================
    */
        $promedio = DB::table(function ($query) use ($idClienteGeneral, $hoy) {
            $query->from('tickets as t')
                ->join('visitas as v', 't.idTickets', '=', 'v.idTickets')
                ->select(
                    'v.idUsuario',
                    DB::raw('COUNT(DISTINCT t.idTickets) as total')
                )
                ->where('t.idClienteGeneral', $idClienteGeneral)
                ->whereDate('t.fecha_creacion', $hoy)
                ->groupBy('v.idUsuario');
        }, 'sub')
            ->avg('total');

        $promedio = round($promedio ?? 0, 1);

        /*
    ============================
    PODIO DIARIO
    ============================
    */
        $podio = DB::table('tickets as t')
            ->join('visitas as v', 't.idTickets', '=', 'v.idTickets') // <-- CORREGIDO
            ->join('usuarios as u', 'v.idUsuario', '=', 'u.idUsuario')
            ->where('t.idClienteGeneral', $idClienteGeneral)
            ->whereDate('t.fecha_creacion', $hoy)
            ->select(
                'u.idUsuario',
                DB::raw("CONCAT(u.Nombre,' ',u.apellidoPaterno) as tecnico"),
                DB::raw('COUNT(DISTINCT t.idTickets) as tickets'), // <-- CORREGIDO
                DB::raw('SUM(
                CASE 
                    WHEN t.serie IN (
                        SELECT serie
                        FROM tickets
                        WHERE idClienteGeneral = ' . $idClienteGeneral . '
                        GROUP BY serie
                        HAVING COUNT(*) = 1
                    )
                THEN 1 ELSE 0 END
            ) as exitos')
            )
            ->groupBy(
                'u.idUsuario',
                'u.Nombre',
                'u.apellidoPaterno'
            )
            ->orderByDesc('tickets')
            ->get()
            ->map(function ($item) use ($promedio) {
                $item->efectividad = $item->tickets > 0
                    ? round(($item->exitos / $item->tickets) * 100, 1)
                    : 0;
                $item->vs_promedio = $item->tickets - $promedio;
                return $item;
            });

        /*
    ============================
    RESULTADO
    ============================
    */
        return [
            "metas" => [
                "diaria" => $metaDiaria,
                "semanal" => $metaSemanal,
                "mensual" => $metaMensual
            ],
            "tickets" => [
                "dia" => $ticketsDia,
                "semana" => $ticketsSemana,
                "mes" => $ticketsMes
            ],
            "progreso" => [
                "dia" => round(($ticketsDia / $metaDiaria) * 100, 1),
                "semana" => round(($ticketsSemana / $metaSemanal) * 100, 1),
                "mes" => round(($ticketsMes / $metaMensual) * 100, 1)
            ],
            "promedio_diario" => $promedio,
            "podio_diario" => $podio
        ];
    }

    /**
     * ANALISIS DE REINCIDENCIAS
     */
    public function getAnalisisReincidencias($idClienteGeneral)
    {
        return Ticket::where('idClienteGeneral', $idClienteGeneral)
            ->select('serie', DB::raw('COUNT(*) as total'))
            ->groupBy('serie')
            ->having('total', '>', 1)
            ->get();
    }

    public function getTicketsMasDe1Visita($idClienteGeneral)
    {
        return DB::table('visitas as v')
            ->join('tickets as t', 't.idTickets', '=', 'v.idTickets') // <-- CORREGIDO
            ->where('t.idClienteGeneral', $idClienteGeneral)
            ->select('v.idTickets')
            ->groupBy('v.idTickets')
            ->havingRaw('COUNT(*) > 1')
            ->count();
    }
    /**
     * TECNICOS CON MAS REINCIDENCIAS
     */
    public function getTecnicosMasReincidencias($idClienteGeneral)
    {
        return DB::table('tickets as t')
            ->join('visitas as v', 't.idTickets', '=', 'v.idTickets') // <-- CORREGIDO
            ->join('usuarios as u', 'v.idUsuario', '=', 'u.idUsuario')
            ->where('t.idClienteGeneral', $idClienteGeneral)
            ->whereIn('t.serie', function ($q) use ($idClienteGeneral) {
                $q->select('serie')
                    ->from('tickets')
                    ->where('idClienteGeneral', $idClienteGeneral)
                    ->groupBy('serie')
                    ->havingRaw('COUNT(*) > 1');
            })
            ->select(
                'u.idUsuario',
                DB::raw("CONCAT(u.Nombre,' ',u.apellidoPaterno,' ',u.apellidoMaterno) as tecnico"),
                DB::raw('COUNT(DISTINCT t.idTickets) as reincidencias') // <-- CORREGIDO
            )
            ->groupBy(
                'u.idUsuario',
                'u.Nombre',
                'u.apellidoPaterno',
                'u.apellidoMaterno'
            )
            ->orderByDesc('reincidencias')
            ->limit(5)
            ->get();
    }
    /**
     * TASA DE EXITO
     */
    public function getTasaExito($idClienteGeneral)
    {
        // Tickets que tienen SOLO 1 visita
        $ticketsUnaVisita = DB::table('visitas')
            ->select('idTickets')
            ->groupBy('idTickets')
            ->havingRaw('COUNT(*) = 1');

        // Total de tickets con 1 visita
        $total = DB::table('tickets as t')
            ->joinSub($ticketsUnaVisita, 'v', function ($join) {
                $join->on('t.idTickets', '=', 'v.idTickets');
            })
            ->where('t.idClienteGeneral', $idClienteGeneral)
            ->count();

        // Tickets cerrados (ultimo flujo = 7)
        $cerrados = DB::table('tickets as t')
            ->joinSub($ticketsUnaVisita, 'v', function ($join) {
                $join->on('t.idTickets', '=', 'v.idTickets');
            })
            ->join(DB::raw('(
            SELECT idTicket, MAX(fecha_creacion) as ultima_fecha
            FROM ticketflujo
            GROUP BY idTicket
        ) ult'), 't.idTickets', '=', 'ult.idTicket')
            ->join('ticketflujo as tf', function ($join) {
                $join->on('tf.idTicket', '=', 'ult.idTicket')
                    ->on('tf.fecha_creacion', '=', 'ult.ultima_fecha');
            })
            ->where('t.idClienteGeneral', $idClienteGeneral)
            ->where('tf.idEstadflujo', 7) // <-- cerrado
            ->count();

        if ($total == 0) {
            return 0;
        }

        return round(($cerrados / $total) * 100, 2);
    }
}
