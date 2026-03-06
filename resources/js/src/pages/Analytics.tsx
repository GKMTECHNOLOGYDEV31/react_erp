import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dropdown from '../components/Dropdown';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../store/themeConfigSlice';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

const Analytics = () => {
    const dispatch = useDispatch();
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    useEffect(() => {
        dispatch(setPageTitle('Analytics Tickets'));

        // Registrar tema personalizado para ECharts
        echarts.registerTheme('tickets-theme', {
            backgroundColor: 'transparent',
            textStyle: { color: '#e2e8f0' },
            color: ['#60a5fa', '#34d399', '#f87171', '#fbbf24', '#c084fc', '#f472b6', '#94a3b8'],
        });
    }, [dispatch]);

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    // ==============================================
    // DATOS ESTÁTICOS PARA LOS KPIs
    // ==============================================

    // 1. Tickets por período (día, semana, mes, año)
    const ticketsPorPeriodo = {
        diario: [45, 52, 38, 41, 64, 58, 47, 53, 49, 61, 55, 48, 42, 39, 51, 44, 57, 63, 49, 52, 46, 38, 41, 35, 44, 51, 48, 42, 39, 37],
        semanal: [245, 312, 298, 341, 364, 321, 289, 305, 318, 334, 298, 312],
        mensual: [1245, 1352, 1438, 1541, 1624, 1589, 1498, 1523, 1487, 1532, 1498, 1623],
        anual: [12458, 14532, 16238, 17894, 19234],
    };

    // 2. Tickets por distrito y provincia
    const ticketsPorUbicacion = [
        { value: 1245, name: 'Lima Cercado' },
        { value: 987, name: 'San Isidro' },
        { value: 876, name: 'Miraflores' },
        { value: 754, name: 'Surco' },
        { value: 654, name: 'La Molina' },
        { value: 543, name: 'San Borja' },
        { value: 432, name: 'Arequipa' },
        { value: 321, name: 'Trujillo' },
        { value: 298, name: 'Chiclayo' },
        { value: 276, name: 'Piura' },
        { value: 245, name: 'Cusco' },
        { value: 198, name: 'Huancayo' },
    ];

    // 3. Tickets por tipo de falla
    const ticketsPorFalla = {
        tipos: ['Panel', 'Mainboard', 'Power', 'Limpieza Interna', 'Software', 'NTF', 'Falla Externa'],
        valores: [345, 278, 412, 189, 567, 234, 321],
    };

    // 4. Tickets por estado
    const ticketsPorEstado = {
        estados: ['Diagnóstico', 'Visita Finalizada', 'Pendiente Recojo', 'Ingreso a Laboratorio', 'Cerrado'],
        valores: [234, 456, 178, 312, 654],
    };

    // 5. Tiempos promedio (en horas)
    const tiemposPromedio = {
        coordinacion: 4.2, // horas
        solucionOnSite: 8.5,
        solucionLaboratorio: 24.3,
        resolucionTotal: 36.8,
    };

    // 6. Reincidencias
    const reincidencias = {
        total: 187,
        porcentaje: 12.4,
        historial: [12, 15, 18, 22, 19, 24, 21, 18, 16, 14, 17, 19],
    };

    // 7. Tickets por técnico
    const ticketsPorTecnico = {
        nombres: ['Carlos R.', 'Ana M.', 'Luis G.', 'María P.', 'Jorge L.', 'Patricia V.'],
        diario: [8, 12, 9, 11, 7, 10],
        semanal: [42, 48, 45, 51, 38, 44],
        mensual: [168, 185, 172, 194, 156, 178],
    };

    // 8. Tickets por personal total
    const ticketsPersonalTotal = {
        diario: 57,
        semanal: 268,
        mensual: 1053,
    };

    // ==============================================
    // NUEVOS DATOS PARA LAS MEJORAS
    // ==============================================

    // SLAs y distribución de tiempos
    const sla = {
        coordinacion: { meta: 4, cumplimiento: 92 },
        onSite: { meta: 8, cumplimiento: 78 },
        laboratorio: { meta: 24, cumplimiento: 65 },
    };

    const distribucionTiempos = {
        rangos: ['0-12h', '12-24h', '24-48h', '+48h'],
        porcentajes: [24, 42, 28, 6],
        colores: ['#60a5fa', '#34d399', '#fbbf24', '#f87171'],
    };

    const evolucionTiempos = {
        coordinacion: [4.5, 4.3, 4.1, 4.4, 4.2, 4.0, 4.1, 4.3, 4.2, 4.4, 4.1, 4.2],
        onSite: [8.8, 8.6, 8.4, 8.7, 8.5, 8.3, 8.4, 8.6, 8.5, 8.7, 8.4, 8.5],
        laboratorio: [25.1, 24.8, 24.5, 24.9, 24.3, 24.0, 24.2, 24.4, 24.3, 24.6, 24.2, 24.3],
    };

    const reincidenciasDetalle = {
        porTecnico: [18, 12, 24, 8, 15, 22],
        porFalla: [15, 22, 18, 8, 12, 5, 20],
    };

    // ==============================================
    // CONFIGURACIONES DE GRÁFICOS ECHARTS - CORREGIDAS PARA SER RESPONSIVES
    // ==============================================

    // Función para obtener el tamaño de fuente responsive
    const getResponsiveFontSize = (baseSize) => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth < 640) return baseSize * 0.7;
            if (window.innerWidth < 1024) return baseSize * 0.85;
        }
        return baseSize;
    };

    // Gráfico 1: Tickets por período (Línea con área) - RESPONSIVE
    const ticketPeriodoOption = {
        title: {
            text: 'Tickets por Día',
            left: 'center',
            top: 5,
            textStyle: { fontSize: getResponsiveFontSize(14), fontWeight: 'bold', color: isDark ? '#e2e8f0' : '#1e293b' },
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: '{b}<br/>📊 Tickets: {c}',
        },
        grid: { left: '8%', right: '5%', top: '15%', bottom: '8%', containLabel: true },
        xAxis: {
            type: 'category',
            data: Array.from({ length: 30 }, (_, i) => `Día ${i + 1}`),
            axisLabel: { rotate: 30, interval: 5, fontSize: getResponsiveFontSize(10) },
        },
        yAxis: { 
            type: 'value', 
            name: 'Cantidad',
            nameTextStyle: { fontSize: getResponsiveFontSize(11) },
            axisLabel: { fontSize: getResponsiveFontSize(10) }
        },
        series: [
            {
                name: 'Tickets',
                type: 'line',
                data: ticketsPorPeriodo.diario,
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: { width: 2, color: '#60a5fa' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(96, 165, 250, 0.3)' },
                        { offset: 1, color: 'rgba(96, 165, 250, 0.05)' },
                    ]),
                },
            },
        ],
    };

    // Gráfico 2: Tickets por ubicación (Mapa de árbol - Treemap) - RESPONSIVE
    const ubicacionOption = {
        title: {
            text: 'Tickets por Distrito/Provincia',
            left: 'center',
            top: 5,
            textStyle: { fontSize: getResponsiveFontSize(14), fontWeight: 'bold', color: isDark ? '#e2e8f0' : '#1e293b' },
        },
        tooltip: {
            formatter: '{b}<br/>Tickets: {c}',
        },
        series: [
            {
                name: 'Ubicaciones',
                type: 'treemap',
                data: ticketsPorUbicacion,
                width: '100%',
                height: '85%',
                breadcrumb: { show: false },
                label: {
                    show: true,
                    position: 'insideTopLeft',
                    fontSize: getResponsiveFontSize(10),
                    color: '#fff',
                },
                itemStyle: {
                    borderRadius: 6,
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    borderWidth: 1,
                },
                top: '12%',
                bottom: '3%',
            },
        ],
    };

    // Gráfico 3: Tickets por tipo de falla (Radar) - RESPONSIVE
    const fallaOption = {
        title: {
            text: 'Tickets por Tipo de Falla',
            left: 'center',
            top: 5,
            textStyle: { fontSize: getResponsiveFontSize(14), fontWeight: 'bold', color: isDark ? '#e2e8f0' : '#1e293b' },
        },
        tooltip: { trigger: 'item' },
        radar: {
            indicator: ticketsPorFalla.tipos.map((tipo) => ({ name: tipo, max: 600 })),
            shape: 'circle',
            center: ['50%', '50%'],
            radius: '65%',
            name: { 
                textStyle: { 
                    color: isDark ? '#94a3b8' : '#475569',
                    fontSize: getResponsiveFontSize(10)
                } 
            },
        },
        series: [
            {
                name: 'Fallas',
                type: 'radar',
                data: [{ value: ticketsPorFalla.valores, name: 'Cantidad' }],
                lineStyle: { color: '#34d399', width: 2 },
                itemStyle: { color: '#10b981' },
                areaStyle: { color: 'rgba(52, 211, 153, 0.1)' },
            },
        ],
    };

    // Gráfico 4: Tickets por estado - RESPONSIVE
    const estadoOption = {
        title: {
            text: 'Tickets por Estado',
            left: 'center',
            top: 5,
            textStyle: { fontSize: getResponsiveFontSize(14), fontWeight: 'bold', color: isDark ? '#e2e8f0' : '#1e293b' },
        },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '15%', right: '5%', top: '15%', bottom: '5%', containLabel: true },
        xAxis: { 
            type: 'value',
            axisLabel: { fontSize: getResponsiveFontSize(10) },
            name: 'Cantidad',
            nameTextStyle: { fontSize: getResponsiveFontSize(11) }
        },
        yAxis: { 
            type: 'category', 
            data: ticketsPorEstado.estados, 
            axisLabel: { fontSize: getResponsiveFontSize(11) } 
        },
        series: [
            {
                name: 'Tickets',
                type: 'bar',
                data: ticketsPorEstado.valores,
                barWidth: '60%',
                label: { 
                    show: true, 
                    position: 'right', 
                    fontWeight: 'bold',
                    fontSize: getResponsiveFontSize(10)
                },
                itemStyle: {
                    borderRadius: [0, 6, 6, 0],
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: '#f87171' },
                        { offset: 0.5, color: '#fbbf24' },
                        { offset: 1, color: '#34d399' },
                    ]),
                },
            },
        ],
    };

    // Gráfico 5: Tiempos promedio - GAUGES RESPONSIVES
    const tiemposOption = {
        title: {
            text: 'Tiempos Promedio (Horas)',
            left: 'center',
            top: 5,
            textStyle: {
                fontSize: getResponsiveFontSize(14),
                fontWeight: 'bold',
                color: isDark ? '#f1f5f9' : '#0f172a',
            },
        },
        tooltip: {
            formatter: '{a} <br/>{b}: {c} horas',
        },
        series: [
            {
                name: 'Coordinación',
                type: 'gauge',
                center: ['12.5%', '55%'],
                radius: '65%',
                startAngle: 0,
                endAngle: 360,
                min: 0,
                max: 24,
                progress: {
                    show: true,
                    width: 12,
                    roundCap: true,
                    itemStyle: { color: '#60a5fa' },
                },
                axisLine: {
                    lineStyle: {
                        width: 12,
                        color: [[0.75, isDark ? '#334155' : '#e2e8f0']],
                    },
                },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                anchor: { show: false },
                title: {
                    show: true,
                    fontSize: getResponsiveFontSize(10),
                    color: isDark ? '#e2e8f0' : '#1e293b',
                    offsetCenter: [0, '-35%'],
                },
                detail: {
                    valueAnimation: true,
                    fontSize: getResponsiveFontSize(12),
                    color: '#60a5fa',
                    formatter: '{value}h',
                    offsetCenter: [0, '40%'],
                },
                data: [{ value: tiemposPromedio.coordinacion, name: 'Coord.' }],
            },
            {
                name: 'On Site',
                type: 'gauge',
                center: ['37.5%', '55%'],
                radius: '65%',
                startAngle: 0,
                endAngle: 360,
                min: 0,
                max: 48,
                progress: {
                    show: true,
                    width: 12,
                    roundCap: true,
                    itemStyle: { color: '#34d399' },
                },
                axisLine: {
                    lineStyle: {
                        width: 12,
                        color: [[0.75, isDark ? '#334155' : '#e2e8f0']],
                    },
                },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                anchor: { show: false },
                title: {
                    show: true,
                    fontSize: getResponsiveFontSize(10),
                    color: isDark ? '#e2e8f0' : '#1e293b',
                    offsetCenter: [0, '-35%'],
                },
                detail: {
                    valueAnimation: true,
                    fontSize: getResponsiveFontSize(12),
                    color: '#34d399',
                    formatter: '{value}h',
                    offsetCenter: [0, '40%'],
                },
                data: [{ value: tiemposPromedio.solucionOnSite, name: 'On Site' }],
            },
            {
                name: 'Laboratorio',
                type: 'gauge',
                center: ['62.5%', '55%'],
                radius: '65%',
                startAngle: 0,
                endAngle: 360,
                min: 0,
                max: 72,
                progress: {
                    show: true,
                    width: 12,
                    roundCap: true,
                    itemStyle: { color: '#fbbf24' },
                },
                axisLine: {
                    lineStyle: {
                        width: 12,
                        color: [[0.75, isDark ? '#334155' : '#e2e8f0']],
                    },
                },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                anchor: { show: false },
                title: {
                    show: true,
                    fontSize: getResponsiveFontSize(10),
                    color: isDark ? '#e2e8f0' : '#1e293b',
                    offsetCenter: [0, '-35%'],
                },
                detail: {
                    valueAnimation: true,
                    fontSize: getResponsiveFontSize(12),
                    color: '#fbbf24',
                    formatter: '{value}h',
                    offsetCenter: [0, '40%'],
                },
                data: [{ value: tiemposPromedio.solucionLaboratorio, name: 'Lab.' }],
            },
            {
                name: 'Total',
                type: 'gauge',
                center: ['87.5%', '55%'],
                radius: '65%',
                startAngle: 0,
                endAngle: 360,
                min: 0,
                max: 100,
                progress: {
                    show: true,
                    width: 12,
                    roundCap: true,
                    itemStyle: { color: '#f87171' },
                },
                axisLine: {
                    lineStyle: {
                        width: 12,
                        color: [[0.75, isDark ? '#334155' : '#e2e8f0']],
                    },
                },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                anchor: { show: false },
                title: {
                    show: true,
                    fontSize: getResponsiveFontSize(10),
                    color: isDark ? '#e2e8f0' : '#1e293b',
                    offsetCenter: [0, '-35%'],
                },
                detail: {
                    valueAnimation: true,
                    fontSize: getResponsiveFontSize(12),
                    color: '#f87171',
                    formatter: '{value}h',
                    offsetCenter: [0, '40%'],
                },
                data: [{ value: tiemposPromedio.resolucionTotal, name: 'Total' }],
            },
        ],
    };

    // Gráfico 6: Reincidencias (Pie con rosquilla) - RESPONSIVE
    const reincidenciasOption = {
        title: {
            text: 'Reincidencias',
            left: 'center',
            top: 5,
            textStyle: { fontSize: getResponsiveFontSize(14), fontWeight: 'bold', color: isDark ? '#e2e8f0' : '#1e293b' },
        },
        tooltip: { trigger: 'item' },
        series: [
            {
                name: 'Reincidencias',
                type: 'pie',
                radius: ['55%', '70%'],
                center: ['50%', '55%'],
                avoidLabelOverlap: false,
                label: { 
                    show: true, 
                    position: 'outside', 
                    formatter: '{b}: {d}%',
                    fontSize: getResponsiveFontSize(10)
                },
                emphasis: { scale: false },
                data: [
                    { value: reincidencias.total, name: 'Con Reincidencia' },
                    { value: ticketsPersonalTotal.mensual - reincidencias.total, name: 'Sin Reincidencia' },
                ],
                itemStyle: {
                    borderRadius: 8,
                    borderColor: isDark ? '#1e293b' : '#fff',
                    borderWidth: 2,
                },
            },
        ],
    };

    // NUEVO Gráfico: Evolución de tiempos - RESPONSIVE
    const evolucionTiemposOption = {
        title: {
            text: 'Evolución de Tiempos (12 meses)',
            left: 'center',
            top: 5,
            textStyle: { fontSize: getResponsiveFontSize(13), fontWeight: 'bold', color: isDark ? '#e2e8f0' : '#1e293b' },
        },
        tooltip: { trigger: 'axis' },
        legend: { 
            data: ['Coordinación', 'On Site', 'Laboratorio'], 
            bottom: 0,
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { fontSize: getResponsiveFontSize(9) }
        },
        grid: { left: '8%', right: '5%', top: '15%', bottom: '15%', containLabel: true },
        xAxis: {
            type: 'category',
            data: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            axisLabel: { fontSize: getResponsiveFontSize(9) }
        },
        yAxis: { 
            type: 'value', 
            name: 'Horas',
            nameTextStyle: { fontSize: getResponsiveFontSize(10) },
            axisLabel: { fontSize: getResponsiveFontSize(9) }
        },
        series: [
            {
                name: 'Coordinación',
                type: 'line',
                data: evolucionTiempos.coordinacion,
                smooth: true,
                lineStyle: { width: 2, color: '#60a5fa' },
                symbol: 'circle',
                symbolSize: 4,
            },
            {
                name: 'On Site',
                type: 'line',
                data: evolucionTiempos.onSite,
                smooth: true,
                lineStyle: { width: 2, color: '#34d399' },
                symbol: 'circle',
                symbolSize: 4,
            },
            {
                name: 'Laboratorio',
                type: 'line',
                data: evolucionTiempos.laboratorio,
                smooth: true,
                lineStyle: { width: 2, color: '#fbbf24' },
                symbol: 'circle',
                symbolSize: 4,
            },
        ],
    };

    // Gráfico 7: Tickets por técnico (Barras agrupadas) - RESPONSIVE
    const tecnicosOption = {
        title: {
            text: 'Tickets por Técnico (Mensual)',
            left: 'center',
            top: 5,
            textStyle: { fontSize: getResponsiveFontSize(14), fontWeight: 'bold', color: isDark ? '#e2e8f0' : '#1e293b' },
        },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { 
            data: ['Tickets', '% Reincidencias'], 
            bottom: 0,
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { fontSize: getResponsiveFontSize(9) }
        },
        grid: { left: '8%', right: '8%', top: '15%', bottom: '15%', containLabel: true },
        xAxis: { 
            type: 'category', 
            data: ticketsPorTecnico.nombres, 
            axisLabel: { rotate: 15, fontSize: getResponsiveFontSize(9) } 
        },
        yAxis: [
            { 
                type: 'value', 
                name: 'Tickets',
                nameTextStyle: { fontSize: getResponsiveFontSize(10) },
                axisLabel: { fontSize: getResponsiveFontSize(9) }
            },
            { 
                type: 'value', 
                name: '% Reinc.',
                nameTextStyle: { fontSize: getResponsiveFontSize(10) },
                max: 30,
                axisLabel: { fontSize: getResponsiveFontSize(9) }
            },
        ],
        series: [
            {
                name: 'Tickets',
                type: 'bar',
                data: ticketsPorTecnico.mensual,
                barWidth: '40%',
                itemStyle: {
                    borderRadius: [6, 6, 0, 0],
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#c084fc' },
                        { offset: 1, color: '#8b5cf6' },
                    ]),
                },
                label: { 
                    show: true, 
                    position: 'top',
                    fontSize: getResponsiveFontSize(8),
                    rotate: 0
                },
            },
            {
                name: '% Reincidencias',
                type: 'line',
                yAxisIndex: 1,
                data: reincidenciasDetalle.porTecnico,
                lineStyle: { width: 2, color: '#f87171' },
                symbol: 'circle',
                symbolSize: 4,
            },
        ],
    };

    // Gráfico 8: Tendencia de reincidencias (Línea) - RESPONSIVE
    const tendenciaReincidenciasOption = {
        title: {
            text: 'Tendencia Reincidencias (12 meses)',
            left: 'center',
            top: 5,
            textStyle: { fontSize: getResponsiveFontSize(13), fontWeight: 'bold', color: isDark ? '#e2e8f0' : '#1e293b' },
        },
        tooltip: { trigger: 'axis' },
        grid: { left: '8%', right: '5%', top: '15%', bottom: '8%', containLabel: true },
        xAxis: { 
            type: 'category', 
            data: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            axisLabel: { fontSize: getResponsiveFontSize(9) }
        },
        yAxis: { 
            type: 'value', 
            name: 'Reincidencias',
            nameTextStyle: { fontSize: getResponsiveFontSize(10) },
            axisLabel: { fontSize: getResponsiveFontSize(9) }
        },
        series: [
            {
                data: reincidencias.historial,
                type: 'line',
                smooth: true,
                lineStyle: { width: 2, color: '#f87171' },
                areaStyle: { color: 'rgba(248, 113, 113, 0.1)' },
                symbol: 'circle',
                symbolSize: 4,
            },
        ],
    };

    return (
        <div className="overflow-x-hidden w-full">
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

            <div className="pt-5 w-full">
                {/* Fila 1: KPIs principales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
                    <div className="panel bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                        <div className="flex justify-between items-center">
                            <div className="min-w-0">
                                <p className="text-white/70 text-xs sm:text-sm truncate">Total Tickets (Hoy)</p>
                                <h3 className="text-white text-2xl sm:text-3xl font-bold">{ticketsPersonalTotal.diario}</h3>
                                <span className="text-white/80 text-xs">+12% vs ayer</span>
                            </div>
                            <div className="bg-white/20 p-2 sm:p-3 rounded-full flex-shrink-0">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="panel bg-gradient-to-r from-purple-500 to-purple-600 p-4">
                        <div className="flex justify-between items-center">
                            <div className="min-w-0">
                                <p className="text-white/70 text-xs sm:text-sm truncate">Reincidencias</p>
                                <h3 className="text-white text-2xl sm:text-3xl font-bold">{reincidencias.porcentaje}%</h3>
                                <span className="text-white/80 text-xs">{reincidencias.total} tickets</span>
                            </div>
                            <div className="bg-white/20 p-2 sm:p-3 rounded-full flex-shrink-0">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="panel bg-gradient-to-r from-amber-500 to-amber-600 p-4">
                        <div className="flex justify-between items-center">
                            <div className="min-w-0">
                                <p className="text-white/70 text-xs sm:text-sm truncate">Técnico del Mes</p>
                                <h3 className="text-white text-2xl sm:text-3xl font-bold truncate">María P.</h3>
                                <span className="text-white/80 text-xs">194 tickets</span>
                            </div>
                            <div className="bg-white/20 p-2 sm:p-3 rounded-full flex-shrink-0">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="panel bg-gradient-to-r from-emerald-500 to-emerald-600 p-4">
                        <div className="flex justify-between items-center">
                            <div className="min-w-0">
                                <p className="text-white/70 text-xs sm:text-sm truncate">Tiempo Promedio</p>
                                <h3 className="text-white text-2xl sm:text-3xl font-bold">{tiemposPromedio.resolucionTotal}h</h3>
                                <span className="text-white/80 text-xs">Resolución total</span>
                            </div>
                            <div className="bg-white/20 p-2 sm:p-3 rounded-full flex-shrink-0">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fila 2: Gráficos principales */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
                    <div className="panel p-3 h-[300px] sm:h-[350px] lg:h-[400px] w-full">
                        <ReactECharts option={ticketPeriodoOption} theme="tickets-theme" style={{ height: '100%', width: '100%' }} />
                    </div>
                    <div className="panel p-3 h-[300px] sm:h-[350px] lg:h-[400px] w-full">
                        <ReactECharts option={ubicacionOption} theme="tickets-theme" style={{ height: '100%', width: '100%' }} />
                    </div>
                </div>

                {/* Fila 3: Gráficos de fallas y estados */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
                    <div className="panel p-3 h-[300px] sm:h-[350px] lg:h-[400px] w-full">
                        <ReactECharts option={fallaOption} theme="tickets-theme" style={{ height: '100%', width: '100%' }} />
                    </div>
                    <div className="panel p-3 h-[300px] sm:h-[350px] lg:h-[400px] w-full">
                        <ReactECharts option={estadoOption} theme="tickets-theme" style={{ height: '100%', width: '100%' }} />
                    </div>
                </div>

                {/* FILA 4: Tiempos Promedio - ANCHO COMPLETO */}
                <div className="grid grid-cols-1 gap-4 lg:gap-6 mb-6">
                    <div className="panel p-3 h-[250px] sm:h-[300px] lg:h-[350px] w-full">
                        <ReactECharts option={tiemposOption} theme="tickets-theme" style={{ height: '100%', width: '100%' }} />
                    </div>
                </div>

                {/* NUEVA FILA: Cumplimiento SLA y Distribución de Tiempos */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
                    {/* Tarjeta de cumplimiento SLA */}
                    <div className="panel bg-white dark:bg-black p-4 lg:p-5 h-auto lg:h-[300px] overflow-auto">
                        <h5 className="font-semibold text-base lg:text-lg mb-3 lg:mb-4 dark:text-white">Cumplimiento SLA</h5>
                        <div className="space-y-3 lg:space-y-4">
                            <div>
                                <div className="flex justify-between mb-1 text-xs lg:text-sm dark:text-gray-300">
                                    <span className="truncate">Coordinación (&lt;{sla.coordinacion.meta}h)</span>
                                    <span className={`font-bold ml-2 flex-shrink-0 ${sla.coordinacion.cumplimiento >= 90 ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {sla.coordinacion.cumplimiento}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${sla.coordinacion.cumplimiento}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1 text-xs lg:text-sm dark:text-gray-300">
                                    <span className="truncate">On Site (&lt;{sla.onSite.meta}h)</span>
                                    <span className={`font-bold ml-2 flex-shrink-0 ${sla.onSite.cumplimiento >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {sla.onSite.cumplimiento}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${sla.onSite.cumplimiento}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1 text-xs lg:text-sm dark:text-gray-300">
                                    <span className="truncate">Laboratorio (&lt;{sla.laboratorio.meta}h)</span>
                                    <span className={`font-bold ml-2 flex-shrink-0 ${sla.laboratorio.cumplimiento >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                                        {sla.laboratorio.cumplimiento}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${sla.laboratorio.cumplimiento}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Métricas adicionales */}
                        <div className="mt-4 lg:mt-6 pt-3 lg:pt-4 border-t dark:border-gray-700">
                            <div className="grid grid-cols-2 gap-2 lg:gap-3">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Tickets dentro SLA</p>
                                    <p className="text-lg lg:text-xl font-bold dark:text-white">78%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Tiempo extra</p>
                                    <p className="text-lg lg:text-xl font-bold text-orange-500">+2.3h</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Distribución de tiempos de resolución */}
                    <div className="panel bg-white dark:bg-black p-4 lg:p-5 lg:col-span-2 h-auto lg:h-[300px] overflow-auto">
                        <h5 className="font-semibold text-base lg:text-lg mb-3 lg:mb-4 dark:text-white">Distribución Tiempo de Resolución</h5>
                        <div className="flex h-32 sm:h-36 lg:h-40 items-end gap-2 sm:gap-3 lg:gap-4 justify-center px-2">
                            {distribucionTiempos.rangos.map((rango, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center max-w-[60px] sm:max-w-[80px] lg:max-w-[100px]">
                                    <div 
                                        className="w-full rounded-t-lg transition-all hover:opacity-80"
                                        style={{ 
                                            height: `${Math.max(30, distribucionTiempos.porcentajes[idx] * (window.innerWidth < 640 ? 1 : 1.5))}px`,
                                            backgroundColor: distribucionTiempos.colores[idx],
                                            minHeight: '25px'
                                        }}
                                    >
                                        <div className="text-white text-center font-bold text-xs pt-1">
                                            {distribucionTiempos.porcentajes[idx]}%
                                        </div>
                                    </div>
                                    <span className="mt-1 lg:mt-2 text-xs font-medium dark:text-gray-300">{rango}</span>
                                    <span className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                                        {Math.round(ticketsPersonalTotal.mensual * distribucionTiempos.porcentajes[idx] / 100)} tickets
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 lg:mt-4 flex flex-wrap justify-center gap-3 lg:gap-6 px-2">
                            <div className="flex items-center gap-1 lg:gap-2">
                                <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-blue-500"></div>
                                <span className="text-[10px] lg:text-xs dark:text-gray-300">Óptimo</span>
                            </div>
                            <div className="flex items-center gap-1 lg:gap-2">
                                <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-green-500"></div>
                                <span className="text-[10px] lg:text-xs dark:text-gray-300">Normal</span>
                            </div>
                            <div className="flex items-center gap-1 lg:gap-2">
                                <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-yellow-500"></div>
                                <span className="text-[10px] lg:text-xs dark:text-gray-300">Lento</span>
                            </div>
                            <div className="flex items-center gap-1 lg:gap-2">
                                <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-red-500"></div>
                                <span className="text-[10px] lg:text-xs dark:text-gray-300">Crítico</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* NUEVA FILA: Evolución de tiempos */}
                <div className="grid grid-cols-1 gap-4 lg:gap-6 mb-6">
                    <div className="panel p-3 h-[250px] sm:h-[300px] lg:h-[350px] w-full">
                        <ReactECharts option={evolucionTiemposOption} theme="tickets-theme" style={{ height: '100%', width: '100%' }} />
                    </div>
                </div>

                {/* FILA 5: Reincidencias y Tendencia */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
                    <div className="panel p-3 h-[300px] sm:h-[350px] lg:h-[400px] w-full">
                        <ReactECharts option={reincidenciasOption} theme="tickets-theme" style={{ height: '100%', width: '100%' }} />
                    </div>
                    <div className="panel p-3 h-[300px] sm:h-[350px] lg:h-[400px] w-full">
                        <ReactECharts option={tendenciaReincidenciasOption} theme="tickets-theme" style={{ height: '100%', width: '100%' }} />
                    </div>
                </div>

                {/* NUEVA FILA: Reincidencias por técnico y falla */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
                    <div className="panel bg-white dark:bg-black p-4 lg:p-5 h-[300px] lg:h-[350px] overflow-auto">
                        <h5 className="font-semibold text-base lg:text-lg mb-3 lg:mb-4 dark:text-white">Reincidencias por Técnico</h5>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs lg:text-sm">
                                <thead>
                                    <tr className="border-b dark:border-gray-700">
                                        <th className="text-left py-2 dark:text-gray-300">Técnico</th>
                                        <th className="text-center py-2 dark:text-gray-300">Tickets</th>
                                        <th className="text-center py-2 dark:text-gray-300">Reinc.</th>
                                        <th className="text-right py-2 dark:text-gray-300">%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ticketsPorTecnico.nombres.map((nombre, idx) => (
                                        <tr key={idx} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <td className="py-2 font-medium dark:text-white truncate max-w-[80px] lg:max-w-none">{nombre}</td>
                                            <td className="text-center dark:text-gray-300">{ticketsPorTecnico.mensual[idx]}</td>
                                            <td className="text-center">
                                                <span className="text-red-600 font-medium">
                                                    {Math.round(ticketsPorTecnico.mensual[idx] * reincidenciasDetalle.porTecnico[idx] / 100)}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <span className={`font-bold ${
                                                    reincidenciasDetalle.porTecnico[idx] > 20 ? 'text-red-600' : 
                                                    reincidenciasDetalle.porTecnico[idx] > 15 ? 'text-yellow-600' : 'text-green-600'
                                                }`}>
                                                    {reincidenciasDetalle.porTecnico[idx]}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="panel bg-white dark:bg-black p-4 lg:p-5 h-[300px] lg:h-[350px] overflow-auto">
                        <h5 className="font-semibold text-base lg:text-lg mb-3 lg:mb-4 dark:text-white">Reincidencias por Tipo de Falla</h5>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs lg:text-sm">
                                <thead>
                                    <tr className="border-b dark:border-gray-700">
                                        <th className="text-left py-2 dark:text-gray-300">Falla</th>
                                        <th className="text-center py-2 dark:text-gray-300">Total</th>
                                        <th className="text-center py-2 dark:text-gray-300">Reinc.</th>
                                        <th className="text-right py-2 dark:text-gray-300">%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ticketsPorFalla.tipos.map((tipo, idx) => (
                                        <tr key={idx} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <td className="py-2 font-medium dark:text-white truncate max-w-[100px] lg:max-w-none">{tipo}</td>
                                            <td className="text-center dark:text-gray-300">{ticketsPorFalla.valores[idx]}</td>
                                            <td className="text-center">
                                                <span className="text-red-600 font-medium">
                                                    {Math.round(ticketsPorFalla.valores[idx] * reincidenciasDetalle.porFalla[idx] / 100)}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <span className={`font-bold ${
                                                    reincidenciasDetalle.porFalla[idx] > 20 ? 'text-red-600' : 
                                                    reincidenciasDetalle.porFalla[idx] > 15 ? 'text-yellow-600' : 'text-green-600'
                                                }`}>
                                                    {reincidenciasDetalle.porFalla[idx]}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* FILA 6: Tickets por técnico y resumen personal - MODIFICADA */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
                    <div className="lg:col-span-2 panel p-3 h-[350px] lg:h-[450px] w-full">
                        <ReactECharts option={tecnicosOption} theme="tickets-theme" style={{ height: '100%', width: '100%' }} />
                    </div>
                    <div className="panel bg-white dark:bg-black p-4 lg:p-5 h-[350px] lg:h-[450px] overflow-auto">
                        <h5 className="font-semibold text-base lg:text-lg mb-3 lg:mb-4 dark:text-white">Top Técnicos</h5>
                        <div className="space-y-2 lg:space-y-4">
                            {ticketsPorTecnico.nombres
                                .map((nombre, idx) => ({ nombre, tickets: ticketsPorTecnico.mensual[idx], reincidencia: reincidenciasDetalle.porTecnico[idx] }))
                                .sort((a, b) => b.tickets - a.tickets)
                                .map((tecnico, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 lg:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                                        <div
                                            className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs lg:text-sm flex-shrink-0 ${
                                                idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-amber-700' : 'bg-blue-500'
                                            }`}
                                        >
                                            {idx + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold dark:text-white text-xs lg:text-sm truncate">{tecnico.nombre}</p>
                                            <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400">{tecnico.tickets} tickets</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-2">
                                        <div className="text-xs lg:text-sm font-bold text-primary">{Math.round(tecnico.tickets / 30)}/día</div>
                                        <div className={`text-[10px] lg:text-xs ${
                                            tecnico.reincidencia > 20 ? 'text-red-600' : 
                                            tecnico.reincidencia > 15 ? 'text-yellow-600' : 'text-green-600'
                                        }`}>
                                            {tecnico.reincidencia}% reinc.
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h5 className="font-semibold text-base lg:text-lg mt-4 lg:mt-6 mb-2 lg:mb-4 dark:text-white">Resumen Personal</h5>
                        <div className="space-y-2 lg:space-y-3 text-xs lg:text-sm dark:text-gray-300">
                            <div className="flex justify-between">
                                <span>Total Técnicos:</span>
                                <span className="font-bold dark:text-white">{ticketsPorTecnico.nombres.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Promedio/técnico:</span>
                                <span className="font-bold dark:text-white">{Math.round(ticketsPersonalTotal.mensual / ticketsPorTecnico.nombres.length)}/mes</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Meta mensual:</span>
                                <span className="font-bold text-green-600">✓ 105%</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t dark:border-gray-700">
                                <span className="truncate">Menos reinc.:</span>
                                <span className="font-bold text-green-600 ml-2">María P. (8%)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;