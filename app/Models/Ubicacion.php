<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Ubicacion
 * 
 * @property int $idUbicacion
 * @property string|null $nombre
 * @property int $idSucursal
 * @property int|null $idAsignacion_rack
 * @property string|null $ubicacion
 * @property string|null $nivel_codigo
 * @property int|null $nivel_ordinal
 * @property int|null $modulo
 * @property int|null $hueco
 * @property int|null $pallet
 * @property string|null $lado
 * @property int|null $pulgadas_piso1
 *
 * @package App\Models
 */
class Ubicacion extends Model
{
	protected $table = 'ubicacion';
	protected $primaryKey = 'idUbicacion';
	public $timestamps = false;

	protected $casts = [
		'idSucursal' => 'int',
		'idAsignacion_rack' => 'int',
		'nivel_ordinal' => 'int',
		'modulo' => 'int',
		'hueco' => 'int',
		'pallet' => 'int',
		'pulgadas_piso1' => 'int'
	];

	protected $fillable = [
		'nombre',
		'idSucursal',
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
}
