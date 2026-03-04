<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Tarea
 * 
 * @property int $idTareas
 * @property string|null $nombre
 * @property string|null $descripcion
 * @property Carbon|null $fechaLimite
 * @property bool|null $dificultad
 * @property int|null $idImportancia
 * @property int|null $idProyectosoftware
 *
 * @package App\Models
 */
class Tarea extends Model
{
	protected $table = 'tareas';
	protected $primaryKey = 'idTareas';
	public $timestamps = false;

	protected $casts = [
		'fechaLimite' => 'datetime',
		'dificultad' => 'bool',
		'idImportancia' => 'int',
		'idProyectosoftware' => 'int'
	];

	protected $fillable = [
		'nombre',
		'descripcion',
		'fechaLimite',
		'dificultad',
		'idImportancia',
		'idProyectosoftware'
	];
}
