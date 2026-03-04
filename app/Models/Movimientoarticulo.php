<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Movimientoarticulo
 * 
 * @property int $idMovimientoArticulo
 * @property Carbon|null $fecha_movimiento
 * @property string|null $imagen
 * @property int|null $cantidad
 * @property int $idTipoMovimiento
 * @property int $idArticulos
 * @property int $idUbicacion
 * @property int $idContacto
 *
 * @package App\Models
 */
class Movimientoarticulo extends Model
{
	protected $table = 'movimientoarticulo';
	protected $primaryKey = 'idMovimientoArticulo';
	public $timestamps = false;

	protected $casts = [
		'fecha_movimiento' => 'datetime',
		'cantidad' => 'int',
		'idTipoMovimiento' => 'int',
		'idArticulos' => 'int',
		'idUbicacion' => 'int',
		'idContacto' => 'int'
	];

	protected $fillable = [
		'fecha_movimiento',
		'imagen',
		'cantidad',
		'idTipoMovimiento',
		'idArticulos',
		'idUbicacion',
		'idContacto'
	];
}
