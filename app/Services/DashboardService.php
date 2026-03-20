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
        $inicioMesActual = now()->startOfMonth();
        $inicioMesAnterior = now()->subMonth()->startOfMonth();
        $finMesAnterior = now()->subMonth()->endOfMonth();

        /*
    =====================================
    BASE: ÚLTIMO FLUJO POR TICKET
    =====================================
    */
        $base = DB::table('tickets as t')
            ->joinSub(
                DB::table('ticketflujo')
                    ->select('idTicket', DB::raw('MAX(fecha_creacion) as ultima_fecha'))
                    ->groupBy('idTicket'),
                'ult',
                function ($join) {
                    $join->on('t.idTickets', '=', 'ult.idTicket');
                }
            )
            ->join('ticketflujo as tf', function ($join) {
                $join->on('tf.idTicket', '=', 'ult.idTicket')
                    ->on('tf.fecha_creacion', '=', 'ult.ultima_fecha');
            })
            ->where('t.idClienteGeneral', $idClienteGeneral)
            ->whereIn('tf.idEstadflujo', [4, 7]);

        /*
    =====================================
    TOTAL TICKETS
    =====================================
    */
        $totalTickets = DB::table('tickets')
            ->where('idClienteGeneral', $idClienteGeneral)
            ->count();

        /*
    =====================================
    TOTAL CERRADOS
    =====================================
    */
        $cerrados = (clone $base)->count();

        /*
    =====================================
    MES ACTUAL
    =====================================
    */
        $cerradosMesActual = (clone $base)
            ->where('t.fecha_creacion', '>=', $inicioMesActual)
            ->count();

        /*
    =====================================
    MES ANTERIOR
    =====================================
    */
        $cerradosMesAnterior = (clone $base)
            ->whereBetween('t.fecha_creacion', [$inicioMesAnterior, $finMesAnterior])
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
    VARIACIÓN MES
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
        $inicioMesActual = now()->startOfMonth();
        $inicioMesAnterior = now()->subMonth()->startOfMonth();
        $finMesAnterior = now()->subMonth()->endOfMonth();

        /*
    =====================================
    BASE: INICIO + FIN + ESTADO FINAL
    =====================================
    */
        $base = DB::table('tickets as t')
            ->joinSub(
                DB::table('ticketflujo')
                    ->select('idTicket', DB::raw('MIN(fecha_creacion) as fecha_inicio'))
                    ->groupBy('idTicket'),
                'inicio',
                fn($join) => $join->on('t.idTickets', '=', 'inicio.idTicket')
            )
            ->joinSub(
                DB::table('ticketflujo')
                    ->select('idTicket', DB::raw('MAX(fecha_creacion) as fecha_fin'))
                    ->groupBy('idTicket'),
                'fin',
                fn($join) => $join->on('t.idTickets', '=', 'fin.idTicket')
            )
            ->join('ticketflujo as tf', function ($join) {
                $join->on('tf.idTicket', '=', 'fin.idTicket')
                    ->on('tf.fecha_creacion', '=', 'fin.fecha_fin');
            })
            ->where('t.idClienteGeneral', $idClienteGeneral)
            ->whereIn('tf.idEstadflujo', [4, 7]); // ✅ cerrado correcto

        /*
    =====================================
    PROMEDIO MES ACTUAL
    =====================================
    */
        $promedioActual = (clone $base)
            ->where('t.fecha_creacion', '>=', $inicioMesActual)
            ->avg(DB::raw('TIMESTAMPDIFF(HOUR, inicio.fecha_inicio, fin.fecha_fin)'));

        /*
    =====================================
    PROMEDIO MES ANTERIOR
    =====================================
    */
        $promedioAnterior = (clone $base)
            ->whereBetween('t.fecha_creacion', [$inicioMesAnterior, $finMesAnterior])
            ->avg(DB::raw('TIMESTAMPDIFF(HOUR, inicio.fecha_inicio, fin.fecha_fin)'));

        /*
    =====================================
    VARIACIÓN EN HORAS
    =====================================
    */
        $variacionHoras = 0;

        if (!is_null($promedioAnterior)) {
            $variacionHoras = round(($promedioActual ?? 0) - $promedioAnterior, 1);
        }

        return [
            "promedio_horas" => round($promedioActual ?? 0, 1),
            "variacion_horas" => $variacionHoras
        ];
    }
    /**
     * REINCIDENCIAS
     */
    public function getReincidencias($idClienteGeneral)
    {
        $inicioMesActual = now()->startOfMonth();
        $inicioMesAnterior = now()->subMonth()->startOfMonth();
        $finMesAnterior = now()->subMonth()->endOfMonth();

        /*
    =====================================
    BASE: SERIES CON TOTAL DE TICKETS
    =====================================
    */
        $series = DB::table('tickets')
            ->select('serie', DB::raw('COUNT(*) as total'))
            ->where('idClienteGeneral', $idClienteGeneral)
            ->whereNotNull('serie')
            ->where('serie', '<>', '')
            ->groupBy('serie');

        /*
    =====================================
    TOTALES (POR TICKETS)
    =====================================
    */
        $totales = DB::query()
            ->fromSub($series, 's')
            ->selectRaw('
            SUM(CASE WHEN total = 1 THEN total ELSE 0 END) as tickets_unicos,
            SUM(CASE WHEN total >= 2 THEN total ELSE 0 END) as tickets_reincidencias
        ')
            ->first();

        $ticketsUnicos = $totales->tickets_unicos ?? 0;
        $ticketsReincidencias = $totales->tickets_reincidencias ?? 0;

        /*
    =====================================
    % REINCIDENCIAS (VS TOTAL CON SERIE)
    =====================================
    */
        $totalConSerie = $ticketsUnicos + $ticketsReincidencias;

        $porcentajeReincidencias = $totalConSerie > 0
            ? round(($ticketsReincidencias / $totalConSerie) * 100, 2)
            : 0;

        /*
    =====================================
    MES ACTUAL
    =====================================
    */
        $seriesMesActual = DB::table('tickets')
            ->select('serie', DB::raw('COUNT(*) as total'))
            ->where('idClienteGeneral', $idClienteGeneral)
            ->whereNotNull('serie')
            ->where('serie', '<>', '')
            ->where('fecha_creacion', '>=', $inicioMesActual)
            ->groupBy('serie');

        $mesActual = DB::query()
            ->fromSub($seriesMesActual, 's')
            ->selectRaw('SUM(CASE WHEN total >= 2 THEN total ELSE 0 END) as total')
            ->first();

        $reincidenciasMesActual = $mesActual->total ?? 0;

        /*
    =====================================
    MES ANTERIOR
    =====================================
    */
        $seriesMesAnterior = DB::table('tickets')
            ->select('serie', DB::raw('COUNT(*) as total'))
            ->where('idClienteGeneral', $idClienteGeneral)
            ->whereNotNull('serie')
            ->where('serie', '<>', '')
            ->whereBetween('fecha_creacion', [$inicioMesAnterior, $finMesAnterior])
            ->groupBy('serie');

        $mesAnterior = DB::query()
            ->fromSub($seriesMesAnterior, 's')
            ->selectRaw('SUM(CASE WHEN total >= 2 THEN total ELSE 0 END) as total')
            ->first();

        $reincidenciasMesAnterior = $mesAnterior->total ?? 0;

        /*
    =====================================
    VARIACIÓN %
    =====================================
    */
        $variacion = $reincidenciasMesAnterior > 0
            ? round((($reincidenciasMesActual - $reincidenciasMesAnterior) / $reincidenciasMesAnterior) * 100, 2)
            : 0;

        return [
            "tickets_reincidencias" => $ticketsReincidencias,
            "tickets_unicos" => $ticketsUnicos,
            "porcentaje_reincidencias" => $porcentajeReincidencias,
            "variacion_mes_anterior" => $variacion
        ];
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

    private function mapUbigeo($tickets)
    {
        $distritosJson = json_decode(
            file_get_contents(public_path('assets/ubigeos/distritos.json')),
            true
        );

        return $tickets->map(function ($item) use ($distritosJson) {

            $nombre = 'Desconocido';

            foreach ($distritosJson as $provincia => $distritos) {
                foreach ($distritos as $dist) {

                    if ($dist['id_ubigeo'] == $item->distrito) {
                        $nombre = $dist['nombre_ubigeo'];
                        break 2; // salir de ambos foreach
                    }
                }
            }

            return [
                'id_ubigeo' => $item->distrito,
                'nombre_ubigeo' => $nombre,
                'total' => $item->total
            ];
        });
    }
    /**
     * TICKETS POR DISTRITO
     */
    public function getTicketsPorDistrito($idClienteGeneral)
    {
        // 1️⃣ PRIMERO: intentar con tickets_cliente_general
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
                'tcg.distrito as distrito',
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('tcg.distrito')
            ->orderByDesc('total')
            ->get();

        // 🔥 SI HAY DATOS → devolver directo
        if ($tickets->isNotEmpty()) {
            return $this->mapUbigeo($tickets);
        }

        // 2️⃣ VALIDAR SI CLIENTE ES TIENDA
        $cliente = DB::table('cliente')
            ->where('idCliente', $idClienteGeneral)
            ->first();

        // ⚠️ Validación flexible (1, "1", true, etc.)
        $esTienda = isset($cliente->esTienda) && (
            $cliente->esTienda == 1 ||
            $cliente->esTienda === '1' ||
            strtolower($cliente->esTienda) === 'si'
        );

        // 3️⃣ SI ES TIENDA → usar cliente
        if ($esTienda) {

            $tickets = DB::table('tickets as t')
                ->join('cliente as c', 'c.idCliente', '=', 't.idClienteGeneral')
                ->where('t.idClienteGeneral', $idClienteGeneral)
                ->whereNotNull('c.distrito')
                ->select(
                    'c.distrito as distrito',
                    DB::raw('COUNT(*) as total')
                )
                ->groupBy('c.distrito')
                ->orderByDesc('total')
                ->get();
        } else {

            // 4️⃣ SI NO ES TIENDA → usar tienda
            $tickets = DB::table('tickets as t')
                ->join('tienda as td', 'td.idTienda', '=', 't.idTienda')
                ->where('t.idClienteGeneral', $idClienteGeneral)
                ->whereNotNull('td.distrito')
                ->select(
                    'td.distrito as distrito',
                    DB::raw('COUNT(*) as total')
                )
                ->groupBy('td.distrito')
                ->orderByDesc('total')
                ->get();
        }

        return $this->mapUbigeo($tickets);
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
        // Fechas
        $hoy = Carbon::today();
        $inicioSemana = Carbon::now()->startOfWeek();
        $inicioMes = Carbon::now()->startOfMonth();

        // 🔹 Función helper para construir la query
        $queryTecnicos = function ($start = null, $end = null) use ($idClienteGeneral) {
            $query = DB::table('tickets as t')
                ->join('visitas as v', 't.idTickets', '=', 'v.idTickets')
                ->join('usuarios as u', 'v.idUsuario', '=', 'u.idUsuario')
                ->where('t.idClienteGeneral', $idClienteGeneral);

            if ($start && $end) {
                $query->whereBetween('t.fecha_creacion', [$start, $end]);
            } elseif ($start) {
                $query->whereDate('t.fecha_creacion', $start);
            }

            return $query->select(
                'u.idUsuario as idTecnico',
                DB::raw("CONCAT(u.Nombre,' ',u.apellidoPaterno,' ',u.apellidoMaterno) as tecnico"),
                DB::raw('COUNT(DISTINCT t.idTickets) as total_tickets'),
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
                    ) / COUNT(DISTINCT t.idTickets)
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
        };

        // 🔹 Ejecutar para cada periodo
        $dia = $queryTecnicos($hoy);
        $semana = $queryTecnicos($inicioSemana->startOfDay(), Carbon::now()->endOfDay());
        $mes = $queryTecnicos($inicioMes->startOfDay(), Carbon::now()->endOfDay());

        return [
            'dia' => $dia,
            'semana' => $semana,
            'mes' => $mes
        ];
    }

    public function getRendimientoPersonal($idClienteGeneral)
    {
        $metaDiaria = 40;
        $metaSemanal = 200;
        $metaMensual = 800;

        $hoy = Carbon::today();
        $inicioSemana = Carbon::now()->startOfWeek();
        $inicioMes = Carbon::now()->startOfMonth();

        // ============================
        // CONTADORES DE TICKETS
        // ============================
        $ticketsDia = DB::table('tickets')
            ->where('idClienteGeneral', $idClienteGeneral)
            ->whereDate('fecha_creacion', $hoy)
            ->count();

        $ticketsSemana = DB::table('tickets')
            ->where('idClienteGeneral', $idClienteGeneral)
            ->whereBetween('fecha_creacion', [$inicioSemana->startOfDay(), Carbon::now()->endOfDay()])
            ->count();

        $ticketsMes = DB::table('tickets')
            ->where('idClienteGeneral', $idClienteGeneral)
            ->whereBetween('fecha_creacion', [$inicioMes->startOfDay(), Carbon::now()->endOfDay()])
            ->count();

        // ============================
        // PROMEDIO GENERAL POR TECNICO (HOY)
        // ============================
        $promedio = DB::table(function ($query) use ($idClienteGeneral, $hoy) {
            $query->from('tickets as t')
                ->join('visitas as v', 't.idTickets', '=', 'v.idTickets')
                ->where('t.idClienteGeneral', $idClienteGeneral)
                ->whereDate('t.fecha_creacion', $hoy)
                ->select('v.idUsuario', DB::raw('COUNT(DISTINCT t.idTickets) as total'))
                ->groupBy('v.idUsuario');
        }, 'sub')
            ->avg('total');

        $promedio = round($promedio ?? 0, 1);

        // ============================
        // PODIO DIARIO
        // ============================
        $podio = DB::table('tickets as t')
            ->join('visitas as v', 't.idTickets', '=', 'v.idTickets')
            ->join('usuarios as u', 'v.idUsuario', '=', 'u.idUsuario')
            ->where('t.idClienteGeneral', $idClienteGeneral)
            ->whereDate('t.fecha_creacion', $hoy)
            ->select(
                'u.idUsuario as idTecnico',
                DB::raw("CONCAT(u.Nombre,' ',u.apellidoPaterno,' ',u.apellidoMaterno) as tecnico"),
                DB::raw('COUNT(DISTINCT t.idTickets) as tickets'),
                DB::raw('SUM(
                CASE 
                    WHEN t.serie IN (
                        SELECT serie 
                        FROM tickets
                        WHERE idClienteGeneral = ' . $idClienteGeneral . '
                        AND DATE(fecha_creacion) = CURDATE()
                        GROUP BY serie
                        HAVING COUNT(*) = 1
                    )
                THEN 1 ELSE 0 END
            ) as exitos'),
                DB::raw('SUM(
                CASE 
                    WHEN t.serie IN (
                        SELECT serie 
                        FROM tickets
                        WHERE idClienteGeneral = ' . $idClienteGeneral . '
                        AND DATE(fecha_creacion) = CURDATE()
                        GROUP BY serie
                        HAVING COUNT(*) > 1
                    )
                THEN 1 ELSE 0 END
            ) as reincidencias'),
                DB::raw('ROUND(
                (SUM(
                    CASE 
                        WHEN t.serie IN (
                            SELECT serie 
                            FROM tickets
                            WHERE idClienteGeneral = ' . $idClienteGeneral . '
                            AND DATE(fecha_creacion) = CURDATE()
                            GROUP BY serie
                            HAVING COUNT(*) = 1
                        )
                    THEN 1 ELSE 0 END
                ) / COUNT(DISTINCT t.idTickets)) * 100
            ,2) as tasa_exito')
            )
            ->groupBy('u.idUsuario', 'u.Nombre', 'u.apellidoPaterno', 'u.apellidoMaterno')
            ->orderByDesc('tickets')
            ->get();

        // ============================
        // RESULTADO FINAL
        // ============================
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
                "dia" => $metaDiaria > 0 ? round(($ticketsDia / $metaDiaria) * 100, 1) : 0,
                "semana" => $metaSemanal > 0 ? round(($ticketsSemana / $metaSemanal) * 100, 1) : 0,
                "mes" => $metaMensual > 0 ? round(($ticketsMes / $metaMensual) * 100, 1) : 0
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

        // Tickets completados en 1 visita (último flujo = 7)
        $completados = DB::table('tickets as t')
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
            ->where('tf.idEstadflujo', 7) // cerrado
            ->count();

        if ($total == 0) {
            return [
                'tasa_exito' => 0,
                'tickets_completados' => 0,
            ];
        }

        return [
            'tasa_exito' => round(($completados / $total) * 100, 2),
            'tickets_completados' => $completados,
        ];
    }
}
