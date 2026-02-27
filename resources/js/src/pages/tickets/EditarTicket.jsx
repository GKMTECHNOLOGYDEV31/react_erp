import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTicket, 
    faSave, 
    faTimes,
    faTag, 
    faLaptop, 
    faHashtag, 
    faExclamationTriangle, 
    faComment,
    faSpinner,
    faEdit
} from '@fortawesome/free-solid-svg-icons';
import toastr from 'toastr';

const EditarTicket = () => {
    const dispatch = useDispatch();
    const { id } = useParams(); // Obtener el ID de la URL

    useEffect(() => {
        dispatch(setPageTitle('Editar Ticket'));
        
        // Configurar toastr
        toastr.options = {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
            timeOut: 3000,
            showDuration: 300,
            hideDuration: 500,
        };
    }, [dispatch]);

    // Aquí deberías cargar los datos del ticket según el ID
    // Por ahora usamos datos de ejemplo
    const ticketData = {
        id: id,
        numeroTicket: 'TKT-2024-001',
        marca: 'HP',
        modelo: 'EliteBook 840 G3',
        serie: 'HP12345678',
        observacion: 'El equipo no enciende',
        prioridad: 'alta'
    };

    const validationSchema = Yup.object({
        numeroTicket: Yup.string().required('El número de ticket es requerido'),
        marca: Yup.string().required('La marca es requerida'),
        modelo: Yup.string().required('El modelo es requerido'),
        serie: Yup.string().required('La serie es requerida'),
        observacion: Yup.string(),
        prioridad: Yup.string().required('La prioridad es requerida')
    });

    const formik = useFormik({
        initialValues: {
            numeroTicket: ticketData.numeroTicket,
            marca: ticketData.marca,
            modelo: ticketData.modelo,
            serie: ticketData.serie,
            observacion: ticketData.observacion,
            prioridad: ticketData.prioridad
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                toastr.info('Actualizando ticket...', 'Procesando');
                
                // Simular actualización
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                toastr.clear();
                toastr.success('✅ ¡Ticket actualizado exitosamente!', 'Éxito');
                
                setTimeout(() => {
                    window.location.href = '/tickets';
                }, 2000);
            } catch (error) {
                toastr.error('❌ Error al actualizar el ticket', 'Error');
            } finally {
                setSubmitting(false);
            }
        }
    });

    const prioridadOptions = [
        { value: 'baja', label: 'Baja', color: 'bg-green-100 text-green-800' },
        { value: 'media', label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'alta', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
        { value: 'urgente', label: 'Urgente', color: 'bg-red-100 text-red-800' }
    ];

    return (
        <div>
            {/* Breadcrumb */}
            <ul className="flex space-x-2 rtl:space-x-reverse items-center">
                <li>
                    <Link to="/tickets" className="text-primary hover:underline flex items-center gap-1">
                        <FontAwesomeIcon icon={faTicket} className="w-4 h-4" />
                        Tickets
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 flex items-center gap-1">
                    <FontAwesomeIcon icon={faEdit} className="w-3 h-3 text-gray-500" />
                    <span>Editar Ticket #{id}</span>
                </li>
            </ul>

            <div className="pt-5">
                <div className="panel">
                    {/* Header con iconos grises y texto amigable */}
                    <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
                                <FontAwesomeIcon icon={faTicket} className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white-light">
                                Editar Ticket #{id}
                            </h1>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-base flex items-center gap-2">
                            <FontAwesomeIcon icon={faComment} className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            Modifica la información del ticket. Los cambios se guardarán automáticamente al actualizar.
                        </p>
                    </div>

                    <div className="mb-5">
                        <form onSubmit={formik.handleSubmit} className="space-y-5">
                            {/* Número de Ticket */}
                            <div>
                                <label htmlFor="numeroTicket" className="flex items-center gap-1">
                                    <FontAwesomeIcon icon={faTicket} className="w-4 h-4 text-gray-500" />
                                    Número de Ticket <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="numeroTicket"
                                    name="numeroTicket"
                                    type="text"
                                    placeholder="Ej: TKT-2024-001"
                                    className={`form-input ${formik.touched.numeroTicket && formik.errors.numeroTicket ? 'has-error' : ''}`}
                                    value={formik.values.numeroTicket}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={formik.isSubmitting}
                                />
                                {formik.touched.numeroTicket && formik.errors.numeroTicket && (
                                    <div className="text-danger text-sm mt-1">{formik.errors.numeroTicket}</div>
                                )}
                            </div>

                            {/* Marca y Modelo en grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="marca" className="flex items-center gap-1">
                                        <FontAwesomeIcon icon={faTag} className="w-4 h-4 text-gray-500" />
                                        Marca <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="marca"
                                        name="marca"
                                        type="text"
                                        placeholder="Ej: HP, Dell, Lenovo"
                                        className={`form-input ${formik.touched.marca && formik.errors.marca ? 'has-error' : ''}`}
                                        value={formik.values.marca}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={formik.isSubmitting}
                                    />
                                    {formik.touched.marca && formik.errors.marca && (
                                        <div className="text-danger text-sm mt-1">{formik.errors.marca}</div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="modelo" className="flex items-center gap-1">
                                        <FontAwesomeIcon icon={faLaptop} className="w-4 h-4 text-gray-500" />
                                        Modelo <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="modelo"
                                        name="modelo"
                                        type="text"
                                        placeholder="Ej: EliteBook 840 G3"
                                        className={`form-input ${formik.touched.modelo && formik.errors.modelo ? 'has-error' : ''}`}
                                        value={formik.values.modelo}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={formik.isSubmitting}
                                    />
                                    {formik.touched.modelo && formik.errors.modelo && (
                                        <div className="text-danger text-sm mt-1">{formik.errors.modelo}</div>
                                    )}
                                </div>
                            </div>

                            {/* Serie */}
                            <div>
                                <label htmlFor="serie" className="flex items-center gap-1">
                                    <FontAwesomeIcon icon={faHashtag} className="w-4 h-4 text-gray-500" />
                                    Serie <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="serie"
                                    name="serie"
                                    type="text"
                                    placeholder="Número de serie del equipo"
                                    className={`form-input ${formik.touched.serie && formik.errors.serie ? 'has-error' : ''}`}
                                    value={formik.values.serie}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={formik.isSubmitting}
                                />
                                {formik.touched.serie && formik.errors.serie && (
                                    <div className="text-danger text-sm mt-1">{formik.errors.serie}</div>
                                )}
                            </div>

                            {/* Prioridad */}
                            <div>
                                <label htmlFor="prioridad" className="flex items-center gap-1">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-gray-500" />
                                    Prioridad <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="prioridad"
                                    name="prioridad"
                                    className={`form-select text-white-dark ${formik.touched.prioridad && formik.errors.prioridad ? 'has-error' : ''}`}
                                    value={formik.values.prioridad}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={formik.isSubmitting}
                                >
                                    {prioridadOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {formik.touched.prioridad && formik.errors.prioridad && (
                                    <div className="text-danger text-sm mt-1">{formik.errors.prioridad}</div>
                                )}
                                
                                {formik.values.prioridad && (
                                    <div className="mt-2">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium 
                                            ${prioridadOptions.find(opt => opt.value === formik.values.prioridad)?.color}`}>
                                            <FontAwesomeIcon icon={faExclamationTriangle} className="w-3 h-3" />
                                            Prioridad: {prioridadOptions.find(opt => opt.value === formik.values.prioridad)?.label}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Observación */}
                            <div>
                                <label htmlFor="observacion" className="flex items-center gap-1">
                                    <FontAwesomeIcon icon={faComment} className="w-4 h-4 text-gray-500" />
                                    Observación
                                </label>
                                <textarea
                                    id="observacion"
                                    name="observacion"
                                    rows={4}
                                    className="form-textarea"
                                    placeholder="Describe el problema o cualquier detalle adicional que nos ayude a entender mejor la situación"
                                    value={formik.values.observacion}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={formik.isSubmitting}
                                />
                            </div>

                            {/* Botones */}
                            <div className="flex items-center justify-end space-x-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-danger flex items-center gap-2"
                                    onClick={() => window.location.href = '/tickets'}
                                    disabled={formik.isSubmitting}
                                >
                                    <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary flex items-center gap-2"
                                    disabled={!formik.isValid || formik.isSubmitting}
                                >
                                    {formik.isSubmitting ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                                            Actualizando...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faSave} className="w-4 h-4" />
                                            Actualizar Ticket
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarTicket;