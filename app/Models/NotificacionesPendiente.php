<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class NotificacionesPendiente
 * 
 * @property int $id
 * @property int|null $idUsuario
 * @property int|null $idTicket
 * @property int|null $idEstadflujo
 * @property string|null $tipo
 * @property string|null $estado
 * @property Carbon|null $creado_en
 *
 * @package App\Models
 */
class NotificacionesPendiente extends Model
{
	protected $table = 'notificaciones_pendientes';
	public $timestamps = false;

	protected $casts = [
		'idUsuario' => 'int',
		'idTicket' => 'int',
		'idEstadflujo' => 'int',
		'creado_en' => 'datetime'
	];

	protected $fillable = [
		'idUsuario',
		'idTicket',
		'idEstadflujo',
		'tipo',
		'estado',
		'creado_en'
	];
}
