<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Tiporecojo
 * 
 * @property int $idtipoRecojo
 * @property string|null $nombre
 * 
 * @property Collection|DatosEnvio[] $datos_envios
 *
 * @package App\Models
 */
class Tiporecojo extends Model
{
	protected $table = 'tiporecojo';
	protected $primaryKey = 'idtipoRecojo';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];

	public function datos_envios()
	{
		return $this->hasMany(DatosEnvio::class, 'tipoRecojo');
	}
}
