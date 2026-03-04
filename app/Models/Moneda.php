<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Moneda
 * 
 * @property int $idMonedas
 * @property string|null $nombre
 * @property string|null $simbolo
 * 
 * @property Collection|Compra[] $compras
 * @property Collection|SolicitudCompraDetalle[] $solicitud_compra_detalles
 *
 * @package App\Models
 */
class Moneda extends Model
{
	protected $table = 'monedas';
	protected $primaryKey = 'idMonedas';
	public $timestamps = false;

	protected $fillable = [
		'nombre',
		'simbolo'
	];

	public function compras()
	{
		return $this->hasMany(Compra::class, 'idMonedas');
	}

	public function solicitud_compra_detalles()
	{
		return $this->hasMany(SolicitudCompraDetalle::class, 'idMonedas');
	}
}
