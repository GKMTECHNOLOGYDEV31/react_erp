<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ModeloRack
 * 
 * @property int $idmodelo_rack
 * @property float|null $altura
 * @property float|null $distanciaPostes
 * @property int|null $cantidadDivisiones
 * @property float|null $separacionModulos
 * @property float|null $alturaPiso
 * @property int|null $cantidadPiso
 * @property float|null $distanciaPiso
 * @property int|null $pulgada
 * @property string|null $imagen_modelo
 * 
 * @property Collection|AsignacionRack[] $asignacion_racks
 *
 * @package App\Models
 */
class ModeloRack extends Model
{
	protected $table = 'modelo_rack';
	protected $primaryKey = 'idmodelo_rack';
	public $timestamps = false;

	protected $casts = [
		'altura' => 'float',
		'distanciaPostes' => 'float',
		'cantidadDivisiones' => 'int',
		'separacionModulos' => 'float',
		'alturaPiso' => 'float',
		'cantidadPiso' => 'int',
		'distanciaPiso' => 'float',
		'pulgada' => 'int'
	];

	protected $fillable = [
		'altura',
		'distanciaPostes',
		'cantidadDivisiones',
		'separacionModulos',
		'alturaPiso',
		'cantidadPiso',
		'distanciaPiso',
		'pulgada',
		'imagen_modelo'
	];

	public function asignacion_racks()
	{
		return $this->hasMany(AsignacionRack::class, 'idModelo');
	}
}
