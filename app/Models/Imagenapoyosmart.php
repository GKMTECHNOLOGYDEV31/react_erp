<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Imagenapoyosmart
 * 
 * @property int $idImagenApoyoSmart
 * @property string|null $imagen
 * @property int|null $idVisitas
 * @property string|null $descripcion
 * 
 * @property Visita|null $visita
 *
 * @package App\Models
 */
class Imagenapoyosmart extends Model
{
	protected $table = 'imagenapoyosmart';
	protected $primaryKey = 'idImagenApoyoSmart';
	public $timestamps = false;

	protected $casts = [
		'idVisitas' => 'int'
	];

	protected $fillable = [
		'imagen',
		'idVisitas',
		'descripcion'
	];

	public function visita()
	{
		return $this->belongsTo(Visita::class, 'idVisitas');
	}
}
