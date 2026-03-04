<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class NotificacionesApoyo
 * 
 * @property int $idNotificacionApoyo
 * @property int $idTecnico
 * @property int $idTicket
 * @property int $idVisita
 * @property string|null $numero_ticket
 * @property Carbon|null $fecha_programada
 * @property Carbon|null $fecha_inicio_hora
 * @property Carbon|null $fecha_final_hora
 * @property int|null $enviado
 * @property Carbon|null $fecha_registro
 *
 * @package App\Models
 */
class NotificacionesApoyo extends Model
{
	protected $table = 'notificaciones_apoyo';
	protected $primaryKey = 'idNotificacionApoyo';
	public $timestamps = false;

	protected $casts = [
		'idTecnico' => 'int',
		'idTicket' => 'int',
		'idVisita' => 'int',
		'fecha_programada' => 'datetime',
		'fecha_inicio_hora' => 'datetime',
		'fecha_final_hora' => 'datetime',
		'enviado' => 'int',
		'fecha_registro' => 'datetime'
	];

	protected $fillable = [
		'idTecnico',
		'idTicket',
		'idVisita',
		'numero_ticket',
		'fecha_programada',
		'fecha_inicio_hora',
		'fecha_final_hora',
		'enviado',
		'fecha_registro'
	];
}
