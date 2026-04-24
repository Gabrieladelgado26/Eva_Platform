import { Head, Link, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AppSidebar, { useSidebarState } from '@/Components/AppSidebar';
import {
    Users, UserCheck, UserX, GraduationCap, BookOpen, TrendingUp, TrendingDown,
    Calendar, ChevronLeft, ChevronRight, Download, RefreshCw, Eye, EyeOff,
    Menu, X, ChevronDown, Filter, Search, Bell, Settings, LogOut, Home,
    BarChart3, PieChart, LineChart, Activity, Zap, Target, Award, Clock, UserPlus,
    CheckCircle, PlayCircle, Upload, Key
} from "lucide-react";

// Componentes de gráficas (instala: npm install recharts)
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart as ReLineChart, Line, PieChart as RePieChart, Pie, Cell, AreaChart, Area,
    RadialBarChart, RadialBar, ComposedChart, Scatter
} from 'recharts';

export default function Dashboard() {
    const { props } = usePage();
    const { auth, stats, recentUsers, activityLogs, userGrowth, roleDistribution, monthlyActivity,
            peakHours, ovaPerformanceByArea, availableAreas, selectedArea } = props;
    const user = auth?.user ?? { name: "Usuario", role: { name: "Administrador" } };

    const [collapsed] = useSidebarState();
    const [dateRange, setDateRange] = useState("month");
    const [showNotifications, setShowNotifications] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [areaFilter, setAreaFilter] = useState(selectedArea || '');

    const dashboardStats = stats || {
        totalUsers: 1248,
        activeUsers: 1024,
        inactiveUsers: 224,
        totalStudents: 980,
        totalTeachers: 48,
        totalAdmins: 12,
        totalOVAs: 156,
        completedActivities: 3420,
        avgProgress: 78,
        activeCourses: 24
    };

    const roleDistributionData = roleDistribution || [
        { name: 'Estudiantes', value: dashboardStats.totalStudents, color: '#540D6E', icon: GraduationCap },
        { name: 'Docentes', value: dashboardStats.totalTeachers, color: '#EE4266', icon: BookOpen },
        { name: 'Administradores', value: dashboardStats.totalAdmins, color: '#FFD23F', icon: Users }
    ];

    const userGrowthData = userGrowth || [
        { month: 'Ene', users: 120, active: 98 },
        { month: 'Feb', users: 135, active: 112 },
        { month: 'Mar', users: 148, active: 125 },
        { month: 'Abr', users: 162, active: 138 },
        { month: 'May', users: 180, active: 152 },
        { month: 'Jun', users: 195, active: 168 },
        { month: 'Jul', users: 210, active: 182 },
        { month: 'Ago', users: 228, active: 198 },
        { month: 'Sep', users: 245, active: 215 },
        { month: 'Oct', users: 260, active: 228 },
        { month: 'Nov', users: 275, active: 242 },
        { month: 'Dic', users: 290, active: 256 }
    ];

    const monthlyActivityData = monthlyActivity || [
        { month: 'Ene', ovas: 12, quizzes: 45, assignments: 28 },
        { month: 'Feb', ovas: 15, quizzes: 52, assignments: 32 },
        { month: 'Mar', ovas: 18, quizzes: 58, assignments: 35 },
        { month: 'Abr', ovas: 22, quizzes: 65, assignments: 40 },
        { month: 'May', ovas: 25, quizzes: 72, assignments: 44 },
        { month: 'Jun', ovas: 28, quizzes: 78, assignments: 48 }
    ];

    const recentActivities = activityLogs || [
        { id: 1, user: 'María González', action: 'Completó OVA', target: 'Matemáticas - Álgebra', time: 'Hace 5 min', icon: '📚' },
        { id: 2, user: 'Carlos Ruiz', action: 'Inició curso', target: 'Ciencias Naturales', time: 'Hace 15 min', icon: '🎓' },
        { id: 3, user: 'Ana Martínez', action: 'Subió recurso', target: 'Historia - Documental', time: 'Hace 1 hora', icon: '📤' },
        { id: 4, user: 'Luis Fernández', action: 'Completó quiz', target: 'Matemáticas - Examen', time: 'Hace 2 horas', icon: '✅' },
        { id: 5, user: 'Elena Torres', action: 'Registró estudiante', target: 'Nuevo ingreso', time: 'Hace 3 horas', icon: '👤' }
    ];

    const refreshData = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    const handleAreaChange = (area) => {
        setAreaFilter(area);
        router.get(route('admin.dashboard'), area ? { area } : {}, { preserveState: false });
    };

    // Palette colors cycle for OVA performance bars
    const paletteColors = ['#540D6E', '#EE4266', '#0EAD69', '#3BCEAC', '#FFD23F'];

    // Peak hours block colors
    const peakBlockColors = {
        'Madrugada': '#3BCEAC',
        'Mañana':    '#FFD23F',
        'Tarde':     '#0EAD69',
        'Noche':     '#540D6E',
    };

    const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, bgColor, subtitle, accentColor }) => (
        <div
            className="rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 group"
            style={{
                backgroundColor: '#ffffff',  // ← Fondo siempre blanco sólido
                border: '1px solid #E5E7EB',
                borderLeft: accentColor ? `4px solid ${accentColor}` : '4px solid #E5E7EB',
            }}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
                    {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
                    {trend && (
                        <div className="flex items-center gap-1 mt-2">
                            {trend === 'up' ? (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                            ) : (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                            )}
                            <span className={`text-xs font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {trendValue}
                            </span>
                            <span className="text-xs text-gray-400">vs mes anterior</span>
                        </div>
                    )}
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
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-1">{label}</p>
                    {payload.map((p, idx) => (
                        <p key={idx} className="text-xs" style={{ color: p.color }}>
                            {p.name}: {p.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <Head title="Dashboard - Personal" />

            <AppSidebar currentRoute="admin.dashboard" />

            <main className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-20" : "lg:ml-72"} min-h-screen bg-gray-50`}>
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Link href={route("dashboard")} className="hover:text-purple-600 transition-colors">Panel de Control</Link>
                            <span>/</span>
                            <Link href={route("admin.dashboard")} className="hover:text-purple-600 transition-colors">Administración</Link>
                            <span>/</span>
                            <span style={{ color: "#540D6E" }} className="font-medium">Estadísticas</span>
                        </div>
                    </div>

                    <div className="max-w-8xl mx-auto">
                        {/* Header con bienvenida y acciones */}
                        <div className="mb-8">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div 
                                        className="p-4 rounded-xl shadow-sm border"
                                        style={{ backgroundColor: "white", borderColor: "#540D6E" }}
                                    >
                                        <BarChart3 className="w-10 h-10" style={{ color: "#540D6E" }} />
                                    </div>

                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-1">
                                            ¡Bienvenido, {user.name}!
                                        </h1>
                                        <p className="text-gray-600">
                                            Panel de control del sistema educativo -{" "}
                                            {new Date().toLocaleDateString("es-ES", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 flex-wrap">
                                    {/* Filtro por Área */}
                                    {availableAreas && availableAreas.length > 0 && (
                                        <div className="relative">
                                            <select
                                                value={areaFilter}
                                                onChange={e => handleAreaChange(e.target.value)}
                                                className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none appearance-none min-w-[170px] shadow-sm"
                                                style={{ borderColor: areaFilter ? '#540D6E' : '' }}
                                            >
                                                <option value="">Todas las áreas</option>
                                                {availableAreas.map(area => (
                                                    <option key={area} value={area}>{area}</option>
                                                ))}
                                            </select>
                                            <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Usuarios"
                            value={dashboardStats.totalUsers.toLocaleString()}
                            icon={Users}
                            trend="up"
                            trendValue="+12.5%"
                            color="text-purple-600"
                            bgColor="bg-white"
                            subtitle="Registrados en el sistema"
                            accentColor="#540D6E"
                        />
                        <StatCard
                            title="Usuarios Activos"
                            value={dashboardStats.activeUsers.toLocaleString()}
                            icon={UserCheck}
                            trend="up"
                            trendValue="+8.2%"
                            color="text-green-600"
                            bgColor="bg-white"
                            subtitle="Con acceso habilitado"
                            accentColor="#0EAD69"
                        />
                        <StatCard
                            title="Usuarios Inactivos"
                            value={dashboardStats.inactiveUsers.toLocaleString()}
                            icon={UserX}
                            trend="down"
                            trendValue="-3.1%"
                            color="text-red-600"
                            bgColor="bg-white"
                            subtitle="Sin acceso"
                            accentColor="#EE4266"
                        />
                        <StatCard
                            title="Total Docentes"
                            value={dashboardStats.totalTeachers}
                            icon={BookOpen}
                            trend="up"
                            trendValue="+1 nuevo"
                            color="text-purple-900"
                            bgColor="bg-white"
                            subtitle="Personal docente registrado"
                            accentColor="#540D6E"
                        />
                    </div>

                    {/* Segunda fila de stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total OVAs"
                            value={dashboardStats.totalOVAs}
                            icon={BookOpen}
                            trend="up"
                            trendValue="+4.2%"
                            color="text-blue-600"
                            bgColor="bg-white"
                            subtitle="Recursos educativos"
                            accentColor="#3BCEAC"
                        />
                        <StatCard
                            title="OVAs Completadas"
                            value={dashboardStats.completedActivities.toLocaleString()}
                            icon={Activity}
                            trend="up"
                            trendValue="+15.3%"
                            color="text-indigo-600"
                            bgColor="bg-white"
                            subtitle="Evaluaciones únicas por estudiante"
                            accentColor="#FFD23F"
                        />
                        <StatCard
                            title="Progreso Promedio"
                            value={`${dashboardStats.avgProgress}%`}
                            icon={Target}
                            trend="up"
                            trendValue="+6.7%"
                            color="text-teal-600"
                            bgColor="bg-white"
                            subtitle="Nivel de avance"
                            accentColor="#3BCEAC"
                        />
                        <StatCard
                            title="Cursos Activos"
                            value={dashboardStats.activeCourses}
                            icon={Zap}
                            trend="up"
                            trendValue="+2 cursos"
                            color="text-yellow-400"
                            bgColor="bg-white"
                            subtitle="En este período"
                            accentColor="#0EAD69"
                        />
                    </div>

                    {/* Gráficas principales */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Gráfica de crecimiento de usuarios */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Crecimiento de Usuarios</h3>
                                    <p className="text-sm text-gray-500">Evolución mensual de usuarios registrados</p>
                                </div>
                                <BarChart3 className="w-5 h-5 text-gray-400" />
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <ComposedChart data={userGrowthData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="month" stroke="#6B7280" />
                                    <YAxis stroke="#6B7280" />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar dataKey="users" fill="#540D6E" name="Usuarios Totales" radius={[4, 4, 0, 0]} />
                                    <Line type="monotone" dataKey="active" stroke="#EE4266" name="Usuarios Activos" strokeWidth={2} dot={{ r: 4 }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Gráfica de distribución de roles */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Distribución por Roles</h3>
                                    <p className="text-sm text-gray-500">Composición actual del sistema</p>
                                </div>
                                <PieChart className="w-5 h-5 text-gray-400" />
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <RePieChart>
                                    <Pie
                                        data={roleDistributionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {roleDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                </RePieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Segunda fila de gráficas */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Actividad mensual */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Actividad Mensual</h3>
                                    <p className="text-sm text-gray-500">OVAs iniciadas y completadas por mes</p>
                                </div>
                                <Activity className="w-5 h-5 text-gray-400" />
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={monthlyActivityData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="month" stroke="#6B7280" />
                                    <YAxis stroke="#6B7280" />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Area type="monotone" dataKey="ovas" stroke="#540D6E" fill="#540D6E" fillOpacity={0.3} name="OVAs Completadas" />
                                    <Area type="monotone" dataKey="iniciadas" stroke="#3BCEAC" fill="#3BCEAC" fillOpacity={0.3} name="OVAs Iniciadas" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Actividades Recientes */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Actividades Recientes</h3>
                                    <p className="text-sm text-gray-500">Últimas acciones registradas en el sistema</p>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    <span className="text-xs font-medium text-green-700">En vivo</span>
                                </div>
                            </div>

                            {/* Helper: mapea la acción (en español) al ícono y colores de la paleta */}
                            {(() => {
                                const getActivityStyle = (action) => {
                                    const a = (action || '').toLowerCase();
                                    if (a.includes('desactivó'))
                                        return { Icon: UserX,       bg: '#FFF3E0', color: '#F57C00' };
                                    if (a.includes('activó'))
                                        return { Icon: UserCheck,   bg: '#E8FBF3', color: '#0EAD69' };
                                    if (a.includes('eliminó'))
                                        return { Icon: UserX,       bg: '#FFEBEE', color: '#EE4266' };
                                    if (a.includes('actualizó'))
                                        return { Icon: RefreshCw,   bg: '#FFFBEA', color: '#B8860B' };
                                    if (a.includes('creó') || a.includes('registró'))
                                        return { Icon: UserPlus,    bg: '#E8FBF3', color: '#0EAD69' };
                                    if (a.includes('pin') || a.includes('regeneró'))
                                        return { Icon: Key,         bg: '#EEF0FF', color: '#3F51B5' };
                                    if (a.includes('sesión'))
                                        return { Icon: Activity,    bg: '#F3E8FF', color: '#540D6E' };
                                    return { Icon: Activity,        bg: '#F3E8FF', color: '#540D6E' };
                                };

                                return (
                                    <div className="space-y-1 max-h-[310px] overflow-y-auto pr-1 custom-scrollbar">
                                        {recentActivities.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                                <Activity className="w-8 h-8 mb-2 opacity-30" />
                                                <p className="text-sm">Sin actividad reciente</p>
                                            </div>
                                        ) : recentActivities.map((activity, index) => {
                                            const { Icon, bg, color } = getActivityStyle(activity.action);
                                            return (
                                                <div
                                                    key={activity.id}
                                                    className="group flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-all duration-150 border border-transparent hover:border-gray-100"
                                                >
                                                    {/* Avatar de acción */}
                                                    <div className="relative flex-shrink-0 mt-0.5">
                                                        <div
                                                            className="w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200"
                                                            style={{ backgroundColor: bg }}
                                                        >
                                                            <Icon className="w-4 h-4" style={{ color }} />
                                                        </div>
                                                        {index < 3 && (
                                                            <span
                                                                className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-2 animate-pulse"
                                                                style={{ backgroundColor: color, borderColor: color }}
                                                            />
                                                        )}
                                                    </div>

                                                    {/* Texto */}
                                                    <div className="flex-1 min-w-0">
                                                        {/* Fila superior: quién + qué */}
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            <span className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">
                                                                {activity.user}
                                                            </span>
                                                        </div>

                                                        {/* Fila inferior: sobre quién */}
                                                        {activity.target && activity.target !== '—' && (
                                                            <p className="text-xs text-gray-500 mt-0.5 truncate">
                                                                <span className="font-medium text-gray-900">
                                                                    {activity.action}: 
                                                                </span>
                                                                <span className="font-medium text-gray-900">
                                                                    &nbsp;{activity.target}
                                                                </span>
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Tiempo */}
                                                    <span className="text-[11px] font-medium text-gray-400 whitespace-nowrap mt-0.5 flex-shrink-0">
                                                        {activity.time}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Indicadores de progreso y métricas adicionales */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Progreso general del sistema */}
                        <div className="bg-[#540D6E] rounded-xl shadow-sm p-6" style={{ backgroundColor: "#F3E8FF", borderLeft: "4px solid #540D6E", color: "#540D6E" }}>
                            <h3 className="text-lg font-bold mb-4">Progreso General</h3>
                            <div className="relative">
                                <div className="text-center">
                                    <p className="text-5xl font-bold mb-2">{dashboardStats.avgProgress}%</p>
                                    <p className="text-sm">del contenido completado</p>
                                </div>
                                <div className="mt-4 h-2 bg-purple-900 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-white rounded-full transition-all duration-500"
                                        style={{ width: `${dashboardStats.avgProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Usuarios por hora (pico de actividad) */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Horas Pico de Actividad</h3>
                            <div className="space-y-3">
                                {[
                                    { hour: '8:00 - 10:00', activity: 85, label: 'Mañana' },
                                    { hour: '10:00 - 12:00', activity: 92, label: 'Media mañana' },
                                    { hour: '14:00 - 16:00', activity: 78, label: 'Tarde' },
                                    { hour: '18:00 - 20:00', activity: 65, label: 'Noche' }
                                ].map((item, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">{item.hour}</span>
                                            <span className="text-gray-900 font-medium">{item.activity}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{ width: `${item.activity}%`, backgroundColor: '#540D6E' }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Rendimiento de OVAs */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Rendimiento de OVAs</h3>
                            <div className="space-y-4">
                                {[
                                    { name: 'Matemáticas', score: 88, color: '#540D6E' },
                                    { name: 'Ciencias', score: 76, color: '#EE4266' },
                                    { name: 'Historia', score: 92, color: '#FFD23F' },
                                    { name: 'Lenguaje', score: 84, color: '#0EAD69' }
                                ].map((item, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-700">{item.name}</span>
                                            <span className="text-gray-900 font-medium">{item.score}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{ width: `${item.score}%`, backgroundColor: item.color }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer del dashboard */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Activity className="w-4 h-4" />
                                <span>Sistema actualizado al día de hoy</span>
                            </div>
                            <div className="flex gap-6">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Total OVAs</p>
                                    <p className="text-lg font-bold" style={{ color: "#540D6E" }}>{dashboardStats.totalOVAs}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Cursos Activos</p>
                                    <p className="text-lg font-bold" style={{ color: "#0EAD69" }}>{dashboardStats.activeCourses}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Progreso Promedio</p>
                                    <p className="text-lg font-bold" style={{ color: "#EE4266" }}>{dashboardStats.avgProgress}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}