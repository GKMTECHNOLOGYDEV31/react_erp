<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class RackMovimiento
 * 
 * @property int $idMovimiento
 * @property int|null $articulo_id
 * @property int|null $custodia_id
 * @property int|null $ubicacion_origen_id
 * @property int|null $ubicacion_destino_id
 * @property int|null $rack_origen_id
 * @property int|null $rack_destino_id
 * @property int|null $cantidad
 * @property string|null $tipo_movimiento
 * @property int|null $usuario_id
 * @property string|null $observaciones
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $codigo_ubicacion_origen
 * @property string|null $codigo_ubicacion_destino
 * @property string|null $nombre_rack_origen
 * @property string|null $nombre_rack_destino
 *
 * @package App\Models
 */
class RackMovimiento extends Model
{
	protected $table = 'rack_movimientos';
	protected $primaryKey = 'idMovimiento';

	protected $casts = [
		'articulo_id' => 'int',
		'custodia_id' => 'int',
		'ubicacion_origen_id' => 'int',
		'ubicacion_destino_id' => 'int',
		'rack_origen_id' => 'int',
		'rack_destino_id' => 'int',
		'cantidad' => 'int',
		'usuario_id' => 'int'
	];

	protected $fillable = [
		'articulo_id',
		'custodia_id',
		'ubicacion_origen_id',
		'ubicacion_destino_id',
		'rack_origen_id',
		'rack_destino_id',
		'cantidad',
		'tipo_movimiento',
		'usuario_id',
		'observaciones',
		'codigo_ubicacion_origen',
		'codigo_ubicacion_destino',
		'nombre_rack_origen',
		'nombre_rack_destino'
	];
}
