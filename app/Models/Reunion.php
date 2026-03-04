<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Reunion
 * 
 * @property int $idReunion
 * @property string|null $nombre
 * @property Carbon|null $fecha
 * @property int|null $encargado
 * @property int|null $idProyectosoftware
 * @property int|null $idProyectoparticipantes
 *
 * @package App\Models
 */
class Reunion extends Model
{
	protected $table = 'reunion';
	protected $primaryKey = 'idReunion';
	public $timestamps = false;

	protected $casts = [
		'fecha' => 'datetime',
		'encargado' => 'int',
		'idProyectosoftware' => 'int',
		'idProyectoparticipantes' => 'int'
	];

	protected $fillable = [
		'nombre',
		'fecha',
		'encargado',
		'idProyectosoftware',
		'idProyectoparticipantes'
	];
}
