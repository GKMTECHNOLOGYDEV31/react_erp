<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class TaskGanado
 * 
 * @property int $id
 * @property int $task_id
 * @property Carbon|null $fecha_ganado
 * @property string|null $codigo_cotizacion
 * @property string|null $tipo_relacion
 * @property string|null $tipo_servicio
 * @property float|null $valor_ganado
 * @property string|null $forma_cierre
 * @property string|null $duracion_acuerdo
 * @property string|null $observaciones
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Task $task
 *
 * @package App\Models
 */
class TaskGanado extends Model
{
	protected $table = 'task_ganados';

	protected $casts = [
		'task_id' => 'int',
		'fecha_ganado' => 'datetime',
		'valor_ganado' => 'float'
	];

	protected $fillable = [
		'task_id',
		'fecha_ganado',
		'codigo_cotizacion',
		'tipo_relacion',
		'tipo_servicio',
		'valor_ganado',
		'forma_cierre',
		'duracion_acuerdo',
		'observaciones'
	];

	public function task()
	{
		return $this->belongsTo(Task::class);
	}
}
