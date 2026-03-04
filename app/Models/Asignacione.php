<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Asignacione
 * 
 * @property int $id
 * @property string|null $codigo_asignacion
 * @property int $idUsuario
 * @property int|null $idSolicitud
 * @property string|null $codigo_solicitud
 * @property int|null $id_area_destino
 * @property Carbon $fecha_asignacion
 * @property Carbon|null $fecha_devolucion
 * @property Carbon|null $fecha_entrega_real
 * @property string|null $observaciones
 * @property string|null $tipo_asignacion
 * @property int|null $total_articulos
 * @property int|null $total_cantidad
 * @property int|null $con_devolucion
 * @property int|null $sin_devolucion
 * @property int|null $id_usuario_creador
 * @property string|null $estado
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Usuario $usuario
 * @property Collection|DetalleAsignacione[] $detalle_asignaciones
 *
 * @package App\Models
 */
class Asignacione extends Model
{
	protected $table = 'asignaciones';

	protected $casts = [
		'idUsuario' => 'int',
		'idSolicitud' => 'int',
		'id_area_destino' => 'int',
		'fecha_asignacion' => 'datetime',
		'fecha_devolucion' => 'datetime',
		'fecha_entrega_real' => 'datetime',
		'total_articulos' => 'int',
		'total_cantidad' => 'int',
		'con_devolucion' => 'int',
		'sin_devolucion' => 'int',
		'id_usuario_creador' => 'int'
	];

	protected $fillable = [
		'codigo_asignacion',
		'idUsuario',
		'idSolicitud',
		'codigo_solicitud',
		'id_area_destino',
		'fecha_asignacion',
		'fecha_devolucion',
		'fecha_entrega_real',
		'observaciones',
		'tipo_asignacion',
		'total_articulos',
		'total_cantidad',
		'con_devolucion',
		'sin_devolucion',
		'id_usuario_creador',
		'estado'
	];

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}

	public function detalle_asignaciones()
	{
		return $this->hasMany(DetalleAsignacione::class, 'asignacion_id');
	}
}
