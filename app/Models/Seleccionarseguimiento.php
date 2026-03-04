<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Seleccionarseguimiento
 * 
 * @property int $id
 * @property int $idseguimiento
 * @property int|null $idprospecto
 * @property int $idusuario
 * @property int|null $idpersona
 * @property Carbon $fecha_seleccionada
 *
 * @package App\Models
 */
class Seleccionarseguimiento extends Model
{
	protected $table = 'seleccionarseguimiento';
	public $timestamps = false;

	protected $casts = [
		'idseguimiento' => 'int',
		'idprospecto' => 'int',
		'idusuario' => 'int',
		'idpersona' => 'int',
		'fecha_seleccionada' => 'datetime'
	];

	protected $fillable = [
		'idseguimiento',
		'idprospecto',
		'idusuario',
		'idpersona',
		'fecha_seleccionada'
	];
}
