<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Empresa
 * 
 * @property int $id
 * @property string $nombre_razon_social
 * @property string $ruc
 * @property string $giro_comercial
 * @property string|null $ubicacion_geografica
 * @property int $fuente_captacion_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property FuentesCaptacion $fuentes_captacion
 * @property Collection|Seguimiento[] $seguimientos
 *
 * @package App\Models
 */
class Empresa extends Model
{
	protected $table = 'empresas';

	protected $casts = [
		'fuente_captacion_id' => 'int'
	];

	protected $fillable = [
		'nombre_razon_social',
		'ruc',
		'giro_comercial',
		'ubicacion_geografica',
		'fuente_captacion_id'
	];

	public function fuentes_captacion()
	{
		return $this->belongsTo(FuentesCaptacion::class, 'fuente_captacion_id');
	}

	public function seguimientos()
	{
		return $this->hasMany(Seguimiento::class, 'idEmpresa');
	}
}
