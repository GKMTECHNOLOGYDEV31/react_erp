import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTicket,
    faSearch,
    faFilePdf,
    faDownload,
    faCopy,
    faUser,
    faIdCard,
    faPhone,
    faMobile,
    faEnvelope,
    faMapMarkerAlt,
    faHome,
    faCity,
    faGlobe,
    faBuilding,
    faRoad,
    faCalendarAlt,
    faStore,
    faLaptop,
    faHashtag,
    faExclamationTriangle,
    faComment,
    faCamera,
    faVideo,
    faFileInvoice,
    faImage,
    faMap,
    faSpinner,
    faCheckDouble,
    faTools,
    faSearchLocation,
    faHistory,
    faList,
    faEye,
    faTimes,
    faClock,
    faUserCircle,
    faClipboardList,
    faSignature,
    faPen,
    faUserTie,
    faFileSignature
} from '@fortawesome/free-solid-svg-icons';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import axios from 'axios';

const ConsultarTicket = () => {
    const [ticketId, setTicketId] = useState('');
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [modalImage, setModalImage] = useState(null);
    const [activeTab, setActiveTab] = useState('general');
    const [expandedVisita, setExpandedVisita] = useState(null);

    const API_URL = 'http://127.0.0.1:8000/api';

    // Configurar toastr
    toastr.options = {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-right',
        timeOut: 3000,
        showDuration: 300,
        hideDuration: 500,
    };

    const getStatusBadge = (estado) => {
        const statusConfig = {
            evaluando: 'bg-purple-100 text-purple-800 border-purple-200',
            gestionando: 'bg-blue-100 text-blue-800 border-blue-200',
            finalizado: 'bg-green-100 text-green-800 border-green-200'
        };
        return statusConfig[estado] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getEstadoOTBadge = (color) => {
        const colores = {
            'rojo': 'bg-red-100 text-red-800 border-red-200',
            'verde': 'bg-green-100 text-green-800 border-green-200',
            'amarillo': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'azul': 'bg-blue-100 text-blue-800 border-blue-200',
            'morado': 'bg-purple-100 text-purple-800 border-purple-200',
            'naranja': 'bg-orange-100 text-orange-800 border-orange-200'
        };
        return colores[color?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const handleConsultar = async () => {
        if (!ticketId) {
            toastr.warning('Por favor ingresa un número de ticket', 'Campo requerido');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/tickets/consultar-completo/${ticketId.toUpperCase()}`, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Accept': 'application/json'
                }
            });

            if (response.data.success) {
                setTicket(response.data.data);
                toastr.success(`Ticket ${ticketId.toUpperCase()} encontrado`, 'Éxito');
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.status === 404) {
                setError('Ticket no encontrado. Verifique el número de ticket.');
                toastr.error('Ticket no encontrado', 'Error');
            } else {
                setError('Error al conectar con el servidor');
                toastr.error('Error al consultar el ticket', 'Error');
            }
            setTicket(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyTicket = (numeroTicket) => {
        navigator.clipboard.writeText(numeroTicket);
        toastr.success(`Ticket ${numeroTicket} copiado al portapapeles`, 'Copiado');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No registrada';
        const date = new Date(dateString);
        return date.toLocaleString('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDateOnly = (dateString) => {
        if (!dateString) return 'No registrada';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const ImageModal = ({ image, onClose }) => {
        if (!image) return null;

        return (
            <div
                className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-10"
                    >
                        <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                    </button>
                    <img
                        src={image}
                        alt="Vista ampliada"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            </div>
        );
    };

    const InfoRow = ({ label, value, icon }) => (
        <div className="flex items-start">
            <span className="text-xl mr-3">{icon}</span>
            <div className="flex-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">{label}</span>
                <span className="text-gray-800 font-medium text-lg">{value || 'N/A'}</span>
            </div>
        </div>
    );

    const TimelineItem = ({ fecha, estado, comentario, usuario, color }) => (
        <div className="flex gap-4 mb-4">
            <div className="relative">
                <div className={`w-3 h-3 rounded-full mt-1.5 ${color ? `bg-${color}-500` : 'bg-gray-400'}`}></div>
                {usuario && <div className="absolute top-4 left-1.5 w-0.5 h-full bg-gray-200"></div>}
            </div>
            <div className="flex-1 pb-4">
                <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-800">{estado}</span>
                    <span className="text-xs text-gray-500">{formatDate(fecha)}</span>
                </div>
                {comentario && <p className="text-sm text-gray-600 mt-1">{comentario}</p>}
                {usuario && <p className="text-xs text-gray-500 mt-1">por {usuario}</p>}
            </div>
        </div>
    );

    // Componente para mostrar firmas
    const FirmasSection = ({ firmas, title }) => {
        if (!firmas || firmas.length === 0) return null;

        return (
            <div className="mt-6">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faSignature} className="text-blue-600" />
                    {title || 'Firmas'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {firmas.map((firma, idx) => (
                        <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 mb-2 text-gray-700">
                                <FontAwesomeIcon icon={faUserTie} className="text-purple-600" />
                                <span className="font-medium">{firma.nombreencargado || 'Sin nombre'}</span>
                            </div>
                            {firma.tipodocumento && firma.documento && (
                                <p className="text-xs text-gray-600 mb-2">
                                    {firma.tipodocumento}: {firma.documento}
                                </p>
                            )}
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {firma.firma_tecnico && (
                                    <div className="text-center">
                                        <p className="text-xs text-gray-500 mb-1">Firma Técnico</p>
                                        <img
                                            src={firma.firma_tecnico}
                                            alt="Firma técnico"
                                            className="max-h-16 mx-auto cursor-pointer border border-gray-300 rounded"
                                            onClick={() => setModalImage(firma.firma_tecnico)}
                                        />
                                    </div>
                                )}
                                {firma.firma_cliente && (
                                    <div className="text-center">
                                        <p className="text-xs text-gray-500 mb-1">Firma Cliente</p>
                                        <img
                                            src={firma.firma_cliente}
                                            alt="Firma cliente"
                                            className="max-h-16 mx-auto cursor-pointer border border-gray-300 rounded"
                                            onClick={() => setModalImage(firma.firma_cliente)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 min-h-screen">
            {/* Modal de imagen ampliada */}
            <ImageModal image={modalImage} onClose={() => setModalImage(null)} />

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
            <div className="panel rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">🔍 Consultar Ticket</h1>
                    <p className="text-gray-600 text-lg">Ingrese el número de ticket para ver toda la información detallada</p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                                    placeholder="Ej: GKM-000001"
                                    value={ticketId}
                                    onChange={(e) => setTicketId(e.target.value.toUpperCase())}
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
                                    <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 animate-spin" />
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
                                    <button
                                        onClick={() => handleCopyTicket(ticket.numeroTicket)}
                                        className="px-3 py-1 bg-blue-500 bg-opacity-20 rounded-full text-sm font-semibold text-blue-200 hover:bg-blue-500 hover:bg-opacity-30 transition-all flex items-center gap-2 group"
                                        title="Copiar número de ticket"
                                    >
                                        #{ticket.numeroTicket}
                                        <FontAwesomeIcon icon={faCopy} className="w-3 h-3 text-blue-200 opacity-70 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                    <span className="text-gray-400">|</span>
                                    <span className="text-gray-300">{formatDate(ticket.fechaCreacion)}</span>
                                    {ticket.tieneOrdenTrabajo && (
                                        <>
                                            <span className="text-gray-400">|</span>
                                            <span className="px-3 py-1 bg-green-600 bg-opacity-30 rounded-full text-xs font-semibold text-green-300">
                                                Orden de Trabajo Creada
                                            </span>
                                        </>
                                    )}
                                </div>
                                <h2 className="text-3xl font-bold mb-2">{ticket.clienteGeneral}</h2>
                                <p className="text-gray-300 text-lg">{ticket.detallesFalla}</p>
                            </div>
                            <div>
                                <span className={`px-4 py-2 rounded-xl text-sm font-bold text-center block ${getStatusBadge(ticket.estado)}`}>
                                    {ticket.estado?.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Estadísticas rápidas */}
                        {ticket.estadisticas && (
                            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-400">{ticket.estadisticas.total_visitas}</div>
                                    <div className="text-xs text-gray-400">Visitas</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-400">{ticket.estadisticas.total_fotos}</div>
                                    <div className="text-xs text-gray-400">Fotos</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-400">{ticket.estadisticas.total_firmas}</div>
                                    <div className="text-xs text-gray-400">Firmas</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-400">{ticket.estadisticas.total_transiciones}</div>
                                    <div className="text-xs text-gray-400">Cambios</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tabs de navegación */}
                    <div className="panel rounded-xl shadow-lg p-2">
                        <div className="flex space-x-2 overflow-x-auto">
                            <button
                                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                                    activeTab === 'general' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                                onClick={() => setActiveTab('general')}
                            >
                                <FontAwesomeIcon icon={faTicket} />
                                General
                            </button>
                            {ticket.tieneOrdenTrabajo && (
                                <>
                                    <button
                                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                                            activeTab === 'flujos' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                        onClick={() => setActiveTab('flujos')}
                                    >
                                        <FontAwesomeIcon icon={faHistory} />
                                        Flujos
                                    </button>
                                    <button
                                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                                            activeTab === 'visitas' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                        onClick={() => setActiveTab('visitas')}
                                    >
                                        <FontAwesomeIcon icon={faEye} />
                                        Visitas
                                    </button>
                                    <button
                                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                                            activeTab === 'firmas' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                        onClick={() => setActiveTab('firmas')}
                                    >
                                        <FontAwesomeIcon icon={faSignature} />
                                        Firmas
                                    </button>
                                    <button
                                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                                            activeTab === 'fotos' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                        onClick={() => setActiveTab('fotos')}
                                    >
                                        <FontAwesomeIcon icon={faCamera} />
                                        Fotos Adicionales
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Contenido según tab activo */}
                    {activeTab === 'general' && (
                        <>
                            {/* Grid de Información General */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* INFORMACION DEL TICKET */}
                                <div className="panel rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b-2 border-blue-500 flex items-center gap-2">
                                        <FontAwesomeIcon icon={faTicket} className="w-6 h-6 text-blue-600" />
                                        INFORMACIÓN DEL TICKET
                                    </h3>
                                    <div className="space-y-4">
                                        <InfoRow label="Fecha Creación" value={formatDate(ticket.fechaCreacion)} icon="📅" />
                                        <InfoRow label="Fecha Compra" value={formatDateOnly(ticket.fechaCompra)} icon="📅" />
                                        <InfoRow label="Tienda de Compra" value={ticket.tiendaSedeCompra} icon="🏪" />
                                        <InfoRow label="Creado por" value={ticket.usuarioCreador} icon="👤" />
                                    </div>
                                </div>

                                {/* DATOS DEL CONTACTO */}
                                <div className="panel rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b-2 border-purple-500 flex items-center gap-2">
                                        <FontAwesomeIcon icon={faUser} className="w-6 h-6 text-purple-600" />
                                        DATOS DEL CONTACTO
                                    </h3>
                                    <div className="space-y-4">
                                        <InfoRow label="Nombre Completo" value={ticket.nombreCompleto} icon="👤" />
                                        <InfoRow label="Documento" value={`${ticket.tipoDocumento}: ${ticket.dni_ruc_ce}`} icon="🆔" />
                                        <InfoRow label="Email" value={ticket.correoElectronico} icon="📧" />
                                        <InfoRow label="Teléfonos" value={`${ticket.telefonoCelular} ${ticket.telefonoFijo ? '/ ' + ticket.telefonoFijo : ''}`} icon="📞" />
                                    </div>
                                </div>

                                {/* DIRECCIÓN */}
                                <div className="panel rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b-2 border-green-500 flex items-center gap-2">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="w-6 h-6 text-green-600" />
                                        DIRECCIÓN
                                    </h3>
                                    <div className="space-y-4">
                                        <InfoRow label="Dirección" value={ticket.direccionCompleta} icon="🏠" />
                                        <InfoRow label="Referencia" value={ticket.referenciaDomicilio || 'No registrada'} icon="📍" />
                                        <InfoRow label="Ubicación" value={`${ticket.distrito}, ${ticket.provincia}, ${ticket.departamento}`} icon="🗺️" />
                                        {ticket.ubicacionGoogleMaps && (
                                            <div className="mt-2">
                                                <a
                                                    href={ticket.ubicacionGoogleMaps}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                                >
                                                    <FontAwesomeIcon icon={faMap} className="w-3 h-3" />
                                                    Ver en Google Maps
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* PRODUCTO */}
                                <div className="panel rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b-2 border-orange-500 flex items-center gap-2">
                                        <FontAwesomeIcon icon={faLaptop} className="w-6 h-6 text-orange-600" />
                                        PRODUCTO
                                    </h3>
                                    <div className="space-y-4">
                                        <InfoRow label="Categoría" value={ticket.tipoProducto} icon="📦" />
                                        <InfoRow label="Marca" value={ticket.marca} icon="🏷️" />
                                        <InfoRow label="Modelo" value={ticket.modelo} icon="💻" />
                                        <InfoRow label="N° Serie" value={ticket.serie} icon="🔢" />
                                    </div>
                                </div>
                            </div>

                            {/* EVIDENCIAS */}
                            <div className="panel rounded-2xl shadow-xl p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b-2 border-gray-300 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faCamera} className="w-6 h-6 text-gray-600" />
                                    EVIDENCIAS
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Foto Falla */}
                                    <div className="panel p-4 rounded-xl border border-gray-200">
                                        <div className="flex items-center gap-2 mb-2 text-gray-700">
                                            <FontAwesomeIcon icon={faVideo} className="w-4 h-4 text-blue-600" />
                                            <span className="font-medium">Foto de la Falla</span>
                                        </div>
                                        {ticket.fotoVideoFalla ? (
                                            <div className="relative group cursor-pointer" onClick={() => setModalImage(ticket.fotoVideoFalla)}>
                                                <img
                                                    src={ticket.fotoVideoFalla}
                                                    alt="Falla"
                                                    className="w-full h-32 object-cover rounded-lg border border-gray-300"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                                                    <FontAwesomeIcon icon={faSearch} className="text-white opacity-0 group-hover:opacity-100 text-2xl" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <span className="text-gray-500">Sin imagen</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Foto Boleta */}
                                    <div className="panel p-4 rounded-xl border border-gray-200">
                                        <div className="flex items-center gap-2 mb-2 text-gray-700">
                                            <FontAwesomeIcon icon={faFileInvoice} className="w-4 h-4 text-green-600" />
                                            <span className="font-medium">Foto Boleta</span>
                                        </div>
                                        {ticket.fotoBoletaFactura ? (
                                            <div className="relative group cursor-pointer" onClick={() => setModalImage(ticket.fotoBoletaFactura)}>
                                                <img
                                                    src={ticket.fotoBoletaFactura}
                                                    alt="Boleta"
                                                    className="w-full h-32 object-cover rounded-lg border border-gray-300"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                                                    <FontAwesomeIcon icon={faSearch} className="text-white opacity-0 group-hover:opacity-100 text-2xl" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <span className="text-gray-500">Sin imagen</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Foto Serie */}
                                    <div className="panel p-4 rounded-xl border border-gray-200">
                                        <div className="flex items-center gap-2 mb-2 text-gray-700">
                                            <FontAwesomeIcon icon={faImage} className="w-4 h-4 text-purple-600" />
                                            <span className="font-medium">Foto Serie</span>
                                        </div>
                                        {ticket.fotoNumeroSerie ? (
                                            <div className="relative group cursor-pointer" onClick={() => setModalImage(ticket.fotoNumeroSerie)}>
                                                <img
                                                    src={ticket.fotoNumeroSerie}
                                                    alt="Serie"
                                                    className="w-full h-32 object-cover rounded-lg border border-gray-300"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                                                    <FontAwesomeIcon icon={faSearch} className="text-white opacity-0 group-hover:opacity-100 text-2xl" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <span className="text-gray-500">Sin imagen</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}


                    {/* Tab de Flujos */}
                    {activeTab === 'flujos' && ticket.flujos && ticket.flujos.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b-2 border-purple-500 flex items-center gap-2">
                                <FontAwesomeIcon icon={faHistory} className="w-6 h-6 text-purple-600" />
                                HISTORIAL DE FLUJOS ({ticket.flujos.length})
                            </h3>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {ticket.flujos.map((flujo, index) => (
                                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoOTBadge(flujo.color)}`}>
                                                    {flujo.estado || 'Sin estado'}
                                                </span>
                                                <p className="text-sm text-gray-600 mt-2">{flujo.comentario || 'Sin comentario'}</p>
                                            </div>
                                            <span className="text-xs text-gray-500">{formatDate(flujo.fecha_creacion)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tab de Visitas */}
                    {activeTab === 'visitas' && ticket.visitas && ticket.visitas.length > 0 && (
                        <div className="space-y-6">
                            {ticket.visitas.map((visita, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-xl p-6">
                                    <div
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={() => setExpandedVisita(expandedVisita === index ? null : index)}
                                    >
                                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                            <FontAwesomeIcon icon={faEye} className="text-green-600" />
                                            Visita: {visita.nombre || `Visita #${index + 1}`}
                                        </h3>
                                        <FontAwesomeIcon
                                            icon={expandedVisita === index ? faTimes : faEye}
                                            className="text-gray-500"
                                        />
                                    </div>

                                    {expandedVisita === index && (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                                <div>
                                                    <InfoRow label="Fecha Programada" value={formatDate(visita.fecha_programada)} icon="📅" />
                                                    <InfoRow label="Fecha Llegada" value={formatDate(visita.fecha_llegada)} icon="📅" />
                                                </div>
                                                <div>

                                                    <InfoRow label="Necesita Apoyo" value={visita.necesita_apoyo ? 'Sí' : 'No'} icon="🤝" />
                                                    <InfoRow label="Recojo" value={visita.recojo ? 'Sí' : 'No'} icon="📦" />
                                                    {visita.celularcliente && (
                                                        <InfoRow label="Celular Cliente" value={visita.celularcliente} icon="📱" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Anexos de la visita */}
                                            {visita.anexos && visita.anexos.length > 0 && (
                                                <div className="mt-4">
                                                    <h4 className="font-semibold text-gray-700 mb-2">Anexos de la Visita ({visita.anexos.length})</h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        {visita.anexos.map((anexo, idx) => (
                                                            <div key={idx} className="relative group">
                                                                {anexo.foto ? (
                                                                    <img
                                                                        src={anexo.foto}
                                                                        alt={anexo.descripcion || 'Anexo'}
                                                                        className="w-full h-24 object-cover rounded-lg cursor-pointer border border-gray-300"
                                                                        onClick={() => setModalImage(anexo.foto)}
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                                                        <span className="text-gray-500 text-xs">Sin foto</span>
                                                                    </div>
                                                                )}
                                                                {anexo.descripcion && (
                                                                    <p className="text-xs text-gray-600 mt-1 truncate">{anexo.descripcion}</p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Firmas de la visita */}
                                            {visita.firmas && visita.firmas.length > 0 && (
                                                <FirmasSection firmas={visita.firmas} title={`Firmas de la Visita (${visita.firmas.length})`} />
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Tab de Firmas */}
                    {activeTab === 'firmas' && (
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b-2 border-purple-500 flex items-center gap-2">
                                <FontAwesomeIcon icon={faSignature} className="w-6 h-6 text-purple-600" />
                                FIRMAS DEL TICKET
                            </h3>

                            {ticket.firmas && ticket.firmas.length > 0 ? (
                                <div className="space-y-6">
                                    {ticket.firmas.map((firma, idx) => (
                                        <div key={idx} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <InfoRow label="Nombre del Encargado" value={firma.nombreencargado} icon="👤" />
                                                    {firma.tipodocumento && firma.documento && (
                                                        <InfoRow
                                                            label="Documento"
                                                            value={`${firma.tipodocumento}: ${firma.documento}`}
                                                            icon="🆔"
                                                        />
                                                    )}
                                                    {firma.idVisitas > 0 && (
                                                        <InfoRow label="ID Visita" value={firma.idVisitas} icon="👁️" />
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {firma.firma_tecnico && (
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700 mb-2">Firma del Técnico</p>
                                                            <img
                                                                src={firma.firma_tecnico}
                                                                alt="Firma técnico"
                                                                className="max-h-24 border border-gray-300 rounded cursor-pointer"
                                                                onClick={() => setModalImage(firma.firma_tecnico)}
                                                            />
                                                        </div>
                                                    )}
                                                    {firma.firma_cliente && (
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700 mb-2">Firma del Cliente</p>
                                                            <img
                                                                src={firma.firma_cliente}
                                                                alt="Firma cliente"
                                                                className="max-h-24 border border-gray-300 rounded cursor-pointer"
                                                                onClick={() => setModalImage(firma.firma_cliente)}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <FontAwesomeIcon icon={faSignature} className="w-12 h-12 mb-3 text-gray-400" />
                                    <p>No hay firmas registradas para este ticket</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab de Fotos Adicionales */}
                    {activeTab === 'fotos' && (
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b-2 border-green-500 flex items-center gap-2">
                                <FontAwesomeIcon icon={faCamera} className="w-6 h-6 text-green-600" />
                                FOTOS ADICIONALES DEL TICKET
                            </h3>

                            {ticket.fotosTicket && ticket.fotosTicket.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {ticket.fotosTicket.map((foto, idx) => (
                                        <div key={idx} className="relative group">
                                            {foto.foto ? (
                                                <>
                                                    <img
                                                        src={foto.foto}
                                                        alt={foto.descripcion || 'Foto adicional'}
                                                        className="w-full h-32 object-cover rounded-lg cursor-pointer border border-gray-300"
                                                        onClick={() => setModalImage(foto.foto)}
                                                    />
                                                    {foto.idVisitas > 0 && (
                                                        <span className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1 rounded">
                                                            V{foto.idVisitas}
                                                        </span>
                                                    )}
                                                    {foto.descripcion && (
                                                        <p className="text-xs text-gray-600 mt-1 truncate">{foto.descripcion}</p>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    <span className="text-gray-500 text-xs">Sin imagen</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <FontAwesomeIcon icon={faCamera} className="w-12 h-12 mb-3 text-gray-400" />
                                    <p>No hay fotos adicionales para este ticket</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Botones de Acción */}
                    <div className="flex justify-end gap-4 mt-8">
                        <button
                            className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                            onClick={() => toastr.info('Generando PDF...', 'PDF')}
                        >
                            <FontAwesomeIcon icon={faFilePdf} className="w-5 h-5" />
                            GENERAR PDF
                        </button>
                        <button
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                            onClick={() => toastr.success('Ticket exportado correctamente', 'Exportar')}
                        >
                            <FontAwesomeIcon icon={faDownload} className="w-5 h-5" />
                            EXPORTAR
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConsultarTicket;
