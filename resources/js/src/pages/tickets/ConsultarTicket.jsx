import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTicket,
    faSearch,
    faFilePdf,
    faFileWord,
    faFile,
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
    faExternalLinkAlt,
    faHourglassHalf,
} from '@fortawesome/free-solid-svg-icons';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import axios from 'axios';

// Constantes para los estados
const ESTADOS = {
    PENDIENTE_ACEPTAR: 1,
    GESTIONANDO: 2,
    FINALIZADO: 3
};

const ESTADO_CONFIG = {
    [ESTADOS.PENDIENTE_ACEPTAR]: {
        nombre: 'Pendiente por Aceptar',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: faHourglassHalf,
        badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    [ESTADOS.GESTIONANDO]: {
        nombre: 'Gestionando',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: faTools,
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    [ESTADOS.FINALIZADO]: {
        nombre: 'Finalizado',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: faCheckDouble,
        badgeColor: 'bg-green-100 text-green-800 border-green-200'
    }
};

const ConsultarTicket = () => {
    const [ticketId, setTicketId] = useState('');
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [modalFile, setModalFile] = useState(null);
    const [modalFileType, setModalFileType] = useState(null);
    const [activeTab, setActiveTab] = useState('general');
    const [expandedVisita, setExpandedVisita] = useState(null);
    const [generatingPdf, setGeneratingPdf] = useState(null);

    const API_URL = 'http://127.0.0.1:8000/api';
    const PDF_API_URL = 'http://127.0.0.1:5000';

    // Configurar toastr
    toastr.options = {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-right',
        timeOut: 3000,
        showDuration: 300,
        hideDuration: 500,
    };

    // Función para generar PDF - Abre en nueva pestaña sin usar axios
    const handleGenerarPDF = (idTickets, idVisitas, visitaNombre) => {
        if (!idTickets) {
            toastr.error('No se encontró el ID del ticket', 'Error');
            return;
        }

        if (!idVisitas) {
            toastr.error('No se encontró el ID de la visita', 'Error');
            return;
        }

        setGeneratingPdf(idVisitas);
        
        try {
            const url = `${PDF_API_URL}/ordenes/smart/informe/${idTickets}/visita/${idVisitas}/pdf`;
            console.log('Abriendo PDF en nueva pestaña:', url);
            window.open(url, '_blank');
            toastr.success(`PDF de la visita "${visitaNombre}" abierto en nueva pestaña`, 'Éxito');
        } catch (error) {
            console.error('Error al abrir PDF:', error);
            toastr.error('Error al abrir el PDF. Intente nuevamente.', 'Error');
        } finally {
            setTimeout(() => {
                setGeneratingPdf(null);
            }, 500);
        }
    };

    // Función para manejar la visualización del archivo
    const handleFilePreview = (fileUrl) => {
        if (!fileUrl) return;
        
        if (isImageFile(fileUrl)) {
            setModalFile(fileUrl);
            setModalFileType('image');
        } else {
            window.open(fileUrl, '_blank');
        }
    };

    // Función para determinar si una URL es una imagen
    const isImageFile = (url) => {
        if (!url) return false;
        if (url.startsWith('data:image/')) return true;
        const urlWithoutParams = url.split('?')[0];
        const extension = urlWithoutParams.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension);
    };

    // Función para determinar si es un PDF
    const isPdfFile = (url) => {
        if (!url) return false;
        if (url.startsWith('data:application/pdf')) return true;
        const urlWithoutParams = url.split('?')[0];
        const extension = urlWithoutParams.split('.').pop()?.toLowerCase();
        return extension === 'pdf';
    };

    // Función para determinar si es un documento Word
    const isWordFile = (url) => {
        if (!url) return false;
        if (url.startsWith('data:application/msword') || url.startsWith('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            return true;
        }
        const urlWithoutParams = url.split('?')[0];
        const extension = urlWithoutParams.split('.').pop()?.toLowerCase();
        return extension === 'doc' || extension === 'docx';
    };

    // Función para obtener el icono según el tipo de archivo
    const getFileIcon = (url) => {
        if (!url) return faFile;
        if (isImageFile(url)) return faImage;
        if (isPdfFile(url)) return faFilePdf;
        if (isWordFile(url)) return faFileWord;
        return faFile;
    };

    // Función para obtener el color del icono
    const getFileIconColor = (url) => {
        if (!url) return 'text-gray-500';
        if (isImageFile(url)) return 'text-green-500';
        if (isPdfFile(url)) return 'text-red-500';
        if (isWordFile(url)) return 'text-blue-500';
        return 'text-gray-500';
    };

    // Función para obtener el texto del tipo de archivo
    const getFileTypeText = (url) => {
        if (!url) return 'Archivo';
        if (isImageFile(url)) return 'Imagen';
        if (isPdfFile(url)) return 'Documento PDF';
        if (isWordFile(url)) return 'Documento Word';
        return 'Archivo';
    };

    // Función para obtener el nombre del archivo
    const getFileName = (url) => {
        if (!url) return 'archivo';
        if (url.startsWith('data:')) {
            if (isImageFile(url)) return 'imagen.jpg';
            if (isPdfFile(url)) return 'documento.pdf';
            if (isWordFile(url)) return 'documento.docx';
            return 'archivo';
        }
        const urlWithoutParams = url.split('?')[0];
        return urlWithoutParams.split('/').pop() || 'archivo';
    };

    // Función para obtener el badge de estado
    const getStatusBadge = (estado) => {
        let estadoValor;
        
        if (typeof estado === 'number') {
            estadoValor = estado;
        } else if (typeof estado === 'string') {
            if (estado === 'pendiente por aceptar') estadoValor = ESTADOS.PENDIENTE_ACEPTAR;
            else if (estado === 'gestionando') estadoValor = ESTADOS.GESTIONANDO;
            else if (estado === 'finalizado') estadoValor = ESTADOS.FINALIZADO;
            else estadoValor = ESTADOS.PENDIENTE_ACEPTAR;
        } else {
            estadoValor = ESTADOS.PENDIENTE_ACEPTAR;
        }

        const config = ESTADO_CONFIG[estadoValor] || ESTADO_CONFIG[ESTADOS.PENDIENTE_ACEPTAR];
        return config.color;
    };

    // Función para obtener el texto del estado
    const getEstadoTexto = (estado) => {
        let estadoValor;
        
        if (typeof estado === 'number') {
            estadoValor = estado;
        } else if (typeof estado === 'string') {
            if (estado === 'pendiente por aceptar') estadoValor = ESTADOS.PENDIENTE_ACEPTAR;
            else if (estado === 'gestionando') estadoValor = ESTADOS.GESTIONANDO;
            else if (estado === 'finalizado') estadoValor = ESTADOS.FINALIZADO;
            else estadoValor = ESTADOS.PENDIENTE_ACEPTAR;
        } else {
            estadoValor = ESTADOS.PENDIENTE_ACEPTAR;
        }

        const config = ESTADO_CONFIG[estadoValor] || ESTADO_CONFIG[ESTADOS.PENDIENTE_ACEPTAR];
        return config.nombre;
    };

    // Función para obtener el icono del estado
    const getEstadoIcono = (estado) => {
        let estadoValor;
        
        if (typeof estado === 'number') {
            estadoValor = estado;
        } else if (typeof estado === 'string') {
            if (estado === 'pendiente por aceptar') estadoValor = ESTADOS.PENDIENTE_ACEPTAR;
            else if (estado === 'gestionando') estadoValor = ESTADOS.GESTIONANDO;
            else if (estado === 'finalizado') estadoValor = ESTADOS.FINALIZADO;
            else estadoValor = ESTADOS.PENDIENTE_ACEPTAR;
        } else {
            estadoValor = ESTADOS.PENDIENTE_ACEPTAR;
        }

        const config = ESTADO_CONFIG[estadoValor] || ESTADO_CONFIG[ESTADOS.PENDIENTE_ACEPTAR];
        return config.icon;
    };

    const getEstadoOTBadge = (color) => {
        const colores = {
            rojo: 'bg-red-100 text-red-800 border-red-200',
            verde: 'bg-green-100 text-green-800 border-green-200',
            amarillo: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            azul: 'bg-blue-100 text-blue-800 border-blue-200',
            morado: 'bg-purple-100 text-purple-800 border-purple-200',
            naranja: 'bg-orange-100 text-orange-800 border-orange-200',
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
                    Authorization: token ? `Bearer ${token}` : '',
                    Accept: 'application/json',
                },
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
            minute: '2-digit',
        });
    };

    const formatDateOnly = (dateString) => {
        if (!dateString) return 'No registrada';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    // Modal para archivos
    const FileModal = ({ file, fileType, onClose }) => {
        if (!file) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={onClose}>
                <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-10"
                    >
                        <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                    </button>
                    {fileType === 'image' ? (
                        <img src={file} alt="Vista ampliada" className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full text-center">
                            <FontAwesomeIcon icon={faFilePdf} className="w-24 h-24 text-red-500 mx-auto mb-4" />
                            <p className="text-gray-800 dark:text-white mb-4">Este archivo no se puede previsualizar</p>
                            <a
                                href={file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary inline-flex items-center gap-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <FontAwesomeIcon icon={faDownload} />
                                Descargar Archivo
                            </a>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Componente para renderizar un archivo
    const FileRenderer = ({ fileUrl, label, icon }) => {
        if (!fileUrl) {
            return (
                <div className="panel p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 mb-2 text-gray-700">
                        <FontAwesomeIcon icon={icon} className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{label}</span>
                    </div>
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">Sin archivo</span>
                    </div>
                </div>
            );
        }

        const isImage = isImageFile(fileUrl);
        const fileIcon = getFileIcon(fileUrl);
        const iconColor = getFileIconColor(fileUrl);
        const fileTypeText = getFileTypeText(fileUrl);
        const fileName = getFileName(fileUrl);

        if (isImage) {
            return (
                <div className="panel p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 mb-2 text-gray-700">
                        <FontAwesomeIcon icon={icon} className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{label}</span>
                    </div>
                    <div className="relative group cursor-pointer" onClick={() => handleFilePreview(fileUrl)}>
                        <img src={fileUrl} alt={label} className="w-full h-32 object-cover rounded-lg border border-gray-300" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon icon={faSearch} className="text-white opacity-0 group-hover:opacity-100 text-2xl" />
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="panel p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 mb-2 text-gray-700">
                        <FontAwesomeIcon icon={icon} className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{label}</span>
                    </div>
                    <div 
                        className="relative group cursor-pointer w-full h-32 bg-gray-100 rounded-lg flex flex-col items-center justify-center hover:bg-gray-200 transition-colors border border-gray-300"
                        onClick={() => handleFilePreview(fileUrl)}
                    >
                        <FontAwesomeIcon icon={fileIcon} className={`w-8 h-8 ${iconColor} mb-2`} />
                        <p className="text-xs text-gray-600 text-center px-2 truncate max-w-full" title={fileName}>{fileName}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{fileTypeText}</p>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon icon={faExternalLinkAlt} className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                </div>
            );
        }
    };

    // Componente para renderizar un anexo en la visita
    const AnexoRenderer = ({ anexo }) => {
        if (!anexo.foto) {
            return (
                <div className="w-full h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Sin archivo</span>
                </div>
            );
        }

        const isImage = isImageFile(anexo.foto);
        const fileIcon = getFileIcon(anexo.foto);
        const iconColor = getFileIconColor(anexo.foto);
        const fileTypeText = getFileTypeText(anexo.foto);
        const fileName = getFileName(anexo.foto);

        if (isImage) {
            return (
                <div className="relative group">
                    <img
                        src={anexo.foto}
                        alt={anexo.descripcion || 'Anexo'}
                        className="w-full h-24 object-cover rounded-lg cursor-pointer border border-gray-300"
                        onClick={() => handleFilePreview(anexo.foto)}
                    />
                    {anexo.descripcion && (
                        <p className="text-xs text-gray-600 mt-1 truncate">{anexo.descripcion}</p>
                    )}
                </div>
            );
        } else {
            return (
                <div 
                    className="w-full h-24 bg-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors border border-gray-300"
                    onClick={() => handleFilePreview(anexo.foto)}
                >
                    <FontAwesomeIcon icon={fileIcon} className={`w-8 h-8 ${iconColor} mb-1`} />
                    <p className="text-[10px] text-gray-500 text-center px-1 truncate max-w-full">{fileName}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">{fileTypeText}</p>
                    {anexo.descripcion && (
                        <p className="text-[9px] text-gray-500 mt-1 truncate max-w-full">{anexo.descripcion}</p>
                    )}
                </div>
            );
        }
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

    return (
        <div className="p-6 min-h-screen">
            {/* Modal de archivo ampliado */}
            <FileModal file={modalFile} fileType={modalFileType} onClose={() => setModalFile(null)} />

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
                                            <span className="px-3 py-1 bg-green-600 bg-opacity-30 rounded-full text-xs font-semibold text-green-300">Orden de Trabajo Creada</span>
                                        </>
                                    )}
                                </div>
                                <h2 className="text-3xl font-bold mb-2">{ticket.clienteGeneral}</h2>
                                <p className="text-gray-300 text-lg">{ticket.detallesFalla}</p>
                            </div>
                            <div>
                                <span className={`px-4 py-2 rounded-xl text-sm font-bold text-center block ${getStatusBadge(ticket.estado)}`}>
                                    <FontAwesomeIcon icon={getEstadoIcono(ticket.estado)} className="w-4 h-4 mr-2" />
                                    {getEstadoTexto(ticket.estado)}
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

                    {/* Tabs de navegación - ELIMINAMOS EL TAB DE FOTOS ADICIONALES */}
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
                                </>
                            )}
                        </div>
                    </div>

                    {/* Contenido según tab activo */}
                    {activeTab === 'general' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                            <div className="panel rounded-2xl shadow-xl p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b-2 border-gray-300 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faCamera} className="w-6 h-6 text-gray-600" />
                                    EVIDENCIAS
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FileRenderer fileUrl={ticket.fotoVideoFalla} label="Evidencia de la Falla" icon={faVideo} />
                                    <FileRenderer fileUrl={ticket.fotoBoletaFactura} label="Boleta/Factura" icon={faFileInvoice} />
                                    <FileRenderer fileUrl={ticket.fotoNumeroSerie} label="Número de Serie" icon={faImage} />
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
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoOTBadge(flujo.color)}`}>{flujo.estado || 'Sin estado'}</span>
                                                <p className="text-sm text-gray-600 mt-2">{flujo.comentario || 'Sin comentario'}</p>
                                            </div>
                                            <span className="text-xs text-gray-500">{formatDate(flujo.fecha_creacion)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tab de Visitas - CON BOTÓN GENERAR PDF Y FOTOS ADICIONALES DENTRO DE CADA VISITA */}
                    {activeTab === 'visitas' && ticket.visitas && ticket.visitas.length > 0 && (
                        <div className="space-y-6">
                            {ticket.visitas.map((visita, index) => {
                                const idTickets = ticket.ordenTrabajo?.idTickets;
                                const idVisitas = visita.id;
                                const visitaNombre = visita.nombre || `Visita #${index + 1}`;
                                
                                // Filtrar las fotos adicionales que pertenecen a esta visita
                                const fotosDeEstaVisita = ticket.fotosTicket?.filter(foto => foto.idVisitas === idVisitas) || [];
                                
                                return (
                                    <div key={index} className="bg-white rounded-2xl shadow-xl p-6">
                                        <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedVisita(expandedVisita === index ? null : index)}>
                                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                                <FontAwesomeIcon icon={faEye} className="text-green-600" />
                                                Visita: {visitaNombre}
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleGenerarPDF(idTickets, idVisitas, visitaNombre);
                                                    }}
                                                    disabled={generatingPdf === idVisitas}
                                                    className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Abrir PDF de esta visita"
                                                >
                                                    {generatingPdf === idVisitas ? (
                                                        <>
                                                            <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                                                            Abriendo...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FontAwesomeIcon icon={faFilePdf} className="w-4 h-4" />
                                                            Ver PDF
                                                        </>
                                                    )}
                                                </button>
                                                <FontAwesomeIcon icon={expandedVisita === index ? faTimes : faEye} className="text-gray-500" />
                                            </div>
                                        </div>

                                        {expandedVisita === index && (
                                            <>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                                    <div>
                                                        <InfoRow label="ID Visita" value={idVisitas} icon="🔢" />
                                                        <InfoRow label="Fecha Programada" value={formatDate(visita.fecha_programada)} icon="📅" />
                                                        <InfoRow label="Fecha Llegada" value={formatDate(visita.fecha_llegada)} icon="📅" />
                                                    </div>
                                                    <div>
                                                        <InfoRow label="Necesita Apoyo" value={visita.necesita_apoyo ? 'Sí' : 'No'} icon="🤝" />
                                                        <InfoRow label="Recojo" value={visita.recojo ? 'Sí' : 'No'} icon="📦" />
                                                        {visita.celularcliente && <InfoRow label="Celular Cliente" value={visita.celularcliente} icon="📱" />}
                                                    </div>
                                                </div>

                                                {/* Anexos de la visita */}
                                                {visita.anexos && visita.anexos.length > 0 && (
                                                    <div className="mt-4">
                                                        <h4 className="font-semibold text-gray-700 mb-2">Anexos de la Visita ({visita.anexos.length})</h4>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                            {visita.anexos.map((anexo, idx) => (
                                                                <div key={idx}>
                                                                    <AnexoRenderer anexo={anexo} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Fotos adicionales de esta visita */}
                                                {fotosDeEstaVisita.length > 0 && (
                                                    <div className="mt-4">
                                                        <h4 className="font-semibold text-gray-700 mb-2">Fotos Adicionales de la Visita ({fotosDeEstaVisita.length})</h4>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                            {fotosDeEstaVisita.map((foto, idx) => (
                                                                <div key={idx} className="relative group">
                                                                    {foto.foto ? (
                                                                        isImageFile(foto.foto) ? (
                                                                            <>
                                                                                <img
                                                                                    src={foto.foto}
                                                                                    alt={foto.descripcion || 'Archivo adicional'}
                                                                                    className="w-full h-24 object-cover rounded-lg cursor-pointer border border-gray-300"
                                                                                    onClick={() => handleFilePreview(foto.foto)}
                                                                                />
                                                                                {foto.descripcion && <p className="text-xs text-gray-600 mt-1 truncate">{foto.descripcion}</p>}
                                                                            </>
                                                                        ) : (
                                                                            <div 
                                                                                className="w-full h-24 bg-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors border border-gray-300"
                                                                                onClick={() => handleFilePreview(foto.foto)}
                                                                            >
                                                                                <FontAwesomeIcon icon={getFileIcon(foto.foto)} className={`w-8 h-8 ${getFileIconColor(foto.foto)} mb-1`} />
                                                                                <p className="text-[10px] text-gray-500 text-center px-1 truncate max-w-full">{getFileName(foto.foto)}</p>
                                                                                <p className="text-[9px] text-gray-400 mt-0.5">{getFileTypeText(foto.foto)}</p>
                                                                                {foto.descripcion && <p className="text-[9px] text-gray-500 mt-1 truncate max-w-full">{foto.descripcion}</p>}
                                                                            </div>
                                                                        )
                                                                    ) : (
                                                                        <div className="w-full h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                                                            <span className="text-gray-500 text-xs">Sin archivo</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ConsultarTicket;