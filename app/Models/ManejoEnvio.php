<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ManejoEnvio
 * 
 * @property int $idmanejo_envio
 * @property string|null $numero_guia
 * @property string|null $agenciaEnvio
 * @property string|null $agenciaRecepcion
 * @property string|null $clave
 * @property Carbon|null $fecha_envio
 * @property Carbon|null $fecha_llegada_estimada
 * @property int|null $idUsuario
 * @property int|null $idTickets
 * @property int|null $tipo
 * @property string|null $claveAgencia
 * @property string|null $observaciones
 * 
 * @property Ticket|null $ticket
 * @property Usuario|null $usuario
 *
 * @package App\Models
 */
class ManejoEnvio extends Model
{
	protected $table = 'manejo_envio';
	protected $primaryKey = 'idmanejo_envio';
	public $timestamps = false;

	protected $casts = [
		'fecha_envio' => 'datetime',
		'fecha_llegada_estimada' => 'datetime',
		'idUsuario' => 'int',
		'idTickets' => 'int',
		'tipo' => 'int'
	];

	protected $fillable = [
		'numero_guia',
		'agenciaEnvio',
		'agenciaRecepcion',
		'clave',
		'fecha_envio',
		'fecha_llegada_estimada',
		'idUsuario',
		'idTickets',
		'tipo',
		'claveAgencia',
		'observaciones'
	];

	public function ticket()
	{
		return $this->belongsTo(Ticket::class, 'idTickets');
	}

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}
}
