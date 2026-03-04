<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Ubicacione
 * 
 * @property int $idUbicaciones
 * @property string|null $cantidad
 * @property int $idUbicacion
 * 
 * @property Collection|CustodiaUbicacion[] $custodia_ubicacions
 *
 * @package App\Models
 */
class Ubicacione extends Model
{
	protected $table = 'ubicaciones';
	protected $primaryKey = 'idUbicaciones';
	public $timestamps = false;

	protected $casts = [
		'idUbicacion' => 'int'
	];

	protected $fillable = [
		'cantidad',
		'idUbicacion'
	];

	public function custodia_ubicacions()
	{
		return $this->hasMany(CustodiaUbicacion::class, 'idUbicacion');
	}
}
