<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Tipopago
 * 
 * @property int $idTipoPago
 * @property string|null $nombre
 * 
 * @property Collection|Compra[] $compras
 *
 * @package App\Models
 */
class Tipopago extends Model
{
	protected $table = 'tipopago';
	protected $primaryKey = 'idTipoPago';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];

	public function compras()
	{
		return $this->hasMany(Compra::class, 'idTipoPago');
	}
}
