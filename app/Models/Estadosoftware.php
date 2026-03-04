<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Estadosoftware
 * 
 * @property int $idEstadoSoftware
 * @property string|null $nombre
 *
 * @package App\Models
 */
class Estadosoftware extends Model
{
	protected $table = 'estadosoftware';
	protected $primaryKey = 'idEstadoSoftware';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];
}
