<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class MarcaClientegeneral
 * 
 * @property int $idMarcaClienteGeneral
 * @property int $idMarca
 * @property int $idClienteGeneral
 * 
 * @property Marca $marca
 * @property Clientegeneral $clientegeneral
 *
 * @package App\Models
 */
class MarcaClientegeneral extends Model
{
	protected $table = 'marca_clientegeneral';
	protected $primaryKey = 'idMarcaClienteGeneral';
	public $timestamps = false;

	protected $casts = [
		'idMarca' => 'int',
		'idClienteGeneral' => 'int'
	];

	protected $fillable = [
		'idMarca',
		'idClienteGeneral'
	];

	public function marca()
	{
		return $this->belongsTo(Marca::class, 'idMarca');
	}

	public function clientegeneral()
	{
		return $this->belongsTo(Clientegeneral::class, 'idClienteGeneral');
	}
}
