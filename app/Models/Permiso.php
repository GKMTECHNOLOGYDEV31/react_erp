<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Permiso
 * 
 * @property int $idPermiso
 * @property string $nombre
 * @property string|null $descripcion
 * @property string|null $modulo
 * @property int|null $estado
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @package App\Models
 */
class Permiso extends Model
{
	protected $table = 'permisos';
	protected $primaryKey = 'idPermiso';

	protected $casts = [
		'estado' => 'int'
	];

	protected $fillable = [
		'nombre',
		'descripcion',
		'modulo',
		'estado'
	];
}
