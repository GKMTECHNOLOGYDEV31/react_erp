<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ReunionParticipantesComercial
 * 
 * @property int $id
 * @property int|null $reunion_id
 * @property int|null $usuario_id
 * @property string|null $nombre
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property TaskReunione|null $task_reunione
 *
 * @package App\Models
 */
class ReunionParticipantesComercial extends Model
{
	protected $table = 'reunion_participantes_comercial';

	protected $casts = [
		'reunion_id' => 'int',
		'usuario_id' => 'int'
	];

	protected $fillable = [
		'reunion_id',
		'usuario_id',
		'nombre'
	];

	public function task_reunione()
	{
		return $this->belongsTo(TaskReunione::class, 'reunion_id');
	}
}
