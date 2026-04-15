// Resources/js/Pages/Admin/Dashboard.jsx
import { Head, Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AppSidebar, { useSidebarState } from '@/Components/AppSidebar';
import {
    Users, UserCheck, UserX, GraduationCap, BookOpen, TrendingUp, TrendingDown,
    Calendar, ChevronLeft, ChevronRight, Download, RefreshCw, Eye, EyeOff,
    Menu, X, ChevronDown, Filter, Search, Bell, Settings, LogOut, Home,
    BarChart3, PieChart, LineChart, Activity, Zap, Target, Award, Clock, UserPlus
} from "lucide-react";

// Componentes de gráficas (instala: npm install recharts)
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart as ReLineChart, Line, PieChart as RePieChart, Pie, Cell, AreaChart, Area,
    RadialBarChart, RadialBar, ComposedChart, Scatter
} from 'recharts';

export default function Dashboard() {
    const { props } = usePage();
    const { auth, stats, recentUsers, activityLogs, userGrowth, roleDistribution, monthlyActivity } = props;
    const user = auth?.user ?? { name: "Usuario", role: { name: "Administrador" } };
    
    const [collapsed] = useSidebarState();
    const [dateRange, setDateRange] = useState("month");
    const [showNotifications, setShowNotifications] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Datos de ejemplo (deberías reemplazar con datos reales del backend)
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

    const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, bgColor, subtitle }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
                    {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
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
                            <span className="text-xs text-gray-500">vs mes anterior</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${bgColor} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`w-6 h-6 ${color}`} />
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
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={refreshData}
                                        className={`p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-all ${refreshing ? 'animate-spin' : ''}`}
                                    >
                                        <RefreshCw className="w-5 h-5 text-gray-600" />
                                    </button>

                                    <div className="relative">
                                        <button 
                                            onClick={() => setShowNotifications(!showNotifications)}
                                            className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-all relative"
                                        >
                                            <Bell className="w-5 h-5 text-gray-600" />
                                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                                        </button>

                                        {showNotifications && (
                                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                                                <div className="p-4 border-b border-gray-200">
                                                    <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                                                </div>
                                                <div className="max-h-96 overflow-y-auto">
                                                    <div className="p-4 hover:bg-gray-50 cursor-pointer">
                                                        <p className="text-sm font-medium text-gray-900">Nuevo estudiante registrado</p>
                                                        <p className="text-xs text-gray-500 mt-1">Hace 10 minutos</p>
                                                    </div>
                                                    <div className="p-4 hover:bg-gray-50 cursor-pointer border-t border-gray-100">
                                                        <p className="text-sm font-medium text-gray-900">OVA actualizado</p>
                                                        <p className="text-xs text-gray-500 mt-1">Hace 1 hora</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-all">
                                        <Download className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Filtro de rango de fechas */}
                        <div className="mb-6 flex justify-end">
                            <div className="flex gap-2 bg-white rounded-lg border border-gray-200 p-1">
                                {['semana', 'mes', 'año'].map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setDateRange(range)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                            dateRange === range 
                                                ? 'text-white' 
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                        style={dateRange === range ? { backgroundColor: '#540D6E' } : {}}
                                    >
                                        {range.charAt(0).toUpperCase() + range.slice(1)}
                                    </button>
                                ))}
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
                            bgColor="bg-purple-50"
                            subtitle="Registrados en el sistema"
                        />
                        <StatCard 
                            title="Usuarios Activos" 
                            value={dashboardStats.activeUsers.toLocaleString()} 
                            icon={UserCheck}
                            trend="up"
                            trendValue="+8.2%"
                            color="text-green-600"
                            bgColor="bg-green-50"
                            subtitle="Con acceso habilitado"
                        />
                        <StatCard 
                            title="Usuarios Inactivos" 
                            value={dashboardStats.inactiveUsers.toLocaleString()} 
                            icon={UserX}
                            trend="down"
                            trendValue="-3.1%"
                            color="text-red-600"
                            bgColor="bg-red-50"
                            subtitle="Sin acceso"
                        />
                        <StatCard
                            title="Total Docentes"
                            value={dashboardStats.totalTeachers}
                            icon={BookOpen}
                            trend="up"
                            trendValue="+1 nuevo"
                            color="text-purple-900"
                            bgColor="bg-purple-90"
                            subtitle="Personal docente registrado"
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
                            bgColor="bg-blue-50"
                            subtitle="Recursos educativos"
                        />
                        <StatCard 
                            title="Actividades Completadas" 
                            value={dashboardStats.completedActivities.toLocaleString()} 
                            icon={Activity}
                            trend="up"
                            trendValue="+15.3%"
                            color="text-indigo-600"
                            bgColor="bg-indigo-50"
                            subtitle="Este mes"
                        />
                        <StatCard 
                            title="Progreso Promedio" 
                            value={`${dashboardStats.avgProgress}%`} 
                            icon={Target}
                            trend="up"
                            trendValue="+6.7%"
                            color="text-teal-600"
                            bgColor="bg-teal-50"
                            subtitle="Nivel de avance"
                        />
                        <StatCard 
                            title="Cursos Activos" 
                            value={dashboardStats.activeCourses} 
                            icon={Zap}
                            trend="up"
                            trendValue="+2 cursos"
                            color="text-yellow-400"
                            bgColor="bg-yellow-50"
                            subtitle="En este período"
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
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Actividades Recientes</h3>
                                    <p className="text-sm text-gray-500">Últimas acciones en el sistema</p>
                                </div>
                                <Clock className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="space-y-4 max-h-[300px] overflow-y-auto">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="text-2xl">{activity.icon}</div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                                            <p className="text-sm text-gray-600">
                                                {activity.action}: <span className="font-medium">{activity.target}</span>
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
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