<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class TaskReunione
 * 
 * @property int $id
 * @property int $task_id
 * @property Carbon|null $fecha_reunion
 * @property string|null $tipo_reunion
 * @property string|null $motivo_reunion
 * @property string|null $responsable_reunion
 * @property string|null $link_reunion
 * @property string|null $direccion_fisica
 * @property string|null $minuta
 * @property string|null $actividades
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Task $task
 * @property Collection|ReunionParticipantesComercial[] $reunion_participantes_comercials
 *
 * @package App\Models
 */
class TaskReunione extends Model
{
	protected $table = 'task_reuniones';

	protected $casts = [
		'task_id' => 'int',
		'fecha_reunion' => 'datetime'
	];

	protected $fillable = [
		'task_id',
		'fecha_reunion',
		'tipo_reunion',
		'motivo_reunion',
		'responsable_reunion',
		'link_reunion',
		'direccion_fisica',
		'minuta',
		'actividades'
	];

	public function task()
	{
		return $this->belongsTo(Task::class);
	}

	public function reunion_participantes_comercials()
	{
		return $this->hasMany(ReunionParticipantesComercial::class, 'reunion_id');
	}
}
