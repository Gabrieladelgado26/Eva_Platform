import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import {
    ClipboardList, Search, X, ChevronLeft, ChevronRight,
    ChevronsLeft, ChevronsRight, TrendingUp, Users,
    BookOpen, RotateCcw, UserCog
} from "lucide-react";
import AppSidebar, { useSidebarState } from "@/Components/AppSidebar";

const GRADE_LABELS = {
    primero: "Primero", segundo: "Segundo", tercero: "Tercero",
    cuarto: "Cuarto", quinto: "Quinto",
};

// ── Badge de porcentaje ───────────────────────────────────────────────────────
function ScoreBadge({ percentage }) {
    const color = percentage >= 80 ? "#0EAD69" : percentage >= 60 ? "#D97706" : "#EE4266";
    const bg = percentage >= 80 ? "#E8F5F0" : percentage >= 60 ? "#FEF3C7" : "#FEE2E2";

    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ backgroundColor: bg, color }}>
            {percentage}%
        </span>
    );
}

// ── Avatar del estudiante ─────────────────────────────────────────────────────
function StudentAvatar({ student }) {
    if (student.avatar) {
        return (
            <img src={`/avatars/${student.avatar}.png`} alt={student.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                onError={e => { e.currentTarget.style.display = 'none'; }}
            />
        );
    }
    return (
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #540D6E, #EE4266)" }}>
            {student.name?.charAt(0)?.toUpperCase() ?? 'E'}
        </div>
    );
}

export default function EvaluationsIndex({ evaluations, courses = [], teachers = [], stats = {}, filters = {}, userRole }) {
    const [collapsed] = useSidebarState();
    const [search, setSearch] = useState(filters.search ?? "");
    const [courseId, setCourseId] = useState(filters.course_id ?? "");
    const [teacherId, setTeacherId] = useState(filters.teacher_id ?? "");

    const data = evaluations?.data ?? [];
    const lastPage = evaluations?.last_page ?? 1;
    const currPage = evaluations?.current_page ?? 1;
    const from = evaluations?.from ?? 0;
    const to = evaluations?.to ?? 0;
    const total = evaluations?.total ?? 0;
    const links = evaluations?.links ?? [];

    const isAdmin = userRole === 'admin';
    const routePrefix = isAdmin ? 'admin' : 'teacher';

    const applyFilters = (overrides = {}) => {
        const params = { search, course_id: courseId };
        if (isAdmin && teacherId) params.teacher_id = teacherId;
        
        router.get(
            route(`${routePrefix}.evaluations.index`),
            { ...params, ...overrides },
            { preserveScroll: true, preserveState: true }
        );
    };

    const clearFilters = () => {
        setSearch("");
        setCourseId("");
        if (isAdmin) setTeacherId("");
        router.get(route(`${routePrefix}.evaluations.index`), {}, { preserveScroll: true });
    };

    const goToPage = (url) => {
        if (!url) return;
        const params = { search, course_id: courseId };
        if (isAdmin && teacherId) params.teacher_id = teacherId;
        router.get(url, params, { preserveScroll: true });
    };

    const hasFilters = search || courseId || (isAdmin && teacherId);

    // Paginación
    const buildPages = () => {
        if (lastPage <= 7) return Array.from({ length: lastPage }, (_, i) => i + 1);
        const pages = [1];
        if (currPage > 3) pages.push(null);
        for (let p = Math.max(2, currPage - 1); p <= Math.min(lastPage - 1, currPage + 1); p++) pages.push(p);
        if (currPage < lastPage - 2) pages.push(null);
        pages.push(lastPage);
        return pages;
    };

    // Configuración de stats según rol
    const statsConfig = isAdmin ? [
        { label: "Total Evaluaciones", value: stats.total_evaluations ?? 0, icon: ClipboardList, color: "#540D6E", bg: "#F3E8FF" },
        { label: "Promedio General", value: `${stats.avg_score ?? 0}%`, icon: TrendingUp, color: "#0EAD69", bg: "#E8F5F0" },
        { label: "Estudiantes", value: stats.total_students ?? 0, icon: Users, color: "#1D4ED8", bg: "#DBEAFE" },
        { label: "Profesores", value: stats.total_teachers ?? 0, icon: UserCog, color: "#D97706", bg: "#FEF3C7" },
        { label: "Cursos", value: stats.total_courses ?? 0, icon: BookOpen, color: "#EE4266", bg: "#FEE2E2" },
    ] : [
        { label: "Total Evaluaciones", value: stats.total_evaluations ?? 0, icon: ClipboardList, color: "#540D6E", bg: "#F3E8FF" },
        { label: "Promedio General", value: `${stats.avg_score ?? 0}%`, icon: TrendingUp, color: "#0EAD69", bg: "#E8F5F0" },
        { label: "Estudiantes", value: stats.total_students ?? 0, icon: Users, color: "#1D4ED8", bg: "#DBEAFE" },
        { label: "Cursos", value: stats.total_courses ?? 0, icon: BookOpen, color: "#D97706", bg: "#FEF3C7" },
    ];

    // Columnas de la tabla según rol
    const tableColumns = isAdmin 
        ? ["Estudiante", "Curso", "Profesor", "OVA", "Evaluación", "Puntaje", "Calificación", "Intento", "Fecha"]
        : ["Estudiante", "Curso", "OVA", "Evaluación", "Puntaje", "Calificación", "Intento", "Fecha"];

    return (
        <>
            <Head title="Evaluaciones" />
            <AppSidebar currentRoute={`${routePrefix}.evaluations.index`} />

            <main className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-20" : "lg:ml-72"} min-h-screen bg-gray-50`}>
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">

                        {/* Breadcrumb */}
                        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                            <Link href={route(`${routePrefix}.dashboard`)} className="hover:text-purple-600 transition-colors">
                                Dashboard
                            </Link>
                            <span>/</span>
                            <span style={{ color: "#540D6E" }} className="font-medium">Evaluaciones</span>
                        </div>

                        {/* Header */}
                        <div className="mb-8 flex items-start gap-4">
                            <div className="p-4 rounded-xl shadow-sm border bg-white" style={{ borderColor: "#540D6E" }}>
                                <ClipboardList className="w-10 h-10" style={{ color: "#540D6E" }} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                                    {isAdmin ? "Evaluaciones del Sistema" : "Evaluaciones de Estudiantes"}
                                </h1>
                                <p className="text-gray-500 text-sm">
                                    {isAdmin 
                                        ? "Gestión de evaluaciones OVA de todos los cursos" 
                                        : "Resultados de evaluaciones OVA de tus cursos"}
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className={`grid grid-cols-2 ${isAdmin ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-4 mb-8`}>
                            {statsConfig.map(({ label, value, icon: Icon, color, bg }) => (
                                <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
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
                                        placeholder="Buscar estudiante por nombre o usuario..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && applyFilters()}
                                        className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none transition-all"
                                        onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                        onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"}
                                    />
                                    {search && (
                                        <button onClick={() => { setSearch(""); applyFilters({ search: "" }); }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Filtro por curso */}
                                <select
                                    value={courseId}
                                    onChange={e => { setCourseId(e.target.value); applyFilters({ course_id: e.target.value }); }}
                                    className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none bg-white min-w-[200px]"
                                    onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                    onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"}
                                >
                                    <option value="">Todos los cursos</option>
                                    {courses.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {GRADE_LABELS[c.grade] ?? c.grade} — Sección {c.section}
                                            {isAdmin && c.teacher && ` (${c.teacher})`}
                                            {!isAdmin && ` (${c.school_year})`}
                                        </option>
                                    ))}
                                </select>

                                {/* Filtro por profesor (solo admin) */}
                                {isAdmin && teachers && teachers.length > 0 && (
                                    <select
                                        value={teacherId}
                                        onChange={e => { setTeacherId(e.target.value); applyFilters({ teacher_id: e.target.value }); }}
                                        className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none bg-white min-w-[200px]"
                                        onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                        onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"}
                                    >
                                        <option value="">Todos los profesores</option>
                                        {teachers.map(t => (
                                            <option key={t.id} value={t.id}>
                                                {t.name}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {/* Buscar */}
                                <button
                                    onClick={() => applyFilters()}
                                    className="px-4 py-2.5 text-sm font-bold text-white rounded-lg transition-all"
                                    style={{ backgroundColor: "#540D6E" }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}
                                >
                                    <Search className="w-4 h-4" />
                                </button>

                                {/* Limpiar */}
                                {hasFilters && (
                                    <button onClick={clearFilters}
                                        className="px-4 py-2.5 text-sm font-semibold border-2 border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-gray-600">
                                        <RotateCcw className="w-4 h-4" /> Limpiar
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Tabla */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {data.length > 0 ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    {tableColumns.map(h => (
                                                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">
                                                            {h}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {data.map(ev => (
                                                    <tr key={ev.id} className="hover:bg-gray-50 transition-colors">
                                                        {/* Estudiante */}
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2.5">
                                                                <StudentAvatar student={ev.student} />
                                                                <div>
                                                                    <p className="text-sm font-semibold text-gray-900">{ev.student?.name}</p>
                                                                    <p className="text-xs text-gray-400 font-mono">@{ev.student?.username}</p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Curso */}
                                                        <td className="px-4 py-3">
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold"
                                                                style={{ backgroundColor: "#F3E8FF", color: "#540D6E" }}>
                                                                <BookOpen className="w-3 h-3" />
                                                                {GRADE_LABELS[ev.course?.grade] ?? ev.course?.grade} {ev.course?.section}
                                                            </span>
                                                        </td>

                                                        {/* Profesor (solo admin) */}
                                                        {isAdmin && (
                                                            <td className="px-4 py-3">
                                                                <span className="text-sm text-gray-700">{ev.course?.teacher || 'N/A'}</span>
                                                            </td>
                                                        )}

                                                        {/* OVA */}
                                                        <td className="px-4 py-3">
                                                            <p className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: "#540D6E" }}>
                                                                {ev.ova?.area}
                                                            </p>
                                                            <p className="text-sm text-gray-700 max-w-[160px] truncate">
                                                                {ev.ova?.tematica}
                                                            </p>
                                                        </td>

                                                        {/* Evaluación key */}
                                                        <td className="px-4 py-3">
                                                            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                                {ev.evaluation_key}
                                                            </span>
                                                        </td>

                                                        {/* Puntaje */}
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-bold text-gray-900">{ev.score}</span>
                                                                <span className="text-xs text-gray-400">/ {ev.total}</span>
                                                                <div className="w-16 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                                                                    <div className="h-full rounded-full"
                                                                        style={{
                                                                            width: `${ev.percentage}%`,
                                                                            backgroundColor: ev.percentage >= 80 ? "#0EAD69" : ev.percentage >= 60 ? "#D97706" : "#EE4266"
                                                                        }} />
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Calificación */}
                                                        <td className="px-4 py-3">
                                                            <ScoreBadge percentage={ev.percentage} />
                                                        </td>

                                                        {/* Intento */}
                                                        <td className="px-4 py-3">
                                                            <span className="text-sm text-gray-600">#{ev.attempt}</span>
                                                        </td>

                                                        {/* Fecha */}
                                                        <td className="px-4 py-3">
                                                            <span className="text-xs text-gray-500">{ev.created_at}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Paginación */}
                                    {lastPage > 1 && (
                                        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                            <p className="text-sm text-gray-600">
                                                Mostrando <strong>{from}</strong>–<strong>{to}</strong> de{" "}
                                                <strong style={{ color: "#540D6E" }}>{total}</strong> evaluaciones
                                            </p>
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => goToPage(links[0]?.url)} disabled={currPage === 1}
                                                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                                    <ChevronsLeft className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => goToPage(links[currPage - 1]?.url)} disabled={currPage === 1}
                                                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                                {buildPages().map((page, idx) =>
                                                    page === null
                                                        ? <span key={`e-${idx}`} className="px-2 text-gray-400">…</span>
                                                        : (
                                                            <button key={page}
                                                                onClick={() => { const l = links.find(l => l.label === String(page)); goToPage(l?.url); }}
                                                                className="min-w-[36px] h-9 px-2 rounded-lg border text-sm font-semibold transition-all"
                                                                style={page === currPage
                                                                    ? { backgroundColor: "#540D6E", borderColor: "#540D6E", color: "#fff" }
                                                                    : { backgroundColor: "#fff", borderColor: "#E5E7EB", color: "#374151" }}
                                                                onMouseEnter={e => { if (page !== currPage) e.currentTarget.style.backgroundColor = "#F3E8FF"; }}
                                                                onMouseLeave={e => { if (page !== currPage) e.currentTarget.style.backgroundColor = "#fff"; }}>
                                                                {page}
                                                            </button>
                                                        )
                                                )}
                                                <button onClick={() => goToPage(links[currPage + 1]?.url)} disabled={currPage === lastPage}
                                                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => goToPage(links[links.length - 1]?.url)} disabled={currPage === lastPage}
                                                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
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
                                        {hasFilters ? "No hay resultados para esta búsqueda" : "Aún no hay evaluaciones registradas"}
                                    </p>
                                    <p className="text-sm text-gray-400 mb-4">
                                        {hasFilters ? "Intenta con otros filtros" : "Las evaluaciones aparecerán aquí cuando los estudiantes completen los OVAs"}
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