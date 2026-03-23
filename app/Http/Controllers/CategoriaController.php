<?php
// app/Http/Controllers/CategoriaController.php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Categorium;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoriaController extends Controller
{
    public function index()
    {
        try {
            $categorias = Categorium::where('estado', 1)
                ->select('idCategoria', 'nombre', 'estado')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $categorias
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener categorías',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nombre' => 'required|string|max:255|unique:categoria,nombre'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $categoria = Categorium::create([
                'nombre' => $request->nombre,
                'estado' => 1
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'idCategoria' => $categoria->idCategoria,
                    'nombre' => $categoria->nombre,
                    'estado' => $categoria->estado
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear categoría',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
