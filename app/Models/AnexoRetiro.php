<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class AnexoRetiro
 * 
 * @property int $idanexo_retiro
 * @property string|null $foto
 * @property int|null $idTickets
 * @property Carbon|null $fecha
 * @property int|null $tipo
 * 
 * @property Ticket|null $ticket
 *
 * @package App\Models
 */
class AnexoRetiro extends Model
{
	protected $table = 'anexo_retiro';
	protected $primaryKey = 'idanexo_retiro';
	public $timestamps = false;

	protected $casts = [
		'idTickets' => 'int',
		'fecha' => 'datetime',
		'tipo' => 'int'
	];

	protected $fillable = [
		'foto',
		'idTickets',
		'fecha',
		'tipo'
	];

	public function ticket()
	{
		return $this->belongsTo(Ticket::class, 'idTickets');
	}
}
