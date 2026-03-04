<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class NotificacionesTicket
 * 
 * @property int $idNotificacion
 * @property int $idUsuario
 * @property int $idTickets
 * @property int $idVisitas
 * @property string|null $numero_ticket
 * @property string|null $nombreUsuario
 * @property string|null $estado
 * @property Carbon|null $fecha_programada
 * @property Carbon|null $fecha_inicio_hora
 * @property Carbon|null $fecha_final_hora
 * @property int|null $enviado
 * @property Carbon|null $fecha_registro
 * @property int|null $necesita_apoyo
 * @property string|null $tipo
 *
 * @package App\Models
 */
class NotificacionesTicket extends Model
{
	protected $table = 'notificaciones_ticket';
	protected $primaryKey = 'idNotificacion';
	public $timestamps = false;

	protected $casts = [
		'idUsuario' => 'int',
		'idTickets' => 'int',
		'idVisitas' => 'int',
		'fecha_programada' => 'datetime',
		'fecha_inicio_hora' => 'datetime',
		'fecha_final_hora' => 'datetime',
		'enviado' => 'int',
		'fecha_registro' => 'datetime',
		'necesita_apoyo' => 'int'
	];

	protected $fillable = [
		'idUsuario',
		'idTickets',
		'idVisitas',
		'numero_ticket',
		'nombreUsuario',
		'estado',
		'fecha_programada',
		'fecha_inicio_hora',
		'fecha_final_hora',
		'enviado',
		'fecha_registro',
		'necesita_apoyo',
		'tipo'
	];
}
