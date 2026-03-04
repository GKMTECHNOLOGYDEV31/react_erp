<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Notificacione
 * 
 * @property int $idNotificacion
 * @property int $idUsuario
 * @property string|null $titulo
 * @property string|null $mensaje
 * @property string|null $tipo
 * @property int|null $idRelacionado
 * @property bool|null $leido
 * @property Carbon|null $creadaEn
 * 
 * @property Usuario $usuario
 *
 * @package App\Models
 */
class Notificacione extends Model
{
	protected $table = 'notificaciones';
	protected $primaryKey = 'idNotificacion';
	public $timestamps = false;

	protected $casts = [
		'idUsuario' => 'int',
		'idRelacionado' => 'int',
		'leido' => 'bool',
		'creadaEn' => 'datetime'
	];

	protected $fillable = [
		'idUsuario',
		'titulo',
		'mensaje',
		'tipo',
		'idRelacionado',
		'leido',
		'creadaEn'
	];

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}
}
