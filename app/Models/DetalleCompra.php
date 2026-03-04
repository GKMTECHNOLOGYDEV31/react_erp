<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class DetalleCompra
 * 
 * @property int $idDetalleCompra
 * @property int $idCompra
 * @property int $idProducto
 * @property int $cantidad
 * @property float $precio
 * @property float|null $precio_venta
 * @property float $subtotal
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $estado
 * 
 * @property Collection|CompraSerieArticulo[] $compra_serie_articulos
 *
 * @package App\Models
 */
class DetalleCompra extends Model
{
	protected $table = 'detalle_compra';
	protected $primaryKey = 'idDetalleCompra';

	protected $casts = [
		'idCompra' => 'int',
		'idProducto' => 'int',
		'cantidad' => 'int',
		'precio' => 'float',
		'precio_venta' => 'float',
		'subtotal' => 'float'
	];

	protected $fillable = [
		'idCompra',
		'idProducto',
		'cantidad',
		'precio',
		'precio_venta',
		'subtotal',
		'estado'
	];

	public function compra_serie_articulos()
	{
		return $this->hasMany(CompraSerieArticulo::class);
	}
}
