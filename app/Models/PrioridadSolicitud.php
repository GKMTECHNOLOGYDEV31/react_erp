<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class PrioridadSolicitud
 * 
 * @property int $idPrioridad
 * @property string $nombre
 * @property int $nivel
 * @property string|null $color
 * @property string|null $descripcion
 * @property bool|null $estado
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Collection|SolicitudAlmacen[] $solicitud_almacens
 *
 * @package App\Models
 */
class PrioridadSolicitud extends Model
{
	protected $table = 'prioridad_solicitud';
	protected $primaryKey = 'idPrioridad';

	protected $casts = [
		'nivel' => 'int',
		'estado' => 'bool'
	];

	protected $fillable = [
		'nombre',
		'nivel',
		'color',
		'descripcion',
		'estado'
	];

	public function solicitud_almacens()
	{
		return $this->hasMany(SolicitudAlmacen::class, 'idPrioridad');
	}
}
