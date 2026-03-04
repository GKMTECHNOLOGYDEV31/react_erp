<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Servicio
 * 
 * @property int $idServicios
 * @property string|null $codigo
 * @property string|null $nombre
 * @property string|null $descripcion
 * @property float|null $precio_moneda
 * @property float|null $precio
 * @property float|null $precio_hora
 * @property float|null $hora_dia
 * @property float|null $hora_noche
 *
 * @package App\Models
 */
class Servicio extends Model
{
	protected $table = 'servicios';
	protected $primaryKey = 'idServicios';
	public $timestamps = false;

	protected $casts = [
		'precio_moneda' => 'float',
		'precio' => 'float',
		'precio_hora' => 'float',
		'hora_dia' => 'float',
		'hora_noche' => 'float'
	];

	protected $fillable = [
		'codigo',
		'nombre',
		'descripcion',
		'precio_moneda',
		'precio',
		'precio_hora',
		'hora_dia',
		'hora_noche'
	];
}
