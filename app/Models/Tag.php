<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Tag
 * 
 * @property int $id
 * @property string $name
 * @property string|null $color
 * @property string|null $description
 * @property int $user_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int|null $idseguimiento
 * @property int|null $idpersona
 * 
 * @property Usuario $usuario
 * @property Collection|Note[] $notes
 *
 * @package App\Models
 */
class Tag extends Model
{
	protected $table = 'tags';

	protected $casts = [
		'user_id' => 'int',
		'idseguimiento' => 'int',
		'idpersona' => 'int'
	];

	protected $fillable = [
		'name',
		'color',
		'description',
		'user_id',
		'idseguimiento',
		'idpersona'
	];

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'user_id');
	}

	public function notes()
	{
		return $this->hasMany(Note::class);
	}
}
