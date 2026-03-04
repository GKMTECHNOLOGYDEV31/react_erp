<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class SolicitudAlmacenArchivo
 * 
 * @property int $idArchivo
 * @property int $idSolicitudAlmacen
 * @property string $nombre_archivo
 * @property string $ruta_archivo
 * @property string|null $tipo_archivo
 * @property int|null $tamaño
 * @property string|null $descripcion
 * @property int|null $uploaded_by
 * @property Carbon $created_at
 * 
 * @property SolicitudAlmacen $solicitud_almacen
 *
 * @package App\Models
 */
class SolicitudAlmacenArchivo extends Model
{
	protected $table = 'solicitud_almacen_archivos';
	protected $primaryKey = 'idArchivo';
	public $timestamps = false;

	protected $casts = [
		'idSolicitudAlmacen' => 'int',
		'tamaño' => 'int',
		'uploaded_by' => 'int'
	];

	protected $fillable = [
		'idSolicitudAlmacen',
		'nombre_archivo',
		'ruta_archivo',
		'tipo_archivo',
		'tamaño',
		'descripcion',
		'uploaded_by'
	];

	public function solicitud_almacen()
	{
		return $this->belongsTo(SolicitudAlmacen::class, 'idSolicitudAlmacen');
	}
}
