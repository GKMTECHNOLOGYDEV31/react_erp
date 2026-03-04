<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class NotificacionesVisita
 * 
 * @property int $id
 * @property int $idVisita
 * @property int $idTicket
 * @property string $numero_ticket
 * @property int|null $idUsuario
 * @property string $campo_modificado
 * @property string|null $valor_anterior
 * @property string|null $valor_nuevo
 * @property Carbon|null $creado_en
 * @property string|null $estado
 *
 * @package App\Models
 */
class NotificacionesVisita extends Model
{
	protected $table = 'notificaciones_visitas';
	public $timestamps = false;

	protected $casts = [
		'idVisita' => 'int',
		'idTicket' => 'int',
		'idUsuario' => 'int',
		'creado_en' => 'datetime'
	];

	protected $fillable = [
		'idVisita',
		'idTicket',
		'numero_ticket',
		'idUsuario',
		'campo_modificado',
		'valor_anterior',
		'valor_nuevo',
		'creado_en',
		'estado'
	];
}
