<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class InventarioTecnico
 * 
 * @property int $idInventario
 * @property int $idUsuario
 * @property int $idArticulos
 * @property int $cantidad
 * @property Carbon|null $fecha_actualizacion
 * 
 * @property Usuario $usuario
 * @property Articulo $articulo
 * @property Collection|MovimientosInventario[] $movimientos_inventarios
 *
 * @package App\Models
 */
class InventarioTecnico extends Model
{
	protected $table = 'inventario_tecnico';
	protected $primaryKey = 'idInventario';
	public $timestamps = false;

	protected $casts = [
		'idUsuario' => 'int',
		'idArticulos' => 'int',
		'cantidad' => 'int',
		'fecha_actualizacion' => 'datetime'
	];

	protected $fillable = [
		'idUsuario',
		'idArticulos',
		'cantidad',
		'fecha_actualizacion'
	];

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}

	public function articulo()
	{
		return $this->belongsTo(Articulo::class, 'idArticulos');
	}

	public function movimientos_inventarios()
	{
		return $this->hasMany(MovimientosInventario::class, 'idInventario');
	}
}
