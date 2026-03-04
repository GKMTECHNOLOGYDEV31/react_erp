<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Vehiculo
 * 
 * @property int $idVehiculo
 * @property string $numero_placa
 * @property int|null $idUsuario
 * @property int|null $idVisitas
 * 
 * @property Usuario|null $usuario
 * @property Visita|null $visita
 *
 * @package App\Models
 */
class Vehiculo extends Model
{
	protected $table = 'vehiculos';
	protected $primaryKey = 'idVehiculo';
	public $timestamps = false;

	protected $casts = [
		'idUsuario' => 'int',
		'idVisitas' => 'int'
	];

	protected $fillable = [
		'numero_placa',
		'idUsuario',
		'idVisitas'
	];

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}

	public function visita()
	{
		return $this->belongsTo(Visita::class, 'idVisitas');
	}
}
