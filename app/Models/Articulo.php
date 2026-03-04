<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Articulo
 * 
 * @property int $idArticulos
 * @property string|null $codigo_barras
 * @property string|null $nombre
 * @property int|null $stock_total
 * @property int|null $stock_minimo
 * @property bool $maneja_serie
 * @property int|null $moneda_compra
 * @property int|null $moneda_venta
 * @property float|null $precio_compra
 * @property float|null $precio_venta
 * @property string|null $foto
 * @property string|null $sku
 * @property float|null $peso
 * @property string|null $mostrarWeb
 * @property bool|null $estado
 * @property int $idUnidad
 * @property int $idTipoArticulo
 * @property int|null $idModelo
 * @property int|null $idProveedor
 * @property int|null $garantia_fabrica
 * @property string|null $unidad_tiempo_garantia
 * @property Carbon|null $fecha_ingreso
 * @property int|null $idTipoArea
 * @property string|null $codigo_repuesto
 * @property string|null $foto_codigobarras
 * @property string|null $fotosku
 * @property string|null $br-codigo-repuesto
 * @property string|null $pulgadas
 * @property string|null $ficha_tecnica
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int|null $idsubcategoria
 * 
 * @property Unidad $unidad
 * @property Tipoarticulo $tipoarticulo
 * @property Modelo|null $modelo
 * @property Tipoarea|null $tipoarea
 * @property Collection|Modelo[] $modelos
 * @property Collection|RackUbicacione[] $rack_ubicaciones
 * @property Collection|ArticuloSeries[] $articulo_series
 * @property Collection|ArticuloUbicacione[] $articulo_ubicaciones
 * @property Collection|Articulosprestado[] $articulosprestados
 * @property Collection|Boveda[] $bovedas
 * @property Collection|Caja[] $cajas
 * @property Collection|Compra[] $compras
 * @property Collection|DetalleAsignacione[] $detalle_asignaciones
 * @property Collection|EntradasProveedoresDetalle[] $entradas_proveedores_detalles
 * @property Collection|InventarioIngresosCliente[] $inventario_ingresos_clientes
 * @property Collection|InventarioTecnico[] $inventario_tecnicos
 * @property Collection|MovimientosAlmacen[] $movimientos_almacens
 * @property Collection|RepuestosEntrega[] $repuestos_entregas
 * @property Collection|RepuestosEnviosProvincium[] $repuestos_envios_provincia
 * @property Collection|SolicitudAlmacenDetalle[] $solicitud_almacen_detalles
 * @property Collection|TicketsClienteGeneral[] $tickets_cliente_generals
 *
 * @package App\Models
 */
class Articulo extends Model
{
	protected $table = 'articulos';
	protected $primaryKey = 'idArticulos';

	protected $casts = [
		'stock_total' => 'int',
		'stock_minimo' => 'int',
		'maneja_serie' => 'bool',
		'moneda_compra' => 'int',
		'moneda_venta' => 'int',
		'precio_compra' => 'float',
		'precio_venta' => 'float',
		'peso' => 'float',
		'estado' => 'bool',
		'idUnidad' => 'int',
		'idTipoArticulo' => 'int',
		'idModelo' => 'int',
		'idProveedor' => 'int',
		'garantia_fabrica' => 'int',
		'fecha_ingreso' => 'datetime',
		'idTipoArea' => 'int',
		'idsubcategoria' => 'int'
	];

	protected $fillable = [
		'codigo_barras',
		'nombre',
		'stock_total',
		'stock_minimo',
		'maneja_serie',
		'moneda_compra',
		'moneda_venta',
		'precio_compra',
		'precio_venta',
		'foto',
		'sku',
		'peso',
		'mostrarWeb',
		'estado',
		'idUnidad',
		'idTipoArticulo',
		'idModelo',
		'idProveedor',
		'garantia_fabrica',
		'unidad_tiempo_garantia',
		'fecha_ingreso',
		'idTipoArea',
		'codigo_repuesto',
		'foto_codigobarras',
		'fotosku',
		'br-codigo-repuesto',
		'pulgadas',
		'ficha_tecnica',
		'idsubcategoria'
	];

	public function unidad()
	{
		return $this->belongsTo(Unidad::class, 'idUnidad');
	}

	public function tipoarticulo()
	{
		return $this->belongsTo(Tipoarticulo::class, 'idTipoArticulo');
	}

	public function modelo()
	{
		return $this->belongsTo(Modelo::class, 'idModelo');
	}

	public function tipoarea()
	{
		return $this->belongsTo(Tipoarea::class, 'idTipoArea');
	}

	public function modelos()
	{
		return $this->belongsToMany(Modelo::class)
					->withPivot('id')
					->withTimestamps();
	}

	public function rack_ubicaciones()
	{
		return $this->belongsToMany(RackUbicacione::class, 'articulo_rack_ubicaciones', 'articulo_id', 'rack_ubicacion_id')
					->withPivot('idArticuloRackUbicacion', 'cantidad', 'fecha_ingreso', 'fecha_ultimo_movimiento', 'estado')
					->withTimestamps();
	}

	public function articulo_series()
	{
		return $this->hasMany(ArticuloSeries::class);
	}

	public function articulo_ubicaciones()
	{
		return $this->hasMany(ArticuloUbicacione::class);
	}

	public function articulosprestados()
	{
		return $this->hasMany(Articulosprestado::class, 'idArticulos');
	}

	public function bovedas()
	{
		return $this->hasMany(Boveda::class, 'idArticulos');
	}

	public function cajas()
	{
		return $this->hasMany(Caja::class, 'idArticulo');
	}

	public function compras()
	{
		return $this->belongsToMany(Compra::class, 'compra_serie_articulos')
					->withPivot('id', 'detalle_compra_id', 'serie', 'estado', 'fecha_ingreso', 'fecha_actualizacion')
					->withTimestamps();
	}

	public function detalle_asignaciones()
	{
		return $this->hasMany(DetalleAsignacione::class);
	}

	public function entradas_proveedores_detalles()
	{
		return $this->hasMany(EntradasProveedoresDetalle::class);
	}

	public function inventario_ingresos_clientes()
	{
		return $this->hasMany(InventarioIngresosCliente::class);
	}

	public function inventario_tecnicos()
	{
		return $this->hasMany(InventarioTecnico::class, 'idArticulos');
	}

	public function movimientos_almacens()
	{
		return $this->hasMany(MovimientosAlmacen::class, 'idArticulo');
	}

	public function repuestos_entregas()
	{
		return $this->hasMany(RepuestosEntrega::class);
	}

	public function repuestos_envios_provincia()
	{
		return $this->hasMany(RepuestosEnviosProvincium::class);
	}

	public function solicitud_almacen_detalles()
	{
		return $this->hasMany(SolicitudAlmacenDetalle::class, 'idArticulo');
	}

	public function tickets_cliente_generals()
	{
		return $this->hasMany(TicketsClienteGeneral::class, 'idArticulo');
	}
}
