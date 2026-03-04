<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Tiposervicio
 * 
 * @property int $idTipoServicio
 * @property string|null $nombre
 *
 * @package App\Models
 */
class Tiposervicio extends Model
{
	protected $table = 'tiposervicio';
	protected $primaryKey = 'idTipoServicio';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];
}
