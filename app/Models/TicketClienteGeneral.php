<?php
// app/Models/TicketClienteGeneral.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketClienteGeneral extends Model
{
    use HasFactory;

    protected $table = 'tickets_cliente_general';
    protected $primaryKey = 'idTicket';
    public $timestamps = false;

    protected $fillable = [
        'numero_ticket',
        'nombreCompleto',
        'correoElectronico',
        'idTipoDocumento',
        'dni_ruc_ce',
        'telefonoCelular',
        'telefonoFijo',
        'direccionCompleta',
        'referenciaDomicilio',
        'departamento',
        'provincia',
        'distrito',
        'idCategoria',
        'idModelo',
        'serieProducto',
        'detallesFalla',
        'fechaCompra',
        'tiendaSedeCompra',
        'fotoVideoFalla',
        'fotoBoletaFactura',
        'fotoNumeroSerie',
        'ubicacionGoogleMaps',
        'estado',
        'idUsuarioCreador',
        'idClienteGeneral',
        'fechaCreacion'
    ];

    protected $casts = [
        'fechaCompra' => 'date',
        'fechaCreacion' => 'datetime',
        'estado' => 'integer'
    ];

    // Relaciones
    public function tipoDocumento()
    {
        return $this->belongsTo(TipoDocumento::class, 'idTipoDocumento', 'idTipoDocumento');
    }

    public function categoria()
    {
        return $this->belongsTo(Categorium::class, 'idCategoria', 'idCategoria');
    }

    public function modelo()
    {
        return $this->belongsTo(Modelo::class, 'idModelo', 'idModelo');
    }

    public function usuarioCreador()
    {
        return $this->belongsTo(Usuario::class, 'idUsuarioCreador', 'idUsuario');
    }

    // Método para generar número de ticket automático
    public static function generarNumeroTicket()
    {
        $ultimoTicket = self::orderBy('idTicket', 'desc')->first();
        $numero = $ultimoTicket ? intval(substr($ultimoTicket->numero_ticket, -6)) + 1 : 1;
        return 'TKT-' . str_pad($numero, 6, '0', STR_PAD_LEFT);
    }
    // app/Models/TicketClienteGeneral.php

public function clienteGeneral()
{
    return $this->belongsTo(Clientegeneral::class, 'idClienteGeneral', 'idClienteGeneral');
}
}