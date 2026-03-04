<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Solucion
 * 
 * @property int $idSolucion
 * @property string|null $solucion
 * @property int $idTicketSoporte
 * @property int $idUsuario
 *
 * @package App\Models
 */
class Solucion extends Model
{
	protected $table = 'solucion';
	protected $primaryKey = 'idSolucion';
	public $timestamps = false;

	protected $casts = [
		'idTicketSoporte' => 'int',
		'idUsuario' => 'int'
	];

	protected $fillable = [
		'solucion',
		'idTicketSoporte',
		'idUsuario'
	];
}
