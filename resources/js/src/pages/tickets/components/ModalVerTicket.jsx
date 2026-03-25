import React, { Fragment, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTicket,
    faTimes,
    faTag,
    faLaptop,
    faHashtag,
    faComment,
    faCalendarAlt,
    faCheckDouble,
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
    faStore,
    faCamera,
    faVideo,
    faFileInvoice,
    faImage,
    faMap,
    faSearch,
    faSearchLocation,
    faTools,
    faMapPin,
    faFilePdf,
    faFileWord,
    faFile,
    faDownload,
    faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';

const ModalVerTicket = ({ modal, setModal, ticketData }) => {
    const [modalFile, setModalFile] = useState(null);
    const [modalFileType, setModalFileType] = useState(null);
    const [departamentos, setDepartamentos] = useState([]);
    const [provincias, setProvincias] = useState({});
    const [distritos, setDistritos] = useState({});
    const [loadingUbigeo, setLoadingUbigeo] = useState(true);

    // Cargar datos de ubigeo cuando se abre el modal
    useEffect(() => {
        if (modal && ticketData) {
            cargarUbigeos();
        }
    }, [modal, ticketData]);

    // Cargar ubigeos
    const cargarUbigeos = async () => {
        setLoadingUbigeo(true);
        try {
            const deptosResponse = await fetch('/assets/ubigeos/departamentos.json');
            const deptosData = await deptosResponse.json();
            setDepartamentos(deptosData);

            const provsResponse = await fetch('/assets/ubigeos/provincias.json');
            const provsData = await provsResponse.json();
            setProvincias(provsData);

            const distsResponse = await fetch('/assets/ubigeos/distritos.json');
            const distsData = await distsResponse.json();
            setDistritos(distsData);
        } catch (error) {
            console.error('Error cargando ubigeos:', error);
        } finally {
            setLoadingUbigeo(false);
        }
    };

    // Función para formatear fecha
    const formatearFecha = (fecha) => {
        if (!fecha) return 'No registrada';
        try {
            const date = new Date(fecha);
            return date.toLocaleDateString('es-PE', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
        } catch (e) {
            return fecha;
        }
    };

    // Función para obtener nombre del departamento
    const getDepartamentoNombre = (id) => {
        if (!id || !departamentos.length) return id || 'N/A';
        const depto = departamentos.find((d) => d.id_ubigeo === id);
        return depto ? depto.nombre_ubigeo : id;
    };

    // Función para obtener nombre de la provincia
    const getProvinciaNombre = (id) => {
        if (!id || !provincias || Object.keys(provincias).length === 0) return id || 'N/A';

        for (const key in provincias) {
            const provincia = provincias[key].find((p) => p.id_ubigeo === id);
            if (provincia) return provincia.nombre_ubigeo;
        }
        return id;
    };

    // Función para obtener nombre del distrito
    const getDistritoNombre = (id) => {
        if (!id || !distritos || Object.keys(distritos).length === 0) return id || 'N/A';

        for (const key in distritos) {
            const distrito = distritos[key].find((d) => d.id_ubigeo === id);
            if (distrito) return distrito.nombre_ubigeo;
        }
        return id;
    };

    // ============================================
    // FUNCIONES PARA MANEJO DE ARCHIVOS
    // ============================================

    // Función para obtener el icono según el tipo de archivo
    const getFileIcon = (fileUrl) => {
        if (!fileUrl) return faFile;
        
        const extension = fileUrl.split('.').pop()?.toLowerCase();
        
        if (extension === 'pdf') return faFilePdf;
        if (extension === 'doc' || extension === 'docx') return faFileWord;
        if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif') return faImage;
        return faFile;
    };

    // Función para obtener el color del icono según el tipo de archivo
    const getFileIconColor = (fileUrl) => {
        if (!fileUrl) return 'text-gray-500';
        
        const extension = fileUrl.split('.').pop()?.toLowerCase();
        
        if (extension === 'pdf') return 'text-red-500';
        if (extension === 'doc' || extension === 'docx') return 'text-blue-500';
        if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif') return 'text-green-500';
        return 'text-gray-500';
    };

    // Función para obtener el texto del tipo de archivo
    const getFileTypeText = (fileUrl) => {
        if (!fileUrl) return 'Archivo';
        
        const extension = fileUrl.split('.').pop()?.toUpperCase();
        
        if (extension === 'PDF') return 'Documento PDF';
        if (extension === 'DOC' || extension === 'DOCX') return 'Documento Word';
        if (extension === 'JPG' || extension === 'JPEG') return 'Imagen JPG';
        if (extension === 'PNG') return 'Imagen PNG';
        if (extension === 'GIF') return 'Imagen GIF';
        return `Archivo ${extension}`;
    };

    // Función para obtener el nombre del archivo desde la URL
    const getFileName = (fileUrl) => {
        if (!fileUrl) return 'archivo';
        return fileUrl.split('/').pop() || 'archivo';
    };

    // Función para determinar si es una imagen
    const isImageFile = (fileUrl) => {
        if (!fileUrl) return false;
        const extension = fileUrl.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif'].includes(extension);
    };

    // Función para manejar la visualización del archivo
    const handleFilePreview = (fileUrl) => {
        if (!fileUrl) return;
        
        if (isImageFile(fileUrl)) {
            setModalFile(fileUrl);
            setModalFileType('image');
        } else {
            // Para PDFs y documentos, abrir en nueva pestaña
            window.open(fileUrl, '_blank');
        }
    };

    // Función para obtener el badge de estado
    const getStatusBadge = (estado) => {
        const statusConfig = {
            evaluando: {
                color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
                icon: faSearchLocation,
                text: 'Evaluando',
            },
            gestionando: {
                color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
                icon: faTools,
                text: 'Gestionando',
            },
            finalizado: {
                color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                icon: faCheckDouble,
                text: 'Finalizado',
            },
        };

        const config = statusConfig[estado] || statusConfig.evaluando;

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                <FontAwesomeIcon icon={config.icon} className="w-3 h-3" />
                {config.text}
            </span>
        );
    };

    // Modal para ver archivo ampliado (imagen o documento)
    const FileModal = ({ file, fileType, onClose }) => {
        if (!file) return null;

        return ReactDOM.createPortal(
            <div 
                className="fixed inset-0 bg-black bg-opacity-75 z-[10000] flex items-center justify-center p-4"
                onClick={onClose}
            >
                <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="absolute top-4 right-4 bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-10"
                    >
                        <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                    </button>
                    {fileType === 'image' ? (
                        <img
                            src={file}
                            alt="Vista ampliada"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/800x600/cccccc/000?text=Error+al+cargar+imagen';
                            }}
                        />
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
            </div>,
            document.body
        );
    };

    // Componente para renderizar un archivo
    const FileRenderer = ({ fileUrl, label, icon, emptyMessage = 'Sin archivo' }) => {
        if (!fileUrl) {
            return (
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                        <FontAwesomeIcon icon={icon} className="w-3 h-3" />
                        <span className="text-xs font-medium">{label}</span>
                    </div>
                    <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-500">{emptyMessage}</span>
                    </div>
                </div>
            );
        }

        const isImage = isImageFile(fileUrl);
        const fileIcon = getFileIcon(fileUrl);
        const iconColor = getFileIconColor(fileUrl);
        const fileTypeText = getFileTypeText(fileUrl);
        const fileName = getFileName(fileUrl);

        return (
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <FontAwesomeIcon icon={icon} className="w-3 h-3" />
                    <span className="text-xs font-medium">{label}</span>
                </div>
                {isImage ? (
                    <div className="relative group">
                        <img
                            src={fileUrl}
                            alt={label}
                            className="w-full h-24 object-cover rounded-lg cursor-pointer border border-gray-200 dark:border-gray-700"
                            onClick={() => handleFilePreview(fileUrl)}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/300x200/cccccc/000?text=Error+al+cargar';
                            }}
                        />
                        <div
                            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center cursor-pointer"
                            onClick={() => handleFilePreview(fileUrl)}
                        >
                            <div className="bg-white bg-opacity-90 rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-700 shadow-lg">
                                <FontAwesomeIcon icon={faSearch} className="w-2 h-2 mr-1" />
                                Ampliar
                            </div>
                        </div>
                    </div>
                ) : (
                    <div 
                        className="relative group w-full h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-700"
                        onClick={() => handleFilePreview(fileUrl)}
                    >
                        <FontAwesomeIcon icon={fileIcon} className={`w-8 h-8 ${iconColor} mb-1`} />
                        <p className="text-xs text-gray-600 dark:text-gray-300 text-center px-2 truncate max-w-full">{fileName}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{fileTypeText}</p>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                            <div className="bg-white bg-opacity-90 rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-700 shadow-lg">
                                <FontAwesomeIcon icon={faExternalLinkAlt} className="w-2 h-2 mr-1" />
                                Abrir
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (!ticketData) return null;

    return (
        <>
            {/* Modal de archivo ampliado */}
            <FileModal file={modalFile} fileType={modalFileType} onClose={() => setModalFile(null)} />

            <Transition appear show={modal} as={Fragment}>
                <Dialog 
                    as="div" 
                    open={modal} 
                    onClose={() => {
                        if (!modalFile) {
                            setModal(false);
                        }
                    }}
                >
                    <Transition.Child 
                        as={Fragment} 
                        enter="ease-out duration-300" 
                        enterFrom="opacity-0" 
                        enterTo="opacity-100" 
                        leave="ease-in duration-200" 
                        leaveFrom="opacity-100" 
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-start justify-center min-h-screen px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-3xl text-black dark:text-white-dark">
                                    {/* Header */}
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                                                <FontAwesomeIcon icon={faTicket} className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="text-lg font-bold">Detalle del Ticket</div>
                                        </div>
                                        <button 
                                            type="button" 
                                            className="text-white-dark hover:text-dark transition-colors" 
                                            onClick={() => setModal(false)}
                                        >
                                            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Cuerpo del modal */}
                                    <div className="p-5 max-h-[80vh] overflow-y-auto">
                                        {/* Estado y N° Ticket */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">Ticket #</span>
                                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{ticketData.numeroTicket}</h2>
                                            </div>
                                            {getStatusBadge(ticketData.estado)}
                                        </div>

                                        {/* DATOS DEL CLIENTE */}
                                        <div className="border-l-4 border-primary pl-4 mb-4">
                                            <h3 className="text-md font-semibold flex items-center gap-2">
                                                <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-primary" />
                                                Datos del Cliente
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Nombre Completo</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{ticketData.nombreCompleto}</p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faIdCard} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Documento</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                                    {ticketData.tipoDocumento}: {ticketData.dni_ruc_ce}
                                                </p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Correo Electrónico</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{ticketData.correoElectronico}</p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faPhone} className="w-3 h-3" />
                                                    <FontAwesomeIcon icon={faMobile} className="w-3 h-3 ml-1" />
                                                    <span className="text-xs font-medium">Teléfonos</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                                    {ticketData.telefonoCelular} {ticketData.telefonoFijo && ` / ${ticketData.telefonoFijo}`}
                                                </p>
                                            </div>
                                        </div>

                                        {/* DIRECCIÓN */}
                                        <div className="border-l-4 border-primary pl-4 mb-4">
                                            <h3 className="text-md font-semibold flex items-center gap-2">
                                                <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 text-primary" />
                                                Dirección
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg md:col-span-2">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faHome} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Dirección Completa</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{ticketData.direccionCompleta}</p>
                                            </div>

                                            {ticketData.referenciaDomicilio && (
                                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg md:col-span-2">
                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                        <FontAwesomeIcon icon={faRoad} className="w-3 h-3" />
                                                        <span className="text-xs font-medium">Referencia</span>
                                                    </div>
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{ticketData.referenciaDomicilio}</p>
                                                </div>
                                            )}

                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faGlobe} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Departamento</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{getDepartamentoNombre(ticketData.departamento)}</p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faBuilding} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Provincia</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{getProvinciaNombre(ticketData.provincia)}</p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faCity} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Distrito</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{getDistritoNombre(ticketData.distrito)}</p>
                                            </div>
                                        </div>

                                        {/* DATOS DEL PRODUCTO */}
                                        <div className="border-l-4 border-primary pl-4 mb-4">
                                            <h3 className="text-md font-semibold flex items-center gap-2">
                                                <FontAwesomeIcon icon={faLaptop} className="w-4 h-4 text-primary" />
                                                Datos del Producto
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faLaptop} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Categoría</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{ticketData.tipoProducto}</p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faTag} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Marca</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{ticketData.marca}</p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faLaptop} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Modelo</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{ticketData.modelo}</p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg md:col-span-3">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faHashtag} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Número de Serie</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{ticketData.serie}</p>
                                            </div>
                                        </div>

                                        {/* DETALLES DE LA FALLA Y COMPRA */}
                                        <div className="border-l-4 border-primary pl-4 mb-4">
                                            <h3 className="text-md font-semibold flex items-center gap-2">
                                                <FontAwesomeIcon icon={faComment} className="w-4 h-4 text-primary" />
                                                Detalles de la Falla y Compra
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg md:col-span-2">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faComment} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Detalles de la Falla</span>
                                                </div>
                                                <p className="text-sm text-gray-800 dark:text-white whitespace-pre-line">{ticketData.detallesFalla}</p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faCalendarAlt} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Fecha de Compra</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{formatearFecha(ticketData.fechaCompra)}</p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faStore} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Tienda de Compra</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{ticketData.tiendaSedeCompra}</p>
                                            </div>
                                        </div>

                                        {/* ARCHIVOS ADJUNTOS - MODIFICADO CON FileRenderer */}
                                        <div className="border-l-4 border-primary pl-4 mb-4">
                                            <h3 className="text-md font-semibold flex items-center gap-2">
                                                <FontAwesomeIcon icon={faCamera} className="w-4 h-4 text-primary" />
                                                Archivos Adjuntos
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            {/* Foto/Video de la Falla */}
                                            <FileRenderer
                                                fileUrl={ticketData.fotoVideoFalla}
                                                label="Evidencia de la Falla"
                                                icon={faVideo}
                                                emptyMessage="Sin evidencia"
                                            />

                                            {/* Boleta/Factura */}
                                            <FileRenderer
                                                fileUrl={ticketData.fotoBoletaFactura}
                                                label="Boleta/Factura"
                                                icon={faFileInvoice}
                                                emptyMessage="Sin comprobante"
                                            />

                                            {/* N° de Serie */}
                                            <FileRenderer
                                                fileUrl={ticketData.fotoNumeroSerie}
                                                label="Número de Serie"
                                                icon={faImage}
                                                emptyMessage="Sin foto del serie"
                                            />
                                        </div>

                                        {/* UBICACIÓN GOOGLE MAPS */}
                                        {ticketData.ubicacionGoogleMaps && (
                                            <>
                                                <div className="border-l-4 border-primary pl-4 mb-4">
                                                    <h3 className="text-md font-semibold flex items-center gap-2">
                                                        <FontAwesomeIcon icon={faMap} className="w-4 h-4 text-primary" />
                                                        Ubicación en Google Maps
                                                    </h3>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                                    <a
                                                        href={ticketData.ubicacionGoogleMaps}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                                                            <FontAwesomeIcon icon={faMapPin} className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <span className="text-sm font-medium">Ver ubicación en Google Maps</span>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                                Haz clic para abrir el mapa
                                                            </p>
                                                        </div>
                                                        <FontAwesomeIcon icon={faMap} className="w-4 h-4 text-gray-400" />
                                                    </a>
                                                </div>
                                            </>
                                        )}

                                        {/* Botón de cerrar */}
                                        <div className="flex justify-end items-center mt-4">
                                            <button 
                                                type="button" 
                                                className="btn btn-primary" 
                                                onClick={() => setModal(false)}
                                            >
                                                Cerrar
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default ModalVerTicket;