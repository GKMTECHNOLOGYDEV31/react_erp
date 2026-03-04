<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class TransicionStatusTicket
 * 
 * @property int $idTransicionStatus
 * @property int $idTickets
 * @property int|null $idVisitas
 * @property int $idEstadoots
 * @property string|null $justificacion
 * @property Carbon|null $fechaRegistro
 * @property bool|null $estado
 *
 * @package App\Models
 */
class TransicionStatusTicket extends Model
{
	protected $table = 'transicion_status_ticket';
	protected $primaryKey = 'idTransicionStatus';
	public $timestamps = false;

	protected $casts = [
		'idTickets' => 'int',
		'idVisitas' => 'int',
		'idEstadoots' => 'int',
		'fechaRegistro' => 'datetime',
		'estado' => 'bool'
	];

	protected $fillable = [
		'idTickets',
		'idVisitas',
		'idEstadoots',
		'justificacion',
		'fechaRegistro',
		'estado'
	];
}
