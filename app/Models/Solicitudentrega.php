<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Solicitudentrega
 * 
 * @property int $idSolicitudentrega
 * @property int|null $idTickets
 * @property int|null $idVisitas
 * @property int|null $idUsuario
 * @property string $comentario
 * @property int $estado
 * @property Carbon|null $fechaHora
 * @property int|null $idTipoServicio
 * @property string|null $numero_ticket
 * 
 * @property Visita|null $visita
 * @property Ticket|null $ticket
 * @property Usuario|null $usuario
 *
 * @package App\Models
 */
class Solicitudentrega extends Model
{
	protected $table = 'solicitudentrega';
	protected $primaryKey = 'idSolicitudentrega';
	public $timestamps = false;

	protected $casts = [
		'idTickets' => 'int',
		'idVisitas' => 'int',
		'idUsuario' => 'int',
		'estado' => 'int',
		'fechaHora' => 'datetime',
		'idTipoServicio' => 'int'
	];

	protected $fillable = [
		'idTickets',
		'idVisitas',
		'idUsuario',
		'comentario',
		'estado',
		'fechaHora',
		'idTipoServicio',
		'numero_ticket'
	];

	public function visita()
	{
		return $this->belongsTo(Visita::class, 'idVisitas');
	}

	public function ticket()
	{
		return $this->belongsTo(Ticket::class, 'idTickets');
	}

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}
}
