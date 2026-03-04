<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class CronogramaConfiguracione
 * 
 * @property int $id
 * @property int $idSeguimiento
 * @property int|null $idpersona
 * @property string|null $vista_actual
 * @property Carbon|null $zoom_inicio
 * @property Carbon|null $zoom_fin
 * @property array|null $configuracion_json
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Seguimiento $seguimiento
 *
 * @package App\Models
 */
class CronogramaConfiguracione extends Model
{
	protected $table = 'cronograma_configuraciones';

	protected $casts = [
		'idSeguimiento' => 'int',
		'idpersona' => 'int',
		'zoom_inicio' => 'datetime',
		'zoom_fin' => 'datetime',
		'configuracion_json' => 'json'
	];

	protected $fillable = [
		'idSeguimiento',
		'idpersona',
		'vista_actual',
		'zoom_inicio',
		'zoom_fin',
		'configuracion_json'
	];

	public function seguimiento()
	{
		return $this->belongsTo(Seguimiento::class, 'idSeguimiento');
	}
}
