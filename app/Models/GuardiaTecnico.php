<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class GuardiaTecnico
 * 
 * @property int $idguardia_tecnico
 * @property int|null $idUsuario
 * @property Carbon|null $fechaInicio
 * @property Carbon|null $fechaFinal
 * 
 * @property Usuario|null $usuario
 *
 * @package App\Models
 */
class GuardiaTecnico extends Model
{
	protected $table = 'guardia_tecnico';
	protected $primaryKey = 'idguardia_tecnico';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'idguardia_tecnico' => 'int',
		'idUsuario' => 'int',
		'fechaInicio' => 'datetime',
		'fechaFinal' => 'datetime'
	];

	protected $fillable = [
		'idUsuario',
		'fechaInicio',
		'fechaFinal'
	];

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}
}
