<?php
// D:\XAM\htdocs\react_erp\app\Http\Controllers\ticket\TicketClienteGeneralController.php

namespace App\Http\Controllers\ticket;

use App\Http\Controllers\Controller;
use App\Models\TicketClienteGeneral;
use App\Models\Tipodocumento;
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
    public function __construct()
    {
        try {
            DB::statement("SET NAMES 'utf8mb4'");
            DB::statement("SET CHARACTER SET utf8mb4");
            DB::statement("SET SESSION collation_connection = 'utf8mb4_unicode_ci'");
        } catch (\Exception $e) {
            \Log::error('Error configurando BD: ' . $e->getMessage());
        }
    }

    public function index()
    {
        try {
            \Log::info('========== INICIO index tickets ==========');
            $user = auth()->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            $tickets = TicketClienteGeneral::with([
                'tipoDocumento',
                'categoria',
                'modelo' => function ($query) {
                    $query->select('idModelo', 'nombre', 'idMarca', 'idCategoria', 'estado');
                },
                'modelo.marca' => function ($query) {
                    $query->select('idMarca', 'nombre', 'estado');
                },
                'usuarioCreador' => function ($query) {
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

            $ticketsArray = $this->cleanUtf8Strings($tickets->toArray());

            return response()->json([
                'success' => true,
                'data' => $ticketsArray
            ], 200, [], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_IGNORE);

        } catch (\Exception $e) {
            \Log::error('Error en index: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener tickets',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            // Validar los datos - MODIFICADO para aceptar PDF, DOC, DOCX
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

                // Evidencias (archivos) - MODIFICADO para aceptar más tipos
                'fotoVideoFalla' => 'nullable|file|mimes:jpeg,png,jpg,gif,pdf,doc,docx|max:10240',
                'fotoBoletaFactura' => 'nullable|file|mimes:jpeg,png,jpg,gif,pdf,doc,docx|max:10240',
                'fotoNumeroSerie' => 'nullable|file|mimes:jpeg,png,jpg,gif,pdf,doc,docx|max:10240',

                // Ubicación
                'ubicacionGoogleMaps' => 'nullable|url|max:500'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = auth()->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            if (!$user->idClienteGeneral) {
                return response()->json([
                    'success' => false,
                    'message' => 'El usuario no tiene un ID de cliente general asignado'
                ], 400);
            }

            $idUsuarioCreador = $user->idUsuario;
            $numeroTicket = $this->generarNumeroTicket();

            // Procesar archivos - MODIFICADO para manejar cualquier tipo
            $fotoVideoFalla = $this->subirArchivo($request->file('fotoVideoFalla'), 'fallas');
            $fotoBoletaFactura = $this->subirArchivo($request->file('fotoBoletaFactura'), 'boletas');
            $fotoNumeroSerie = $this->subirArchivo($request->file('fotoNumeroSerie'), 'series');

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

            $ticket->load(['tipoDocumento', 'categoria', 'modelo', 'usuarioCreador']);

            // Crear notificación
            $notificacionId = \DB::table('notificaciones_ticket_general')->insertGetId([
                'idTicketClienteGeneral' => $ticket->idTicketClienteGeneral,
                'estado_web' => 0,
                'estado_app' => 0,
                'fecha' => now(),
                'tipo' => 'CREACION_TICKET',
                'created_at' => now(),
                'updated_at' => now()
            ]);

            try {
                $payload = [
                    'type' => 'creacion_ticket_evento',
                    'idNotificacion' => (int) $notificacionId,
                    'idTicket' => (int) $ticket->idTicketClienteGeneral,
                    'numeroTicket' => $ticket->numero_ticket,
                    'tipoNotificacionForzada' => 'CREACION_TICKET',
                    'nombreCliente' => $ticket->nombreCompleto,
                    'idUsuarioCreador' => (int) $ticket->idUsuarioCreador
                ];
                \App\Services\WsBridge::emitSolicitudEvento($payload);
            } catch (\Throwable $e) {
                \Log::error('Error enviando WS ticket: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Ticket creado exitosamente',
                'data' => $ticket
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Error en store: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el ticket',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $ticket = TicketClienteGeneral::with([
                'tipoDocumento',
                'categoria',
                'modelo' => function ($query) {
                    $query->select('idModelo', 'nombre', 'idMarca', 'idCategoria', 'estado');
                },
                'modelo.marca' => function ($query) {
                    $query->select('idMarca', 'nombre', 'estado');
                },
                'usuarioCreador'
            ])->find($id);

            if (!$ticket) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ticket no encontrado'
                ], 404);
            }

            $ticketArray = $this->cleanUtf8Strings($ticket->toArray());

            return response()->json([
                'success' => true,
                'data' => $ticketArray
            ], 200, [], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_IGNORE);

        } catch (\Exception $e) {
            \Log::error('Error en show: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el ticket',
                'error' => $e->getMessage()
            ], 500);
        }
    }

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
                'fotoVideoFalla' => 'nullable|file|mimes:jpeg,png,jpg,gif,pdf,doc,docx|max:10240',
                'fotoBoletaFactura' => 'nullable|file|mimes:jpeg,png,jpg,gif,pdf,doc,docx|max:10240',
                'fotoNumeroSerie' => 'nullable|file|mimes:jpeg,png,jpg,gif,pdf,doc,docx|max:10240',
                'ubicacionGoogleMaps' => 'nullable|url|max:500',
                'estado' => 'sometimes|integer'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->except(['_method', 'fotoVideoFalla', 'fotoBoletaFactura', 'fotoNumeroSerie']);

            if ($request->hasFile('fotoVideoFalla')) {
                if ($ticket->fotoVideoFalla) {
                    $oldPath = str_replace(asset('storage'), 'public', $ticket->fotoVideoFalla);
                    Storage::delete($oldPath);
                }
                $data['fotoVideoFalla'] = $this->subirArchivo($request->file('fotoVideoFalla'), 'fallas');
            }

            if ($request->hasFile('fotoBoletaFactura')) {
                if ($ticket->fotoBoletaFactura) {
                    $oldPath = str_replace(asset('storage'), 'public', $ticket->fotoBoletaFactura);
                    Storage::delete($oldPath);
                }
                $data['fotoBoletaFactura'] = $this->subirArchivo($request->file('fotoBoletaFactura'), 'boletas');
            }

            if ($request->hasFile('fotoNumeroSerie')) {
                if ($ticket->fotoNumeroSerie) {
                    $oldPath = str_replace(asset('storage'), 'public', $ticket->fotoNumeroSerie);
                    Storage::delete($oldPath);
                }
                $data['fotoNumeroSerie'] = $this->subirArchivo($request->file('fotoNumeroSerie'), 'series');
            }

            $ticket->update($data);
            $ticket->load(['tipoDocumento', 'categoria', 'modelo', 'usuarioCreador']);
            $ticketArray = $this->cleanUtf8Strings($ticket->toArray());

            return response()->json([
                'success' => true,
                'message' => 'Ticket actualizado exitosamente',
                'data' => $ticketArray
            ], 200, [], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_IGNORE);

        } catch (\Exception $e) {
            \Log::error('Error en update: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el ticket',
                'error' => $e->getMessage()
            ], 500);
        }
    }

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

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            if (!$user->idClienteGeneral) {
                return response()->json([
                    'success' => false,
                    'message' => 'El usuario no tiene un cliente general asignado'
                ], 400);
            }

            $marcasCliente = MarcaClientegeneral::where('idClienteGeneral', $user->idClienteGeneral)
                ->pluck('idMarca')
                ->toArray();

            $tiposDocumento = Tipodocumento::select('idTipoDocumento', 'nombre')->get();
            $categorias = Categorium::where('estado', 1)->select('idCategoria', 'nombre', 'estado')->get();

            if (!empty($marcasCliente)) {
                $modelos = Modelo::with(['marca' => function ($query) {
                    $query->select('idMarca', 'nombre', 'estado');
                }])
                    ->whereIn('idMarca', $marcasCliente)
                    ->where('estado', 1)
                    ->select('idModelo', 'nombre', 'idMarca', 'idCategoria', 'estado')
                    ->get();
            } else {
                $modelos = collect();
            }

            $data = [
                'tiposDocumento' => $this->cleanUtf8Strings($tiposDocumento->toArray()),
                'categorias' => $this->cleanUtf8Strings($categorias->toArray()),
                'modelos' => $this->cleanUtf8Strings($modelos->toArray())
            ];

            return response()->json([
                'success' => true,
                'data' => $data
            ], 200, [], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_IGNORE);

        } catch (\Exception $e) {
            \Log::error('Error en getFormData: ' . $e->getMessage());
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

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            if (!$user->idClienteGeneral) {
                return response()->json([
                    'success' => false,
                    'message' => 'El usuario no tiene un cliente general asignado'
                ], 400);
            }

            $categoria = Categorium::select('idCategoria', 'nombre')->find($idCategoria);
            if (!$categoria) {
                return response()->json([
                    'success' => false,
                    'message' => 'Categoría no encontrada'
                ], 404);
            }

            $marcasCliente = MarcaClientegeneral::where('idClienteGeneral', $user->idClienteGeneral)
                ->pluck('idMarca')
                ->toArray();

            $modelos = collect();

            if (!empty($marcasCliente)) {
                $modelos = Modelo::with(['marca' => function ($query) {
                    $query->select('idMarca', 'nombre', 'estado');
                }])
                    ->where('idCategoria', $idCategoria)
                    ->whereIn('idMarca', $marcasCliente)
                    ->where('estado', 1)
                    ->select('idModelo', 'nombre', 'idMarca', 'idCategoria', 'estado')
                    ->get();
            }

            $modelosArray = $this->cleanUtf8Strings($modelos->toArray());

            return response()->json([
                'success' => true,
                'data' => $modelosArray
            ], 200, [], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_IGNORE);

        } catch (\Exception $e) {
            \Log::error('Error en getModelosByCategoria: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener modelos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function upload(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|file|mimes:jpeg,png,jpg,gif,pdf,doc,docx|max:10240',
                'tipo' => 'required|string|in:fallas,boletas,series'
            ]);

            $file = $request->file('file');
            $tipo = $request->tipo;

            $extension = $file->getClientOriginalExtension();
            $nombre = time() . '_' . uniqid() . '.' . $extension;
            $path = $file->storeAs("public/tickets/{$tipo}", $nombre);
            $url = asset(str_replace('public', 'storage', $path));

            return response()->json([
                'success' => true,
                'url' => $url,
                'extension' => $extension,
                'nombre' => $nombre
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
     * Subir archivo al servidor - MODIFICADO para manejar cualquier tipo
     */
    private function subirArchivo($file, $carpeta)
    {
        if (!$file) {
            return null;
        }

        $extension = $file->getClientOriginalExtension();
        $nombre = time() . '_' . uniqid() . '.' . $extension;
        $ruta = $file->storeAs("public/tickets/{$carpeta}", $nombre);

        return asset(str_replace('public', 'storage', $ruta));
    }

    private function generarNumeroTicket()
    {
        \Log::info('========== INICIO generarNumeroTicket ==========');

        $user = auth()->user();

        if (!$user || !$user->idClienteGeneral) {
            $prefijo = 'TKT';
        } else {
            $clienteGeneral = Clientegeneral::find($user->idClienteGeneral);

            if ($clienteGeneral && $clienteGeneral->descripcion) {
                $descripcion = trim($clienteGeneral->descripcion);
                $prefijoSinLimpiar = strtoupper(substr($descripcion, 0, 3));
                $prefijo = preg_replace('/[^A-Z0-9]/', '', $prefijoSinLimpiar);
                
                if (empty($prefijo)) {
                    $prefijo = 'TKT';
                }
            } else {
                $prefijo = 'TKT';
            }
        }

        $anioActual = date('Y');
        
        $ultimoTicket = TicketClienteGeneral::where('numero_ticket', 'like', '%-' . $anioActual)
            ->orderBy('idTicket', 'desc')
            ->first();

        if ($ultimoTicket && $ultimoTicket->numero_ticket) {
            $partes = explode('-', $ultimoTicket->numero_ticket);
            $ultimoNumero = isset($partes[1]) ? intval($partes[1]) : 0;
            $nuevoNumero = $ultimoNumero + 1;
        } else {
            $nuevoNumero = 1;
        }

        $numeroFormateado = str_pad($nuevoNumero, 6, '0', STR_PAD_LEFT);
        $ticketCompleto = $prefijo . '-' . $numeroFormateado . '-' . $anioActual;

        \Log::info('Ticket generado: ' . $ticketCompleto);
        \Log::info('========== FIN generarNumeroTicket ==========');

        return $ticketCompleto;
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

            $marcasIds = MarcaClientegeneral::where('idClienteGeneral', $user->idClienteGeneral)
                ->pluck('idMarca');

            if ($marcasIds->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => []
                ], 200);
            }

            $marcas = Marca::whereIn('idMarca', $marcasIds)
                ->where('estado', 1)
                ->select('idMarca', 'nombre', 'estado')
                ->get();

            $marcasArray = $this->cleanUtf8Strings($marcas->toArray());

            return response()->json([
                'success' => true,
                'data' => $marcasArray
            ], 200, [], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_IGNORE);

        } catch (\Exception $e) {
            \Log::error('Error en getMarcas: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener marcas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

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

            $modelosArray = $this->cleanUtf8Strings($modelos->toArray());

            return response()->json([
                'success' => true,
                'data' => $modelosArray
            ], 200, [], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_IGNORE);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener modelos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function consultarTicketCompleto($numeroTicket)
    {
        try {
            \Log::info('Buscando ticket con número: ' . $numeroTicket);
            
            $ticketBase = TicketClienteGeneral::with([
                'tipoDocumento',
                'categoria',
                'modelo.marca',
                'usuarioCreador'
            ])
            ->where('numero_ticket', $numeroTicket)
            ->first();

            if (!$ticketBase) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ticket no encontrado'
                ], 404);
            }

            $clienteGeneral = null;
            if ($ticketBase->idClienteGeneral) {
                $clienteGeneral = Clientegeneral::find($ticketBase->idClienteGeneral);
            }

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
                $datosOrden = [
                    'idTickets' => $ordenTrabajo->idTickets ?? null,
                    'idCliente' => $ordenTrabajo->idCliente ?? null,
                    'idTienda' => $ordenTrabajo->idTienda ?? null,
                    'tipoServicio' => $ordenTrabajo->tipoServicio ?? null,
                    'idTipotickets' => $ordenTrabajo->idTipotickets ?? null,
                    'idEstadoots' => $ordenTrabajo->idEstadoots ?? null,
                    'idTecnico' => $ordenTrabajo->idTecnico ?? null,
                    'esRecojo' => $ordenTrabajo->esRecojo ?? null,
                    'direccion' => $ordenTrabajo->direccion ?? null,
                    'lat' => $ordenTrabajo->lat ?? null,
                    'lng' => $ordenTrabajo->lng ?? null,
                    'idTicketFlujo' => $ordenTrabajo->idTicketFlujo ?? null,
                    'linkubicacion' => $ordenTrabajo->linkubicacion ?? null,
                    'envio' => $ordenTrabajo->envio ?? null,
                    'erma' => $ordenTrabajo->erma ?? null,
                    'nrmcotizacion' => $ordenTrabajo->nrmcotizacion ?? null,
                    'evaluaciontienda' => $ordenTrabajo->evaluaciontienda ?? null,
                    'es_custodia' => property_exists($ordenTrabajo, 'es_custodia') ? $ordenTrabajo->es_custodia : 0
                ];

                if ($ordenTrabajo->idEstadoots) {
                    $estadoOT = DB::table('estado_ots')->where('idEstadoots', $ordenTrabajo->idEstadoots)->first();
                    if ($estadoOT) {
                        $datosOrden['estado_ot'] = [
                            'id' => $estadoOT->idEstadoots,
                            'descripcion' => $estadoOT->descripcion,
                            'color' => $estadoOT->color
                        ];
                    }
                }

                if ($ordenTrabajo->idTipotickets) {
                    $tipoTicket = DB::table('tipotickets')->where('idTipotickets', $ordenTrabajo->idTipotickets)->first();
                    if ($tipoTicket) {
                        $datosOrden['tipo_ticket'] = $tipoTicket->nombre;
                    }
                }

                $flujos = DB::table('ticketflujo')
                    ->where('idTicket', $ordenTrabajo->idTickets)
                    ->orderBy('fecha_creacion', 'desc')
                    ->get()
                    ->map(function($flujo) {
                        $estadoFlujo = DB::table('estado_flujo')->where('idEstadflujo', $flujo->idEstadflujo)->first();
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

                $visitasData = DB::table('visitas')
                    ->where('idTickets', $ordenTrabajo->idTickets)
                    ->orderBy('fecha_programada', 'desc')
                    ->get();

                foreach ($visitasData as $visita) {
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

                    $tipoVisita = DB::table('tipo_visita')->where('idTipovisita', $visita->tipoServicio)->first();

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

                    $anexos = array_merge($anexos, $anexosVisita->toArray());
                    $firmas = array_merge($firmas, $firmasVisita->toArray());
                }

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

                $transiciones = DB::table('transicion_status_ticket')
                    ->where('idTickets', $ordenTrabajo->idTickets)
                    ->orderBy('fechaRegistro', 'desc')
                    ->get()
                    ->map(function($transicion) {
                        $estadoOT = DB::table('estado_ots')->where('idEstadoots', $transicion->idEstadoots)->first();
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

                $firmasGenerales = DB::table('firmas')
                    ->where('idTickets', $ordenTrabajo->idTickets)
                    ->whereNull('idVisitas')
                    ->orWhere(function($query) use ($ordenTrabajo) {
                        $query->where('idTickets', $ordenTrabajo->idTickets)->where('idVisitas', 0);
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

                $firmas = array_merge($firmas, $firmasGenerales->toArray());
            }

            $ticketTransformado = [
                'id' => $ticketBase->idTicket,
                'numeroTicket' => $ticketBase->numero_ticket,
                'nombreCompleto' => $ticketBase->nombreCompleto,
                'correoElectronico' => $ticketBase->correoElectronico,
                'telefonoCelular' => $ticketBase->telefonoCelular,
                'telefonoFijo' => $ticketBase->telefonoFijo,
                'tipoDocumento' => $ticketBase->tipoDocumento ? $ticketBase->tipoDocumento->nombre : 'N/A',
                'dni_ruc_ce' => $ticketBase->dni_ruc_ce,
                'clienteGeneral' => $clienteGeneral ? $clienteGeneral->descripcion : 'N/A',
                'direccionCompleta' => $ticketBase->direccionCompleta,
                'referenciaDomicilio' => $ticketBase->referenciaDomicilio,
                'departamento' => $ticketBase->departamento,
                'provincia' => $ticketBase->provincia,
                'distrito' => $ticketBase->distrito,
                'ubicacionGoogleMaps' => $ticketBase->ubicacionGoogleMaps,
                'tipoProducto' => $ticketBase->categoria ? $ticketBase->categoria->nombre : 'N/A',
                'marca' => $ticketBase->modelo && $ticketBase->modelo->marca ? $ticketBase->modelo->marca->nombre : 'N/A',
                'modelo' => $ticketBase->modelo ? $ticketBase->modelo->nombre : 'N/A',
                'serie' => $ticketBase->serieProducto,
                'detallesFalla' => $ticketBase->detallesFalla,
                'fechaCompra' => $ticketBase->fechaCompra,
                'fechaCreacion' => $ticketBase->fechaCreacion,
                'tiendaSedeCompra' => $ticketBase->tiendaSedeCompra,
                'estado' => $ticketBase->estado === 1 ? 'evaluando' : ($ticketBase->estado === 2 ? 'gestionando' : 'finalizado'),
                'fotoVideoFalla' => $ticketBase->fotoVideoFalla,
                'fotoBoletaFactura' => $ticketBase->fotoBoletaFactura,
                'fotoNumeroSerie' => $ticketBase->fotoNumeroSerie,
                'usuarioCreador' => $ticketBase->usuarioCreador ? $ticketBase->usuarioCreador->Nombre . ' ' . $ticketBase->usuarioCreador->apellidoPaterno : 'N/A',
                'ordenTrabajo' => $datosOrden,
                'flujos' => $flujos,
                'visitas' => $visitas,
                'transiciones' => $transiciones,
                'anexos' => $anexos,
                'fotosTicket' => $fotosTicket,
                'firmas' => $firmas,
                'estadisticas' => [
                    'total_fotos' => count($fotosTicket),
                    'total_visitas' => count($visitas),
                    'total_firmas' => count($firmas),
                    'total_transiciones' => count($transiciones)
                ],
                'tieneOrdenTrabajo' => $ordenTrabajo ? true : false
            ];

            return response()->json([
                'success' => true,
                'data' => $ticketTransformado
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Error en consultarTicketCompleto: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al consultar el ticket',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function cleanUtf8String($string)
    {
        if (!is_string($string)) {
            return $string;
        }

        $cleaned = mb_convert_encoding($string, 'UTF-8', 'UTF-8');
        if (!mb_check_encoding($cleaned, 'UTF-8')) {
            $cleaned = utf8_encode($string);
        }
        $cleaned = preg_replace('/[^\x{0009}\x{000A}\x{000D}\x{0020}-\x{D7FF}\x{E000}-\x{FFFD}]+/u', ' ', $cleaned);
        return trim($cleaned);
    }

    private function cleanUtf8Strings($data)
    {
        if (is_string($data)) {
            return $this->cleanUtf8String($data);
        }
        if (is_array($data)) {
            foreach ($data as $key => $value) {
                $data[$key] = $this->cleanUtf8Strings($value);
            }
            return $data;
        }
        if (is_object($data)) {
            foreach ($data as $key => $value) {
                $data->$key = $this->cleanUtf8Strings($value);
            }
            return $data;
        }
        return $data;
    }
}