import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import toastr from 'toastr';
import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import 'flatpickr/dist/flatpickr.css';
import axios from 'axios';
import Select from 'react-select'; // <-- IMPORTAR REACT-SELECT

// Importar modales
import ModalCategoria from './components/ModalCategoria';
import ModalModelo from './components/ModalModelo';

// Importaciones de FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTicket,
    faTag,
    faUser,
    faIdCard,
    faPhone,
    faMobile,
    faEnvelope,
    faMapMarkerAlt,
    faHome,
    faCity,
    faGlobe,
    faLaptop,
    faHashtag,
    faExclamationTriangle,
    faComment,
    faCalendar,
    faStore,
    faCamera,
    faVideo,
    faFileInvoice,
    faMap,
    faTimes,
    faSave,
    faPlus,
    faSpinner,
    faBuilding,
    faRoad,
    faImage,
    faSearch,
    faCheckCircle,
    faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

const CrearTicket = () => {
    const dispatch = useDispatch();
    const fechaCompraRef = useRef(null);
    const fileInputFallaRef = useRef(null);
    const fileInputBoletaRef = useRef(null);
    const fileInputSerieRef = useRef(null);

    // Estados para datos dinámicos del backend
    const [tiposDocumento, setTiposDocumento] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [modelosFiltrados, setModelosFiltrados] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [loadingModelos, setLoadingModelos] = useState(false);

    // Estados para ubigeo
    const [departamentos, setDepartamentos] = useState([]);
    const [provincias, setProvincias] = useState({});
    const [distritos, setDistritos] = useState({});
    const [provinciasFiltradas, setProvinciasFiltradas] = useState([]);
    const [distritosFiltrados, setDistritosFiltrados] = useState([]);
    const [loadingUbigeo, setLoadingUbigeo] = useState(true);

    // Estados para las previsualizaciones de imágenes
    const [fileFalla, setFileFalla] = useState(null);
    const [fileBoleta, setFileBoleta] = useState(null);
    const [fileSerie, setFileSerie] = useState(null);
    const [previewFalla, setPreviewFalla] = useState(null);
    const [previewBoleta, setPreviewBoleta] = useState(null);
    const [previewSerie, setPreviewSerie] = useState(null);

    // Estado para el modal de imagen ampliada
    const [modalImage, setModalImage] = useState(null);

    // Estados para modales de categoría y modelo
    const [modalCategoria, setModalCategoria] = useState(false);
    const [modalModelo, setModalModelo] = useState(false);

    // URL base de la API
    const API_URL = 'http://127.0.0.1:8000/api';

    // PRIMERO: Todos los useState están arriba
    // SEGUNDO: Aquí va useFormik
    const formik = useFormik({
        initialValues: {
            nombreCompleto: '',
            correoElectronico: '',
            idTipoDocumento: '',
            dni_ruc_ce: '',
            telefonoFijo: '',
            telefonoCelular: '',
            direccionCompleta: '',
            referenciaDomicilio: '',
            departamento: '',
            provincia: '',
            distrito: '',
            idCategoria: '',
            idModelo: '',
            serieProducto: '',
            detallesFalla: '',
            fechaCompra: '',
            tiendaSedeCompra: '',
            fotoVideoFalla: '',
            fotoBoletaFactura: '',
            fotoNumeroSerie: '',
            ubicacionGoogleMaps: '',
        },
        validationSchema: Yup.object({
            nombreCompleto: Yup.string().required('El nombre completo es requerido').min(3, 'Mínimo 3 caracteres').max(255, 'Máximo 255 caracteres'),

            correoElectronico: Yup.string().email('Correo electrónico inválido').required('El correo electrónico es requerido').max(255, 'Máximo 255 caracteres'),

            idTipoDocumento: Yup.number().required('El tipo de documento es requerido').positive('Seleccione un tipo de documento válido'),

            dni_ruc_ce: Yup.string()
                .required('El número de documento es requerido')
                .min(8, 'Mínimo 8 caracteres')
                .max(20, 'Máximo 20 caracteres')
                .matches(/^[0-9]+$/, 'Solo se permiten números'),

            telefonoCelular: Yup.string()
                .required('El teléfono celular es requerido')
                .min(9, 'Mínimo 9 dígitos')
                .max(20, 'Máximo 20 dígitos')
                .matches(/^[0-9]+$/, 'Solo se permiten números'),

            telefonoFijo: Yup.string()
                .nullable()
                .matches(/^[0-9-]+$/, 'Formato inválido'),

            direccionCompleta: Yup.string().required('La dirección completa es requerida').max(500, 'Máximo 500 caracteres'),

            referenciaDomicilio: Yup.string().nullable().max(500, 'Máximo 500 caracteres'),

            departamento: Yup.string().required('El departamento es requerido'),

            provincia: Yup.string().required('La provincia es requerida'),

            distrito: Yup.string().required('El distrito es requerido'),

            idCategoria: Yup.number().required('La categoría del producto es requerida').positive('Seleccione una categoría válida'),

            idModelo: Yup.number().required('El modelo del producto es requerido').positive('Seleccione un modelo válido'),

            serieProducto: Yup.string().required('El número de serie es requerido').max(100, 'Máximo 100 caracteres'),

            detallesFalla: Yup.string().required('Los detalles de la falla son requeridos').min(10, 'Describe la falla con más detalle (mínimo 10 caracteres)').max(5000, 'Máximo 5000 caracteres'),

            fechaCompra: Yup.date().required('La fecha de compra es requerida').max(new Date(), 'La fecha no puede ser futura').typeError('Fecha inválida - Use el formato DD/MM/AAAA'),

            tiendaSedeCompra: Yup.string().required('La tienda y sede de compra es requerida').max(255, 'Máximo 255 caracteres'),

            fotoVideoFalla: Yup.string().nullable().url('Debe ser una URL válida'),

            fotoBoletaFactura: Yup.string().nullable().url('Debe ser una URL válida'),

            fotoNumeroSerie: Yup.string().nullable().url('Debe ser una URL válida'),

            ubicacionGoogleMaps: Yup.string().nullable().url('Debe ser una URL válida de Google Maps'),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);

            try {
                toastr.info('Creando ticket...', 'Procesando');

                const token = localStorage.getItem('token');

                const formData = new FormData();

                // Agregar todos los campos del formulario
                Object.keys(values).forEach((key) => {
                    if (values[key] !== null && values[key] !== undefined && values[key] !== '') {
                        formData.append(key, values[key]);
                    }
                });

                // Agregar archivos si existen
                if (fileFalla) formData.append('fotoVideoFalla', fileFalla);
                if (fileBoleta) formData.append('fotoBoletaFactura', fileBoleta);
                if (fileSerie) formData.append('fotoNumeroSerie', fileSerie);

                const response = await axios.post(`${API_URL}/tickets`, formData, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : '',
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.data.success) {
                    toastr.clear();
                    toastr.success('✅ ¡Ticket creado exitosamente!', 'Éxito');

                    resetForm();

                    setFileFalla(null);
                    setFileBoleta(null);
                    setFileSerie(null);
                    setPreviewFalla(null);
                    setPreviewBoleta(null);
                    setPreviewSerie(null);

                    if (fileInputFallaRef.current) fileInputFallaRef.current.value = '';
                    if (fileInputBoletaRef.current) fileInputBoletaRef.current.value = '';
                    if (fileInputSerieRef.current) fileInputSerieRef.current.value = '';

                    setTimeout(() => {
                        window.location.href = '/tickets';
                    }, 2000);
                }
            } catch (error) {
                console.error('Error al crear ticket:', error);

                if (error.response) {
                    if (error.response.status === 422) {
                        const errors = error.response.data.errors;
                        Object.keys(errors).forEach((key) => {
                            toastr.error(errors[key][0], 'Error de validación');
                        });
                    } else if (error.response.status === 401) {
                        toastr.error('No autorizado. Inicia sesión nuevamente.', 'Error');
                    } else {
                        toastr.error(error.response.data.message || 'Error en el servidor', 'Error');
                    }
                } else if (error.request) {
                    toastr.error('No se pudo conectar con el servidor. Verifica que Laravel esté corriendo en http://127.0.0.1:8000', 'Error');
                } else {
                    toastr.error('Error al crear el ticket', 'Error');
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    // TERCERO: Todos los useEffect después de useFormik
    useEffect(() => {
        dispatch(setPageTitle('Crear Ticket'));
        cargarDatosFormulario();
        cargarMarcas();

        toastr.options = {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
            timeOut: 3000,
            showDuration: 300,
            hideDuration: 500,
        };
    }, []);

    // Cargar ubigeos desde los archivos JSON
    useEffect(() => {
        const cargarUbigeos = async () => {
            setLoadingUbigeo(true);
            try {
                // Cargar departamentos (array)
                const deptosResponse = await fetch('/assets/ubigeos/departamentos.json');
                const deptosData = await deptosResponse.json();
                setDepartamentos(deptosData);

                // Cargar provincias (objeto con clave = id_departamento)
                const provsResponse = await fetch('/assets/ubigeos/provincias.json');
                const provsData = await provsResponse.json();
                setProvincias(provsData);

                // Cargar distritos (objeto con clave = id_provincia)
                const distsResponse = await fetch('/assets/ubigeos/distritos.json');
                const distsData = await distsResponse.json();
                setDistritos(distsData);
            } catch (error) {
                console.error('Error cargando ubigeos:', error);
                toastr.error('Error al cargar los datos de ubicación', 'Error');
            } finally {
                setLoadingUbigeo(false);
            }
        };

        cargarUbigeos();
    }, []);

    useEffect(() => {
        console.log("Inicializando flatpickr...");
        console.log("Elemento ref:", fechaCompraRef.current);

        if (!fechaCompraRef.current) {
            console.log("El elemento ref es null - esperando a que se renderice");
            return;
        }

        console.log("Inicializando flatpickr en elemento:", fechaCompraRef.current);

        try {
            const fp = flatpickr(fechaCompraRef.current, {
                locale: Spanish,
                dateFormat: "d/m/Y",
                maxDate: "today",
                allowInput: true,
                clickOpens: true,
                onChange: (selectedDates, dateStr) => {
                    console.log("Fecha seleccionada:", dateStr);
                    if (selectedDates.length) {
                        const date = selectedDates[0];
                        const fechaDB = date.toISOString().split('T')[0];
                        console.log("Fecha para DB:", fechaDB);
                        formik.setFieldValue("fechaCompra", fechaDB);
                    }
                }
            });

            console.log("Flatpickr inicializado correctamente");

            return () => {
                console.log("Destruyendo flatpickr");
                fp.destroy();
            };
        } catch (error) {
            console.error("Error al inicializar flatpickr:", error);
        }
    }, [fechaCompraRef.current]);

    // Filtrar provincias cuando se selecciona un departamento
    useEffect(() => {
        if (formik.values.departamento && provincias[formik.values.departamento]) {
            setProvinciasFiltradas(provincias[formik.values.departamento]);
            // Resetear provincia y distrito
            formik.setFieldValue('provincia', '');
            formik.setFieldValue('distrito', '');
            setDistritosFiltrados([]);
        } else {
            setProvinciasFiltradas([]);
        }
    }, [formik.values.departamento, provincias]);

    // Filtrar distritos cuando se selecciona una provincia
    useEffect(() => {
        if (formik.values.provincia && distritos[formik.values.provincia]) {
            setDistritosFiltrados(distritos[formik.values.provincia]);
            // Resetear distrito
            formik.setFieldValue('distrito', '');
        } else {
            setDistritosFiltrados([]);
        }
    }, [formik.values.provincia, distritos]);

    // Cargar modelos cuando se selecciona una categoría
    useEffect(() => {
        if (formik.values.idCategoria) {
            cargarModelosPorCategoria(formik.values.idCategoria);
        } else {
            setModelosFiltrados([]);
            formik.setFieldValue('idModelo', '');
        }
    }, [formik.values.idCategoria]);

    // Funciones auxiliares
    const cargarDatosFormulario = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/tickets-form-data`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                    Accept: 'application/json',
                },
            });

            if (response.data.success) {
                setTiposDocumento(response.data.data.tiposDocumento || []);
                setCategorias(response.data.data.categorias || []);
                setModelos(response.data.data.modelos || []);
            }
        } catch (error) {
            console.error('Error cargando datos:', error);
            toastr.error('No se pudieron cargar los datos del formulario', 'Error');

            setTiposDocumento([
                { idTipoDocumento: 1, nombre: 'DNI' },
                { idTipoDocumento: 2, nombre: 'RUC' },
                { idTipoDocumento: 3, nombre: 'Carnet de Extranjería' },
            ]);

            setCategorias([
                { idCategoria: 1, nombre: 'Laptop' },
                { idCategoria: 2, nombre: 'Desktop' },
                { idCategoria: 3, nombre: 'Tablet' },
                { idCategoria: 4, nombre: 'Celular' },
                { idCategoria: 5, nombre: 'Impresora' },
                { idCategoria: 6, nombre: 'Monitor' },
                { idCategoria: 7, nombre: 'Otro' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const cargarMarcas = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/marcas`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                    Accept: 'application/json'
                }
            });
            if (response.data.success) {
                setMarcas(response.data.data);
            }
        } catch (error) {
            console.error('Error cargando marcas:', error);
        }
    };

    const cargarModelosPorCategoria = async (categoriaId) => {
        setLoadingModelos(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/modelos-por-categoria/${categoriaId}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                    Accept: 'application/json',
                },
            });

            if (response.data.success) {
                setModelosFiltrados(response.data.data);
            }
        } catch (error) {
            console.error('Error cargando modelos:', error);
            const filtrados = modelos.filter((m) => m.idCategoria === parseInt(categoriaId));
            setModelosFiltrados(filtrados);
        } finally {
            setLoadingModelos(false);
        }
    };

    const handleImageChange = (e, setFile, setPreview, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toastr.error('La imagen no debe superar los 5MB', 'Error');
                e.target.value = '';
                return;
            }

            if (!file.type.startsWith('image/')) {
                toastr.error('Solo se permiten imágenes', 'Error');
                e.target.value = '';
                return;
            }

            setFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);

            if (fieldName) {
                formik.setFieldValue(fieldName, '');
            }
        }
    };

    const handleCategoriaCreada = (nuevaCategoria) => {
        setCategorias(prev => [...prev, nuevaCategoria]);
        formik.setFieldValue('idCategoria', nuevaCategoria.idCategoria);
        // Opcional: recargar modelos para esta nueva categoría
        cargarModelosPorCategoria(nuevaCategoria.idCategoria);
        toastr.success('Categoría creada exitosamente');
    };

    const handleModeloCreado = (nuevoModelo) => {
        setModelos(prev => [...prev, nuevoModelo]);
        if (nuevoModelo.idCategoria === formik.values.idCategoria) {
            setModelosFiltrados(prev => [...prev, nuevoModelo]);
        }
        formik.setFieldValue('idModelo', nuevoModelo.idModelo);
        toastr.success('Modelo creado exitosamente');
    };

    const ImageModal = ({ image, onClose }) => {
        if (!image) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={onClose}>
                <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-10"
                    >
                        <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                    </button>
                    <img src={image} alt="Vista ampliada" className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
                </div>
            </div>
        );
    };

    // ============================================
    // CONFIGURACIÓN DE REACT-SELECT CON MODO DARK
    // ============================================

    // Función para obtener estilos según el tema actual
    const getSelectStyles = (isDark) => ({
        control: (base, state) => ({
            ...base,
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            borderColor: state.isFocused
                ? '#4361ee'
                : isDark
                    ? '#4b5563'
                    : '#e5e7eb',
            boxShadow: state.isFocused ? '0 0 0 1px #4361ee' : 'none',
            '&:hover': {
                borderColor: '#4361ee'
            },
            minHeight: '38px',
            borderRadius: '6px',
            color: isDark ? '#e5e7eb' : '#1f2937',
        }),
        option: (base, { isFocused, isSelected }) => ({
            ...base,
            backgroundColor: isSelected
                ? '#4361ee'
                : isFocused
                    ? isDark
                        ? '#374151'
                        : '#f3f4f6'
                    : isDark
                        ? '#1f2937'
                        : '#ffffff',
            color: isSelected
                ? '#ffffff'
                : isDark
                    ? '#e5e7eb'
                    : '#1f2937',
            cursor: 'pointer',
            '&:active': {
                backgroundColor: '#4361ee',
                color: '#ffffff',
            },
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
            boxShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }),
        menuList: (base) => ({
            ...base,
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
            },
            '&::-webkit-scrollbar-track': {
                background: isDark ? '#374151' : '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
                background: isDark ? '#4b5563' : '#888',
                borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
                background: isDark ? '#6b7280' : '#555',
            },
        }),
        placeholder: (base) => ({
            ...base,
            color: isDark ? '#9ca3af' : '#6b7280',
        }),
        singleValue: (base) => ({
            ...base,
            color: isDark ? '#e5e7eb' : '#1f2937',
        }),
        input: (base) => ({
            ...base,
            color: isDark ? '#e5e7eb' : '#1f2937',
        }),
        indicatorSeparator: (base) => ({
            ...base,
            backgroundColor: isDark ? '#4b5563' : '#e5e7eb',
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: isDark ? '#9ca3af' : '#6b7280',
            '&:hover': {
                color: isDark ? '#d1d5db' : '#374151',
            },
        }),
        clearIndicator: (base) => ({
            ...base,
            color: isDark ? '#9ca3af' : '#6b7280',
            '&:hover': {
                color: isDark ? '#d1d5db' : '#374151',
            },
        }),
        loadingMessage: (base) => ({
            ...base,
            color: isDark ? '#e5e7eb' : '#1f2937',
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
        }),
        noOptionsMessage: (base) => ({
            ...base,
            color: isDark ? '#e5e7eb' : '#1f2937',
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
        }),
    });

    // Estado para detectar el tema actual
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Detectar cambios en el tema
    useEffect(() => {
        // Función para verificar el tema actual
        const checkDarkMode = () => {
            const isDark = document.documentElement.classList.contains('dark');
            setIsDarkMode(isDark);
        };

        // Verificar inicial
        checkDarkMode();

        // Observer para cambios en las clases del elemento html
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    // Convertir categorías al formato que react-select entiende
    const categoriaOptions = categorias.map(cat => ({
        value: cat.idCategoria,
        label: cat.nombre
    }));

    // Convertir modelos filtrados al formato que react-select entiende
    const modeloOptions = modelosFiltrados.map(mod => ({
        value: mod.idModelo,
        label: mod.nombre
    }));

    // Manejar cambio de categoría
    const handleCategoriaChange = (selectedOption) => {
        formik.setFieldValue('idCategoria', selectedOption ? selectedOption.value : '');
    };

    // Manejar cambio de modelo
    const handleModeloChange = (selectedOption) => {
        formik.setFieldValue('idModelo', selectedOption ? selectedOption.value : '');
    };

    return (
        <div>
            {/* Breadcrumb */}
            <ul className="flex space-x-2 rtl:space-x-reverse items-center mb-5">
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

            <ImageModal image={modalImage} onClose={() => setModalImage(null)} />

            <div className="pt-5">
                <div className="panel">
                    <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
                                <FontAwesomeIcon icon={faTicket} className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white-light">Crear Nuevo Ticket de Servicio</h1>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-base flex items-center gap-2">
                            <FontAwesomeIcon icon={faComment} className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            Completa todos los campos requeridos para generar el ticket de servicio.
                        </p>
                    </div>

                    {loading || loadingUbigeo ? (
                        <div className="flex justify-center items-center py-20">
                            <FontAwesomeIcon icon={faSpinner} className="w-10 h-10 text-primary animate-spin" />
                            <span className="ml-3 text-lg">Cargando datos del formulario...</span>
                        </div>
                    ) : (
                        <div className="mb-5">
                            <form onSubmit={formik.handleSubmit} className="space-y-8" encType="multipart/form-data">
                                {/* SECCIÓN 1: DATOS PERSONALES */}
                                <div className="border-l-4 border-primary pl-4 mb-6">
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-primary" />
                                        Datos del Cliente
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="nombreCompleto" className="flex items-center gap-1 font-medium">
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
                                            disabled={submitting}
                                        />
                                        {formik.touched.nombreCompleto && formik.errors.nombreCompleto && <div className="text-danger text-sm mt-1">{formik.errors.nombreCompleto}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="correoElectronico" className="flex items-center gap-1 font-medium">
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
                                            disabled={submitting}
                                        />
                                        {formik.touched.correoElectronico && formik.errors.correoElectronico && <div className="text-danger text-sm mt-1">{formik.errors.correoElectronico}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="idTipoDocumento" className="flex items-center gap-1 font-medium">
                                            <FontAwesomeIcon icon={faIdCard} className="w-4 h-4 text-gray-500" />
                                            Tipo de Documento <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="idTipoDocumento"
                                            name="idTipoDocumento"
                                            className={`form-select ${formik.touched.idTipoDocumento && formik.errors.idTipoDocumento ? 'has-error' : ''}`}
                                            value={formik.values.idTipoDocumento}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={submitting}
                                        >
                                            <option value="">Seleccione tipo</option>
                                            {tiposDocumento.map((tipo) => (
                                                <option key={tipo.idTipoDocumento} value={tipo.idTipoDocumento}>
                                                    {tipo.nombre}
                                                </option>
                                            ))}
                                        </select>
                                        {formik.touched.idTipoDocumento && formik.errors.idTipoDocumento && <div className="text-danger text-sm mt-1">{formik.errors.idTipoDocumento}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="dni_ruc_ce" className="flex items-center gap-1 font-medium">
                                            <FontAwesomeIcon icon={faHashtag} className="w-4 h-4 text-gray-500" />
                                            Número de Documento <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="dni_ruc_ce"
                                            name="dni_ruc_ce"
                                            type="text"
                                            placeholder="Ej: 12345678"
                                            className={`form-input ${formik.touched.dni_ruc_ce && formik.errors.dni_ruc_ce ? 'has-error' : ''}`}
                                            value={formik.values.dni_ruc_ce}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={submitting}
                                        />
                                        {formik.touched.dni_ruc_ce && formik.errors.dni_ruc_ce && <div className="text-danger text-sm mt-1">{formik.errors.dni_ruc_ce}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="telefonoFijo" className="flex items-center gap-1 font-medium">
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
                                            disabled={submitting}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="telefonoCelular" className="flex items-center gap-1 font-medium">
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
                                            disabled={submitting}
                                        />
                                        {formik.touched.telefonoCelular && formik.errors.telefonoCelular && <div className="text-danger text-sm mt-1">{formik.errors.telefonoCelular}</div>}
                                    </div>
                                </div>

                                {/* SECCIÓN 2: DIRECCIÓN */}
                                <div className="border-l-4 border-primary pl-4 mb-6 mt-8">
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="w-5 h-5 text-primary" />
                                        Dirección del Cliente
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="direccionCompleta" className="flex items-center gap-1 font-medium">
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
                                                disabled={submitting}
                                            />
                                            {formik.touched.direccionCompleta && formik.errors.direccionCompleta && <div className="text-danger text-sm mt-1">{formik.errors.direccionCompleta}</div>}
                                        </div>

                                        <div>
                                            <label htmlFor="referenciaDomicilio" className="flex items-center gap-1 font-medium">
                                                <FontAwesomeIcon icon={faRoad} className="w-4 h-4 text-gray-500" />
                                                Referencia
                                            </label>
                                            <input
                                                id="referenciaDomicilio"
                                                name="referenciaDomicilio"
                                                type="text"
                                                placeholder="Ej: Frente al parque"
                                                className="form-input"
                                                value={formik.values.referenciaDomicilio}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                disabled={submitting}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* DEPARTAMENTO */}
                                        <div>
                                            <label htmlFor="departamento" className="flex items-center gap-1 font-medium">
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
                                                disabled={submitting}
                                            >
                                                <option value="">Seleccione departamento</option>
                                                {departamentos.map((depto) => (
                                                    <option key={depto.id_ubigeo} value={depto.id_ubigeo}>
                                                        {depto.nombre_ubigeo}
                                                    </option>
                                                ))}
                                            </select>
                                            {formik.touched.departamento && formik.errors.departamento && <div className="text-danger text-sm mt-1">{formik.errors.departamento}</div>}
                                        </div>

                                        {/* PROVINCIA */}
                                        <div>
                                            <label htmlFor="provincia" className="flex items-center gap-1 font-medium">
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
                                                disabled={!formik.values.departamento || submitting}
                                            >
                                                <option value="">{!formik.values.departamento ? 'Primero seleccione departamento' : 'Seleccione provincia'}</option>
                                                {provinciasFiltradas.map((prov) => (
                                                    <option key={prov.id_ubigeo} value={prov.id_ubigeo}>
                                                        {prov.nombre_ubigeo}
                                                    </option>
                                                ))}
                                            </select>
                                            {formik.touched.provincia && formik.errors.provincia && <div className="text-danger text-sm mt-1">{formik.errors.provincia}</div>}
                                        </div>

                                        {/* DISTRITO */}
                                        <div>
                                            <label htmlFor="distrito" className="flex items-center gap-1 font-medium">
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
                                                disabled={!formik.values.provincia || submitting}
                                            >
                                                <option value="">{!formik.values.provincia ? 'Primero seleccione provincia' : 'Seleccione distrito'}</option>
                                                {distritosFiltrados.map((dist) => (
                                                    <option key={dist.id_ubigeo} value={dist.id_ubigeo}>
                                                        {dist.nombre_ubigeo}
                                                    </option>
                                                ))}
                                            </select>
                                            {formik.touched.distrito && formik.errors.distrito && <div className="text-danger text-sm mt-1">{formik.errors.distrito}</div>}
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN 3: DATOS DEL PRODUCTO - CON BOTONES PARA CREAR Y SELECT2 */}
                                <div className="border-l-4 border-primary pl-4 mb-6 mt-8">
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <FontAwesomeIcon icon={faLaptop} className="w-5 h-5 text-primary" />
                                        Datos del Producto
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Categoría con botón + y SELECT2 */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label htmlFor="idCategoria" className="flex items-center gap-1 font-medium">
                                                <FontAwesomeIcon icon={faLaptop} className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                Categoría <span className="text-red-500">*</span>
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setModalCategoria(true)}
                                                className="text-xs bg-primary text-white px-2 py-1 rounded-full hover:bg-primary/80 transition-colors flex items-center gap-1"
                                            >
                                                <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                                                Nueva
                                            </button>
                                        </div>
                                        <Select
                                            id="idCategoria"
                                            name="idCategoria"
                                            options={categoriaOptions}
                                            value={categoriaOptions.find(option => option.value === formik.values.idCategoria)}
                                            onChange={handleCategoriaChange}
                                            onBlur={() => formik.setFieldTouched('idCategoria', true)}
                                            placeholder="Seleccione categoría"
                                            isClearable
                                            isSearchable
                                            styles={getSelectStyles(isDarkMode)}
                                            className={formik.touched.idCategoria && formik.errors.idCategoria ? 'has-error' : ''}
                                            isDisabled={submitting}
                                        />
                                        {formik.touched.idCategoria && formik.errors.idCategoria && (
                                            <div className="text-danger text-sm mt-1">{formik.errors.idCategoria}</div>
                                        )}
                                    </div>

                                    {/* Modelo con botón + y SELECT2 */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label htmlFor="idModelo" className="flex items-center gap-1 font-medium">
                                                <FontAwesomeIcon icon={faTag} className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                Modelo <span className="text-red-500">*</span>
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setModalModelo(true)}
                                                className="text-xs bg-primary text-white px-2 py-1 rounded-full hover:bg-primary/80 transition-colors flex items-center gap-1"
                                            >
                                                <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                                                Nuevo
                                            </button>
                                        </div>
                                        <Select
                                            id="idModelo"
                                            name="idModelo"
                                            options={modeloOptions}
                                            value={modeloOptions.find(option => option.value === formik.values.idModelo)}
                                            onChange={handleModeloChange}
                                            onBlur={() => formik.setFieldTouched('idModelo', true)}
                                            placeholder={loadingModelos ? 'Cargando...' : !formik.values.idCategoria ? 'Primero seleccione categoría' : 'Seleccione modelo'}
                                            isClearable
                                            isSearchable
                                            styles={getSelectStyles(isDarkMode)}
                                            className={formik.touched.idModelo && formik.errors.idModelo ? 'has-error' : ''}
                                            isDisabled={!formik.values.idCategoria || submitting || loadingModelos}
                                            isLoading={loadingModelos}
                                        />
                                        {formik.touched.idModelo && formik.errors.idModelo && (
                                            <div className="text-danger text-sm mt-1">{formik.errors.idModelo}</div>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="serieProducto" className="flex items-center gap-1 font-medium">
                                            <FontAwesomeIcon icon={faHashtag} className="w-4 h-4 text-gray-500" />
                                            Número de Serie <span className="text-red-500">*</span>
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
                                            disabled={submitting}
                                        />
                                        {formik.touched.serieProducto && formik.errors.serieProducto && <div className="text-danger text-sm mt-1">{formik.errors.serieProducto}</div>}
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
                                        <label htmlFor="detallesFalla" className="flex items-center gap-1 font-medium">
                                            <FontAwesomeIcon icon={faComment} className="w-4 h-4 text-gray-500" />
                                            Detalles de la Falla <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="detallesFalla"
                                            name="detallesFalla"
                                            rows={4}
                                            className={`form-textarea ${formik.touched.detallesFalla && formik.errors.detallesFalla ? 'has-error' : ''}`}
                                            placeholder="Describe detalladamente el problema que presenta el equipo. Incluye cuándo ocurre, qué mensajes de error aparecen, etc."
                                            value={formik.values.detallesFalla}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={submitting}
                                        />
                                        {formik.touched.detallesFalla && formik.errors.detallesFalla && <div className="text-danger text-sm mt-1">{formik.errors.detallesFalla}</div>}
                                        <div className="text-xs text-gray-500 mt-1">{formik.values.detallesFalla.length}/5000 caracteres</div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="fechaCompra" className="flex items-center gap-1 font-medium">
                                                <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                Fecha de Compra <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                ref={fechaCompraRef}
                                                id="fechaCompra"
                                                name="fechaCompra"
                                                type="text"
                                                placeholder="DD/MM/AAAA"
                                                className={`form-input dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${formik.touched.fechaCompra && formik.errors.fechaCompra ? 'has-error' : ''
                                                    }`}
                                                style={{
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    zIndex: 1,
                                                }}
                                                autoComplete="off"
                                            />
                                            {formik.touched.fechaCompra && formik.errors.fechaCompra && (
                                                <div className="text-danger text-sm mt-1">{formik.errors.fechaCompra}</div>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="tiendaSedeCompra" className="flex items-center gap-1 font-medium">
                                                <FontAwesomeIcon icon={faStore} className="w-4 h-4 text-gray-500" />
                                                Tienda de Compra <span className="text-red-500">*</span>
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
                                                disabled={submitting}
                                            />
                                            {formik.touched.tiendaSedeCompra && formik.errors.tiendaSedeCompra && <div className="text-danger text-sm mt-1">{formik.errors.tiendaSedeCompra}</div>}
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN 5: ARCHIVOS ADJUNTOS */}
                                <div className="border-l-4 border-primary pl-4 mb-6 mt-8">
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <FontAwesomeIcon icon={faCamera} className="w-5 h-5 text-primary" />
                                        Archivos Adjuntos
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">Sube imágenes (máx. 5MB por imagen, formatos: JPG, PNG, GIF)</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Foto Falla */}
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
                                        <label className="flex items-center gap-2 mb-3 font-medium">
                                            <div className="bg-blue-100 p-2 rounded-full">
                                                <FontAwesomeIcon icon={faVideo} className="w-4 h-4 text-blue-600" />
                                            </div>
                                            Foto/Video de la Falla
                                        </label>

                                        <div className="flex flex-col items-center gap-3">
                                            {!previewFalla ? (
                                                <div className="w-full">
                                                    <input
                                                        ref={fileInputFallaRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageChange(e, setFileFalla, setPreviewFalla, 'fotoVideoFalla')}
                                                        className="hidden"
                                                        id="upload-falla"
                                                        disabled={submitting}
                                                    />
                                                    <label
                                                        htmlFor="upload-falla"
                                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100"
                                                    >
                                                        <FontAwesomeIcon icon={faCamera} className="w-8 h-8 text-gray-400 mb-2" />
                                                        <span className="text-sm text-gray-500">Seleccionar archivo</span>
                                                    </label>
                                                </div>
                                            ) : (
                                                <div className="relative w-full">
                                                    <img src={previewFalla} alt="Preview" className="w-full h-48 object-cover rounded-lg cursor-pointer" onClick={() => setModalImage(previewFalla)} />
                                                    <button
                                                        type="button"
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8"
                                                        onClick={() => {
                                                            setFileFalla(null);
                                                            setPreviewFalla(null);
                                                            if (fileInputFallaRef.current) fileInputFallaRef.current.value = '';
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Foto Boleta */}
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
                                        <label className="flex items-center gap-2 mb-3 font-medium">
                                            <div className="bg-green-100 p-2 rounded-full">
                                                <FontAwesomeIcon icon={faFileInvoice} className="w-4 h-4 text-green-600" />
                                            </div>
                                            Foto de Boleta/Factura
                                        </label>

                                        <div className="flex flex-col items-center gap-3">
                                            {!previewBoleta ? (
                                                <div className="w-full">
                                                    <input
                                                        ref={fileInputBoletaRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageChange(e, setFileBoleta, setPreviewBoleta, 'fotoBoletaFactura')}
                                                        className="hidden"
                                                        id="upload-boleta"
                                                        disabled={submitting}
                                                    />
                                                    <label
                                                        htmlFor="upload-boleta"
                                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100"
                                                    >
                                                        <FontAwesomeIcon icon={faFileInvoice} className="w-8 h-8 text-gray-400 mb-2" />
                                                        <span className="text-sm text-gray-500">Seleccionar archivo</span>
                                                    </label>
                                                </div>
                                            ) : (
                                                <div className="relative w-full">
                                                    <img
                                                        src={previewBoleta}
                                                        alt="Preview"
                                                        className="w-full h-48 object-cover rounded-lg cursor-pointer"
                                                        onClick={() => setModalImage(previewBoleta)}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8"
                                                        onClick={() => {
                                                            setFileBoleta(null);
                                                            setPreviewBoleta(null);
                                                            if (fileInputBoletaRef.current) fileInputBoletaRef.current.value = '';
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Foto Serie */}
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
                                        <label className="flex items-center gap-2 mb-3 font-medium">
                                            <div className="bg-purple-100 p-2 rounded-full">
                                                <FontAwesomeIcon icon={faImage} className="w-4 h-4 text-purple-600" />
                                            </div>
                                            Foto del Número de Serie
                                        </label>

                                        <div className="flex flex-col items-center gap-3">
                                            {!previewSerie ? (
                                                <div className="w-full">
                                                    <input
                                                        ref={fileInputSerieRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageChange(e, setFileSerie, setPreviewSerie, 'fotoNumeroSerie')}
                                                        className="hidden"
                                                        id="upload-serie"
                                                        disabled={submitting}
                                                    />
                                                    <label
                                                        htmlFor="upload-serie"
                                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100"
                                                    >
                                                        <FontAwesomeIcon icon={faImage} className="w-8 h-8 text-gray-400 mb-2" />
                                                        <span className="text-sm text-gray-500">Seleccionar archivo</span>
                                                    </label>
                                                </div>
                                            ) : (
                                                <div className="relative w-full">
                                                    <img src={previewSerie} alt="Preview" className="w-full h-48 object-cover rounded-lg cursor-pointer" onClick={() => setModalImage(previewSerie)} />
                                                    <button
                                                        type="button"
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8"
                                                        onClick={() => {
                                                            setFileSerie(null);
                                                            setPreviewSerie(null);
                                                            if (fileInputSerieRef.current) fileInputSerieRef.current.value = '';
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Ubicación Google Maps */}
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
                                        <label htmlFor="ubicacionGoogleMaps" className="flex items-center gap-2 mb-3 font-medium">
                                            <div className="bg-orange-100 p-2 rounded-full">
                                                <FontAwesomeIcon icon={faMap} className="w-4 h-4 text-orange-600" />
                                            </div>
                                            Ubicación Google Maps
                                        </label>
                                        <input
                                            id="ubicacionGoogleMaps"
                                            name="ubicacionGoogleMaps"
                                            type="url"
                                            placeholder="https://maps.google.com/?q=..."
                                            className="form-input w-full"
                                            value={formik.values.ubicacionGoogleMaps}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={submitting}
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Ejemplo: https://maps.google.com/?q=-12.046374,-77.042793</p>
                                    </div>
                                </div>

                                {/* BOTONES */}
                                <div className="flex items-center justify-end space-x-3 pt-5 border-t">
                                    <Link to="/tickets">
                                        <button type="button" className="btn btn-outline-danger flex items-center gap-2" disabled={submitting}>
                                            <FontAwesomeIcon icon={faTimes} />
                                            Cancelar
                                        </button>
                                    </Link>
                                    <button type="submit" className="btn btn-primary flex items-center gap-2 min-w-[140px] justify-center" disabled={submitting || !formik.isValid}>
                                        {submitting ? (
                                            <>
                                                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                                Creando...
                                            </>
                                        ) : (
                                            <>
                                                <FontAwesomeIcon icon={faSave} />
                                                Crear Ticket
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Modales */}
            <ModalCategoria
                modal={modalCategoria}
                setModal={setModalCategoria}
                onCategoriaCreada={handleCategoriaCreada}
                API_URL={API_URL}
            />

            <ModalModelo
                modal={modalModelo}
                setModal={setModalModelo}
                onModeloCreado={handleModeloCreado}
                categorias={categorias}
                marcas={marcas}
                API_URL={API_URL}
            />
        </div>
    );
};

export default CrearTicket;
