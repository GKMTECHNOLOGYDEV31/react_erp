<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Conversacione
 * 
 * @property int $idConversacion
 * @property string|null $nombre
 * @property bool|null $esGrupo
 * @property Carbon|null $fechaCreacion
 * @property int $creadoPor
 *
 * @package App\Models
 */
class Conversacione extends Model
{
	protected $table = 'conversaciones';
	protected $primaryKey = 'idConversacion';
	public $timestamps = false;

	protected $casts = [
		'esGrupo' => 'bool',
		'fechaCreacion' => 'datetime',
		'creadoPor' => 'int'
	];

	protected $fillable = [
		'nombre',
		'esGrupo',
		'fechaCreacion',
		'creadoPor'
	];
}
