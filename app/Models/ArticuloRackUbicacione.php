<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ArticuloRackUbicacione
 * 
 * @property int $idArticuloRackUbicacion
 * @property int|null $articulo_id
 * @property int|null $rack_ubicacion_id
 * @property int|null $cantidad
 * @property Carbon|null $fecha_ingreso
 * @property Carbon|null $fecha_ultimo_movimiento
 * @property string|null $estado
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Articulo|null $articulo
 * @property RackUbicacione|null $rack_ubicacione
 *
 * @package App\Models
 */
class ArticuloRackUbicacione extends Model
{
	protected $table = 'articulo_rack_ubicaciones';
	protected $primaryKey = 'idArticuloRackUbicacion';

	protected $casts = [
		'articulo_id' => 'int',
		'rack_ubicacion_id' => 'int',
		'cantidad' => 'int',
		'fecha_ingreso' => 'datetime',
		'fecha_ultimo_movimiento' => 'datetime'
	];

	protected $fillable = [
		'articulo_id',
		'rack_ubicacion_id',
		'cantidad',
		'fecha_ingreso',
		'fecha_ultimo_movimiento',
		'estado'
	];

	public function articulo()
	{
		return $this->belongsTo(Articulo::class);
	}

	public function rack_ubicacione()
	{
		return $this->belongsTo(RackUbicacione::class, 'rack_ubicacion_id');
	}
}
