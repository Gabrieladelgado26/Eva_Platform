import { Head, Link, usePage, router } from "@inertiajs/react";
import { useState, useMemo } from "react";
import AppSidebar, { useSidebarState } from '@/Components/AppSidebar';
import {
    BarChart3, Award, Clock, Target, Users, Zap, Activity, ChevronDown,
    BookOpen, CheckCircle, TrendingUp, Info, BookMarked, Filter, RotateCcw
} from "lucide-react";

import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer, Cell, ComposedChart, Line
} from 'recharts';

export default function Analytics() {
    const { props } = usePage();
    const { auth, stats, monthlyActivity, peakHours, ovaPerformanceByArea, availableCourses, selectedCourse } = props;
    const user = auth?.user ?? { name: "Profesor", role: { name: "Docente" } };

    const [collapsed] = useSidebarState();
    const [courseFilter, setCourseFilter] = useState(selectedCourse || '');

    const dashboardStats = stats || {
        totalCourses: 0,
        activeCourses: 0,
        totalStudents: 0,
        totalOVAs: 0,
        completedActivities: 0,
        avgScore: 0,
        avgProgress: 0,
    };

    const paletteColors = ['#540D6E', '#EE4266', '#0EAD69', '#3BCEAC', '#FFD23F'];
    const areaColors = {
        'Matemáticas': '#540D6E',
        'Español': '#EE4266', 
        'Ciencias Naturales': '#0EAD69',
        'Ciencias Sociales': '#3BCEAC',
        'Inglés': '#FFD23F',
    };
    
    // Datos de actividad mensual
    const completeMonthlyData = useMemo(() => {
        // Si hay datos del backend, los usamos directamente
        if (monthlyActivity && Array.isArray(monthlyActivity) && monthlyActivity.length > 0) {
            console.log('Datos de actividad recibidos del backend:', monthlyActivity);
            return monthlyActivity.map(item => ({
                month: item.month,
                count: item.count || 0
            }));
        }

        // Si no hay datos, generar estructura vacía para los 6 meses
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const now = new Date();
        const emptyData = [];

        for (let i = -4; i <= 1; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
            const monthIndex = date.getMonth();
            const yearShort = date.getFullYear().toString().slice(-2);
            emptyData.push({
                month: `${monthNames[monthIndex]} ${yearShort}`,
                count: 0
            });
        }

        console.log('Generando datos vacíos para actividad mensual');
        return emptyData;
    }, [monthlyActivity]);

    // Ordenar horas pico correctamente
    const sortedPeakHours = useMemo(() => {
        if (!peakHours || peakHours.length === 0) {
            return [
                { label: 'Madrugada', count: 0, pct: 0 },
                { label: 'Mañana', count: 0, pct: 0 },
                { label: 'Tarde', count: 0, pct: 0 },
                { label: 'Noche', count: 0, pct: 0 },
            ];
        }

        const peakOrder = ['Madrugada', 'Mañana', 'Tarde', 'Noche'];
        const peakMap = new Map(peakHours.map(p => [p.label, p]));
        
        return peakOrder.map(label => {
            const found = peakMap.get(label);
            return found || { label, count: 0, pct: 0 };
        });
    }, [peakHours]);

    // Preparar datos de rendimiento por área con colores
    const performanceData = useMemo(() => {
        if (!ovaPerformanceByArea || ovaPerformanceByArea.length === 0) {
            return [];
        }
        return ovaPerformanceByArea.map(item => ({
            ...item,
            fill: areaColors[item.area] || paletteColors[0]
        }));
    }, [ovaPerformanceByArea]);

    const hasData = dashboardStats.totalCourses > 0 && dashboardStats.totalStudents > 0;

    const handleCourseChange = (courseId) => {
        setCourseFilter(courseId);
        router.get(route('teacher.analytics'), courseId ? { course: courseId } : {}, { preserveState: false });
    };

    // Helper: mapea el área al ícono y colores
    const getAreaStyle = (area) => {
        const a = (area || '').toLowerCase();
        if (a.includes('matemá') || a.includes('matema'))
            return { Icon: BarChart3, bg: '#F3E8FF', color: '#540D6E' };
        if (a.includes('español') || a.includes('lengua'))
            return { Icon: BookOpen, bg: '#FFEBEE', color: '#EE4266' };
        if (a.includes('natural') || a.includes('ciencia natu'))
            return { Icon: Zap, bg: '#E8FBF3', color: '#0EAD69' };
        if (a.includes('social') || a.includes('ciencia soc'))
            return { Icon: Users, bg: '#E6FFF7', color: '#3BCEAC' };
        if (a.includes('inglés') || a.includes('ingles'))
            return { Icon: BookMarked, bg: '#FFFBEA', color: '#FFD23F' };
        return { Icon: BookMarked, bg: '#F3F4F6', color: '#6B7280' };
    };

    const StatCard = ({ title, value, icon: Icon, accentColor, subtitle, tooltip }) => (
        <div
            className="rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 group relative bg-white"
            style={{
                border: '1px solid #E5E7EB',
                borderLeft: accentColor ? `4px solid ${accentColor}` : '4px solid #E5E7EB',
            }}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-500">{title}</p>
                        {tooltip && (
                            <div className="group/tip relative">
                                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/tip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                    {tooltip}
                                </div>
                            </div>
                        )}
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
                    {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
                </div>
                <div
                    className="p-3 rounded-xl group-hover:scale-110 transition-transform duration-200"
                    style={{ backgroundColor: accentColor ? `${accentColor}20` : '#F3F4F6' }}
                >
                    <Icon className="w-6 h-6" style={{ color: accentColor || '#6B7280' }} />
                </div>
            </div>
        </div>
    );

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length > 0) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-1">{label}</p>
                    {payload.map((p, idx) => {
                        // Validar que p tenga los datos necesarios
                        if (!p || p.value === undefined || p.value === null) return null;
                        return (
                            <p key={idx} className="text-xs" style={{ color: p.color || '#540D6E' }}>
                                {p.name || 'Valor'}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
                            </p>
                        );
                    }).filter(Boolean)}
                </div>
            );
        }
        return null;
    };

    // Componente para estado vacío
    const EmptyState = ({ icon: Icon, title, message }) => (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Icon className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs mt-1">{message}</p>
        </div>
    );

    const blockColors = {
        'Madrugada': '#540D6E',
        'Mañana': '#EE4266',
        'Tarde': '#FFD23F',
        'Noche': '#0EAD69',
    };

    return (
        <>
            <Head title="Estadísticas - Docente" />

            <AppSidebar currentRoute="teacher.analytics" />

            <main className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-20" : "lg:ml-72"} min-h-screen bg-gray-50`}>
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Link href={route("dashboard")} className="hover:text-purple-600 transition-colors">
                                Panel de Control
                            </Link>
                            <span>/</span>
                            <Link href={route("teacher.dashboard")} className="hover:text-purple-600 transition-colors">
                                Docente
                            </Link>
                            <span>/</span>
                            <span style={{ color: "#540D6E" }} className="font-medium">
                                Estadísticas
                            </span>
                        </div>
                    </div>

                    {/* Header con filtro mejorado */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div
                                    className="p-4 rounded-xl shadow-sm border bg-white"
                                    style={{ borderColor: "#540D6E" }}
                                >
                                    <BarChart3 className="w-10 h-10" style={{ color: "#540D6E" }} />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                                        ¡Bienvenido, {user.name}!
                                    </h1>
                                    <p className="text-gray-600">
                                        Estadísticas de tus cursos y evaluaciones —{" "}
                                        {new Date().toLocaleDateString("es-ES", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Filtro por Curso - Con botón de limpiar */}
                            {availableCourses && availableCourses.length > 0 && (
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <select
                                            value={courseFilter}
                                            onChange={e => handleCourseChange(e.target.value)}
                                            className="px-4 pr-10 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-offset-2 outline-none transition-all hover:border-gray-300 appearance-none min-w-[200px]"
                                            style={{ 
                                                "--tw-ring-color": "rgba(84, 13, 110, 0.2)",
                                                borderColor: courseFilter ? '#540D6E' : '#E5E7EB'
                                            }}
                                            onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                            onBlur={e => e.currentTarget.style.borderColor = courseFilter ? '#540D6E' : '#E5E7EB'}
                                        >
                                            <option value="">Todos los cursos</option>
                                            {availableCourses.map(course => (
                                                <option key={course.id} value={course.id}>
                                                    {course.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                    {courseFilter && (
                                        <button
                                            onClick={() => handleCourseChange('')}
                                            className="p-4 rounded-lg transition-all duration-200 flex items-center gap-2 text-white hover:scale-105 active:scale-95"
                                            style={{ backgroundColor: '#540D6E' }}
                                            title="Limpiar filtro"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* First row: 4 stat cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Cursos"
                            value={dashboardStats.totalCourses}
                            icon={BookOpen}
                            accentColor="#540D6E"
                            subtitle="Cursos asignados"
                        />
                        <StatCard
                            title="Cursos Activos"
                            value={dashboardStats.activeCourses}
                            icon={Zap}
                            accentColor="#0EAD69"
                            subtitle={`${dashboardStats.totalCourses > 0 
                                ? Math.round((dashboardStats.activeCourses / dashboardStats.totalCourses) * 100) 
                                : 0}% activos`}
                        />
                        <StatCard
                            title="Total Estudiantes"
                            value={dashboardStats.totalStudents}
                            icon={Users}
                            accentColor="#EE4266"
                            subtitle="Inscritos en tus cursos"
                        />
                        <StatCard
                            title="Total OVAs"
                            value={dashboardStats.totalOVAs}
                            icon={BookOpen}
                            accentColor="#3BCEAC"
                            subtitle="Recursos asignados"
                        />
                    </div>

                    {/* Second row: 4 stat cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Evaluaciones"
                            value={dashboardStats.completedActivities}
                            icon={CheckCircle}
                            accentColor="#FFD23F"
                            subtitle="Total completadas"
                            tooltip="Número total de evaluaciones realizadas por tus estudiantes"
                        />
                        <StatCard
                            title="Promedio"
                            value={`${dashboardStats.avgScore}%`}
                            icon={Award}
                            accentColor="#540D6E"
                            subtitle="Nota promedio"
                        />
                        <StatCard
                            title="Progreso"
                            value={`${dashboardStats.avgProgress}%`}
                            icon={Target}
                            accentColor="#0EAD69"
                            subtitle="Avance general"
                        />
                        <StatCard
                            title="Estado"
                            value={hasData ? "Activo" : "Inicial"}
                            icon={Activity}
                            accentColor={hasData ? "#0EAD69" : "#EE4266"}
                            subtitle={hasData 
                                ? `${dashboardStats.totalStudents} estudiantes activos` 
                                : "Crea un curso para comenzar"}
                        />
                    </div>

                    {/* Charts row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                        {/* Actividad Mensual */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Actividad Mensual</h3>
                                    <p className="text-sm text-gray-500">Evaluaciones completadas por mes</p>
                                </div>
                                <Activity className="w-5 h-5 text-gray-400" />
                            </div>
                            {!hasData ? (
                                <EmptyState 
                                    icon={Activity}
                                    title="Sin datos de actividad"
                                    message="Crea un curso e inscribe estudiantes para ver su actividad"
                                />
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={completeMonthlyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                        <XAxis dataKey="month" stroke="#6B7280" />
                                        <YAxis stroke="#6B7280" />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area 
                                            type="monotone" 
                                            dataKey="count" 
                                            stroke="#540D6E" 
                                            fill="#540D6E" 
                                            fillOpacity={0.3} 
                                            name="Evaluaciones" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Rendimiento por Área */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Rendimiento por Área</h3>
                                    <p className="text-sm text-gray-500">Promedio y cantidad de evaluaciones</p>
                                </div>
                                <Award className="w-5 h-5 text-gray-400" />
                            </div>
                            {performanceData.length === 0 ? (
                                <EmptyState 
                                    icon={Award}
                                    title="Sin evaluaciones registradas"
                                    message="Los estudiantes aún no han completado evaluaciones"
                                />
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <ComposedChart data={performanceData.map(item => ({
                                        ...item,
                                        area: item.area === 'Ciencias Naturales' ? 'Naturales' :
                                            item.area === 'Ciencias Sociales' ? 'Sociales' :
                                            item.area
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                        <XAxis dataKey="area" stroke="#6B7280" />
                                        <YAxis stroke="#6B7280" />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Bar dataKey="avg" fill="#540D6E" name="Promedio %" radius={[4, 4, 0, 0]} barSize={50} />
                                        <Line type="monotone" dataKey="count" stroke="#EE4266" name="Cantidad Evaluaciones" strokeWidth={2} dot={{ r: 4 }} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Bottom row: 3 cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Progreso General */}
                        <div 
                            className="rounded-xl shadow-sm p-5 flex flex-col justify-center"
                            style={{ 
                                backgroundColor: "#F3E8FF", 
                                border: "1px solid #E5E7EB",
                                borderLeft: "4px solid #540D6E"
                            }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="text-base font-bold" style={{ color: "#540D6E" }}>Progreso General</h3>
                                    <p className="text-xs opacity-70" style={{ color: "#540D6E" }}>Avance del grupo</p>
                                </div>
                                <Target className="w-5 h-5 opacity-60" style={{ color: "#540D6E" }} />
                            </div>
                            <div className="relative flex-1 flex flex-col justify-center">
                                <div className="text-center justify-center between">
                                    <p className="text-5xl font-bold mb-1" style={{ color: "#540D6E" }}>{dashboardStats.avgProgress}%</p>
                                    <p className="text-sm opacity-80" style={{ color: "#540D6E" }}>
                                        {dashboardStats.completedActivities} de {dashboardStats.totalStudents * dashboardStats.totalOVAs} posibles
                                    </p>
                                </div>
                                <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#540D6E33' }}>
                                    <div 
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{ 
                                            width: `${Math.min(dashboardStats.avgProgress, 100)}%`,
                                            backgroundColor: '#540D6E'
                                        }}
                                    ></div>
                                </div>
                            </div>
                            {dashboardStats.totalStudents > 0 && (
                                <p className="text-sm text-center mt-3 opacity-70" style={{ color: "#540D6E" }}>
                                    {dashboardStats.totalStudents} estudiantes · {dashboardStats.totalOVAs} OVAs
                                </p>
                            )}
                        </div>

                        {/* Horas Pico */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">Horas de Actividad</h3>
                                    <p className="text-xs text-gray-400">Distribución por bloques</p>
                                </div>
                                <Clock className="w-5 h-5 text-gray-400" />
                            </div>
                            <br />
                            <div className="space-y-3">
                                {sortedPeakHours.map((item, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600 font-medium">{item.label}</span>
                                            <span className="text-gray-900 font-semibold">
                                                {item.pct > 0 ? `${item.pct}%` : '—'}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{ 
                                                    width: `${Math.max(item.pct, 3)}%`, 
                                                    backgroundColor: blockColors[item.label],
                                                    opacity: item.pct > 0 ? 1 : 0.3
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {!hasData && (
                                <p className="text-xs text-gray-400 text-center mt-3">
                                    Sin datos de actividad todavía
                                </p>
                            )}
                        </div>

                        {/* Por Área */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">Por Área</h3>
                                    <p className="text-xs text-gray-400">Detalle de rendimiento</p>
                                </div>
                                <Award className="w-5 h-5 text-gray-400" />
                            </div>
                            {performanceData.length === 0 ? (
                                <EmptyState 
                                    icon={Award}
                                    title="Sin evaluaciones"
                                    message="No hay datos de rendimiento por área"
                                />
                            ) : (
                                <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1">
                                    {performanceData.map((item, idx) => {
                                        const { Icon, bg, color } = getAreaStyle(item.area);
                                        return (
                                            <div
                                                key={idx}
                                                className="group flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition-all duration-150"
                                            >
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200"
                                                        style={{ backgroundColor: bg }}
                                                    >
                                                        <Icon className="w-3.5 h-3.5" style={{ color }} />
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center mb-0.5">
                                                        <span className="text-sm font-medium text-gray-900 truncate max-w-[100px]">
                                                            {item.area}
                                                        </span>
                                                        <span className="text-xs font-semibold text-gray-900">
                                                            {item.avg}%
                                                        </span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-500"
                                                            style={{ 
                                                                width: `${item.avg}%`, 
                                                                backgroundColor: color 
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Activity className="w-4 h-4" />
                                <span>Datos actualizados hasta {new Date().toLocaleDateString('es-ES')}</span>
                            </div>
                            <div className="flex gap-6">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Cursos</p>
                                    <p className="text-lg font-bold" style={{ color: "#540D6E" }}>
                                        {dashboardStats.totalCourses}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Estudiantes</p>
                                    <p className="text-lg font-bold" style={{ color: "#0EAD69" }}>
                                        {dashboardStats.totalStudents}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Progreso</p>
                                    <p className="text-lg font-bold" style={{ color: "#EE4266" }}>
                                        {dashboardStats.avgProgress}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}