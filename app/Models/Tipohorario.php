<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Tipohorario
 * 
 * @property int $idTipoHorario
 * @property string $nombre
 * 
 * @property Collection|Asistencia[] $asistencias
 *
 * @package App\Models
 */
class Tipohorario extends Model
{
	protected $table = 'tipohorario';
	protected $primaryKey = 'idTipoHorario';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];

	public function asistencias()
	{
		return $this->hasMany(Asistencia::class, 'idTipoHorario');
	}
}
