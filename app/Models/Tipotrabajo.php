<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Tipotrabajo
 * 
 * @property int $idTipoTrabajo
 * @property string|null $nombre
 *
 * @package App\Models
 */
class Tipotrabajo extends Model
{
	protected $table = 'tipotrabajo';
	protected $primaryKey = 'idTipoTrabajo';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];
}
