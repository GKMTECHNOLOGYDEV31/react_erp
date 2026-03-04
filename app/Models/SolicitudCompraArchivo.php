<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class SolicitudCompraArchivo
 * 
 * @property int $idArchivo
 * @property int $idSolicitudCompra
 * @property string $nombre_archivo
 * @property string $ruta_archivo
 * @property string|null $tipo_archivo
 * @property int|null $tamaño
 * @property string|null $descripcion
 * @property Carbon $created_at
 * 
 * @property SolicitudCompra $solicitud_compra
 *
 * @package App\Models
 */
class SolicitudCompraArchivo extends Model
{
	protected $table = 'solicitud_compra_archivos';
	protected $primaryKey = 'idArchivo';
	public $timestamps = false;

	protected $casts = [
		'idSolicitudCompra' => 'int',
		'tamaño' => 'int'
	];

	protected $fillable = [
		'idSolicitudCompra',
		'nombre_archivo',
		'ruta_archivo',
		'tipo_archivo',
		'tamaño',
		'descripcion'
	];

	public function solicitud_compra()
	{
		return $this->belongsTo(SolicitudCompra::class, 'idSolicitudCompra');
	}
}
