<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Visita
 * 
 * @property int $idVisitas
 * @property string|null $nombre
 * @property Carbon|null $fecha_programada
 * @property Carbon|null $fecha_asignada
 * @property Carbon|null $fechas_desplazamiento
 * @property Carbon|null $fecha_llegada
 * @property Carbon|null $fecha_inicio
 * @property Carbon|null $fecha_final
 * @property bool|null $estado
 * @property int|null $idTickets
 * @property int|null $idUsuario
 * @property Carbon|null $fecha_inicio_hora
 * @property Carbon|null $fecha_final_hora
 * @property bool|null $necesita_apoyo
 * @property int|null $tipoServicio
 * @property int|null $visto
 * @property int|null $recojo
 * @property int|null $estadovisita
 * @property string|null $nombreclientetienda
 * @property string|null $celularclientetienda
 * @property string|null $dniclientetienda
 * 
 * @property Collection|AccionesVisita[] $acciones_visitas
 * @property Collection|AnexosVisita[] $anexos_visitas
 * @property Collection|AprobacionHorario[] $aprobacion_horarios
 * @property Collection|CambioHorario[] $cambio_horarios
 * @property Collection|Equipo[] $equipos
 * @property Collection|Imagenapoyosmart[] $imagenapoyosmarts
 * @property Collection|MovimientosInventario[] $movimientos_inventarios
 * @property Collection|Seleccionarvisitum[] $seleccionarvisita
 * @property Collection|Solicitudentrega[] $solicitudentregas
 * @property Collection|Suministro[] $suministros
 * @property Collection|Ticketflujo[] $ticketflujos
 * @property Collection|Vehiculo[] $vehiculos
 *
 * @package App\Models
 */
class Visita extends Model
{
	protected $table = 'visitas';
	protected $primaryKey = 'idVisitas';
	public $timestamps = false;

	protected $casts = [
		'fecha_programada' => 'datetime',
		'fecha_asignada' => 'datetime',
		'fechas_desplazamiento' => 'datetime',
		'fecha_llegada' => 'datetime',
		'fecha_inicio' => 'datetime',
		'fecha_final' => 'datetime',
		'estado' => 'bool',
		'idTickets' => 'int',
		'idUsuario' => 'int',
		'fecha_inicio_hora' => 'datetime',
		'fecha_final_hora' => 'datetime',
		'necesita_apoyo' => 'bool',
		'tipoServicio' => 'int',
		'visto' => 'int',
		'recojo' => 'int',
		'estadovisita' => 'int'
	];

	protected $fillable = [
		'nombre',
		'fecha_programada',
		'fecha_asignada',
		'fechas_desplazamiento',
		'fecha_llegada',
		'fecha_inicio',
		'fecha_final',
		'estado',
		'idTickets',
		'idUsuario',
		'fecha_inicio_hora',
		'fecha_final_hora',
		'necesita_apoyo',
		'tipoServicio',
		'visto',
		'recojo',
		'estadovisita',
		'nombreclientetienda',
		'celularclientetienda',
		'dniclientetienda'
	];

	public function acciones_visitas()
	{
		return $this->hasMany(AccionesVisita::class, 'idVisitas');
	}

	public function anexos_visitas()
	{
		return $this->hasMany(AnexosVisita::class, 'idVisitas');
	}

	public function aprobacion_horarios()
	{
		return $this->hasMany(AprobacionHorario::class, 'idVisita');
	}

	public function cambio_horarios()
	{
		return $this->hasMany(CambioHorario::class, 'idVisita');
	}

	public function equipos()
	{
		return $this->hasMany(Equipo::class, 'idVisitas');
	}

	public function imagenapoyosmarts()
	{
		return $this->hasMany(Imagenapoyosmart::class, 'idVisitas');
	}

	public function movimientos_inventarios()
	{
		return $this->hasMany(MovimientosInventario::class, 'idVisitas');
	}

	public function seleccionarvisita()
	{
		return $this->hasMany(Seleccionarvisitum::class, 'idVisitas');
	}

	public function solicitudentregas()
	{
		return $this->hasMany(Solicitudentrega::class, 'idVisitas');
	}

	public function suministros()
	{
		return $this->hasMany(Suministro::class, 'idVisitas');
	}

	public function ticketflujos()
	{
		return $this->hasMany(Ticketflujo::class, 'idVisitas');
	}

	public function vehiculos()
	{
		return $this->hasMany(Vehiculo::class, 'idVisitas');
	}
}
