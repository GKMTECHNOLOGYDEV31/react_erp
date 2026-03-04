<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Tipoenvio
 * 
 * @property int $idtipoenvio
 * @property string|null $nombre
 * 
 * @property Collection|DatosEnvio[] $datos_envios
 *
 * @package App\Models
 */
class Tipoenvio extends Model
{
	protected $table = 'tipoenvio';
	protected $primaryKey = 'idtipoenvio';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];

	public function datos_envios()
	{
		return $this->hasMany(DatosEnvio::class, 'tipoEnvio');
	}
}
