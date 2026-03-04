<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Tipoticket
 * 
 * @property int $idTipotickets
 * @property string|null $nombre
 *
 * @package App\Models
 */
class Tipoticket extends Model
{
	protected $table = 'tipotickets';
	protected $primaryKey = 'idTipotickets';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];
}
