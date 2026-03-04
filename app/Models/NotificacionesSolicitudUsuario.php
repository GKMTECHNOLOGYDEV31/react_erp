<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class NotificacionesSolicitudUsuario
 * 
 * @property int $id
 * @property int $idNotificacionSolicitud
 * @property int $idUsuario
 * @property int $estado_app
 * @property int $estado_ws
 * @property int $estado_fcm
 * @property int $intentos
 * @property string|null $last_error
 * @property Carbon|null $last_send_at
 * @property Carbon|null $delivered_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @package App\Models
 */
class NotificacionesSolicitudUsuario extends Model
{
	protected $table = 'notificaciones_solicitud_usuarios';

	protected $casts = [
		'idNotificacionSolicitud' => 'int',
		'idUsuario' => 'int',
		'estado_app' => 'int',
		'estado_ws' => 'int',
		'estado_fcm' => 'int',
		'intentos' => 'int',
		'last_send_at' => 'datetime',
		'delivered_at' => 'datetime'
	];

	protected $fillable = [
		'idNotificacionSolicitud',
		'idUsuario',
		'estado_app',
		'estado_ws',
		'estado_fcm',
		'intentos',
		'last_error',
		'last_send_at',
		'delivered_at'
	];
}
