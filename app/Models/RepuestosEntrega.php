<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class RepuestosEntrega
 * 
 * @property int $id
 * @property int $solicitud_id
 * @property int $articulo_id
 * @property int $usuario_destino_id
 * @property string $tipo_entrega
 * @property int $cantidad
 * @property string|null $ubicacion_utilizada
 * @property int|null $ubicacion_id
 * @property string|null $numero_ticket
 * @property Carbon|null $fecha_entrega
 * @property Carbon $fecha_preparacion
 * @property int|null $usuario_entrego_id
 * @property int|null $usuario_preparo_id
 * @property string|null $observaciones
 * @property string|null $foto_entrega
 * @property string|null $tipo_archivo_foto
 * @property bool|null $firma_confirma
 * @property int|null $firmaTecnico
 * @property string|null $estadoTecnico
 * @property string|null $observaciones_entrega
 * @property string|null $estado
 * @property int|null $entrega_origen_id
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property int|null $firmaReceptor
 * @property int|null $firmaEmisor
 * @property string|null $fotoRetorno
 * @property string|null $obsEntrega
 * @property string|null $fotoEmisor
 * 
 * @property Usuario|null $usuario
 * @property Solicitudesordene $solicitudesordene
 * @property Articulo $articulo
 *
 * @package App\Models
 */
class RepuestosEntrega extends Model
{
	protected $table = 'repuestos_entregas';

	protected $casts = [
		'solicitud_id' => 'int',
		'articulo_id' => 'int',
		'usuario_destino_id' => 'int',
		'cantidad' => 'int',
		'ubicacion_id' => 'int',
		'fecha_entrega' => 'datetime',
		'fecha_preparacion' => 'datetime',
		'usuario_entrego_id' => 'int',
		'usuario_preparo_id' => 'int',
		'firma_confirma' => 'bool',
		'firmaTecnico' => 'int',
		'entrega_origen_id' => 'int',
		'firmaReceptor' => 'int',
		'firmaEmisor' => 'int'
	];

	protected $fillable = [
		'solicitud_id',
		'articulo_id',
		'usuario_destino_id',
		'tipo_entrega',
		'cantidad',
		'ubicacion_utilizada',
		'ubicacion_id',
		'numero_ticket',
		'fecha_entrega',
		'fecha_preparacion',
		'usuario_entrego_id',
		'usuario_preparo_id',
		'observaciones',
		'foto_entrega',
		'tipo_archivo_foto',
		'firma_confirma',
		'firmaTecnico',
		'estadoTecnico',
		'observaciones_entrega',
		'estado',
		'entrega_origen_id',
		'firmaReceptor',
		'firmaEmisor',
		'fotoRetorno',
		'obsEntrega',
		'fotoEmisor'
	];

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'usuario_entrego_id');
	}

	public function solicitudesordene()
	{
		return $this->belongsTo(Solicitudesordene::class, 'solicitud_id');
	}

	public function articulo()
	{
		return $this->belongsTo(Articulo::class);
	}
}
