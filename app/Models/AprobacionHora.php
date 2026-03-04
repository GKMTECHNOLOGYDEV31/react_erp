<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class AprobacionHora
 * 
 * @property int $idAprobacion
 * @property int $idAsistencia
 * @property int $idUsuario
 * @property Carbon $fechaHora_original
 * @property string|null $tipo_marca
 * @property int $umbral_minutos
 * @property int|null $diferencia_minutos
 * @property Carbon|null $fechaHora_modificada
 * @property string $estado
 * @property string|null $comentario
 * @property int|null $revisado_por
 * @property Carbon|null $revisado_at
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Asistencia $asistencia
 * @property Usuario $usuario
 * @property Collection|NotificacionesAprobacionHora[] $notificaciones_aprobacion_horas
 *
 * @package App\Models
 */
class AprobacionHora extends Model
{
	protected $table = 'aprobacion_horas';
	protected $primaryKey = 'idAprobacion';

	protected $casts = [
		'idAsistencia' => 'int',
		'idUsuario' => 'int',
		'fechaHora_original' => 'datetime',
		'umbral_minutos' => 'int',
		'diferencia_minutos' => 'int',
		'fechaHora_modificada' => 'datetime',
		'revisado_por' => 'int',
		'revisado_at' => 'datetime'
	];

	protected $fillable = [
		'idAsistencia',
		'idUsuario',
		'fechaHora_original',
		'tipo_marca',
		'umbral_minutos',
		'diferencia_minutos',
		'fechaHora_modificada',
		'estado',
		'comentario',
		'revisado_por',
		'revisado_at'
	];

	public function asistencia()
	{
		return $this->belongsTo(Asistencia::class, 'idAsistencia');
	}

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}

	public function notificaciones_aprobacion_horas()
	{
		return $this->hasMany(NotificacionesAprobacionHora::class, 'idAprobacion');
	}
}
