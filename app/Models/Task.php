<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Task
 * 
 * @property int $id
 * @property int $project_id
 * @property string $title
 * @property string|null $description
 * @property string|null $image
 * @property int|null $idseguimiento
 * @property int|null $idpersona
 * @property Carbon $date
 * @property Carbon|null $fecha_inicio
 * @property Carbon|null $fecha_fin
 * @property int|null $duracion
 * @property string|null $tags
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Project $project
 * @property Collection|TaskCotizacione[] $task_cotizaciones
 * @property Collection|TaskGanado[] $task_ganados
 * @property Collection|TaskLevantamiento[] $task_levantamientos
 * @property Collection|TaskObservado[] $task_observados
 * @property Collection|TaskRechazado[] $task_rechazados
 * @property Collection|TaskReunione[] $task_reuniones
 *
 * @package App\Models
 */
class Task extends Model
{
	protected $table = 'tasks';

	protected $casts = [
		'project_id' => 'int',
		'idseguimiento' => 'int',
		'idpersona' => 'int',
		'date' => 'datetime',
		'fecha_inicio' => 'datetime',
		'fecha_fin' => 'datetime',
		'duracion' => 'int'
	];

	protected $fillable = [
		'project_id',
		'title',
		'description',
		'image',
		'idseguimiento',
		'idpersona',
		'date',
		'fecha_inicio',
		'fecha_fin',
		'duracion',
		'tags'
	];

	public function project()
	{
		return $this->belongsTo(Project::class);
	}

	public function task_cotizaciones()
	{
		return $this->hasMany(TaskCotizacione::class);
	}

	public function task_ganados()
	{
		return $this->hasMany(TaskGanado::class);
	}

	public function task_levantamientos()
	{
		return $this->hasMany(TaskLevantamiento::class);
	}

	public function task_observados()
	{
		return $this->hasMany(TaskObservado::class);
	}

	public function task_rechazados()
	{
		return $this->hasMany(TaskRechazado::class);
	}

	public function task_reuniones()
	{
		return $this->hasMany(TaskReunione::class);
	}
}
