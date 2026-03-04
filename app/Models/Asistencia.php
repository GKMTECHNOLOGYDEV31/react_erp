<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Asistencia
 * 
 * @property int $idAsistencia
 * @property int $idUsuario
 * @property Carbon $fechaHora
 * @property float $lat
 * @property float $lng
 * @property string $ubicacion
 * @property int $idTipoHorario
 * 
 * @property Usuario $usuario
 * @property Tipohorario $tipohorario
 * @property Collection|AprobacionHora[] $aprobacion_horas
 *
 * @package App\Models
 */
class Asistencia extends Model
{
	protected $table = 'asistencias';
	protected $primaryKey = 'idAsistencia';
	public $timestamps = false;

	protected $casts = [
		'idUsuario' => 'int',
		'fechaHora' => 'datetime',
		'lat' => 'float',
		'lng' => 'float',
		'idTipoHorario' => 'int'
	];

	protected $fillable = [
		'idUsuario',
		'fechaHora',
		'lat',
		'lng',
		'ubicacion',
		'idTipoHorario'
	];

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}

	public function tipohorario()
	{
		return $this->belongsTo(Tipohorario::class, 'idTipoHorario');
	}

	public function aprobacion_horas()
	{
		return $this->hasMany(AprobacionHora::class, 'idAsistencia');
	}
}
