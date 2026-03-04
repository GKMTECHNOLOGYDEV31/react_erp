<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Tipoprioridad
 * 
 * @property int $idTipoPrioridad
 * @property string|null $nombre
 *
 * @package App\Models
 */
class Tipoprioridad extends Model
{
	protected $table = 'tipoprioridad';
	protected $primaryKey = 'idTipoPrioridad';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];
}
