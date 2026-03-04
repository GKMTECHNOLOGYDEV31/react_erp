<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Cotizacione
 * 
 * @property int $idCotizaciones
 * @property string $numero_cotizacion
 * @property Carbon $fecha_emision
 * @property Carbon $valida_hasta
 * @property float|null $subtotal
 * @property float|null $igv
 * @property float|null $total
 * @property bool|null $incluir_igv
 * @property string|null $terminos_condiciones
 * @property int|null $dias_validez
 * @property string|null $terminos_pago
 * @property string|null $estado_cotizacion
 * @property string|null $ot
 * @property string|null $serie
 * @property int|null $visita_id
 * @property int $idCliente
 * @property int $idMonedas
 * @property int|null $idTickets
 * @property int|null $idTienda
 * @property Carbon $created_at
 * @property Carbon $updated_at
 *
 * @package App\Models
 */
class Cotizacione extends Model
{
	protected $table = 'cotizaciones';
	protected $primaryKey = 'idCotizaciones';

	protected $casts = [
		'fecha_emision' => 'datetime',
		'valida_hasta' => 'datetime',
		'subtotal' => 'float',
		'igv' => 'float',
		'total' => 'float',
		'incluir_igv' => 'bool',
		'dias_validez' => 'int',
		'visita_id' => 'int',
		'idCliente' => 'int',
		'idMonedas' => 'int',
		'idTickets' => 'int',
		'idTienda' => 'int'
	];

	protected $fillable = [
		'numero_cotizacion',
		'fecha_emision',
		'valida_hasta',
		'subtotal',
		'igv',
		'total',
		'incluir_igv',
		'terminos_condiciones',
		'dias_validez',
		'terminos_pago',
		'estado_cotizacion',
		'ot',
		'serie',
		'visita_id',
		'idCliente',
		'idMonedas',
		'idTickets',
		'idTienda'
	];
}
