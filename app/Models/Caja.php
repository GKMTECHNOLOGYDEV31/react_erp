<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Caja
 * 
 * @property int $idCaja
 * @property int $idModeloCaja
 * @property int $idArticulo
 * @property int $idTipoArticulo
 * @property int $cantidad_actual
 * @property int $capacidad
 * @property string $estado
 * @property bool $es_custodia
 * @property int $idAsignacion_rack
 * @property int $idubicaciones_rack
 * @property int $orden_en_pallet
 * @property Carbon $fecha_entrada
 * @property string|null $qr
 * @property string|null $nombre
 * 
 * @property Articulo $articulo
 * @property AsignacionRack $asignacion_rack
 * @property ModeloCaja $modelo_caja
 * @property Tipoarticulo $tipoarticulo
 * @property Collection|MovimientosAlmacen[] $movimientos_almacens
 *
 * @package App\Models
 */
class Caja extends Model
{
	protected $table = 'cajas';
	protected $primaryKey = 'idCaja';
	public $timestamps = false;

	protected $casts = [
		'idModeloCaja' => 'int',
		'idArticulo' => 'int',
		'idTipoArticulo' => 'int',
		'cantidad_actual' => 'int',
		'capacidad' => 'int',
		'es_custodia' => 'bool',
		'idAsignacion_rack' => 'int',
		'idubicaciones_rack' => 'int',
		'orden_en_pallet' => 'int',
		'fecha_entrada' => 'datetime'
	];

	protected $fillable = [
		'idModeloCaja',
		'idArticulo',
		'idTipoArticulo',
		'cantidad_actual',
		'capacidad',
		'estado',
		'es_custodia',
		'idAsignacion_rack',
		'idubicaciones_rack',
		'orden_en_pallet',
		'fecha_entrada',
		'qr',
		'nombre'
	];

	public function articulo()
	{
		return $this->belongsTo(Articulo::class, 'idArticulo');
	}

	public function asignacion_rack()
	{
		return $this->belongsTo(AsignacionRack::class, 'idAsignacion_rack');
	}

	public function modelo_caja()
	{
		return $this->belongsTo(ModeloCaja::class, 'idModeloCaja');
	}

	public function tipoarticulo()
	{
		return $this->belongsTo(Tipoarticulo::class, 'idTipoArticulo');
	}

	public function movimientos_almacens()
	{
		return $this->hasMany(MovimientosAlmacen::class, 'idCaja');
	}
}
