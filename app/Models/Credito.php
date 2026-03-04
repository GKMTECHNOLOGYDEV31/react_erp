<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Credito
 * 
 * @property int $idCredito
 * @property float|null $credito_dias
 * @property float|null $credito_porcentaje
 * @property string|null $credito_descripcion
 * @property int $idTipoVenta
 *
 * @package App\Models
 */
class Credito extends Model
{
	protected $table = 'credito';
	protected $primaryKey = 'idCredito';
	public $timestamps = false;

	protected $casts = [
		'credito_dias' => 'float',
		'credito_porcentaje' => 'float',
		'idTipoVenta' => 'int'
	];

	protected $fillable = [
		'credito_dias',
		'credito_porcentaje',
		'credito_descripcion',
		'idTipoVenta'
	];
}
