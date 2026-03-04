<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TipoOperacion
 * 
 * @property int $idTipoOperacion
 * @property string|null $nombre
 *
 * @package App\Models
 */
class TipoOperacion extends Model
{
	protected $table = 'tipo_operacion';
	protected $primaryKey = 'idTipoOperacion';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];
}
