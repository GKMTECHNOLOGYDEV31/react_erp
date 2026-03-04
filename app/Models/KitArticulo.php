<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class KitArticulo
 * 
 * @property int $idkit_articulo
 * @property int|null $cantidad
 * @property int $idKit
 * @property int $idArticulos
 * @property int|null $estado
 *
 * @package App\Models
 */
class KitArticulo extends Model
{
	protected $table = 'kit_articulo';
	protected $primaryKey = 'idkit_articulo';
	public $timestamps = false;

	protected $casts = [
		'cantidad' => 'int',
		'idKit' => 'int',
		'idArticulos' => 'int',
		'estado' => 'int'
	];

	protected $fillable = [
		'cantidad',
		'idKit',
		'idArticulos',
		'estado'
	];
}
