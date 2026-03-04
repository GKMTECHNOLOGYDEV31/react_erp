<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ConstanciaFoto
 * 
 * @property int $idfoto
 * @property int $idconstancia
 * @property string $imagen
 * @property string|null $descripcion
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property ConstanciaEntrega $constancia_entrega
 *
 * @package App\Models
 */
class ConstanciaFoto extends Model
{
	protected $table = 'constancia_fotos';
	protected $primaryKey = 'idfoto';

	protected $casts = [
		'idconstancia' => 'int'
	];

	protected $fillable = [
		'idconstancia',
		'imagen',
		'descripcion'
	];

	public function constancia_entrega()
	{
		return $this->belongsTo(ConstanciaEntrega::class, 'idconstancia');
	}
}
