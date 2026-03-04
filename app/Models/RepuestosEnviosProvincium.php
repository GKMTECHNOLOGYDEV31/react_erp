<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class RepuestosEnviosProvincium
 * 
 * @property int $id
 * @property int $solicitud_id
 * @property int $articulo_id
 * @property string $transportista
 * @property string $placa_vehiculo
 * @property Carbon $fecha_entrega_transporte
 * @property string|null $foto_comprobante
 * @property string|null $observaciones
 * @property int $usuario_entrego_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $ubicacion_origen
 * @property string|null $rack_origen
 * 
 * @property Articulo $articulo
 * @property Solicitudesordene $solicitudesordene
 * @property Usuario $usuario
 *
 * @package App\Models
 */
class RepuestosEnviosProvincium extends Model
{
	protected $table = 'repuestos_envios_provincia';

	protected $casts = [
		'solicitud_id' => 'int',
		'articulo_id' => 'int',
		'fecha_entrega_transporte' => 'datetime',
		'usuario_entrego_id' => 'int'
	];

	protected $fillable = [
		'solicitud_id',
		'articulo_id',
		'transportista',
		'placa_vehiculo',
		'fecha_entrega_transporte',
		'foto_comprobante',
		'observaciones',
		'usuario_entrego_id',
		'ubicacion_origen',
		'rack_origen'
	];

	public function articulo()
	{
		return $this->belongsTo(Articulo::class);
	}

	public function solicitudesordene()
	{
		return $this->belongsTo(Solicitudesordene::class, 'solicitud_id');
	}

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'usuario_entrego_id');
	}
}
