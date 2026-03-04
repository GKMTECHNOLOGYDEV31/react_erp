<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Nivelincidencium
 * 
 * @property int $idNivelIncidencia
 * @property string|null $nombre
 *
 * @package App\Models
 */
class Nivelincidencium extends Model
{
	protected $table = 'nivelincidencia';
	protected $primaryKey = 'idNivelIncidencia';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];
}
