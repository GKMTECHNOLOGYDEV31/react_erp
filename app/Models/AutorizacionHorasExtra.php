<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class AutorizacionHorasExtra
 * 
 * @property int $idAutorizacion
 * @property int $idUsuario
 * @property int $idEmpleado
 * @property Carbon $iniciohora
 * @property Carbon $finalhora
 * @property string $motivo
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Usuario $usuario
 *
 * @package App\Models
 */
class AutorizacionHorasExtra extends Model
{
	protected $table = 'autorizacion_horas_extras';
	protected $primaryKey = 'idAutorizacion';

	protected $casts = [
		'idUsuario' => 'int',
		'idEmpleado' => 'int',
		'iniciohora' => 'datetime',
		'finalhora' => 'datetime'
	];

	protected $fillable = [
		'idUsuario',
		'idEmpleado',
		'iniciohora',
		'finalhora',
		'motivo'
	];

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}
}
