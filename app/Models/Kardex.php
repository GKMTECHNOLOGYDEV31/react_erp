<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Kardex
 * 
 * @property int $id
 * @property Carbon $fecha
 * @property int $idArticulo
 * @property int|null $cliente_general_id
 * @property int $unidades_entrada
 * @property float $costo_unitario_entrada
 * @property int $unidades_salida
 * @property float $costo_unitario_salida
 * @property int $inventario_inicial
 * @property int $inventario_actual
 * @property string|null $cas
 * @property float $costo_inventario
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @package App\Models
 */
class Kardex extends Model
{
	protected $table = 'kardex';

	protected $casts = [
		'fecha' => 'datetime',
		'idArticulo' => 'int',
		'cliente_general_id' => 'int',
		'unidades_entrada' => 'int',
		'costo_unitario_entrada' => 'float',
		'unidades_salida' => 'int',
		'costo_unitario_salida' => 'float',
		'inventario_inicial' => 'int',
		'inventario_actual' => 'int',
		'costo_inventario' => 'float'
	];

	protected $fillable = [
		'fecha',
		'idArticulo',
		'cliente_general_id',
		'unidades_entrada',
		'costo_unitario_entrada',
		'unidades_salida',
		'costo_unitario_salida',
		'inventario_inicial',
		'inventario_actual',
		'cas',
		'costo_inventario'
	];
}
