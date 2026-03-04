<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class CombinacionesPermiso
 * 
 * @property int $idCombinacion
 * @property int $idRol
 * @property int $idTipoUsuario
 * @property int $idTipoArea
 * @property string|null $nombre_combinacion
 * @property string|null $descripcion
 * @property int|null $estado
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Rol $rol
 * @property Tipousuario $tipousuario
 * @property Tipoarea $tipoarea
 *
 * @package App\Models
 */
class CombinacionesPermiso extends Model
{
	protected $table = 'combinaciones_permisos';
	protected $primaryKey = 'idCombinacion';

	protected $casts = [
		'idRol' => 'int',
		'idTipoUsuario' => 'int',
		'idTipoArea' => 'int',
		'estado' => 'int'
	];

	protected $fillable = [
		'idRol',
		'idTipoUsuario',
		'idTipoArea',
		'nombre_combinacion',
		'descripcion',
		'estado'
	];

	public function rol()
	{
		return $this->belongsTo(Rol::class, 'idRol');
	}

	public function tipousuario()
	{
		return $this->belongsTo(Tipousuario::class, 'idTipoUsuario');
	}

	public function tipoarea()
	{
		return $this->belongsTo(Tipoarea::class, 'idTipoArea');
	}
}
