<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Compraarticulo
 * 
 * @property int $idCompraArticulo
 * @property string|null $serie
 * @property int|null $nro
 * @property int $idCompra
 * @property int $idArticulos
 * @property int|null $estado
 * @property int|null $idProveedor
 *
 * @package App\Models
 */
class Compraarticulo extends Model
{
	protected $table = 'compraarticulo';
	protected $primaryKey = 'idCompraArticulo';
	public $timestamps = false;

	protected $casts = [
		'nro' => 'int',
		'idCompra' => 'int',
		'idArticulos' => 'int',
		'estado' => 'int',
		'idProveedor' => 'int'
	];

	protected $fillable = [
		'serie',
		'nro',
		'idCompra',
		'idArticulos',
		'estado',
		'idProveedor'
	];
}
