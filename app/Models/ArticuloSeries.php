<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ArticuloSeries
 * 
 * @property int $idArticuloSerie
 * @property string $origen
 * @property int $origen_id
 * @property int $articulo_id
 * @property int|null $ubicacion_id
 * @property string $numero_serie
 * @property string $estado
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Articulo $articulo
 * @property RackUbicacione|null $rack_ubicacione
 *
 * @package App\Models
 */
class ArticuloSeries extends Model
{
	protected $table = 'articulo_series';
	protected $primaryKey = 'idArticuloSerie';

	protected $casts = [
		'origen_id' => 'int',
		'articulo_id' => 'int',
		'ubicacion_id' => 'int'
	];

	protected $fillable = [
		'origen',
		'origen_id',
		'articulo_id',
		'ubicacion_id',
		'numero_serie',
		'estado'
	];

	public function articulo()
	{
		return $this->belongsTo(Articulo::class);
	}

	public function rack_ubicacione()
	{
		return $this->belongsTo(RackUbicacione::class, 'ubicacion_id');
	}
}
