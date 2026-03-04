<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Seleccionarvisitum
 * 
 * @property int $idselecionarvisita
 * @property int $idTickets
 * @property int $idVisitas
 * @property string|null $vistaseleccionada
 * 
 * @property Visita $visita
 * @property Ticket $ticket
 *
 * @package App\Models
 */
class Seleccionarvisitum extends Model
{
	protected $table = 'seleccionarvisita';
	protected $primaryKey = 'idselecionarvisita';
	public $timestamps = false;

	protected $casts = [
		'idTickets' => 'int',
		'idVisitas' => 'int'
	];

	protected $fillable = [
		'idTickets',
		'idVisitas',
		'vistaseleccionada'
	];

	public function visita()
	{
		return $this->belongsTo(Visita::class, 'idVisitas');
	}

	public function ticket()
	{
		return $this->belongsTo(Ticket::class, 'idTickets');
	}
}
