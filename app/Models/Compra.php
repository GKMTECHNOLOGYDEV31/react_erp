<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Compra
 * 
 * @property int $idCompra
 * @property string|null $serie
 * @property int|null $nro
 * @property string|null $descripcion
 * @property string|null $estado
 * @property string|null $codigocompra
 * @property Carbon|null $fechaEmision
 * @property Carbon|null $fechaVencimiento
 * @property string|null $imagen
 * @property float|null $sujetoporcentaje
 * @property int|null $cantidad
 * @property float|null $gravada
 * @property float|null $igv
 * @property float|null $total
 * @property int|null $idMonedas
 * @property int|null $idDocumento
 * @property int|null $idImpuesto
 * @property int|null $idSujeto
 * @property int|null $idCondicionCompra
 * @property int|null $idTipoPago
 * @property int|null $idUsuario
 * @property int|null $proveedor_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Moneda|null $moneda
 * @property Documento|null $documento
 * @property Impuesto|null $impuesto
 * @property Sujeto|null $sujeto
 * @property Condicioncompra|null $condicioncompra
 * @property Tipopago|null $tipopago
 * @property Collection|Articulo[] $articulos
 * @property Collection|InventarioIngresosCliente[] $inventario_ingresos_clientes
 *
 * @package App\Models
 */
class Compra extends Model
{
	protected $table = 'compra';
	protected $primaryKey = 'idCompra';

	protected $casts = [
		'nro' => 'int',
		'fechaEmision' => 'datetime',
		'fechaVencimiento' => 'datetime',
		'sujetoporcentaje' => 'float',
		'cantidad' => 'int',
		'gravada' => 'float',
		'igv' => 'float',
		'total' => 'float',
		'idMonedas' => 'int',
		'idDocumento' => 'int',
		'idImpuesto' => 'int',
		'idSujeto' => 'int',
		'idCondicionCompra' => 'int',
		'idTipoPago' => 'int',
		'idUsuario' => 'int',
		'proveedor_id' => 'int'
	];

	protected $fillable = [
		'serie',
		'nro',
		'descripcion',
		'estado',
		'codigocompra',
		'fechaEmision',
		'fechaVencimiento',
		'imagen',
		'sujetoporcentaje',
		'cantidad',
		'gravada',
		'igv',
		'total',
		'idMonedas',
		'idDocumento',
		'idImpuesto',
		'idSujeto',
		'idCondicionCompra',
		'idTipoPago',
		'idUsuario',
		'proveedor_id'
	];

	public function moneda()
	{
		return $this->belongsTo(Moneda::class, 'idMonedas');
	}

	public function documento()
	{
		return $this->belongsTo(Documento::class, 'idDocumento');
	}

	public function impuesto()
	{
		return $this->belongsTo(Impuesto::class, 'idImpuesto');
	}

	public function sujeto()
	{
		return $this->belongsTo(Sujeto::class, 'idSujeto');
	}

	public function condicioncompra()
	{
		return $this->belongsTo(Condicioncompra::class, 'idCondicionCompra');
	}

	public function tipopago()
	{
		return $this->belongsTo(Tipopago::class, 'idTipoPago');
	}

	public function articulos()
	{
		return $this->belongsToMany(Articulo::class, 'compra_serie_articulos')
					->withPivot('id', 'detalle_compra_id', 'serie', 'estado', 'fecha_ingreso', 'fecha_actualizacion')
					->withTimestamps();
	}

	public function inventario_ingresos_clientes()
	{
		return $this->hasMany(InventarioIngresosCliente::class);
	}
}
