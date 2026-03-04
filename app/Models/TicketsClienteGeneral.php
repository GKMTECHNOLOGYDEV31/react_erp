<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class TicketsClienteGeneral
 * 
 * @property int $idTicket
 * @property string|null $numero_ticket
 * @property string $nombreCompleto
 * @property string|null $dni_ruc_ce
 * @property string|null $telefonoFijo
 * @property string|null $telefonoCelular
 * @property string|null $correoElectronico
 * @property string|null $direccionCompleta
 * @property string|null $referenciaDomicilio
 * @property string|null $distrito
 * @property string|null $provincia
 * @property string|null $region
 * @property string|null $tipoProducto
 * @property string|null $modeloProducto
 * @property string|null $serieProducto
 * @property Carbon|null $fechaCompra
 * @property string|null $tiendaSedeCompra
 * @property int|null $idModelo
 * @property int|null $idMarca
 * @property int|null $idArticulo
 * @property int|null $idSubcategoria
 * @property string|null $codigo_repuesto
 * @property string|null $tipo_repuesto
 * @property string|null $detallesFalla
 * @property string|null $adjunto
 * @property string|null $fotoVideoFalla
 * @property string|null $fotoBoletaFactura
 * @property string|null $fotoNumeroSerie
 * @property string|null $ubicacionGoogleMaps
 * @property Carbon|null $fechaCreacion
 * @property bool|null $estado
 * @property int|null $idUsuarioCreador
 * @property int|null $idClienteGeneral
 * 
 * @property Articulo|null $articulo
 * @property Clientegeneral|null $clientegeneral
 * @property Marca|null $marca
 * @property Modelo|null $modelo
 * @property Subcategoria|null $subcategoria
 * @property Usuario|null $usuario
 *
 * @package App\Models
 */
class TicketsClienteGeneral extends Model
{
	protected $table = 'tickets_cliente_general';
	protected $primaryKey = 'idTicket';
	public $timestamps = false;

	protected $casts = [
		'fechaCompra' => 'datetime',
		'idModelo' => 'int',
		'idMarca' => 'int',
		'idArticulo' => 'int',
		'idSubcategoria' => 'int',
		'fechaCreacion' => 'datetime',
		'estado' => 'bool',
		'idUsuarioCreador' => 'int',
		'idClienteGeneral' => 'int'
	];

	protected $fillable = [
		'numero_ticket',
		'nombreCompleto',
		'dni_ruc_ce',
		'telefonoFijo',
		'telefonoCelular',
		'correoElectronico',
		'direccionCompleta',
		'referenciaDomicilio',
		'distrito',
		'provincia',
		'region',
		'tipoProducto',
		'modeloProducto',
		'serieProducto',
		'fechaCompra',
		'tiendaSedeCompra',
		'idModelo',
		'idMarca',
		'idArticulo',
		'idSubcategoria',
		'codigo_repuesto',
		'tipo_repuesto',
		'detallesFalla',
		'adjunto',
		'fotoVideoFalla',
		'fotoBoletaFactura',
		'fotoNumeroSerie',
		'ubicacionGoogleMaps',
		'fechaCreacion',
		'estado',
		'idUsuarioCreador',
		'idClienteGeneral'
	];

	public function articulo()
	{
		return $this->belongsTo(Articulo::class, 'idArticulo');
	}

	public function clientegeneral()
	{
		return $this->belongsTo(Clientegeneral::class, 'idClienteGeneral');
	}

	public function marca()
	{
		return $this->belongsTo(Marca::class, 'idMarca');
	}

	public function modelo()
	{
		return $this->belongsTo(Modelo::class, 'idModelo');
	}

	public function subcategoria()
	{
		return $this->belongsTo(Subcategoria::class, 'idSubcategoria');
	}

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuarioCreador');
	}
}
