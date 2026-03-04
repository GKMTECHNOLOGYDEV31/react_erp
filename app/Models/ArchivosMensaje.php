<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ArchivosMensaje
 * 
 * @property int $idArchivo
 * @property int $idMensaje
 * @property string $tipo
 * @property string $url
 * @property string|null $nombreOriginal
 * @property int|null $peso
 * @property int|null $duracionSegundos
 * @property Carbon|null $creadoEn
 * 
 * @property Mensaje $mensaje
 *
 * @package App\Models
 */
class ArchivosMensaje extends Model
{
	protected $table = 'archivos_mensaje';
	protected $primaryKey = 'idArchivo';
	public $timestamps = false;

	protected $casts = [
		'idMensaje' => 'int',
		'peso' => 'int',
		'duracionSegundos' => 'int',
		'creadoEn' => 'datetime'
	];

	protected $fillable = [
		'idMensaje',
		'tipo',
		'url',
		'nombreOriginal',
		'peso',
		'duracionSegundos',
		'creadoEn'
	];

	public function mensaje()
	{
		return $this->belongsTo(Mensaje::class, 'idMensaje');
	}
}
