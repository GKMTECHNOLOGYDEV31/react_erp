<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class MovimientosAlmacen
 * 
 * @property int $idMovimiento
 * @property int $idSucursal
 * @property int $idArticulo
 * @property int|null $idCaja
 * @property int|null $idAsignacion_rack
 * @property int|null $idubicaciones_rack
 * @property string $tipo
 * @property bool $es_custodia
 * @property int $cantidad
 * @property float|null $costo_unitario
 * @property Carbon $fecha
 * @property int|null $cantidad_caja_antes
 * @property int|null $cantidad_caja_despues
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Articulo $articulo
 * @property AsignacionRack|null $asignacion_rack
 * @property Caja|null $caja
 * @property Sucursal $sucursal
 *
 * @package App\Models
 */
class MovimientosAlmacen extends Model
{
	protected $table = 'movimientos_almacen';
	protected $primaryKey = 'idMovimiento';

	protected $casts = [
		'idSucursal' => 'int',
		'idArticulo' => 'int',
		'idCaja' => 'int',
		'idAsignacion_rack' => 'int',
		'idubicaciones_rack' => 'int',
		'es_custodia' => 'bool',
		'cantidad' => 'int',
		'costo_unitario' => 'float',
		'fecha' => 'datetime',
		'cantidad_caja_antes' => 'int',
		'cantidad_caja_despues' => 'int'
	];

	protected $fillable = [
		'idSucursal',
		'idArticulo',
		'idCaja',
		'idAsignacion_rack',
		'idubicaciones_rack',
		'tipo',
		'es_custodia',
		'cantidad',
		'costo_unitario',
		'fecha',
		'cantidad_caja_antes',
		'cantidad_caja_despues'
	];

	public function articulo()
	{
		return $this->belongsTo(Articulo::class, 'idArticulo');
	}

	public function asignacion_rack()
	{
		return $this->belongsTo(AsignacionRack::class, 'idAsignacion_rack');
	}

	public function caja()
	{
		return $this->belongsTo(Caja::class, 'idCaja');
	}

	public function sucursal()
	{
		return $this->belongsTo(Sucursal::class, 'idSucursal');
	}
}
