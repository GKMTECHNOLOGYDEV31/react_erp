<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class CentroCosto
 * 
 * @property int $idCentroCosto
 * @property string $codigo
 * @property string $nombre
 * @property string|null $descripcion
 * @property string|null $responsable
 * @property float|null $presupuesto_anual
 * @property bool|null $estado
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Collection|SolicitudAlmacen[] $solicitud_almacens
 *
 * @package App\Models
 */
class CentroCosto extends Model
{
	protected $table = 'centro_costo';
	protected $primaryKey = 'idCentroCosto';

	protected $casts = [
		'presupuesto_anual' => 'float',
		'estado' => 'bool'
	];

	protected $fillable = [
		'codigo',
		'nombre',
		'descripcion',
		'responsable',
		'presupuesto_anual',
		'estado'
	];

	public function solicitud_almacens()
	{
		return $this->hasMany(SolicitudAlmacen::class, 'idCentroCosto');
	}
}
