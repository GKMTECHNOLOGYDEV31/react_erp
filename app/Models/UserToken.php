<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class UserToken
 * 
 * @property int $id
 * @property int $idUsuario
 * @property string $token
 * @property string|null $platform
 * @property string|null $deviceId
 * @property Carbon $created_at
 * @property Carbon $updated_at
 *
 * @package App\Models
 */
class UserToken extends Model
{
	protected $table = 'user_tokens';

	protected $casts = [
		'idUsuario' => 'int'
	];

	protected $hidden = [
		'token'
	];

	protected $fillable = [
		'idUsuario',
		'token',
		'platform',
		'deviceId'
	];
}
