<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Cuentasbancaria
 * 
 * @property int $idCuenta
 * @property int|null $tipodecuenta
 * @property string|null $numerocuenta
 * @property int|null $idUsuario
 * 
 * @property Usuario|null $usuario
 *
 * @package App\Models
 */
class Cuentasbancaria extends Model
{
	protected $table = 'cuentasbancarias';
	protected $primaryKey = 'idCuenta';
	public $timestamps = false;

	protected $casts = [
		'tipodecuenta' => 'int',
		'idUsuario' => 'int'
	];

	protected $fillable = [
		'tipodecuenta',
		'numerocuenta',
		'idUsuario'
	];

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}
}
