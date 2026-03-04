<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Chat
 * 
 * @property int $idChat
 * @property bool|null $esGrupo
 * @property string|null $nombreGrupo
 * @property string|null $avatarGrupo
 * @property Carbon|null $creadoEn
 * 
 * @property Collection|Usuario[] $usuarios
 * @property Collection|Mensaje[] $mensajes
 *
 * @package App\Models
 */
class Chat extends Model
{
	protected $table = 'chats';
	protected $primaryKey = 'idChat';
	public $timestamps = false;

	protected $casts = [
		'esGrupo' => 'bool',
		'creadoEn' => 'datetime'
	];

	protected $fillable = [
		'esGrupo',
		'nombreGrupo',
		'avatarGrupo',
		'creadoEn'
	];

	public function usuarios()
	{
		return $this->belongsToMany(Usuario::class, 'chat_usuarios', 'idChat', 'idUsuario')
					->withPivot('idChatUsuario', 'esAdmin', 'archivado');
	}

	public function mensajes()
	{
		return $this->hasMany(Mensaje::class, 'idChat');
	}
}
