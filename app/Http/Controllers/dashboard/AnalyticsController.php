<?php

namespace App\Http\Controllers\dashboard;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Support\Facades\Log;

class AnalyticsController extends Controller
{
    private $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * Obtiene idClienteGeneral del usuario autenticado
     */
    private function getIdClienteGeneral()
    {
        $user = auth()->user();

        if (!$user) {
            Log::error('Usuario no autenticado');
            return null;
        }

        return $user->idClienteGeneral;
    }

    /**
     * Dashboard completo
     */
    public function dashboard()
    {
        $idClienteGeneral = $this->getIdClienteGeneral();

        if (!$idClienteGeneral) {
            return response()->json(['error' => 'Cliente no válido'], 403);
        }

        return response()->json(
            $this->dashboardService->getDashboard($idClienteGeneral)
        );
    }

    /**
     * Endpoints individuales (para widgets)
     */

    public function totalTickets()
    {
        return response()->json([
            'total' => $this->dashboardService->getTotalTickets($this->getIdClienteGeneral())
        ]);
    }

    public function ticketsCerrados()
    {
        return response()->json(
            $this->dashboardService->getTicketsCerrados($this->getIdClienteGeneral())
        );
    }

    public function tiempoResolucion()
    {
        return response()->json(
            $this->dashboardService->getTiempoResolucion($this->getIdClienteGeneral())
        );
    }

    public function reincidencias()
    {
        return response()->json(
            $this->dashboardService->getReincidencias($this->getIdClienteGeneral())
        );
    }

    public function tendenciaTickets()
    {
        return response()->json(
            $this->dashboardService->getTendenciaTickets($this->getIdClienteGeneral())
        );
    }

    public function ticketsPorDistrito()
    {
        return response()->json(
            $this->dashboardService->getTicketsPorDistrito($this->getIdClienteGeneral())
        );
    }

    public function flujoTicketsEstado()
    {
        return response()->json(
            $this->dashboardService->getFlujoTicketsPorEstado($this->getIdClienteGeneral())
        );
    }

    public function rendimientoTecnico()
    {
        return response()->json(
            $this->dashboardService->getRendimientoPorTecnico($this->getIdClienteGeneral())
        );
    }

    public function rendimientoPersonal()
    {
        return response()->json(
            $this->dashboardService->getRendimientoPersonal($this->getIdClienteGeneral())
        );
    }

    public function analisisReincidencias()
    {
        return response()->json(
            $this->dashboardService->getAnalisisReincidencias($this->getIdClienteGeneral())
        );
    }

    public function ticketsMas1Visita()
    {
        return response()->json(
            $this->dashboardService->getTicketsMasDe1Visita($this->getIdClienteGeneral())
        );
    }

    public function tecnicosMasReincidencias()
    {
        return response()->json(
            $this->dashboardService->getTecnicosMasReincidencias($this->getIdClienteGeneral())
        );
    }

    public function tasaExito()
    {
        return response()->json(
            $this->dashboardService->getTasaExito($this->getIdClienteGeneral())
        );
    }
}