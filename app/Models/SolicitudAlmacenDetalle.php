<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class SolicitudAlmacenDetalle
 * 
 * @property int $idSolicitudAlmacenDetalle
 * @property int $idSolicitudAlmacen
 * @property int|null $idArticulo
 * @property string $descripcion_producto
 * @property int $cantidad
 * @property string $unidad
 * @property float|null $precio_unitario_estimado
 * @property float|null $total_producto
 * @property string|null $categoria
 * @property string|null $codigo_producto
 * @property string|null $marca
 * @property string|null $especificaciones_tecnicas
 * @property string|null $proveedor_sugerido
 * @property string|null $justificacion_producto
 * @property string|null $estado
 * @property int|null $cantidad_aprobada
 * @property string|null $observaciones_detalle
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property SolicitudAlmacen $solicitud_almacen
 * @property Articulo|null $articulo
 * @property Collection|SolicitudCompraDetalle[] $solicitud_compra_detalles
 *
 * @package App\Models
 */
class SolicitudAlmacenDetalle extends Model
{
	protected $table = 'solicitud_almacen_detalle';
	protected $primaryKey = 'idSolicitudAlmacenDetalle';

	protected $casts = [
		'idSolicitudAlmacen' => 'int',
		'idArticulo' => 'int',
		'cantidad' => 'int',
		'precio_unitario_estimado' => 'float',
		'total_producto' => 'float',
		'cantidad_aprobada' => 'int'
	];

	protected $fillable = [
		'idSolicitudAlmacen',
		'idArticulo',
		'descripcion_producto',
		'cantidad',
		'unidad',
		'precio_unitario_estimado',
		'total_producto',
		'categoria',
		'codigo_producto',
		'marca',
		'especificaciones_tecnicas',
		'proveedor_sugerido',
		'justificacion_producto',
		'estado',
		'cantidad_aprobada',
		'observaciones_detalle'
	];

	public function solicitud_almacen()
	{
		return $this->belongsTo(SolicitudAlmacen::class, 'idSolicitudAlmacen');
	}

	public function articulo()
	{
		return $this->belongsTo(Articulo::class, 'idArticulo');
	}

	public function solicitud_compra_detalles()
	{
		return $this->hasMany(SolicitudCompraDetalle::class, 'idSolicitudAlmacenDetalle');
	}
}
