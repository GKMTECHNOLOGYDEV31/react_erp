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
import Select from 'react-select';

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
    faFilePdf,
    faFileWord,
    faFile,
    faDownload,
    faExclamationCircle,
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

    // Estados para los archivos
    const [fileFalla, setFileFalla] = useState(null);
    const [fileBoleta, setFileBoleta] = useState(null);
    const [fileSerie, setFileSerie] = useState(null);
    const [previewFalla, setPreviewFalla] = useState(null);
    const [previewBoleta, setPreviewBoleta] = useState(null);
    const [previewSerie, setPreviewSerie] = useState(null);
    const [fileTypeFalla, setFileTypeFalla] = useState(null);
    const [fileTypeBoleta, setFileTypeBoleta] = useState(null);
    const [fileTypeSerie, setFileTypeSerie] = useState(null);
    const [fileNameFalla, setFileNameFalla] = useState('');
    const [fileNameBoleta, setFileNameBoleta] = useState('');
    const [fileNameSerie, setFileNameSerie] = useState('');

    // Estados para errores de archivos
    const [fileFallaError, setFileFallaError] = useState('');
    const [fileBoletaError, setFileBoletaError] = useState('');
    const [fileSerieError, setFileSerieError] = useState('');

    // Estado para el modal de archivo ampliado
    const [modalFile, setModalFile] = useState(null);
    const [modalFileType, setModalFileType] = useState(null);

    // Estados para modales de categoría y modelo
    const [modalCategoria, setModalCategoria] = useState(false);
    const [modalModelo, setModalModelo] = useState(false);

    // URL base de la API
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
    // Función auxiliar para obtener el icono según el tipo de archivo
    const getFileIcon = (fileName, fileType) => {
        if (!fileName) return faFile;
        
        const extension = fileName.split('.').pop()?.toLowerCase();
        
        if (extension === 'pdf') return faFilePdf;
        if (extension === 'doc' || extension === 'docx') return faFileWord;
        if (fileType && fileType.startsWith('image/')) return faImage;
        return faFile;
    };

    // Función auxiliar para obtener el color del icono según el tipo de archivo
    const getFileIconColor = (fileName) => {
        if (!fileName) return 'text-gray-500';
        
        const extension = fileName.split('.').pop()?.toLowerCase();
        
        if (extension === 'pdf') return 'text-red-500';
        if (extension === 'doc' || extension === 'docx') return 'text-blue-500';
        return 'text-gray-500';
    };

    // Función auxiliar para obtener el texto del tipo de archivo
    const getFileTypeText = (fileName) => {
        if (!fileName) return 'Archivo';
        
        const extension = fileName.split('.').pop()?.toUpperCase();
        
        if (extension === 'PDF') return 'PDF';
        if (extension === 'DOC' || extension === 'DOCX') return 'Documento Word';
        if (extension === 'JPG' || extension === 'JPEG') return 'Imagen JPG';
        if (extension === 'PNG') return 'Imagen PNG';
        if (extension === 'GIF') return 'Imagen GIF';
        return `Archivo ${extension}`;
    };

    // Función para manejar la visualización del archivo
    const handleFilePreview = (file, fileType, previewUrl, fileUrl) => {
        if (!file) return;
        
        if (fileType && fileType.startsWith('image/')) {
            setModalFile(previewUrl);
            setModalFileType('image');
        } else {
            // Para PDFs y documentos, abrir en nueva pestaña
            if (previewUrl || fileUrl) {
                window.open(previewUrl || fileUrl, '_blank');
            }
        }
    };

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
            dni_ruc_ce: Yup.string().required('El número de documento es requerido').min(8, 'Mínimo 8 caracteres').max(20, 'Máximo 20 caracteres').matches(/^[0-9]+$/, 'Solo se permiten números'),
            telefonoCelular: Yup.string().required('El teléfono celular es requerido').min(9, 'Mínimo 9 dígitos').max(20, 'Máximo 20 dígitos').matches(/^[0-9]+$/, 'Solo se permiten números'),
            telefonoFijo: Yup.string().nullable().matches(/^[0-9-]+$/, 'Formato inválido'),
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
            ubicacionGoogleMaps: Yup.string().nullable().url('Debe ser una URL válida de Google Maps'),
        }),
        validate: (values) => {
            const errors = {};
            
            // Validar archivos requeridos
            if (!fileFalla) {
                errors.fotoVideoFalla = 'La evidencia de la falla es obligatoria';
            }
            if (!fileBoleta) {
                errors.fotoBoletaFactura = 'La boleta/factura de compra es obligatoria';
            }
            if (!fileSerie) {
                errors.fotoNumeroSerie = 'La foto del número de serie es obligatoria';
            }
            
            return errors;
        },
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            // Validar archivos antes de enviar
            if (!fileFalla) {
                setFileFallaError('La evidencia de la falla es obligatoria');
                toastr.error('Debe subir la evidencia de la falla', 'Campo requerido');
                return;
            }
            if (!fileBoleta) {
                setFileBoletaError('La boleta/factura de compra es obligatoria');
                toastr.error('Debe subir la boleta/factura de compra', 'Campo requerido');
                return;
            }
            if (!fileSerie) {
                setFileSerieError('La foto del número de serie es obligatoria');
                toastr.error('Debe subir la foto del número de serie', 'Campo requerido');
                return;
            }

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

                // Agregar archivos (ahora son obligatorios)
                formData.append('fotoVideoFalla', fileFalla);
                formData.append('fotoBoletaFactura', fileBoleta);
                formData.append('fotoNumeroSerie', fileSerie);

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
                    setFileTypeFalla(null);
                    setFileTypeBoleta(null);
                    setFileTypeSerie(null);
                    setFileNameFalla('');
                    setFileNameBoleta('');
                    setFileNameSerie('');
                    setFileFallaError('');
                    setFileBoletaError('');
                    setFileSerieError('');

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
                    toastr.error('No se pudo conectar con el servidor.', 'Error');
                } else {
                    toastr.error('Error al crear el ticket', 'Error');
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

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
                toastr.error('Error al cargar los datos de ubicación', 'Error');
            } finally {
                setLoadingUbigeo(false);
            }
        };

        cargarUbigeos();
    }, []);

    useEffect(() => {
        if (!fechaCompraRef.current) return;

        try {
            const fp = flatpickr(fechaCompraRef.current, {
                locale: Spanish,
                dateFormat: "d/m/Y",
                maxDate: "today",
                allowInput: true,
                clickOpens: true,
                onChange: (selectedDates, dateStr) => {
                    if (selectedDates.length) {
                        const date = selectedDates[0];
                        const fechaDB = date.toISOString().split('T')[0];
                        formik.setFieldValue("fechaCompra", fechaDB);
                    }
                }
            });

            return () => fp.destroy();
        } catch (error) {
            console.error("Error al inicializar flatpickr:", error);
        }
    }, [fechaCompraRef.current]);

    useEffect(() => {
        if (formik.values.departamento && provincias[formik.values.departamento]) {
            setProvinciasFiltradas(provincias[formik.values.departamento]);
            formik.setFieldValue('provincia', '');
            formik.setFieldValue('distrito', '');
            setDistritosFiltrados([]);
        } else {
            setProvinciasFiltradas([]);
        }
    }, [formik.values.departamento, provincias]);

    useEffect(() => {
        if (formik.values.provincia && distritos[formik.values.provincia]) {
            setDistritosFiltrados(distritos[formik.values.provincia]);
            formik.setFieldValue('distrito', '');
        } else {
            setDistritosFiltrados([]);
        }
    }, [formik.values.provincia, distritos]);

    useEffect(() => {
        if (formik.values.idCategoria) {
            cargarModelosPorCategoria(formik.values.idCategoria);
        } else {
            setModelosFiltrados([]);
            formik.setFieldValue('idModelo', '');
        }
    }, [formik.values.idCategoria]);

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

    const handleFileChange = (e, setFile, setPreview, setFileType, setFileName, setFileError, fieldName) => {
        const file = e.target.files[0];
        
        // Limpiar error previo
        setFileError('');
        
        if (file) {
            // Validar tamaño máximo (10MB)
            if (file.size > 10 * 1024 * 1024) {
                setFileError('El archivo no debe superar los 10MB');
                toastr.error('El archivo no debe superar los 10MB', 'Error');
                e.target.value = '';
                return;
            }

            // Validar tipos de archivo permitidos
            const allowedTypes = [
                'image/jpeg', 'image/png', 'image/jpg', 'image/gif',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            
            if (!allowedTypes.includes(file.type)) {
                setFileError('Solo se permiten imágenes (JPG, PNG, GIF), PDF o documentos de Word (DOC, DOCX)');
                toastr.error('Solo se permiten imágenes (JPG, PNG, GIF), PDF o documentos de Word (DOC, DOCX)', 'Error');
                e.target.value = '';
                return;
            }

            setFile(file);
            setFileType(file.type);
            setFileName(file.name);

            // Si es imagen, crear preview
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                // Para PDF y documentos, no mostrar preview
                setPreview(null);
            }

            if (fieldName) {
                formik.setFieldValue(fieldName, '');
            }
        }
    };

    const handleCategoriaCreada = (nuevaCategoria) => {
        setCategorias(prev => [...prev, nuevaCategoria]);
        formik.setFieldValue('idCategoria', nuevaCategoria.idCategoria);
        cargarModelosPorCategoria(nuevaCategoria.idCategoria);
    };

    const handleModeloCreado = (nuevoModelo) => {
        setModelos(prev => [...prev, nuevoModelo]);
        if (nuevoModelo.idCategoria === formik.values.idCategoria) {
            setModelosFiltrados(prev => [...prev, nuevoModelo]);
        }
        formik.setFieldValue('idModelo', nuevoModelo.idModelo);
    };

    const FileModal = ({ file, fileType, onClose }) => {
        if (!file) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={onClose}>
                <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-10"
                    >
                        <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                    </button>
                    {fileType === 'image' ? (
                        <img src={file} alt="Vista ampliada" className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
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
            </div>
        );
    };

    const getSelectStyles = (isDark) => ({
        control: (base, state) => ({
            ...base,
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            borderColor: state.isFocused ? '#4361ee' : isDark ? '#4b5563' : '#e5e7eb',
            boxShadow: state.isFocused ? '0 0 0 1px #4361ee' : 'none',
            '&:hover': { borderColor: '#4361ee' },
            minHeight: '38px',
            borderRadius: '6px',
            color: isDark ? '#e5e7eb' : '#1f2937',
        }),
        option: (base, { isFocused, isSelected }) => ({
            ...base,
            backgroundColor: isSelected ? '#4361ee' : isFocused ? (isDark ? '#374151' : '#f3f4f6') : (isDark ? '#1f2937' : '#ffffff'),
            color: isSelected ? '#ffffff' : (isDark ? '#e5e7eb' : '#1f2937'),
            cursor: 'pointer',
            '&:active': { backgroundColor: '#4361ee', color: '#ffffff' },
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
            '&::-webkit-scrollbar': { width: '8px', height: '8px' },
            '&::-webkit-scrollbar-track': { background: isDark ? '#374151' : '#f1f1f1' },
            '&::-webkit-scrollbar-thumb': { background: isDark ? '#4b5563' : '#888', borderRadius: '4px' },
            '&::-webkit-scrollbar-thumb:hover': { background: isDark ? '#6b7280' : '#555' },
        }),
        placeholder: (base) => ({ ...base, color: isDark ? '#9ca3af' : '#6b7280' }),
        singleValue: (base) => ({ ...base, color: isDark ? '#e5e7eb' : '#1f2937' }),
        input: (base) => ({ ...base, color: isDark ? '#e5e7eb' : '#1f2937' }),
        indicatorSeparator: (base) => ({ ...base, backgroundColor: isDark ? '#4b5563' : '#e5e7eb' }),
        dropdownIndicator: (base) => ({ ...base, color: isDark ? '#9ca3af' : '#6b7280', '&:hover': { color: isDark ? '#d1d5db' : '#374151' } }),
        clearIndicator: (base) => ({ ...base, color: isDark ? '#9ca3af' : '#6b7280', '&:hover': { color: isDark ? '#d1d5db' : '#374151' } }),
        loadingMessage: (base) => ({ ...base, color: isDark ? '#e5e7eb' : '#1f2937', backgroundColor: isDark ? '#1f2937' : '#ffffff' }),
        noOptionsMessage: (base) => ({ ...base, color: isDark ? '#e5e7eb' : '#1f2937', backgroundColor: isDark ? '#1f2937' : '#ffffff' }),
    });

    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        };
        checkDarkMode();
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const categoriaOptions = categorias.map(cat => ({ value: cat.idCategoria, label: cat.nombre }));
    const modeloOptions = modelosFiltrados.map(mod => ({ value: mod.idModelo, label: mod.nombre }));

    const handleCategoriaChange = (selectedOption) => {
        formik.setFieldValue('idCategoria', selectedOption ? selectedOption.value : '');
    };

    const handleModeloChange = (selectedOption) => {
        formik.setFieldValue('idModelo', selectedOption ? selectedOption.value : '');
    };

    return (
        <div>
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

            <FileModal file={modalFile} fileType={modalFileType} onClose={() => setModalFile(null)} />

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
                                        <label className="flex items-center gap-1 font-medium">
                                            <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-gray-500" />
                                            Nombre Completo <span className="text-red-500">*</span>
                                        </label>
                                        <input
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
                                        <label className="flex items-center gap-1 font-medium">
                                            <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-gray-500" />
                                            Correo Electrónico <span className="text-red-500">*</span>
                                        </label>
                                        <input
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
                                        <label className="flex items-center gap-1 font-medium">
                                            <FontAwesomeIcon icon={faIdCard} className="w-4 h-4 text-gray-500" />
                                            Tipo de Documento <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="idTipoDocumento"
                                            className={`form-select ${formik.touched.idTipoDocumento && formik.errors.idTipoDocumento ? 'has-error' : ''}`}
                                            value={formik.values.idTipoDocumento}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={submitting}
                                        >
                                            <option value="">Seleccione tipo</option>
                                            {tiposDocumento.map((tipo) => (
                                                <option key={tipo.idTipoDocumento} value={tipo.idTipoDocumento}>{tipo.nombre}</option>
                                            ))}
                                        </select>
                                        {formik.touched.idTipoDocumento && formik.errors.idTipoDocumento && <div className="text-danger text-sm mt-1">{formik.errors.idTipoDocumento}</div>}
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-1 font-medium">
                                            <FontAwesomeIcon icon={faHashtag} className="w-4 h-4 text-gray-500" />
                                            Número de Documento <span className="text-red-500">*</span>
                                        </label>
                                        <input
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
                                        <label className="flex items-center gap-1 font-medium">
                                            <FontAwesomeIcon icon={faPhone} className="w-4 h-4 text-gray-500" />
                                            Teléfono Fijo
                                        </label>
                                        <input
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
                                        <label className="flex items-center gap-1 font-medium">
                                            <FontAwesomeIcon icon={faMobile} className="w-4 h-4 text-gray-500" />
                                            Teléfono Celular <span className="text-red-500">*</span>
                                        </label>
                                        <input
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
                                            <label className="flex items-center gap-1 font-medium">
                                                <FontAwesomeIcon icon={faHome} className="w-4 h-4 text-gray-500" />
                                                Dirección Completa <span className="text-red-500">*</span>
                                            </label>
                                            <input
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
                                            <label className="flex items-center gap-1 font-medium">
                                                <FontAwesomeIcon icon={faRoad} className="w-4 h-4 text-gray-500" />
                                                Referencia
                                            </label>
                                            <input
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
                                        <div>
                                            <label className="flex items-center gap-1 font-medium">
                                                <FontAwesomeIcon icon={faGlobe} className="w-4 h-4 text-gray-500" />
                                                Departamento <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="departamento"
                                                className={`form-select ${formik.touched.departamento && formik.errors.departamento ? 'has-error' : ''}`}
                                                value={formik.values.departamento}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                disabled={submitting}
                                            >
                                                <option value="">Seleccione departamento</option>
                                                {departamentos.map((depto) => (
                                                    <option key={depto.id_ubigeo} value={depto.id_ubigeo}>{depto.nombre_ubigeo}</option>
                                                ))}
                                            </select>
                                            {formik.touched.departamento && formik.errors.departamento && <div className="text-danger text-sm mt-1">{formik.errors.departamento}</div>}
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-1 font-medium">
                                                <FontAwesomeIcon icon={faBuilding} className="w-4 h-4 text-gray-500" />
                                                Provincia <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="provincia"
                                                className={`form-select ${formik.touched.provincia && formik.errors.provincia ? 'has-error' : ''}`}
                                                value={formik.values.provincia}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                disabled={!formik.values.departamento || submitting}
                                            >
                                                <option value="">{!formik.values.departamento ? 'Primero seleccione departamento' : 'Seleccione provincia'}</option>
                                                {provinciasFiltradas.map((prov) => (
                                                    <option key={prov.id_ubigeo} value={prov.id_ubigeo}>{prov.nombre_ubigeo}</option>
                                                ))}
                                            </select>
                                            {formik.touched.provincia && formik.errors.provincia && <div className="text-danger text-sm mt-1">{formik.errors.provincia}</div>}
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-1 font-medium">
                                                <FontAwesomeIcon icon={faCity} className="w-4 h-4 text-gray-500" />
                                                Distrito <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="distrito"
                                                className={`form-select ${formik.touched.distrito && formik.errors.distrito ? 'has-error' : ''}`}
                                                value={formik.values.distrito}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                disabled={!formik.values.provincia || submitting}
                                            >
                                                <option value="">{!formik.values.provincia ? 'Primero seleccione provincia' : 'Seleccione distrito'}</option>
                                                {distritosFiltrados.map((dist) => (
                                                    <option key={dist.id_ubigeo} value={dist.id_ubigeo}>{dist.nombre_ubigeo}</option>
                                                ))}
                                            </select>
                                            {formik.touched.distrito && formik.errors.distrito && <div className="text-danger text-sm mt-1">{formik.errors.distrito}</div>}
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
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="flex items-center gap-1 font-medium">
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
                                        {formik.touched.idCategoria && formik.errors.idCategoria && <div className="text-danger text-sm mt-1">{formik.errors.idCategoria}</div>}
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="flex items-center gap-1 font-medium">
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
                                        {formik.touched.idModelo && formik.errors.idModelo && <div className="text-danger text-sm mt-1">{formik.errors.idModelo}</div>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="flex items-center gap-1 font-medium">
                                            <FontAwesomeIcon icon={faHashtag} className="w-4 h-4 text-gray-500" />
                                            Número de Serie <span className="text-red-500">*</span>
                                        </label>
                                        <input
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
                                        <label className="flex items-center gap-1 font-medium">
                                            <FontAwesomeIcon icon={faComment} className="w-4 h-4 text-gray-500" />
                                            Detalles de la Falla <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
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
                                            <label className="flex items-center gap-1 font-medium">
                                                <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                Fecha de Compra <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                ref={fechaCompraRef}
                                                type="text"
                                                placeholder="DD/MM/AAAA"
                                                className={`form-input dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 ${formik.touched.fechaCompra && formik.errors.fechaCompra ? 'has-error' : ''}`}
                                                style={{ cursor: 'pointer', position: 'relative', zIndex: 1 }}
                                                autoComplete="off"
                                            />
                                            {formik.touched.fechaCompra && formik.errors.fechaCompra && <div className="text-danger text-sm mt-1">{formik.errors.fechaCompra}</div>}
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-1 font-medium">
                                                <FontAwesomeIcon icon={faStore} className="w-4 h-4 text-gray-500" />
                                                Tienda de Compra <span className="text-red-500">*</span>
                                            </label>
                                            <input
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

                                {/* SECCIÓN 5: ARCHIVOS ADJUNTOS - OBLIGATORIOS */}
                                <div className="border-l-4 border-primary pl-4 mb-6 mt-8">
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <FontAwesomeIcon icon={faCamera} className="w-5 h-5 text-primary" />
                                        Archivos Adjuntos <span className="text-red-500">*</span>
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">Todos los archivos son obligatorios. Sube imágenes (JPG, PNG, GIF) o documentos (PDF, DOC, DOCX). Máx. 10MB por archivo</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Foto Falla - OBLIGATORIA */}
                                    <div className={`bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border ${fileFallaError ? 'border-red-500' : ''}`}>
                                        <label className="flex items-center gap-2 mb-3 font-medium">
                                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                                                <FontAwesomeIcon icon={faVideo} className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            Evidencia de la Falla <span className="text-red-500">*</span>
                                        </label>

                                        <div className="flex flex-col items-center gap-3">
                                            {!previewFalla && !fileFalla ? (
                                                <div className="w-full">
                                                    <input
                                                        ref={fileInputFallaRef}
                                                        type="file"
                                                        accept="image/jpeg,image/png,image/jpg,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                        onChange={(e) => handleFileChange(e, setFileFalla, setPreviewFalla, setFileTypeFalla, setFileNameFalla, setFileFallaError, 'fotoVideoFalla')}
                                                        className="hidden"
                                                        id="upload-falla"
                                                        disabled={submitting}
                                                        required
                                                    />
                                                    <label
                                                        htmlFor="upload-falla"
                                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        <FontAwesomeIcon icon={faCamera} className="w-8 h-8 text-gray-400 mb-2" />
                                                        <span className="text-sm text-gray-500">Seleccionar archivo</span>
                                                        <span className="text-xs text-gray-400 mt-1">JPG, PNG, GIF, PDF, DOC, DOCX (10MB max)</span>
                                                    </label>
                                                </div>
                                            ) : (
                                                <div className="relative w-full">
                                                    {previewFalla ? (
                                                        <img 
                                                            src={previewFalla} 
                                                            alt="Preview" 
                                                            className="w-full h-48 object-cover rounded-lg cursor-pointer" 
                                                            onClick={() => setModalFile(previewFalla, 'image')} 
                                                        />
                                                    ) : (
                                                        <div 
                                                            className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                            onClick={() => handleFilePreview(fileFalla, fileTypeFalla, null, URL.createObjectURL(fileFalla))}
                                                        >
                                                            <FontAwesomeIcon icon={getFileIcon(fileNameFalla, fileTypeFalla)} className={`w-16 h-16 ${getFileIconColor(fileNameFalla)} mb-2`} />
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 text-center px-2 break-all">{fileNameFalla}</p>
                                                            <p className="text-xs text-gray-400 mt-1">{getFileTypeText(fileNameFalla)}</p>
                                                        </div>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                                                        onClick={() => {
                                                            setFileFalla(null);
                                                            setPreviewFalla(null);
                                                            setFileTypeFalla(null);
                                                            setFileNameFalla('');
                                                            setFileFallaError('');
                                                            if (fileInputFallaRef.current) fileInputFallaRef.current.value = '';
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        {fileFallaError && (
                                            <div className="text-danger text-sm mt-2 flex items-center gap-1">
                                                <FontAwesomeIcon icon={faExclamationCircle} className="w-3 h-3" />
                                                {fileFallaError}
                                            </div>
                                        )}
                                    </div>

                                    {/* Foto Boleta - OBLIGATORIA */}
                                    <div className={`bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border ${fileBoletaError ? 'border-red-500' : ''}`}>
                                        <label className="flex items-center gap-2 mb-3 font-medium">
                                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                                                <FontAwesomeIcon icon={faFileInvoice} className="w-4 h-4 text-green-600 dark:text-green-400" />
                                            </div>
                                            Boleta/Factura de Compra <span className="text-red-500">*</span>
                                        </label>

                                        <div className="flex flex-col items-center gap-3">
                                            {!previewBoleta && !fileBoleta ? (
                                                <div className="w-full">
                                                    <input
                                                        ref={fileInputBoletaRef}
                                                        type="file"
                                                        accept="image/jpeg,image/png,image/jpg,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                        onChange={(e) => handleFileChange(e, setFileBoleta, setPreviewBoleta, setFileTypeBoleta, setFileNameBoleta, setFileBoletaError, 'fotoBoletaFactura')}
                                                        className="hidden"
                                                        id="upload-boleta"
                                                        disabled={submitting}
                                                        required
                                                    />
                                                    <label
                                                        htmlFor="upload-boleta"
                                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        <FontAwesomeIcon icon={faFileInvoice} className="w-8 h-8 text-gray-400 mb-2" />
                                                        <span className="text-sm text-gray-500">Seleccionar archivo</span>
                                                        <span className="text-xs text-gray-400 mt-1">JPG, PNG, GIF, PDF, DOC, DOCX (10MB max)</span>
                                                    </label>
                                                </div>
                                            ) : (
                                                <div className="relative w-full">
                                                    {previewBoleta ? (
                                                        <img 
                                                            src={previewBoleta} 
                                                            alt="Preview" 
                                                            className="w-full h-48 object-cover rounded-lg cursor-pointer" 
                                                            onClick={() => setModalFile(previewBoleta, 'image')} 
                                                        />
                                                    ) : (
                                                        <div 
                                                            className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                            onClick={() => handleFilePreview(fileBoleta, fileTypeBoleta, null, URL.createObjectURL(fileBoleta))}
                                                        >
                                                            <FontAwesomeIcon icon={getFileIcon(fileNameBoleta, fileTypeBoleta)} className={`w-16 h-16 ${getFileIconColor(fileNameBoleta)} mb-2`} />
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 text-center px-2 break-all">{fileNameBoleta}</p>
                                                            <p className="text-xs text-gray-400 mt-1">{getFileTypeText(fileNameBoleta)}</p>
                                                        </div>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                                                        onClick={() => {
                                                            setFileBoleta(null);
                                                            setPreviewBoleta(null);
                                                            setFileTypeBoleta(null);
                                                            setFileNameBoleta('');
                                                            setFileBoletaError('');
                                                            if (fileInputBoletaRef.current) fileInputBoletaRef.current.value = '';
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        {fileBoletaError && (
                                            <div className="text-danger text-sm mt-2 flex items-center gap-1">
                                                <FontAwesomeIcon icon={faExclamationCircle} className="w-3 h-3" />
                                                {fileBoletaError}
                                            </div>
                                        )}
                                    </div>

                                    {/* Foto Serie - OBLIGATORIA */}
                                    <div className={`bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border ${fileSerieError ? 'border-red-500' : ''}`}>
                                        <label className="flex items-center gap-2 mb-3 font-medium">
                                            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                                                <FontAwesomeIcon icon={faImage} className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            Número de Serie <span className="text-red-500">*</span>
                                        </label>

                                        <div className="flex flex-col items-center gap-3">
                                            {!previewSerie && !fileSerie ? (
                                                <div className="w-full">
                                                    <input
                                                        ref={fileInputSerieRef}
                                                        type="file"
                                                        accept="image/jpeg,image/png,image/jpg,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                        onChange={(e) => handleFileChange(e, setFileSerie, setPreviewSerie, setFileTypeSerie, setFileNameSerie, setFileSerieError, 'fotoNumeroSerie')}
                                                        className="hidden"
                                                        id="upload-serie"
                                                        disabled={submitting}
                                                        required
                                                    />
                                                    <label
                                                        htmlFor="upload-serie"
                                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        <FontAwesomeIcon icon={faImage} className="w-8 h-8 text-gray-400 mb-2" />
                                                        <span className="text-sm text-gray-500">Seleccionar archivo</span>
                                                        <span className="text-xs text-gray-400 mt-1">JPG, PNG, GIF, PDF, DOC, DOCX (10MB max)</span>
                                                    </label>
                                                </div>
                                            ) : (
                                                <div className="relative w-full">
                                                    {previewSerie ? (
                                                        <img 
                                                            src={previewSerie} 
                                                            alt="Preview" 
                                                            className="w-full h-48 object-cover rounded-lg cursor-pointer" 
                                                            onClick={() => setModalFile(previewSerie, 'image')} 
                                                        />
                                                    ) : (
                                                        <div 
                                                            className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                            onClick={() => handleFilePreview(fileSerie, fileTypeSerie, null, URL.createObjectURL(fileSerie))}
                                                        >
                                                            <FontAwesomeIcon icon={getFileIcon(fileNameSerie, fileTypeSerie)} className={`w-16 h-16 ${getFileIconColor(fileNameSerie)} mb-2`} />
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 text-center px-2 break-all">{fileNameSerie}</p>
                                                            <p className="text-xs text-gray-400 mt-1">{getFileTypeText(fileNameSerie)}</p>
                                                        </div>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                                                        onClick={() => {
                                                            setFileSerie(null);
                                                            setPreviewSerie(null);
                                                            setFileTypeSerie(null);
                                                            setFileNameSerie('');
                                                            setFileSerieError('');
                                                            if (fileInputSerieRef.current) fileInputSerieRef.current.value = '';
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        {fileSerieError && (
                                            <div className="text-danger text-sm mt-2 flex items-center gap-1">
                                                <FontAwesomeIcon icon={faExclamationCircle} className="w-3 h-3" />
                                                {fileSerieError}
                                            </div>
                                        )}
                                    </div>

                                    {/* Ubicación Google Maps */}
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
                                        <label htmlFor="ubicacionGoogleMaps" className="flex items-center gap-2 mb-3 font-medium">
                                            <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full">
                                                <FontAwesomeIcon icon={faMap} className="w-4 h-4 text-orange-600 dark:text-orange-400" />
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
                                    <button type="submit" className="btn btn-primary flex items-center gap-2 min-w-[140px] justify-center" disabled={submitting || !formik.isValid || !fileFalla || !fileBoleta || !fileSerie}>
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