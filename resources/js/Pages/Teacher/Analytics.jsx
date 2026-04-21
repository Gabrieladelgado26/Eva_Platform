import { Head, Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import AppSidebar, { useSidebarState } from '@/Components/AppSidebar';
import {
    BarChart3, Award, Clock, Target, Users, Zap, Activity,
    TrendingUp, TrendingDown, BookOpen, CheckCircle
} from "lucide-react";

import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer
} from 'recharts';

export default function Analytics() {
    const { props } = usePage();
    const { auth, stats, monthlyActivity, peakHours, ovaPerformanceByArea } = props;
    const user = auth?.user ?? { name: "Profesor", role: { name: "Docente" } };

    const [collapsed] = useSidebarState();

    const dashboardStats = stats || {
        totalCourses: 0,
        activeCourses: 0,
        totalStudents: 0,
        totalOVAs: 0,
        completedActivities: 0,
        avgScore: 0,
        avgProgress: 0,
    };

    const monthlyActivityData = monthlyActivity && monthlyActivity.length > 0
        ? monthlyActivity
        : [];

    const peakHoursData = peakHours && peakHours.length > 0
        ? peakHours
        : [];

    const ovaPerformanceData = ovaPerformanceByArea && ovaPerformanceByArea.length > 0
        ? ovaPerformanceByArea
        : [];

    const paletteColors = ['#540D6E', '#EE4266', '#0EAD69', '#3BCEAC', '#FFD23F'];
    
    // Verificar si hay datos reales
    const hasData = dashboardStats.totalCourses > 0 || dashboardStats.totalStudents > 0 || dashboardStats.completedActivities > 0;

    const StatCard = ({ title, value, icon: Icon, accentColor, subtitle }) => (
        <div
            className="rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 group"
            style={{
                backgroundColor: accentColor ? `${accentColor}08` : '#ffffff',
                border: '1px solid #E5E7EB',
                borderLeft: accentColor ? `4px solid ${accentColor}` : '4px solid #E5E7EB',
            }}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
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
            <Head title="Estadísticas - Docente" />

            <AppSidebar currentRoute="teacher.analytics" />

            <main className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-20" : "lg:ml-72"} min-h-screen bg-gray-50`}>
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Link href={route("dashboard")} className="hover:text-purple-600 transition-colors">Panel de Control</Link>
                            <span>/</span>
                            <Link href={route("teacher.dashboard")} className="hover:text-purple-600 transition-colors">Docente</Link>
                            <span>/</span>
                            <span style={{ color: "#540D6E" }} className="font-medium">Estadísticas</span>
                        </div>
                    </div>

                    <div className="max-w-8xl mx-auto">
                        {/* Header con bienvenida */}
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
                                            Estadísticas de tus cursos y evaluaciones -{" "}
                                            {new Date().toLocaleDateString("es-ES", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
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
                            subtitle="En este período"
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
                            title="Evaluaciones Completadas"
                            value={dashboardStats.completedActivities}
                            icon={CheckCircle}
                            accentColor="#FFD23F"
                            subtitle="Total de evaluaciones"
                        />
                        <StatCard
                            title="Promedio de Notas"
                            value={`${dashboardStats.avgScore}%`}
                            icon={Award}
                            accentColor="#540D6E"
                            subtitle="Promedio general"
                        />
                        <StatCard
                            title="Progreso General"
                            value={`${dashboardStats.avgProgress}%`}
                            icon={Target}
                            accentColor="#0EAD69"
                            subtitle="Nivel de avance"
                        />
                        <StatCard
                            title="Estado"
                            value={hasData ? "Activo" : "Sin datos"}
                            icon={Activity}
                            accentColor="#3BCEAC"
                            subtitle={hasData ? "Sistema funcionando" : "Crea un curso para comenzar"}
                        />
                    </div>

                    {/* Charts row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Monthly activity area chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Actividad Mensual</h3>
                                    <p className="text-sm text-gray-500">Evaluaciones completadas por mes</p>
                                </div>
                                <Activity className="w-5 h-5 text-gray-400" />
                            </div>
                            {monthlyActivityData.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                    <Activity className="w-8 h-8 mb-2 opacity-30" />
                                    <p className="text-sm">Sin datos de evaluaciones</p>
                                    <p className="text-xs mt-1">Los estudiantes aún no han completado evaluaciones</p>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={monthlyActivityData}>
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

                        {/* OVA performance by area bar chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Rendimiento por Área</h3>
                                    <p className="text-sm text-gray-500">Promedio de calificaciones</p>
                                </div>
                                <Award className="w-5 h-5 text-gray-400" />
                            </div>
                            {ovaPerformanceData.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                    <Target className="w-8 h-8 mb-2 opacity-30" />
                                    <p className="text-sm">Sin evaluaciones registradas</p>
                                    <p className="text-xs mt-1">Los estudiantes aún no han completado evaluaciones</p>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={ovaPerformanceData} layout="vertical" margin={{ left: 80 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                        <XAxis type="number" stroke="#6B7280" domain={[0, 100]} />
                                        <YAxis type="category" dataKey="area" stroke="#6B7280" width={100} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="avg" fill="#540D6E" name="Promedio %" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Bottom row: 3 cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Progreso General */}
                        <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: "#F3E8FF", borderLeft: "4px solid #540D6E" }}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold" style={{ color: "#540D6E" }}>Progreso General</h3>
                                <Target className="w-5 h-5" style={{ color: "#540D6E", opacity: 0.6 }} />
                            </div>
                            <div className="text-center">
                                <p className="text-5xl font-bold mb-1" style={{ color: "#540D6E" }}>{dashboardStats.avgProgress}%</p>
                                <p className="text-sm" style={{ color: "#540D6E", opacity: 0.8 }}>
                                    {dashboardStats.completedActivities} evaluaciones completadas
                                </p>
                                {dashboardStats.totalStudents > 0 && dashboardStats.totalOVAs > 0 && (
                                    <p className="text-xs mt-1" style={{ color: "#540D6E", opacity: 0.6 }}>
                                        de {dashboardStats.totalStudents} estudiantes × {dashboardStats.totalOVAs} OVAs
                                    </p>
                                )}
                            </div>
                            <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#540D6E30' }}>
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{ width: `${Math.min(dashboardStats.avgProgress, 100)}%`, backgroundColor: '#540D6E' }}
                                />
                            </div>
                        </div>

                        {/* Horas Pico */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Horas Pico</h3>
                                <Clock className="w-5 h-5 text-gray-400" />
                            </div>
                            {peakHoursData.length === 0 || peakHoursData.every(h => h.count === 0) ? (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                    <Clock className="w-8 h-8 mb-2 opacity-30" />
                                    <p className="text-sm">Sin datos disponibles</p>
                                    <p className="text-xs mt-1">Los estudiantes aún no han realizado evaluaciones</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {peakHoursData.map((item, idx) => {
                                        const blockColors = {
                                            'Madrugada': '#3BCEAC',
                                            'Mañana': '#FFD23F',
                                            'Tarde': '#0EAD69',
                                            'Noche': '#540D6E',
                                        };
                                        const blockColor = blockColors[item.label] || paletteColors[idx % paletteColors.length];

                                        return (
                                            <div key={idx}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-700 font-medium">{item.label}</span>
                                                    <span className="text-gray-900 font-semibold">
                                                        {item.count} eval. · {item.pct}%
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-500"
                                                        style={{ width: `${item.pct}%`, backgroundColor: blockColor }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Rendimiento por Área (list) */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Rendimiento por Área</h3>
                                <Award className="w-5 h-5 text-gray-400" />
                            </div>
                            {ovaPerformanceData.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                    <Target className="w-8 h-8 mb-2 opacity-30" />
                                    <p className="text-sm">Sin evaluaciones</p>
                                    <p className="text-xs mt-1">Los estudiantes aún no han completado evaluaciones</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                                    {ovaPerformanceData.map((item, idx) => {
                                        const barColor = paletteColors[idx % paletteColors.length];
                                        return (
                                            <div key={idx}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-700 font-medium truncate max-w-[130px]">{item.area}</span>
                                                    <span className="text-gray-900 font-semibold ml-2">
                                                        {item.avg}%
                                                        <span className="text-xs text-gray-400 font-normal ml-1">({item.count})</span>
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-500"
                                                        style={{ width: `${item.avg}%`, backgroundColor: barColor }}
                                                    />
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
                                <span>Sistema actualizado al día de hoy</span>
                            </div>
                            <div className="flex gap-6">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Cursos</p>
                                    <p className="text-lg font-bold" style={{ color: "#540D6E" }}>{dashboardStats.totalCourses}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Estudiantes</p>
                                    <p className="text-lg font-bold" style={{ color: "#0EAD69" }}>{dashboardStats.totalStudents}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Progreso</p>
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