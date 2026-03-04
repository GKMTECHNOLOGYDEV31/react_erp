<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Cast
 * 
 * @property int $idCast
 * @property string|null $nombre
 * @property string|null $telefono
 * @property string|null $email
 * @property string|null $direccion
 * @property string|null $ruc
 * @property string|null $provincia
 * @property string|null $distrito
 * @property string|null $departamento
 * @property int|null $estado
 *
 * @package App\Models
 */
class Cast extends Model
{
	protected $table = 'cast';
	protected $primaryKey = 'idCast';
	public $timestamps = false;

	protected $casts = [
		'estado' => 'int'
	];

	protected $fillable = [
		'nombre',
		'telefono',
		'email',
		'direccion',
		'ruc',
		'provincia',
		'distrito',
		'departamento',
		'estado'
	];
}
