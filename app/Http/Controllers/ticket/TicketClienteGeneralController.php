<?php
// D:\XAM\htdocs\react_erp\app\Http\Controllers\ticket\TicketClienteGeneralController.php

namespace App\Http\Controllers\ticket;

use App\Http\Controllers\Controller;
use App\Models\TicketClienteGeneral;
use App\Models\TipoDocumento;
use App\Models\Categoria;
use App\Models\Categorium;
use App\Models\Modelo;
use App\Models\Marca;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class TicketClienteGeneralController extends Controller
{
    /**
     * Display a listing of the resource.
     */
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

        $tickets = TicketClienteGeneral::with(['tipoDocumento', 'categoria', 'modelo', 'usuarioCreador'])
            ->where('idClienteGeneral', $user->idClienteGeneral) // Filtrar por el cliente del usuario
            ->orderBy('idTicket', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $tickets
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error al obtener tickets',
            'error' => $e->getMessage()
        ], 500);
    }
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Validar los datos
            $validator = Validator::make($request->all(), [
                // Datos personales
                'nombreCompleto' => 'required|string|max:255',
                'correoElectronico' => 'required|email|max:255',
                'idTipoDocumento' => 'required|exists:tipodocumento,idTipoDocumento',
                'dni_ruc_ce' => 'required|string|max:20',
                'telefonoCelular' => 'required|string|max:20',
                'telefonoFijo' => 'nullable|string|max:20',

                // Dirección
                'direccionCompleta' => 'required|string',
                'referenciaDomicilio' => 'nullable|string',
                'departamento' => 'required|string|max:100',
                'provincia' => 'required|string|max:100',
                'distrito' => 'required|string|max:100',

                // Producto
                'idCategoria' => 'required|exists:categoria,idCategoria',
                'idModelo' => 'required|exists:modelo,idModelo',
                'serieProducto' => 'required|string|max:100',
                'detallesFalla' => 'required|string',

                // Compra
                'fechaCompra' => 'required|date|before_or_equal:today',
                'tiendaSedeCompra' => 'required|string|max:255',

                // Evidencias (archivos)
                'fotoVideoFalla' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
                'fotoBoletaFactura' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
                'fotoNumeroSerie' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',

                // Ubicación
                'ubicacionGoogleMaps' => 'nullable|url|max:500'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            // Obtener el usuario autenticado
            $user = auth()->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            // Verificar que el usuario tenga idClienteGeneral
            if (!$user->idClienteGeneral) {
                return response()->json([
                    'success' => false,
                    'message' => 'El usuario no tiene un ID de cliente general asignado'
                ], 400);
            }

            // Obtener el id del usuario creador
            $idUsuarioCreador = $user->idUsuario;

            // Generar número de ticket
            $numeroTicket = $this->generarNumeroTicket();

            // Procesar imágenes si se subieron
            $fotoVideoFalla = $this->subirImagen($request->file('fotoVideoFalla'), 'fallas');
            $fotoBoletaFactura = $this->subirImagen($request->file('fotoBoletaFactura'), 'boletas');
            $fotoNumeroSerie = $this->subirImagen($request->file('fotoNumeroSerie'), 'series');

            // Crear el ticket
            $ticket = TicketClienteGeneral::create([
                'numero_ticket' => $numeroTicket,
                'nombreCompleto' => $request->nombreCompleto,
                'correoElectronico' => $request->correoElectronico,
                'idTipoDocumento' => $request->idTipoDocumento,
                'dni_ruc_ce' => $request->dni_ruc_ce,
                'telefonoCelular' => $request->telefonoCelular,
                'telefonoFijo' => $request->telefonoFijo,
                'direccionCompleta' => $request->direccionCompleta,
                'referenciaDomicilio' => $request->referenciaDomicilio,
                'departamento' => $request->departamento,
                'provincia' => $request->provincia,
                'distrito' => $request->distrito,
                'idCategoria' => $request->idCategoria,
                'idModelo' => $request->idModelo,
                'serieProducto' => $request->serieProducto,
                'detallesFalla' => $request->detallesFalla,
                'fechaCompra' => $request->fechaCompra,
                'tiendaSedeCompra' => $request->tiendaSedeCompra,
                'fotoVideoFalla' => $fotoVideoFalla ?? $request->fotoVideoFalla,
                'fotoBoletaFactura' => $fotoBoletaFactura ?? $request->fotoBoletaFactura,
                'fotoNumeroSerie' => $fotoNumeroSerie ?? $request->fotoNumeroSerie,
                'ubicacionGoogleMaps' => $request->ubicacionGoogleMaps,
                'estado' => 1,
                'idUsuarioCreador' => $idUsuarioCreador,
                'idClienteGeneral' => $user->idClienteGeneral,
                'fechaCreacion' => now()
            ]);

            // Cargar relaciones
            $ticket->load(['tipoDocumento', 'categoria', 'modelo', 'usuarioCreador']);

            return response()->json([
                'success' => true,
                'message' => 'Ticket creado exitosamente',
                'data' => $ticket
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el ticket',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $ticket = TicketClienteGeneral::with(['tipoDocumento', 'categoria', 'modelo', 'usuarioCreador'])
                ->find($id);

            if (!$ticket) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ticket no encontrado'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $ticket
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el ticket',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $ticket = TicketClienteGeneral::find($id);

            if (!$ticket) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ticket no encontrado'
                ], 404);
            }

            // Validar los datos
            $validator = Validator::make($request->all(), [
                'nombreCompleto' => 'sometimes|required|string|max:255',
                'correoElectronico' => 'sometimes|required|email|max:255',
                'idTipoDocumento' => 'sometimes|required|exists:tipodocumento,idTipoDocumento',
                'dni_ruc_ce' => 'sometimes|required|string|max:20',
                'telefonoCelular' => 'sometimes|required|string|max:20',
                'telefonoFijo' => 'nullable|string|max:20',
                'direccionCompleta' => 'sometimes|required|string',
                'referenciaDomicilio' => 'nullable|string',
                'departamento' => 'sometimes|required|string|max:100',
                'provincia' => 'sometimes|required|string|max:100',
                'distrito' => 'sometimes|required|string|max:100',
                'idCategoria' => 'sometimes|required|exists:categoria,idCategoria',
                'idModelo' => 'sometimes|required|exists:modelo,idModelo',
                'serieProducto' => 'sometimes|required|string|max:100',
                'detallesFalla' => 'sometimes|required|string',
                'fechaCompra' => 'sometimes|required|date|before_or_equal:today',
                'tiendaSedeCompra' => 'sometimes|required|string|max:255',
                'fotoVideoFalla' => 'nullable|url|max:500',
                'fotoBoletaFactura' => 'nullable|url|max:500',
                'fotoNumeroSerie' => 'nullable|url|max:500',
                'ubicacionGoogleMaps' => 'nullable|url|max:500',
                'estado' => 'sometimes|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            // Actualizar el ticket
            $ticket->update($request->all());

            // Cargar relaciones para la respuesta
            $ticket->load(['tipoDocumento', 'categoria', 'modelo', 'usuarioCreador']);

            return response()->json([
                'success' => true,
                'message' => 'Ticket actualizado exitosamente',
                'data' => $ticket
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el ticket',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $ticket = TicketClienteGeneral::find($id);

            if (!$ticket) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ticket no encontrado'
                ], 404);
            }

            // Soft delete o eliminación física
            $ticket->delete();

            return response()->json([
                'success' => true,
                'message' => 'Ticket eliminado exitosamente'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el ticket',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get data for form selects (categorías, modelos, tipos de documento)
     */
    public function getFormData()
    {
        try {
            $data = [
                'tiposDocumento' => TipoDocumento::all(),
                'categorias' => Categorium::where('estado', 1)->get(),
                'modelos' => Modelo::where('estado', 1)->get()
            ];

            return response()->json([
                'success' => true,
                'data' => $data
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener datos del formulario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get modelos by categoria
     */
    public function getModelosByCategoria($idCategoria)
    {
        try {
            $modelos = Modelo::where('idCategoria', $idCategoria)
                ->where('estado', 1)
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

    /**
     * Upload images endpoint
     */
    public function upload(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120',
                'tipo' => 'required|string|in:fallas,boletas,series'
            ]);

            $file = $request->file('file');
            $tipo = $request->tipo;
            
            $nombre = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs("public/tickets/{$tipo}", $nombre);
            
            $url = asset(str_replace('public', 'storage', $path));

            return response()->json([
                'success' => true,
                'url' => $url
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al subir el archivo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generar número de ticket automático
     */
    private function generarNumeroTicket()
    {
        $ultimoTicket = TicketClienteGeneral::orderBy('idTicket', 'desc')->first();
        $numero = $ultimoTicket ? intval(substr($ultimoTicket->numero_ticket, -6)) + 1 : 1;
        return 'TKT-' . str_pad($numero, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Subir imagen al servidor
     */
    private function subirImagen($file, $carpeta)
    {
        if (!$file) {
            return null;
        }

        $nombre = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $ruta = $file->storeAs("public/tickets/{$carpeta}", $nombre);
        
        return asset(str_replace('public', 'storage', $ruta));
    }
}