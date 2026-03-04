<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class SolicitudIngreso
 * 
 * @property int $idSolicitudIngreso
 * @property string $origen
 * @property int $origen_id
 * @property int $articulo_id
 * @property int $cantidad
 * @property Carbon $fecha_origen
 * @property int|null $proveedor_id
 * @property int|null $cliente_general_id
 * @property string|null $ubicacion
 * @property string|null $lote
 * @property Carbon|null $fecha_vencimiento
 * @property string|null $observaciones
 * @property string $estado
 * @property int|null $usuario_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @package App\Models
 */
class SolicitudIngreso extends Model
{
	protected $table = 'solicitud_ingreso';
	protected $primaryKey = 'idSolicitudIngreso';

	protected $casts = [
		'origen_id' => 'int',
		'articulo_id' => 'int',
		'cantidad' => 'int',
		'fecha_origen' => 'datetime',
		'proveedor_id' => 'int',
		'cliente_general_id' => 'int',
		'fecha_vencimiento' => 'datetime',
		'usuario_id' => 'int'
	];

	protected $fillable = [
		'origen',
		'origen_id',
		'articulo_id',
		'cantidad',
		'fecha_origen',
		'proveedor_id',
		'cliente_general_id',
		'ubicacion',
		'lote',
		'fecha_vencimiento',
		'observaciones',
		'estado',
		'usuario_id'
	];
}
