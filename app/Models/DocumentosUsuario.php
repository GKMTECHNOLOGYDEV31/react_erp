<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class DocumentosUsuario
 * 
 * @property int $idDocumento
 * @property int $idUsuario
 * @property string $tipo_documento
 * @property string $nombre_archivo
 * @property string $ruta_archivo
 * @property string $mime_type
 * @property int $tamano
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Usuario $usuario
 *
 * @package App\Models
 */
class DocumentosUsuario extends Model
{
	protected $table = 'documentos_usuario';
	protected $primaryKey = 'idDocumento';

	protected $casts = [
		'idUsuario' => 'int',
		'tamano' => 'int'
	];

	protected $fillable = [
		'idUsuario',
		'tipo_documento',
		'nombre_archivo',
		'ruta_archivo',
		'mime_type',
		'tamano'
	];

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}
}
