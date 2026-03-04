<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Seguimiento
 * 
 * @property int $idSeguimiento
 * @property int|null $idEmpresa
 * @property int|null $idContacto
 * @property int $idUsuario
 * @property int $tipoRegistro
 * @property Carbon $fechaIngreso
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Contacto|null $contacto
 * @property Empresa|null $empresa
 * @property Usuario $usuario
 * @property Collection|Contactosform[] $contactosforms
 * @property CronogramaConfiguracione|null $cronograma_configuracione
 * @property Collection|CronogramaDependencia[] $cronograma_dependencias
 * @property Collection|CronogramaHistorico[] $cronograma_historicos
 * @property Collection|CronogramaTarea[] $cronograma_tareas
 * @property Collection|Empresasform[] $empresasforms
 *
 * @package App\Models
 */
class Seguimiento extends Model
{
	protected $table = 'seguimientos';
	protected $primaryKey = 'idSeguimiento';

	protected $casts = [
		'idEmpresa' => 'int',
		'idContacto' => 'int',
		'idUsuario' => 'int',
		'tipoRegistro' => 'int',
		'fechaIngreso' => 'datetime'
	];

	protected $fillable = [
		'idEmpresa',
		'idContacto',
		'idUsuario',
		'tipoRegistro',
		'fechaIngreso'
	];

	public function contacto()
	{
		return $this->belongsTo(Contacto::class, 'idContacto');
	}

	public function empresa()
	{
		return $this->belongsTo(Empresa::class, 'idEmpresa');
	}

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'idUsuario');
	}

	public function contactosforms()
	{
		return $this->hasMany(Contactosform::class, 'idSeguimiento');
	}

	public function cronograma_configuracione()
	{
		return $this->hasOne(CronogramaConfiguracione::class, 'idSeguimiento');
	}

	public function cronograma_dependencias()
	{
		return $this->hasMany(CronogramaDependencia::class, 'idSeguimiento');
	}

	public function cronograma_historicos()
	{
		return $this->hasMany(CronogramaHistorico::class, 'idSeguimiento');
	}

	public function cronograma_tareas()
	{
		return $this->hasMany(CronogramaTarea::class, 'idSeguimiento');
	}

	public function empresasforms()
	{
		return $this->hasMany(Empresasform::class, 'idSeguimiento');
	}
}
