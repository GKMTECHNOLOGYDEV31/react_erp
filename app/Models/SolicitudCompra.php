<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class SolicitudCompra
 * 
 * @property int $idSolicitudCompra
 * @property string $codigo_solicitud
 * @property int|null $idSolicitudAlmacen
 * @property string|null $solicitante
 * @property string|null $solicitante_compra
 * @property string|null $solicitante_almacen
 * @property int $idTipoArea
 * @property int $idPrioridad
 * @property Carbon $fecha_requerida
 * @property int|null $idCentroCosto
 * @property string|null $proyecto_asociado
 * @property string $justificacion
 * @property string|null $observaciones
 * @property float|null $subtotal
 * @property float|null $iva
 * @property float|null $total
 * @property int|null $total_unidades
 * @property string|null $estado
 * @property string|null $motivo_rechazo
 * @property Carbon|null $fecha_aprobacion
 * @property int|null $aprobado_por
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Collection|SolicitudCompraArchivo[] $solicitud_compra_archivos
 * @property Collection|SolicitudCompraDetalle[] $solicitud_compra_detalles
 *
 * @package App\Models
 */
class SolicitudCompra extends Model
{
	protected $table = 'solicitud_compra';
	protected $primaryKey = 'idSolicitudCompra';

	protected $casts = [
		'idSolicitudAlmacen' => 'int',
		'idTipoArea' => 'int',
		'idPrioridad' => 'int',
		'fecha_requerida' => 'datetime',
		'idCentroCosto' => 'int',
		'subtotal' => 'float',
		'iva' => 'float',
		'total' => 'float',
		'total_unidades' => 'int',
		'fecha_aprobacion' => 'datetime',
		'aprobado_por' => 'int'
	];

	protected $fillable = [
		'codigo_solicitud',
		'idSolicitudAlmacen',
		'solicitante',
		'solicitante_compra',
		'solicitante_almacen',
		'idTipoArea',
		'idPrioridad',
		'fecha_requerida',
		'idCentroCosto',
		'proyecto_asociado',
		'justificacion',
		'observaciones',
		'subtotal',
		'iva',
		'total',
		'total_unidades',
		'estado',
		'motivo_rechazo',
		'fecha_aprobacion',
		'aprobado_por'
	];

	public function solicitud_compra_archivos()
	{
		return $this->hasMany(SolicitudCompraArchivo::class, 'idSolicitudCompra');
	}

	public function solicitud_compra_detalles()
	{
		return $this->hasMany(SolicitudCompraDetalle::class, 'idSolicitudCompra');
	}
}
