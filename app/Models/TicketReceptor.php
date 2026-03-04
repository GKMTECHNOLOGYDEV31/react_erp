<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TicketReceptor
 * 
 * @property int $idticket_receptor
 * @property int|null $idTickets
 * @property int|null $idReceptor
 * @property string|null $nombre
 * @property string|null $apellido
 * @property string|null $dni
 * 
 * @property Ticket|null $ticket
 * @property Usuario|null $usuario
 *
 * @package App\Models
 */
class TicketReceptor extends Model
{
	protected $table = 'ticket_receptor';
	protected $primaryKey = 'idticket_receptor';
	public $timestamps = false;

	protected $casts = [
		'idTickets' => 'int',
		'idReceptor' => 'int'
	];

	protected $fillable = [
		'idTickets',
		'idReceptor',
		'nombre',
		'apellido',
		'dni'
	];

	public function ticket()
	{
		return $this->belongsTo(Ticket::class, 'idTickets');
	}

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idReceptor');
	}
}
