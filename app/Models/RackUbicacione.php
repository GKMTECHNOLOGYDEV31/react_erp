<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class RackUbicacione
 * 
 * @property int $idRackUbicacion
 * @property int|null $rack_id
 * @property string $codigo
 * @property int $nivel
 * @property int $posicion
 * @property string|null $estado_ocupacion
 * @property int|null $capacidad_maxima
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $codigo_unico
 * @property int|null $articulo_id
 * @property int|null $cantidad_actual
 * 
 * @property Rack|null $rack
 * @property Collection|Articulo[] $articulos
 * @property Collection|ArticuloSeries[] $articulo_series
 *
 * @package App\Models
 */
class RackUbicacione extends Model
{
	protected $table = 'rack_ubicaciones';
	protected $primaryKey = 'idRackUbicacion';

	protected $casts = [
		'rack_id' => 'int',
		'nivel' => 'int',
		'posicion' => 'int',
		'capacidad_maxima' => 'int',
		'articulo_id' => 'int',
		'cantidad_actual' => 'int'
	];

	protected $fillable = [
		'rack_id',
		'codigo',
		'nivel',
		'posicion',
		'estado_ocupacion',
		'capacidad_maxima',
		'codigo_unico',
		'articulo_id',
		'cantidad_actual'
	];

	public function rack()
	{
		return $this->belongsTo(Rack::class);
	}

	public function articulos()
	{
		return $this->belongsToMany(Articulo::class, 'articulo_rack_ubicaciones', 'rack_ubicacion_id')
					->withPivot('idArticuloRackUbicacion', 'cantidad', 'fecha_ingreso', 'fecha_ultimo_movimiento', 'estado')
					->withTimestamps();
	}

	public function articulo_series()
	{
		return $this->hasMany(ArticuloSeries::class, 'ubicacion_id');
	}
}
