<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Ticketflujo
 * 
 * @property int $idTicketFlujo
 * @property int|null $idTicket
 * @property int|null $idEstadflujo
 * @property int|null $idUsuario
 * @property Carbon|null $fecha_creacion
 * @property int|null $idVisitas
 * @property string|null $comentarioflujo
 * 
 * @property Visita|null $visita
 *
 * @package App\Models
 */
class Ticketflujo extends Model
{
	protected $table = 'ticketflujo';
	protected $primaryKey = 'idTicketFlujo';
	public $timestamps = false;

	protected $casts = [
		'idTicket' => 'int',
		'idEstadflujo' => 'int',
		'idUsuario' => 'int',
		'fecha_creacion' => 'datetime',
		'idVisitas' => 'int'
	];

	protected $fillable = [
		'idTicket',
		'idEstadflujo',
		'idUsuario',
		'fecha_creacion',
		'idVisitas',
		'comentarioflujo'
	];

	public function visita()
	{
		return $this->belongsTo(Visita::class, 'idVisitas');
	}
}
