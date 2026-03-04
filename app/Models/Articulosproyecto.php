<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Articulosproyecto
 * 
 * @property int $idArticulosProyecto
 * @property int $idProyecto
 * 
 * @property Proyecto $proyecto
 *
 * @package App\Models
 */
class Articulosproyecto extends Model
{
	protected $table = 'articulosproyecto';
	protected $primaryKey = 'idArticulosProyecto';
	public $timestamps = false;

	protected $casts = [
		'idProyecto' => 'int'
	];

	protected $fillable = [
		'idProyecto'
	];

	public function proyecto()
	{
		return $this->belongsTo(Proyecto::class, 'idProyecto');
	}
}
