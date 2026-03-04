<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class TaskRechazado
 * 
 * @property int $id
 * @property int $task_id
 * @property Carbon|null $fecha_rechazo
 * @property string|null $motivo_rechazo
 * @property string|null $comentarios_cliente
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Task $task
 *
 * @package App\Models
 */
class TaskRechazado extends Model
{
	protected $table = 'task_rechazados';

	protected $casts = [
		'task_id' => 'int',
		'fecha_rechazo' => 'datetime'
	];

	protected $fillable = [
		'task_id',
		'fecha_rechazo',
		'motivo_rechazo',
		'comentarios_cliente'
	];

	public function task()
	{
		return $this->belongsTo(Task::class);
	}
}
