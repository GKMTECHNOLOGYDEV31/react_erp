<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\login\AuthController;
use App\Http\Controllers\ticket\TicketClienteGeneralController;

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
    // CRUD de tickets
    Route::get('tickets', [TicketClienteGeneralController::class, 'index']);
    Route::post('tickets', [TicketClienteGeneralController::class, 'store']);
    Route::get('tickets/{id}', [TicketClienteGeneralController::class, 'show']);
    Route::put('tickets/{id}', [TicketClienteGeneralController::class, 'update']);
    Route::delete('tickets/{id}', [TicketClienteGeneralController::class, 'destroy']);
    
    // Datos auxiliares para formularios
    Route::get('tickets-form-data', [TicketClienteGeneralController::class, 'getFormData']);
    Route::get('modelos-por-categoria/{idCategoria}', [TicketClienteGeneralController::class, 'getModelosByCategoria']);
});