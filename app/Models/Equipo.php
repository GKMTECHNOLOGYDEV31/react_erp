<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Equipo
 * 
 * @property int $idEquipos
 * @property string|null $nserie
 * @property string|null $modalidad
 * @property int|null $idTickets
 * @property int|null $idModelo
 * @property int|null $idMarca
 * @property int|null $idCategoria
 * @property int|null $idVisitas
 * @property string|null $observaciones
 * 
 * @property Visita|null $visita
 *
 * @package App\Models
 */
class Equipo extends Model
{
	protected $table = 'equipos';
	protected $primaryKey = 'idEquipos';
	public $timestamps = false;

	protected $casts = [
		'idTickets' => 'int',
		'idModelo' => 'int',
		'idMarca' => 'int',
		'idCategoria' => 'int',
		'idVisitas' => 'int'
	];

	protected $fillable = [
		'nserie',
		'modalidad',
		'idTickets',
		'idModelo',
		'idMarca',
		'idCategoria',
		'idVisitas',
		'observaciones'
	];

	public function visita()
	{
		return $this->belongsTo(Visita::class, 'idVisitas');
	}
}
