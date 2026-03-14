import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave, faSpinner, faTag } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import toastr from 'toastr';

const ModalCategoria = ({ modal, setModal, onCategoriaCreada }) => {
    const [nombre, setNombre] = useState('');
    const [loading, setLoading] = useState(false);
    const API_URL = 'http://192.168.0.91:5000/api';

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!nombre.trim()) {
            toastr.error('El nombre de la categoría es requerido');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/categorias`, 
                { nombre: nombre.trim() },
                {
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                toastr.success('Categoría creada exitosamente');
                onCategoriaCreada(response.data.data);
                setNombre('');
                setModal(false);
            }
        } catch (error) {
            console.error('Error al crear categoría:', error);
            if (error.response?.data?.errors) {
                Object.values(error.response.data.errors).forEach(err => {
                    toastr.error(err[0]);
                });
            } else {
                toastr.error('Error al crear la categoría');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!modal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FontAwesomeIcon icon={faTag} className="text-primary" />
                        Nueva Categoría
                    </h3>
                    <button
                        onClick={() => setModal(false)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Nombre de la Categoría <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-input w-full"
                            placeholder="Ej: Televisor, Laptop, Celular..."
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            autoFocus
                            disabled={loading}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => setModal(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex items-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faSave} />
                                    Guardar
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalCategoria;