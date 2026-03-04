<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class TaskLevantamiento
 * 
 * @property int $id
 * @property int $task_id
 * @property Carbon|null $fecha_requerimiento
 * @property string|null $participantes
 * @property string|null $ubicacion
 * @property string|null $descripcion_requerimiento
 * @property string|null $observaciones
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Task $task
 *
 * @package App\Models
 */
class TaskLevantamiento extends Model
{
	protected $table = 'task_levantamientos';

	protected $casts = [
		'task_id' => 'int',
		'fecha_requerimiento' => 'datetime'
	];

	protected $fillable = [
		'task_id',
		'fecha_requerimiento',
		'participantes',
		'ubicacion',
		'descripcion_requerimiento',
		'observaciones'
	];

	public function task()
	{
		return $this->belongsTo(Task::class);
	}
}
