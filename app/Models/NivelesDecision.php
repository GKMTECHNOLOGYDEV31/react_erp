<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class NivelesDecision
 * 
 * @property int $id
 * @property string $nombre
 * @property string|null $descripcion
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|Contacto[] $contactos
 * @property Collection|Contactosform[] $contactosforms
 *
 * @package App\Models
 */
class NivelesDecision extends Model
{
	protected $table = 'niveles_decision';

	protected $fillable = [
		'nombre',
		'descripcion'
	];

	public function contactos()
	{
		return $this->hasMany(Contacto::class, 'nivel_decision_id');
	}

	public function contactosforms()
	{
		return $this->hasMany(Contactosform::class, 'nivel_decision_id');
	}
}
