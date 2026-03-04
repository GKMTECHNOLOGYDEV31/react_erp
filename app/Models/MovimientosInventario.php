<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class MovimientosInventario
 * 
 * @property int $idMovimiento
 * @property int $idUsuario
 * @property int $idInventario
 * @property int $cantidad
 * @property int $idVisitas
 * @property Carbon|null $fecha_movimiento
 * 
 * @property Usuario $usuario
 * @property InventarioTecnico $inventario_tecnico
 * @property Visita $visita
 *
 * @package App\Models
 */
class MovimientosInventario extends Model
{
	protected $table = 'movimientos_inventario';
	protected $primaryKey = 'idMovimiento';
	public $timestamps = false;

	protected $casts = [
		'idUsuario' => 'int',
		'idInventario' => 'int',
		'cantidad' => 'int',
		'idVisitas' => 'int',
		'fecha_movimiento' => 'datetime'
	];

	protected $fillable = [
		'idUsuario',
		'idInventario',
		'cantidad',
		'idVisitas',
		'fecha_movimiento'
	];

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}

	public function inventario_tecnico()
	{
		return $this->belongsTo(InventarioTecnico::class, 'idInventario');
	}

	public function visita()
	{
		return $this->belongsTo(Visita::class, 'idVisitas');
	}
}
