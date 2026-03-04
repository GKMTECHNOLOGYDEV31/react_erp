<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Tipousuariosoporte
 * 
 * @property int $idTipoUsuarioSoporte
 * @property string|null $nombre
 *
 * @package App\Models
 */
class Tipousuariosoporte extends Model
{
	protected $table = 'tipousuariosoporte';
	protected $primaryKey = 'idTipoUsuarioSoporte';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];
}
