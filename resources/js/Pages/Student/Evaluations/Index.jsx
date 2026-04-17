import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import {
    ClipboardList, Search, X, ChevronLeft, ChevronRight,
    ChevronsLeft, ChevronsRight, TrendingUp, Award,
    BookOpen, RotateCcw, Calculator, BookMarked, 
    FlaskConical, Globe, Languages, Star, Trophy,
    Target, CheckCircle, AlertCircle
} from "lucide-react";
import AppSidebar, { useSidebarState } from "@/Components/AppSidebar";

// ─── Paleta de materias ───────────────────────────────────────────────────────
const MATERIAS = {
    'Matemáticas':      { icon: Calculator,   color: '#FFD23F', bg: '#FEF3C7', textColor: '#374151' },
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
        label: 'Excelente',
        gradient: 'from-emerald-500 to-green-500'
    };
    if (pct >= 80) return { 
        bg: '#E8F5F0', 
        color: '#0EAD69', 
        icon: Award,
        label: 'Muy Bueno',
        gradient: 'from-green-500 to-emerald-500'
    };
    if (pct >= 70) return { 
        bg: '#FEF3C7', 
        color: '#D97706', 
        icon: Star,
        label: 'Bueno',
        gradient: 'from-yellow-500 to-amber-500'
    };
    if (pct >= 60) return { 
        bg: '#FEF3C7', 
        color: '#D97706', 
        icon: Target,
        label: 'Regular',
        gradient: 'from-orange-500 to-amber-500'
    };
    return { 
        bg: '#FEE2E2', 
        color: '#EE4266', 
        icon: AlertCircle,
        label: 'Insuficiente',
        gradient: 'from-red-500 to-rose-500'
    };
}

// ─── Componente CalificacionBadge ─────────────────────────────────────────────
function CalificacionBadge({ percentage }) {
    const style = getScoreStyle(percentage);
    const IconComponent = style.icon;
    
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ backgroundColor: style.bg }}>
                <IconComponent className="w-3.5 h-3.5" style={{ color: style.color }} />
                <span className="text-xs font-bold" style={{ color: style.color }}>
                    {percentage}%
                </span>
            </div>
        </div>
    );
}

// ─── Componente ProgressBar ───────────────────────────────────────────────────
function ProgressBar({ percentage }) {
    const style = getScoreStyle(percentage);
    
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[120px]">
                <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                        width: `${percentage}%`,
                        background: `linear-gradient(to right, ${style.color}, ${style.color}dd)`
                    }}
                />
            </div>
            <span className="text-xs font-bold" style={{ color: style.color }}>
                {percentage}%
            </span>
        </div>
    );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function StudentEvaluations({ evaluations = [] }) {
    const [collapsed] = useSidebarState();
    const [search, setSearch] = useState("");
    const [filterArea, setFilterArea] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

            <main className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-20" : "lg:ml-72"} min-h-screen bg-gray-50`}>
                <div className="py-8 px-4 sm:px-6 lg:px-8">
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
                        <div className="mb-8 flex items-start gap-4">
                            <div className="p-4 rounded-xl shadow-sm border bg-white" style={{ borderColor: "#540D6E" }}>
                                <ClipboardList className="w-10 h-10" style={{ color: "#540D6E" }} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                                    Mis Evaluaciones
                                </h1>
                                <p className="text-gray-500 text-sm">
                                    Historial de todas las evaluaciones completadas
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            {statsConfig.map(({ label, value, icon: Icon, color, bg }) => (
                                <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-lg" style={{ backgroundColor: bg }}>
                                            <Icon className="w-5 h-5" style={{ color }} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</p>
                                            <p className="text-xl font-black" style={{ color }}>{value}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Filtros */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Búsqueda */}
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por OVA..."
                                        value={search}
                                        onChange={e => {
                                            setSearch(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none transition-all"
                                        onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                        onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"}
                                    />
                                    {search && (
                                        <button onClick={() => { setSearch(""); setCurrentPage(1); }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Filtro por área */}
                                <select
                                    value={filterArea}
                                    onChange={e => {
                                        setFilterArea(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none bg-white min-w-[200px]"
                                    onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                    onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"}
                                >
                                    <option value="">Todas las áreas</option>
                                    {areasUnicas.map(area => (
                                        <option key={area} value={area}>{area}</option>
                                    ))}
                                </select>

                                {/* Limpiar */}
                                {hasFilters && (
                                    <button onClick={clearFilters}
                                        className="px-4 py-2.5 text-sm font-semibold border-2 border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-gray-600 transition-all">
                                        <RotateCcw className="w-4 h-4" /> Limpiar
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Tabla mejorada */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {paginatedEvaluations.length > 0 ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Recurso Educativo</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Evaluación</th>
                                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wide">Puntaje</th>
                                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wide">Calificación</th>
                                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wide">Intento</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Fecha</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {paginatedEvaluations.map((ev) => {
                                                    const pct = ev.percentage ?? (ev.total > 0 ? Math.round((ev.score / ev.total) * 100) : 0);
                                                    const scoreStyle = getScoreStyle(pct);
                                                    const area = ev.ova?.area ?? '';
                                                    const materia = MATERIAS[area];
                                                    const AreaIcon = materia?.icon ?? BookOpen;

                                                    return (
                                                        <tr key={ev.id} className="hover:bg-gray-50 transition-colors group">
                                                            {/* OVA */}
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="relative">
                                                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105"
                                                                            style={{ 
                                                                                background: `linear-gradient(135deg, ${materia?.color ?? '#6B7280'}20, ${materia?.color ?? '#6B7280'}10)`,
                                                                                border: `1.5px solid ${materia?.color ?? '#E5E7EB'}30`
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

                                                            {/* Evaluación */}
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-4">
                                                                        <p className="text-xs text-gray-400 font-mono">
                                                                            {ev.evaluation_key}
                                                                        </p>
                                                                </div>
                                                            </td>

                                                            {/* Puntaje */}
                                                            <td className="px-6 py-4 text-center">
                                                                <div className="inline-flex flex-col items-center gap-1">
                                                                    <div className="flex items-baseline gap-1">
                                                                        <span className="text-2xl font-black" style={{ color: scoreStyle.color }}>
                                                                            {ev.score}
                                                                        </span>
                                                                        <span className="text-sm text-gray-400">/ {ev.total}</span>
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

                                                            {/* Calificación */}
                                                            <td className="px-6 py-4 text-center">
                                                                <div className="inline-flex flex-col items-center gap-1">
                                                                    <CalificacionBadge percentage={pct} />
                                                                    <span className="text-xs font-medium" style={{ color: scoreStyle.color }}>
                                                                        {scoreStyle.label}
                                                                    </span>
                                                                </div>
                                                            </td>

                                                            {/* Intento */}
                                                            <td className="px-6 py-4 text-center">
                                                                <div className="inline-flex flex-col items-center gap-1">
                                                                    <div className="flex items-center gap-1">
                                                                        {[...Array(3)].map((_, i) => (
                                                                            <div key={i}
                                                                                className={`w-2.5 h-2.5 rounded-full transition-all ${
                                                                                    i < ev.attempt 
                                                                                        ? '' 
                                                                                        : 'bg-gray-200'
                                                                                }`}
                                                                                style={i < ev.attempt ? { 
                                                                                    backgroundColor: ev.attempt >= 3 ? '#EE4266' : '#D97706'
                                                                                } : {}}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                    <span className="text-xs font-bold"
                                                                        style={{ color: ev.attempt >= 3 ? '#EE4266' : '#D97706' }}>
                                                                        Intento {ev.attempt}/3
                                                                    </span>
                                                                </div>
                                                            </td>

                                                            {/* Fecha */}
                                                            <td className="px-6 py-4">
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

                                    {/* Paginación */}
                                    {totalPages > 1 && (
                                        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
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
                                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                        style={{ background: "linear-gradient(135deg,#540D6E10,#EE426610)" }}>
                                        <ClipboardList className="w-10 h-10" style={{ color: "#540D6E40" }} />
                                    </div>
                                    <p className="text-base font-bold text-gray-700 mb-1">
                                        {hasFilters ? "No hay resultados para esta búsqueda" : "No hay evaluaciones aún"}
                                    </p>
                                    <p className="text-sm text-gray-400 mb-4">
                                        {hasFilters 
                                            ? "Intenta con otros filtros" 
                                            : "Completa las evaluaciones de tus OVAs y aparecerán aquí"}
                                    </p>
                                    {hasFilters && (
                                        <button onClick={clearFilters}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border-2 border-gray-200 hover:bg-gray-50 text-gray-600">
                                            <RotateCcw className="w-4 h-4" /> Limpiar filtros
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>

            {/* Fondo */}
            <div className="fixed inset-0 -z-10 bg-gray-50">
                <div className="absolute inset-0" style={{
                    backgroundImage: "radial-gradient(circle at 1px 1px,rgba(84,13,110,0.04) 1px,transparent 0)",
                    backgroundSize: "32px 32px"
                }} />
                <div className="absolute top-0 left-0 w-full h-1" style={{
                    background: "linear-gradient(to right,#540D6E,#EE4266,#FFD23F,#3BCEAC,#0EAD69)"
                }} />
            </div>
        </>
    );
}