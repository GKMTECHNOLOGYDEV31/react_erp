<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ChatUsuario
 * 
 * @property int $idChatUsuario
 * @property int $idChat
 * @property int $idUsuario
 * @property bool|null $esAdmin
 * @property bool|null $archivado
 * 
 * @property Chat $chat
 * @property Usuario $usuario
 *
 * @package App\Models
 */
class ChatUsuario extends Model
{
	protected $table = 'chat_usuarios';
	protected $primaryKey = 'idChatUsuario';
	public $timestamps = false;

	protected $casts = [
		'idChat' => 'int',
		'idUsuario' => 'int',
		'esAdmin' => 'bool',
		'archivado' => 'bool'
	];

	protected $fillable = [
		'idChat',
		'idUsuario',
		'esAdmin',
		'archivado'
	];

	public function chat()
	{
		return $this->belongsTo(Chat::class, 'idChat');
	}

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}
}
