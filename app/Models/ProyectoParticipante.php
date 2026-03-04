<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ProyectoParticipante
 * 
 * @property int $idProyectoparticipantes
 * @property int|null $idProyectosoftware
 * @property int|null $idRolsoftware
 * @property int $idUsuario
 *
 * @package App\Models
 */
class ProyectoParticipante extends Model
{
	protected $table = 'proyecto_participantes';
	protected $primaryKey = 'idProyectoparticipantes';
	public $timestamps = false;

	protected $casts = [
		'idProyectosoftware' => 'int',
		'idRolsoftware' => 'int',
		'idUsuario' => 'int'
	];

	protected $fillable = [
		'idProyectosoftware',
		'idRolsoftware',
		'idUsuario'
	];
}
