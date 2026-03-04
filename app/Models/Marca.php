<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Marca
 * 
 * @property int $idMarca
 * @property string|null $nombre
 * @property string|null $foto
 * @property bool|null $estado
 * 
 * @property Collection|Clientegeneral[] $clientegenerals
 * @property Collection|TicketsClienteGeneral[] $tickets_cliente_generals
 *
 * @package App\Models
 */
class Marca extends Model
{
	protected $table = 'marca';
	protected $primaryKey = 'idMarca';
	public $timestamps = false;

	protected $casts = [
		'estado' => 'bool'
	];

	protected $fillable = [
		'nombre',
		'foto',
		'estado'
	];

	public function clientegenerals()
	{
		return $this->belongsToMany(Clientegeneral::class, 'marca_clientegeneral', 'idMarca', 'idClienteGeneral')
					->withPivot('idMarcaClienteGeneral');
	}

	public function tickets_cliente_generals()
	{
		return $this->hasMany(TicketsClienteGeneral::class, 'idMarca');
	}
}
