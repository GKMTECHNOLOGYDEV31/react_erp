<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Unidad
 * 
 * @property int $idUnidad
 * @property string|null $nombre
 * 
 * @property Collection|Articulo[] $articulos
 *
 * @package App\Models
 */
class Unidad extends Model
{
	protected $table = 'unidad';
	protected $primaryKey = 'idUnidad';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];

	public function articulos()
	{
		return $this->hasMany(Articulo::class, 'idUnidad');
	}
}
