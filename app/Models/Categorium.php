<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Categorium
 * 
 * @property int $idCategoria
 * @property string|null $nombre
 * @property bool|null $estado
 *
 * @package App\Models
 */
class Categorium extends Model
{
	protected $table = 'categoria';
	protected $primaryKey = 'idCategoria';
	public $timestamps = false;

	protected $casts = [
		'estado' => 'bool'
	];

	protected $fillable = [
		'nombre',
		'estado'
	];
}
