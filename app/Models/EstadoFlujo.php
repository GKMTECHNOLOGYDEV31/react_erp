<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class EstadoFlujo
 * 
 * @property int $idEstadflujo
 * @property string|null $descripcion
 * @property string|null $color
 *
 * @package App\Models
 */
class EstadoFlujo extends Model
{
	protected $table = 'estado_flujo';
	protected $primaryKey = 'idEstadflujo';
	public $timestamps = false;

	protected $fillable = [
		'descripcion',
		'color'
	];
}
