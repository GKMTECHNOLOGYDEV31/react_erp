<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ArticuloUbicacione
 * 
 * @property int $idArticuloUbicacion
 * @property string|null $origen
 * @property int $articulo_id
 * @property int|null $origen_id
 * @property int $ubicacion_id
 * @property int $cantidad
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int|null $id_caja
 * 
 * @property Articulo $articulo
 *
 * @package App\Models
 */
class ArticuloUbicacione extends Model
{
	protected $table = 'articulo_ubicaciones';
	protected $primaryKey = 'idArticuloUbicacion';

	protected $casts = [
		'articulo_id' => 'int',
		'origen_id' => 'int',
		'ubicacion_id' => 'int',
		'cantidad' => 'int',
		'id_caja' => 'int'
	];

	protected $fillable = [
		'origen',
		'articulo_id',
		'origen_id',
		'ubicacion_id',
		'cantidad',
		'id_caja'
	];

	public function articulo()
	{
		return $this->belongsTo(Articulo::class);
	}
}
