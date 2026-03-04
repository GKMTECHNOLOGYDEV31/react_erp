<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Impuesto
 * 
 * @property int $idImpuesto
 * @property string|null $nombre
 * @property float|null $monto
 * 
 * @property Collection|Compra[] $compras
 *
 * @package App\Models
 */
class Impuesto extends Model
{
	protected $table = 'impuesto';
	protected $primaryKey = 'idImpuesto';
	public $timestamps = false;

	protected $casts = [
		'monto' => 'float'
	];

	protected $fillable = [
		'nombre',
		'monto'
	];

	public function compras()
	{
		return $this->hasMany(Compra::class, 'idImpuesto');
	}
}
