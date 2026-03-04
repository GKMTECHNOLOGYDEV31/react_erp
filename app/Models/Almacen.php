<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Almacen
 * 
 * @property int $idAlmacen
 * @property string|null $ubicacion
 * @property int $idTipoAlmacen
 * 
 * @property Tipoalmacen $tipoalmacen
 * @property Collection|Boveda[] $bovedas
 *
 * @package App\Models
 */
class Almacen extends Model
{
	protected $table = 'almacen';
	protected $primaryKey = 'idAlmacen';
	public $timestamps = false;

	protected $casts = [
		'idTipoAlmacen' => 'int'
	];

	protected $fillable = [
		'ubicacion',
		'idTipoAlmacen'
	];

	public function tipoalmacen()
	{
		return $this->belongsTo(Tipoalmacen::class, 'idTipoAlmacen');
	}

	public function bovedas()
	{
		return $this->hasMany(Boveda::class, 'idAlmacen');
	}
}
