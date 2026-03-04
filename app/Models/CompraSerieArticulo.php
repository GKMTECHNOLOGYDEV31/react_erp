<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class CompraSerieArticulo
 * 
 * @property int $id
 * @property int $compra_id
 * @property int $detalle_compra_id
 * @property int $articulo_id
 * @property string $serie
 * @property string|null $estado
 * @property Carbon|null $fecha_ingreso
 * @property Carbon|null $fecha_actualizacion
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Compra $compra
 * @property DetalleCompra $detalle_compra
 * @property Articulo $articulo
 *
 * @package App\Models
 */
class CompraSerieArticulo extends Model
{
	protected $table = 'compra_serie_articulos';

	protected $casts = [
		'compra_id' => 'int',
		'detalle_compra_id' => 'int',
		'articulo_id' => 'int',
		'fecha_ingreso' => 'datetime',
		'fecha_actualizacion' => 'datetime'
	];

	protected $fillable = [
		'compra_id',
		'detalle_compra_id',
		'articulo_id',
		'serie',
		'estado',
		'fecha_ingreso',
		'fecha_actualizacion'
	];

	public function compra()
	{
		return $this->belongsTo(Compra::class);
	}

	public function detalle_compra()
	{
		return $this->belongsTo(DetalleCompra::class);
	}

	public function articulo()
	{
		return $this->belongsTo(Articulo::class);
	}
}
