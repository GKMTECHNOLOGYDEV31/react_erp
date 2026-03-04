<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TareasParticipante
 * 
 * @property int $idTareasparticipantes
 * @property int|null $idEstadotarea
 * @property int|null $idTareas
 * @property int $idEstadoSoftware
 *
 * @package App\Models
 */
class TareasParticipante extends Model
{
	protected $table = 'tareas_participantes';
	protected $primaryKey = 'idTareasparticipantes';
	public $timestamps = false;

	protected $casts = [
		'idEstadotarea' => 'int',
		'idTareas' => 'int',
		'idEstadoSoftware' => 'int'
	];

	protected $fillable = [
		'idEstadotarea',
		'idTareas',
		'idEstadoSoftware'
	];
}
