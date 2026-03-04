<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Actividade
 * 
 * @property int $actividad_id
 * @property string $titulo
 * @property string|null $etiqueta
 * @property Carbon $fechainicio
 * @property Carbon|null $fechafin
 * @property string|null $enlaceevento
 * @property string|null $ubicacion
 * @property string|null $descripcion
 * @property int $user_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Usuario $usuario
 * @property Collection|Invitado[] $invitados
 *
 * @package App\Models
 */
class Actividade extends Model
{
	protected $table = 'actividades';
	protected $primaryKey = 'actividad_id';

	protected $casts = [
		'fechainicio' => 'datetime',
		'fechafin' => 'datetime',
		'user_id' => 'int'
	];

	protected $fillable = [
		'titulo',
		'etiqueta',
		'fechainicio',
		'fechafin',
		'enlaceevento',
		'ubicacion',
		'descripcion',
		'user_id'
	];

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'user_id');
	}

	public function invitados()
	{
		return $this->hasMany(Invitado::class, 'actividad_id');
	}
}
