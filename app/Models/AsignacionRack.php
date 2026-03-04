<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class AsignacionRack
 * 
 * @property int $idAsignacion_rack
 * @property int|null $idModelo
 * @property string|null $nombre
 * @property int|null $idSucursal
 * @property bool $es_custodia
 * @property int|null $estado
 * @property Carbon|null $fecha
 * 
 * @property ModeloRack|null $modelo_rack
 * @property Sucursal|null $sucursal
 * @property Collection|Caja[] $cajas
 * @property Collection|MovimientosAlmacen[] $movimientos_almacens
 * @property Collection|UbicacionesRack[] $ubicaciones_racks
 *
 * @package App\Models
 */
class AsignacionRack extends Model
{
	protected $table = 'asignacion_rack';
	protected $primaryKey = 'idAsignacion_rack';
	public $timestamps = false;

	protected $casts = [
		'idModelo' => 'int',
		'idSucursal' => 'int',
		'es_custodia' => 'bool',
		'estado' => 'int',
		'fecha' => 'datetime'
	];

	protected $fillable = [
		'idModelo',
		'nombre',
		'idSucursal',
		'es_custodia',
		'estado',
		'fecha'
	];

	public function modelo_rack()
	{
		return $this->belongsTo(ModeloRack::class, 'idModelo');
	}

	public function sucursal()
	{
		return $this->belongsTo(Sucursal::class, 'idSucursal');
	}

	public function cajas()
	{
		return $this->hasMany(Caja::class, 'idAsignacion_rack');
	}

	public function movimientos_almacens()
	{
		return $this->hasMany(MovimientosAlmacen::class, 'idAsignacion_rack');
	}

	public function ubicaciones_racks()
	{
		return $this->hasMany(UbicacionesRack::class, 'idAsignacion_rack');
	}
}
