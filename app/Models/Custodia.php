<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Custodia
 * 
 * @property int $id
 * @property string|null $codigocustodias
 * @property int|null $id_ticket
 * @property int|null $idcliente
 * @property string|null $numero_ticket
 * @property int|null $idMarca
 * @property int|null $idModelo
 * @property string|null $serie
 * @property string|null $estado
 * @property Carbon $fecha_ingreso_custodia
 * @property Carbon|null $fecha_devolucion
 * @property string|null $observaciones
 * @property string|null $observacion_almacen
 * @property string|null $ubicacion_actual
 * @property string|null $responsable_entrega
 * @property int|null $id_responsable_recepcion
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Ticket|null $ticket
 * @property Collection|CustodiaFoto[] $custodia_fotos
 * @property Collection|CustodiaUbicacion[] $custodia_ubicacions
 *
 * @package App\Models
 */
class Custodia extends Model
{
	protected $table = 'custodias';

	protected $casts = [
		'id_ticket' => 'int',
		'idcliente' => 'int',
		'idMarca' => 'int',
		'idModelo' => 'int',
		'fecha_ingreso_custodia' => 'datetime',
		'fecha_devolucion' => 'datetime',
		'id_responsable_recepcion' => 'int'
	];

	protected $fillable = [
		'codigocustodias',
		'id_ticket',
		'idcliente',
		'numero_ticket',
		'idMarca',
		'idModelo',
		'serie',
		'estado',
		'fecha_ingreso_custodia',
		'fecha_devolucion',
		'observaciones',
		'observacion_almacen',
		'ubicacion_actual',
		'responsable_entrega',
		'id_responsable_recepcion'
	];

	public function ticket()
	{
		return $this->belongsTo(Ticket::class, 'id_ticket');
	}

	public function custodia_fotos()
	{
		return $this->hasMany(CustodiaFoto::class, 'id_custodia');
	}

	public function custodia_ubicacions()
	{
		return $this->hasMany(CustodiaUbicacion::class, 'idCustodia');
	}
}
