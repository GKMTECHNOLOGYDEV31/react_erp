<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class CotizacionProducto
 * 
 * @property int $id
 * @property int $cotizacion_id
 * @property int $articulo_id
 * @property string $descripcion
 * @property string|null $codigo_repuesto
 * @property float $precio_unitario
 * @property int $cantidad
 * @property float $subtotal
 * @property Carbon $created_at
 * @property Carbon $updated_at
 *
 * @package App\Models
 */
class CotizacionProducto extends Model
{
	protected $table = 'cotizacion_productos';

	protected $casts = [
		'cotizacion_id' => 'int',
		'articulo_id' => 'int',
		'precio_unitario' => 'float',
		'cantidad' => 'int',
		'subtotal' => 'float'
	];

	protected $fillable = [
		'cotizacion_id',
		'articulo_id',
		'descripcion',
		'codigo_repuesto',
		'precio_unitario',
		'cantidad',
		'subtotal'
	];
}
