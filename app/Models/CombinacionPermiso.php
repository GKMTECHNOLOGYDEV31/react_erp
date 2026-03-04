<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class CombinacionPermiso
 * 
 * @property int $idCombinacionPermiso
 * @property int $idCombinacion
 * @property int $idPermiso
 * @property int|null $estado
 * @property Carbon $created_at
 *
 * @package App\Models
 */
class CombinacionPermiso extends Model
{
	protected $table = 'combinacion_permisos';
	protected $primaryKey = 'idCombinacionPermiso';
	public $timestamps = false;

	protected $casts = [
		'idCombinacion' => 'int',
		'idPermiso' => 'int',
		'estado' => 'int'
	];

	protected $fillable = [
		'idCombinacion',
		'idPermiso',
		'estado'
	];
}
