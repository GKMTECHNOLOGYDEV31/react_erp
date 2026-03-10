<?php
// D:\XAM\htdocs\react_erp\app\Http\Controllers\ticket\TicketClienteGeneralController.php

namespace App\Http\Controllers\ticket;

use App\Http\Controllers\Controller;
use App\Models\TicketClienteGeneral;
use App\Models\TipoDocumento;
use App\Models\Categoria;
use App\Models\Categorium;
use App\Models\Clientegeneral;
use App\Models\Modelo;
use App\Models\Marca;
use App\Models\MarcaClientegeneral;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class TicketClienteGeneralController extends Controller
{
    /**
     * Display a listing of the resource.
     */
  public function index()
{
    try {
        \Log::info('========== INICIO index tickets ==========');
        
        $user = auth()->user();
        
        \Log::info('Usuario autenticado:', [
            'idUsuario' => $user ? $user->idUsuario : null,
            'nombre' => $user ? $user->Nombre : null,
            'idClienteGeneral' => $user ? $user->idClienteGeneral : null
        ]);
        
        if (!$user) {
            \Log::error('Usuario no autenticado');
            return response()->json([
                'success' => false,
                'message' => 'Usuario no autenticado'
            ], 401);
        }

        \Log::info('Consultando tickets para cliente general:', [
            'idClienteGeneral' => $user->idClienteGeneral
        ]);

        // Primero, obtener los tickets sin relaciones para ver los IDs
        $ticketsBase = TicketClienteGeneral::where('idClienteGeneral', $user->idClienteGeneral)
            ->orderBy('idTicket', 'desc')
            ->get();

        \Log::info('Tickets base encontrados (sin relaciones):', [
            'cantidad' => $ticketsBase->count(),
            'ids' => $ticketsBase->pluck('idTicket')->toArray()
        ]);

        // Log de los idTipoDocumento de los tickets
        if ($ticketsBase->isNotEmpty()) {
            \Log::info('IDs de tipoDocumento en tickets:', [
                'tickets' => $ticketsBase->map(function($t) {
                    return [
                        'idTicket' => $t->idTicket,
                        'idTipoDocumento' => $t->idTipoDocumento
                    ];
                })->toArray()
            ]);
        }

        // Ahora obtener los tickets con todas las relaciones
        $tickets = TicketClienteGeneral::with([
            'tipoDocumento', 
            'categoria', 
            'modelo' => function($query) {
                $query->select('idModelo', 'nombre', 'idMarca', 'idCategoria', 'estado');
            },
            'modelo.marca' => function($query) {
                $query->select('idMarca', 'nombre', 'estado');
            },
            'usuarioCreador' => function($query) {
                $query->select(
                    'idUsuario',
                    'apellidoPaterno',
                    'apellidoMaterno',
                    'Nombre',
                    'correo',
                    'usuario',
                    'idClienteGeneral'
                );
            }
        ])
        ->where('idClienteGeneral', $user->idClienteGeneral)
        ->orderBy('idTicket', 'desc')
        ->get();

        \Log::info('Tickets con relaciones encontrados:', [
            'cantidad' => $tickets->count()
        ]);

        // Verificar cada ticket individualmente
        foreach ($tickets as $index => $ticket) {
            \Log::info("Ticket #{$index} - ID: {$ticket->idTicket}");
            \Log::info("  - idTipoDocumento: " . ($ticket->idTipoDocumento ?? 'null'));
            \Log::info("  - tipoDocumento existe: " . ($ticket->tipoDocumento ? 'SÍ' : 'NO'));
            
            if ($ticket->tipoDocumento) {
                \Log::info("  - tipoDocumento data: ", [
                    'id' => $ticket->tipoDocumento->idTipoDocumento,
                    'nombre' => $ticket->tipoDocumento->nombre
                ]);
            } else {
                // Si no hay relación, verificar si el ID existe en la tabla tipodocumento
                if ($ticket->idTipoDocumento) {
                    $existe = DB::table('tipodocumento')
                        ->where('idTipoDocumento', $ticket->idTipoDocumento)
                        ->exists();
                    \Log::info("  - ¿Existe idTipoDocumento {$ticket->idTipoDocumento} en BD? " . ($existe ? 'SÍ' : 'NO'));
                }
            }
        }

        // También verificar la tabla tipodocumento directamente
        $tiposDocumento = DB::table('tipodocumento')->get();
        \Log::info('Todos los tipos de documento en BD:', [
            'cantidad' => $tiposDocumento->count(),
            'datos' => $tiposDocumento->toArray()
        ]);

        \Log::info('========== FIN index tickets ==========');

        return response()->json([
            'success' => true,
            'data' => $tickets
        ], 200);

    } catch (\Exception $e) {
        \Log::error('========== ERROR en index tickets ==========');
        \Log::error('Mensaje: ' . $e->getMessage());
        \Log::error('Archivo: ' . $e->getFile() . ':' . $e->getLine());
        \Log::error('Trace: ' . $e->getTraceAsString());
        \Log::error('===========================================');
        
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

        // Validar los datos - CAMBIADO para aceptar archivos
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
            // CAMBIADO: aceptar archivos o URLs
            'fotoVideoFalla' => 'nullable',
            'fotoBoletaFactura' => 'nullable',
            'fotoNumeroSerie' => 'nullable',
            'ubicacionGoogleMaps' => 'nullable|url|max:500',
            'estado' => 'sometimes|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Preparar datos para actualizar
        $data = $request->except(['_method', 'fotoVideoFalla', 'fotoBoletaFactura', 'fotoNumeroSerie']);

        // Procesar nuevas imágenes si se subieron
        if ($request->hasFile('fotoVideoFalla')) {
            // Eliminar imagen anterior si existe
            if ($ticket->fotoVideoFalla) {
                $oldPath = str_replace(asset('storage'), 'public', $ticket->fotoVideoFalla);
                Storage::delete($oldPath);
            }
            $data['fotoVideoFalla'] = $this->subirImagen($request->file('fotoVideoFalla'), 'fallas');
        }

        if ($request->hasFile('fotoBoletaFactura')) {
            if ($ticket->fotoBoletaFactura) {
                $oldPath = str_replace(asset('storage'), 'public', $ticket->fotoBoletaFactura);
                Storage::delete($oldPath);
            }
            $data['fotoBoletaFactura'] = $this->subirImagen($request->file('fotoBoletaFactura'), 'boletas');
        }

        if ($request->hasFile('fotoNumeroSerie')) {
            if ($ticket->fotoNumeroSerie) {
                $oldPath = str_replace(asset('storage'), 'public', $ticket->fotoNumeroSerie);
                Storage::delete($oldPath);
            }
            $data['fotoNumeroSerie'] = $this->subirImagen($request->file('fotoNumeroSerie'), 'series');
        }

        // Actualizar el ticket
        $ticket->update($data);

        // Cargar relaciones para la respuesta
        $ticket->load(['tipoDocumento', 'categoria', 'modelo', 'usuarioCreador']);

        return response()->json([
            'success' => true,
            'message' => 'Ticket actualizado exitosamente',
            'data' => $ticket
        ], 200);

    } catch (\Exception $e) {
        \Log::error('Error al actualizar ticket:', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
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
    \Log::info('========== INICIO generarNumeroTicket ==========');
    
    // Obtener el usuario autenticado
    $user = auth()->user();
    
    \Log::info('Usuario autenticado:', [
        'idUsuario' => $user ? $user->idUsuario : null,
        'nombre' => $user ? $user->Nombre : null,
        'idClienteGeneral' => $user ? $user->idClienteGeneral : null,
        'tiene_usuario' => $user ? 'SÍ' : 'NO'
    ]);
    
    if (!$user || !$user->idClienteGeneral) {
        \Log::warning('No hay usuario autenticado o no tiene idClienteGeneral, usando prefijo TKT');
        $prefijo = 'TKT';
    } else {
        \Log::info('Buscando cliente general con ID: ' . $user->idClienteGeneral);
        
        // Obtener el cliente general
        $clienteGeneral = Clientegeneral::find($user->idClienteGeneral);
        
        \Log::info('Cliente general encontrado:', [
            'encontrado' => $clienteGeneral ? 'SÍ' : 'NO',
            'id' => $clienteGeneral ? $clienteGeneral->idClienteGeneral : null,
            'descripcion' => $clienteGeneral ? $clienteGeneral->descripcion : null
        ]);
        
        if ($clienteGeneral && $clienteGeneral->descripcion) {
            // Obtener las primeras 3 letras de la descripción del cliente general
            $descripcion = trim($clienteGeneral->descripcion);
            \Log::info('Descripción original: "' . $descripcion . '"');
            
            $prefijoSinLimpiar = strtoupper(substr($descripcion, 0, 3));
            \Log::info('Prefijo sin limpiar (primeras 3 letras en mayúsculas): "' . $prefijoSinLimpiar . '"');
            
            // Limpiar caracteres especiales (solo letras y números)
            $prefijo = preg_replace('/[^A-Z0-9]/', '', $prefijoSinLimpiar);
            \Log::info('Prefijo después de limpiar caracteres especiales: "' . $prefijo . '"');
            
            // Si después de limpiar queda vacío, usar TKT
            if (empty($prefijo)) {
                \Log::warning('Prefijo vacío después de limpiar, usando TKT');
                $prefijo = 'TKT';
            }
        } else {
            \Log::warning('No se encontró cliente general o descripción vacía, usando TKT');
            $prefijo = 'TKT';
        }
    }
    
    \Log::info('Prefijo final seleccionado: "' . $prefijo . '"');
    
    // Obtener el último ticket para el consecutivo
    \Log::info('Buscando último ticket...');
    $ultimoTicket = TicketClienteGeneral::orderBy('idTicket', 'desc')->first();
    
    if ($ultimoTicket) {
        \Log::info('Último ticket encontrado:', [
            'idTicket' => $ultimoTicket->idTicket,
            'numero_ticket' => $ultimoTicket->numero_ticket
        ]);
    } else {
        \Log::info('No hay tickets previos, será el primer ticket');
    }
    
    if ($ultimoTicket && $ultimoTicket->numero_ticket) {
        // Extraer el número del último ticket
        $partes = explode('-', $ultimoTicket->numero_ticket);
        \Log::info('Partes del último ticket:', [
            'partes' => $partes,
            'cantidad_partes' => count($partes)
        ]);
        
        $ultimoNumero = isset($partes[1]) ? intval($partes[1]) : 0;
        \Log::info('Número extraído del último ticket: ' . $ultimoNumero);
        
        $nuevoNumero = $ultimoNumero + 1;
        \Log::info('Nuevo número (incrementado): ' . $nuevoNumero);
    } else {
        $nuevoNumero = 1;
        \Log::info('No se pudo extraer número, usando 1');
    }
    
    // Formatear el número con 6 dígitos
    $numeroFormateado = str_pad($nuevoNumero, 6, '0', STR_PAD_LEFT);
    \Log::info('Número formateado con 6 dígitos: "' . $numeroFormateado . '"');
    
    // Retornar el ticket completo
    $ticketCompleto = $prefijo . '-' . $numeroFormateado;
    \Log::info('Ticket generado: "' . $ticketCompleto . '"');
    
    \Log::info('========== FIN generarNumeroTicket ==========');
    
    return $ticketCompleto;
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

/**
 * Get modelos by marca
 */
public function getModelosByMarca($idMarca)
{
    try {
        $user = auth()->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no autenticado'
            ], 401);
        }

        $modelos = Modelo::where('idMarca', $idMarca)
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


/**
 * Consultar ticket por número de ticket (información completa)
 */
public function consultarTicketCompleto($numeroTicket)
{
    try {
        \Log::info('========== INICIO consultarTicketCompleto ==========');
        \Log::info('Buscando ticket con número: ' . $numeroTicket);
        
        // Buscar el ticket en tickets_cliente_general
        $ticketBase = TicketClienteGeneral::with([
            'tipoDocumento',
            'categoria',
            'modelo.marca',
            'usuarioCreador'
        ])
        ->where('numero_ticket', $numeroTicket)
        ->first();

        if (!$ticketBase) {
            \Log::warning('Ticket no encontrado en tickets_cliente_general con número: ' . $numeroTicket);
            return response()->json([
                'success' => false,
                'message' => 'Ticket no encontrado'
            ], 404);
        }

        \Log::info('Ticket base encontrado:', [
            'idTicket' => $ticketBase->idTicket,
            'numero_ticket' => $ticketBase->numero_ticket
        ]);

        // Obtener datos del cliente general por separado
        $clienteGeneral = null;
        if ($ticketBase->idClienteGeneral) {
            $clienteGeneral = Clientegeneral::find($ticketBase->idClienteGeneral);
        }

        // Buscar la orden de trabajo asociada en tabla tickets
        $ordenTrabajo = DB::table('tickets')
            ->where('numero_ticket', $numeroTicket)
            ->first();

        $datosOrden = null;
        $visitas = [];
        $flujos = [];
        $transiciones = [];
        $anexos = [];
        $fotosTicket = [];
        $firmas = [];

        if ($ordenTrabajo) {
            \Log::info('Orden de trabajo encontrada:', [
                'idTickets' => $ordenTrabajo->idTickets,
                'numero_ticket' => $ordenTrabajo->numero_ticket
            ]);

            // Obtener datos de la orden
            $datosOrden = [
                'idTickets' => $ordenTrabajo->idTickets,
                'idCliente' => $ordenTrabajo->idCliente,
                'idTienda' => $ordenTrabajo->idTienda,
                'tipoServicio' => $ordenTrabajo->tipoServicio,
                'idTipotickets' => $ordenTrabajo->idTipotickets,
                'idEstadoots' => $ordenTrabajo->idEstadoots,
                'idTecnico' => $ordenTrabajo->idTecnico,
                'esRecojo' => $ordenTrabajo->esRecojo,
                'direccion' => $ordenTrabajo->direccion,
                'lat' => $ordenTrabajo->lat,
                'lng' => $ordenTrabajo->lng,
                'idTicketFlujo' => $ordenTrabajo->idTicketFlujo,
                'linkubicacion' => $ordenTrabajo->linkubicacion,
                'envio' => $ordenTrabajo->envio,
                'erma' => $ordenTrabajo->erma,
                'nrmcotizacion' => $ordenTrabajo->nrmcotizacion,
                'evaluaciontienda' => $ordenTrabajo->evaluaciontienda,
                'es_custodia' => $ordenTrabajo->es_custodia
            ];

            // Obtener el estado de la orden
            if ($ordenTrabajo->idEstadoots) {
                $estadoOT = DB::table('estado_ots')
                    ->where('idEstadoots', $ordenTrabajo->idEstadoots)
                    ->first();
                if ($estadoOT) {
                    $datosOrden['estado_ot'] = [
                        'id' => $estadoOT->idEstadoots,
                        'descripcion' => $estadoOT->descripcion,
                        'color' => $estadoOT->color
                    ];
                }
            }

            // Obtener el tipo de ticket
            if ($ordenTrabajo->idTipotickets) {
                $tipoTicket = DB::table('tipotickets')
                    ->where('idTipotickets', $ordenTrabajo->idTipotickets)
                    ->first();
                if ($tipoTicket) {
                    $datosOrden['tipo_ticket'] = $tipoTicket->nombre;
                }
            }

            // Obtener todos los flujos del ticket
            $flujos = DB::table('ticketflujo')
                ->where('idTicket', $ordenTrabajo->idTickets)
                ->orderBy('fecha_creacion', 'desc')
                ->get()
                ->map(function($flujo) {
                    $estadoFlujo = DB::table('estado_flujo')
                        ->where('idEstadflujo', $flujo->idEstadflujo)
                        ->first();
                    
                    return [
                        'id' => $flujo->idTicketFlujo,
                        'idEstadflujo' => $flujo->idEstadflujo,
                        'estado' => $estadoFlujo ? $estadoFlujo->descripcion : null,
                        'color' => $estadoFlujo ? $estadoFlujo->color : null,
                        'idUsuario' => $flujo->idUsuario,
                        'fecha_creacion' => $flujo->fecha_creacion,
                        'idVisitas' => $flujo->idVisitas,
                        'comentario' => $flujo->comentarioflujo
                    ];
                });

            // Obtener todas las visitas del ticket
            $visitasData = DB::table('visitas')
                ->where('idTickets', $ordenTrabajo->idTickets)
                ->orderBy('fecha_programada', 'desc')
                ->get();

            foreach ($visitasData as $visita) {
                // Obtener anexos de la visita
                $anexosVisita = DB::table('anexos_visitas')
                    ->where('idVisitas', $visita->idVisitas)
                    ->get()
                    ->map(function($anexo) {
                        return [
                            'id' => $anexo->idAnexoVisitas,
                            'foto' => $anexo->foto ? 'data:image/jpeg;base64,' . base64_encode($anexo->foto) : null,
                            'descripcion' => $anexo->descripcion,
                            'idTipovisita' => $anexo->idTipovisita,
                            'lat' => $anexo->lat,
                            'lng' => $anexo->lng,
                            'ubicacion' => $anexo->ubicacion
                        ];
                    });

                // Obtener tipo de visita
                $tipoVisita = DB::table('tipo_visita')
                    ->where('idTipovisita', $visita->tipoServicio)
                    ->first();

                // Obtener firmas de la visita
                $firmasVisita = DB::table('firmas')
                    ->where('idVisitas', $visita->idVisitas)
                    ->get()
                    ->map(function($firma) {
                        return [
                            'id' => $firma->idFirmas,
                            'firma_tecnico' => $firma->firma_tecnico ? 'data:image/png;base64,' . base64_encode($firma->firma_tecnico) : null,
                            'firma_cliente' => $firma->firma_cliente ? 'data:image/png;base64,' . base64_encode($firma->firma_cliente) : null,
                            'idTickets' => $firma->idTickets,
                            'idVisitas' => $firma->idVisitas,
                            'idCliente' => $firma->idCliente,
                            'nombreencargado' => $firma->nombreencargado,
                            'tipodocumento' => $firma->tipodocumento,
                            'documento' => $firma->documento
                        ];
                    });

                $visitas[] = [
                    'id' => $visita->idVisitas,
                    'nombre' => $visita->nombre,
                    'fecha_programada' => $visita->fecha_programada,
                    'fecha_asignada' => $visita->fecha_asignada,
                    'fecha_llegada' => $visita->fecha_llegada,
                    'fecha_inicio' => $visita->fecha_inicio,
                    'fecha_final' => $visita->fecha_final,
                    'estado' => $visita->estado,
                    'idUsuario' => $visita->idUsuario,
                    'tipoServicio' => $visita->tipoServicio,
                    'tipoVisita' => $tipoVisita ? $tipoVisita->nombre : null,
                    'necesita_apoyo' => $visita->necesita_apoyo,
                    'visto' => $visita->visto,
                    'recojo' => $visita->recojo,
                    'celularcliente' => $visita->celularclientetienda,
                    'dnicliente' => $visita->dniclientetienda,
                    'nombrecliente' => $visita->nombreclientetienda,
                    'anexos' => $anexosVisita,
                    'firmas' => $firmasVisita
                ];

                // Acumular anexos para la lista general
                $anexos = array_merge($anexos, $anexosVisita->toArray());
                
                // Acumular firmas para la lista general
                $firmas = array_merge($firmas, $firmasVisita->toArray());
            }

            // Obtener fotos del ticket (fotostickest)
            $fotosTicket = DB::table('fotostickest')
                ->where('idTickets', $ordenTrabajo->idTickets)
                ->orderBy('idfotostickest', 'desc')
                ->get()
                ->map(function($foto) {
                    return [
                        'id' => $foto->idfotostickest,
                        'foto' => $foto->foto ? 'data:image/jpeg;base64,' . base64_encode($foto->foto) : null,
                        'descripcion' => $foto->descripcion,
                        'idVisitas' => $foto->idVisitas
                    ];
                });

            // Obtener transiciones de estado (transicion_status_ticket)
            $transiciones = DB::table('transicion_status_ticket')
                ->where('idTickets', $ordenTrabajo->idTickets)
                ->orderBy('fechaRegistro', 'desc')
                ->get()
                ->map(function($transicion) {
                    $estadoOT = DB::table('estado_ots')
                        ->where('idEstadoots', $transicion->idEstadoots)
                        ->first();
                    
                    return [
                        'id' => $transicion->idTransicionStatus,
                        'idEstadoots' => $transicion->idEstadoots,
                        'estado' => $estadoOT ? $estadoOT->descripcion : null,
                        'color' => $estadoOT ? $estadoOT->color : null,
                        'idVisitas' => $transicion->idVisitas,
                        'justificacion' => $transicion->justificacion,
                        'fechaRegistro' => $transicion->fechaRegistro,
                        'estado_transicion' => $transicion->estado
                    ];
                });

            // Obtener firmas generales del ticket (sin visita específica)
            $firmasGenerales = DB::table('firmas')
                ->where('idTickets', $ordenTrabajo->idTickets)
                ->whereNull('idVisitas') // Firmas sin visita asociada
                ->orWhere(function($query) use ($ordenTrabajo) {
                    $query->where('idTickets', $ordenTrabajo->idTickets)
                          ->where('idVisitas', 0); // Firmas con idVisitas = 0
                })
                ->get()
                ->map(function($firma) {
                    return [
                        'id' => $firma->idFirmas,
                        'firma_tecnico' => $firma->firma_tecnico ? 'data:image/png;base64,' . base64_encode($firma->firma_tecnico) : null,
                        'firma_cliente' => $firma->firma_cliente ? 'data:image/png;base64,' . base64_encode($firma->firma_cliente) : null,
                        'idTickets' => $firma->idTickets,
                        'idVisitas' => $firma->idVisitas,
                        'idCliente' => $firma->idCliente,
                        'nombreencargado' => $firma->nombreencargado,
                        'tipodocumento' => $firma->tipodocumento,
                        'documento' => $firma->documento
                    ];
                });

            // Combinar todas las firmas
            $firmas = array_merge($firmas, $firmasGenerales->toArray());
        }

        // Transformar los datos del ticket base
        $ticketTransformado = [
            'id' => $ticketBase->idTicket,
            'numeroTicket' => $ticketBase->numero_ticket,
            
            // Datos del contacto
            'nombreCompleto' => $ticketBase->nombreCompleto,
            'correoElectronico' => $ticketBase->correoElectronico,
            'telefonoCelular' => $ticketBase->telefonoCelular,
            'telefonoFijo' => $ticketBase->telefonoFijo,
            'tipoDocumento' => $ticketBase->tipoDocumento ? $ticketBase->tipoDocumento->nombre : 'N/A',
            'dni_ruc_ce' => $ticketBase->dni_ruc_ce,
            
            // Datos del cliente general
            'clienteGeneral' => $clienteGeneral ? $clienteGeneral->descripcion : 'N/A',
            
            // Dirección
            'direccionCompleta' => $ticketBase->direccionCompleta,
            'referenciaDomicilio' => $ticketBase->referenciaDomicilio,
            'departamento' => $ticketBase->departamento,
            'provincia' => $ticketBase->provincia,
            'distrito' => $ticketBase->distrito,
            'ubicacionGoogleMaps' => $ticketBase->ubicacionGoogleMaps,
            
            // Datos del producto
            'tipoProducto' => $ticketBase->categoria ? $ticketBase->categoria->nombre : 'N/A',
            'marca' => $ticketBase->modelo && $ticketBase->modelo->marca ? $ticketBase->modelo->marca->nombre : 'N/A',
            'modelo' => $ticketBase->modelo ? $ticketBase->modelo->nombre : 'N/A',
            'serie' => $ticketBase->serieProducto,
            
            // Falla
            'detallesFalla' => $ticketBase->detallesFalla,
            
            // Fechas
            'fechaCompra' => $ticketBase->fechaCompra,
            'fechaCreacion' => $ticketBase->fechaCreacion,
            'tiendaSedeCompra' => $ticketBase->tiendaSedeCompra,
            
            // Estado
            'estado' => $ticketBase->estado === 1 ? 'evaluando' : 
                       ($ticketBase->estado === 2 ? 'gestionando' : 'finalizado'),
            
            // Evidencias originales
            'fotoVideoFalla' => $ticketBase->fotoVideoFalla,
            'fotoBoletaFactura' => $ticketBase->fotoBoletaFactura,
            'fotoNumeroSerie' => $ticketBase->fotoNumeroSerie,
            
            // Usuario creador
            'usuarioCreador' => $ticketBase->usuarioCreador ? 
                $ticketBase->usuarioCreador->Nombre . ' ' . $ticketBase->usuarioCreador->apellidoPaterno : 'N/A',
            
            // Datos de la orden de trabajo (si existe)
            'ordenTrabajo' => $datosOrden,
            
            // Datos relacionados
            'flujos' => $flujos,
            'visitas' => $visitas,
            'transiciones' => $transiciones,
            'anexos' => $anexos,
            'fotosTicket' => $fotosTicket,
            'firmas' => $firmas, // NUEVO: Firmas del ticket
            
            // Estadísticas adicionales
            'estadisticas' => [
                'total_fotos' => count($fotosTicket),
                'total_visitas' => count($visitas),
                'total_firmas' => count($firmas),
                'total_transiciones' => count($transiciones)
            ],
            
            // Indicador de si tiene orden de trabajo
            'tieneOrdenTrabajo' => $ordenTrabajo ? true : false
        ];

        \Log::info('========== FIN consultarTicketCompleto ==========');
        \Log::info('Datos obtenidos:', [
            'tiene_orden' => $ticketTransformado['tieneOrdenTrabajo'],
            'total_fotos' => $ticketTransformado['estadisticas']['total_fotos'],
            'total_visitas' => $ticketTransformado['estadisticas']['total_visitas'],
            'total_firmas' => $ticketTransformado['estadisticas']['total_firmas']
        ]);

        return response()->json([
            'success' => true,
            'data' => $ticketTransformado
        ], 200);

    } catch (\Exception $e) {
        \Log::error('========== ERROR en consultarTicketCompleto ==========');
        \Log::error('Mensaje: ' . $e->getMessage());
        \Log::error('Archivo: ' . $e->getFile() . ':' . $e->getLine());
        \Log::error('Trace: ' . $e->getTraceAsString());
        \Log::error('===================================================');
        
        return response()->json([
            'success' => false,
            'message' => 'Error al consultar el ticket',
            'error' => $e->getMessage()
        ], 500);
    }
}
}