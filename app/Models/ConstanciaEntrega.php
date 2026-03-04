<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class ConstanciaEntrega
 * 
 * @property int $idconstancia
 * @property string|null $numeroticket
 * @property string|null $tipo
 * @property Carbon|null $fechacompra
 * @property string|null $nombrecliente
 * @property string|null $emailcliente
 * @property string|null $direccioncliente
 * @property string|null $telefonocliente
 * @property string|null $observaciones
 * @property int|null $idticket
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property Collection|ConstanciaFoto[] $constancia_fotos
 *
 * @package App\Models
 */
class ConstanciaEntrega extends Model
{
	use SoftDeletes;
	protected $table = 'constancia_entregas';
	protected $primaryKey = 'idconstancia';

	protected $casts = [
		'fechacompra' => 'datetime',
		'idticket' => 'int'
	];

	protected $fillable = [
		'numeroticket',
		'tipo',
		'fechacompra',
		'nombrecliente',
		'emailcliente',
		'direccioncliente',
		'telefonocliente',
		'observaciones',
		'idticket'
	];

	public function constancia_fotos()
	{
		return $this->hasMany(ConstanciaFoto::class, 'idconstancia');
	}
}
