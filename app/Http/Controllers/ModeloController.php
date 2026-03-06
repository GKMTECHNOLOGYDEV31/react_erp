<?php
// app/Http/Controllers/ModeloController.php

namespace App\Http\Controllers;

use App\Models\Modelo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ModeloController extends Controller
{
    public function index()
    {
        try {
            $modelos = Modelo::with('marca')
                ->where('estado', 1)
                ->select('idModelo', 'nombre', 'idMarca', 'idCategoria', 'estado')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $modelos
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener modelos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nombre' => 'required|string|max:255',
                'idMarca' => 'required|exists:marca,idMarca',
                'idCategoria' => 'required|exists:categoria,idCategoria',
                'estado' => 'sometimes|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $modelo = Modelo::create([
                'nombre' => $request->nombre,
                'idMarca' => $request->idMarca,
                'idCategoria' => $request->idCategoria,
                'estado' => $request->estado ?? 1,
                'producto' => $request->producto ?? 0,
                'repuesto' => $request->repuesto ?? 0,
                'heramientas' => $request->heramientas ?? 0,
                'suministros' => $request->suministros ?? 0,
                'pulgadas' => $request->pulgadas ?? ''
            ]);

            // Cargar la relación de marca
            $modelo->load('marca');

            return response()->json([
                'success' => true,
                'message' => 'Modelo creado exitosamente',
                'data' => [
                    'idModelo' => $modelo->idModelo,
                    'nombre' => $modelo->nombre,
                    'idMarca' => $modelo->idMarca,
                    'marca' => $modelo->marca ? ['idMarca' => $modelo->marca->idMarca, 'nombre' => $modelo->marca->nombre] : null,
                    'idCategoria' => $modelo->idCategoria,
                    'estado' => $modelo->estado
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear modelo',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}