<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Modelo
 * 
 * @property int $idModelo
 * @property string|null $nombre
 * @property int $idMarca
 * @property int $idCategoria
 * @property bool|null $estado
 * @property int|null $producto
 * @property int|null $repuesto
 * @property int|null $heramientas
 * @property int|null $suministros
 * @property string|null $pulgadas
 * 
 * @property Collection|Articulo[] $articulos
 * @property Collection|TicketsClienteGeneral[] $tickets_cliente_generals
 *
 * @package App\Models
 */
class Modelo extends Model
{
	protected $table = 'modelo';
	protected $primaryKey = 'idModelo';
	public $timestamps = false;

	protected $casts = [
		'idMarca' => 'int',
		'idCategoria' => 'int',
		'estado' => 'bool',
		'producto' => 'int',
		'repuesto' => 'int',
		'heramientas' => 'int',
		'suministros' => 'int'
	];

	protected $fillable = [
		'nombre',
		'idMarca',
		'idCategoria',
		'estado',
		'producto',
		'repuesto',
		'heramientas',
		'suministros',
		'pulgadas'
	];

	public function articulos()
	{
		return $this->hasMany(Articulo::class, 'idModelo');
	}

	public function tickets_cliente_generals()
	{
		return $this->hasMany(TicketsClienteGeneral::class, 'idModelo');
	}
}
