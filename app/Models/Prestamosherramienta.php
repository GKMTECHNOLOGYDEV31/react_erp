<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Prestamosherramienta
 * 
 * @property int $idPrestamosHerramientas
 * @property Carbon|null $fechaEntrega
 * @property Carbon|null $fechaDevolucion
 * @property int|null $dias
 * @property string|null $estado
 * @property int $idSolicitud
 * @property int $idTecnico
 * @property int $idUsuario
 *
 * @package App\Models
 */
class Prestamosherramienta extends Model
{
	protected $table = 'prestamosherramientas';
	protected $primaryKey = 'idPrestamosHerramientas';
	public $timestamps = false;

	protected $casts = [
		'fechaEntrega' => 'datetime',
		'fechaDevolucion' => 'datetime',
		'dias' => 'int',
		'idSolicitud' => 'int',
		'idTecnico' => 'int',
		'idUsuario' => 'int'
	];

	protected $fillable = [
		'fechaEntrega',
		'fechaDevolucion',
		'dias',
		'estado',
		'idSolicitud',
		'idTecnico',
		'idUsuario'
	];
}
