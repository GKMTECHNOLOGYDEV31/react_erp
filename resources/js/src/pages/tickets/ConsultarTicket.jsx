import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket, faSearch, faFilePdf, faDownload } from '@fortawesome/free-solid-svg-icons';

const ConsultarTicket = () => {
    const [ticketId, setTicketId] = useState('');
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Datos estáticos de ejemplo
    const ticketsData = {
        'TICKET-001': {
            id: 'TICKET-001',
            titulo: 'Problema con el sistema de facturación electrónica',
            descripcion: 'El sistema no genera facturas electrónicas correctamente. Al intentar generar una factura, muestra error de conexión con AFIP. Esto está afectando las ventas del día.',
            cliente: 'Empresa ABC S.A.',
            contacto: 'Juan Pérez',
            email: 'juan.perez@empresaabc.com',
            telefono: '+54 11 1234-5678',
            estado: 'en_proceso',
            fechaCreacion: '2024-01-15T10:30:00',
            fechaAsignacion: '2024-01-15T11:00:00',
            fechaCierre: null,
            tecnicoAsignado: 'Carlos Rodríguez',
            visitas: 5,
            solucion: 'En proceso de revisión del módulo de facturación. Se detectó error en la comunicación con AFIP debido a un certificado vencido. Se está gestionando la renovación del certificado. Se espera resolver en 24-48 horas hábiles.',
            tiempoTotal: '2h 30m',
            archivos: [
                { nombre: 'error_factura.png', tamaño: '245 KB', url: '#' },
                { nombre: 'log_sistema.txt', tamaño: '12 KB', url: '#' },
                { nombre: 'captura_error.jpg', tamaño: '1.2 MB', url: '#' }
            ],
            historial: [
                { fecha: '2024-01-15 10:30', accion: 'Ticket creado', usuario: 'Juan Pérez' },
                { fecha: '2024-01-15 11:00', accion: 'Asignado a Carlos Rodríguez', usuario: 'Sistema' },
                { fecha: '2024-01-15 14:30', accion: 'En proceso de revisión', usuario: 'Carlos Rodríguez' },
                { fecha: '2024-01-16 09:15', accion: 'Contactado cliente para más información', usuario: 'Carlos Rodríguez' }
            ]
        },
        'TICKET-002': {
            id: 'TICKET-002',
            titulo: 'No se puede acceder al módulo de ventas',
            descripcion: 'Varios usuarios reportan que no pueden acceder al módulo de ventas. Aparece error de permisos.',
            cliente: 'Distribuidora XYZ',
            contacto: 'María González',
            email: 'maria@distribuidoraxyz.com',
            telefono: '+54 11 8765-4321',
            estado: 'cerrado',
            fechaCreacion: '2024-01-10T09:00:00',
            fechaAsignacion: '2024-01-10T09:30:00',
            fechaCierre: '2024-01-12T16:45:00',
            tecnicoAsignado: 'Ana Martínez',
            visitas: 12,
            solucion: 'Se detectó que los permisos de usuario fueron modificados incorrectamente durante una actualización. Se restauraron los permisos desde el backup del día anterior y se verificó el correcto funcionamiento. Se actualizó la documentación del procedimiento.',
            tiempoTotal: '3h 15m',
            archivos: [
                { nombre: 'reporte_incidencia.pdf', tamaño: '500 KB', url: '#' },
                { nombre: 'backup_permisos.sql', tamaño: '45 KB', url: '#' }
            ],
            historial: [
                { fecha: '2024-01-10 09:00', accion: 'Ticket creado', usuario: 'María González' },
                { fecha: '2024-01-10 09:30', accion: 'Asignado a Ana Martínez', usuario: 'Sistema' },
                { fecha: '2024-01-10 10:15', accion: 'Diagnóstico iniciado', usuario: 'Ana Martínez' },
                { fecha: '2024-01-10 11:30', accion: 'Problema identificado', usuario: 'Ana Martínez' },
                { fecha: '2024-01-12 15:00', accion: 'Solución aplicada', usuario: 'Ana Martínez' },
                { fecha: '2024-01-12 16:45', accion: 'Ticket cerrado', usuario: 'Ana Martínez' }
            ]
        },
        'TICKET-003': {
            id: 'TICKET-003',
            titulo: 'Error al generar reportes de inventario',
            descripcion: 'Al intentar generar el reporte mensual de inventario, el sistema se queda cargando indefinidamente y no muestra resultados.',
            cliente: 'Farmacias del Centro',
            contacto: 'Roberto Sánchez',
            email: 'roberto@farmaciascentro.com',
            telefono: '+54 11 2345-6789',
            estado: 'abierto',
            fechaCreacion: '2024-01-16T08:20:00',
            fechaAsignacion: null,
            fechaCierre: null,
            tecnicoAsignado: 'Pendiente de asignación',
            visitas: 3,
            solucion: 'Pendiente de análisis. Se recomienda ejecutar el reporte en horarios de menor carga y verificar si el problema persiste.',
            tiempoTotal: '45m',
            archivos: [],
            historial: [
                { fecha: '2024-01-16 08:20', accion: 'Ticket creado', usuario: 'Roberto Sánchez' },
                { fecha: '2024-01-16 09:00', accion: 'En espera de asignación', usuario: 'Sistema' }
            ]
        }
    };

    const handleConsultar = async () => {
        if (!ticketId) {
            setError('Por favor ingresa un ID de ticket');
            return;
        }
        
        setLoading(true);
        setError('');
        
        // Simulamos una carga de 1 segundo
        setTimeout(() => {
            const ticketEncontrado = ticketsData[ticketId.toUpperCase()];
            
            if (ticketEncontrado) {
                setTicket(ticketEncontrado);
            } else {
                setError('Ticket no encontrado. IDs disponibles: TICKET-001, TICKET-002, TICKET-003');
                setTicket(null);
            }
            setLoading(false);
        }, 1000);
    };

    const getEstadoBadge = (estado) => {
        const estados = {
            'abierto': 'bg-blue-100 text-blue-800 border border-blue-200',
            'en_proceso': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
            'cerrado': 'bg-green-100 text-green-800 border border-green-200',
            'pendiente': 'bg-orange-100 text-orange-800 border border-orange-200'
        };
        return estados[estado] || 'bg-gray-100 text-gray-800 border border-gray-200';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Pendiente';
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            {/* Breadcrumb */}
            <ul className="flex space-x-2 rtl:space-x-reverse items-center mb-5">
                <li>
                    <Link to="/tickets" className="text-primary hover:underline flex items-center gap-1">
                        <FontAwesomeIcon icon={faTicket} className="w-4 h-4" />
                        Tickets
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 flex items-center gap-1">
                    <FontAwesomeIcon icon={faSearch} className="w-3 h-3 text-gray-500" />
                    <span>Consultar Ticket</span>
                </li>
            </ul>

            {/* Panel de Búsqueda */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">🔍 Consultar Ticket</h1>
                    <p className="text-gray-600 text-lg">Ingrese el ID del ticket para ver toda la información detallada</p>
                    <p className="text-sm text-gray-500 mt-2 bg-blue-50 inline-block px-4 py-2 rounded-full">
                        IDs de prueba: TICKET-001, TICKET-002, TICKET-003
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                                    placeholder="Ej: TICKET-001"
                                    value={ticketId}
                                    onChange={(e) => setTicketId(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleConsultar()}
                                />
                                <FontAwesomeIcon icon={faSearch} className="w-6 h-6 absolute left-4 top-4 text-gray-400" />
                            </div>
                        </div>
                        <button 
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
                            onClick={handleConsultar}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Consultando...</span>
                                </>
                            ) : (
                                <>
                                    <span>Consultar Ticket</span>
                                    <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                    
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-red-600 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                {error}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Resultados */}
            {ticket && (
                <div className="space-y-6">
                    {/* Header del Ticket */}
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="px-3 py-1 bg-blue-500 bg-opacity-20 rounded-full text-sm font-semibold text-blue-200">
                                        #{ticket.id}
                                    </span>
                                    <span className="text-gray-400">|</span>
                                    <span className="text-gray-300">{ticket.tiempoTotal} de atención</span>
                                </div>
                                <h2 className="text-3xl font-bold mb-2">{ticket.titulo}</h2>
                                <p className="text-gray-300 text-lg">{ticket.descripcion}</p>
                            </div>
                            <div>
                                <span className={`px-4 py-2 rounded-xl text-sm font-bold text-center block ${getEstadoBadge(ticket.estado)}`}>
                                    {ticket.estado.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Grid de Información */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* INFORMACION DEL TICKET */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b-2 border-blue-500 flex items-center gap-2">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                INFORMACIÓN DEL TICKET
                            </h3>
                            <div className="space-y-4">
                                <InfoRow label="Fecha Creación" value={formatDate(ticket.fechaCreacion)} icon="📅" />
                                <InfoRow label="Fecha Asignación" value={formatDate(ticket.fechaAsignacion)} icon="⏰" />
                                <InfoRow label="Fecha Cierre" value={formatDate(ticket.fechaCierre)} icon="✅" />
                                <InfoRow label="Tiempo Total" value={ticket.tiempoTotal} icon="⏱️" />
                            </div>
                        </div>

                        {/* ESTADO DEL TICKET */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b-2 border-yellow-500 flex items-center gap-2">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                ESTADO DEL TICKET
                            </h3>
                            <div className="space-y-4">
                                <InfoRow label="Estado Actual" value={ticket.estado.replace('_', ' ').toUpperCase()} icon="📊" />
                                <InfoRow label="Técnico Asignado" value={ticket.tecnicoAsignado} icon="👨‍💻" />
                                <InfoRow label="Tiempo Restante" value={ticket.estado === 'cerrado' ? 'Completado' : 'En progreso'} icon="⌛" />
                            </div>
                        </div>

                        {/* ATENCION DEL TICKET */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b-2 border-green-500 flex items-center gap-2">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                ATENCIÓN DEL TICKET
                            </h3>
                            <div className="space-y-4">
                                <InfoRow label="Cliente" value={ticket.cliente} icon="🏢" />
                                <InfoRow label="Contacto" value={ticket.contacto} icon="👤" />
                                <InfoRow label="Email" value={ticket.email} icon="📧" />
                                <InfoRow label="Teléfono" value={ticket.telefono} icon="📞" />
                            </div>
                        </div>

                        {/* SEGUIMIENTO */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b-2 border-purple-500 flex items-center gap-2">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                                SEGUIMIENTO
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                                    <span className="font-bold text-gray-700 flex items-center gap-2">
                                        <span className="text-2xl">👁️</span>
                                        Cantidad de Visitas:
                                    </span>
                                    <span className="text-3xl font-bold text-purple-600">{ticket.visitas}</span>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                        <span className="text-xl">💡</span>
                                        SOLUCIÓN APLICADA
                                    </label>
                                    <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                                        <p className="text-gray-700 leading-relaxed">{ticket.solucion}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Historial de Actividades */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b-2 border-gray-300 flex items-center gap-2">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            HISTORIAL DE ACTIVIDADES
                        </h3>
                        <div className="space-y-3">
                            {ticket.historial.map((item, index) => (
                                <div key={index} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="w-24 text-sm font-medium text-gray-500">{item.fecha}</div>
                                    <div className="flex-1">
                                        <span className="font-medium text-gray-800">{item.accion}</span>
                                        <span className="text-sm text-gray-500 ml-2">por {item.usuario}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Archivos Adjuntos */}
                    {ticket.archivos && ticket.archivos.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b-2 border-gray-300 flex items-center gap-2">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                </svg>
                                ARCHIVOS ADJUNTOS
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {ticket.archivos.map((archivo, index) => (
                                    <a key={index} href={archivo.url} className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all hover:shadow-md border border-gray-200">
                                        <svg className="w-6 h-6 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                        <div className="flex-1">
                                            <span className="text-gray-800 font-medium block">{archivo.nombre}</span>
                                            <span className="text-xs text-gray-500">{archivo.tamaño}</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Botones de Acción */}
                    <div className="flex justify-end gap-4 mt-8">
                        <button className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg hover:shadow-xl">
                            <FontAwesomeIcon icon={faFilePdf} className="w-5 h-5" />
                            GENERAR PDF
                        </button>
                        <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg hover:shadow-xl">
                            <FontAwesomeIcon icon={faDownload} className="w-5 h-5" />
                            EXPORTAR
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Componente auxiliar
const InfoRow = ({ label, value, icon }) => (
    <div className="flex items-start">
        <span className="text-xl mr-3">{icon}</span>
        <div className="flex-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">{label}</span>
            <span className="text-gray-800 font-medium text-lg">{value}</span>
        </div>
    </div>
);

export default ConsultarTicket;