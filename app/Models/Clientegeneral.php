<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Clientegeneral
 * 
 * @property int $idClienteGeneral
 * @property string|null $descripcion
 * @property bool|null $estado
 * @property string|null $foto
 * 
 * @property Collection|ClienteGeneralContactoFinal[] $cliente_general_contacto_finals
 * @property Collection|ClientegeneralArea[] $clientegeneral_areas
 * @property Collection|InventarioIngresosCliente[] $inventario_ingresos_clientes
 * @property Collection|Marca[] $marcas
 * @property Collection|TicketsClienteGeneral[] $tickets_cliente_generals
 * @property Collection|Usuario[] $usuarios
 *
 * @package App\Models
 */
class Clientegeneral extends Model
{
	protected $table = 'clientegeneral';
	protected $primaryKey = 'idClienteGeneral';
	public $timestamps = false;

	protected $casts = [
		'estado' => 'bool'
	];

	protected $fillable = [
		'descripcion',
		'estado',
		'foto'
	];

	public function cliente_general_contacto_finals()
	{
		return $this->hasMany(ClienteGeneralContactoFinal::class, 'idClienteGeneral');
	}

	public function clientegeneral_areas()
	{
		return $this->hasMany(ClientegeneralArea::class, 'idClienteGeneral');
	}

	public function inventario_ingresos_clientes()
	{
		return $this->hasMany(InventarioIngresosCliente::class, 'cliente_general_id');
	}

	public function marcas()
	{
		return $this->belongsToMany(Marca::class, 'marca_clientegeneral', 'idClienteGeneral', 'idMarca')
					->withPivot('idMarcaClienteGeneral');
	}

	public function tickets_cliente_generals()
	{
		return $this->hasMany(TicketClienteGeneral::class, 'idClienteGeneral');
	}

	public function usuarios()
	{
		return $this->hasMany(Usuario::class, 'idClienteGeneral');
	}
}
