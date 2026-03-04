<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class AprobacionHorario
 * 
 * @property int $idaprobacion_horario
 * @property int|null $idUsuario
 * @property Carbon|null $hora
 * @property int|null $idTicket
 * @property string|null $razon
 * @property int|null $idVisita
 * @property Carbon|null $fecha
 * @property int|null $estado
 * 
 * @property Usuario|null $usuario
 * @property Ticket|null $ticket
 * @property Visita|null $visita
 *
 * @package App\Models
 */
class AprobacionHorario extends Model
{
	protected $table = 'aprobacion_horario';
	protected $primaryKey = 'idaprobacion_horario';
	public $timestamps = false;

	protected $casts = [
		'idUsuario' => 'int',
		'hora' => 'datetime',
		'idTicket' => 'int',
		'idVisita' => 'int',
		'fecha' => 'datetime',
		'estado' => 'int'
	];

	protected $fillable = [
		'idUsuario',
		'hora',
		'idTicket',
		'razon',
		'idVisita',
		'fecha',
		'estado'
	];

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}

	public function ticket()
	{
		return $this->belongsTo(Ticket::class, 'idTicket');
	}

	public function visita()
	{
		return $this->belongsTo(Visita::class, 'idVisita');
	}
}
