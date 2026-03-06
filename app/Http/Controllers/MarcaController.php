<?php
// app/Http/Controllers/MarcaController.php

namespace App\Http\Controllers;

use App\Models\Marca;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MarcaController extends Controller
{
    public function index()
    {
        try {
            $user = auth()->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            // Obtener marcas asociadas al cliente general del usuario
            $marcas = Marca::select('idMarca', 'nombre', 'estado')
                ->whereHas('clientesGenerales', function($query) use ($user) {
                    $query->where('idClienteGeneral', $user->idClienteGeneral);
                })
                ->where('estado', 1)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $marcas
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener marcas',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}