<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class TaskObservado
 * 
 * @property int $id
 * @property int $task_id
 * @property Carbon|null $fecha_observado
 * @property string|null $estado_actual
 * @property string|null $detalles
 * @property string|null $comentarios
 * @property string|null $acciones_pendientes
 * @property string|null $detalle_observado
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Task $task
 *
 * @package App\Models
 */
class TaskObservado extends Model
{
	protected $table = 'task_observados';

	protected $casts = [
		'task_id' => 'int',
		'fecha_observado' => 'datetime'
	];

	protected $fillable = [
		'task_id',
		'fecha_observado',
		'estado_actual',
		'detalles',
		'comentarios',
		'acciones_pendientes',
		'detalle_observado'
	];

	public function task()
	{
		return $this->belongsTo(Task::class);
	}
}
