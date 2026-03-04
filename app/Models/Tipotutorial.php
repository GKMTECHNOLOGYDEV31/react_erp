<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Tipotutorial
 * 
 * @property int $idtipoTutorial
 * @property string|null $nombre
 * 
 * @property Collection|TutorialUsuario[] $tutorial_usuarios
 *
 * @package App\Models
 */
class Tipotutorial extends Model
{
	protected $table = 'tipotutorial';
	protected $primaryKey = 'idtipoTutorial';
	public $timestamps = false;

	protected $fillable = [
		'nombre'
	];

	public function tutorial_usuarios()
	{
		return $this->hasMany(TutorialUsuario::class, 'idTipo');
	}
}
