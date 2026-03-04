<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class TaskCotizacione
 * 
 * @property int $id
 * @property int $task_id
 * @property string|null $codigo_cotizacion
 * @property Carbon|null $fecha_cotizacion
 * @property string|null $detalle_producto
 * @property string|null $condiciones_comerciales
 * @property float|null $total_cotizacion
 * @property string|null $validez_cotizacion
 * @property string|null $responsable_cotizacion
 * @property string|null $observaciones
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Task $task
 *
 * @package App\Models
 */
class TaskCotizacione extends Model
{
	protected $table = 'task_cotizaciones';

	protected $casts = [
		'task_id' => 'int',
		'fecha_cotizacion' => 'datetime',
		'total_cotizacion' => 'float'
	];

	protected $fillable = [
		'task_id',
		'codigo_cotizacion',
		'fecha_cotizacion',
		'detalle_producto',
		'condiciones_comerciales',
		'total_cotizacion',
		'validez_cotizacion',
		'responsable_cotizacion',
		'observaciones'
	];

	public function task()
	{
		return $this->belongsTo(Task::class);
	}
}
