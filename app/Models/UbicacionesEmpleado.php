<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class UbicacionesEmpleado
 * 
 * @property int $idUbicaciones_empleados
 * @property int|null $idUsuario
 * @property string|null $lat
 * @property string|null $lng
 * @property Carbon|null $fecha
 * 
 * @property Usuario|null $usuario
 *
 * @package App\Models
 */
class UbicacionesEmpleado extends Model
{
	protected $table = 'ubicaciones_empleados';
	protected $primaryKey = 'idUbicaciones_empleados';
	public $timestamps = false;

	protected $casts = [
		'idUsuario' => 'int',
		'fecha' => 'datetime'
	];

	protected $fillable = [
		'idUsuario',
		'lat',
		'lng',
		'fecha'
	];

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}
}
