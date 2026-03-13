// pages/Analytics.tsx
import { Link } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dropdown from '../components/Dropdown';
import { useEffect, useState, useRef, useCallback } from 'react';
import { setPageTitle } from '../store/themeConfigSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTicket,
    faMapLocation,
    faGear,
    faClock,
    faUserGear,
    faRotateRight,
    faChartSimple,
    faCalendarDay,
    faCalendarWeek,
    faCalendarAlt,
    faCircleCheck,
    faTriangleExclamation,
    faHardDrive,
    faMicrochip,
    faBolt,
    faBrush,
    faLaptopCode,
    faIndustry,
    faUsers,
    faArrowTrendUp,
    faArrowTrendDown,
    faStopwatch,
    faDownload,
    faPrint,
    faExpand,
    faCompress,
    faChartLine,
    faChartPie,
    faChartBar,
    faTable,
    faClockRotateLeft,
    faUserCheck,
    faFlask,
    faCheckDouble,
    faMedal,
    faStar,
    faRefresh,
    faExclamationTriangle,
    faBuilding,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';
import analyticsService, { DashboardData } from '../services/analytics.service';

// ==================== COMPONENTE PARA GRÁFICOS RESPONSIVOS ====================
const ResponsiveEChart = ({ option, style, ...props }: any) => {
    const chartRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const forceResize = () => {
            if (chartRef.current) {
                setTimeout(() => {
                    chartRef.current.getEchartsInstance().resize();
                }, 50);
            }
        };

        if (containerRef.current) {
            const resizeObserver = new ResizeObserver(() => {
                forceResize();
            });
            resizeObserver.observe(containerRef.current);

            // Observar cambios en el sidebar
            const sidebar = document.querySelector('.sidebar') || document.querySelector('.navbar');
            if (sidebar) {
                resizeObserver.observe(sidebar);
            }

            return () => resizeObserver.disconnect();
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            if (chartRef.current) {
                chartRef.current.getEchartsInstance().resize();
            }
        }, 200);
    }, [option]);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: style?.height || '350px',
                position: 'relative'
            }}
        >
            <ReactECharts
                ref={chartRef}
                option={option}
                style={{
                    width: '100%',
                    height: '100%'
                }}
                opts={{
                    renderer: 'canvas',
                    width: 'auto',
                    height: 'auto'
                }}
                {...props}
            />
        </div>
    );
};

// Componente de carga
const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-64">
        <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-primary mb-4" />
            <p className="text-gray-600">Cargando dashboard...</p>
        </div>
    </div>
);

// Componente de error
const ErrorDisplay = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {message}</span>
        <button
            onClick={onRetry}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
            Reintentar
        </button>
    </div>
);

// Valores por defecto para cuando no hay datos
const defaultDashboardData: DashboardData = {
    ticketsPorPeriodo: {
        dia: 0,
        semana: 0,
        mes: 0,
        año: 0,
        tendencia: {
            dia: 0,
            semana: 0,
            mes: 0,
            año: 0
        }
    },
    ticketsPorDistrito: [],
    ticketsPorFalla: [],
    ticketsPorEstado: [],
    tiemposPromedio: {
        coordinacionInicial: { horas: 0, tendencia: 0 },
        solucionOnSite: { horas: 0, tendencia: 0 },
        solucionLaboratorio: { horas: 0, tendencia: 0 },
        resolucionTotal: { horas: 0, tendencia: 0 }
    },
    reincidencias: {
        porcentaje: 0,
        total: 0,
        reincidentes: 0,
        porTecnico: [],
        tendencia: 0
    },
    ticketsPorTecnico: {
        diario: [],
        semanal: [],
        mensual: []
    },
    ticketsPorPersonal: {
        diario: 0,
        semanal: 0,
        mensual: 0,
        objetivos: {
            diario: 40,
            semanal: 200,
            mensual: 800
        }
    },
    tendencias: {
        diario: [],
        mensual: []
    }
};

const Analytics = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<DashboardData>(defaultDashboardData);

    const [periodoTickets, setPeriodoTickets] = useState<'dia' | 'semana' | 'mes' | 'año'>('mes');
    const [periodoTecnicos, setPeriodoTecnicos] = useState<'diario' | 'semanal' | 'mensual'>('diario');
    const [vistaDistritos, setVistaDistritos] = useState<'grafico' | 'tabla'>('grafico');
    const [expandido, setExpandido] = useState(false);

    useEffect(() => {
        dispatch(setPageTitle('Analytics Dashboard - Tickets'));
    }, [dispatch]);

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    // Función para cargar datos
    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const dashboardData = await analyticsService.getDashboardData();
            setData(dashboardData || defaultDashboardData);
        } catch (err: any) {
            console.error('Error loading dashboard data:', err);
            setError(err.message || 'No se pudieron cargar los datos del dashboard');
            setData(defaultDashboardData);
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar datos al montar el componente
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Forzar resize inicial
    useEffect(() => {
        const forceResize = () => {
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 100);
        };

        forceResize();

        // Observar cambios en el sidebar
        const observer = new MutationObserver(() => {
            forceResize();
        });

        const sidebar = document.querySelector('.sidebar') || document.querySelector('.navbar');
        if (sidebar) {
            observer.observe(sidebar, {
                attributes: true,
                attributeFilter: ['class', 'style']
            });
        }

        return () => observer.disconnect();
    }, []);

    // Si está cargando, mostrar spinner
    if (loading) {
        return <LoadingSpinner />;
    }

    // Si hay error, mostrar mensaje
    if (error) {
        return <ErrorDisplay message={error} onRetry={loadData} />;
    }

    // Configuración de gráficos con validaciones
    const tendenciaTicketsOption = {
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
            type: 'category',
            data: periodoTickets === 'dia'
                ? Array.from({ length: 30 }, (_, i) => `Día ${i + 1}`)
                : ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            axisLabel: { color: isDark ? '#bfc9d4' : '#506690' }
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: isDark ? '#bfc9d4' : '#506690' },
            splitLine: { lineStyle: { color: isDark ? '#191e3a' : '#e0e6ed' } }
        },
        series: [{
            name: 'Tickets',
            type: 'line',
            data: periodoTickets === 'dia'
                ? (data?.tendencias?.diario?.length ? data.tendencias.diario : Array(30).fill(0))
                : (data?.tendencias?.mensual?.length ? data.tendencias.mensual : Array(12).fill(0)),
            smooth: true,
            lineStyle: { width: 3, color: '#4361ee' },
            areaStyle: { color: isDark ? '#4361ee20' : '#4361ee10' },
            symbol: 'circle',
            symbolSize: 8
        }]
    };

    const ticketsDistritoOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: (params: any) => {
                if (!params || !params[0]) return '';
                const item = data?.ticketsPorDistrito?.[params[0].dataIndex];
                if (!item) return '';
                return `
                    <div class="font-semibold">${item.distrito || 'N/A'}</div>
                    <div class="text-xs">Provincia: ${item.provincia || 'N/A'}</div>
                    <div class="flex justify-between mt-1">
                        <span>Tickets:</span>
                        <span class="font-bold">${item.cantidad || 0}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Variación:</span>
                        <span class="${item.variacion >= 0 ? 'text-success' : 'text-danger'}">
                            ${item.variacion >= 0 ? '+' : ''}${item.variacion || 0}%
                        </span>
                    </div>
                `;
            }
        },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
            type: 'value',
            axisLabel: { color: isDark ? '#bfc9d4' : '#506690' },
            splitLine: { lineStyle: { color: isDark ? '#191e3a' : '#e0e6ed' } }
        },
        yAxis: {
            type: 'category',
            data: data?.ticketsPorDistrito?.map(item => item.distrito || 'Sin distrito') || [],
            axisLabel: { color: isDark ? '#bfc9d4' : '#506690' },
            axisLine: { lineStyle: { color: isDark ? '#3b3f5c' : '#e0e6ed' } }
        },
        series: [{
            name: 'Tickets',
            type: 'bar',
            data: data?.ticketsPorDistrito?.map(item => item.cantidad || 0) || [],
            itemStyle: {
                color: (params: any) => {
                    const item = data?.ticketsPorDistrito?.[params.dataIndex];
                    return item?.variacion >= 0 ? '#10b981' : '#e7515a';
                },
                borderRadius: [0, 8, 8, 0]
            },
            barWidth: 20,
            label: {
                show: true,
                position: 'right',
                formatter: (params: any) => {
                    const item = data?.ticketsPorDistrito?.[params.dataIndex];
                    return item ? `${item.cantidad || 0} (${item.variacion >= 0 ? '+' : ''}${item.variacion || 0}%)` : '';
                },
                color: isDark ? '#bfc9d4' : '#506690',
                fontSize: 11
            }
        }]
    };

    const ticketsFallaOption = {
        tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
                return `${params.name}: ${params.value} tickets (${params.percent}%)`;
            }
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            textStyle: { color: isDark ? '#bfc9d4' : '#506690' }
        },
        series: [{
            name: 'Tickets por Falla',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: isDark ? '#1b2e4b' : '#fff',
                borderWidth: 2
            },
            label: {
                show: true,
                position: 'outside',
                formatter: '{b}: {d}%',
                color: isDark ? '#bfc9d4' : '#506690'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 14,
                    fontWeight: 'bold'
                }
            },
            data: (data?.ticketsPorFalla || []).map(item => ({
                name: item.falla || 'Sin falla',
                value: item.cantidad || 0,
                itemStyle: { color: item.color || '#4361ee' }
            }))
        }]
    };

    const ticketsEstadoOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: (params: any) => {
                if (!params || !params[0]) return '';
                const item = data?.ticketsPorEstado?.[params[0].dataIndex];
                if (!item) return '';
                return `
                    <div class="font-semibold">${item.estado || 'N/A'}</div>
                    <div class="flex justify-between mt-1">
                        <span>Tickets:</span>
                        <span class="font-bold">${item.cantidad || 0}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Porcentaje:</span>
                        <span>${data?.ticketsPorPeriodo?.mes ? Math.round((item.cantidad || 0) / data.ticketsPorPeriodo.mes * 100) : 0}%</span>
                    </div>
                `;
            }
        },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
            type: 'category',
            data: data?.ticketsPorEstado.map(item => item.estado),
            axisLabel: {
                color: isDark ? '#bfc9d4' : '#506690',
                rotate: 15,
                fontSize: 11
            },
            axisLine: { lineStyle: { color: isDark ? '#3b3f5c' : '#e0e6ed' } }
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: isDark ? '#bfc9d4' : '#506690' },
            splitLine: { lineStyle: { color: isDark ? '#191e3a' : '#e0e6ed' } }
        },
        series: [{
            name: 'Tickets',
            type: 'bar',
            data: data?.ticketsPorEstado?.map(item => item.cantidad || 0) || [],
            itemStyle: {
                color: (params: any) => data?.ticketsPorEstado?.[params.dataIndex]?.color || '#4361ee',
                borderRadius: [8, 8, 0, 0]
            },
            barWidth: 40,
            label: {
                show: true,
                position: 'top',
                color: isDark ? '#bfc9d4' : '#506690',
                fontSize: 11,
                formatter: (params: any) => params.value || 0
            }
        }]
    };

    const ticketsTecnicoOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: (params: any) => {
                if (!params || !params[0]) return '';
                const item = data?.ticketsPorTecnico?.[periodoTecnicos]?.[params[0].dataIndex];
                if (!item) return '';
                return `
                    <div class="font-semibold">${item.tecnico || 'N/A'}</div>
                    <div class="flex justify-between mt-1">
                        <span>Tickets:</span>
                        <span class="font-bold">${item.tickets || 0}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Eficiencia:</span>
                        <span class="${(item.eficiencia || 0) >= 90 ? 'text-success' : 'text-warning'}">${item.eficiencia || 0}%</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Reincidencias:</span>
                        <span class="text-danger">${item.reincidencias || 0}</span>
                    </div>
                `;
            }
        },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
            type: 'category',
            data: data?.ticketsPorTecnico[periodoTecnicos].map(item => item.tecnico.split(' ')[0]),
            axisLabel: {
                color: isDark ? '#bfc9d4' : '#506690',
                rotate: 15
            },
            axisLine: { lineStyle: { color: isDark ? '#3b3f5c' : '#e0e6ed' } }
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: isDark ? '#bfc9d4' : '#506690' },
            splitLine: { lineStyle: { color: isDark ? '#191e3a' : '#e0e6ed' } }
        },
        series: [{
            name: 'Tickets',
            type: 'bar',
            data: (data?.ticketsPorTecnico?.[periodoTecnicos] || []).map(item => item.tickets || 0),
            itemStyle: {
                color: '#e2a03f',
                borderRadius: [8, 8, 0, 0]
            },
            barWidth: 30,
            label: {
                show: true,
                position: 'top',
                color: isDark ? '#bfc9d4' : '#506690',
                fontSize: 11,
                formatter: (params: any) => params.value || 0
            }
        }]
    };

    return (
        <div>
            {/* Header mejorado con acciones */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/" className="text-primary hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Analytics Tickets</span>
                    </li>
                </ul>
            </div>

            <div className={`pt-5 transition-all duration-300 ${expandido ? 'scale-100' : ''}`}>
                {/* Fila 1: KPIs Principales - con validaciones */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="panel bg-gradient-to-r from-[#4361ee] to-[#805dca] text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-6 -mb-6"></div>

                        <div className="flex justify-between items-center relative z-10">
                            <div>
                                <p className="text-white/70 text-sm flex items-center gap-1">
                                    <FontAwesomeIcon icon={faTicket} />
                                    Total Tickets
                                </p>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <h3 className="text-3xl font-bold">{data?.ticketsPorPeriodo?.[periodoTickets]?.toLocaleString() || 0}</h3>
                                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                                        <FontAwesomeIcon icon={faArrowTrendUp} className="mr-1" />
                                        +{data?.ticketsPorPeriodo?.tendencia?.[periodoTickets] || 0}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-2 text-white/80 text-xs relative z-10">
                            <div className="bg-white/10 rounded p-2 text-center">
                                <div>Día</div>
                                <div className="font-bold text-sm">{data?.ticketsPorPeriodo?.dia || 0}</div>
                            </div>
                            <div className="bg-white/10 rounded p-2 text-center">
                                <div>Semana</div>
                                <div className="font-bold text-sm">{data?.ticketsPorPeriodo?.semana || 0}</div>
                            </div>
                            <div className="bg-white/10 rounded p-2 text-center">
                                <div>Mes</div>
                                <div className="font-bold text-sm">{data?.ticketsPorPeriodo?.mes || 0}</div>
                            </div>
                        </div>
                    </div>

                    <div className="panel">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-white-dark text-sm">Tickets Cerrados</p>
                            <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                                {data?.ticketsPorPeriodo?.mes ? Math.round(((data?.ticketsPorEstado?.find(e => e.estado === 'Cerrado')?.cantidad || 0) / data.ticketsPorPeriodo.mes) * 100) : 0}% del total
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-success/10 text-success rounded-full w-12 h-12 flex items-center justify-center">
                                <FontAwesomeIcon icon={faCircleCheck} className="text-2xl" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold">{data?.ticketsPorEstado?.find(e => e.estado === 'Cerrado')?.cantidad || 0}</h4>
                                <div className="flex items-center gap-2 text-xs">
                                    <FontAwesomeIcon icon={faArrowTrendUp} className="text-success" />
                                    <span className="text-success">+12% vs mes anterior</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="panel">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-white-dark text-sm">Tiempo Prom. Resolución</p>
                            <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-full">
                                Meta: 48h
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-warning/10 text-warning rounded-full w-12 h-12 flex items-center justify-center">
                                <FontAwesomeIcon icon={faClock} className="text-2xl" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold">{data?.tiemposPromedio?.resolucionTotal?.horas || 0}h</h4>
                                <div className="flex items-center gap-2 text-xs">
                                    <FontAwesomeIcon icon={data?.tiemposPromedio.resolucionTotal.tendencia > 0 ? faArrowTrendUp : faArrowTrendDown}
                                        className={data?.tiemposPromedio.resolucionTotal.tendencia > 0 ? 'text-danger' : 'text-success'} />
                                    <span className={data?.tiemposPromedio.resolucionTotal.tendencia > 0 ? 'text-danger' : 'text-success'}>
                                        {Math.abs(data?.tiemposPromedio.resolucionTotal.tendencia)}h vs ayer
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="panel">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-white-dark text-sm">Reincidencias</p>
                            <span className="text-xs bg-danger/10 text-danger px-2 py-1 rounded-full">
                                <FontAwesomeIcon icon={faArrowTrendDown} className="mr-1" />
                                {Math.abs(data?.reincidencias?.tendencia || 0)}%
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-danger/10 text-danger rounded-full w-12 h-12 flex items-center justify-center">
                                <FontAwesomeIcon icon={faRotateRight} className="text-2xl" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold">{data?.reincidencias?.porcentaje || 0}%</h4>
                                <div className="flex items-center gap-1 text-xs">
                                    <span className="text-white-dark">{data?.reincidencias?.reincidentes || 0} tickets</span>
                                    <span className="text-danger">• {data?.reincidencias?.total || 0} únicos</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gráfico de Tendencia */}
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="panel">
                        <div className="flex justify-between items-center mb-5">
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faChartLine} className="text-primary text-xl" />
                                <h5 className="font-semibold text-lg">Tendencia de Tickets</h5>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-md">
                                    <FontAwesomeIcon icon={faCalendarDay} className="mr-1" /> Últimos 30 días
                                </button>
                            </div>
                        </div>
                        <ResponsiveEChart option={tendenciaTicketsOption} style={{ height: '200px' }} />
                    </div>
                </div>

                {/* Fila 2: Tickets por Distrito y por Falla */}
                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                    <div className="panel">
                        <div className="flex justify-between items-center mb-5">
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faMapLocation} className="text-primary text-xl" />
                                <h5 className="font-semibold text-lg">Tickets por Distrito</h5>
                            </div>
                            <div className="flex gap-1 bg-white-dark/10 rounded-lg p-1">
                                <button
                                    onClick={() => setVistaDistritos('grafico')}
                                    className={`px-3 py-1 rounded-md text-sm ${vistaDistritos === 'grafico' ? 'bg-primary text-white' : ''}`}
                                >
                                    <FontAwesomeIcon icon={faChartBar} />
                                </button>
                                <button
                                    onClick={() => setVistaDistritos('tabla')}
                                    className={`px-3 py-1 rounded-md text-sm ${vistaDistritos === 'tabla' ? 'bg-primary text-white' : ''}`}
                                >
                                    <FontAwesomeIcon icon={faTable} />
                                </button>
                            </div>
                        </div>

                        {vistaDistritos === 'grafico' ? (
                            <>
                                <ResponsiveEChart option={ticketsDistritoOption} style={{ height: '350px' }} />
                                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                                    <span className="bg-success/10 text-success px-2 py-1 rounded-full text-xs">
                                        <FontAwesomeIcon icon={faArrowTrendUp} className="mr-1" /> Crecimiento
                                    </span>
                                    <span className="bg-danger/10 text-danger px-2 py-1 rounded-full text-xs">
                                        <FontAwesomeIcon icon={faArrowTrendDown} className="mr-1" /> Decrecimiento
                                    </span>
                                </div>
                            </>
                        ) : (
                            <PerfectScrollbar className="h-[350px]">
                                <table className="table-hover w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-left">Distrito</th>
                                            <th className="text-left">Provincia</th>
                                            <th className="text-right">Tickets</th>
                                            <th className="text-right">Variación</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(data?.ticketsPorDistrito || []).map((item, index) => (
                                            <tr key={index}>
                                                <td className="font-semibold">{item.distrito || 'N/A'}</td>
                                                <td>{item.provincia || 'N/A'}</td>
                                                <td className="text-right">{item.cantidad || 0}</td>
                                                <td className="text-right">
                                                    <span className={`${(item.variacion || 0) >= 0 ? 'text-success' : 'text-danger'} flex items-center gap-1 justify-end`}>
                                                        <FontAwesomeIcon icon={(item.variacion || 0) >= 0 ? faArrowTrendUp : faArrowTrendDown} />
                                                        {(item.variacion || 0) >= 0 ? '+' : ''}{item.variacion || 0}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </PerfectScrollbar>
                        )}

                        <div className="mt-4 text-sm text-white-dark flex items-center justify-between">
                            <span>
                                <FontAwesomeIcon icon={faBuilding} className="mr-1" />
                                {[...new Set((data?.ticketsPorDistrito || []).map(item => item.provincia || 'N/A'))].length} provincias
                            </span>
                            <span className="font-semibold">Total: {(data?.ticketsPorDistrito || []).reduce((acc, item) => acc + (item.cantidad || 0), 0)} tickets</span>
                        </div>
                    </div>

                    <div className="panel">
                        <div className="flex items-center gap-2 mb-5">
                            <FontAwesomeIcon icon={faGear} className="text-primary text-xl" />
                            <h5 className="font-semibold text-lg">Tickets por Tipo de Falla</h5>
                        </div>

                        {/* Leyenda interactiva */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {(data?.ticketsPorFalla || []).map((falla, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: falla.color || '#4361ee' }}></span>
                                    <span className="flex-1">{falla.falla || 'Sin falla'}</span>
                                    <span className="font-semibold">{falla.porcentaje || 0}%</span>
                                </div>
                            ))}
                        </div>

                        <ResponsiveEChart option={ticketsFallaOption} style={{ height: '300px' }} />

                        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                            <div className="bg-primary/5 p-2 rounded">
                                <div className="text-xs text-white-dark">Principal</div>
                                <div className="font-semibold">{data?.ticketsPorFalla?.[0]?.falla || 'N/A'}</div>
                                <div className="text-primary text-sm">{data?.ticketsPorFalla?.[0]?.cantidad || 0}</div>
                            </div>
                            <div className="bg-success/5 p-2 rounded">
                                <div className="text-xs text-white-dark">Mejoría</div>
                                <div className="font-semibold">Software</div>
                                <div className="text-success text-sm">-5%</div>
                            </div>
                            <div className="bg-danger/5 p-2 rounded">
                                <div className="text-xs text-white-dark">Crítico</div>
                                <div className="font-semibold">Mainboard</div>
                                <div className="text-danger text-sm">+8%</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fila 3: Tickets por Estado */}
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="panel">
                        <div className="flex justify-between items-center mb-5">
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faChartSimple} className="text-primary text-xl" />
                                <h5 className="font-semibold text-lg">Flujo de Tickets por Estado</h5>
                            </div>
                            <div className="flex gap-2">
                                {(data?.ticketsPorEstado || []).map((estado, index) => (
                                    <div key={index} className="flex items-center gap-1 text-xs">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: estado.color || '#4361ee' }}></span>
                                        <span>{estado.estado || 'N/A'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-5 gap-4 mb-4">
                            {(data?.ticketsPorEstado || []).map((estado, index) => {
                                const iconMap: { [key: string]: any } = {
                                    'Diagnóstico': faClock,
                                    'Visita Finalizada': faCircleCheck,
                                    'Pendiente Recojo': faTicket,
                                    'Ingreso a Laboratorio': faFlask,
                                    'Cerrado': faCheckDouble
                                };
                                return (
                                    <div key={index} className="bg-white-dark/5 rounded-lg p-3 text-center">
                                        <FontAwesomeIcon icon={iconMap[estado.estado || ''] || faTicket} className="text-2xl mb-2" style={{ color: estado.color || '#4361ee' }} />
                                        <div className="text-sm font-semibold">{estado.estado || 'N/A'}</div>
                                        <div className="text-xl font-bold" style={{ color: estado.color || '#4361ee' }}>{estado.cantidad || 0}</div>
                                        <div className="text-xs text-white-dark">
                                            {data?.ticketsPorPeriodo?.mes ? Math.round(((estado.cantidad || 0) / data.ticketsPorPeriodo.mes) * 100) : 0}% del total
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <ResponsiveEChart option={ticketsEstadoOption} style={{ height: '250px' }} />
                    </div>
                </div>

                {/* Fila 4: Tiempos Promedio */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {data?.tiemposPromedio && Object.entries(data.tiemposPromedio).map(([key, value], index) => {
                        const titles = {
                            coordinacionInicial: { label: 'Coord. Inicial', icon: faClockRotateLeft, color: 'info' },
                            solucionOnSite: { label: 'Solución On Site', icon: faUserCheck, color: 'success' },
                            solucionLaboratorio: { label: 'Solución Lab.', icon: faFlask, color: 'warning' },
                            resolucionTotal: { label: 'Resolución Total', icon: faCheckDouble, color: 'danger' }
                        };
                        const title = titles[key as keyof typeof titles];

                        return (
                            <div key={index} className="panel bg-gradient-to-br from-[#1b2e4b] to-[#253b5b] text-white relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>

                                <div className="flex items-center gap-3 relative z-10">
                                    <div className={`bg-${title.color} rounded-full w-12 h-12 flex items-center justify-center text-2xl`}>
                                        <FontAwesomeIcon icon={title.icon} />
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-${title.color}/70 text-sm`}>{title.label}</p>
                                        <div className="flex items-baseline justify-between">
                                            <h4 className="text-2xl font-bold">{value?.horas || 0} <span className="text-sm">horas</span></h4>
                                            <span className={`text-${(value?.tendencia || 0) > 0 ? 'danger' : 'success'} text-xs flex items-center gap-1`}>
                                                <FontAwesomeIcon icon={(value?.tendencia || 0) > 0 ? faArrowTrendUp : faArrowTrendDown} />
                                                {Math.abs(value?.tendencia || 0)}h
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Barra de progreso hacia la meta */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-white/70">Meta: 48h</span>
                                        <span className="text-white/70">{value?.horas ? Math.round((48 - value.horas) / 48 * 100) : 0}% restante</span>
                                    </div>
                                    <div className="w-full bg-white/20 rounded-full h-1.5">
                                        <div
                                            className={`bg-${title.color} h-1.5 rounded-full transition-all duration-500`}
                                            style={{ width: `${value?.horas ? Math.min(100, (value.horas / 48) * 100) : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Fila 5: Tickets por Técnico y Personal */}
                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                    <div className="panel">
                        <div className="flex justify-between items-center mb-5">
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faUserGear} className="text-primary text-xl" />
                                <h5 className="font-semibold text-lg">Rendimiento por Técnico</h5>
                            </div>
                            <div className="flex gap-1 bg-white-dark/10 rounded-lg p-1">
                                <button
                                    onClick={() => setPeriodoTecnicos('diario')}
                                    className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${periodoTecnicos === 'diario' ? 'bg-primary text-white' : ''}`}
                                >
                                    <FontAwesomeIcon icon={faCalendarDay} /> Día
                                </button>
                                <button
                                    onClick={() => setPeriodoTecnicos('semanal')}
                                    className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${periodoTecnicos === 'semanal' ? 'bg-primary text-white' : ''}`}
                                >
                                    <FontAwesomeIcon icon={faCalendarWeek} /> Semana
                                </button>
                                <button
                                    onClick={() => setPeriodoTecnicos('mensual')}
                                    className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${periodoTecnicos === 'mensual' ? 'bg-primary text-white' : ''}`}
                                >
                                    <FontAwesomeIcon icon={faCalendarAlt} /> Mes
                                </button>
                            </div>
                        </div>

                        {/* Tarjetas de técnicos */}
                        <div className="grid grid-cols-1 gap-3 mb-4">
                            {(data?.ticketsPorTecnico?.[periodoTecnicos] || []).map((tecnico, index) => (
                                <div key={index} className="bg-white-dark/5 rounded-lg p-3 hover:bg-primary/5 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                                                ${index === 0 ? 'bg-yellow-500' :
                                                    index === 1 ? 'bg-gray-400' :
                                                        index === 2 ? 'bg-orange-400' : 'bg-primary/50'}`}>
                                                {tecnico.tecnico.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="font-semibold flex items-center gap-2">
                                                    {tecnico.tecnico || 'N/A'}
                                                    {index === 0 && <FontAwesomeIcon icon={faMedal} className="text-yellow-500" />}
                                                    {(tecnico.eficiencia || 0) >= 95 && <FontAwesomeIcon icon={faStar} className="text-yellow-500 text-xs" />}
                                                </div>
                                                <div className="flex items-center gap-3 text-xs">
                                                    <span className="text-white-dark">
                                                        <FontAwesomeIcon icon={faTicket} className="mr-1" />
                                                        {tecnico.tickets || 0} tickets
                                                    </span>
                                                    <span className={`${(tecnico.eficiencia || 0) >= 90 ? 'text-success' : 'text-warning'}`}>
                                                        <FontAwesomeIcon icon={faChartLine} className="mr-1" />
                                                        {tecnico.eficiencia || 0}% eficiencia
                                                    </span>
                                                    {(tecnico.reincidencias || 0) > 0 && (
                                                        <span className="text-danger">
                                                            <FontAwesomeIcon icon={faRotateRight} className="mr-1" />
                                                            {tecnico.reincidencias} re.
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Barra de progreso de eficiencia */}
                                        <div className="w-24">
                                            <div className="w-full bg-white-dark/20 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${tecnico.eficiencia >= 90 ? 'bg-success' : tecnico.eficiencia >= 80 ? 'bg-warning' : 'bg-danger'}`}
                                                    style={{ width: `${tecnico.eficiencia}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mini gráfico de comparativa */}
                        <ResponsiveEChart option={ticketsTecnicoOption} style={{ height: '150px' }} />
                    </div>

                    <div className="panel">
                        <div className="flex items-center gap-2 mb-5">
                            <FontAwesomeIcon icon={faUsers} className="text-primary text-xl" />
                            <h5 className="font-semibold text-lg">Rendimiento del Personal</h5>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {['Diario', 'Semanal', 'Mensual'].map((periodo, index) => {
                                const valores = [data?.ticketsPorPersonal.diario, data?.ticketsPorPersonal.semanal, data?.ticketsPorPersonal.mensual];
                                const objetivos = [data?.ticketsPorPersonal.objetivos.diario, data?.ticketsPorPersonal.objetivos.semanal, data?.ticketsPorPersonal.objetivos.mensual];
                                const alcanzado = (valores[index] / objetivos[index]) * 100;

                                return (
                                    <div key={index} className="text-center p-4 bg-white-dark/5 rounded-lg hover:shadow-lg transition-all">
                                        <FontAwesomeIcon
                                            icon={index === 0 ? faCalendarDay : index === 1 ? faCalendarWeek : faCalendarAlt}
                                            className={`text-2xl mb-2 text-${index === 0 ? 'primary' : index === 1 ? 'success' : 'warning'}`}
                                        />
                                        <p className="text-white-dark text-sm">{periodo}</p>
                                        <p className="text-2xl font-bold">{valores[index]}</p>
                                        <div className="mt-2">
                                            <div className="w-full bg-white-dark/20 rounded-full h-1.5">
                                                <div
                                                    className={`h-1.5 rounded-full bg-${index === 0 ? 'primary' : index === 1 ? 'success' : 'warning'}`}
                                                    style={{ width: `${Math.min(100, alcanzado)}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-white-dark mt-1">
                                                {Math.round(alcanzado)}% de meta ({objetivos[index]})
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Top técnicos con medallas */}
                        <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-lg p-4">
                            <h6 className="font-semibold mb-3 flex items-center gap-2">
                                <FontAwesomeIcon icon={faMedal} className="text-yellow-500" />
                                Podio de Honor - {periodoTecnicos}
                            </h6>
                            <div className="space-y-3">
                                {(data?.ticketsPorTecnico?.[periodoTecnicos] || []).slice(0, 3).map((tecnico, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold
                                                ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'}`}>
                                                {index + 1}
                                            </div>
                                            <div>
                                                <span className="font-semibold">{tecnico.tecnico || 'N/A'}</span>
                                                <div className="text-xs text-white-dark">
                                                    {tecnico.tickets || 0} tickets • {tecnico.eficiencia || 0}% efectividad
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-lg">{tecnico.tickets || 0}</div>
                                            <div className="text-xs text-success">+{Math.round((tecnico.tickets || 0) * 0.15)} vs promedio</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fila 6: Análisis de Reincidencias */}
                <div className="grid grid-cols-1 gap-6">
                    <div className="panel">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faRotateRight} className="text-danger text-xl" />
                                <h5 className="font-semibold text-lg">Análisis de Reincidencias</h5>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-danger/5 px-3 py-1 rounded-full">
                                    <FontAwesomeIcon icon={(data?.reincidencias?.tendencia || 0) > 0 ? faArrowTrendUp : faArrowTrendDown} className={(data?.reincidencias?.tendencia || 0) > 0 ? 'text-danger' : 'text-success'} />
                                    <span className="text-sm">{(data?.reincidencias?.tendencia || 0) > 0 ? 'Empeorando' : 'Mejorando'} {Math.abs(data?.reincidencias?.tendencia || 0)}%</span>
                                </div>
                                <div className="flex items-center gap-2 bg-primary/5 px-3 py-1 rounded-full">
                                    <FontAwesomeIcon icon={faTicket} className="text-primary" />
                                    <span className="text-sm">{data?.reincidencias?.reincidentes || 0} tickets</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="col-span-2">
                                <div className="bg-white-dark/5 p-4 rounded-lg">
                                    <p className="text-white-dark mb-3 flex items-center gap-2">
                                        <FontAwesomeIcon icon={faChartPie} />
                                        Distribución de reincidencias por tipo de falla
                                    </p>
                                    <div className="space-y-4">
                                        {(data?.ticketsPorFalla || []).map((falla, index) => {
                                            const reincidencias = Math.round((falla.cantidad || 0) * ((data?.reincidencias?.porcentaje || 0) / 100));
                                            return (
                                                <div key={index}>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: falla.color || '#4361ee' }}></span>
                                                            <span>{falla.falla || 'Sin falla'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-semibold">{reincidencias} tickets</span>
                                                            <span className="text-xs text-white-dark">
                                                                {data?.reincidencias?.reincidentes ? Math.round(reincidencias / data.reincidencias.reincidentes * 100) : 0}% del total
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="w-full bg-white-dark/20 rounded-full h-2">
                                                        <div
                                                            className="bg-danger h-2 rounded-full transition-all duration-500"
                                                            style={{ width: `${Math.min(100, (reincidencias / 30) * 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-danger/10 to-danger/5 rounded-lg p-4">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-danger text-3xl mb-2" />
                                    <p className="text-sm text-white-dark mb-1">Tickets con más de 2 visitas</p>
                                    <p className="text-3xl font-bold text-danger">87</p>
                                    <p className="text-xs text-white-dark mt-1">Requieren atención especial</p>
                                </div>

                                <div className="bg-white-dark/5 rounded-lg p-4">
                                    <h6 className="font-semibold mb-2 text-sm">Técnicos con más reincidencias</h6>
                                    {(data?.reincidencias?.porTecnico || []).map((item, index) => (
                                        <div key={index} className="flex justify-between items-center text-sm py-1">
                                            <span>{item.tecnico || 'N/A'}</span>
                                            <span className="font-semibold text-danger">{item.reincidencias || 0}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-success/5 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-white-dark">Tasa de éxito</p>
                                            <p className="text-xl font-bold text-success">
                                                {100 - (data?.reincidencias?.porcentaje || 0)}%
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-white-dark">1ra visita</p>
                                            <p className="text-lg font-semibold">
                                                {(data?.ticketsPorPeriodo?.mes || 0) - (data?.reincidencias?.total || 0)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fila 7: Resumen Ejecutivo */}
                <div className="grid grid-cols-1 gap-6 mt-6">
                    <div className="panel bg-gradient-to-r from-primary to-secondary text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h5 className="font-semibold text-lg mb-2">Resumen Ejecutivo</h5>
                                <p className="text-white/80 text-sm">Última actualización: Hoy {new Date().toLocaleTimeString()}</p>
                            </div>
                            <button className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-colors" onClick={loadData}>
                                <FontAwesomeIcon icon={faRefresh} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div>
                                <p className="text-white/70 text-xs">SLAs cumplidos</p>
                                <p className="text-2xl font-bold">94%</p>
                                <p className="text-green-300 text-xs">+2.5% vs ayer</p>
                            </div>
                            <div>
                                <p className="text-white/70 text-xs">Satisfacción cliente</p>
                                <p className="text-2xl font-bold">4.8/5.0</p>
                                <p className="text-green-300 text-xs">+0.3 puntos</p>
                            </div>
                            <div>
                                <p className="text-white/70 text-xs">Tickets pendientes</p>
                                <p className="text-2xl font-bold">368</p>
                                <p className="text-yellow-300 text-xs">-12 vs ayer</p>
                            </div>
                            <div>
                                <p className="text-white/70 text-xs">Productividad</p>
                                <p className="text-2xl font-bold">87%</p>
                                <p className="text-green-300 text-xs">Meta: 85%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
