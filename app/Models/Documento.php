<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Documento
 * 
 * @property int $idDocumento
 * @property string|null $nombre
 * 
 * @property Collection|Compra[] $compras
 *
 * @package App\Models
 */
class Documento extends Model
{
	protected $table = 'documento';
	protected $primaryKey = 'idDocumento';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];

	public function compras()
	{
		return $this->hasMany(Compra::class, 'idDocumento');
	}
}
