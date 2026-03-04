<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ProyectoSoftware
 * 
 * @property int $idProyectosoftware
 * @property string|null $nombre
 * @property Carbon|null $fechainicio
 * @property Carbon|null $fechafinal
 * @property int|null $idImportancia
 * @property int $idEstadoSoftware
 *
 * @package App\Models
 */
class ProyectoSoftware extends Model
{
	protected $table = 'proyecto_software';
	protected $primaryKey = 'idProyectosoftware';
	public $timestamps = false;

	protected $casts = [
		'fechainicio' => 'datetime',
		'fechafinal' => 'datetime',
		'idImportancia' => 'int',
		'idEstadoSoftware' => 'int'
	];

	protected $fillable = [
		'nombre',
		'fechainicio',
		'fechafinal',
		'idImportancia',
		'idEstadoSoftware'
	];
}
