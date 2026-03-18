<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Tipodocumento
 *
 * @property int $idTipoDocumento
 * @property string|null $nombre
 *
 * @property Collection|Cliente[] $clientes
 * @property Collection|Contactofinal[] $contactofinals
 * @property Collection|Contactosform[] $contactosforms
 *
 * @package App\Models
 */
class Tipodocumento extends Model
{
    protected $table = 'tipodocumento';
    protected $primaryKey = 'idTipoDocumento';
    public $timestamps = false;

    protected $fillable = [
        'nombre'
    ];

    public function clientes()
    {
        return $this->hasMany(Cliente::class, 'idTipoDocumento');
    }

    public function contactofinals()
    {
        return $this->hasMany(Contactofinal::class, 'idTipoDocumento');
    }

    public function contactosforms()
    {
        return $this->hasMany(Contactosform::class, 'tipo_documento_id');
    }
}
