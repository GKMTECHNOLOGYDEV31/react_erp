<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class NotificacionesObservacione
 * 
 * @property int $idNotificacionObservacion
 * @property int $idUsuario
 * @property int $idObservaciones
 * @property int|null $estado
 * @property Carbon|null $fechaHora
 * 
 * @property Usuario $usuario
 * @property Observacione $observacione
 *
 * @package App\Models
 */
class NotificacionesObservacione extends Model
{
	protected $table = 'notificaciones_observaciones';
	protected $primaryKey = 'idNotificacionObservacion';
	public $timestamps = false;

	protected $casts = [
		'idUsuario' => 'int',
		'idObservaciones' => 'int',
		'estado' => 'int',
		'fechaHora' => 'datetime'
	];

	protected $fillable = [
		'idUsuario',
		'idObservaciones',
		'estado',
		'fechaHora'
	];

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}

	public function observacione()
	{
		return $this->belongsTo(Observacione::class, 'idObservaciones');
	}
}
