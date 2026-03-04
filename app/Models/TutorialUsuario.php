<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TutorialUsuario
 * 
 * @property int $idtutorial
 * @property int|null $idUsuario
 * @property int|null $idTipo
 * 
 * @property Usuario|null $usuario
 * @property Tipotutorial|null $tipotutorial
 *
 * @package App\Models
 */
class TutorialUsuario extends Model
{
	protected $table = 'tutorial_usuario';
	protected $primaryKey = 'idtutorial';
	public $timestamps = false;

	protected $casts = [
		'idUsuario' => 'int',
		'idTipo' => 'int'
	];

	protected $fillable = [
		'idUsuario',
		'idTipo'
	];

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}

	public function tipotutorial()
	{
		return $this->belongsTo(Tipotutorial::class, 'idTipo');
	}
}
