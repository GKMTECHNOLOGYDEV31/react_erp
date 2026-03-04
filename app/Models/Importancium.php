<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Importancium
 * 
 * @property int $idImportancia
 * @property string|null $nombre
 *
 * @package App\Models
 */
class Importancium extends Model
{
	protected $table = 'importancia';
	protected $primaryKey = 'idImportancia';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];
}
