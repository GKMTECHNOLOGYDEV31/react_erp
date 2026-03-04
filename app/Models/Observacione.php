<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Observacione
 * 
 * @property int $idObservaciones
 * @property int|null $idTipoAsunto
 * @property string|null $mensaje
 * @property Carbon|null $fechaHora
 * @property int|null $idUsuario
 * @property float|null $lat
 * @property float|null $lng
 * @property string|null $ubicacion
 * @property int|null $estado
 * @property string|null $respuesta
 * @property int|null $encargado
 * 
 * @property Tipoasunto|null $tipoasunto
 * @property Usuario|null $usuario
 * @property Collection|AnexoObservacione[] $anexo_observaciones
 * @property Collection|NotificacionesObservacione[] $notificaciones_observaciones
 *
 * @package App\Models
 */
class Observacione extends Model
{
	protected $table = 'observaciones';
	protected $primaryKey = 'idObservaciones';
	public $timestamps = false;

	protected $casts = [
		'idTipoAsunto' => 'int',
		'fechaHora' => 'datetime',
		'idUsuario' => 'int',
		'lat' => 'float',
		'lng' => 'float',
		'estado' => 'int',
		'encargado' => 'int'
	];

	protected $fillable = [
		'idTipoAsunto',
		'mensaje',
		'fechaHora',
		'idUsuario',
		'lat',
		'lng',
		'ubicacion',
		'estado',
		'respuesta',
		'encargado'
	];

	public function tipoasunto()
	{
		return $this->belongsTo(Tipoasunto::class, 'idTipoAsunto');
	}

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}

	public function anexo_observaciones()
	{
		return $this->hasMany(AnexoObservacione::class, 'idObservaciones');
	}

	public function notificaciones_observaciones()
	{
		return $this->hasMany(NotificacionesObservacione::class, 'idObservaciones');
	}
}
