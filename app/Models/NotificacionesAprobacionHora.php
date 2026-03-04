<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class NotificacionesAprobacionHora
 * 
 * @property int $idNotificacionAprobacionHoras
 * @property int|null $idAprobacion
 * @property string|null $estado_web
 * @property string|null $estado_app
 * @property Carbon|null $fecha
 * @property string|null $tipo
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property AprobacionHora|null $aprobacion_hora
 *
 * @package App\Models
 */
class NotificacionesAprobacionHora extends Model
{
	protected $table = 'notificaciones_aprobacion_horas';
	protected $primaryKey = 'idNotificacionAprobacionHoras';

	protected $casts = [
		'idAprobacion' => 'int',
		'fecha' => 'datetime'
	];

	protected $fillable = [
		'idAprobacion',
		'estado_web',
		'estado_app',
		'fecha',
		'tipo'
	];

	public function aprobacion_hora()
	{
		return $this->belongsTo(AprobacionHora::class, 'idAprobacion');
	}
}
