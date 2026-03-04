<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Sticker
 * 
 * @property int $idSticker
 * @property int $idUsuario
 * @property string|null $nombre
 * @property string $url
 * @property bool|null $esAnimado
 * @property Carbon|null $creadoEn
 * @property int|null $idPack
 * 
 * @property Usuario $usuario
 * @property StickerPack|null $sticker_pack
 *
 * @package App\Models
 */
class Sticker extends Model
{
	protected $table = 'stickers';
	protected $primaryKey = 'idSticker';
	public $timestamps = false;

	protected $casts = [
		'idUsuario' => 'int',
		'esAnimado' => 'bool',
		'creadoEn' => 'datetime',
		'idPack' => 'int'
	];

	protected $fillable = [
		'idUsuario',
		'nombre',
		'url',
		'esAnimado',
		'creadoEn',
		'idPack'
	];

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}

	public function sticker_pack()
	{
		return $this->belongsTo(StickerPack::class, 'idPack');
	}
}
