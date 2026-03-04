<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Tipoalmacen
 * 
 * @property int $idTipoAlmacen
 * @property string|null $nombre
 * 
 * @property Collection|Almacen[] $almacens
 *
 * @package App\Models
 */
class Tipoalmacen extends Model
{
	protected $table = 'tipoalmacen';
	protected $primaryKey = 'idTipoAlmacen';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];

	public function almacens()
	{
		return $this->hasMany(Almacen::class, 'idTipoAlmacen');
	}
}
