<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class CustodiaFoto
 * 
 * @property int $id
 * @property int $id_custodia
 * @property string $nombre_archivo
 * @property string $nombre_hash
 * @property string $tipo_archivo
 * @property int $tamaño_archivo
 * @property string $datos_imagen
 * @property string $hash_archivo
 * @property string|null $descripcion
 * @property int $uploaded_by
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Custodia $custodia
 * @property Usuario $usuario
 *
 * @package App\Models
 */
class CustodiaFoto extends Model
{
	protected $table = 'custodia_fotos';

	protected $casts = [
		'id_custodia' => 'int',
		'tamaño_archivo' => 'int',
		'uploaded_by' => 'int'
	];

	protected $fillable = [
		'id_custodia',
		'nombre_archivo',
		'nombre_hash',
		'tipo_archivo',
		'tamaño_archivo',
		'datos_imagen',
		'hash_archivo',
		'descripcion',
		'uploaded_by'
	];

	public function custodia()
	{
		return $this->belongsTo(Custodia::class, 'id_custodia');
	}

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'uploaded_by');
	}
}
