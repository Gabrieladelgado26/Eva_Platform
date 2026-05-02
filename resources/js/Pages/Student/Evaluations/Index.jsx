import { Head, Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    ClipboardList, Search, X, ChevronLeft, ChevronRight,
    ChevronsLeft, ChevronsRight, TrendingUp, Award,
    BookOpen, RotateCcw, Calculator, BookMarked, 
    FlaskConical, Globe, Languages, Star, Trophy,
    Target, CheckCircle, AlertCircle, Sparkles, Compass, ChevronDown,
    Smile, Frown, Meh
} from "lucide-react";
import AppSidebar, { useSidebarState } from "@/Components/AppSidebar";

// ─── Paleta de materias ───────────────────────────────────────────────────────
const MATERIAS = {
    'Matemáticas':      { icon: Calculator,   color: '#D97706', bg: '#FEF3C7', textColor: '#374151' },
    'Español':          { icon: BookMarked,   color: '#540D6E', bg: '#F3E8FF', textColor: '#FFFFFF' },
    'Ciencias Naturales': { icon: FlaskConical, color: '#0EAD69', bg: '#E8F5F0', textColor: '#FFFFFF' },
    'Ciencias Sociales':  { icon: Globe,        color: '#EE4266', bg: '#FEE2E2', textColor: '#FFFFFF' },
    'Inglés':           { icon: Languages,    color: '#3BCEAC', bg: '#E8F5F0', textColor: '#FFFFFF' },
};

// ─── Funciones helper ─────────────────────────────────────────────────────────
function getScoreStyle(pct) {
    if (pct >= 90) return { 
        bg: '#E8F5F0', 
        color: '#0EAD69', 
        icon: Trophy,
        stickerIcon: Smile,
        stickerColor: '#0EAD69',
        label: '¡Eres increíble!'
    };
    if (pct >= 80) return { 
        bg: '#E8F5F0', 
        color: '#0EAD69', 
        icon: Award,
        stickerIcon: Smile,
        stickerColor: '#0EAD69',
        label: '¡Casi perfecto!'
    };
    if (pct >= 70) return { 
        bg: '#FEF3C7', 
        color: '#D97706', 
        icon: Star,
        stickerIcon: Meh,
        stickerColor: '#D97706',
        label: '¡Vas muy bien!'
    };
    if (pct >= 60) return { 
        bg: '#FEF3C7', 
        color: '#D97706', 
        icon: Target,
        stickerIcon: Meh,
        stickerColor: '#D97706',
        label: '¡Sigue adelante!'
    };
    return { 
        bg: '#FEE2E2', 
        color: '#EE4266', 
        icon: AlertCircle,
        stickerIcon: Frown,
        stickerColor: '#EE4266',
        label: '¡Puedes mejorar!'
    };
}

// ─── Componente CalificacionBadge ─────────────────────────────────────────────
function CalificacionBadge({ percentage }) {
    const style = getScoreStyle(percentage);
    const IconComponent = style.icon;
    
    return (
        <div className="flex flex-col items-center gap-2">
            {/* Badge con porcentaje e icono */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ backgroundColor: style.bg }}>
                <IconComponent className="w-3.5 h-3.5" style={{ color: style.color }} />
                <span className="text-xs font-bold" style={{ color: style.color }}>
                    {percentage}%
                </span>
            </div>
            {/* Mensaje motivacional resaltado */}
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-300 hover:scale-105"
                style={{ 
                    backgroundColor: `${style.color}15`,
                    color: style.color,
                    border: `1px solid ${style.color}30`
                }}>
                {style.label}
            </span>
        </div>
    );
}

// ─── Componente Sticker ───────────────────────────────────────────────────────
function Sticker({ percentage }) {
    const style = getScoreStyle(percentage);
    const StickerIcon = style.stickerIcon;
    
    return (
        <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110"
                style={{ backgroundColor: style.bg }}>
                <StickerIcon className="w-7 h-7" style={{ color: style.stickerColor }} />
            </div>
        </div>
    );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function StudentEvaluations({ evaluations = [] }) {
    const [collapsed] = useSidebarState();
    const [search, setSearch] = useState("");
    const [filterArea, setFilterArea] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [visible, setVisible] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    // Calcular datos filtrados
    const filteredEvaluations = evaluations.filter(ev => {
        const matchesSearch = search === "" || 
            (ev.ova?.tematica?.toLowerCase().includes(search.toLowerCase()) ||
             ev.evaluation_key?.toLowerCase().includes(search.toLowerCase()));
        const matchesArea = filterArea === "" || ev.ova?.area === filterArea;
        return matchesSearch && matchesArea;
    });

    // Paginación
    const totalPages = Math.ceil(filteredEvaluations.length / itemsPerPage);
    const paginatedEvaluations = filteredEvaluations.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    
    const from = filteredEvaluations.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const to = Math.min(currentPage * itemsPerPage, filteredEvaluations.length);

    // Estadísticas basadas en TODAS las evaluaciones (sin filtrar)
    const avgPct = evaluations.length > 0
        ? Math.round(evaluations.reduce((sum, e) => sum + (e.percentage ?? 0), 0) / evaluations.length)
        : 0;

    const best = evaluations.length > 0
        ? Math.max(...evaluations.map(e => e.percentage ?? 0))
        : 0;

    const hasFilters = search !== "" || filterArea !== "";

    const clearFilters = () => {
        setSearch("");
        setFilterArea("");
        setCurrentPage(1);
    };

    // Obtener áreas únicas para el filtro
    const areasUnicas = [...new Set(evaluations.map(ev => ev.ova?.area).filter(Boolean))];

    // Configuración de stats
    const statsConfig = [
        { label: "Total Evaluaciones", value: evaluations.length, icon: ClipboardList, color: "#540D6E", bg: "#F3E8FF" },
        { label: "Promedio General", value: `${avgPct}%`, icon: TrendingUp, color: "#0EAD69", bg: "#E8F5F0" },
        { label: "Mejor Puntaje", value: `${best}%`, icon: Award, color: "#FFD23F", bg: "#FEF3C7" },
    ];

    const buildPageNumbers = () => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        const pages = [];
        pages.push(1);
        if (currentPage > 3) pages.push(null);
        for (
            let p = Math.max(2, currentPage - 1);
            p <= Math.min(totalPages - 1, currentPage + 1);
            p++
        ) {
            pages.push(p);
        }
        if (currentPage < totalPages - 2) pages.push(null);
        pages.push(totalPages);
        return pages;
    };

    const pageNumbers = buildPageNumbers();

    return (
        <>
            <Head title="Mis Evaluaciones" />
            <AppSidebar currentRoute="student.evaluations.index" />

            <main className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-20" : "lg:ml-72"} min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden`}>
                
                {/* Figuras decorativas de fondo */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full border-8 border-purple-200/20 animate-float-slow" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full border-8 border-purple-200/15 animate-float-medium" />
                    <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full border-4 border-purple-200/15 animate-float-fast" />
                    <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full border-4 border-purple-200/10 animate-float-slow" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border-4 border-purple-100/8 animate-pulse-slow" />
                    
                    {/* Burbujas decorativas */}
                    <div className="absolute top-[15%] left-[8%] w-6 h-6 rounded-full bg-purple-200/20 animate-bubble-slow" />
                    <div className="absolute top-[30%] right-[12%] w-5 h-5 rounded-full bg-purple-200/15 animate-bubble-medium" style={{ animationDelay: '1s' }} />
                    <div className="absolute bottom-[25%] left-[15%] w-7 h-7 rounded-full bg-purple-200/20 animate-bubble-slow" style={{ animationDelay: '2s' }} />
                    <div className="absolute bottom-[40%] right-[20%] w-4 h-4 rounded-full bg-purple-200/15 animate-bubble-fast" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute top-[60%] left-[25%] w-5 h-5 rounded-full bg-purple-200/18 animate-bubble-medium" style={{ animationDelay: '3s' }} />
                    <div className="absolute top-[20%] right-[30%] w-6 h-6 rounded-full bg-purple-200/15 animate-bubble-slow" style={{ animationDelay: '1.5s' }} />
                </div>
                
                <div className="py-8 px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-7xl mx-auto">

                        {/* Breadcrumb */}
                        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                            <Link href={route("dashboard")} className="hover:text-purple-600 transition-colors">
                                Panel de Control
                            </Link>
                            <span>/</span>
                            <span style={{ color: "#540D6E" }} className="font-medium">Mis Evaluaciones</span>
                        </div>

                        {/* Header */}
                        <div className="mb-8 relative">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                                <div className="flex items-start gap-4">
                                    <div className="p-4 rounded-2xl shadow-lg border bg-white/80 backdrop-blur-sm" style={{ borderColor: "#540D6E" }}>
                                        <Compass className="w-9 h-9" style={{ color: "#540D6E" }} />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                            Mis Evaluaciones
                                        </h1>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <span>Historial de todas las evaluaciones completadas</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                            {statsConfig.map(({ label, value, icon: Icon, color, bg }, i) => (
                                <div 
                                    key={label} 
                                    className={`rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group ${
                                        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                    }`}
                                    style={{ 
                                        transitionDelay: `${i * 100}ms`,
                                        backgroundColor: `${color}10`,
                                        borderLeft: `3px solid ${color}`,
                                        borderRight: `1px solid ${color}15`,
                                        borderTop: `1px solid ${color}15`,
                                        borderBottom: `1px solid ${color}15`
                                    }}
                                >
                                    <div className="p-5">
                                        <div className="flex items-center justify-center gap-4">
                                            <div className="p-3 rounded-xl transition-all duration-300 group-hover:scale-105 flex-shrink-0"
                                                style={{ backgroundColor: `${color}15` }}>
                                                <Icon className="w-9 h-9" style={{ color }} />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <p className="text-3xl font-black leading-tight" style={{ color, fontFamily: "'Chewy', cursive" }}>
                                                    {value}
                                                </p>
                                                <p className="text-xs font-medium text-gray-500 mt-1">
                                                    {label}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Filtros con borde morado */}
                        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border-2 mb-6 p-6 transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Búsqueda */}
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por OVA..."
                                        value={search}
                                        onChange={e => {
                                            setSearch(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-full pl-12 pr-10 py-3 bg-white border-2 rounded-xl focus:ring-2 focus:ring-offset-2 outline-none transition-all"
                                        style={{ borderColor: "#E5E7EB", "--tw-ring-color": "rgba(84, 13, 110, 0.2)" }}
                                        onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                        onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
                                    />
                                    {search && (
                                        <button onClick={() => { setSearch(""); setCurrentPage(1); }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Filtro por área */}
                                <div className="relative w-64">
                                    <select
                                        value={filterArea}
                                        onChange={e => {
                                            setFilterArea(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-full px-4 pr-10 py-3 bg-white border-2 rounded-xl text-gray-700 focus:ring-2 focus:ring-offset-2 outline-none transition-all appearance-none"
                                        style={{ borderColor: "#E5E7EB", "--tw-ring-color": "rgba(84, 13, 110, 0.2)" }}
                                        onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                        onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
                                    >
                                        <option value="">Todas las áreas</option>
                                        {areasUnicas.map(area => (
                                            <option key={area} value={area}>{area}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>

                                {/* Limpiar */}
                                {hasFilters && (
                                    <button onClick={clearFilters}
                                        className="group relative w-12 h-12 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 backdrop-blur-sm"
                                        style={{ 
                                            background: "rgba(84, 13, 110, 0.12)",
                                            border: "1.5px solid rgba(84, 13, 110, 0.25)",
                                            backdropFilter: "blur(4px)",
                                            color: "#540D6E"
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = "rgba(84, 13, 110, 0.25)"
                                            e.currentTarget.style.borderColor = "rgba(84, 13, 110, 0.5)"
                                            e.currentTarget.style.transform = "scale(1.05)"
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = "rgba(84, 13, 110, 0.12)"
                                            e.currentTarget.style.borderColor = "rgba(84, 13, 110, 0.25)"
                                            e.currentTarget.style.transform = "scale(1)"
                                        }}>
                                        <RotateCcw className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Tabla mejorada con columna Sticker */}
                        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-200 transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
                            {paginatedEvaluations.length > 0 ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50/80 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Recurso Educativo</th>
                                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wide">Sticker</th>
                                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wide">Calificación</th>
                                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wide">Puntaje</th>
                                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wide">Intento</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Fecha</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {paginatedEvaluations.map((ev, idx) => {
                                                    const pct = ev.percentage ?? (ev.total > 0 ? Math.round((ev.score / ev.total) * 100) : 0);
                                                    const scoreStyle = getScoreStyle(pct);
                                                    const area = ev.ova?.area ?? '';
                                                    const materia = MATERIAS[area];
                                                    const AreaIcon = materia?.icon ?? BookOpen;

                                                    return (
                                                        <tr key={ev.id} className="hover:bg-gray-50/50 transition-colors group" style={{ animation: `fadeUp 0.4s ease-out ${idx * 50}ms both` }}>
                                                            {/* OVA */}
                                                            <td className="px-6 py-3">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="relative">
                                                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105"
                                                                            style={{ 
                                                                                background: `linear-gradient(135deg, ${materia?.color ?? '#6B7280'}15, ${materia?.color ?? '#6B7280'}08)`,
                                                                                border: `1px solid ${materia?.color ?? '#E5E7EB'}30`
                                                                            }}>
                                                                            <AreaIcon className="w-6 h-6" style={{ color: materia?.color ?? '#6B7280' }} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                                                                                style={{ 
                                                                                    backgroundColor: materia?.bg ?? '#F3F4F6', 
                                                                                    color: materia?.color ?? '#6B7280'
                                                                                }}>
                                                                                {area}
                                                                            </span>
                                                                        </div>
                                                                        <p className="font-bold text-gray-900 text-sm mb-0.5 truncate">
                                                                            {ev.ova?.tematica ?? 'OVA'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            {/* Sticker - Nueva columna */}
                                                            <td className="px-6 py-3 text-center">
                                                                <Sticker percentage={pct} />
                                                            </td>

                                                            {/* Calificación */}
                                                            <td className="px-6 py-4 text-center">
                                                                <div className="inline-flex flex-col items-center gap-1">
                                                                    <div className="flex items-baseline gap-1">
                                                                        <span className="text-3xl font-black" style={{ color: scoreStyle.color, fontFamily: "'Chewy', cursive" }}>
                                                                            {ev.score}
                                                                        </span>
                                                                        <span className="text-xl text-gray-400" style={{ fontFamily: "'Chewy', cursive" }}>/ {ev.total}</span>
                                                                    </div>
                                                                    <div className="w-24">
                                                                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                                            <div 
                                                                                className="h-full rounded-full transition-all duration-500"
                                                                                style={{ 
                                                                                    width: `${pct}%`,
                                                                                    backgroundColor: scoreStyle.color
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            {/* Puntaje */}
                                                            <td className="px-6 py-3 text-center">
                                                                <CalificacionBadge percentage={pct} />
                                                            </td>

                                                            {/* Intentos */}
                                                            <td className="px-6 py-3 text-center">
                                                                <div className="inline-flex flex-col items-center gap-3">
                                                                    <div className="flex items-center gap-2">
                                                                        {[...Array(3)].map((_, i) => (
                                                                            <div key={i}
                                                                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                                                                    i < ev.attempt 
                                                                                        ? 'shadow-md scale-110' 
                                                                                        : 'bg-gray-200'
                                                                                }`}
                                                                                style={i < ev.attempt ? { 
                                                                                    backgroundColor: ev.attempt >= 3 ? '#EE4266' : '#D97706',
                                                                                    boxShadow: `0 0 6px ${ev.attempt >= 3 ? '#EE4266' : '#D97706'}50`
                                                                                } : {}}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                                                                        style={{ 
                                                                            backgroundColor: ev.attempt >= 3 ? '#FEE2E2' : '#FEF3C7',
                                                                            color: ev.attempt >= 3 ? '#DC2626' : '#B45309',
                                                                        }}>
                                                                        Intento {ev.attempt}/3
                                                                    </span>
                                                                </div>
                                                            </td>

                                                            {/* Fecha */}
                                                            <td className="px-6 py-3">
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-medium text-gray-700">
                                                                        {ev.created_at?.split(' ')[0]}
                                                                    </span>
                                                                    <span className="text-xs text-gray-400">
                                                                        {ev.created_at?.split(' ')[1]}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Paginación mejorada */}
                                    {totalPages > 1 && (
                                        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
                                            <p className="text-sm text-gray-600 order-2 sm:order-1">
                                                Mostrando{" "}
                                                <span className="font-bold text-gray-900">{from}</span>
                                                {" "}–{" "}
                                                <span className="font-bold text-gray-900">{to}</span>
                                                {" "}de{" "}
                                                <span className="font-bold" style={{ color: "#540D6E" }}>{filteredEvaluations.length}</span>
                                                {" "}evaluaciones
                                            </p>

                                            <div className="flex items-center gap-1 order-1 sm:order-2">
                                                <button
                                                    onClick={() => setCurrentPage(1)}
                                                    disabled={currentPage === 1}
                                                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                                    title="Primera página">
                                                    <ChevronsLeft className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setCurrentPage(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                                    title="Página anterior">
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                                {pageNumbers.map((page, idx) =>
                                                    page === null ? (
                                                        <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 select-none">…</span>
                                                    ) : (
                                                        <button
                                                            key={page}
                                                            onClick={() => setCurrentPage(page)}
                                                            className="min-w-[36px] h-9 px-2 rounded-lg border text-sm font-semibold transition-all"
                                                            style={
                                                                page === currentPage
                                                                    ? { backgroundColor: "#540D6E", borderColor: "#540D6E", color: "#fff" }
                                                                    : { backgroundColor: "#fff", borderColor: "#E5E7EB", color: "#374151" }
                                                            }
                                                            onMouseEnter={e => {
                                                                if (page !== currentPage) e.currentTarget.style.backgroundColor = "#F3E8FF";
                                                            }}
                                                            onMouseLeave={e => {
                                                                if (page !== currentPage) e.currentTarget.style.backgroundColor = "#fff";
                                                            }}>
                                                            {page}
                                                        </button>
                                                    )
                                                )}
                                                <button
                                                    onClick={() => setCurrentPage(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                                    title="Página siguiente">
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setCurrentPage(totalPages)}
                                                    disabled={currentPage === totalPages}
                                                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                                    title="Última página">
                                                    <ChevronsRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="py-16 text-center">
                                    <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                                        style={{ background: "linear-gradient(135deg, #540D6E10, #EE426610)" }}>
                                        <ClipboardList className="w-12 h-12" style={{ color: "#540D6E40" }} />
                                    </div>
                                    <p className="text-xl font-bold text-gray-700 mb-2">
                                        {hasFilters ? "No hay resultados para esta búsqueda" : "No hay evaluaciones aún"}
                                    </p>
                                    <p className="text-sm text-gray-400 mb-6">
                                        {hasFilters 
                                            ? "Intenta con otros filtros" 
                                            : "Completa las evaluaciones de tus OVAs y aparecerán aquí"}
                                    </p>
                                    {hasFilters && (
                                        <button onClick={clearFilters}
                                            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all text-gray-700">
                                            <RotateCcw className="w-4 h-4" /> Limpiar filtros
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Chewy&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
                
                body {
                    font-family: 'Quicksand', sans-serif;
                }
                
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes float-slow {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(20px, -25px) rotate(5deg); }
                    50% { transform: translate(-10px, -35px) rotate(-3deg); }
                    75% { transform: translate(-25px, -20px) rotate(8deg); }
                }
                
                @keyframes float-medium {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(-20px, -30px) rotate(-6deg); }
                    66% { transform: translate(25px, -20px) rotate(4deg); }
                }
                
                @keyframes float-fast {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(30px, -25px) rotate(10deg); }
                }
                
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.06; transform: scale(1); }
                    50% { opacity: 0.12; transform: scale(1.05); }
                }
                
                @keyframes bubble-slow {
                    0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
                    20% { opacity: 0.4; }
                    80% { opacity: 0.2; }
                    100% { transform: translateY(-100px) translateX(30px) scale(1.2); opacity: 0; }
                }
                
                @keyframes bubble-medium {
                    0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
                    20% { opacity: 0.35; }
                    80% { opacity: 0.15; }
                    100% { transform: translateY(-120px) translateX(40px) scale(1.3); opacity: 0; }
                }
                
                @keyframes bubble-fast {
                    0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
                    20% { opacity: 0.3; }
                    80% { opacity: 0.1; }
                    100% { transform: translateY(-80px) translateX(20px) scale(1.1); opacity: 0; }
                }
                
                .animate-float-slow { animation: float-slow 18s ease-in-out infinite; }
                .animate-float-medium { animation: float-medium 12s ease-in-out infinite; }
                .animate-float-fast { animation: float-fast 8s ease-in-out infinite; }
                .animate-pulse-slow { animation: pulse-slow 10s ease-in-out infinite; }
                .animate-bubble-slow { animation: bubble-slow 8s ease-in-out infinite; }
                .animate-bubble-medium { animation: bubble-medium 6s ease-in-out infinite; }
                .animate-bubble-fast { animation: bubble-fast 4s ease-in-out infinite; }
            `}</style>
        </>
    );
}