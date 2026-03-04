<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Tipoasunto
 * 
 * @property int $idTipoAsunto
 * @property string|null $nombre
 * 
 * @property Collection|Observacione[] $observaciones
 *
 * @package App\Models
 */
class Tipoasunto extends Model
{
	protected $table = 'tipoasunto';
	protected $primaryKey = 'idTipoAsunto';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];

	public function observaciones()
	{
		return $this->hasMany(Observacione::class, 'idTipoAsunto');
	}
}
