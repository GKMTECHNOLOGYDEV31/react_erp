<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Ticketapoyo
 * 
 * @property int $idTicketApoyo
 * @property int|null $idTecnico
 * @property int|null $idTicket
 * @property int|null $idVisita
 *
 * @package App\Models
 */
class Ticketapoyo extends Model
{
	protected $table = 'ticketapoyo';
	protected $primaryKey = 'idTicketApoyo';
	public $timestamps = false;

	protected $casts = [
		'idTecnico' => 'int',
		'idTicket' => 'int',
		'idVisita' => 'int'
	];

	protected $fillable = [
		'idTecnico',
		'idTicket',
		'idVisita'
	];
}
