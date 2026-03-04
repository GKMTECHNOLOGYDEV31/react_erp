<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ClientegeneralArea
 * 
 * @property int $idClientegeneralArea
 * @property int $idClienteGeneral
 * @property int $idTipoArea
 * 
 * @property Clientegeneral $clientegeneral
 * @property Tipoarea $tipoarea
 *
 * @package App\Models
 */
class ClientegeneralArea extends Model
{
	protected $table = 'clientegeneral_area';
	protected $primaryKey = 'idClientegeneralArea';
	public $timestamps = false;

	protected $casts = [
		'idClienteGeneral' => 'int',
		'idTipoArea' => 'int'
	];

	protected $fillable = [
		'idClienteGeneral',
		'idTipoArea'
	];

	public function clientegeneral()
	{
		return $this->belongsTo(Clientegeneral::class, 'idClienteGeneral');
	}

	public function tipoarea()
	{
		return $this->belongsTo(Tipoarea::class, 'idTipoArea');
	}
}
