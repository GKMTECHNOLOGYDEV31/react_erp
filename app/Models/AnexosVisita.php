<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class AnexosVisita
 * 
 * @property int $idAnexoVisitas
 * @property string|null $foto
 * @property string|null $descripcion
 * @property int|null $idTipovisita
 * @property int|null $idVisitas
 * @property float|null $lat
 * @property float|null $lng
 * @property string|null $ubicacion
 * 
 * @property TipoVisitum|null $tipo_visitum
 * @property Visita|null $visita
 *
 * @package App\Models
 */
class AnexosVisita extends Model
{
	protected $table = 'anexos_visitas';
	protected $primaryKey = 'idAnexoVisitas';
	public $timestamps = false;

	protected $casts = [
		'idTipovisita' => 'int',
		'idVisitas' => 'int',
		'lat' => 'float',
		'lng' => 'float'
	];

	protected $fillable = [
		'foto',
		'descripcion',
		'idTipovisita',
		'idVisitas',
		'lat',
		'lng',
		'ubicacion'
	];

	public function tipo_visitum()
	{
		return $this->belongsTo(TipoVisitum::class, 'idTipovisita');
	}

	public function visita()
	{
		return $this->belongsTo(Visita::class, 'idVisitas');
	}
}
