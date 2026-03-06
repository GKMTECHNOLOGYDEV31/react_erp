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
use App\Models\MarcaClientegeneral;
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

public function getFormData()
{
    try {
        $user = auth()->user();
        
        \Log::info('=== INICIO getFormData ===');
        \Log::info('Usuario autenticado:', [
            'idUsuario' => $user ? $user->idUsuario : null,
            'nombre' => $user ? $user->Nombre : null,
            'idClienteGeneral' => $user ? $user->idClienteGeneral : null
        ]);
        
        if (!$user) {
            \Log::error('Usuario no autenticado en getFormData');
            return response()->json([
                'success' => false,
                'message' => 'Usuario no autenticado'
            ], 401);
        }

        // Verificar que el usuario tenga idClienteGeneral
        if (!$user->idClienteGeneral) {
            \Log::error('Usuario sin idClienteGeneral:', [
                'idUsuario' => $user->idUsuario,
                'nombre' => $user->Nombre
            ]);
            return response()->json([
                'success' => false,
                'message' => 'El usuario no tiene un cliente general asignado'
            ], 400);
        }

        // Obtener todas las marcas asociadas al cliente general del usuario
        \Log::info('Buscando marcas para cliente general:', [
            'idClienteGeneral' => $user->idClienteGeneral
        ]);
        
        $marcasCliente = MarcaClienteGeneral::where('idClienteGeneral', $user->idClienteGeneral)
            ->pluck('idMarca')
            ->toArray();

        \Log::info('Marcas encontradas:', [
            'cantidad' => count($marcasCliente),
            'marcas' => $marcasCliente
        ]);

        // Obtener tipos de documento (seleccionando solo campos necesarios)
        $tiposDocumento = TipoDocumento::select('idTipoDocumento', 'nombre')->get();
        \Log::info('Tipos de documento:', [
            'cantidad' => $tiposDocumento->count()
        ]);

        // Obtener categorías (seleccionando solo campos necesarios)
        $categorias = Categorium::where('estado', 1)
            ->select('idCategoria', 'nombre', 'estado')
            ->get();
        \Log::info('Categorías activas:', [
            'cantidad' => $categorias->count()
        ]);

        // Obtener los modelos que pertenecen a esas marcas, excluyendo campos BLOB
        if (!empty($marcasCliente)) {
            $modelos = Modelo::with(['marca' => function($query) {
                $query->select('idMarca', 'nombre', 'estado'); // Excluir 'foto'
            }])
            ->whereIn('idMarca', $marcasCliente)
            ->where('estado', 1)
            ->select('idModelo', 'nombre', 'idMarca', 'idCategoria', 'estado')
            ->get();
        } else {
            $modelos = collect(); // Colección vacía
        }

        \Log::info('Modelos encontrados:', [
            'cantidad' => $modelos->count()
        ]);

        $data = [
            'tiposDocumento' => $tiposDocumento,
            'categorias' => $categorias,
            'modelos' => $modelos
        ];

        \Log::info('=== FIN getFormData - ÉXITO ===');
        
        return response()->json([
            'success' => true,
            'data' => $data
        ], 200);

    } catch (\Exception $e) {
        \Log::error('=== ERROR en getFormData ===');
        \Log::error('Mensaje: ' . $e->getMessage());
        \Log::error('Archivo: ' . $e->getFile() . ':' . $e->getLine());
        \Log::error('Trace: ' . $e->getTraceAsString());
        
        return response()->json([
            'success' => false,
            'message' => 'Error al obtener datos del formulario',
            'error' => $e->getMessage()
        ], 500);
    }
}

 public function getModelosByCategoria($idCategoria)
{
    try {
        $user = auth()->user();
        
        \Log::info('=== INICIO getModelosByCategoria ===');
        \Log::info('Parámetros recibidos:', [
            'idCategoria' => $idCategoria,
            'usuario' => $user ? $user->idUsuario : null,
            'idClienteGeneral' => $user ? $user->idClienteGeneral : null
        ]);
        
        if (!$user) {
            \Log::error('Usuario no autenticado en getModelosByCategoria');
            return response()->json([
                'success' => false,
                'message' => 'Usuario no autenticado'
            ], 401);
        }

        // Verificar que el usuario tenga idClienteGeneral
        if (!$user->idClienteGeneral) {
            \Log::error('Usuario sin idClienteGeneral:', [
                'idUsuario' => $user->idUsuario,
                'nombre' => $user->Nombre
            ]);
            return response()->json([
                'success' => false,
                'message' => 'El usuario no tiene un cliente general asignado'
            ], 400);
        }

        // Verificar que la categoría existe
        $categoria = Categorium::select('idCategoria', 'nombre')->find($idCategoria);
        if (!$categoria) {
            \Log::error('Categoría no encontrada:', [
                'idCategoria' => $idCategoria
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Categoría no encontrada'
            ], 404);
        }

        \Log::info('Categoría encontrada:', [
            'idCategoria' => $categoria->idCategoria,
            'nombre' => $categoria->nombre
        ]);

        // Obtener todas las marcas asociadas al cliente general del usuario
        \Log::info('Buscando marcas para cliente general:', [
            'idClienteGeneral' => $user->idClienteGeneral
        ]);
        
        $marcasCliente = MarcaClienteGeneral::where('idClienteGeneral', $user->idClienteGeneral)
            ->pluck('idMarca')
            ->toArray();

        \Log::info('Marcas encontradas:', [
            'cantidad' => count($marcasCliente),
            'marcas' => $marcasCliente
        ]);

        // Obtener los modelos de esa categoría que pertenecen a las marcas del cliente
        $modelos = collect(); // Colección vacía por defecto
        
        if (!empty($marcasCliente)) {
            $modelos = Modelo::with(['marca' => function($query) {
                $query->select('idMarca', 'nombre', 'estado'); // Excluir 'foto'
            }])
            ->where('idCategoria', $idCategoria)
            ->whereIn('idMarca', $marcasCliente)
            ->where('estado', 1)
            ->select('idModelo', 'nombre', 'idMarca', 'idCategoria', 'estado')
            ->get();
        }

        \Log::info('Modelos encontrados:', [
            'cantidad' => $modelos->count()
        ]);

        \Log::info('=== FIN getModelosByCategoria - ÉXITO ===');

        return response()->json([
            'success' => true,
            'data' => $modelos
        ], 200);

    } catch (\Exception $e) {
        \Log::error('=== ERROR en getModelosByCategoria ===');
        \Log::error('Mensaje: ' . $e->getMessage());
        \Log::error('Archivo: ' . $e->getFile() . ':' . $e->getLine());
        \Log::error('Trace: ' . $e->getTraceAsString());
        
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

    public function getMarcas()
    {
        try {
            $user = auth()->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            \Log::info('getMarcas - Usuario:', [
                'idUsuario' => $user->idUsuario,
                'idClienteGeneral' => $user->idClienteGeneral
            ]);

            // Verificar que el modelo MarcaClienteGeneral existe
            if (!class_exists('App\\Models\\MarcaClienteGeneral')) {
                \Log::error('Modelo MarcaClienteGeneral no encontrado');
                return response()->json([
                    'success' => false,
                    'message' => 'Error de configuración del servidor'
                ], 500);
            }

            // Obtener IDs de marcas desde la tabla pivote
            $marcasIds = MarcaClienteGeneral::where('idClienteGeneral', $user->idClienteGeneral)
                ->pluck('idMarca');

            \Log::info('getMarcas - IDs encontrados:', [
                'cantidad' => $marcasIds->count(),
                'ids' => $marcasIds->toArray()
            ]);

            // Si no hay marcas, devolver array vacío
            if ($marcasIds->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => []
                ], 200);
            }

            // Obtener las marcas
            $marcas = Marca::whereIn('idMarca', $marcasIds)
                ->where('estado', 1)
                ->select('idMarca', 'nombre', 'estado')
                ->get();

            \Log::info('getMarcas - Marcas encontradas:', [
                'cantidad' => $marcas->count()
            ]);

            return response()->json([
                'success' => true,
                'data' => $marcas
            ], 200);
            
        } catch (\Exception $e) {
            \Log::error('Error en getMarcas: ' . $e->getMessage());
            \Log::error('Archivo: ' . $e->getFile() . ':' . $e->getLine());
            \Log::error('Trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener marcas',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}