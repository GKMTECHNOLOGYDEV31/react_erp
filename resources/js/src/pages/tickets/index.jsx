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
    faTimes
} from '@fortawesome/free-solid-svg-icons';
import DataTable from 'react-data-table-component';
import toastr from 'toastr';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

// Importar modales
import ModalVerTicket from './components/ModalVerTicket';
import ModalEliminarTicket from './components/ModalEliminarTicket';

const ListaTickets = () => {
    const dispatch = useDispatch();
    const [filterText, setFilterText] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('todos');
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    
    // Estados para modales
    const [modalVer, setModalVer] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    // Refs para los inputs de fecha
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

    useEffect(() => {
        dispatch(setPageTitle('Lista de Tickets'));
    }, [dispatch]);

    // Inicializar Flatpickr
    useEffect(() => {
        // Configuración para fecha inicio
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

        // Configuración para fecha fin
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
        // Limpiar los inputs de flatpickr
        if (startDateRef.current && startDateRef.current._flatpickr) {
            startDateRef.current._flatpickr.clear();
        }
        if (endDateRef.current && endDateRef.current._flatpickr) {
            endDateRef.current._flatpickr.clear();
        }
    };

    // Datos de ejemplo (estáticos) - SIMULACIÓN
    const [ticketsData, setTicketsData] = useState([
        {
            id: 1,
            numeroTicket: 'TKT-2024-001',
            marca: 'HP',
            modelo: 'EliteBook 840 G3',
            serie: 'HP12345678',
            fechaCreacion: '2024-01-15 10:30',
            estado: 'abierto',
            prioridad: 'alta',
            observacion: 'El equipo no enciende'
        },
        {
            id: 2,
            numeroTicket: 'TKT-2024-002',
            marca: 'Dell',
            modelo: 'Latitude 5420',
            serie: 'DL98765432',
            fechaCreacion: '2024-01-15 11:45',
            estado: 'en_proceso',
            prioridad: 'media',
            observacion: 'Pantalla parpadea'
        },
        {
            id: 3,
            numeroTicket: 'TKT-2024-003',
            marca: 'Lenovo',
            modelo: 'ThinkPad X1',
            serie: 'LV45678901',
            fechaCreacion: '2024-01-14 09:15',
            estado: 'cerrado',
            prioridad: 'baja',
            observacion: 'Actualización de software'
        },
        {
            id: 4,
            numeroTicket: 'TKT-2024-004',
            marca: 'HP',
            modelo: 'ProBook 450',
            serie: 'HP78901234',
            fechaCreacion: '2024-01-14 14:20',
            estado: 'abierto',
            prioridad: 'urgente',
            observacion: 'No arranca el sistema'
        },
        {
            id: 5,
            numeroTicket: 'TKT-2024-005',
            marca: 'Apple',
            modelo: 'MacBook Pro',
            serie: 'MP34567890',
            fechaCreacion: '2024-01-13 16:00',
            estado: 'en_proceso',
            prioridad: 'alta',
            observacion: 'Batería no carga'
        },
        {
            id: 6,
            numeroTicket: 'TKT-2024-006',
            marca: 'Dell',
            modelo: 'XPS 13',
            serie: 'DX56789012',
            fechaCreacion: '2024-01-13 08:30',
            estado: 'abierto',
            prioridad: 'media',
            observacion: 'Sobrecalentamiento'
        },
        {
            id: 7,
            numeroTicket: 'TKT-2024-007',
            marca: 'Lenovo',
            modelo: 'ThinkBook',
            serie: 'LB12340987',
            fechaCreacion: '2024-01-12 13:45',
            estado: 'cerrado',
            prioridad: 'baja',
            observacion: 'Limpieza general'
        },
        {
            id: 8,
            numeroTicket: 'TKT-2024-008',
            marca: 'HP',
            modelo: 'ZBook Studio',
            serie: 'HZ56781234',
            fechaCreacion: '2024-01-12 10:10',
            estado: 'abierto',
            prioridad: 'alta',
            observacion: 'Error de disco duro'
        },
        {
            id: 9,
            numeroTicket: 'TKT-2024-009',
            marca: 'Microsoft',
            modelo: 'Surface Pro 9',
            serie: 'MS45678901',
            fechaCreacion: '2024-01-11 09:30',
            estado: 'en_proceso',
            prioridad: 'media',
            observacion: 'Actualización de Windows fallida'
        },
        {
            id: 10,
            numeroTicket: 'TKT-2024-010',
            marca: 'Asus',
            modelo: 'ZenBook 14',
            serie: 'AS78901234',
            fechaCreacion: '2024-01-11 15:20',
            estado: 'abierto',
            prioridad: 'urgente',
            observacion: 'Pantalla azul constante'
        },
        {
            id: 11,
            numeroTicket: 'TKT-2024-011',
            marca: 'Acer',
            modelo: 'Swift 3',
            serie: 'AC12349876',
            fechaCreacion: '2024-01-10 11:10',
            estado: 'cerrado',
            prioridad: 'baja',
            observacion: 'Mantenimiento preventivo'
        },
        {
            id: 12,
            numeroTicket: 'TKT-2024-012',
            marca: 'HP',
            modelo: 'Pavilion 15',
            serie: 'HP56781234',
            fechaCreacion: '2024-01-10 14:45',
            estado: 'abierto',
            prioridad: 'media',
            observacion: 'WiFi no funciona'
        },
    ]);

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
            abierto: {
                color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
                icon: faExclamationCircle,
                text: 'Abierto',
            },
            en_proceso: {
                color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
                icon: faSpinner,
                text: 'En Proceso',
            },
            cerrado: {
                color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                icon: faCheckCircle,
                text: 'Cerrado',
            },
        };

        const config = statusConfig[estado] || statusConfig.abierto;

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                <FontAwesomeIcon icon={config.icon} className="w-3 h-3" />
                {config.text}
            </span>
        );
    };

    // Función para manejar eliminación desde el modal
    const handleConfirmDelete = (id) => {
        setLoading(true);
        // Simular eliminación
        setTimeout(() => {
            const newData = ticketsData.filter((ticket) => ticket.id !== id);
            setTicketsData(newData);
            toastr.success('Ticket eliminado correctamente');
            setLoading(false);
        }, 500);
    };

    // Definir columnas para DataTable
    const columns = [
        {
            name: 'N° Ticket',
            selector: (row) => row.numeroTicket,
            sortable: true,
            grow: 1,
            minWidth: '120px',
            center: true,
        },
        {
            name: 'Marca',
            selector: (row) => row.marca,
            sortable: true,
            grow: 1,
            minWidth: '100px',
            center: true,
        },
        {
            name: 'Modelo',
            selector: (row) => row.modelo,
            sortable: true,
            grow: 1.5,
            minWidth: '150px',
            center: true,
        },
        {
            name: 'Serie',
            selector: (row) => row.serie,
            sortable: true,
            grow: 1.2,
            minWidth: '130px',
            center: true,
        },
        {
            name: 'Fecha Creación',
            selector: (row) => row.fechaCreacion,
            sortable: true,
            grow: 1.2,
            minWidth: '150px',
            center: true,
            cell: (row) => (
                <div className="flex items-center justify-center gap-1">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 w-3 h-3" />
                    {row.fechaCreacion}
                </div>
            ),
        },
        {
            name: 'Estado',
            selector: (row) => row.estado,
            sortable: true,
            grow: 1,
            minWidth: '120px',
            center: true,
            cell: (row) => <div className="flex justify-center">{getStatusBadge(row.estado)}</div>,
        },
        {
            name: 'Acciones',
            grow: 1,
            minWidth: '200px',
            center: true,
            cell: (row) => (
                <div className="flex items-center justify-center gap-2">
                    <button 
                        className="p-2 hover:bg-blue-100 rounded-full transition-colors" 
                        onClick={() => {
                            setSelectedTicket(row);
                            setModalVer(true);
                        }}
                        title="Ver ticket"
                    >
                        <FontAwesomeIcon icon={faEye} className="text-blue-600 w-4 h-4" />
                    </button>
                    <button 
                        className="p-2 hover:bg-yellow-100 rounded-full transition-colors" 
                        onClick={() => (window.location.href = `/tickets/editar/${row.id}`)}
                        title="Editar ticket"
                    >
                        <FontAwesomeIcon icon={faEdit} className="text-yellow-600 w-4 h-4" />
                    </button>
                    <button 
                        className="p-2 hover:bg-red-100 rounded-full transition-colors" 
                        onClick={() => {
                            setSelectedTicket(row);
                            setModalEliminar(true);
                        }}
                        title="Eliminar ticket"
                    >
                        <FontAwesomeIcon icon={faTrash} className="text-red-600 w-4 h-4" />
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
            data = data.filter(
                (item) =>
                    item.numeroTicket.toLowerCase().includes(filterText.toLowerCase()) ||
                    item.marca.toLowerCase().includes(filterText.toLowerCase()) ||
                    item.modelo.toLowerCase().includes(filterText.toLowerCase()) ||
                    item.serie.toLowerCase().includes(filterText.toLowerCase()),
            );
        }

        // Filtro por rango de fechas
        if (dateRange.start || dateRange.end) {
            data = data.filter((item) => {
                const itemDate = item.fechaCreacion.split(' ')[0]; // Obtener solo la fecha YYYY-MM-DD

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
                            selectedStatus === 'abierto' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
                        }`}
                        onClick={() => setSelectedStatus('abierto')}
                    >
                        <FontAwesomeIcon icon={faExclamationCircle} className="w-3 h-3" />
                        Abiertos
                    </button>
                    <button
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                            selectedStatus === 'en_proceso'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800'
                        }`}
                        onClick={() => setSelectedStatus('en_proceso')}
                    >
                        <FontAwesomeIcon icon={faSpinner} className="w-3 h-3" />
                        En Proceso
                    </button>
                    <button
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                            selectedStatus === 'cerrado' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
                        }`}
                        onClick={() => setSelectedStatus('cerrado')}
                    >
                        <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3" />
                        Cerrados
                    </button>
                </div>

                {/* Buscador */}
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 ml-auto">
                    <FontAwesomeIcon icon={faSearch} className="text-gray-400 w-4 h-4 ml-1" />
                    <input 
                        type="text" 
                        className="form-input border-0 focus:ring-0 p-0 text-sm w-64" 
                        placeholder="Buscar..." 
                        value={filterText} 
                        onChange={(e) => setFilterText(e.target.value)} 
                    />
                    {filterText && (
                        <button 
                            onClick={() => setFilterText('')} 
                            className="text-gray-400 hover:text-gray-600 mr-1"
                        >
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
            },
        },
        rows: {
            style: {
                minHeight: '60px',
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

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white-light flex items-center gap-3">
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
                            <FontAwesomeIcon icon={faTicket} className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                        </div>
                        Gestión de Tickets
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base mt-2">Administra todos los tickets de soporte técnico</p>
                </div>
                <Link to="/tickets/crear" className="btn btn-primary flex items-center gap-2">
                    <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                    Nuevo Ticket
                </Link>
            </div>

            {/* Filtros de fecha fuera del panel */}
            <div className="mb-5 flex items-center gap-4 flex-wrap bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4" />
                    Filtrar por fecha:
                </span>

                {/* Fecha inicio */}
                <div className="relative">
                    <input type="text" ref={startDateRef} className="form-input w-40 pl-8" placeholder="Fecha inicial" />
                    <FontAwesomeIcon icon={faCalendarAlt} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                </div>

                <span className="text-gray-400">-</span>

                {/* Fecha fin */}
                <div className="relative">
                    <input type="text" ref={endDateRef} className="form-input w-40 pl-8" placeholder="Fecha final" />
                    <FontAwesomeIcon icon={faCalendarAlt} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                </div>

                {/* Botón limpiar filtros */}
                {(dateRange.start || dateRange.end) && (
                    <button onClick={clearDateFilters} className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors">
                        <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                        Limpiar fechas
                    </button>
                )}

                {/* Indicador de filtro activo */}
                {(dateRange.start || dateRange.end) && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Filtro por fechas activo
                    </span>
                )}
            </div>

            {/* Tabla con react-data-table-component */}
            <div className="panel p-5">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    progressPending={loading}
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
                        </div>
                    }
                    customStyles={customStyles}
                />
            </div>

            {/* Modales */}
            <ModalVerTicket 
                modal={modalVer} 
                setModal={setModalVer} 
                ticketData={selectedTicket}
            />
            
            <ModalEliminarTicket 
                modal={modalEliminar} 
                setModal={setModalEliminar} 
                ticketData={selectedTicket}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default ListaTickets;