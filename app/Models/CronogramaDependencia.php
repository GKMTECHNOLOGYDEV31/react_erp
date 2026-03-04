<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class CronogramaDependencia
 * 
 * @property int $id
 * @property int $idSeguimiento
 * @property int|null $idpersona
 * @property string $link_id
 * @property string $source_task_id
 * @property string $target_task_id
 * @property string|null $tipo_dependencia
 * @property int|null $retraso
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Seguimiento $seguimiento
 *
 * @package App\Models
 */
class CronogramaDependencia extends Model
{
	protected $table = 'cronograma_dependencias';

	protected $casts = [
		'idSeguimiento' => 'int',
		'idpersona' => 'int',
		'retraso' => 'int'
	];

	protected $fillable = [
		'idSeguimiento',
		'idpersona',
		'link_id',
		'source_task_id',
		'target_task_id',
		'tipo_dependencia',
		'retraso'
	];

	public function seguimiento()
	{
		return $this->belongsTo(Seguimiento::class, 'idSeguimiento');
	}
}
