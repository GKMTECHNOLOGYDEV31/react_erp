<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Project
 * 
 * @property int $id
 * @property string $title
 * @property int|null $idseguimiento
 * @property int|null $idpersona
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|Task[] $tasks
 *
 * @package App\Models
 */
class Project extends Model
{
	protected $table = 'projects';

	protected $casts = [
		'idseguimiento' => 'int',
		'idpersona' => 'int'
	];

	protected $fillable = [
		'title',
		'idseguimiento',
		'idpersona'
	];

	public function tasks()
	{
		return $this->hasMany(Task::class);
	}
}
