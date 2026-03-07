import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTicket,
    faPlus,
    faEdit,
    faTrash,
    faEye,
    faFilter,
    faCheckCircle,
    faClock,
    faExclamationCircle,
    faSpinner,
    faSearch,
    faCalendarAlt,
    faTimes,
    faUser,
    faMobile,
    faPhone,
    faEnvelope,
    faLaptop,
    faHashtag,
    faMapMarkerAlt,
    faTag,
    faBuilding,
    faSearchLocation,
    faTools,
    faCheckDouble,
} from '@fortawesome/free-solid-svg-icons';
import DataTable from 'react-data-table-component';
import toastr from 'toastr';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import axios from 'axios';

// Importar modales
import ModalVerTicket from './components/ModalVerTicket';
import ModalEliminarTicket from './components/ModalEliminarTicket';

const ListaTickets = () => {
    const dispatch = useDispatch();
    const [filterText, setFilterText] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('todos');
    const [loading, setLoading] = useState(true);
    const [ticketsData, setTicketsData] = useState([]);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [usuarioActual, setUsuarioActual] = useState(null);

    // Estados para modales
    const [modalVer, setModalVer] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    // Refs para los inputs de fecha
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

    // URL base de la API
    const API_URL = 'http://127.0.0.1:8000/api';

    // Obtener usuario actual del localStorage
    useEffect(() => {
        const usuario = localStorage.getItem('user');
        if (usuario) {
            try {
                const userData = JSON.parse(usuario);
                setUsuarioActual(userData);
            } catch (e) {
                console.error('Error al parsear usuario:', e);
            }
        }
    }, []);

    const cargarTickets = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/tickets`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                    Accept: 'application/json',
                },
            });

            if (response.data.success) {
                const ticketsTransformados = response.data.data.map((ticket) => ({
                    id: ticket.idTicket,
                    numeroTicket: ticket.numero_ticket,
                    // Datos cliente
                    nombreCompleto: ticket.nombreCompleto,
                    correoElectronico: ticket.correoElectronico,
                    telefonoCelular: ticket.telefonoCelular,
                    telefonoFijo: ticket.telefonoFijo || '',
                    tipoDocumento: ticket.tipo_documento?.nombre || '',
                    dni_ruc_ce: ticket.dni_ruc_ce,

                    // Datos producto
                    tipoProducto: ticket.categoria?.nombre || 'N/A',
                    modelo: ticket.modelo?.nombre || 'N/A',
                    serie: ticket.serieProducto,

                    // Falla
                    detallesFalla: ticket.detallesFalla,

                    // Fechas
                    fechaCreacion: new Date(ticket.fechaCreacion).toLocaleString('es-PE', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                    fechaCompra: ticket.fechaCompra,
                    tiendaSedeCompra: ticket.tiendaSedeCompra,

                    // Estado (1: evaluando, 2: gestionando, 3: finalizado)
                    estado: ticket.estado === 1 ? 'evaluando' : ticket.estado === 2 ? 'gestionando' : 'finalizado',
                    estado_valor: ticket.estado, // Guardamos el valor numérico para las validaciones

                    // Ubicación
                    departamento: ticket.departamento,
                    provincia: ticket.provincia,
                    distrito: ticket.distrito,
                    direccionCompleta: ticket.direccionCompleta,
                    referenciaDomicilio: ticket.referenciaDomicilio,
                    ubicacionGoogleMaps: ticket.ubicacionGoogleMaps,

                    // Evidencias
                    fotoVideoFalla: ticket.fotoVideoFalla,
                    fotoBoletaFactura: ticket.fotoBoletaFactura,
                    fotoNumeroSerie: ticket.fotoNumeroSerie,

                    // Información adicional
                    idUsuarioCreador: ticket.idUsuarioCreador,
                    idClienteGeneral: ticket.idClienteGeneral,
                    usuarioCreador: ticket.usuario_creador ? `${ticket.usuario_creador.Nombre} ${ticket.usuario_creador.apellidoPaterno}` : 'N/A',
                }));

                setTicketsData(ticketsTransformados);
            }
        } catch (error) {
            console.error('Error cargando tickets:', error);
            toastr.error('Error al cargar los tickets', 'Error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Lista de Tickets'));
        cargarTickets();

        toastr.options = {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
            timeOut: 3000,
            showDuration: 300,
            hideDuration: 500,
        };
    }, [dispatch]);

    // Inicializar Flatpickr
    useEffect(() => {
        if (startDateRef.current) {
            flatpickr(startDateRef.current, {
                dateFormat: 'Y-m-d',
                altFormat: 'd/m/Y',
                altInput: true,
                placeholder: 'Fecha inicial',
                onChange: (selectedDates, dateStr) => {
                    setDateRange((prev) => ({ ...prev, start: dateStr }));
                },
            });
        }

        if (endDateRef.current) {
            flatpickr(endDateRef.current, {
                dateFormat: 'Y-m-d',
                altFormat: 'd/m/Y',
                altInput: true,
                placeholder: 'Fecha final',
                onChange: (selectedDates, dateStr) => {
                    setDateRange((prev) => ({ ...prev, end: dateStr }));
                },
            });
        }
    }, []);

    // Limpiar filtros de fecha
    const clearDateFilters = () => {
        setDateRange({ start: '', end: '' });
        if (startDateRef.current && startDateRef.current._flatpickr) {
            startDateRef.current._flatpickr.clear();
        }
        if (endDateRef.current && endDateRef.current._flatpickr) {
            endDateRef.current._flatpickr.clear();
        }
    };

    const isDark = useSelector((state) => {
        const theme = state.themeConfig.theme;
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (theme === 'dark') return true;
        if (theme === 'light') return false;
        return isSystemDark;
    });

    // Función para obtener el badge de estado
    const getStatusBadge = (estado) => {
        const statusConfig = {
            evaluando: {
                color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
                icon: faSearchLocation,
                text: 'Evaluando',
            },
            gestionando: {
                color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
                icon: faTools,
                text: 'Gestionando',
            },
            finalizado: {
                color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                icon: faCheckDouble,
                text: 'Finalizado',
            },
        };

        const config = statusConfig[estado] || statusConfig.evaluando;

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                <FontAwesomeIcon icon={config.icon} className="w-3 h-3" />
                {config.text}
            </span>
        );
    };

    // Función para manejar eliminación desde el modal
    const handleConfirmDelete = async (id) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${API_URL}/tickets/${id}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                },
            });

            if (response.data.success) {
                toastr.success('Ticket eliminado correctamente');
                cargarTickets();
            }
        } catch (error) {
            console.error('Error al eliminar ticket:', error);
            toastr.error('Error al eliminar el ticket', 'Error');
        } finally {
            setLoading(false);
            setModalEliminar(false);
        }
    };

    // Función para verificar si el botón de editar debe estar deshabilitado
    const isEditDisabled = (estado_valor) => {
        return estado_valor !== 1; // Deshabilitado para estados 2 y 3 (gestionando y finalizado)
    };

    // Función para verificar si el botón de eliminar debe estar deshabilitado
    const isDeleteDisabled = (estado_valor) => {
        return estado_valor !== 1; // Deshabilitado para estados 2 y 3 (gestionando y finalizado)
    };

    // Función para obtener el tooltip según el estado
    const getActionTooltip = (estado_valor, accion) => {
        if (estado_valor === 1) return `${accion} ticket`;
        if (estado_valor === 2) return `No se puede ${accion.toLowerCase()} - Ticket en gestión`;
        if (estado_valor === 3) return `No se puede ${accion.toLowerCase()} - Ticket finalizado`;
        return `${accion} ticket`;
    };

    // Definir columnas para DataTable
    const columns = [
        {
            name: 'N° Ticket',
            selector: (row) => row.numeroTicket,
            sortable: true,
            style: {
                minWidth: '120px',
            },
            cell: (row) => (
                <div className="flex items-center justify-center w-full">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(row.numeroTicket);
                            toastr.success(`Ticket ${row.numeroTicket} copiado al portapapeles`, 'Copiado');
                        }}
                        className="font-mono font-bold text-gray text-sm hover:text-primary transition-colors cursor-pointer group relative"
                    >
                        <span>{row.numeroTicket}</span>
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Copiar número
                        </span>
                    </button>
                </div>
            ),
        },
        {
            name: 'Cliente',
            selector: (row) => row.nombreCompleto,
            sortable: true,
            style: {
                minWidth: '200px',
            },
            cell: (row) => (
                <div className="flex flex-col w-full py-2 items-center">
                    <span className="font-medium text-sm truncate w-full text-center" title={row.nombreCompleto}>
                        <FontAwesomeIcon icon={faUser} className="w-3 h-3 text-gray-500 mr-1" />
                        {row.nombreCompleto}
                    </span>
                    <span className="text-xs text-gray-500 truncate w-full flex items-center justify-center" title={`${row.tipoDocumento}: ${row.dni_ruc_ce}`}>
                        <FontAwesomeIcon icon={faHashtag} className="w-2 h-2 text-gray-400 mr-1" />
                        {row.tipoDocumento}: {row.dni_ruc_ce}
                    </span>
                </div>
            ),
        },
        {
            name: 'Contacto',
            selector: (row) => row.telefonoCelular,
            sortable: true,
            style: {
                minWidth: '130px',
            },
            cell: (row) => (
                <div className="flex flex-col w-full py-2 items-center">
                    <span className="text-sm flex items-center justify-center">
                        <FontAwesomeIcon icon={faMobile} className="w-3 h-3 text-gray-500 mr-1" />
                        {row.telefonoCelular}
                    </span>
                    {row.telefonoFijo && (
                        <span className="text-xs text-gray-500 flex items-center justify-center">
                            <FontAwesomeIcon icon={faPhone} className="w-2 h-2 text-gray-400 mr-1" />
                            {row.telefonoFijo}
                        </span>
                    )}
                </div>
            ),
        },
        {
            name: 'Producto',
            selector: (row) => row.modelo,
            sortable: true,
            style: {
                minWidth: '180px',
            },
            cell: (row) => (
                <div className="flex flex-col w-full py-2 items-center">
                    <div className="flex items-center gap-1 mb-1 justify-center">
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">{row.tipoProducto}</span>
                    </div>
                    <span className="text-sm font-medium truncate text-center w-full" title={row.modelo}>
                        <FontAwesomeIcon icon={faLaptop} className="w-3 h-3 text-gray-500 mr-1" />
                        {row.modelo}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center justify-center">
                        <FontAwesomeIcon icon={faHashtag} className="w-2 h-2 mr-1" />
                        Serie: {row.serie}
                    </span>
                </div>
            ),
        },
        {
            name: 'Ubicación',
            selector: (row) => row.distrito,
            sortable: true,
            style: {
                minWidth: '140px',
            },
            cell: (row) => (
                <div className="flex flex-col w-full py-2 items-center">
                    {row.ubicacionGoogleMaps ? (
                        <a
                            href={row.ubicacionGoogleMaps}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/40"
                            title="Abrir en Google Maps"
                        >
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3" />
                            Ver ubicación
                        </a>
                    ) : (
                        <span className="mt-1 text-xs text-gray-400 dark:text-gray-600 flex items-center gap-1">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3" />
                            Sin ubicación
                        </span>
                    )}
                </div>
            ),
        },
        {
            name: 'Fecha',
            selector: (row) => row.fechaCreacion,
            sortable: true,
            style: {
                minWidth: '130px',
            },
            cell: (row) => (
                <div className="flex flex-col items-center w-full py-2">
                    <span className="text-sm flex items-center justify-center">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 w-3 h-3 mr-1" />
                        {row.fechaCreacion?.split(' ')[0]}
                    </span>
                    <span className="text-xs text-gray-500">{row.fechaCreacion?.split(' ')[1]}</span>
                </div>
            ),
        },
        {
            name: 'Estado',
            selector: (row) => row.estado,
            sortable: true,
            style: {
                minWidth: '110px',
            },
            cell: (row) => <div className="flex items-center justify-center w-full py-2">{getStatusBadge(row.estado)}</div>,
        },
        {
            name: 'Acciones',
            style: {
                minWidth: '150px',
            },
            cell: (row) => (
                <div className="flex items-center justify-center gap-1 py-2">
                    {/* Botón Ver - Siempre habilitado */}
                    <button
                        className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full transition-colors group"
                        onClick={() => {
                            setSelectedTicket(row);
                            setModalVer(true);
                        }}
                        title="Ver ticket"
                    >
                        <FontAwesomeIcon icon={faEye} className="text-blue-600 dark:text-blue-400 w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>

                    {/* Botón Editar - Deshabilitado para estados 2 y 3 */}
                    <button
                        className={`p-1.5 rounded-full transition-colors group ${
                            isEditDisabled(row.estado_valor) 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800' 
                                : 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                        }`}
                        onClick={() => {
                            if (!isEditDisabled(row.estado_valor)) {
                                window.location.href = `/tickets/editar/${row.id}`;
                            }
                        }}
                        title={getActionTooltip(row.estado_valor, 'Editar')}
                        disabled={isEditDisabled(row.estado_valor)}
                    >
                        <FontAwesomeIcon icon={faEdit} className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>

                    {/* Botón Eliminar - Deshabilitado para estados 2 y 3 */}
                    <button
                        className={`p-1.5 rounded-full transition-colors group ${
                            isDeleteDisabled(row.estado_valor) 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800' 
                                : 'hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400'
                        }`}
                        onClick={() => {
                            if (!isDeleteDisabled(row.estado_valor)) {
                                setSelectedTicket(row);
                                setModalEliminar(true);
                            }
                        }}
                        title={getActionTooltip(row.estado_valor, 'Eliminar')}
                        disabled={isDeleteDisabled(row.estado_valor)}
                    >
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            ),
        },
    ];

    // Filtrar datos por estado, búsqueda y fecha
    const filteredData = useMemo(() => {
        let data = ticketsData;

        // Filtro por estado
        if (selectedStatus !== 'todos') {
            data = data.filter((t) => t.estado === selectedStatus);
        }

        // Filtro por búsqueda
        if (filterText) {
            const searchLower = filterText.toLowerCase();
            data = data.filter(
                (item) =>
                    item.numeroTicket.toLowerCase().includes(searchLower) ||
                    item.nombreCompleto.toLowerCase().includes(searchLower) ||
                    item.correoElectronico.toLowerCase().includes(searchLower) ||
                    item.telefonoCelular.includes(filterText) ||
                    item.dni_ruc_ce.includes(filterText) ||
                    item.modelo.toLowerCase().includes(searchLower) ||
                    item.serie.toLowerCase().includes(searchLower) ||
                    item.distrito.toLowerCase().includes(searchLower) ||
                    item.provincia.toLowerCase().includes(searchLower),
            );
        }

        // Filtro por rango de fechas
        if (dateRange.start || dateRange.end) {
            data = data.filter((item) => {
                const itemDate = item.fechaCreacion.split(' ')[0];

                if (dateRange.start && dateRange.end) {
                    return itemDate >= dateRange.start && itemDate <= dateRange.end;
                } else if (dateRange.start) {
                    return itemDate >= dateRange.start;
                } else if (dateRange.end) {
                    return itemDate <= dateRange.end;
                }
                return true;
            });
        }

        return data;
    }, [ticketsData, selectedStatus, filterText, dateRange]);

    // Componente de filtros y búsqueda combinados
    const subHeaderComponent = useMemo(() => {
        return (
            <div className="flex flex-wrap items-center gap-4 w-full">
                {/* Filtros de estado */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <FontAwesomeIcon icon={faFilter} className="w-4 h-4" />
                        Estado:
                    </span>
                    <button
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            selectedStatus === 'todos' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setSelectedStatus('todos')}
                    >
                        Todos
                    </button>
                    <button
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                            selectedStatus === 'evaluando'
                                ? 'bg-purple-600 text-white'
                                : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800'
                        }`}
                        onClick={() => setSelectedStatus('evaluando')}
                    >
                        <FontAwesomeIcon icon={faSearchLocation} className="w-3 h-3" />
                        Evaluando
                    </button>
                    <button
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                            selectedStatus === 'gestionando' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
                        }`}
                        onClick={() => setSelectedStatus('gestionando')}
                    >
                        <FontAwesomeIcon icon={faTools} className="w-3 h-3" />
                        Gestionando
                    </button>
                    <button
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                            selectedStatus === 'finalizado' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
                        }`}
                        onClick={() => setSelectedStatus('finalizado')}
                    >
                        <FontAwesomeIcon icon={faCheckDouble} className="w-3 h-3" />
                        Finalizado
                    </button>
                </div>

                {/* Buscador */}
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 ml-auto">
                    <FontAwesomeIcon icon={faSearch} className="text-gray-400 w-4 h-4 ml-1" />
                    <input
                        type="text"
                        className="form-input border-0 focus:ring-0 p-0 text-sm w-64"
                        placeholder="Buscar por ticket, cliente, producto..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                    {filterText && (
                        <button onClick={() => setFilterText('')} className="text-gray-400 hover:text-gray-600 mr-1">
                            ×
                        </button>
                    )}
                </div>
            </div>
        );
    }, [filterText, selectedStatus]);

    const customStyles = {
        headCells: {
            style: {
                fontWeight: 'bold',
                fontSize: '14px',
                backgroundColor: isDark ? '#1e293b' : '#f8f9fa',
                color: isDark ? '#e2e8f0' : '#333',
                paddingTop: '12px',
                paddingBottom: '12px',
                justifyContent: 'center',
                textAlign: 'center',
                borderBottom: isDark ? '1px solid #334155' : '1px solid #e5e7eb',
            },
        },
        cells: {
            style: {
                justifyContent: 'center',
                textAlign: 'center',
                color: isDark ? '#cbd5e1' : '#4b5563',
                backgroundColor: isDark ? '#0f172a' : 'transparent',
                paddingTop: '4px',
                paddingBottom: '4px',
            },
        },
        rows: {
            style: {
                minHeight: '80px',
                backgroundColor: isDark ? '#0f172a' : 'transparent',
                color: isDark ? '#cbd5e1' : '#4b5563',
                borderBottom: isDark ? '1px solid #334155' : '1px solid #e5e7eb',
                '&:hover': {
                    backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
                    cursor: 'pointer',
                },
            },
        },
        pagination: {
            style: {
                borderTop: isDark ? '1px solid #334155' : '1px solid #e5e7eb',
                paddingTop: '10px',
                backgroundColor: isDark ? '#0f172a' : 'transparent',
                color: isDark ? '#cbd5e1' : '#4b5563',
            },
            pageButtonsStyle: {
                color: isDark ? '#cbd5e1' : '#4b5563',
                fill: isDark ? '#cbd5e1' : '#4b5563',
                backgroundColor: isDark ? '#1e293b' : 'transparent',
                '&:hover:not(:disabled)': {
                    backgroundColor: isDark ? '#334155' : '#e5e7eb',
                },
                '&:focus': {
                    outline: 'none',
                },
            },
        },
        noData: {
            style: {
                backgroundColor: isDark ? '#0f172a' : 'transparent',
                color: isDark ? '#94a3b8' : '#6b7280',
                padding: '24px',
            },
        },
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
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Lista de Tickets</span>
                </li>
            </ul>

            {/* Header con información del usuario */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white-light flex items-center gap-3">
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
                            <FontAwesomeIcon icon={faTicket} className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                        </div>
                        Gestión de Tickets
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base mt-2">
                        {usuarioActual ? (
                            <span className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                                Bienvenido {usuarioActual.Nombre} {usuarioActual.apellidoPaterno}
                            </span>
                        ) : (
                            'Administra todos los tickets de soporte técnico'
                        )}
                    </p>
                </div>
                <Link to="/tickets/crear" className="btn btn-primary flex items-center gap-2">
                    <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                    Nuevo Ticket
                </Link>
            </div>

            {/* Filtros de fecha */}
            <div className="mb-5 flex items-center gap-4 flex-wrap bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4" />
                    Filtrar por fecha:
                </span>

                <div className="relative">
                    <input type="text" ref={startDateRef} className="form-input w-40 pl-8" placeholder="Fecha inicial" />
                    <FontAwesomeIcon icon={faCalendarAlt} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                </div>

                <span className="text-gray-400">-</span>

                <div className="relative">
                    <input type="text" ref={endDateRef} className="form-input w-40 pl-8" placeholder="Fecha final" />
                    <FontAwesomeIcon icon={faCalendarAlt} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                </div>

                {(dateRange.start || dateRange.end) && (
                    <>
                        <button onClick={clearDateFilters} className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors">
                            <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                            Limpiar fechas
                        </button>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Filtro por fechas activo</span>
                    </>
                )}
            </div>

            {/* Tabla con react-data-table-component */}
            <div className="panel p-5">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    progressPending={loading}
                    progressComponent={
                        <div className="flex justify-center items-center py-20">
                            <FontAwesomeIcon icon={faSpinner} className="w-10 h-10 text-primary animate-spin" />
                            <span className="ml-3 text-lg">Cargando tickets...</span>
                        </div>
                    }
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[5, 10, 25, 50]}
                    highlightOnHover
                    striped
                    responsive
                    defaultSortFieldId={5}
                    defaultSortAsc={false}
                    subHeader
                    subHeaderComponent={subHeaderComponent}
                    subHeaderAlign="left"
                    noDataComponent={
                        <div className="py-10 text-center text-gray-500">
                            <FontAwesomeIcon icon={faTicket} className="w-12 h-12 mb-3 text-gray-300" />
                            <p>No hay tickets para mostrar</p>
                            <p className="text-sm text-gray-400 mt-2">Haz clic en "Nuevo Ticket" para crear el primero</p>
                        </div>
                    }
                    customStyles={customStyles}
                />
            </div>

            {/* Modales */}
            <ModalVerTicket modal={modalVer} setModal={setModalVer} ticketData={selectedTicket} />

            <ModalEliminarTicket modal={modalEliminar} setModal={setModalEliminar} ticketData={selectedTicket} onConfirm={handleConfirmDelete} />
        </div>
    );
};

export default ListaTickets;