import React, { Fragment, useState } from 'react';
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
    faExclamationCircle,
    faSpinner,
    faCheckCircle,
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
    faSearch
} from '@fortawesome/free-solid-svg-icons';

const ModalVerTicket = ({ modal, setModal, ticketData }) => {
    const [modalImage, setModalImage] = useState(null);

    if (!ticketData) return null;

    // Función para obtener el badge de estado
    const getStatusBadge = (estado) => {
        const statusConfig = {
            abierto: {
                color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
                icon: faExclamationCircle,
                text: 'Abierto'
            },
            en_proceso: {
                color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
                icon: faSpinner,
                text: 'En Proceso'
            },
            cerrado: {
                color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                icon: faCheckCircle,
                text: 'Cerrado'
            }
        };

        const config = statusConfig[estado] || statusConfig.abierto;

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                <FontAwesomeIcon icon={config.icon} className="w-3 h-3" />
                {config.text}
            </span>
        );
    };

    // Modal para ver imagen ampliada
    const ImageModal = ({ image, onClose }) => {
        if (!image) return null;

        return (
            <div
                className="fixed inset-0 bg-black bg-opacity-75 z-[9999] flex items-center justify-center p-4"
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

    return (
        <>
            {/* Modal de imagen ampliada */}
            <ImageModal image={modalImage} onClose={() => setModalImage(null)} />

            <Transition appear show={modal} as={Fragment}>
                <Dialog as="div" open={modal} onClose={() => setModal(false)}>
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
                                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                                    {ticketData.numeroTicket}
                                                </h2>
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
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                                    {ticketData.nombreCompleto}
                                                </p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faIdCard} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Documento</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                                    {ticketData.tipoDocumento?.toUpperCase()}: {ticketData.dniRucCe}
                                                </p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Correo Electrónico</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                                    {ticketData.correoElectronico}
                                                </p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faPhone} className="w-3 h-3" />
                                                    <FontAwesomeIcon icon={faMobile} className="w-3 h-3" />
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
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                                    {ticketData.direccionCompleta}
                                                </p>
                                            </div>

                                            {ticketData.referenciaDomicilio && (
                                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg md:col-span-2">
                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                        <FontAwesomeIcon icon={faRoad} className="w-3 h-3" />
                                                        <span className="text-xs font-medium">Referencia</span>
                                                    </div>
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                                        {ticketData.referenciaDomicilio}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faGlobe} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Departamento</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                                    {ticketData.departamento}
                                                </p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faBuilding} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Provincia</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                                    {ticketData.provincia}
                                                </p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faCity} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Distrito</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                                    {ticketData.distrito}
                                                </p>
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
                                                    <span className="text-xs font-medium">Tipo</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                                    {ticketData.tipoProducto}
                                                </p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faTag} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Marca</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                                    {ticketData.marca}
                                                </p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faLaptop} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Modelo</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                                    {ticketData.modelo}
                                                </p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg md:col-span-3">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faHashtag} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Número de Serie</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                                    {ticketData.serie}
                                                </p>
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
                                                <p className="text-sm text-gray-800 dark:text-white">
                                                    {ticketData.detallesFalla || ticketData.observacion}
                                                </p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faCalendarAlt} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Fecha de Compra</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                                    {ticketData.fechaCompra}
                                                </p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                    <FontAwesomeIcon icon={faStore} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Tienda de Compra</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                                    {ticketData.tiendaSedeCompra}
                                                </p>
                                            </div>
                                        </div>

                                        {/* ARCHIVOS ADJUNTOS - SIEMPRE VISIBLE */}
                                        <div className="border-l-4 border-primary pl-4 mb-4">
                                            <h3 className="text-md font-semibold flex items-center gap-2">
                                                <FontAwesomeIcon icon={faCamera} className="w-4 h-4 text-primary" />
                                                Archivos Adjuntos
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            {/* Foto/Video de la Falla */}
                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                                                    <FontAwesomeIcon icon={faVideo} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Foto</span>
                                                </div>
                                                {ticketData.fotoVideoFalla ? (
                                                    <div className="relative group">
                                                        <img
                                                            src={ticketData.fotoVideoFalla}
                                                            alt="Falla"
                                                            className="w-full h-24 object-cover rounded-lg cursor-pointer border border-gray-200 dark:border-gray-700"
                                                            onClick={() => setModalImage(ticketData.fotoVideoFalla)}
                                                        />
                                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center cursor-pointer"
                                                             onClick={() => setModalImage(ticketData.fotoVideoFalla)}>
                                                            <div className="bg-white bg-opacity-90 rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-700 shadow-lg">
                                                                <FontAwesomeIcon icon={faSearch} className="w-2 h-2 mr-1" />
                                                                Ampliar
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                                        <span className="text-xs text-gray-500">Sin imagen</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Boleta/Factura */}
                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                                                    <FontAwesomeIcon icon={faFileInvoice} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Boleta/Factura</span>
                                                </div>
                                                {ticketData.fotoBoletaFactura ? (
                                                    <div className="relative group">
                                                        <img
                                                            src={ticketData.fotoBoletaFactura}
                                                            alt="Boleta"
                                                            className="w-full h-24 object-cover rounded-lg cursor-pointer border border-gray-200 dark:border-gray-700"
                                                            onClick={() => setModalImage(ticketData.fotoBoletaFactura)}
                                                        />
                                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center cursor-pointer"
                                                             onClick={() => setModalImage(ticketData.fotoBoletaFactura)}>
                                                            <div className="bg-white bg-opacity-90 rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-700 shadow-lg">
                                                                <FontAwesomeIcon icon={faSearch} className="w-2 h-2 mr-1" />
                                                                Ampliar
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                                        <span className="text-xs text-gray-500">Sin imagen</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* N° de Serie */}
                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                                                    <FontAwesomeIcon icon={faImage} className="w-3 h-3" />
                                                    <span className="text-xs font-medium">N° de Serie</span>
                                                </div>
                                                {ticketData.fotoSerieEquipo ? (
                                                    <div className="relative group">
                                                        <img
                                                            src={ticketData.fotoSerieEquipo}
                                                            alt="Serie"
                                                            className="w-full h-24 object-cover rounded-lg cursor-pointer border border-gray-200 dark:border-gray-700"
                                                            onClick={() => setModalImage(ticketData.fotoSerieEquipo)}
                                                        />
                                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center cursor-pointer"
                                                             onClick={() => setModalImage(ticketData.fotoSerieEquipo)}>
                                                            <div className="bg-white bg-opacity-90 rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-700 shadow-lg">
                                                                <FontAwesomeIcon icon={faSearch} className="w-2 h-2 mr-1" />
                                                                Ampliar
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                                        <span className="text-xs text-gray-500">Sin imagen</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* UBICACIÓN GOOGLE MAPS */}
                                        {ticketData.ubicacionGoogleMaps && (
                                            <>
                                                <div className="border-l-4 border-primary pl-4 mb-4">
                                                    <h3 className="text-md font-semibold flex items-center gap-2">
                                                        <FontAwesomeIcon icon={faMap} className="w-4 h-4 text-primary" />
                                                        Ubicación
                                                    </h3>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-6">
                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                                        <FontAwesomeIcon icon={faMap} className="w-3 h-3" />
                                                        <span className="text-xs font-medium">Link de Google Maps</span>
                                                    </div>
                                                    <a
                                                        href={ticketData.ubicacionGoogleMaps}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:underline break-all"
                                                    >
                                                        {ticketData.ubicacionGoogleMaps}
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
