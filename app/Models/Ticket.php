<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Ticket
 * 
 * @property int $idTickets
 * @property int|null $idClienteGeneral
 * @property int|null $idCliente
 * @property int|null $idContactoFinal
 * @property string|null $numero_ticket
 * @property int|null $tipoServicio
 * @property Carbon|null $fecha_creacion
 * @property int|null $idTipotickets
 * @property int|null $idEstadoots
 * @property int|null $idTecnico
 * @property int|null $idUsuario
 * @property int|null $idTienda
 * @property string|null $fallaReportada
 * @property string|null $esRecojo
 * @property string|null $direccion
 * @property int|null $idMarca
 * @property int|null $idModelo
 * @property string|null $serie
 * @property Carbon|null $fechaCompra
 * @property string|null $lat
 * @property string|null $lng
 * @property int|null $idTicketFlujo
 * @property string|null $linkubicacion
 * @property int|null $envio
 * @property int|null $ejecutor
 * @property int|null $idEncargadoEnvio
 * @property string|null $erma
 * @property string|null $nrmcotizacion
 * @property int|null $evaluaciontienda
 * @property bool $es_custodia
 * 
 * @property Usuario|null $usuario
 * @property Collection|AnexoRetiro[] $anexo_retiros
 * @property Collection|AprobacionHorario[] $aprobacion_horarios
 * @property Collection|CambioHorario[] $cambio_horarios
 * @property Collection|Custodia[] $custodias
 * @property Collection|DatosEnvio[] $datos_envios
 * @property Collection|ManejoEnvio[] $manejo_envios
 * @property Collection|Seleccionarvisitum[] $seleccionarvisita
 * @property Collection|Solicitudentrega[] $solicitudentregas
 * @property Collection|TicketReceptor[] $ticket_receptors
 *
 * @package App\Models
 */
class Ticket extends Model
{
	protected $table = 'tickets';
	protected $primaryKey = 'idTickets';
	public $timestamps = false;

	protected $casts = [
		'idClienteGeneral' => 'int',
		'idCliente' => 'int',
		'idContactoFinal' => 'int',
		'tipoServicio' => 'int',
		'fecha_creacion' => 'datetime',
		'idTipotickets' => 'int',
		'idEstadoots' => 'int',
		'idTecnico' => 'int',
		'idUsuario' => 'int',
		'idTienda' => 'int',
		'idMarca' => 'int',
		'idModelo' => 'int',
		'fechaCompra' => 'datetime',
		'idTicketFlujo' => 'int',
		'envio' => 'int',
		'ejecutor' => 'int',
		'idEncargadoEnvio' => 'int',
		'evaluaciontienda' => 'int',
		'es_custodia' => 'bool'
	];

	protected $fillable = [
		'idClienteGeneral',
		'idCliente',
		'idContactoFinal',
		'numero_ticket',
		'tipoServicio',
		'fecha_creacion',
		'idTipotickets',
		'idEstadoots',
		'idTecnico',
		'idUsuario',
		'idTienda',
		'fallaReportada',
		'esRecojo',
		'direccion',
		'idMarca',
		'idModelo',
		'serie',
		'fechaCompra',
		'lat',
		'lng',
		'idTicketFlujo',
		'linkubicacion',
		'envio',
		'ejecutor',
		'idEncargadoEnvio',
		'erma',
		'nrmcotizacion',
		'evaluaciontienda',
		'es_custodia'
	];

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'ejecutor');
	}

	public function anexo_retiros()
	{
		return $this->hasMany(AnexoRetiro::class, 'idTickets');
	}

	public function aprobacion_horarios()
	{
		return $this->hasMany(AprobacionHorario::class, 'idTicket');
	}

	public function cambio_horarios()
	{
		return $this->hasMany(CambioHorario::class, 'idTicket');
	}

	public function custodias()
	{
		return $this->hasMany(Custodia::class, 'id_ticket');
	}

	public function datos_envios()
	{
		return $this->hasMany(DatosEnvio::class, 'idTickets');
	}

	public function manejo_envios()
	{
		return $this->hasMany(ManejoEnvio::class, 'idTickets');
	}

	public function seleccionarvisita()
	{
		return $this->hasMany(Seleccionarvisitum::class, 'idTickets');
	}

	public function solicitudentregas()
	{
		return $this->hasMany(Solicitudentrega::class, 'idTickets');
	}

	public function ticket_receptors()
	{
		return $this->hasMany(TicketReceptor::class, 'idTickets');
	}
}
