<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Etiqueta
 * 
 * @property int $id
 * @property string $nombre
 * @property string|null $color
 * @property string|null $icono
 * @property int $user_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Usuario $usuario
 *
 * @package App\Models
 */
class Etiqueta extends Model
{
	protected $table = 'etiquetas';

	protected $casts = [
		'user_id' => 'int'
	];

	protected $fillable = [
		'nombre',
		'color',
		'icono',
		'user_id'
	];

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'user_id');
	}
}
