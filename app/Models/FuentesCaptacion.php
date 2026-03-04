<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class FuentesCaptacion
 * 
 * @property int $id
 * @property string $nombre
 * @property string|null $descripcion
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|Empresa[] $empresas
 * @property Collection|Empresasform[] $empresasforms
 *
 * @package App\Models
 */
class FuentesCaptacion extends Model
{
	protected $table = 'fuentes_captacion';

	protected $fillable = [
		'nombre',
		'descripcion'
	];

	public function empresas()
	{
		return $this->hasMany(Empresa::class, 'fuente_captacion_id');
	}

	public function empresasforms()
	{
		return $this->hasMany(Empresasform::class, 'fuente_captacion_id');
	}
}
