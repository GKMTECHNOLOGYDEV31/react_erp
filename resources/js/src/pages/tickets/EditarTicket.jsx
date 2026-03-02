import React, { useEffect, useRef, useState } from 'react';
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
    faEdit,
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
    faCalendar,
    faStore,
    faCamera,
    faVideo,
    faFileInvoice,
    faMap,
    faImage,
    faSearch
} from '@fortawesome/free-solid-svg-icons';
import toastr from 'toastr';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

const EditarTicket = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const fechaCompraRef = useRef(null);

    // Estados para las previsualizaciones de imágenes
    const [previewFalla, setPreviewFalla] = useState(null);
    const [previewBoleta, setPreviewBoleta] = useState(null);
    const [previewSerie, setPreviewSerie] = useState(null);

    // Estado para el modal de imagen ampliada
    const [modalImage, setModalImage] = useState(null);

    useEffect(() => {
        dispatch(setPageTitle(`Editar Ticket #${id}`));

        toastr.options = {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
            timeOut: 3000,
            showDuration: 300,
            hideDuration: 500,
        };

        // Inicializar flatpickr
        if (fechaCompraRef.current) {
            flatpickr(fechaCompraRef.current, {
                dateFormat: 'Y-m-d',
                maxDate: 'today',
                onChange: (selectedDates, dateStr) => {
                    formik.setFieldValue('fechaCompra', dateStr);
                }
            });
        }
    }, [dispatch, id]);

    // Manejadores para previsualización de imágenes
    const handleImageChange = (e, setPreview) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Modal para ver imagen ampliada
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

    // Opciones para selects
    const tipoDocumentoOptions = [
        { value: 'dni', label: 'DNI' },
        { value: 'ruc', label: 'RUC' },
        { value: 'ce', label: 'Carnet de Extranjería' }
    ];

    const tipoProductoOptions = [
        { value: 'laptop', label: 'Laptop' },
        { value: 'desktop', label: 'Desktop' },
        { value: 'tablet', label: 'Tablet' },
        { value: 'celular', label: 'Celular' },
        { value: 'impresora', label: 'Impresora' },
        { value: 'monitor', label: 'Monitor' },
        { value: 'otro', label: 'Otro' }
    ];

    const departamentoOptions = [
        { value: 'lima', label: 'Lima' },
        { value: 'callao', label: 'Callao' },
        { value: 'ancash', label: 'Áncash' },
        { value: 'apurimac', label: 'Apurímac' },
        { value: 'arequipa', label: 'Arequipa' },
        { value: 'ayacucho', label: 'Ayacucho' },
        { value: 'cajamarca', label: 'Cajamarca' },
        { value: 'cusco', label: 'Cusco' },
        { value: 'huancavelica', label: 'Huancavelica' },
        { value: 'huanuco', label: 'Huánuco' },
        { value: 'ica', label: 'Ica' },
        { value: 'junin', label: 'Junín' },
        { value: 'libertad', label: 'La Libertad' },
        { value: 'lambayeque', label: 'Lambayeque' },
        { value: 'loreto', label: 'Loreto' },
        { value: 'madrededios', label: 'Madre de Dios' },
        { value: 'moquegua', label: 'Moquegua' },
        { value: 'pasco', label: 'Pasco' },
        { value: 'piura', label: 'Piura' },
        { value: 'puno', label: 'Puno' },
        { value: 'sanmartin', label: 'San Martín' },
        { value: 'tacna', label: 'Tacna' },
        { value: 'tumbes', label: 'Tumbes' },
        { value: 'ucayali', label: 'Ucayali' }
    ];

    const provinciaOptions = [
        { value: 'lima', label: 'Lima' },
        { value: 'callao', label: 'Callao' },
        { value: 'barranca', label: 'Barranca' },
        { value: 'cajatambo', label: 'Cajatambo' },
        { value: 'canta', label: 'Canta' },
        { value: 'canete', label: 'Cañete' },
        { value: 'huaral', label: 'Huaral' },
        { value: 'huarochiri', label: 'Huarochirí' },
        { value: 'huaura', label: 'Huaura' },
        { value: 'oyon', label: 'Oyón' },
        { value: 'yauyos', label: 'Yauyos' }
    ];

    const distritoOptions = [
        { value: 'cercado', label: 'Cercado de Lima' },
        { value: 'ate', label: 'Ate' },
        { value: 'barranco', label: 'Barranco' },
        { value: 'breña', label: 'Breña' },
        { value: 'comas', label: 'Comas' },
        { value: 'chorrillos', label: 'Chorrillos' },
        { value: 'el_agustino', label: 'El Agustino' },
        { value: 'jesus_maria', label: 'Jesús María' },
        { value: 'la_molina', label: 'La Molina' },
        { value: 'la_victoria', label: 'La Victoria' },
        { value: 'lince', label: 'Lince' },
        { value: 'magdalena', label: 'Magdalena del Mar' },
        { value: 'miraflores', label: 'Miraflores' },
        { value: 'pueblo_libre', label: 'Pueblo Libre' },
        { value: 'puente_piedra', label: 'Puente Piedra' },
        { value: 'rimac', label: 'Rímac' },
        { value: 'san_borja', label: 'San Borja' },
        { value: 'san_isidro', label: 'San Isidro' },
        { value: 'san_juan_lurigancho', label: 'San Juan de Lurigancho' },
        { value: 'san_juan_miraflores', label: 'San Juan de Miraflores' },
        { value: 'san_luis', label: 'San Luis' },
        { value: 'san_martin_porres', label: 'San Martín de Porres' },
        { value: 'san_miguel', label: 'San Miguel' },
        { value: 'santa_anita', label: 'Santa Anita' },
        { value: 'santa_rosa', label: 'Santa Rosa' },
        { value: 'santiago_surco', label: 'Santiago de Surco' },
        { value: 'surquillo', label: 'Surquillo' },
        { value: 'villa_el_salvador', label: 'Villa El Salvador' },
        { value: 'villa_maria', label: 'Villa María del Triunfo' }
    ];

    const prioridadOptions = [
        { value: 'baja', label: 'Baja', color: 'bg-green-100 text-green-800' },
        { value: 'media', label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'alta', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
        { value: 'urgente', label: 'Urgente', color: 'bg-red-100 text-red-800' }
    ];

    // Datos de ejemplo (simulando carga desde API)
    const ticketData = {
        id: id,
        // Datos personales
        nombreCompleto: 'Juan Carlos Pérez Rodríguez',
        tipoDocumento: 'dni',
        dniRucCe: '12345678',
        telefonoFijo: '01-1234567',
        telefonoCelular: '987654321',
        correoElectronico: 'juan.perez@email.com',

        // Dirección - ACTUALIZADO con departamento
        direccionCompleta: 'Av. Principal 123, Urbanización Las Flores',
        referenciaDomicilio: 'Frente al parque, al costado del mercado',
        departamento: 'lima',      // ✅ NUEVO
        provincia: 'lima',
        distrito: 'miraflores',

        // Producto
        tipoProducto: 'laptop',
        modeloProducto: 'HP Pavilion 15',
        serieProducto: 'HP12345678',

        // Falla y compra
        detallesFalla: 'El equipo no enciende y hace un ruido extraño al intentar prenderlo',
        fechaCompra: '2024-01-15',
        tiendaSedeCompra: 'Tienda Principal - Miraflores',

        // Archivos y ubicación
        fotoVideoFalla: '',
        fotoBoletaFactura: '',
        fotoSerieEquipo: '',
        ubicacionGoogleMaps: 'https://maps.google.com/?q=-12.046374,-77.042793'
    };

    // Esquema de validación con Yup - ACTUALIZADO
    const validationSchema = Yup.object({
        // Datos personales
        nombreCompleto: Yup.string()
            .required('El nombre completo es requerido')
            .min(3, 'Mínimo 3 caracteres'),
        tipoDocumento: Yup.string()
            .required('El tipo de documento es requerido'),
        dniRucCe: Yup.string()
            .required('Número de documento es requerido')
            .min(8, 'Mínimo 8 caracteres')
            .max(15, 'Máximo 15 caracteres'),
        telefonoFijo: Yup.string(),
        telefonoCelular: Yup.string()
            .required('El teléfono celular es requerido')
            .min(9, 'Mínimo 9 dígitos'),
        correoElectronico: Yup.string()
            .email('Correo inválido')
            .required('El correo electrónico es requerido'),

        // Dirección - ACTUALIZADO
        direccionCompleta: Yup.string()
            .required('La dirección completa es requerida'),
        referenciaDomicilio: Yup.string(),
        departamento: Yup.string()                    // ✅ NUEVO
            .required('El departamento es requerido'),
        provincia: Yup.string()
            .required('La provincia es requerida'),
        distrito: Yup.string()
            .required('El distrito es requerido'),

        // Producto
        tipoProducto: Yup.string()
            .required('El tipo de producto es requerido'),
        modeloProducto: Yup.string()
            .required('El modelo del producto es requerido'),
        serieProducto: Yup.string()
            .required('La serie del producto es requerida'),

        // Falla y compra
        detallesFalla: Yup.string()
            .required('Los detalles de la falla son requeridos')
            .min(10, 'Describe la falla con más detalle (mínimo 10 caracteres)'),
        fechaCompra: Yup.date()
            .required('La fecha de compra es requerida')
            .max(new Date(), 'La fecha no puede ser futura'),
        tiendaSedeCompra: Yup.string()
            .required('La tienda y sede de compra es requerida'),

        // Archivos y ubicación (opcionales)
        fotoVideoFalla: Yup.string()
            .url('Debe ser una URL válida'),
        fotoBoletaFactura: Yup.string()
            .url('Debe ser una URL válida'),
        fotoSerieEquipo: Yup.string()
            .url('Debe ser una URL válida'),
        ubicacionGoogleMaps: Yup.string()
            .url('Debe ser una URL válida de Google Maps')
    });

    // Formik - ACTUALIZADO con departamento
    const formik = useFormik({
        initialValues: {
            // Datos personales
            nombreCompleto: ticketData.nombreCompleto,
            tipoDocumento: ticketData.tipoDocumento,
            dniRucCe: ticketData.dniRucCe,
            telefonoFijo: ticketData.telefonoFijo,
            telefonoCelular: ticketData.telefonoCelular,
            correoElectronico: ticketData.correoElectronico,

            // Dirección - ACTUALIZADO
            direccionCompleta: ticketData.direccionCompleta,
            referenciaDomicilio: ticketData.referenciaDomicilio,
            departamento: ticketData.departamento,     // ✅ NUEVO
            provincia: ticketData.provincia,
            distrito: ticketData.distrito,

            // Producto
            tipoProducto: ticketData.tipoProducto,
            modeloProducto: ticketData.modeloProducto,
            serieProducto: ticketData.serieProducto,

            // Falla y compra
            detallesFalla: ticketData.detallesFalla,
            fechaCompra: ticketData.fechaCompra,
            tiendaSedeCompra: ticketData.tiendaSedeCompra,

            // Archivos y ubicación
            fotoVideoFalla: ticketData.fotoVideoFalla,
            fotoBoletaFactura: ticketData.fotoBoletaFactura,
            fotoSerieEquipo: ticketData.fotoSerieEquipo,
            ubicacionGoogleMaps: ticketData.ubicacionGoogleMaps,

            // Prioridad
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

            {/* Modal para imagen ampliada */}
            <ImageModal image={modalImage} onClose={() => setModalImage(null)} />

            <div className="pt-5">
                <div className="panel">
                    {/* Header */}
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
                            Modifica la información del ticket. Los cambios se guardarán al actualizar.
                        </p>
                    </div>

                    <div className="mb-5">
                        <form onSubmit={formik.handleSubmit} className="space-y-8">

                            {/* SECCIÓN 1: DATOS PERSONALES */}
                            <div className="border-l-4 border-primary pl-4 mb-6">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-primary" />
                                    Datos del Cliente
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Nombre Completo */}
                                <div className="md:col-span-1">
                                    <label htmlFor="nombreCompleto" className="flex items-center gap-1">
                                        <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-gray-500" />
                                        Nombre Completo <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="nombreCompleto"
                                        name="nombreCompleto"
                                        type="text"
                                        placeholder="Ej: Juan Carlos Pérez Rodríguez"
                                        className={`form-input ${formik.touched.nombreCompleto && formik.errors.nombreCompleto ? 'has-error' : ''}`}
                                        value={formik.values.nombreCompleto}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={formik.isSubmitting}
                                    />
                                    {formik.touched.nombreCompleto && formik.errors.nombreCompleto && (
                                        <div className="text-danger text-sm mt-1">{formik.errors.nombreCompleto}</div>
                                    )}
                                </div>

                                {/* Correo Electrónico */}
                                <div className="md:col-span-1">
                                    <label htmlFor="correoElectronico" className="flex items-center gap-1">
                                        <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-gray-500" />
                                        Correo Electrónico <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="correoElectronico"
                                        name="correoElectronico"
                                        type="email"
                                        placeholder="ejemplo@correo.com"
                                        className={`form-input ${formik.touched.correoElectronico && formik.errors.correoElectronico ? 'has-error' : ''}`}
                                        value={formik.values.correoElectronico}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={formik.isSubmitting}
                                    />
                                    {formik.touched.correoElectronico && formik.errors.correoElectronico && (
                                        <div className="text-danger text-sm mt-1">{formik.errors.correoElectronico}</div>
                                    )}
                                </div>

                                {/* Tipo de Documento */}
                                <div>
                                    <label htmlFor="tipoDocumento" className="flex items-center gap-1">
                                        <FontAwesomeIcon icon={faIdCard} className="w-4 h-4 text-gray-500" />
                                        Tipo de Documento <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="tipoDocumento"
                                        name="tipoDocumento"
                                        className={`form-select ${formik.touched.tipoDocumento && formik.errors.tipoDocumento ? 'has-error' : ''}`}
                                        value={formik.values.tipoDocumento}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={formik.isSubmitting}
                                    >
                                        <option value="">Seleccione tipo</option>
                                        {tipoDocumentoOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {formik.touched.tipoDocumento && formik.errors.tipoDocumento && (
                                        <div className="text-danger text-sm mt-1">{formik.errors.tipoDocumento}</div>
                                    )}
                                </div>

                                {/* Número de Documento */}
                                <div>
                                    <label htmlFor="dniRucCe" className="flex items-center gap-1">
                                        <FontAwesomeIcon icon={faHashtag} className="w-4 h-4 text-gray-500" />
                                        Número de Documento <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="dniRucCe"
                                        name="dniRucCe"
                                        type="text"
                                        placeholder="Ej: 12345678"
                                        className={`form-input ${formik.touched.dniRucCe && formik.errors.dniRucCe ? 'has-error' : ''}`}
                                        value={formik.values.dniRucCe}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={formik.isSubmitting}
                                    />
                                    {formik.touched.dniRucCe && formik.errors.dniRucCe && (
                                        <div className="text-danger text-sm mt-1">{formik.errors.dniRucCe}</div>
                                    )}
                                </div>

                                {/* Teléfono Fijo */}
                                <div>
                                    <label htmlFor="telefonoFijo" className="flex items-center gap-1">
                                        <FontAwesomeIcon icon={faPhone} className="w-4 h-4 text-gray-500" />
                                        Teléfono Fijo
                                    </label>
                                    <input
                                        id="telefonoFijo"
                                        name="telefonoFijo"
                                        type="tel"
                                        placeholder="Ej: 01-1234567"
                                        className="form-input"
                                        value={formik.values.telefonoFijo}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={formik.isSubmitting}
                                    />
                                </div>

                                {/* Teléfono Celular */}
                                <div>
                                    <label htmlFor="telefonoCelular" className="flex items-center gap-1">
                                        <FontAwesomeIcon icon={faMobile} className="w-4 h-4 text-gray-500" />
                                        Teléfono Celular <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="telefonoCelular"
                                        name="telefonoCelular"
                                        type="tel"
                                        placeholder="Ej: 987654321"
                                        className={`form-input ${formik.touched.telefonoCelular && formik.errors.telefonoCelular ? 'has-error' : ''}`}
                                        value={formik.values.telefonoCelular}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={formik.isSubmitting}
                                    />
                                    {formik.touched.telefonoCelular && formik.errors.telefonoCelular && (
                                        <div className="text-danger text-sm mt-1">{formik.errors.telefonoCelular}</div>
                                    )}
                                </div>
                            </div>

                            {/* SECCIÓN 2: DIRECCIÓN - ACTUALIZADA */}
                            <div className="border-l-4 border-primary pl-4 mb-6 mt-8">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="w-5 h-5 text-primary" />
                                    Dirección del Cliente
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="direccionCompleta" className="flex items-center gap-1">
                                            <FontAwesomeIcon icon={faHome} className="w-4 h-4 text-gray-500" />
                                            Dirección Completa <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="direccionCompleta"
                                            name="direccionCompleta"
                                            type="text"
                                            placeholder="Ej: Av. Principal 123, Urbanización Las Flores"
                                            className={`form-input ${formik.touched.direccionCompleta && formik.errors.direccionCompleta ? 'has-error' : ''}`}
                                            value={formik.values.direccionCompleta}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={formik.isSubmitting}
                                        />
                                        {formik.touched.direccionCompleta && formik.errors.direccionCompleta && (
                                            <div className="text-danger text-sm mt-1">{formik.errors.direccionCompleta}</div>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="referenciaDomicilio" className="flex items-center gap-1">
                                            <FontAwesomeIcon icon={faRoad} className="w-4 h-4 text-gray-500" />
                                            Referencia del Domicilio
                                        </label>
                                        <input
                                            id="referenciaDomicilio"
                                            name="referenciaDomicilio"
                                            type="text"
                                            placeholder="Ej: Frente al parque, al costado del mercado"
                                            className="form-input"
                                            value={formik.values.referenciaDomicilio}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={formik.isSubmitting}
                                        />
                                    </div>
                                </div>

                                {/* DEPARTAMENTO - PROVINCIA - DISTRITO */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* DEPARTAMENTO */}
                                    <div>
                                        <label htmlFor="departamento" className="flex items-center gap-1">
                                            <FontAwesomeIcon icon={faGlobe} className="w-4 h-4 text-gray-500" />
                                            Departamento <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="departamento"
                                            name="departamento"
                                            className={`form-select ${formik.touched.departamento && formik.errors.departamento ? 'has-error' : ''}`}
                                            value={formik.values.departamento}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={formik.isSubmitting}
                                        >
                                            <option value="">Seleccione departamento</option>
                                            {departamentoOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {formik.touched.departamento && formik.errors.departamento && (
                                            <div className="text-danger text-sm mt-1">{formik.errors.departamento}</div>
                                        )}
                                    </div>

                                    {/* PROVINCIA */}
                                    <div>
                                        <label htmlFor="provincia" className="flex items-center gap-1">
                                            <FontAwesomeIcon icon={faBuilding} className="w-4 h-4 text-gray-500" />
                                            Provincia <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="provincia"
                                            name="provincia"
                                            className={`form-select ${formik.touched.provincia && formik.errors.provincia ? 'has-error' : ''}`}
                                            value={formik.values.provincia}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={formik.isSubmitting}
                                        >
                                            <option value="">Seleccione provincia</option>
                                            {provinciaOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {formik.touched.provincia && formik.errors.provincia && (
                                            <div className="text-danger text-sm mt-1">{formik.errors.provincia}</div>
                                        )}
                                    </div>

                                    {/* DISTRITO */}
                                    <div>
                                        <label htmlFor="distrito" className="flex items-center gap-1">
                                            <FontAwesomeIcon icon={faCity} className="w-4 h-4 text-gray-500" />
                                            Distrito <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="distrito"
                                            name="distrito"
                                            className={`form-select ${formik.touched.distrito && formik.errors.distrito ? 'has-error' : ''}`}
                                            value={formik.values.distrito}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={formik.isSubmitting}
                                        >
                                            <option value="">Seleccione distrito</option>
                                            {distritoOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {formik.touched.distrito && formik.errors.distrito && (
                                            <div className="text-danger text-sm mt-1">{formik.errors.distrito}</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* SECCIÓN 3: DATOS DEL PRODUCTO */}
                            <div className="border-l-4 border-primary pl-4 mb-6 mt-8">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <FontAwesomeIcon icon={faLaptop} className="w-5 h-5 text-primary" />
                                    Datos del Producto
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="tipoProducto" className="flex items-center gap-1">
                                        <FontAwesomeIcon icon={faLaptop} className="w-4 h-4 text-gray-500" />
                                        Tipo de Producto <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="tipoProducto"
                                        name="tipoProducto"
                                        className={`form-select ${formik.touched.tipoProducto && formik.errors.tipoProducto ? 'has-error' : ''}`}
                                        value={formik.values.tipoProducto}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={formik.isSubmitting}
                                    >
                                        <option value="">Seleccione tipo</option>
                                        {tipoProductoOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {formik.touched.tipoProducto && formik.errors.tipoProducto && (
                                        <div className="text-danger text-sm mt-1">{formik.errors.tipoProducto}</div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="modeloProducto" className="flex items-center gap-1">
                                        <FontAwesomeIcon icon={faTag} className="w-4 h-4 text-gray-500" />
                                        Modelo del Producto <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="modeloProducto"
                                        name="modeloProducto"
                                        type="text"
                                        placeholder="Ej: HP Pavilion 15"
                                        className={`form-input ${formik.touched.modeloProducto && formik.errors.modeloProducto ? 'has-error' : ''}`}
                                        value={formik.values.modeloProducto}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={formik.isSubmitting}
                                    />
                                    {formik.touched.modeloProducto && formik.errors.modeloProducto && (
                                        <div className="text-danger text-sm mt-1">{formik.errors.modeloProducto}</div>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="serieProducto" className="flex items-center gap-1">
                                        <FontAwesomeIcon icon={faHashtag} className="w-4 h-4 text-gray-500" />
                                        Serie del Producto <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="serieProducto"
                                        name="serieProducto"
                                        type="text"
                                        placeholder="Número de serie del equipo"
                                        className={`form-input ${formik.touched.serieProducto && formik.errors.serieProducto ? 'has-error' : ''}`}
                                        value={formik.values.serieProducto}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={formik.isSubmitting}
                                    />
                                    {formik.touched.serieProducto && formik.errors.serieProducto && (
                                        <div className="text-danger text-sm mt-1">{formik.errors.serieProducto}</div>
                                    )}
                                </div>
                            </div>

                            {/* SECCIÓN 4: DETALLES DE LA FALLA Y COMPRA */}
                            <div className="border-l-4 border-primary pl-4 mb-6 mt-8">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-primary" />
                                    Detalles de la Falla y Compra
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="detallesFalla" className="flex items-center gap-1">
                                        <FontAwesomeIcon icon={faComment} className="w-4 h-4 text-gray-500" />
                                        Detalles de la Falla <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="detallesFalla"
                                        name="detallesFalla"
                                        rows={4}
                                        className={`form-textarea ${formik.touched.detallesFalla && formik.errors.detallesFalla ? 'has-error' : ''}`}
                                        placeholder="Describe detalladamente el problema que presenta el equipo"
                                        value={formik.values.detallesFalla}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={formik.isSubmitting}
                                    ></textarea>
                                    {formik.touched.detallesFalla && formik.errors.detallesFalla && (
                                        <div className="text-danger text-sm mt-1">{formik.errors.detallesFalla}</div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="fechaCompra" className="flex items-center gap-1">
                                            <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 text-gray-500" />
                                            Fecha de Compra <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            ref={fechaCompraRef}
                                            id="fechaCompra"
                                            name="fechaCompra"
                                            type="text"
                                            className={`form-input ${formik.touched.fechaCompra && formik.errors.fechaCompra ? 'has-error' : ''}`}
                                            value={formik.values.fechaCompra}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={formik.isSubmitting}
                                            placeholder="Seleccione fecha"
                                            autoComplete="off"
                                        />
                                        {formik.touched.fechaCompra && formik.errors.fechaCompra && (
                                            <div className="text-danger text-sm mt-1">{formik.errors.fechaCompra}</div>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="tiendaSedeCompra" className="flex items-center gap-1">
                                            <FontAwesomeIcon icon={faStore} className="w-4 h-4 text-gray-500" />
                                            Tienda y Sede de Compra <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="tiendaSedeCompra"
                                            name="tiendaSedeCompra"
                                            type="text"
                                            placeholder="Ej: Tienda Principal - Miraflores"
                                            className={`form-input ${formik.touched.tiendaSedeCompra && formik.errors.tiendaSedeCompra ? 'has-error' : ''}`}
                                            value={formik.values.tiendaSedeCompra}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={formik.isSubmitting}
                                        />
                                        {formik.touched.tiendaSedeCompra && formik.errors.tiendaSedeCompra && (
                                            <div className="text-danger text-sm mt-1">{formik.errors.tiendaSedeCompra}</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* SECCIÓN 5: ARCHIVOS ADJUNTOS */}
                            <div className="border-l-4 border-primary pl-4 mb-6 mt-8">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <FontAwesomeIcon icon={faCamera} className="w-5 h-5 text-primary" />
                                    Archivos Adjuntos
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Sube imágenes para una mejor referencia (máx. 5MB por imagen)
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Foto o Video de la Falla */}
                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <label className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-300 font-medium">
                                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                                            <FontAwesomeIcon icon={faVideo} className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span>📸 🎥 Foto o Video de la Falla</span>
                                    </label>

                                    <div className="flex flex-col items-center gap-3">
                                        {!previewFalla ? (
                                            <div className="w-full">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageChange(e, setPreviewFalla)}
                                                    className="hidden"
                                                    id="upload-falla"
                                                    disabled={formik.isSubmitting}
                                                />
                                                <label
                                                    htmlFor="upload-falla"
                                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <FontAwesomeIcon icon={faCamera} className="w-8 h-8 text-gray-400 mb-2" />
                                                    <span className="text-sm text-gray-500">Haz clic para seleccionar</span>
                                                    <span className="text-xs text-gray-400 mt-1">JPG, PNG, GIF hasta 5MB</span>
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="relative w-full">
                                                <div className="relative rounded-lg overflow-hidden border-2 border-blue-200 dark:border-blue-800">
                                                    <img
                                                        src={previewFalla}
                                                        alt="Preview falla"
                                                        className="w-full h-48 object-cover cursor-pointer"
                                                        onClick={() => setModalImage(previewFalla)}
                                                    />
                                                    <div
                                                        className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center cursor-pointer"
                                                        onClick={() => setModalImage(previewFalla)}
                                                    >
                                                        <div className="bg-white bg-opacity-90 rounded-full px-3 py-1 text-sm text-gray-700 shadow-lg">
                                                            <FontAwesomeIcon icon={faSearch} className="w-3 h-3 mr-1" />
                                                            Clic para ampliar
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-all transform hover:scale-110 z-10"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPreviewFalla(null);
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                                                    </button>
                                                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                                                        Vista previa
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Foto de Boleta o Factura */}
                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <label className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-300 font-medium">
                                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                                            <FontAwesomeIcon icon={faFileInvoice} className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        </div>
                                        <span>📸🧾 Foto Nítida de la Boleta o Factura</span>
                                    </label>

                                    <div className="flex flex-col items-center gap-3">
                                        {!previewBoleta ? (
                                            <div className="w-full">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageChange(e, setPreviewBoleta)}
                                                    className="hidden"
                                                    id="upload-boleta"
                                                    disabled={formik.isSubmitting}
                                                />
                                                <label
                                                    htmlFor="upload-boleta"
                                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <FontAwesomeIcon icon={faFileInvoice} className="w-8 h-8 text-gray-400 mb-2" />
                                                    <span className="text-sm text-gray-500">Haz clic para seleccionar</span>
                                                    <span className="text-xs text-gray-400 mt-1">JPG, PNG, PDF hasta 5MB</span>
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="relative w-full">
                                                <div className="relative rounded-lg overflow-hidden border-2 border-green-200 dark:border-green-800">
                                                    <img
                                                        src={previewBoleta}
                                                        alt="Preview boleta"
                                                        className="w-full h-48 object-cover cursor-pointer"
                                                        onClick={() => setModalImage(previewBoleta)}
                                                    />
                                                    <div
                                                        className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center cursor-pointer"
                                                        onClick={() => setModalImage(previewBoleta)}
                                                    >
                                                        <div className="bg-white bg-opacity-90 rounded-full px-3 py-1 text-sm text-gray-700 shadow-lg">
                                                            <FontAwesomeIcon icon={faSearch} className="w-3 h-3 mr-1" />
                                                            Clic para ampliar
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-all transform hover:scale-110 z-10"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPreviewBoleta(null);
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                                                    </button>
                                                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                                                        Vista previa
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Foto del Número de Serie */}
                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 md:col-span-2 lg:col-span-1">
                                    <label className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-300 font-medium">
                                        <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                                            <FontAwesomeIcon icon={faImage} className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <span>📸🔢 Foto del Número de Serie del Equipo</span>
                                    </label>

                                    <div className="flex flex-col items-center gap-3">
                                        {!previewSerie ? (
                                            <div className="w-full">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageChange(e, setPreviewSerie)}
                                                    className="hidden"
                                                    id="upload-serie"
                                                    disabled={formik.isSubmitting}
                                                />
                                                <label
                                                    htmlFor="upload-serie"
                                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <FontAwesomeIcon icon={faImage} className="w-8 h-8 text-gray-400 mb-2" />
                                                    <span className="text-sm text-gray-500">Haz clic para seleccionar</span>
                                                    <span className="text-xs text-gray-400 mt-1">JPG, PNG, GIF hasta 5MB</span>
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="relative w-full">
                                                <div className="relative rounded-lg overflow-hidden border-2 border-purple-200 dark:border-purple-800">
                                                    <img
                                                        src={previewSerie}
                                                        alt="Preview serie"
                                                        className="w-full h-48 object-cover cursor-pointer"
                                                        onClick={() => setModalImage(previewSerie)}
                                                    />
                                                    <div
                                                        className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center cursor-pointer"
                                                        onClick={() => setModalImage(previewSerie)}
                                                    >
                                                        <div className="bg-white bg-opacity-90 rounded-full px-3 py-1 text-sm text-gray-700 shadow-lg">
                                                            <FontAwesomeIcon icon={faSearch} className="w-3 h-3 mr-1" />
                                                            Clic para ampliar
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-all transform hover:scale-110 z-10"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPreviewSerie(null);
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                                                    </button>
                                                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                                                        Vista previa
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Ubicación Google Maps */}
                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 md:col-span-2 lg:col-span-1">
                                    <label htmlFor="ubicacionGoogleMaps" className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-300 font-medium">
                                        <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full">
                                            <FontAwesomeIcon icon={faMap} className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <span>📍🗺️ Ubicación Exacta del Domicilio</span>
                                    </label>
                                    <div className="relative">
                                        <FontAwesomeIcon icon={faMap} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            id="ubicacionGoogleMaps"
                                            name="ubicacionGoogleMaps"
                                            type="url"
                                            placeholder="https://maps.google.com/?q=..."
                                            className="form-input pl-10 w-full"
                                            value={formik.values.ubicacionGoogleMaps}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={formik.isSubmitting}
                                        />
                                    </div>
                                    {formik.touched.ubicacionGoogleMaps && formik.errors.ubicacionGoogleMaps && (
                                        <div className="text-danger text-sm mt-2">{formik.errors.ubicacionGoogleMaps}</div>
                                    )}
                                    <p className="text-xs text-gray-400 mt-2">
                                        Ejemplo: https://maps.google.com/?q=-12.046374,-77.042793
                                    </p>
                                </div>
                            </div>

                            {/* BOTONES */}
                            <div className="flex items-center justify-end space-x-3 pt-5 border-t border-gray-200 dark:border-gray-700">
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
                                    className="btn btn-primary flex items-center gap-2 min-w-[140px] justify-center"
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
