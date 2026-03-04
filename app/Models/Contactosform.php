<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Contactosform
 * 
 * @property int $id
 * @property int $idSeguimiento
 * @property int|null $tipo_documento_id
 * @property string $numero_documento
 * @property string $nombre_completo
 * @property string|null $cargo
 * @property string|null $correo_electronico
 * @property string|null $telefono_whatsapp
 * @property int|null $nivel_decision_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Seguimiento $seguimiento
 * @property Tipodocumento|null $tipodocumento
 * @property NivelesDecision|null $niveles_decision
 *
 * @package App\Models
 */
class Contactosform extends Model
{
	protected $table = 'contactosform';

	protected $casts = [
		'idSeguimiento' => 'int',
		'tipo_documento_id' => 'int',
		'nivel_decision_id' => 'int'
	];

	protected $fillable = [
		'idSeguimiento',
		'tipo_documento_id',
		'numero_documento',
		'nombre_completo',
		'cargo',
		'correo_electronico',
		'telefono_whatsapp',
		'nivel_decision_id'
	];

	public function seguimiento()
	{
		return $this->belongsTo(Seguimiento::class, 'idSeguimiento');
	}

	public function tipodocumento()
	{
		return $this->belongsTo(Tipodocumento::class, 'tipo_documento_id');
	}

	public function niveles_decision()
	{
		return $this->belongsTo(NivelesDecision::class, 'nivel_decision_id');
	}
}
