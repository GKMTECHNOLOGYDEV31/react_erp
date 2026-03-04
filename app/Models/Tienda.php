<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Tienda
 * 
 * @property int $idTienda
 * @property string|null $ruc
 * @property string|null $nombre
 * @property string|null $celular
 * @property string|null $email
 * @property string|null $direccion
 * @property string|null $referencia
 * @property float|null $lat
 * @property float|null $lng
 * @property int|null $idCliente
 * @property string|null $provincia
 * @property string|null $departamento
 * @property string|null $distrito
 *
 * @package App\Models
 */
class Tienda extends Model
{
	protected $table = 'tienda';
	protected $primaryKey = 'idTienda';
	public $timestamps = false;

	protected $casts = [
		'lat' => 'float',
		'lng' => 'float',
		'idCliente' => 'int'
	];

	protected $fillable = [
		'ruc',
		'nombre',
		'celular',
		'email',
		'direccion',
		'referencia',
		'lat',
		'lng',
		'idCliente',
		'provincia',
		'departamento',
		'distrito'
	];
}
