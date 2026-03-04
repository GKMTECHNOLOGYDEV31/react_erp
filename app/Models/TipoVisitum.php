<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class TipoVisitum
 * 
 * @property int $idTipovisita
 * @property string|null $nombre
 * 
 * @property Collection|AnexosVisita[] $anexos_visitas
 *
 * @package App\Models
 */
class TipoVisitum extends Model
{
	protected $table = 'tipo_visita';
	protected $primaryKey = 'idTipovisita';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];

	public function anexos_visitas()
	{
		return $this->hasMany(AnexosVisita::class, 'idTipovisita');
	}
}
