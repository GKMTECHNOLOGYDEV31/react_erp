<?php
// app/Http/Controllers/login/AuthController.php

namespace App\Http\Controllers\login;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Models\Usuario;
use App\Models\Clientegeneral;

class AuthController extends Controller
{
    private $rolesMap = [
        1 => 'ADMINISTRADOR',
        2 => 'CALL CENTER',
        3 => 'INVITADO'
    ];

   public function login(Request $request)
{
    $request->validate([
        'documento' => 'required|string',
        'clave'     => 'required|string',
    ]);

    $user = Usuario::where('documento', $request->documento)->first();

    if (!$user || !Hash::check($request->clave, $user->clave)) {
        return response()->json([
            'message' => 'Documento o contraseña incorrectos'
        ], 401);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    // Mapeo de roles
    $rolesMap = [
        1 => 'ADMINISTRADOR',
        2 => 'CALL CENTER',
        3 => 'INVITADO'
    ];

    $rolNombre = $rolesMap[$user->idRol] ?? 'INVITADO';

    // Obtener datos del cliente general si existe
    $clienteGeneral = null;
    if ($user->idClienteGeneral) {
        $clienteGeneral = Clientegeneral::find($user->idClienteGeneral);
    }

    // Preparar los datos del usuario
    $userData = [
        'idUsuario'        => $user->idUsuario,
        'nombre'           => $user->Nombre,
        'apellidoPaterno'  => $user->apellidoPaterno,
        'apellidoMaterno'  => $user->apellidoMaterno,
        'correo'           => $user->correo,
        'usuario'          => $user->usuario,
        'documento'        => $user->documento,
        'idRol'            => $user->idRol,
        'rolNombre'        => $rolNombre,
        'idClienteGeneral' => $user->idClienteGeneral,
        'estado'           => $user->estado,
        'telefono'         => $user->telefono,
        'direccion'        => $user->direccion,
        'departamento'     => $user->departamento,
        'provincia'        => $user->provincia,
        'distrito'         => $user->distrito,
    ];

    if ($user->avatar) {
        $userData['avatar'] = base64_encode($user->avatar);
    }

    if ($clienteGeneral) {
        $userData['clienteGeneral'] = [
            'id'          => $clienteGeneral->idClienteGeneral,
            'descripcion' => $clienteGeneral->descripcion,
            'estado'      => $clienteGeneral->estado,
            'foto'        => $clienteGeneral->foto ? base64_encode($clienteGeneral->foto) : null
        ];
    }

    return response()->json([
        'access_token' => $token,
        'token_type'   => 'Bearer',
        'user'         => $userData
    ], 200);
}

    /**
     * Endpoint para obtener solo los datos del cliente general del usuario autenticado
     */
    public function getMiClienteGeneral(Request $request)
    {
        try {
            $user = $request->user();

            Log::info('Obteniendo cliente general para usuario:', [
                'idUsuario' => $user->idUsuario,
                'idClienteGeneral' => $user->idClienteGeneral
            ]);

            if (!$user->idClienteGeneral) {
                return response()->json([
                    'success' => false,
                    'message' => 'El usuario no tiene un cliente general asociado'
                ], 404);
            }

            $clienteGeneral = Clientegeneral::find($user->idClienteGeneral);

            if (!$clienteGeneral) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cliente general no encontrado'
                ], 404);
            }

            $data = [
                'id'          => $clienteGeneral->idClienteGeneral,
                'descripcion' => $clienteGeneral->descripcion,
                'estado'      => $clienteGeneral->estado,
                'foto'        => $clienteGeneral->foto ? base64_encode($clienteGeneral->foto) : null
            ];

            return response()->json([
                'success' => true,
                'data'    => $data
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error al obtener cliente general:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener cliente general',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}