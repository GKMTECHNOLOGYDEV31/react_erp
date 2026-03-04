<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class DetalleCotizacion
 * 
 * @property int $idDetalleCotizacion
 * @property int|null $detalle_cantidad
 * @property float|null $detalle_precio_compra
 * @property float|null $detalle_precio_venta
 * @property float|null $detalle_total
 * @property string|null $detalle_descripcion
 * @property string|null $cotizaciones_codigo
 * @property int $idCotizaciones
 * @property int $idServicios
 * @property int $idCredito
 * @property int $idKit
 * @property int $idArticulos
 *
 * @package App\Models
 */
class DetalleCotizacion extends Model
{
	protected $table = 'detalle_cotizacion';
	protected $primaryKey = 'idDetalleCotizacion';
	public $timestamps = false;

	protected $casts = [
		'detalle_cantidad' => 'int',
		'detalle_precio_compra' => 'float',
		'detalle_precio_venta' => 'float',
		'detalle_total' => 'float',
		'idCotizaciones' => 'int',
		'idServicios' => 'int',
		'idCredito' => 'int',
		'idKit' => 'int',
		'idArticulos' => 'int'
	];

	protected $fillable = [
		'detalle_cantidad',
		'detalle_precio_compra',
		'detalle_precio_venta',
		'detalle_total',
		'detalle_descripcion',
		'cotizaciones_codigo',
		'idCotizaciones',
		'idServicios',
		'idCredito',
		'idKit',
		'idArticulos'
	];
}
