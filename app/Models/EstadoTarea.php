<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class EstadoTarea
 * 
 * @property int $idEstadotarea
 * @property string|null $nombre
 *
 * @package App\Models
 */
class EstadoTarea extends Model
{
	protected $table = 'estado_tarea';
	protected $primaryKey = 'idEstadotarea';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];
}
