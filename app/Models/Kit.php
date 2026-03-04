<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Kit
 * 
 * @property int $idKit
 * @property string|null $codigo
 * @property string|null $nombre
 * @property string|null $descripcion
 * @property float|null $precio_compra
 * @property float|null $precio
 * @property Carbon|null $fecha
 * @property int|null $monedaVenta
 * @property string|null $sku
 * @property int|null $stock_total
 * @property int|null $stock_minimo
 * @property float|null $precio_venta
 * @property string|null $foto
 *
 * @package App\Models
 */
class Kit extends Model
{
	protected $table = 'kit';
	protected $primaryKey = 'idKit';
	public $timestamps = false;

	protected $casts = [
		'precio_compra' => 'float',
		'precio' => 'float',
		'fecha' => 'datetime',
		'monedaVenta' => 'int',
		'stock_total' => 'int',
		'stock_minimo' => 'int',
		'precio_venta' => 'float'
	];

	protected $fillable = [
		'codigo',
		'nombre',
		'descripcion',
		'precio_compra',
		'precio',
		'fecha',
		'monedaVenta',
		'sku',
		'stock_total',
		'stock_minimo',
		'precio_venta',
		'foto'
	];
}
