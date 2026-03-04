<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Rol
 * 
 * @property int $idRol
 * @property string|null $nombre
 * 
 * @property Collection|CombinacionesPermiso[] $combinaciones_permisos
 *
 * @package App\Models
 */
class Rol extends Model
{
	protected $table = 'rol';
	protected $primaryKey = 'idRol';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];

	public function combinaciones_permisos()
	{
		return $this->hasMany(CombinacionesPermiso::class, 'idRol');
	}
}
