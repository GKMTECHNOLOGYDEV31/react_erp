<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class MensajesVisto
 * 
 * @property int $idMensajeVisto
 * @property int $idMensaje
 * @property int $idUsuario
 * @property Carbon|null $vistoEn
 * 
 * @property Mensaje $mensaje
 * @property Usuario $usuario
 *
 * @package App\Models
 */
class MensajesVisto extends Model
{
	protected $table = 'mensajes_vistos';
	protected $primaryKey = 'idMensajeVisto';
	public $timestamps = false;

	protected $casts = [
		'idMensaje' => 'int',
		'idUsuario' => 'int',
		'vistoEn' => 'datetime'
	];

	protected $fillable = [
		'idMensaje',
		'idUsuario',
		'vistoEn'
	];

	public function mensaje()
	{
		return $this->belongsTo(Mensaje::class, 'idMensaje');
	}

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}
}
