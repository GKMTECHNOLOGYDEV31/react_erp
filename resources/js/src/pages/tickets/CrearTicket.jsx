import React from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import toastr from 'toastr'; // 👈 Importar toastr

// Importaciones de FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTicket, 
    faTag, 
    faLaptop, 
    faHashtag, 
    faExclamationTriangle, 
    faComment, 
    faTimes, 
    faSave,
    faPlus,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';

const CrearTicket = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Crear Ticket'));
        
        // Configurar toastr (opcional, también puedes hacerlo global)
        toastr.options = {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
            timeOut: 3000,
            showDuration: 300,
            hideDuration: 500,
        };
    }, []);

    // Esquema de validación con Yup
    const validationSchema = Yup.object({
        numeroTicket: Yup.string()
            .required('El número de ticket es requerido'),
        marca: Yup.string()
            .required('La marca es requerida'),
        modelo: Yup.string()
            .required('El modelo es requerido'),
        serie: Yup.string()
            .required('La serie es requerida'),
        observacion: Yup.string(),
        prioridad: Yup.string()
            .required('La prioridad es requerida')
    });

    // Inicializar Formik
    const formik = useFormik({
        initialValues: {
            numeroTicket: '',
            marca: '',
            modelo: '',
            serie: '',
            observacion: '',
            prioridad: 'media'
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                // Mostrar toast de carga (toastr.info)
                toastr.info('Creando ticket...', 'Procesando');
                
                // 🔁 SIMULACIÓN - Reemplaza con tu llamada a Laravel
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Limpiar toasts anteriores
                toastr.clear();
                
                // Mostrar toast de éxito
                toastr.success('✅ ¡Ticket creado exitosamente!', 'Éxito');
                
                // Resetear formulario
                resetForm();
                
                // Redirigir después de 2 segundos
                setTimeout(() => {
                    window.location.href = '/tickets';
                }, 2000);
                
            } catch (error) {
                console.error('Error al crear ticket:', error);
                
                // Mostrar toast de error
                toastr.error('❌ Error al crear el ticket. Por favor intenta de nuevo.', 'Error');
            } finally {
                setSubmitting(false);
            }
        }
    });

    // Opciones para el select de prioridad
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
                    <FontAwesomeIcon icon={faPlus} className="w-3 h-3 text-gray-500" />
                    <span>Crear Ticket</span>
                </li>
            </ul>

            <div className="pt-5">
                <div className="panel">
                    {/* Header con iconos grises */}
                    <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
                                <FontAwesomeIcon icon={faTicket} className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white-light">
                                Crear Nuevo Ticket
                            </h1>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-base flex items-center gap-2">
                            <FontAwesomeIcon icon={faComment} className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            Completa la información del equipo y detalla el problema. 
                            Cuanto más específico seas, más rápido podremos ayudarte a resolverlo.
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
                                    placeholder="Describe el problema o cualquier detalle adicional que nos ayude a entender mejor la situación (opcional)"
                                    value={formik.values.observacion}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={formik.isSubmitting}
                                ></textarea>
                            </div>

                            {/* Botones con iconos */}
                            <div className="flex items-center justify-end space-x-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-danger flex items-center gap-2"
                                    onClick={() => {
                                        formik.resetForm();
                                        window.location.href = '/tickets';
                                    }}
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
                                            Creando...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faSave} className="w-4 h-4" />
                                            Crear Ticket
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

export default CrearTicket;