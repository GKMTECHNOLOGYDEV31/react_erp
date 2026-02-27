import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTicket,
    faTimes,
    faTag,
    faLaptop,
    faHashtag,
    faExclamationTriangle,
    faComment,
    faCalendarAlt,
    faExclamationCircle,
    faSpinner,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const ModalVerTicket = ({ modal, setModal, ticketData }) => {
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

    return (
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
                            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-2xl text-black dark:text-white-dark">
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
                                <div className="p-5">
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

                                    {/* Información del equipo */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                                                <FontAwesomeIcon icon={faTag} className="w-4 h-4" />
                                                <span className="text-sm font-medium">Marca</span>
                                            </div>
                                            <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                                {ticketData.marca}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                                                <FontAwesomeIcon icon={faLaptop} className="w-4 h-4" />
                                                <span className="text-sm font-medium">Modelo</span>
                                            </div>
                                            <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                                {ticketData.modelo}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Serie y Fecha */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                                                <FontAwesomeIcon icon={faHashtag} className="w-4 h-4" />
                                                <span className="text-sm font-medium">Número de Serie</span>
                                            </div>
                                            <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                                {ticketData.serie}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                                                <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4" />
                                                <span className="text-sm font-medium">Fecha de Creación</span>
                                            </div>
                                            <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                                {ticketData.fechaCreacion}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Observación */}
                                    {ticketData.observacion && (
                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                                                <FontAwesomeIcon icon={faComment} className="w-4 h-4" />
                                                <span className="text-sm font-medium">Observación</span>
                                            </div>
                                            <p className="text-gray-800 dark:text-white">
                                                {ticketData.observacion}
                                            </p>
                                        </div>
                                    )}

                                    {/* Prioridad */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Prioridad:</span>
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium
                                            ${ticketData.prioridad === 'alta' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' : 
                                              ticketData.prioridad === 'urgente' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                              ticketData.prioridad === 'baja' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                                            <FontAwesomeIcon icon={faExclamationTriangle} className="w-3 h-3" />
                                            {ticketData.prioridad?.charAt(0).toUpperCase() + ticketData.prioridad?.slice(1)}
                                        </span>
                                    </div>

                                    {/* Botón de cerrar */}
                                    <div className="flex justify-end items-center mt-8">
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
    );
};

export default ModalVerTicket;