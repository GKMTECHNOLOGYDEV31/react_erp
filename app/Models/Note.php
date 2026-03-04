<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Note
 * 
 * @property int $id
 * @property string $title
 * @property string|null $description
 * @property bool $is_favorite
 * @property int $user_id
 * @property int|null $tag_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int|null $idseguimiento
 * @property int|null $idpersona
 * 
 * @property Tag|null $tag
 * @property Usuario $usuario
 *
 * @package App\Models
 */
class Note extends Model
{
	protected $table = 'notes';

	protected $casts = [
		'is_favorite' => 'bool',
		'user_id' => 'int',
		'tag_id' => 'int',
		'idseguimiento' => 'int',
		'idpersona' => 'int'
	];

	protected $fillable = [
		'title',
		'description',
		'is_favorite',
		'user_id',
		'tag_id',
		'idseguimiento',
		'idpersona'
	];

	public function tag()
	{
		return $this->belongsTo(Tag::class);
	}

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'user_id');
	}
}
