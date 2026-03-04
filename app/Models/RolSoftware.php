<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class RolSoftware
 * 
 * @property int $idRolsoftware
 * @property string|null $nombre
 *
 * @package App\Models
 */
class RolSoftware extends Model
{
	protected $table = 'rol_software';
	protected $primaryKey = 'idRolsoftware';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];
}
