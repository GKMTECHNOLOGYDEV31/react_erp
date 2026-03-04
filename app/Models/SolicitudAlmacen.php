<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class SolicitudAlmacen
 * 
 * @property int $idSolicitudAlmacen
 * @property string $codigo_solicitud
 * @property string $titulo
 * @property int $idTipoSolicitud
 * @property string $solicitante
 * @property int $idPrioridad
 * @property Carbon $fecha_requerida
 * @property int|null $idCentroCosto
 * @property int|null $idTipoArea
 * @property string $descripcion
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
 * @property int|null $idsolicitudArticulo
 * 
 * @property TipoSolicitud $tipo_solicitud
 * @property PrioridadSolicitud $prioridad_solicitud
 * @property CentroCosto|null $centro_costo
 * @property Collection|SolicitudAlmacenArchivo[] $solicitud_almacen_archivos
 * @property Collection|SolicitudAlmacenDetalle[] $solicitud_almacen_detalles
 * @property Collection|SolicitudAlmacenHistorial[] $solicitud_almacen_historials
 *
 * @package App\Models
 */
class SolicitudAlmacen extends Model
{
	protected $table = 'solicitud_almacen';
	protected $primaryKey = 'idSolicitudAlmacen';

	protected $casts = [
		'idTipoSolicitud' => 'int',
		'idPrioridad' => 'int',
		'fecha_requerida' => 'datetime',
		'idCentroCosto' => 'int',
		'idTipoArea' => 'int',
		'subtotal' => 'float',
		'iva' => 'float',
		'total' => 'float',
		'total_unidades' => 'int',
		'fecha_aprobacion' => 'datetime',
		'aprobado_por' => 'int',
		'idsolicitudArticulo' => 'int'
	];

	protected $fillable = [
		'codigo_solicitud',
		'titulo',
		'idTipoSolicitud',
		'solicitante',
		'idPrioridad',
		'fecha_requerida',
		'idCentroCosto',
		'idTipoArea',
		'descripcion',
		'justificacion',
		'observaciones',
		'subtotal',
		'iva',
		'total',
		'total_unidades',
		'estado',
		'motivo_rechazo',
		'fecha_aprobacion',
		'aprobado_por',
		'idsolicitudArticulo'
	];

	public function tipo_solicitud()
	{
		return $this->belongsTo(TipoSolicitud::class, 'idTipoSolicitud');
	}

	public function prioridad_solicitud()
	{
		return $this->belongsTo(PrioridadSolicitud::class, 'idPrioridad');
	}

	public function centro_costo()
	{
		return $this->belongsTo(CentroCosto::class, 'idCentroCosto');
	}

	public function solicitud_almacen_archivos()
	{
		return $this->hasMany(SolicitudAlmacenArchivo::class, 'idSolicitudAlmacen');
	}

	public function solicitud_almacen_detalles()
	{
		return $this->hasMany(SolicitudAlmacenDetalle::class, 'idSolicitudAlmacen');
	}

	public function solicitud_almacen_historials()
	{
		return $this->hasMany(SolicitudAlmacenHistorial::class, 'idSolicitudAlmacen');
	}
}
