<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class AccionesVisita
 * 
 * @property int $idaccionesvisitas
 * @property bool|null $estado
 * @property string|null $descripcion
 * @property int|null $idVisitas
 * 
 * @property Visita|null $visita
 *
 * @package App\Models
 */
class AccionesVisita extends Model
{
	protected $table = 'acciones_visitas';
	protected $primaryKey = 'idaccionesvisitas';
	public $timestamps = false;

	protected $casts = [
		'estado' => 'bool',
		'idVisitas' => 'int'
	];

	protected $fillable = [
		'estado',
		'descripcion',
		'idVisitas'
	];

	public function visita()
	{
		return $this->belongsTo(Visita::class, 'idVisitas');
	}
}
