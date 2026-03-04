<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class InventarioIngresosCliente
 * 
 * @property int $id
 * @property int|null $compra_id
 * @property int $articulo_id
 * @property string $tipo_ingreso
 * @property int|null $ingreso_id
 * @property int|null $cliente_general_id
 * @property int $cantidad
 * @property string|null $cas
 * @property string|null $numero_orden
 * @property string|null $codigo_solicitud
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Compra|null $compra
 * @property Articulo $articulo
 * @property Clientegeneral|null $clientegeneral
 *
 * @package App\Models
 */
class InventarioIngresosCliente extends Model
{
	protected $table = 'inventario_ingresos_clientes';

	protected $casts = [
		'compra_id' => 'int',
		'articulo_id' => 'int',
		'ingreso_id' => 'int',
		'cliente_general_id' => 'int',
		'cantidad' => 'int'
	];

	protected $fillable = [
		'compra_id',
		'articulo_id',
		'tipo_ingreso',
		'ingreso_id',
		'cliente_general_id',
		'cantidad',
		'cas',
		'numero_orden',
		'codigo_solicitud'
	];

	public function compra()
	{
		return $this->belongsTo(Compra::class);
	}

	public function articulo()
	{
		return $this->belongsTo(Articulo::class);
	}

	public function clientegeneral()
	{
		return $this->belongsTo(Clientegeneral::class, 'cliente_general_id');
	}
}
