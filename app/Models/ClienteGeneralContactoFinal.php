<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ClienteGeneralContactoFinal
 * 
 * @property int $idClienteGeneralContactoFinal
 * @property int $idClienteGeneral
 * @property int $idContactoFinal
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Clientegeneral $clientegeneral
 * @property Contactofinal $contactofinal
 *
 * @package App\Models
 */
class ClienteGeneralContactoFinal extends Model
{
	protected $table = 'cliente_general_contacto_final';
	protected $primaryKey = 'idClienteGeneralContactoFinal';

	protected $casts = [
		'idClienteGeneral' => 'int',
		'idContactoFinal' => 'int'
	];

	protected $fillable = [
		'idClienteGeneral',
		'idContactoFinal'
	];

	public function clientegeneral()
	{
		return $this->belongsTo(Clientegeneral::class, 'idClienteGeneral');
	}

	public function contactofinal()
	{
		return $this->belongsTo(Contactofinal::class, 'idContactoFinal');
	}
}
