<?php

namespace App\Http\Controllers\login;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;

class AuthController extends Controller
{
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

        // Preparar los datos del usuario, convirtiendo avatar a base64 si existe
        $userData = [
            'idUsuario'        => $user->idUsuario,
            'nombre'           => $user->Nombre,
            'apellidoPaterno'  => $user->apellidoPaterno,
            'apellidoMaterno'  => $user->apellidoMaterno,
            'correo'           => $user->correo,
            'usuario'          => $user->usuario,
            'documento'        => $user->documento,
            'idRol'            => $user->idRol,
            'estado'           => $user->estado,
            // Agrega aquí los campos adicionales que necesites
        ];

        // Si el avatar existe, lo convertimos a base64
        if ($user->avatar) {
            // Asumiendo que el campo avatar es un BLOB binario
            $userData['avatar'] = base64_encode($user->avatar);
            // Opcionalmente podrías agregar el tipo MIME si lo conoces
            // Por ejemplo: 'data:image/jpeg;base64,' . base64_encode($user->avatar)
        } else {
            $userData['avatar'] = null;
        }

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $userData
        ], 200);
    }
}
