<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Fotostickest
 * 
 * @property int $idfotostickest
 * @property int $idTickets
 * @property int $idVisitas
 * @property string|null $foto
 * @property string|null $descripcion
 *
 * @package App\Models
 */
class Fotostickest extends Model
{
	protected $table = 'fotostickest';
	protected $primaryKey = 'idfotostickest';
	public $timestamps = false;

	protected $casts = [
		'idTickets' => 'int',
		'idVisitas' => 'int'
	];

	protected $fillable = [
		'idTickets',
		'idVisitas',
		'foto',
		'descripcion'
	];
}
