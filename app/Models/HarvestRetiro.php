<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class HarvestRetiro
 * 
 * @property int $id
 * @property int $id_custodia
 * @property int $id_articulo
 * @property string $codigo_repuesto
 * @property string|null $nombre_repuesto
 * @property int $cantidad_retirada
 * @property string|null $observaciones
 * @property int $id_responsable
 * @property string|null $estado
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @package App\Models
 */
class HarvestRetiro extends Model
{
	protected $table = 'harvest_retiros';

	protected $casts = [
		'id_custodia' => 'int',
		'id_articulo' => 'int',
		'cantidad_retirada' => 'int',
		'id_responsable' => 'int'
	];

	protected $fillable = [
		'id_custodia',
		'id_articulo',
		'codigo_repuesto',
		'nombre_repuesto',
		'cantidad_retirada',
		'observaciones',
		'id_responsable',
		'estado'
	];
}
