<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Invitado
 * 
 * @property int $idinvitados
 * @property int $actividad_id
 * @property int $id_usuarios
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Actividade $actividade
 * @property Usuario $usuario
 *
 * @package App\Models
 */
class Invitado extends Model
{
	protected $table = 'invitados';
	protected $primaryKey = 'idinvitados';

	protected $casts = [
		'actividad_id' => 'int',
		'id_usuarios' => 'int'
	];

	protected $fillable = [
		'actividad_id',
		'id_usuarios'
	];

	public function actividade()
	{
		return $this->belongsTo(Actividade::class, 'actividad_id');
	}

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'id_usuarios');
	}
}
