<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Modificacione
 * 
 * @property int $id
 * @property int $idTickets
 * @property string $campo
 * @property string|null $valor_antiguo
 * @property string|null $valor_nuevo
 * @property string $usuario
 * @property Carbon $fecha_modificacion
 * @property Carbon $created_at
 * @property Carbon $updated_at
 *
 * @package App\Models
 */
class Modificacione extends Model
{
	protected $table = 'modificaciones';

	protected $casts = [
		'idTickets' => 'int',
		'fecha_modificacion' => 'datetime'
	];

	protected $fillable = [
		'idTickets',
		'campo',
		'valor_antiguo',
		'valor_nuevo',
		'usuario',
		'fecha_modificacion'
	];
}
