<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class CronogramaTarea
 * 
 * @property int $id
 * @property int $idSeguimiento
 * @property int|null $idpersona
 * @property string $task_id
 * @property string|null $parent_task_id
 * @property string $nombre
 * @property string|null $descripcion
 * @property Carbon $fecha_inicio
 * @property Carbon $fecha_fin
 * @property float|null $duracion
 * @property float|null $progreso
 * @property string|null $tipo
 * @property bool|null $abierto
 * @property int|null $orden
 * @property string|null $color
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Seguimiento $seguimiento
 *
 * @package App\Models
 */
class CronogramaTarea extends Model
{
	protected $table = 'cronograma_tareas';

	protected $casts = [
		'idSeguimiento' => 'int',
		'idpersona' => 'int',
		'fecha_inicio' => 'datetime',
		'fecha_fin' => 'datetime',
		'duracion' => 'float',
		'progreso' => 'float',
		'abierto' => 'bool',
		'orden' => 'int'
	];

	protected $fillable = [
		'idSeguimiento',
		'idpersona',
		'task_id',
		'parent_task_id',
		'nombre',
		'descripcion',
		'fecha_inicio',
		'fecha_fin',
		'duracion',
		'progreso',
		'tipo',
		'abierto',
		'orden',
		'color'
	];

	public function seguimiento()
	{
		return $this->belongsTo(Seguimiento::class, 'idSeguimiento');
	}
}
