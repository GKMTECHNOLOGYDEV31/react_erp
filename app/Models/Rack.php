<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Rack
 * 
 * @property int $idRack
 * @property string $nombre
 * @property string $sede
 * @property int|null $filas
 * @property int|null $columnas
 * @property string|null $estado
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int|null $idAsignacion
 * @property int|null $idModeloRack
 * @property string|null $tipo_rack
 * 
 * @property Collection|RackUbicacione[] $rack_ubicaciones
 *
 * @package App\Models
 */
class Rack extends Model
{
	protected $table = 'racks';
	protected $primaryKey = 'idRack';

	protected $casts = [
		'filas' => 'int',
		'columnas' => 'int',
		'idAsignacion' => 'int',
		'idModeloRack' => 'int'
	];

	protected $fillable = [
		'nombre',
		'sede',
		'filas',
		'columnas',
		'estado',
		'idAsignacion',
		'idModeloRack',
		'tipo_rack'
	];

	public function rack_ubicaciones()
	{
		return $this->hasMany(RackUbicacione::class);
	}
}
