<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Cliente
 * 
 * @property int $idCliente
 * @property string|null $nombre
 * @property string|null $documento
 * @property string|null $telefono
 * @property string|null $email
 * @property Carbon|null $fecha_registro
 * @property string|null $direccion
 * @property string|null $departamento
 * @property string|null $provincia
 * @property bool|null $estado
 * @property int|null $idTipoDocumento
 * @property string|null $distrito
 * @property string|null $esTienda
 * 
 * @property Tipodocumento|null $tipodocumento
 *
 * @package App\Models
 */
class Cliente extends Model
{
	protected $table = 'cliente';
	protected $primaryKey = 'idCliente';
	public $timestamps = false;

	protected $casts = [
		'fecha_registro' => 'datetime',
		'estado' => 'bool',
		'idTipoDocumento' => 'int'
	];

	protected $fillable = [
		'nombre',
		'documento',
		'telefono',
		'email',
		'fecha_registro',
		'direccion',
		'departamento',
		'provincia',
		'estado',
		'idTipoDocumento',
		'distrito',
		'esTienda'
	];

	public function tipodocumento()
	{
		return $this->belongsTo(Tipodocumento::class, 'idTipoDocumento');
	}
}
