<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Condicioncompra
 * 
 * @property int $idCondicionCompra
 * @property string|null $nombre
 * 
 * @property Collection|Compra[] $compras
 *
 * @package App\Models
 */
class Condicioncompra extends Model
{
	protected $table = 'condicioncompra';
	protected $primaryKey = 'idCondicionCompra';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];

	public function compras()
	{
		return $this->hasMany(Compra::class, 'idCondicionCompra');
	}
}
