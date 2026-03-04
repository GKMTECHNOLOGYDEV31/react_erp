<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class DetalleAsignacione
 * 
 * @property int $id
 * @property int $asignacion_id
 * @property int $articulo_id
 * @property string|null $codigo_articulo
 * @property string|null $nombre_articulo
 * @property int $cantidad
 * @property string|null $tipo
 * @property string|null $numero_serie
 * @property string|null $estado_articulo
 * @property Carbon|null $fecha_entrega_esperada
 * @property Carbon|null $fecha_entrega_real
 * @property Carbon|null $fecha_devolucion_esperada
 * @property Carbon|null $fecha_devolucion_real
 * @property bool|null $requiere_devolucion
 * @property string|null $observaciones
 * @property int|null $id_solicitud_detalle
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Asignacione $asignacione
 * @property Articulo $articulo
 *
 * @package App\Models
 */
class DetalleAsignacione extends Model
{
	protected $table = 'detalle_asignaciones';

	protected $casts = [
		'asignacion_id' => 'int',
		'articulo_id' => 'int',
		'cantidad' => 'int',
		'fecha_entrega_esperada' => 'datetime',
		'fecha_entrega_real' => 'datetime',
		'fecha_devolucion_esperada' => 'datetime',
		'fecha_devolucion_real' => 'datetime',
		'requiere_devolucion' => 'bool',
		'id_solicitud_detalle' => 'int'
	];

	protected $fillable = [
		'asignacion_id',
		'articulo_id',
		'codigo_articulo',
		'nombre_articulo',
		'cantidad',
		'tipo',
		'numero_serie',
		'estado_articulo',
		'fecha_entrega_esperada',
		'fecha_entrega_real',
		'fecha_devolucion_esperada',
		'fecha_devolucion_real',
		'requiere_devolucion',
		'observaciones',
		'id_solicitud_detalle'
	];

	public function asignacione()
	{
		return $this->belongsTo(Asignacione::class, 'asignacion_id');
	}

	public function articulo()
	{
		return $this->belongsTo(Articulo::class);
	}
}
