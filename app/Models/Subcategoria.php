<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Subcategoria
 * 
 * @property int $id
 * @property string $nombre
 * @property string|null $descripcion
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|TicketsClienteGeneral[] $tickets_cliente_generals
 *
 * @package App\Models
 */
class Subcategoria extends Model
{
	protected $table = 'subcategorias';

	protected $fillable = [
		'nombre',
		'descripcion'
	];

	public function tickets_cliente_generals()
	{
		return $this->hasMany(TicketsClienteGeneral::class, 'idSubcategoria');
	}
}
