<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

/**
 * Class Usuario
 *
 * @property int $idUsuario
 * @property string|null $apellidoPaterno
 * @property string|null $apellidoMaterno
 * @property string|null $Nombre
 * @property Carbon|null $fechaNacimiento
 * @property string|null $telefono
 * @property string|null $correo
 * @property string|null $correo_personal
 * @property string|null $usuario
 * @property string|null $clave
 * @property string|null $nacionalidad
 * @property string|null $departamento
 * @property string|null $provincia
 * @property string|null $distrito
 * @property string|null $direccion
 * @property string|null $avatar
 * @property string|null $documento
 * @property float|null $sueldoPorHora
 * @property int|null $idSucursal
 * @property int|null $idClienteGeneral
 * @property int|null $idTipoDocumento
 * @property int|null $idTipoUsuario
 * @property int|null $idSexo
 * @property int|null $idRol
 * @property int|null $idTipoArea
 * @property string|null $firma
 * @property int|null $estado
 * @property string|null $token
 * @property float|null $sueldoMensual
 * @property int|null $estadocivil
 *
 * @property Clientegeneral|null $clientegeneral
 * @property Collection|Actividade[] $actividades
 * @property Collection|AprobacionHorario[] $aprobacion_horarios
 * @property Collection|AprobacionHora[] $aprobacion_horas
 * @property Collection|Asignacione[] $asignaciones
 * @property Collection|Asistencia[] $asistencias
 * @property Collection|AutorizacionHorasExtra[] $autorizacion_horas_extras
 * @property Collection|CambioHorario[] $cambio_horarios
 * @property Collection|Chat[] $chats
 * @property Collection|Cuentasbancaria[] $cuentasbancarias
 * @property Collection|CustodiaFoto[] $custodia_fotos
 * @property Collection|DatosEnvio[] $datos_envios
 * @property Collection|DocumentosUsuario[] $documentos_usuarios
 * @property Collection|Etiqueta[] $etiquetas
 * @property Collection|GuardiaTecnico[] $guardia_tecnicos
 * @property Collection|InventarioTecnico[] $inventario_tecnicos
 * @property Collection|Invitado[] $invitados
 * @property Collection|ManejoEnvio[] $manejo_envios
 * @property Collection|Mensaje[] $mensajes
 * @property Collection|MensajesVisto[] $mensajes_vistos
 * @property Collection|MovimientosInventario[] $movimientos_inventarios
 * @property Collection|Note[] $notes
 * @property Collection|Notificacione[] $notificaciones
 * @property Collection|NotificacionesObservacione[] $notificaciones_observaciones
 * @property Collection|Observacione[] $observaciones
 * @property Collection|RepuestosEntrega[] $repuestos_entregas
 * @property Collection|RepuestosEnviosProvincium[] $repuestos_envios_provincia
 * @property Collection|Seguimiento[] $seguimientos
 * @property Collection|Solicitudentrega[] $solicitudentregas
 * @property Collection|StickerPack[] $sticker_packs
 * @property Collection|Sticker[] $stickers
 * @property Collection|Tag[] $tags
 * @property Collection|TicketReceptor[] $ticket_receptors
 * @property Collection|Ticket[] $tickets
 * @property Collection|TicketsClienteGeneral[] $tickets_cliente_generals
 * @property Collection|TutorialUsuario[] $tutorial_usuarios
 * @property UbicacionesEmpleado|null $ubicaciones_empleado
 * @property Collection|Vehiculo[] $vehiculos
 *
 * @package App\Models
 */
class Usuario extends Model
{
    use HasApiTokens;
    protected $table = 'usuarios';
    protected $primaryKey = 'idUsuario';
    public $timestamps = false;

    protected $casts = [
        'fechaNacimiento' => 'datetime',
        'sueldoPorHora' => 'float',
        'idSucursal' => 'int',
        'idClienteGeneral' => 'int',
        'idTipoDocumento' => 'int',
        'idTipoUsuario' => 'int',
        'idSexo' => 'int',
        'idRol' => 'int',
        'idTipoArea' => 'int',
        'estado' => 'int',
        'sueldoMensual' => 'float',
        'estadocivil' => 'int',


    ];

    protected $hidden = [
        'token',
        'clave',

    ];

    protected $fillable = [
        'apellidoPaterno',
        'apellidoMaterno',
        'Nombre',
        'fechaNacimiento',
        'telefono',
        'correo',
        'correo_personal',
        'usuario',
        'clave',
        'nacionalidad',
        'departamento',
        'provincia',
        'distrito',
        'direccion',
        'avatar',
        'documento',
        'sueldoPorHora',
        'idSucursal',
        'idClienteGeneral',
        'idTipoDocumento',
        'idTipoUsuario',
        'idSexo',
        'idRol',
        'idTipoArea',
        'firma',
        'estado',
        'token',
        'sueldoMensual',
        'estadocivil'
    ];

    public function clientegeneral()
    {
        return $this->belongsTo(Clientegeneral::class, 'idClienteGeneral');
    }

    public function actividades()
    {
        return $this->hasMany(Actividade::class, 'user_id');
    }

    public function aprobacion_horarios()
    {
        return $this->hasMany(AprobacionHorario::class, 'idUsuario');
    }

    public function aprobacion_horas()
    {
        return $this->hasMany(AprobacionHora::class, 'idUsuario');
    }

    public function asignaciones()
    {
        return $this->hasMany(Asignacione::class, 'idUsuario');
    }

    public function asistencias()
    {
        return $this->hasMany(Asistencia::class, 'idUsuario');
    }

    public function autorizacion_horas_extras()
    {
        return $this->hasMany(AutorizacionHorasExtra::class, 'idUsuario');
    }

    public function cambio_horarios()
    {
        return $this->hasMany(CambioHorario::class, 'idUsuario');
    }

    public function chats()
    {
        return $this->belongsToMany(Chat::class, 'chat_usuarios', 'idUsuario', 'idChat')
            ->withPivot('idChatUsuario', 'esAdmin', 'archivado');
    }

    public function cuentasbancarias()
    {
        return $this->hasMany(Cuentasbancaria::class, 'idUsuario');
    }

    public function custodia_fotos()
    {
        return $this->hasMany(CustodiaFoto::class, 'uploaded_by');
    }

    public function datos_envios()
    {
        return $this->hasMany(DatosEnvio::class, 'idUsuario');
    }

    public function documentos_usuarios()
    {
        return $this->hasMany(DocumentosUsuario::class, 'idUsuario');
    }

    public function etiquetas()
    {
        return $this->hasMany(Etiqueta::class, 'user_id');
    }

    public function guardia_tecnicos()
    {
        return $this->hasMany(GuardiaTecnico::class, 'idUsuario');
    }

    public function inventario_tecnicos()
    {
        return $this->hasMany(InventarioTecnico::class, 'idUsuario');
    }

    public function invitados()
    {
        return $this->hasMany(Invitado::class, 'id_usuarios');
    }

    public function manejo_envios()
    {
        return $this->hasMany(ManejoEnvio::class, 'idUsuario');
    }

    public function mensajes()
    {
        return $this->hasMany(Mensaje::class, 'idRemitente');
    }

    public function mensajes_vistos()
    {
        return $this->hasMany(MensajesVisto::class, 'idUsuario');
    }

    public function movimientos_inventarios()
    {
        return $this->hasMany(MovimientosInventario::class, 'idUsuario');
    }

    public function notes()
    {
        return $this->hasMany(Note::class, 'user_id');
    }

    public function notificaciones()
    {
        return $this->hasMany(Notificacione::class, 'idUsuario');
    }

    public function notificaciones_observaciones()
    {
        return $this->hasMany(NotificacionesObservacione::class, 'idUsuario');
    }

    public function observaciones()
    {
        return $this->hasMany(Observacione::class, 'idUsuario');
    }

    public function repuestos_entregas()
    {
        return $this->hasMany(RepuestosEntrega::class, 'usuario_entrego_id');
    }

    public function repuestos_envios_provincia()
    {
        return $this->hasMany(RepuestosEnviosProvincium::class, 'usuario_entrego_id');
    }

    public function seguimientos()
    {
        return $this->hasMany(Seguimiento::class, 'idUsuario');
    }

    public function solicitudentregas()
    {
        return $this->hasMany(Solicitudentrega::class, 'idUsuario');
    }

    public function sticker_packs()
    {
        return $this->hasMany(StickerPack::class, 'idUsuario');
    }

    public function stickers()
    {
        return $this->hasMany(Sticker::class, 'idUsuario');
    }

    public function tags()
    {
        return $this->hasMany(Tag::class, 'user_id');
    }

    public function ticket_receptors()
    {
        return $this->hasMany(TicketReceptor::class, 'idReceptor');
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'ejecutor');
    }

    public function tickets_cliente_generals()
    {
        return $this->hasMany(TicketClienteGeneral::class, 'idUsuarioCreador');
    }

    public function tutorial_usuarios()
    {
        return $this->hasMany(TutorialUsuario::class, 'idUsuario');
    }

    public function ubicaciones_empleado()
    {
        return $this->hasOne(UbicacionesEmpleado::class, 'idUsuario');
    }

    public function vehiculos()
    {
        return $this->hasMany(Vehiculo::class, 'idUsuario');
    }
}
