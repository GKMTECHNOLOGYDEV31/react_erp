<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Sujeto
 * 
 * @property int $idSujeto
 * @property string|null $nombre
 * 
 * @property Collection|Compra[] $compras
 *
 * @package App\Models
 */
class Sujeto extends Model
{
	protected $table = 'sujeto';
	protected $primaryKey = 'idSujeto';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];

	public function compras()
	{
		return $this->hasMany(Compra::class, 'idSujeto');
	}
}
