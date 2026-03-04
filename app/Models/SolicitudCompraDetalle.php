<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class SolicitudCompraDetalle
 * 
 * @property int $idSolicitudCompraDetalle
 * @property int $idSolicitudCompra
 * @property int|null $idSolicitudAlmacenDetalle
 * @property int|null $idArticulo
 * @property string $descripcion_producto
 * @property string|null $categoria
 * @property int $cantidad
 * @property string|null $unidad
 * @property float $precio_unitario_estimado
 * @property float $total_producto
 * @property string|null $codigo_producto
 * @property string|null $marca
 * @property string|null $especificaciones_tecnicas
 * @property string|null $proveedor_sugerido
 * @property string|null $justificacion_producto
 * @property string|null $estado
 * @property int|null $cantidad_aprobada
 * @property string|null $observaciones_detalle
 * @property int|null $idMonedas
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Moneda|null $moneda
 * @property SolicitudCompra $solicitud_compra
 * @property SolicitudAlmacenDetalle|null $solicitud_almacen_detalle
 *
 * @package App\Models
 */
class SolicitudCompraDetalle extends Model
{
	protected $table = 'solicitud_compra_detalle';
	protected $primaryKey = 'idSolicitudCompraDetalle';

	protected $casts = [
		'idSolicitudCompra' => 'int',
		'idSolicitudAlmacenDetalle' => 'int',
		'idArticulo' => 'int',
		'cantidad' => 'int',
		'precio_unitario_estimado' => 'float',
		'total_producto' => 'float',
		'cantidad_aprobada' => 'int',
		'idMonedas' => 'int'
	];

	protected $fillable = [
		'idSolicitudCompra',
		'idSolicitudAlmacenDetalle',
		'idArticulo',
		'descripcion_producto',
		'categoria',
		'cantidad',
		'unidad',
		'precio_unitario_estimado',
		'total_producto',
		'codigo_producto',
		'marca',
		'especificaciones_tecnicas',
		'proveedor_sugerido',
		'justificacion_producto',
		'estado',
		'cantidad_aprobada',
		'observaciones_detalle',
		'idMonedas'
	];

	public function moneda()
	{
		return $this->belongsTo(Moneda::class, 'idMonedas');
	}

	public function solicitud_compra()
	{
		return $this->belongsTo(SolicitudCompra::class, 'idSolicitudCompra');
	}

	public function solicitud_almacen_detalle()
	{
		return $this->belongsTo(SolicitudAlmacenDetalle::class, 'idSolicitudAlmacenDetalle');
	}
}
