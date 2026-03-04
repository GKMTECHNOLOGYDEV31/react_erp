<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class SolicitudAlmacenHistorial
 * 
 * @property int $idHistorial
 * @property int $idSolicitudAlmacen
 * @property string|null $estado_anterior
 * @property string $estado_nuevo
 * @property string|null $observaciones
 * @property int|null $usuario_id
 * @property Carbon $created_at
 * 
 * @property SolicitudAlmacen $solicitud_almacen
 *
 * @package App\Models
 */
class SolicitudAlmacenHistorial extends Model
{
	protected $table = 'solicitud_almacen_historial';
	protected $primaryKey = 'idHistorial';
	public $timestamps = false;

	protected $casts = [
		'idSolicitudAlmacen' => 'int',
		'usuario_id' => 'int'
	];

	protected $fillable = [
		'idSolicitudAlmacen',
		'estado_anterior',
		'estado_nuevo',
		'observaciones',
		'usuario_id'
	];

	public function solicitud_almacen()
	{
		return $this->belongsTo(SolicitudAlmacen::class, 'idSolicitudAlmacen');
	}
}
