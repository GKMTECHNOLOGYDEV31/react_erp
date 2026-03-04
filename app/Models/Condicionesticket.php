<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Condicionesticket
 * 
 * @property int $idCondicionesticket
 * @property int $idTickets
 * @property int $idVisitas
 * @property int|null $titular
 * @property string|null $nombre
 * @property string|null $dni
 * @property string|null $telefono
 * @property int|null $servicio
 * @property string|null $motivo
 * @property Carbon|null $fecha_condicion
 * @property string|null $imagen
 *
 * @package App\Models
 */
class Condicionesticket extends Model
{
	protected $table = 'condicionesticket';
	protected $primaryKey = 'idCondicionesticket';
	public $timestamps = false;

	protected $casts = [
		'idTickets' => 'int',
		'idVisitas' => 'int',
		'titular' => 'int',
		'servicio' => 'int',
		'fecha_condicion' => 'datetime'
	];

	protected $fillable = [
		'idTickets',
		'idVisitas',
		'titular',
		'nombre',
		'dni',
		'telefono',
		'servicio',
		'motivo',
		'fecha_condicion',
		'imagen'
	];
}
