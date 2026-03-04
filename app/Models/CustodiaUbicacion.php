<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class CustodiaUbicacion
 * 
 * @property int $id
 * @property int $idUbicacion
 * @property int $idCustodia
 * @property string|null $observacion
 * @property int $cantidad
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Custodia $custodia
 * @property Ubicacione $ubicacione
 *
 * @package App\Models
 */
class CustodiaUbicacion extends Model
{
	protected $table = 'custodia_ubicacion';

	protected $casts = [
		'idUbicacion' => 'int',
		'idCustodia' => 'int',
		'cantidad' => 'int'
	];

	protected $fillable = [
		'idUbicacion',
		'idCustodia',
		'observacion',
		'cantidad'
	];

	public function custodia()
	{
		return $this->belongsTo(Custodia::class, 'idCustodia');
	}

	public function ubicacione()
	{
		return $this->belongsTo(Ubicacione::class, 'idUbicacion');
	}
}
