<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class RackUbicacionArticulo
 * 
 * @property int $idRackUbicacionArticulo
 * @property int $rack_ubicacion_id
 * @property int $articulo_id
 * @property int $cantidad
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int|null $custodia_id
 * @property int|null $cliente_general_id
 * @property string|null $ubicacion2
 *
 * @package App\Models
 */
class RackUbicacionArticulo extends Model
{
	protected $table = 'rack_ubicacion_articulos';
	protected $primaryKey = 'idRackUbicacionArticulo';

	protected $casts = [
		'rack_ubicacion_id' => 'int',
		'articulo_id' => 'int',
		'cantidad' => 'int',
		'custodia_id' => 'int',
		'cliente_general_id' => 'int'
	];

	protected $fillable = [
		'rack_ubicacion_id',
		'articulo_id',
		'cantidad',
		'custodia_id',
		'cliente_general_id',
		'ubicacion2'
	];
}
