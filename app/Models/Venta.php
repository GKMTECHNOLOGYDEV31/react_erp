<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Venta
 * 
 * @property int $idVentas
 * @property Carbon|null $fecha_aprobacion
 * @property bool|null $estado
 * @property int $idCotizaciones
 *
 * @package App\Models
 */
class Venta extends Model
{
	protected $table = 'ventas';
	protected $primaryKey = 'idVentas';
	public $timestamps = false;

	protected $casts = [
		'fecha_aprobacion' => 'datetime',
		'estado' => 'bool',
		'idCotizaciones' => 'int'
	];

	protected $fillable = [
		'fecha_aprobacion',
		'estado',
		'idCotizaciones'
	];
}
