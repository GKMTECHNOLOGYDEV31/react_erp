<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Articulosprestado
 * 
 * @property int $idArticulosPrestados
 * @property string|null $razon
 * @property int|null $cantidad
 * @property string|null $estado
 * @property int $idSolicitud
 * @property int $idArticulos
 * 
 * @property Solicitud $solicitud
 * @property Articulo $articulo
 *
 * @package App\Models
 */
class Articulosprestado extends Model
{
	protected $table = 'articulosprestados';
	protected $primaryKey = 'idArticulosPrestados';
	public $timestamps = false;

	protected $casts = [
		'cantidad' => 'int',
		'idSolicitud' => 'int',
		'idArticulos' => 'int'
	];

	protected $fillable = [
		'razon',
		'cantidad',
		'estado',
		'idSolicitud',
		'idArticulos'
	];

	public function solicitud()
	{
		return $this->belongsTo(Solicitud::class, 'idSolicitud');
	}

	public function articulo()
	{
		return $this->belongsTo(Articulo::class, 'idArticulos');
	}
}
