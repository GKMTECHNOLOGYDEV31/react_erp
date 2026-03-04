<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class EntradasProveedore
 * 
 * @property int $id
 * @property string|null $codigo_entrada
 * @property string $tipo_entrada
 * @property Carbon $fecha_ingreso
 * @property int|null $cliente_general_id
 * @property string|null $observaciones
 * @property string|null $archivo_adjunto
 * @property string|null $estado
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|EntradasProveedoresDetalle[] $entradas_proveedores_detalles
 *
 * @package App\Models
 */
class EntradasProveedore extends Model
{
	protected $table = 'entradas_proveedores';

	protected $casts = [
		'fecha_ingreso' => 'datetime',
		'cliente_general_id' => 'int'
	];

	protected $fillable = [
		'codigo_entrada',
		'tipo_entrada',
		'fecha_ingreso',
		'cliente_general_id',
		'observaciones',
		'archivo_adjunto',
		'estado'
	];

	public function entradas_proveedores_detalles()
	{
		return $this->hasMany(EntradasProveedoresDetalle::class, 'entrada_id');
	}
}
