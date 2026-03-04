<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class AnexoObservacione
 * 
 * @property int $idAnexo_observaciones
 * @property string|null $foto
 * @property int|null $idObservaciones
 * 
 * @property Observacione|null $observacione
 *
 * @package App\Models
 */
class AnexoObservacione extends Model
{
	protected $table = 'anexo_observaciones';
	protected $primaryKey = 'idAnexo_observaciones';
	public $timestamps = false;

	protected $casts = [
		'idObservaciones' => 'int'
	];

	protected $fillable = [
		'foto',
		'idObservaciones'
	];

	public function observacione()
	{
		return $this->belongsTo(Observacione::class, 'idObservaciones');
	}
}
