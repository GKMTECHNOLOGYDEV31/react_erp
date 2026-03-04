<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Tipoigv
 * 
 * @property int $idTipoIgv
 * @property string|null $nombre
 *
 * @package App\Models
 */
class Tipoigv extends Model
{
	protected $table = 'tipoigv';
	protected $primaryKey = 'idTipoIgv';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];
}
