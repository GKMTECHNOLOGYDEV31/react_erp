<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ModeloCaja
 * 
 * @property int $idModeloCaja
 * @property float|null $ancho
 * @property float|null $alto
 * @property float|null $profundidad
 * @property int|null $cantidad
 * @property int|null $pulgadas
 * @property Carbon|null $fecha
 * 
 * @property Collection|Caja[] $cajas
 *
 * @package App\Models
 */
class ModeloCaja extends Model
{
	protected $table = 'modelo_cajas';
	protected $primaryKey = 'idModeloCaja';
	public $timestamps = false;

	protected $casts = [
		'ancho' => 'float',
		'alto' => 'float',
		'profundidad' => 'float',
		'cantidad' => 'int',
		'pulgadas' => 'int',
		'fecha' => 'datetime'
	];

	protected $fillable = [
		'ancho',
		'alto',
		'profundidad',
		'cantidad',
		'pulgadas',
		'fecha'
	];

	public function cajas()
	{
		return $this->hasMany(Caja::class, 'idModeloCaja');
	}
}
