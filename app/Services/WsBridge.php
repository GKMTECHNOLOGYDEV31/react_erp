<?php

namespace App\Services;

use WebSocket\Client;

class WsBridge
{
    public static function emitSolicitudEvento(array $payload): void
    {
        $wsUrl = env('GKM_WS_URL'); // ejemplo: ws://tu-dominio:PUERTO
        if (!$wsUrl) {
            throw new \RuntimeException("Falta GKM_WS_URL en .env");
        }

        $client = new Client($wsUrl, [
            'timeout' => 2,
        ]);

        $client->send(json_encode($payload, JSON_UNESCAPED_UNICODE));
        $client->close();
    }
}
