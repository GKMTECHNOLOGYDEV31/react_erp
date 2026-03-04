<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Proveedore
 * 
 * @property int $idProveedor
 * @property string|null $nombre
 * @property bool|null $estado
 * @property string|null $pais
 * @property string|null $departamento
 * @property string|null $provincia
 * @property string|null $distrito
 * @property string|null $direccion
 * @property string|null $codigoPostal
 * @property string|null $telefono
 * @property string|null $email
 * @property string|null $numeroDocumento
 * @property int|null $idTipoDocumento
 * @property int|null $idArea
 *
 * @package App\Models
 */
class Proveedore extends Model
{
	protected $table = 'proveedores';
	protected $primaryKey = 'idProveedor';
	public $timestamps = false;

	protected $casts = [
		'estado' => 'bool',
		'idTipoDocumento' => 'int',
		'idArea' => 'int'
	];

	protected $fillable = [
		'nombre',
		'estado',
		'pais',
		'departamento',
		'provincia',
		'distrito',
		'direccion',
		'codigoPostal',
		'telefono',
		'email',
		'numeroDocumento',
		'idTipoDocumento',
		'idArea'
	];
}
