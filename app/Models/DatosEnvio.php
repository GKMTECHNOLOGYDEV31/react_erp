<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class DatosEnvio
 * 
 * @property int $idDatos_envio
 * @property int|null $idTickets
 * @property int|null $tipoRecojo
 * @property int|null $tipoEnvio
 * @property int|null $tipo
 * @property int|null $idUsuario
 * @property string|null $agencia
 * 
 * @property Ticket|null $ticket
 * @property Tiporecojo|null $tiporecojo
 * @property Tipoenvio|null $tipoenvio
 * @property Usuario|null $usuario
 *
 * @package App\Models
 */
class DatosEnvio extends Model
{
	protected $table = 'datos_envio';
	protected $primaryKey = 'idDatos_envio';
	public $timestamps = false;

	protected $casts = [
		'idTickets' => 'int',
		'tipoRecojo' => 'int',
		'tipoEnvio' => 'int',
		'tipo' => 'int',
		'idUsuario' => 'int'
	];

	protected $fillable = [
		'idTickets',
		'tipoRecojo',
		'tipoEnvio',
		'tipo',
		'idUsuario',
		'agencia'
	];

	public function ticket()
	{
		return $this->belongsTo(Ticket::class, 'idTickets');
	}

	public function tiporecojo()
	{
		return $this->belongsTo(Tiporecojo::class, 'tipoRecojo');
	}

	public function tipoenvio()
	{
		return $this->belongsTo(Tipoenvio::class, 'tipoEnvio');
	}

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}
}
