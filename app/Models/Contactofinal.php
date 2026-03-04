<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Contactofinal
 * 
 * @property int $idContactoFinal
 * @property string $nombre_completo
 * @property int $idTipoDocumento
 * @property string $numero_documento
 * @property string|null $correo
 * @property string|null $telefono
 * @property bool $estado
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Tipodocumento $tipodocumento
 * @property Collection|ClienteGeneralContactoFinal[] $cliente_general_contacto_finals
 *
 * @package App\Models
 */
class Contactofinal extends Model
{
	protected $table = 'contactofinal';
	protected $primaryKey = 'idContactoFinal';

	protected $casts = [
		'idTipoDocumento' => 'int',
		'estado' => 'bool'
	];

	protected $fillable = [
		'nombre_completo',
		'idTipoDocumento',
		'numero_documento',
		'correo',
		'telefono',
		'estado'
	];

	public function tipodocumento()
	{
		return $this->belongsTo(Tipodocumento::class, 'idTipoDocumento');
	}

	public function cliente_general_contacto_finals()
	{
		return $this->hasMany(ClienteGeneralContactoFinal::class, 'idContactoFinal');
	}
}
