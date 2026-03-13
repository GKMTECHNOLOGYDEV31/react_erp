<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\login\AuthController;
use App\Http\Controllers\ticket\TicketClienteGeneralController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ModeloController;
use App\Http\Controllers\MarcaController;
use App\Http\Controllers\dashboard\AnalyticsController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    // Obtener datos del cliente general del usuario autenticado
    Route::get('/mi-cliente-general', [AuthController::class, 'getMiClienteGeneral']);

    // Tus otras rutas protegidas...
    // Route::get('tickets', [TicketController::class, 'index']);
    // etc...
});

Route::middleware('auth:sanctum')->group(function () {
    // CRUD de tickets
    Route::get('tickets', [TicketClienteGeneralController::class, 'index']);
    Route::post('tickets', [TicketClienteGeneralController::class, 'store']);
    Route::get('tickets/{id}', [TicketClienteGeneralController::class, 'show']);
    Route::put('tickets/{id}', [TicketClienteGeneralController::class, 'update']);
    Route::delete('tickets/{id}', [TicketClienteGeneralController::class, 'destroy']);

    // Datos auxiliares para formularios
    Route::get('tickets-form-data', [TicketClienteGeneralController::class, 'getFormData']);
    Route::get('modelos-por-categoria/{idCategoria}', [TicketClienteGeneralController::class, 'getModelosByCategoria']);
    Route::get('/tickets/consultar-completo/{numeroTicket}', [TicketClienteGeneralController::class, 'consultarTicketCompleto']);
});
// routes/api.php
Route::prefix('analytics')->group(function () {
    Route::get('/dashboard', [AnalyticsController::class, 'dashboard']);
    Route::get('/tickets-por-dia', [AnalyticsController::class, 'ticketsPorDia']);
    Route::get('/tickets-por-categoria', [AnalyticsController::class, 'ticketsPorCategoria']);
    Route::get('/tickets-por-modelo', [AnalyticsController::class, 'ticketsPorModelo']);
    Route::get('/tickets-por-tipo-documento', [AnalyticsController::class, 'ticketsPorTipoDocumento']);
    Route::get('/tickets-por-departamento', [AnalyticsController::class, 'ticketsPorDepartamento']);
    Route::get('/tickets-por-tienda', [AnalyticsController::class, 'ticketsPorTienda']);
    Route::get('/tickets-por-hora', [AnalyticsController::class, 'ticketsPorHora']);
    Route::get('/ultimos-tickets', [AnalyticsController::class, 'ultimosTickets']);
    Route::get('/metricas-detalladas', [AnalyticsController::class, 'metricasDetalladas']);
});

// Rutas protegidas con autenticación
Route::middleware('auth:sanctum')->group(function () {

    Route::apiResource('categorias', CategoriaController::class)->only(['index', 'store']);
    Route::apiResource('modelos', ModeloController::class)->only(['index', 'store']);
    Route::get('marcas', [MarcaController::class, 'index']);
    Route::get('marcas', [TicketClienteGeneralController::class, 'getMarcas']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/clientes-generales/{id}', [TicketClienteGeneralController::class, 'show']);
});
