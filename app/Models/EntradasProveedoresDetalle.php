<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class EntradasProveedoresDetalle
 * 
 * @property int $id
 * @property int $entrada_id
 * @property int $articulo_id
 * @property int $cantidad
 * @property float|null $precio_unitario
 * @property float|null $subtotal
 * @property string|null $ubicacion
 * @property string|null $lote
 * @property Carbon|null $fecha_vencimiento
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $estado
 * 
 * @property Articulo $articulo
 * @property EntradasProveedore $entradas_proveedore
 *
 * @package App\Models
 */
class EntradasProveedoresDetalle extends Model
{
	protected $table = 'entradas_proveedores_detalle';

	protected $casts = [
		'entrada_id' => 'int',
		'articulo_id' => 'int',
		'cantidad' => 'int',
		'precio_unitario' => 'float',
		'subtotal' => 'float',
		'fecha_vencimiento' => 'datetime'
	];

	protected $fillable = [
		'entrada_id',
		'articulo_id',
		'cantidad',
		'precio_unitario',
		'subtotal',
		'ubicacion',
		'lote',
		'fecha_vencimiento',
		'estado'
	];

	public function articulo()
	{
		return $this->belongsTo(Articulo::class);
	}

	public function entradas_proveedore()
	{
		return $this->belongsTo(EntradasProveedore::class, 'entrada_id');
	}
}
