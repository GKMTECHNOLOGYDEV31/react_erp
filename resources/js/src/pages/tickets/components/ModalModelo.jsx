import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave, faSpinner, faLaptop } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import toastr from 'toastr';

const ModalModelo = ({ modal, setModal, onModeloCreado, categorias, marcas }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        idMarca: '',
        idCategoria: '',
        estado: 1
    });
    const [loading, setLoading] = useState(false);
    const API_URL = 'http://127.0.0.1:8000/api';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.nombre.trim()) {
            toastr.error('El nombre del modelo es requerido');
            return;
        }
        if (!formData.idMarca) {
            toastr.error('Debe seleccionar una marca');
            return;
        }
        if (!formData.idCategoria) {
            toastr.error('Debe seleccionar una categoría');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/modelos`, 
                formData,
                {
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                toastr.success('Modelo creado exitosamente');
                onModeloCreado(response.data.data);
                setFormData({
                    nombre: '',
                    idMarca: '',
                    idCategoria: '',
                    estado: 1
                });
                setModal(false);
            }
        } catch (error) {
            console.error('Error al crear modelo:', error);
            if (error.response?.data?.errors) {
                Object.values(error.response.data.errors).forEach(err => {
                    toastr.error(err[0]);
                });
            } else {
                toastr.error('Error al crear el modelo');
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
                        <FontAwesomeIcon icon={faLaptop} className="text-primary" />
                        Nuevo Modelo
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
                            Marca <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="idMarca"
                            className="form-select w-full"
                            value={formData.idMarca}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="">Seleccione una marca</option>
                            {marcas.map(marca => (
                                <option key={marca.idMarca} value={marca.idMarca}>
                                    {marca.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Categoría <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="idCategoria"
                            className="form-select w-full"
                            value={formData.idCategoria}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="">Seleccione una categoría</option>
                            {categorias.map(cat => (
                                <option key={cat.idCategoria} value={cat.idCategoria}>
                                    {cat.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Nombre del Modelo <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            className="form-input w-full"
                            placeholder="Ej: M93463"
                            value={formData.nombre}
                            onChange={handleChange}
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

export default ModalModelo;