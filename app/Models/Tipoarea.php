<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Tipoarea
 * 
 * @property int $idTipoArea
 * @property string|null $nombre
 * 
 * @property Collection|Articulo[] $articulos
 * @property Collection|ClientegeneralArea[] $clientegeneral_areas
 * @property Collection|CombinacionesPermiso[] $combinaciones_permisos
 *
 * @package App\Models
 */
class Tipoarea extends Model
{
	protected $table = 'tipoarea';
	protected $primaryKey = 'idTipoArea';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];

	public function articulos()
	{
		return $this->hasMany(Articulo::class, 'idTipoArea');
	}

	public function clientegeneral_areas()
	{
		return $this->hasMany(ClientegeneralArea::class, 'idTipoArea');
	}

	public function combinaciones_permisos()
	{
		return $this->hasMany(CombinacionesPermiso::class, 'idTipoArea');
	}
}
