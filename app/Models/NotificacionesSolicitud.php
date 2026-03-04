<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class NotificacionesSolicitud
 * 
 * @property int $idNotificacionSolicitud
 * @property int|null $idSolicitudesOrdenes
 * @property string|null $estado_web
 * @property string|null $estado_app
 * @property Carbon|null $fecha
 * @property string|null $tipo
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Solicitudesordene|null $solicitudesordene
 *
 * @package App\Models
 */
class NotificacionesSolicitud extends Model
{
	protected $table = 'notificaciones_solicitud';
	protected $primaryKey = 'idNotificacionSolicitud';

	protected $casts = [
		'idSolicitudesOrdenes' => 'int',
		'fecha' => 'datetime'
	];

	protected $fillable = [
		'idSolicitudesOrdenes',
		'estado_web',
		'estado_app',
		'fecha',
		'tipo'
	];

	public function solicitudesordene()
	{
		return $this->belongsTo(Solicitudesordene::class, 'idSolicitudesOrdenes');
	}
}
