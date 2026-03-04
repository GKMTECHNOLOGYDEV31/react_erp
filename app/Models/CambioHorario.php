<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class CambioHorario
 * 
 * @property int $idcambio_horario
 * @property Carbon|null $inicio
 * @property Carbon|null $final
 * @property int|null $idTicket
 * @property string|null $razon
 * @property int|null $idVisita
 * @property Carbon|null $fecha
 * @property int|null $tipo
 * @property int|null $idUsuario
 * 
 * @property Ticket|null $ticket
 * @property Visita|null $visita
 * @property Usuario|null $usuario
 *
 * @package App\Models
 */
class CambioHorario extends Model
{
	protected $table = 'cambio_horario';
	protected $primaryKey = 'idcambio_horario';
	public $timestamps = false;

	protected $casts = [
		'inicio' => 'datetime',
		'final' => 'datetime',
		'idTicket' => 'int',
		'idVisita' => 'int',
		'fecha' => 'datetime',
		'tipo' => 'int',
		'idUsuario' => 'int'
	];

	protected $fillable = [
		'inicio',
		'final',
		'idTicket',
		'razon',
		'idVisita',
		'fecha',
		'tipo',
		'idUsuario'
	];

	public function ticket()
	{
		return $this->belongsTo(Ticket::class, 'idTicket');
	}

	public function visita()
	{
		return $this->belongsTo(Visita::class, 'idVisita');
	}

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}
}
