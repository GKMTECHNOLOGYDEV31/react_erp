<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Mensaje
 * 
 * @property int $idMensaje
 * @property int $idChat
 * @property int|null $idRemitente
 * @property string|null $contenido
 * @property string|null $tipoMensaje
 * @property Carbon|null $creadoEn
 * 
 * @property Chat $chat
 * @property Usuario|null $usuario
 * @property Collection|ArchivosMensaje[] $archivos_mensajes
 * @property Collection|MensajesVisto[] $mensajes_vistos
 *
 * @package App\Models
 */
class Mensaje extends Model
{
	protected $table = 'mensajes';
	protected $primaryKey = 'idMensaje';
	public $timestamps = false;

	protected $casts = [
		'idChat' => 'int',
		'idRemitente' => 'int',
		'creadoEn' => 'datetime'
	];

	protected $fillable = [
		'idChat',
		'idRemitente',
		'contenido',
		'tipoMensaje',
		'creadoEn'
	];

	public function chat()
	{
		return $this->belongsTo(Chat::class, 'idChat');
	}

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idRemitente');
	}

	public function archivos_mensajes()
	{
		return $this->hasMany(ArchivosMensaje::class, 'idMensaje');
	}

	public function mensajes_vistos()
	{
		return $this->hasMany(MensajesVisto::class, 'idMensaje');
	}
}
