<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class LogDebug
 * 
 * @property int $id
 * @property string|null $mensaje
 * @property Carbon|null $creado_en
 *
 * @package App\Models
 */
class LogDebug extends Model
{
	protected $table = 'log_debug';
	public $timestamps = false;

	protected $casts = [
		'creado_en' => 'datetime'
	];

	protected $fillable = [
		'mensaje',
		'creado_en'
	];
}
