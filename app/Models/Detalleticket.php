<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Detalleticket
 * 
 * @property int $idLevatamientoinformacion
 * @property string|null $diagnostico
 * @property string|null $trabajo_realizar
 * @property int|null $idTickets
 * @property int $idNivelIncidencia
 * @property string|null $observaciones
 * @property string|null $servicioRealizado
 *
 * @package App\Models
 */
class Detalleticket extends Model
{
	protected $table = 'detalleticket';
	protected $primaryKey = 'idLevatamientoinformacion';
	public $timestamps = false;

	protected $casts = [
		'idTickets' => 'int',
		'idNivelIncidencia' => 'int'
	];

	protected $fillable = [
		'diagnostico',
		'trabajo_realizar',
		'idTickets',
		'idNivelIncidencia',
		'observaciones',
		'servicioRealizado'
	];
}
