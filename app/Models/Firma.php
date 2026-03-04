<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Firma
 * 
 * @property int $idFirmas
 * @property string|null $firma_tecnico
 * @property string|null $firma_cliente
 * @property int|null $idTickets
 * @property int|null $idVisitas
 * @property int|null $idCliente
 * @property int|null $idSolicitudesOrdenes
 * @property int|null $idSolicitud
 * @property string|null $nombreencargado
 * @property string|null $tipodocumento
 * @property string|null $documento
 * @property string|null $cargo
 *
 * @package App\Models
 */
class Firma extends Model
{
	protected $table = 'firmas';
	protected $primaryKey = 'idFirmas';
	public $timestamps = false;

	protected $casts = [
		'idTickets' => 'int',
		'idVisitas' => 'int',
		'idCliente' => 'int',
		'idSolicitudesOrdenes' => 'int',
		'idSolicitud' => 'int'
	];

	protected $fillable = [
		'firma_tecnico',
		'firma_cliente',
		'idTickets',
		'idVisitas',
		'idCliente',
		'idSolicitudesOrdenes',
		'idSolicitud',
		'nombreencargado',
		'tipodocumento',
		'documento',
		'cargo'
	];
}
