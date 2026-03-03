import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes,
    faExclamationTriangle,
    faTrash
} from '@fortawesome/free-solid-svg-icons';
import toastr from 'toastr';

const ModalEliminarTicket = ({ modal, setModal, ticketData, onConfirm }) => {
    if (!ticketData) return null;

    const handleConfirm = () => {
        onConfirm(ticketData.id);
        setModal(false);
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
                            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-md text-black dark:text-white-dark">
                                {/* Header */}
                                <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                                            <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div className="text-lg font-bold">Confirmar Eliminación</div>
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
                                    <div className="text-center mb-5">
                                        <div className="bg-red-50 dark:bg-red-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FontAwesomeIcon icon={faTrash} className="w-10 h-10 text-red-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                            ¿Eliminar Ticket?
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Estás a punto de eliminar el ticket <span className="font-semibold">{ticketData.numeroTicket}</span>
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                            Esta acción no se puede deshacer.
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            <span className="font-medium">Equipo:</span> {ticketData.marca} {ticketData.modelo}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <span className="font-medium">Serie:</span> {ticketData.serie}
                                        </p>
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="flex justify-end items-center gap-3">
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary" 
                                            onClick={() => setModal(false)}
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-danger flex items-center gap-2" 
                                            onClick={handleConfirm}
                                        >
                                            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                                            Sí, eliminar
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

export default ModalEliminarTicket;