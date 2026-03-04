<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Boveda
 * 
 * @property int $idBoveda
 * @property int $idAlmacen
 * @property int $idArticulos
 * 
 * @property Almacen $almacen
 * @property Articulo $articulo
 *
 * @package App\Models
 */
class Boveda extends Model
{
	protected $table = 'boveda';
	protected $primaryKey = 'idBoveda';
	public $timestamps = false;

	protected $casts = [
		'idAlmacen' => 'int',
		'idArticulos' => 'int'
	];

	protected $fillable = [
		'idAlmacen',
		'idArticulos'
	];

	public function almacen()
	{
		return $this->belongsTo(Almacen::class, 'idAlmacen');
	}

	public function articulo()
	{
		return $this->belongsTo(Articulo::class, 'idArticulos');
	}
}
