<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Tipousuario
 * 
 * @property int $idTipoUsuario
 * @property string|null $nombre
 * 
 * @property Collection|CombinacionesPermiso[] $combinaciones_permisos
 *
 * @package App\Models
 */
class Tipousuario extends Model
{
	protected $table = 'tipousuario';
	protected $primaryKey = 'idTipoUsuario';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];

	public function combinaciones_permisos()
	{
		return $this->hasMany(CombinacionesPermiso::class, 'idTipoUsuario');
	}
}
