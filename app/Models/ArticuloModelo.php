<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ArticuloModelo
 * 
 * @property int $id
 * @property int $articulo_id
 * @property int $modelo_id
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Articulo $articulo
 * @property Modelo $modelo
 *
 * @package App\Models
 */
class ArticuloModelo extends Model
{
	protected $table = 'articulo_modelo';

	protected $casts = [
		'articulo_id' => 'int',
		'modelo_id' => 'int'
	];

	protected $fillable = [
		'articulo_id',
		'modelo_id'
	];

	public function articulo()
	{
		return $this->belongsTo(Articulo::class);
	}

	public function modelo()
	{
		return $this->belongsTo(Modelo::class);
	}
}
