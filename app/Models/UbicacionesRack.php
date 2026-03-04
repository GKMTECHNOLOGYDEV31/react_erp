<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class UbicacionesRack
 * 
 * @property int $idubicaciones_rack
 * @property int $idAsignacion_rack
 * @property string $ubicacion
 * @property string $nivel_codigo
 * @property int $nivel_ordinal
 * @property int $modulo
 * @property int $hueco
 * @property int $pallet
 * @property string|null $lado
 * @property int|null $pulgadas_piso1
 * 
 * @property AsignacionRack $asignacion_rack
 *
 * @package App\Models
 */
class UbicacionesRack extends Model
{
	protected $table = 'ubicaciones_rack';
	protected $primaryKey = 'idubicaciones_rack';
	public $timestamps = false;

	protected $casts = [
		'idAsignacion_rack' => 'int',
		'nivel_ordinal' => 'int',
		'modulo' => 'int',
		'hueco' => 'int',
		'pallet' => 'int',
		'pulgadas_piso1' => 'int'
	];

	protected $fillable = [
		'idAsignacion_rack',
		'ubicacion',
		'nivel_codigo',
		'nivel_ordinal',
		'modulo',
		'hueco',
		'pallet',
		'lado',
		'pulgadas_piso1'
	];

	public function asignacion_rack()
	{
		return $this->belongsTo(AsignacionRack::class, 'idAsignacion_rack');
	}
}
