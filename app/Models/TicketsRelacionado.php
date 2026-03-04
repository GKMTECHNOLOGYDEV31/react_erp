<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class TicketsRelacionado
 * 
 * @property int $id
 * @property int $idTicketOrigen
 * @property int $idTicketRelacionado
 * @property string|null $numero_serie
 * @property Carbon|null $fecha_registro
 *
 * @package App\Models
 */
class TicketsRelacionado extends Model
{
	protected $table = 'tickets_relacionados';
	public $timestamps = false;

	protected $casts = [
		'idTicketOrigen' => 'int',
		'idTicketRelacionado' => 'int',
		'fecha_registro' => 'datetime'
	];

	protected $fillable = [
		'idTicketOrigen',
		'idTicketRelacionado',
		'numero_serie',
		'fecha_registro'
	];
}
