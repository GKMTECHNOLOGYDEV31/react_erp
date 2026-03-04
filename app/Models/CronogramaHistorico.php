<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class CronogramaHistorico
 * 
 * @property int $id
 * @property int $idSeguimiento
 * @property string $task_id
 * @property string $accion
 * @property string|null $datos_anteriores
 * @property string|null $datos_nuevos
 * @property int|null $usuario_id
 * @property Carbon $created_at
 * 
 * @property Seguimiento $seguimiento
 *
 * @package App\Models
 */
class CronogramaHistorico extends Model
{
	protected $table = 'cronograma_historico';
	public $timestamps = false;

	protected $casts = [
		'idSeguimiento' => 'int',
		'usuario_id' => 'int'
	];

	protected $fillable = [
		'idSeguimiento',
		'task_id',
		'accion',
		'datos_anteriores',
		'datos_nuevos',
		'usuario_id'
	];

	public function seguimiento()
	{
		return $this->belongsTo(Seguimiento::class, 'idSeguimiento');
	}
}
