import { Link } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dropdown from '../components/Dropdown';
import { useEffect, useState, useRef } from 'react'; // 👈 SOLO agregué useRef
import { setPageTitle } from '../store/themeConfigSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { analyticsService } from '../services/analyticsService';
import {
    faTicket,
    faMapLocation,
    faGear,
    faClock,
    faUserGear,
    faRotateRight,
    faCircleExclamation,
    faSpinner,
    faCircleXmark,
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
    faBuilding
} from '@fortawesome/free-solid-svg-icons';

// ==================== COMPONENTE PARA GRÁFICOS RESPONSIVOS (SOLO ANCHO) ====================
const ResponsiveEChart = ({ option, style, ...props }: any) => {
    const chartRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Forzar resize cuando cambia el tamaño del contenedor o el sidebar
    useEffect(() => {
        const forceResize = () => {
            if (chartRef.current) {
                setTimeout(() => {
                    chartRef.current.getEchartsInstance().resize();
                }, 50);
            }
        };

        // Observar cambios en el contenedor
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

    // Resize inicial
    useEffect(() => {
        setTimeout(() => {
            if (chartRef.current) {
                chartRef.current.getEchartsInstance().resize();
            }
        }, 200);
    }, []);

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



const Analytics = () => {
    const dispatch = useDispatch();
    const [periodoTickets, setPeriodoTickets] = useState<'dia' | 'mes' | 'anio'>('dia');
    const [periodoTecnicos, setPeriodoTecnicos] = useState<'diario' | 'semanal' | 'mensual'>('diario');
    const [vistaDistritos, setVistaDistritos] = useState<'grafico' | 'tabla'>('grafico');
    const [expandido, setExpandido] = useState(false);
    const [dashboardData, setDashboardData] = useState<any>(null);
    type TicketDistrito = {
        id_ubigeo: string;
        nombre_ubigeo: string;
        total: number;
    };


    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const dashboard = await analyticsService.getDashboard();
                setDashboardData(dashboard);
            } catch (error) {
                console.error("Error cargando analytics", error);
            }
        };

        loadAnalytics();
    }, []);

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    // 🔹 Tipo



    // ==================== FORZAR RESIZE INICIAL ====================
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
    // 🔹 Data segura
    const tecnicosData =
        dashboardData?.ticketsPorTecnico?.[periodoTecnicos] ?? [];

    const personalData = dashboardData?.ticketsPorPersonal ?? {};
    // 🔹 Derivados

    const tendenciaSource =
        periodoTickets === 'dia'
            ? dashboardData?.tendenciaTickets?.porDia
            : periodoTickets === 'mes'
                ? dashboardData?.tendenciaTickets?.porMes
                : dashboardData?.tendenciaTickets?.porAnio;

    const dataTickets = Array.isArray(tendenciaSource)
        ? tendenciaSource.map((t: any) => t.total)
        : [];

    const labels = Array.isArray(tendenciaSource)
        ? tendenciaSource.map((t: any) =>
            periodoTickets === 'dia'
                ? t.fecha
                : periodoTickets === 'mes'
                    ? t.mes
                    : t.anio
        )
        : [];

    const tendenciaTicketsOption = {
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
            type: 'category',
            data: labels,
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
            data: dataTickets,
            smooth: true,
            lineStyle: { width: 3, color: '#4361ee' },
            areaStyle: { color: isDark ? '#4361ee20' : '#4361ee10' },
            symbol: 'circle',
            symbolSize: 6
        }]
    };
    // 🔹 Tipos


    const ticketsDistrito: TicketDistrito[] = Array.isArray(dashboardData?.ticketsPorDistrito)
        ? dashboardData.ticketsPorDistrito
        : [];

    const totalTicketsDistrito = ticketsDistrito.reduce(
        (acc, item) => acc + item.total,
        0
    );


    // 🔹 Configuración para gráfico de tickets por distrito
    const ticketsDistritoOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: (params: any) => {
                const index = params?.[0]?.dataIndex ?? 0;
                const item = ticketsDistrito[index];

                if (!item) return '';

                return `
                <div class="font-semibold">${item.nombre_ubigeo}</div>
                <div class="flex justify-between mt-1">
                    <span>Tickets:</span>
                    <span class="font-bold">${item.total}</span>
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
            data: ticketsDistrito.map(item => item.nombre_ubigeo), // ✅ FIX
            axisLabel: { color: isDark ? '#bfc9d4' : '#506690' },
            axisLine: { lineStyle: { color: isDark ? '#3b3f5c' : '#e0e6ed' } }
        },

        series: [
            {
                name: 'Tickets',
                type: 'bar',
                data: ticketsDistrito.map(item => item.total),

                itemStyle: {
                    color: '#4361ee',
                    borderRadius: [0, 8, 8, 0]
                },

                barWidth: 20,

                label: {
                    show: true,
                    position: 'right',
                    formatter: (params: any) => `${params.value ?? 0}`,
                    color: isDark ? '#bfc9d4' : '#506690',
                    fontSize: 11
                }
            }
        ]
    };

    // Configuración para gráfico de tickets por falla
    // 🔹 Tipos
    type TicketFalla = {
        falla: string;
        total: number;
    };

    // 🔹 Data segura desde dashboardData
    const ticketsFalla = [
        { falla: 'Pantalla', total: 45 },
        { falla: 'Batería', total: 30 },
        { falla: 'Software', total: 25 },
        { falla: 'Conectividad', total: 20 },
        { falla: 'Otros', total: 10 },
    ];

    // 🔹 Configuración para gráfico de tickets por falla
    const ticketsFallaOption = {
        tooltip: {
            trigger: 'item',
        },
        series: [
            {
                name: 'Fallas',
                type: 'pie',
                radius: '70%',
                data: ticketsFalla.map((item) => ({
                    value: item.total,
                    name: item.falla,
                })),
            },
        ],
    };

    type FlujoEstado = {
        descripcion: string;
        total: number;
        color: string;
    };

    // 🔹 Data segura desde dashboardData
    const flujoEstados: FlujoEstado[] = Array.isArray(dashboardData?.flujoTicketsEstado)
        ? dashboardData.flujoTicketsEstado
        : [];
    // 🔹 Total calculado (evita recalcular en cada tooltip)
    const totalTicketsEstados = flujoEstados.reduce(
        (sum, item) => sum + item.total,
        0
    );
    const ticketsEstadoOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },

            formatter: (params: any) => {
                const index = params?.[0]?.dataIndex ?? 0;
                const item = flujoEstados[index];

                if (!item) return '';

                const porcentaje = totalTicketsEstados
                    ? Math.round((item.total / totalTicketsEstados) * 100)
                    : 0;

                return `
                <div class="font-semibold">${item.descripcion}</div>
                <div class="flex justify-between mt-1">
                    <span>Tickets:</span>
                    <span class="font-bold">${item.total}</span>
                </div>
                <div class="flex justify-between">
                    <span>Porcentaje:</span>
                    <span>${porcentaje}%</span>
                </div>
            `;
            }
        },

        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },

        xAxis: {
            type: 'category',
            data: flujoEstados.map(item => item.descripcion),

            axisLabel: {
                formatter: (value: string) =>
                    value.length > 15 ? value.substring(0, 15) + '...' : value,
                color: isDark ? '#bfc9d4' : '#506690',
                rotate: 20,
                fontSize: 11
            },

            axisLine: {
                lineStyle: { color: isDark ? '#3b3f5c' : '#e0e6ed' }
            }
        },

        yAxis: {
            type: 'value',
            axisLabel: { color: isDark ? '#bfc9d4' : '#506690' },
            splitLine: {
                lineStyle: { color: isDark ? '#191e3a' : '#e0e6ed' }
            }
        },

        series: [
            {
                name: 'Tickets',
                type: 'bar',

                data: flujoEstados.map(item => item.total),

                itemStyle: {
                    borderRadius: [8, 8, 0, 0],
                    color: (params: any) => {
                        return flujoEstados[params.dataIndex]?.color || '#3b82f6';
                    }
                },

                barWidth: 40,

                label: {
                    show: true,
                    position: 'top',
                    color: isDark ? '#bfc9d4' : '#506690',
                    fontSize: 11,
                    formatter: (params: any) => `${params.value ?? 0}`
                }
            }
        ]
    };

    // Configuración para gráfico de tickets por técnico
    // 🔹 Tipos
    type RendimientoTecnico = {
        tecnico: string;
        total_tickets: number;
        tasa_exito: number;
        reincidencias: number;
    };

    // 🔹 Data segura desde dashboardData
    const rendimientoTecnicos: RendimientoTecnico[] = Array.isArray(dashboardData?.rendimientoTecnico)
        ? dashboardData.rendimientoTecnico
        : [];

    // 🔹 Configuración para gráfico de tickets por técnico
    const ticketsTecnicoOption = {

        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },

            formatter: (params: any) => {
                const index = params?.[0]?.dataIndex ?? 0;
                const item = rendimientoTecnicos[index];

                if (!item) return '';

                return `
                <div class="font-semibold">${item.tecnico}</div>
                <div class="flex justify-between mt-1">
                    <span>Tickets:</span>
                    <span class="font-bold">${item.total_tickets}</span>
                </div>
                <div class="flex justify-between">
                    <span>Eficiencia:</span>
                    <span class="${item.tasa_exito >= 90 ? 'text-success' : 'text-warning'}">
                        ${item.tasa_exito}%
                    </span>
                </div>
                <div class="flex justify-between">
                    <span>Reincidencias:</span>
                    <span class="text-danger">${item.reincidencias}</span>
                </div>
            `;
            }
        },

        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },

        xAxis: {
            type: 'category',

            data: rendimientoTecnicos.map((item: RendimientoTecnico) =>
                item.tecnico?.split(' ')[0] ?? ''
            ),

            axisLabel: {
                color: isDark ? '#bfc9d4' : '#506690',
                rotate: 15
            },

            axisLine: {
                lineStyle: { color: isDark ? '#3b3f5c' : '#e0e6ed' }
            }
        },

        yAxis: {
            type: 'value',
            axisLabel: { color: isDark ? '#bfc9d4' : '#506690' },

            splitLine: {
                lineStyle: { color: isDark ? '#191e3a' : '#e0e6ed' }
            }
        },

        series: [
            {
                name: 'Tickets',
                type: 'bar',

                data: rendimientoTecnicos.map((item: RendimientoTecnico) => item.total_tickets),

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
                    formatter: (params: any) => `${params.value ?? 0}`
                }
            }
        ]
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
                {/* Fila 1: KPIs Principales */}
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
                                    <h3 className="text-3xl font-bold">{dashboardData?.totalTickets ?? 0}</h3>

                                </div>
                            </div>
                        </div>


                    </div>

                    <div className="panel">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-white-dark text-sm">Tickets Cerrados</p>
                            <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                                {dashboardData?.ticketsCerrados?.porcentaje_total ?? 0}% del total
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-success/10 text-success rounded-full w-12 h-12 flex items-center justify-center">
                                <FontAwesomeIcon icon={faCircleCheck} className="text-2xl" />
                            </div>

                            <div>
                                <h4 className="text-2xl font-bold">
                                    {dashboardData?.ticketsCerrados?.total_cerrados ?? 0}
                                </h4>

                                <div className="flex items-center gap-2 text-xs">
                                    <FontAwesomeIcon icon={faArrowTrendUp} className="text-success" />
                                    <span className="text-success">
                                        {dashboardData?.ticketsCerrados?.variacion_mes_anterior ?? 0}% vs mes anterior
                                    </span>
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
                                <h4 className="text-2xl font-bold">
                                    {dashboardData?.tiempoResolucion?.promedio_horas ?? 0}h
                                </h4>

                                <div className="flex items-center gap-2 text-xs">

                                    <FontAwesomeIcon
                                        icon={
                                            (dashboardData?.tiempoResolucion?.variacion_ayer ?? 0) > 0
                                                ? faArrowTrendUp
                                                : faArrowTrendDown
                                        }
                                        className={
                                            (dashboardData?.tiempoResolucion?.variacion_ayer ?? 0) > 0
                                                ? "text-danger"
                                                : "text-success"
                                        }
                                    />

                                    <span
                                        className={
                                            (dashboardData?.tiempoResolucion?.variacion_ayer ?? 0) > 0
                                                ? "text-danger"
                                                : "text-success"
                                        }
                                    >
                                        {Math.abs(
                                            dashboardData?.tiempoResolucion?.variacion_horas ?? 0
                                        )}h vs mes anterior
                                    </span>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="panel">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-white-dark text-sm">Reincidencias</p>

                            {(() => {
                                const variacion = dashboardData?.reincidencias?.variacion_mes_anterior ?? 0;
                                const esMejora = variacion < 0; // 🔥 menos reincidencias = mejor

                                return (
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full ${esMejora
                                            ? 'bg-success/10 text-success'
                                            : 'bg-danger/10 text-danger'
                                            }`}
                                    >
                                        <FontAwesomeIcon
                                            icon={esMejora ? faArrowTrendDown : faArrowTrendUp}
                                            className="mr-1"
                                        />
                                        {Math.abs(variacion)}%
                                    </span>
                                );
                            })()}
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-danger/10 text-danger rounded-full w-12 h-12 flex items-center justify-center">
                                <FontAwesomeIcon icon={faRotateRight} className="text-2xl" />
                            </div>

                            <div>
                                <h4 className="text-2xl font-bold">
                                    {dashboardData?.reincidencias?.porcentaje_reincidencias ?? 0}%
                                </h4>

                                <div className="flex items-center gap-1 text-xs">
                                    <span className="text-white-dark">
                                        {dashboardData?.reincidencias?.tickets_reincidencias ?? 0} tickets
                                    </span>

                                    <span className="text-danger">
                                        • {dashboardData?.reincidencias?.tickets_unicos ?? 0} únicos
                                    </span>
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
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPeriodoTickets('dia')}
                                        className={`px-3 py-1 text-xs rounded-md ${periodoTickets === 'dia'
                                            ? 'bg-primary text-white'
                                            : 'bg-primary/10 text-primary'
                                            }`}
                                    >
                                        Día
                                    </button>

                                    <button
                                        onClick={() => setPeriodoTickets('mes')}
                                        className={`px-3 py-1 text-xs rounded-md ${periodoTickets === 'mes'
                                            ? 'bg-primary text-white'
                                            : 'bg-primary/10 text-primary'
                                            }`}
                                    >
                                        Mes
                                    </button>

                                    <button
                                        onClick={() => setPeriodoTickets('anio')}
                                        className={`px-3 py-1 text-xs rounded-md ${periodoTickets === 'anio'
                                            ? 'bg-primary text-white'
                                            : 'bg-primary/10 text-primary'
                                            }`}
                                    >
                                        Año
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* 👇 CAMBIADO a ResponsiveEChart */}
                        <ResponsiveEChart option={tendenciaTicketsOption} style={{ height: '200px' }} />
                    </div>
                </div>

                {/* Fila 2: Tickets por Distrito y por Falla */}
                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                    {/* 🔹 UI */}
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
                                {ticketsDistrito.length === 0 ? (
                                    <div className="h-[350px] flex items-center justify-center text-white-dark">
                                        No hay datos
                                    </div>
                                ) : (
                                    <ResponsiveEChart
                                        option={ticketsDistritoOption}
                                        style={{ height: '350px' }}
                                    />
                                )}

                                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                                    <span className="bg-success/10 text-success px-2 py-1 rounded-full text-xs">
                                        <FontAwesomeIcon icon={faArrowTrendUp} className="mr-1" />
                                        Mayor actividad
                                    </span>

                                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                                        Distritos con más tickets
                                    </span>
                                </div>
                            </>
                        ) : (
                            <PerfectScrollbar className="h-[350px]">
                                <table className="table-hover w-full">

                                    <thead>
                                        <tr>
                                            <th className="text-left">Distrito</th>
                                            <th className="text-right">Tickets</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {ticketsDistrito.length === 0 ? (
                                            <tr>
                                                <td colSpan={2} className="text-center py-4 text-white-dark">
                                                    No hay datos
                                                </td>
                                            </tr>
                                        ) : (
                                            ticketsDistrito.map((item: TicketDistrito, index: number) => (
                                                <tr key={index}>
                                                    <td className="font-semibold">{item.nombre_ubigeo}</td>
                                                    <td className="text-right">{item.total}</td>
                                                </tr>
                                            ))
                                        )}

                                    </tbody>

                                </table>
                            </PerfectScrollbar>
                        )}

                        <div className="mt-4 text-sm text-white-dark flex items-center justify-between">

                            <span>
                                <FontAwesomeIcon icon={faBuilding} className="mr-1" />
                                {ticketsDistrito.length} distritos
                            </span>

                            <span className="font-semibold">
                                Total: {totalTicketsDistrito} tickets
                            </span>

                        </div>

                    </div>

                    <div className="panel">

                        <div className="flex items-center gap-2 mb-5">
                            <FontAwesomeIcon icon={faGear} className="text-primary text-xl" />
                            <h5 className="font-semibold text-lg">Tickets por Tipo de Falla</h5>
                        </div>

                        {/* Leyenda */}
                        <div className="grid grid-cols-2 gap-2 mb-4">

                            {ticketsFalla.map((falla, index) => {

                                const totalTickets = ticketsFalla.reduce((acc, i) => acc + i.total, 0);
                                const porcentaje = totalTickets
                                    ? Math.round((falla.total / totalTickets) * 100)
                                    : 0;

                                return (
                                    <div key={index} className="flex items-center gap-2 text-sm">

                                        <span
                                            className="w-3 h-3 rounded-full"
                                            style={{
                                                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]
                                            }}
                                        />

                                        <span className="flex-1">{falla.falla}</span>

                                        <span className="font-semibold">{porcentaje}%</span>

                                    </div>
                                );
                            })}

                        </div>

                        <ResponsiveEChart
                            option={ticketsFallaOption}
                            style={{ height: '300px' }}
                        />

                        <div className="mt-4 grid grid-cols-3 gap-2 text-center">

                            {/* Principal */}
                            <div className="bg-primary/5 p-2 rounded">

                                <div className="text-xs text-white-dark">
                                    Principal
                                </div>

                                <div className="font-semibold">
                                    {ticketsFalla[0]?.falla ?? '-'}
                                </div>

                                <div className="text-primary text-sm">
                                    {ticketsFalla[0]?.total ?? 0}
                                </div>

                            </div>

                            {/* Total fallas */}
                            <div className="bg-success/5 p-2 rounded">

                                <div className="text-xs text-white-dark">
                                    Tipos de falla
                                </div>

                                <div className="font-semibold">
                                    {ticketsFalla.length}
                                </div>

                                <div className="text-success text-sm">
                                    registradas
                                </div>

                            </div>

                            {/* Total tickets */}
                            <div className="bg-danger/5 p-2 rounded">

                                <div className="text-xs text-white-dark">
                                    Total tickets
                                </div>

                                <div className="font-semibold">
                                    {ticketsFalla.reduce((acc, i) => acc + i.total, 0)}
                                </div>

                                <div className="text-danger text-sm">
                                    analizados
                                </div>

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
                                {dashboardData?.ticketsPorEstado?.map((estado: any, index: number) => (
                                    <div key={index} className="flex items-center gap-1 text-xs">

                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{
                                                backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'][index % 5]
                                            }}
                                        />

                                        <span>{estado.estado}</span>

                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-5 gap-4 mb-4">

                            {dashboardData?.ticketsPorEstado?.map((estado: any, index: number) => {

                                const totalMes = dashboardData?.ticketsPorPeriodo?.mes ?? 0

                                const porcentaje = totalMes
                                    ? Math.round((estado.total / totalMes) * 100)
                                    : 0

                                return (

                                    <div
                                        key={index}
                                        className="bg-white-dark/5 rounded-lg p-3 text-center"
                                    >

                                        <FontAwesomeIcon
                                            icon={
                                                estado.estado === 'Abierto'
                                                    ? faCircleExclamation
                                                    : estado.estado === 'En Proceso'
                                                        ? faSpinner
                                                        : estado.estado === 'Resuelto'
                                                            ? faCircleCheck
                                                            : faCircleXmark
                                            }
                                            className="text-2xl mb-2"
                                            style={{
                                                color: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#ef4444'][index % 5]
                                            }}
                                        />

                                        <div className="text-sm font-semibold">
                                            {estado.estado}
                                        </div>

                                        <div
                                            className="text-xl font-bold"
                                            style={{
                                                color: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'][index % 5]
                                            }}
                                        >
                                            {estado.total}
                                        </div>

                                        <div className="text-xs text-white-dark">
                                            {porcentaje}% del total
                                        </div>

                                    </div>

                                )
                            })}

                        </div>

                        <ResponsiveEChart
                            option={ticketsEstadoOption}
                            style={{ height: '250px' }}
                        />

                    </div>
                </div>

                {/* Fila 4: Tiempos Promedio */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

                    {Object.entries(dashboardData?.tiemposPromedio ?? {}).map(([key, value]: any, index: number) => {

                        const titles = {
                            coordinacionInicial: { label: 'Coord. Inicial', icon: faClockRotateLeft, color: 'info' },
                            solucionOnSite: { label: 'Solución On Site', icon: faUserCheck, color: 'success' },
                            solucionLaboratorio: { label: 'Solución Lab.', icon: faFlask, color: 'warning' },
                            resolucionTotal: { label: 'Resolución Total', icon: faCheckDouble, color: 'danger' }
                        }

                        const colorClasses: any = {
                            info: "bg-info text-info",
                            success: "bg-success text-success",
                            warning: "bg-warning text-warning",
                            danger: "bg-danger text-danger"
                        }

                        const title = titles[key as keyof typeof titles]

                        if (!title) return null

                        return (

                            <div
                                key={index}
                                className="panel bg-gradient-to-br from-[#1b2e4b] to-[#253b5b] text-white relative overflow-hidden group hover:shadow-xl transition-all duration-300"
                            >

                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>

                                <div className="flex items-center gap-3 relative z-10">

                                    <div className={`rounded-full w-12 h-12 flex items-center justify-center text-2xl ${colorClasses[title.color]}`}>
                                        <FontAwesomeIcon icon={title.icon} />
                                    </div>

                                    <div className="flex-1">

                                        <p className="text-white/70 text-sm">
                                            {title.label}
                                        </p>

                                        <div className="flex items-baseline justify-between">

                                            <h4 className="text-2xl font-bold">
                                                {value.horas}
                                                <span className="text-sm ml-1">
                                                    horas
                                                </span>
                                            </h4>

                                            <span
                                                className={`text-xs flex items-center gap-1 ${value.tendencia > 0 ? "text-danger" : "text-success"
                                                    }`}
                                            >

                                                <FontAwesomeIcon
                                                    icon={
                                                        value.tendencia > 0
                                                            ? faArrowTrendUp
                                                            : faArrowTrendDown
                                                    }
                                                />

                                                {Math.abs(value.tendencia)}h

                                            </span>

                                        </div>

                                    </div>

                                </div>

                                {/* Barra progreso */}

                                <div className="mt-4">

                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-white/70">
                                            Meta: 48h
                                        </span>

                                        <span className="text-white/70">
                                            {Math.round(((48 - value.horas) / 48) * 100)}% restante
                                        </span>
                                    </div>

                                    <div className="w-full bg-white/20 rounded-full h-1.5">

                                        <div
                                            className="bg-primary h-1.5 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${Math.min(100, (value.horas / 48) * 100)}%`
                                            }}
                                        />

                                    </div>

                                </div>

                            </div>

                        )

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
                                    className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${periodoTecnicos === 'diario' ? 'bg-primary text-white' : ''
                                        }`}
                                >
                                    <FontAwesomeIcon icon={faCalendarDay} /> Día
                                </button>

                                <button
                                    onClick={() => setPeriodoTecnicos('semanal')}
                                    className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${periodoTecnicos === 'semanal' ? 'bg-primary text-white' : ''
                                        }`}
                                >
                                    <FontAwesomeIcon icon={faCalendarWeek} /> Semana
                                </button>

                                <button
                                    onClick={() => setPeriodoTecnicos('mensual')}
                                    className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${periodoTecnicos === 'mensual' ? 'bg-primary text-white' : ''
                                        }`}
                                >
                                    <FontAwesomeIcon icon={faCalendarAlt} /> Mes
                                </button>
                            </div>
                        </div>

                        {/* 🔹 DATA SEGURA */}
                        {(() => {
                            const tecnicos =
                                dashboardData?.ticketsPorTecnico?.[periodoTecnicos] ?? [];

                            return (
                                <>
                                    {/* 🔹 TARJETAS */}
                                    <div className="grid grid-cols-1 gap-3 mb-4">
                                        {tecnicos.length > 0 ? (
                                            tecnicos.map((tecnico: any, index: number) => (
                                                <div
                                                    key={index}
                                                    className="bg-white-dark/5 rounded-lg p-3 hover:bg-primary/5 transition-colors"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            {/* Avatar */}
                                                            <div
                                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                                            ${index === 0
                                                                        ? 'bg-yellow-500'
                                                                        : index === 1
                                                                            ? 'bg-gray-400'
                                                                            : index === 2
                                                                                ? 'bg-orange-400'
                                                                                : 'bg-primary/50'
                                                                    }`}
                                                            >
                                                                {tecnico?.tecnico
                                                                    ?.split(' ')
                                                                    ?.map((n: string) => n[0])
                                                                    ?.join('') || '?'}
                                                            </div>

                                                            {/* Info */}
                                                            <div>
                                                                <div className="font-semibold flex items-center gap-2">
                                                                    {tecnico?.tecnico || 'Sin nombre'}

                                                                    {index === 0 && (
                                                                        <FontAwesomeIcon
                                                                            icon={faMedal}
                                                                            className="text-yellow-500"
                                                                        />
                                                                    )}

                                                                    {tecnico?.eficiencia >= 95 && (
                                                                        <FontAwesomeIcon
                                                                            icon={faStar}
                                                                            className="text-yellow-500 text-xs"
                                                                        />
                                                                    )}
                                                                </div>

                                                                <div className="flex items-center gap-3 text-xs">
                                                                    <span className="text-white-dark">
                                                                        <FontAwesomeIcon icon={faTicket} className="mr-1" />
                                                                        {tecnico?.tickets ?? 0} tickets
                                                                    </span>

                                                                    <span
                                                                        className={
                                                                            tecnico?.eficiencia >= 90
                                                                                ? 'text-success'
                                                                                : 'text-warning'
                                                                        }
                                                                    >
                                                                        <FontAwesomeIcon icon={faChartLine} className="mr-1" />
                                                                        {tecnico?.eficiencia ?? 0}%
                                                                    </span>

                                                                    {tecnico?.reincidencias > 0 && (
                                                                        <span className="text-danger">
                                                                            <FontAwesomeIcon icon={faRotateRight} className="mr-1" />
                                                                            {tecnico.reincidencias}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Barra */}
                                                        <div className="w-24">
                                                            <div className="w-full bg-white-dark/20 rounded-full h-2">
                                                                <div
                                                                    className={`h-2 rounded-full ${tecnico?.eficiencia >= 90
                                                                        ? 'bg-success'
                                                                        : tecnico?.eficiencia >= 80
                                                                            ? 'bg-warning'
                                                                            : 'bg-danger'
                                                                        }`}
                                                                    style={{
                                                                        width: `${tecnico?.eficiencia ?? 0}%`
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-white-dark text-sm py-4">
                                                Sin datos
                                            </div>
                                        )}
                                    </div>

                                    {/* 🔹 GRÁFICO */}
                                    <ResponsiveEChart
                                        option={ticketsTecnicoOption}
                                        style={{ height: '150px' }}
                                    />
                                </>
                            );
                        })()}
                    </div>

                    <div className="panel">
                        <div className="flex items-center gap-2 mb-5">
                            <FontAwesomeIcon icon={faUsers} className="text-primary text-xl" />
                            <h5 className="font-semibold text-lg">Rendimiento del Personal</h5>
                        </div>

                        {(() => {
                            const personal = dashboardData?.ticketsPorPersonal ?? {};

                            const valores = [
                                personal?.diario ?? 0,
                                personal?.semanal ?? 0,
                                personal?.mensual ?? 0
                            ];

                            const objetivos = [
                                personal?.objetivos?.diario ?? 1,
                                personal?.objetivos?.semanal ?? 1,
                                personal?.objetivos?.mensual ?? 1
                            ];

                            const tecnicos =
                                dashboardData?.ticketsPorTecnico?.[periodoTecnicos] ?? [];

                            return (
                                <>
                                    {/* 🔹 CARDS */}
                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        {['Diario', 'Semanal', 'Mensual'].map((periodo, index) => {
                                            const alcanzado = (valores[index] / objetivos[index]) * 100;

                                            return (
                                                <div
                                                    key={index}
                                                    className="text-center p-4 bg-white-dark/5 rounded-lg hover:shadow-lg transition-all"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={
                                                            index === 0
                                                                ? faCalendarDay
                                                                : index === 1
                                                                    ? faCalendarWeek
                                                                    : faCalendarAlt
                                                        }
                                                        className={`text-2xl mb-2 ${index === 0
                                                            ? 'text-primary'
                                                            : index === 1
                                                                ? 'text-success'
                                                                : 'text-warning'
                                                            }`}
                                                    />

                                                    <p className="text-white-dark text-sm">{periodo}</p>
                                                    <p className="text-2xl font-bold">{valores[index]}</p>

                                                    <div className="mt-2">
                                                        <div className="w-full bg-white-dark/20 rounded-full h-1.5">
                                                            <div
                                                                className={`h-1.5 rounded-full ${index === 0
                                                                    ? 'bg-primary'
                                                                    : index === 1
                                                                        ? 'bg-success'
                                                                        : 'bg-warning'
                                                                    }`}
                                                                style={{
                                                                    width: `${Math.min(100, alcanzado)}%`
                                                                }}
                                                            />
                                                        </div>

                                                        <p className="text-xs text-white-dark mt-1">
                                                            {Math.round(alcanzado)}% de meta ({objetivos[index]})
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* 🔹 PODIO */}
                                    <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-lg p-4">
                                        <h6 className="font-semibold mb-3 flex items-center gap-2">
                                            <FontAwesomeIcon icon={faMedal} className="text-yellow-500" />
                                            Podio de Honor - {periodoTecnicos}
                                        </h6>

                                        <div className="space-y-3">
                                            {tecnicos.length > 0 ? (
                                                [...tecnicos]
                                                    .sort((a: any, b: any) => b.tickets - a.tickets) // 🔥 ordenar real
                                                    .slice(0, 3)
                                                    .map((tecnico: any, index: number) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold
                                                ${index === 0
                                                                            ? 'bg-yellow-500'
                                                                            : index === 1
                                                                                ? 'bg-gray-400'
                                                                                : 'bg-orange-400'
                                                                        }`}
                                                                >
                                                                    {index + 1}
                                                                </div>

                                                                <div>
                                                                    <span className="font-semibold">
                                                                        {tecnico?.tecnico || 'Sin nombre'}
                                                                    </span>

                                                                    <div className="text-xs text-white-dark">
                                                                        {tecnico?.tickets ?? 0} tickets •{' '}
                                                                        {tecnico?.eficiencia ?? 0}%
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="text-right">
                                                                <div className="font-bold text-lg">
                                                                    {tecnico?.tickets ?? 0}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                            ) : (
                                                <div className="text-center text-white-dark text-sm py-3">
                                                    Sin datos
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
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
                                    <FontAwesomeIcon icon={faArrowTrendDown} className="text-success" />
                                    <span className="text-sm">
                                        Mejorando {Math.abs(dashboardData?.reincidencias?.tendencia ?? 0)}%
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 bg-primary/5 px-3 py-1 rounded-full">
                                    <FontAwesomeIcon icon={faTicket} className="text-primary" />
                                    <span className="text-sm">
                                        {dashboardData?.reincidencias?.reincidentes ?? 0} tickets
                                    </span>
                                </div>

                            </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Distribución */}

                            <div className="col-span-2">

                                <div className="bg-white-dark/5 p-4 rounded-lg">

                                    <p className="text-white-dark mb-3 flex items-center gap-2">
                                        <FontAwesomeIcon icon={faChartPie} />
                                        Distribución de reincidencias por tipo de falla
                                    </p>

                                    <div className="space-y-4">

                                        {(dashboardData?.ticketsPorFalla ?? []).map((falla: any, index: number) => {

                                            const porcentaje = dashboardData?.reincidencias?.porcentaje ?? 0

                                            const reincidencias =
                                                Math.round(falla.total * (porcentaje / 100))

                                            const totalReincidentes =
                                                dashboardData?.reincidencias?.reincidentes ?? 1

                                            const porcentajeTotal =
                                                Math.round((reincidencias / totalReincidentes) * 100)

                                            const colores = [
                                                "#3b82f6",
                                                "#10b981",
                                                "#f59e0b",
                                                "#ef4444",
                                                "#8b5cf6"
                                            ]

                                            return (

                                                <div key={index}>

                                                    <div className="flex justify-between text-sm mb-1">

                                                        <div className="flex items-center gap-2">

                                                            <span
                                                                className="w-2 h-2 rounded-full"
                                                                style={{
                                                                    backgroundColor:
                                                                        colores[index % colores.length]
                                                                }}
                                                            />

                                                            <span>{falla.falla}</span>

                                                        </div>

                                                        <div className="flex items-center gap-3">

                                                            <span className="font-semibold">
                                                                {reincidencias} tickets
                                                            </span>

                                                            <span className="text-xs text-white-dark">
                                                                {porcentajeTotal}% del total
                                                            </span>

                                                        </div>

                                                    </div>

                                                    <div className="w-full bg-white-dark/20 rounded-full h-2">

                                                        <div
                                                            className="bg-danger h-2 rounded-full transition-all duration-500"
                                                            style={{
                                                                width: `${Math.min(100, porcentajeTotal)}%`
                                                            }}
                                                        />

                                                    </div>

                                                </div>

                                            )

                                        })}

                                    </div>

                                </div>

                            </div>

                            {/* Panel lateral */}

                            <div className="space-y-4">

                                <div className="bg-gradient-to-br from-danger/10 to-danger/5 rounded-lg p-4">

                                    <FontAwesomeIcon
                                        icon={faExclamationTriangle}
                                        className="text-danger text-3xl mb-2"
                                    />

                                    <p className="text-sm text-white-dark mb-1">
                                        Tickets con más de 2 visitas
                                    </p>

                                    <p className="text-3xl font-bold text-danger">
                                        {dashboardData?.reincidencias?.reincidentes ?? 0}
                                    </p>

                                    <p className="text-xs text-white-dark mt-1">
                                        Requieren atención especial
                                    </p>

                                </div>

                                <div className="bg-white-dark/5 rounded-lg p-4">

                                    <h6 className="font-semibold mb-2 text-sm">
                                        Técnicos con más reincidencias
                                    </h6>

                                    {(dashboardData?.reincidencias?.porTecnico ?? []).map((item: any, index: number) => (

                                        <div
                                            key={index}
                                            className="flex justify-between items-center text-sm py-1"
                                        >

                                            <span>{item.tecnico}</span>

                                            <span className="font-semibold text-danger">
                                                {item.reincidencias}
                                            </span>

                                        </div>

                                    ))}

                                </div>

                                <div className="bg-success/5 rounded-lg p-4">

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <p className="text-xs text-white-dark">
                                                Tasa de éxito
                                            </p>

                                            <p className="text-xl font-bold text-success">

                                                {100 - (dashboardData?.reincidencias?.porcentaje ?? 0)}%

                                            </p>

                                        </div>

                                        <div className="text-right">

                                            <p className="text-xs text-white-dark">
                                                1ra visita
                                            </p>

                                            <p className="text-lg font-semibold">

                                                {(dashboardData?.ticketsPorPeriodo?.mes ?? 0) -
                                                    (dashboardData?.reincidencias?.total ?? 0)}

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
                                <p className="text-white/80 text-sm">Última actualización: Hoy 10:30 AM</p>
                            </div>
                            <button className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-colors">
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
