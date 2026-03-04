<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class StickerPack
 * 
 * @property int $idPack
 * @property int $idUsuario
 * @property string|null $nombre
 * @property string|null $descripcion
 * @property Carbon|null $creadoEn
 * 
 * @property Usuario $usuario
 * @property Collection|Sticker[] $stickers
 *
 * @package App\Models
 */
class StickerPack extends Model
{
	protected $table = 'sticker_packs';
	protected $primaryKey = 'idPack';
	public $timestamps = false;

	protected $casts = [
		'idUsuario' => 'int',
		'creadoEn' => 'datetime'
	];

	protected $fillable = [
		'idUsuario',
		'nombre',
		'descripcion',
		'creadoEn'
	];

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}

	public function stickers()
	{
		return $this->hasMany(Sticker::class, 'idPack');
	}
}
