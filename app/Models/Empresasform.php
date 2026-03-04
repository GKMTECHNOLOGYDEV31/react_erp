<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Empresasform
 * 
 * @property int $id
 * @property int $idSeguimiento
 * @property string $nombre_razon_social
 * @property string $ruc
 * @property string $giro_comercial
 * @property string|null $ubicacion_geografica
 * @property int $fuente_captacion_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Seguimiento $seguimiento
 * @property FuentesCaptacion $fuentes_captacion
 *
 * @package App\Models
 */
class Empresasform extends Model
{
	protected $table = 'empresasform';

	protected $casts = [
		'idSeguimiento' => 'int',
		'fuente_captacion_id' => 'int'
	];

	protected $fillable = [
		'idSeguimiento',
		'nombre_razon_social',
		'ruc',
		'giro_comercial',
		'ubicacion_geografica',
		'fuente_captacion_id'
	];

	public function seguimiento()
	{
		return $this->belongsTo(Seguimiento::class, 'idSeguimiento');
	}

	public function fuentes_captacion()
	{
		return $this->belongsTo(FuentesCaptacion::class, 'fuente_captacion_id');
	}
}
