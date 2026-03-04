<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Contacto
 * 
 * @property int $id
 * @property string $tipo_documento
 * @property string $numero_documento
 * @property string $nombre_completo
 * @property string|null $cargo
 * @property string|null $correo_electronico
 * @property string|null $telefono_whatsapp
 * @property int|null $nivel_decision_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property NivelesDecision|null $niveles_decision
 * @property Collection|Seguimiento[] $seguimientos
 *
 * @package App\Models
 */
class Contacto extends Model
{
	protected $table = 'contactos';

	protected $casts = [
		'nivel_decision_id' => 'int'
	];

	protected $fillable = [
		'tipo_documento',
		'numero_documento',
		'nombre_completo',
		'cargo',
		'correo_electronico',
		'telefono_whatsapp',
		'nivel_decision_id'
	];

	public function niveles_decision()
	{
		return $this->belongsTo(NivelesDecision::class, 'nivel_decision_id');
	}

	public function seguimientos()
	{
		return $this->hasMany(Seguimiento::class, 'idContacto');
	}
}
