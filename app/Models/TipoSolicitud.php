<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Tiposolicitud
 * 
 * @property int $idTipoSolicitud
 * @property string|null $nombre
 *
 * @package App\Models
 */
class Tiposolicitud extends Model
{
	protected $table = 'tiposolicitud';
	protected $primaryKey = 'idTipoSolicitud';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];
}
