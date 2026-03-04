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

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user' => [
                'id'        => $user->idUsuario,
                'nombre'    => $user->Nombre,
                'documento' => $user->documento
            ]
        ], 200);
    }
}
