<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class EstadoOt
 * 
 * @property int $idEstadoots
 * @property string|null $descripcion
 * @property string|null $color
 *
 * @package App\Models
 */
class EstadoOt extends Model
{
	protected $table = 'estado_ots';
	protected $primaryKey = 'idEstadoots';
	public $timestamps = false;

	protected $fillable = [
		'descripcion',
		'color'
	];
}
