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
    const periodos: ('diario' | 'semanal' | 'mensual')[] = ['diario', 'semanal', 'mensual'];

    {
        periodos.map((p) => (
            <button
                key={p}
                onClick={() => setPeriodoTecnicos(p)}
                className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${periodoTecnicos === p ? 'bg-primary text-white' : ''
                    }`}
            >
                <FontAwesomeIcon
                    icon={
                        p === 'diario'
                            ? faCalendarDay
                            : p === 'semanal'
                                ? faCalendarWeek
                                : faCalendarAlt
                    }
                />
                {p === 'diario' ? 'Día' : p === 'semanal' ? 'Semana' : 'Mes'}
            </button>
        ))
    }
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

    type Tecnico = {
        idTecnico: number;
        tecnico: string;
        total_tickets?: number;
        reincidencias?: string | number;
        tasa_exito?: string; // porcentaje como string, ej. "95"
    };
    // 🔹 Data segura desde dashboardData
    // Definir el tipo de técnico
    type RendimientoTecnico = {
        idTecnico: number;
        tecnico: string;
        total_tickets?: number;
        reincidencias?: number;
        tasa_exito?: number; // porcentaje como número
    };

    // Tipo por periodo
    type RendimientoPorPeriodo = {
        dia: RendimientoTecnico[];
        semana: RendimientoTecnico[];
        mes: RendimientoTecnico[];
    };

    // Asegurarse de que dashboardData.rendimientoTecnico sea del tipo correcto
    const rendimientoTecnicos: RendimientoPorPeriodo = {
        dia: Array.isArray(dashboardData?.rendimientoTecnico?.dia) ? dashboardData.rendimientoTecnico.dia : [],
        semana: Array.isArray(dashboardData?.rendimientoTecnico?.semana) ? dashboardData.rendimientoTecnico.semana : [],
        mes: Array.isArray(dashboardData?.rendimientoTecnico?.mes) ? dashboardData.rendimientoTecnico.mes : []
    };
    // Mapear periodos del UI a los keys internos
    const periodoMap: Record<string, keyof RendimientoPorPeriodo> = {
        diario: 'dia',
        semanal: 'semana',
        mensual: 'mes',
    };

    // Obtener los datos del periodo seleccionado de forma segura
    const periodoKey = periodoMap[periodoTecnicos]; // ahora es 'dia' | 'semana' | 'mes'
    const datosTecnicos = rendimientoTecnicos[periodoKey] ?? [];
    // 🔹 Configuración para gráfico de tickets por técnico
    const ticketsTecnicoOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: (params: any) => {
                const index: number = params?.[0]?.dataIndex ?? 0;
                const periodoItems = rendimientoTecnicos[periodoTecnicos as keyof RendimientoPorPeriodo];
                const item: RendimientoTecnico | undefined = periodoItems[index];

                if (!item) return '';

                const eficiencia = item.tasa_exito ?? 0;
                const tickets = item.total_tickets ?? 0;
                const reincidencias = item.reincidencias ?? 0;

                return `
<div class="font-semibold">${item.tecnico}</div>
<div class="flex justify-between mt-1">
  <span>Tickets:</span>
  <span class="font-bold">${tickets}</span>
</div>
<div class="flex justify-between">
  <span>Eficiencia:</span>
  <span class="${eficiencia >= 90 ? 'text-success' : 'text-warning'}">${eficiencia}%</span>
</div>
<div class="flex justify-between">
  <span>Reincidencias:</span>
  <span class="text-danger">${reincidencias}</span>
</div>
`;
            }
        },

        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },

        xAxis: {
            type: 'category',
            data: datosTecnicos.map((item) => item.total_tickets ?? 0),
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
                data: rendimientoTecnicos[periodoTecnicos as keyof RendimientoPorPeriodo]?.map(
                    (item) => item.total_tickets ?? 0
                ),
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
            </div>
        </div>
    );
};

export default Analytics;
