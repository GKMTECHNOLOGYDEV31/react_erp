<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Ordenesarticulo
 * 
 * @property int $idOrdenesArticulos
 * @property int|null $cantidad
 * @property bool|null $estado
 * @property string|null $observacion
 * @property string|null $fotoRepuesto
 * @property string|null $foto_articulo_usado
 * @property string|null $foto_articulo_no_usado
 * @property Carbon|null $fechaUsado
 * @property Carbon|null $fechaSinUsar
 * @property int $idSolicitudesOrdenes
 * @property int $idArticulos
 * @property int|null $idUbicacion
 * @property string|null $fotos_evidencia
 * @property int|null $id_area_destino
 * @property int|null $id_usuario_destino
 * @property int|null $idticket
 * @property string|null $codigo_cotizacion
 * @property int|null $id_asignacion
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property bool|null $requiere_devolucion
 * @property Carbon|null $fecha_devolucion_programada
 *
 * @package App\Models
 */
class Ordenesarticulo extends Model
{
	protected $table = 'ordenesarticulos';
	protected $primaryKey = 'idOrdenesArticulos';

	protected $casts = [
		'cantidad' => 'int',
		'estado' => 'bool',
		'fechaUsado' => 'datetime',
		'fechaSinUsar' => 'datetime',
		'idSolicitudesOrdenes' => 'int',
		'idArticulos' => 'int',
		'idUbicacion' => 'int',
		'id_area_destino' => 'int',
		'id_usuario_destino' => 'int',
		'idticket' => 'int',
		'id_asignacion' => 'int',
		'requiere_devolucion' => 'bool',
		'fecha_devolucion_programada' => 'datetime'
	];

	protected $fillable = [
		'cantidad',
		'estado',
		'observacion',
		'fotoRepuesto',
		'foto_articulo_usado',
		'foto_articulo_no_usado',
		'fechaUsado',
		'fechaSinUsar',
		'idSolicitudesOrdenes',
		'idArticulos',
		'idUbicacion',
		'fotos_evidencia',
		'id_area_destino',
		'id_usuario_destino',
		'idticket',
		'codigo_cotizacion',
		'id_asignacion',
		'requiere_devolucion',
		'fecha_devolucion_programada'
	];
}
