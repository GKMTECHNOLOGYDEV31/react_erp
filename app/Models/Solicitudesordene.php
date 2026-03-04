<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Solicitudesordene
 * 
 * @property int $idSolicitudesOrdenes
 * @property Carbon|null $fechaCreacion
 * @property string|null $estado
 * @property string|null $fechaEntrega
 * @property string|null $numeroTicket
 * @property string|null $codigo
 * @property int $idTipoServicio
 * @property int|null $idTecnico
 * @property int $idUsuario
 * @property string|null $tipoorden
 * @property int|null $idticket
 * @property Carbon|null $fecharequerida
 * @property string|null $niveldeurgencia
 * @property string|null $tiposervicio
 * @property string|null $observaciones
 * @property int|null $cantidad
 * @property int|null $canproduuni
 * @property int|null $totalcantidadproductos
 * @property string|null $urgencia
 * @property string|null $codigo_cotizacion
 * @property int|null $id_area_destino
 * @property int|null $id_usuario_destino
 * @property Carbon|null $fechaactualizacion
 * @property Carbon|null $fechaaprobacion
 * @property int|null $idaprobador
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property bool|null $es_uso_diario
 * @property string|null $observacion_devolucion
 * @property int|null $idCast
 * @property int|null $idVisita
 * 
 * @property Collection|NotificacionesSolicitud[] $notificaciones_solicituds
 * @property Collection|RepuestosEntrega[] $repuestos_entregas
 * @property Collection|RepuestosEnviosProvincium[] $repuestos_envios_provincia
 *
 * @package App\Models
 */
class Solicitudesordene extends Model
{
	protected $table = 'solicitudesordenes';
	protected $primaryKey = 'idSolicitudesOrdenes';

	protected $casts = [
		'fechaCreacion' => 'datetime',
		'idTipoServicio' => 'int',
		'idTecnico' => 'int',
		'idUsuario' => 'int',
		'idticket' => 'int',
		'fecharequerida' => 'datetime',
		'cantidad' => 'int',
		'canproduuni' => 'int',
		'totalcantidadproductos' => 'int',
		'id_area_destino' => 'int',
		'id_usuario_destino' => 'int',
		'fechaactualizacion' => 'datetime',
		'fechaaprobacion' => 'datetime',
		'idaprobador' => 'int',
		'es_uso_diario' => 'bool',
		'idCast' => 'int',
		'idVisita' => 'int'
	];

	protected $fillable = [
		'fechaCreacion',
		'estado',
		'fechaEntrega',
		'numeroTicket',
		'codigo',
		'idTipoServicio',
		'idTecnico',
		'idUsuario',
		'tipoorden',
		'idticket',
		'fecharequerida',
		'niveldeurgencia',
		'tiposervicio',
		'observaciones',
		'cantidad',
		'canproduuni',
		'totalcantidadproductos',
		'urgencia',
		'codigo_cotizacion',
		'id_area_destino',
		'id_usuario_destino',
		'fechaactualizacion',
		'fechaaprobacion',
		'idaprobador',
		'es_uso_diario',
		'observacion_devolucion',
		'idCast',
		'idVisita'
	];

	public function notificaciones_solicituds()
	{
		return $this->hasMany(NotificacionesSolicitud::class, 'idSolicitudesOrdenes');
	}

	public function repuestos_entregas()
	{
		return $this->hasMany(RepuestosEntrega::class, 'solicitud_id');
	}

	public function repuestos_envios_provincia()
	{
		return $this->hasMany(RepuestosEnviosProvincium::class, 'solicitud_id');
	}
}
