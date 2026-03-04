<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Sucursal
 * 
 * @property int $idSucursal
 * @property string|null $ruc
 * @property string|null $nombre
 * @property string|null $direccion
 * @property bool|null $estado
 * @property string|null $telefono
 * @property float|null $lat
 * @property float|null $lng
 * 
 * @property Collection|AsignacionRack[] $asignacion_racks
 * @property Collection|MovimientosAlmacen[] $movimientos_almacens
 *
 * @package App\Models
 */
class Sucursal extends Model
{
	protected $table = 'sucursal';
	protected $primaryKey = 'idSucursal';
	public $timestamps = false;

	protected $casts = [
		'estado' => 'bool',
		'lat' => 'float',
		'lng' => 'float'
	];

	protected $fillable = [
		'ruc',
		'nombre',
		'direccion',
		'estado',
		'telefono',
		'lat',
		'lng'
	];

	public function asignacion_racks()
	{
		return $this->hasMany(AsignacionRack::class, 'idSucursal');
	}

	public function movimientos_almacens()
	{
		return $this->hasMany(MovimientosAlmacen::class, 'idSucursal');
	}
}
