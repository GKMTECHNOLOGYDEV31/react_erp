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
            'correo' => 'required|email',
            'clave'  => 'required|string',
        ]);

        $user = Usuario::where('correo', $request->correo)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        // ⚠️ Si tu clave está encriptada con bcrypt
        if ($request->clave !== $user->clave) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        // Si usas Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user
        ]);
    }
}
