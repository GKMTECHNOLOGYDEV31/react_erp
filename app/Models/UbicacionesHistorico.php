<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class UbicacionesHistorico
 * 
 * @property int $id
 * @property int $idUsuario
 * @property string $lat
 * @property string $lng
 * @property Carbon|null $fecha
 *
 * @package App\Models
 */
class UbicacionesHistorico extends Model
{
	protected $table = 'ubicaciones_historico';
	public $timestamps = false;

	protected $casts = [
		'idUsuario' => 'int',
		'fecha' => 'datetime'
	];

	protected $fillable = [
		'idUsuario',
		'lat',
		'lng',
		'fecha'
	];
}
