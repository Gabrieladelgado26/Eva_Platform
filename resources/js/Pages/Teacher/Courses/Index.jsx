import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import {
    BookOpen, GraduationCap, Users, Search, X, UserPlus, UserX,
    Layers, ChevronRight, ChevronLeft, Copy, Check, AlertCircle,
    Loader2, LogOut, Menu, Calendar, ClipboardList, BarChart3,
    Shield, User, Home, Clock, CheckCircle, Award, TrendingUp,
    ChevronDown, Bell, Star, FileText, BookMarked, CheckSquare,
    Calendar as CalendarIcon, Download, Upload, Eye, Edit2, Filter,
    MessageSquare, HelpCircle, Settings, PlusCircle, Video, RotateCcw
} from "lucide-react";

// ─── CONSTANTES ──────────────────────────────────────────────────────────────
const GRADE_LABELS = {
    primero: "Primero",
    segundo: "Segundo",
    tercero: "Tercero",
    cuarto: "Cuarto",
    quinto: "Quinto"
};

const getInitials = (name) => {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

// ─── MODAL AGREGAR ESTUDIANTE ───────────────────────────────────────────────
function AddStudentModal({ course, onClose }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState("search");
    const [submitting, setSubmitting] = useState(false);
    const debounceRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    useEffect(() => {
        if (mode !== "search") return;
        if (query.trim().length < 2) { setResults([]); return; }
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    route("teacher.courses.students.search", course.id) +
                    `?q=${encodeURIComponent(query)}`
                );
                setResults(await res.json());
            } catch { setResults([]); }
            finally { setLoading(false); }
        }, 300);
        return () => clearTimeout(debounceRef.current);
    }, [query, mode, course.id]);

    const handleSelect = (student) => { setSelected(student); setQuery(student.name); setResults([]); };
    const handleClear = () => { setSelected(null); setMode("search"); setQuery(""); setResults([]); inputRef.current?.focus(); };

    const handleSubmit = () => {
        if (submitting) return;
        setSubmitting(true);
        if (mode === "search" && selected) {
            router.post(route("teacher.courses.students.store", course.id), { student_id: selected.id },
                { onFinish: () => setSubmitting(false), onSuccess: onClose });
        } else if (mode === "create" && query.trim()) {
            router.post(route("teacher.courses.students.store", course.id), { name: query.trim() },
                { onFinish: () => setSubmitting(false), onSuccess: onClose });
        }
    };

    const canSubmit = (mode === "search" && selected) || (mode === "create" && query.trim().length >= 2);
    const showNoResults = !loading && query.trim().length >= 2 && results.length === 0 && !selected && mode === "search";

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" style={{ animation: "modalIn 0.2s ease-out" }}>
                <div className="h-1" style={{ background: "linear-gradient(to right, #540D6E, #EE4266)" }} />
                <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#540D6E15" }}>
                            <UserPlus className="w-4 h-4" style={{ color: "#540D6E" }} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Agregar estudiante</h2>
                            <p className="text-xs text-slate-500">Busca uno existente o crea uno nuevo</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            {loading ? <Loader2 className="w-4 h-4 text-slate-400 animate-spin" /> : <Search className="w-4 h-4 text-slate-400" />}
                        </div>
                        <input ref={inputRef} type="text" placeholder="Buscar por nombre o username..."
                            value={query}
                            onChange={e => { setQuery(e.target.value); setSelected(null); setMode("search"); }}
                            disabled={!!selected || mode === "create"}
                            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                            onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"} />

                        {results.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl shadow-lg mt-1.5 max-h-44 overflow-y-auto divide-y divide-slate-50">
                                {results.map(s => (
                                    <li key={s.id} onClick={() => handleSelect(s)}
                                        className="px-3 py-2.5 hover:bg-violet-50 cursor-pointer flex justify-between items-center transition-colors">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                                style={{ background: "linear-gradient(135deg, #540D6E, #EE4266)" }}>
                                                {s.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-sm font-medium text-slate-800">{s.name}</span>
                                        </div>
                                        <span className="text-xs text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded-md">@{s.username}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {showNoResults && (
                            <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl shadow-lg mt-1.5 p-4">
                                <p className="text-sm text-slate-500 mb-2.5">Sin resultados para <span className="font-semibold text-slate-700">"{query}"</span></p>
                                <button onClick={() => setMode("create")}
                                    className="text-sm font-semibold flex items-center gap-1.5 transition-colors"
                                    style={{ color: "#540D6E" }}>
                                    <UserPlus className="w-4 h-4" /> Crear nuevo estudiante con este nombre
                                </button>
                            </div>
                        )}
                    </div>

                    {selected && (
                        <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ backgroundColor: "#540D6E08", borderColor: "#540D6E30", animation: "chipIn .15s ease-out" }}>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                style={{ background: "linear-gradient(135deg, #540D6E, #EE4266)" }}>
                                {selected.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate">{selected.name}</p>
                                <p className="text-xs text-slate-500">@{selected.username} · Ya registrado en el sistema</p>
                            </div>
                            <button onClick={handleClear} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                        </div>
                    )}

                    {mode === "create" && (
                        <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ backgroundColor: "#0EAD6908", borderColor: "#0EAD6930", animation: "chipIn .15s ease-out" }}>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#0EAD6920" }}>
                                <UserPlus className="w-4 h-4" style={{ color: "#0EAD69" }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate">{query}</p>
                                <p className="text-xs text-slate-500">Nuevo · Username y PIN se generan automáticamente</p>
                            </div>
                            <button onClick={handleClear} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                        </div>
                    )}

                    <div className="flex gap-2 pt-1">
                        <button onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
                        <button onClick={handleSubmit} disabled={!canSubmit || submitting}
                            className="flex-1 py-2.5 text-sm font-bold text-white rounded-xl transition-all disabled:opacity-40"
                            style={{ backgroundColor: "#540D6E" }}
                            onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = "#6B1689")}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}>
                            {submitting
                                ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Guardando…</span>
                                : mode === "create" ? "Crear y agregar" : "Agregar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── MODAL CREDENCIALES ─────────────────────────────────────────────────────
function CredentialsModal({ credentials, onClose }) {
    const [copied, setCopied] = useState({ username: false, pin: false });

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopied(p => ({ ...p, [type]: true }));
        setTimeout(() => setCopied(p => ({ ...p, [type]: false })), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ animation: "fadeIn 0.3s ease-out" }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden" style={{ animation: "slideUp 0.3s ease-out" }}>
                <div className="h-1" style={{ background: "linear-gradient(to right, #540D6E, #EE4266)" }} />
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="p-3 rounded-xl bg-white shadow-md border border-gray-200">
                            <GraduationCap className="w-8 h-8" style={{ color: "#540D6E" }} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Credenciales de Acceso</h2>
                            <p className="text-sm text-gray-500">Guarda estas credenciales para el inicio de sesión del estudiante</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Usuario</label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-800">{credentials.username}</span>
                            </div>
                            <button onClick={() => copyToClipboard(credentials.username, "username")}
                                className="p-3 rounded-lg transition-all border-2 hover:shadow-md"
                                style={{ borderColor: copied.username ? "#0EAD69" : "#540D6E", backgroundColor: copied.username ? "#E8F5F0" : "white" }}>
                                {copied.username ? <Check className="w-5 h-5" style={{ color: "#0EAD69" }} /> : <Copy className="w-5 h-5" style={{ color: "#540D6E" }} />}
                            </button>
                        </div>
                        {copied.username && <p className="text-xs text-green-600 mt-1">✓ Usuario copiado</p>}
                    </div>

                    <div className="mb-6">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">PIN de Acceso</label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono flex items-center gap-2">
                                <Shield className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-800 text-lg tracking-widest font-bold">{credentials.pin}</span>
                            </div>
                            <button onClick={() => copyToClipboard(credentials.pin, "pin")}
                                className="p-3 rounded-lg transition-all border-2 hover:shadow-md"
                                style={{ borderColor: copied.pin ? "#0EAD69" : "#540D6E", backgroundColor: copied.pin ? "#E8F5F0" : "white" }}>
                                {copied.pin ? <Check className="w-5 h-5" style={{ color: "#0EAD69" }} /> : <Copy className="w-5 h-5" style={{ color: "#540D6E" }} />}
                            </button>
                        </div>
                        {copied.pin && <p className="text-xs text-green-600 mt-1">✓ PIN copiado</p>}
                    </div>

                    <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: "#F3E8FF", borderLeft: "4px solid #540D6E" }}>
                        <p className="text-xs text-gray-700 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#540D6E" }} />
                            <span>Estas credenciales son únicas. Asegúrate de compartirlas de forma segura con el estudiante.</span>
                        </p>
                    </div>

                    <button onClick={onClose}
                        className="w-full py-3 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                        style={{ backgroundColor: "#540D6E" }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}>
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── MODAL RETIRAR ESTUDIANTE ───────────────────────────────────────────────
function RemoveStudentModal({ student, onConfirm, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" style={{ animation: "modalIn 0.2s ease-out" }}>
                <div className="h-1" style={{ background: "linear-gradient(to right, #EE4266, #FFD23F)" }} />
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#FEE2E2" }}>
                            <UserX className="w-4 h-4" style={{ color: "#EE4266" }} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Retirar estudiante</h3>
                            <p className="text-xs text-slate-500">El estudiante seguirá registrado en el sistema</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl border" style={{ backgroundColor: "#FEE2E210", borderColor: "#EE426630" }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #540D6E, #EE4266)" }}>
                            {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                            <p className="text-xs text-slate-500">@{student.username}</p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600">¿Confirmas que deseas retirar a este estudiante del curso? Podrás volver a agregarlo después.</p>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
                        <button onClick={onConfirm}
                            className="flex-1 py-2.5 text-sm font-bold text-white rounded-xl transition-all"
                            style={{ backgroundColor: "#EE4266" }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#DC2F55"}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#EE4266"}>
                            Retirar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── COMPONENTE PRINCIPAL ───────────────────────────────────────────────────
export default function TeacherCourseShow({ course, students }) {
    const { props } = usePage();
    const credentials = props.flash?.credentials ?? null;
    const teacher = props.auth?.user ?? { name: "Docente", email: "docente@educacion.edu" };

    // Estados para tabs y modales
    const [tab, setTab] = useState("details");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showCredentials, setShowCredentials] = useState(!!credentials);
    const [studentToRemove, setStudentToRemove] = useState(null);
    const [search, setSearch] = useState("");

    // Estados para el sidebar
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("teacherSidebarOpen") === "true";
        }
        return true;
    });

    useEffect(() => {
        localStorage.setItem("teacherSidebarOpen", String(sidebarOpen));
    }, [sidebarOpen]);

    useEffect(() => {
        if (credentials) setShowCredentials(true);
    }, [credentials]);

    const confirmRemove = () => {
        if (!studentToRemove) return;
        router.delete(
            route("teacher.courses.students.destroy", [course.id, studentToRemove.id]),
            { onSuccess: () => setStudentToRemove(null) }
        );
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.username ?? "").toLowerCase().includes(search.toLowerCase())
    );

    // Navegación del sidebar
    const navigation = {
        principal: [
            { name: "Dashboard", href: route("teacher.index"), icon: Home, current: false },
            { name: "Mis Cursos", href: route("teacher.index"), icon: BookOpen, current: true },
            { name: "Calendario", href: "#", icon: Calendar, current: false },
        ],
        academic: [
            { name: "Evaluaciones", href: "#", icon: ClipboardList, current: false },
            { name: "Asistencia", href: "#", icon: CheckSquare, current: false },
            { name: "Materiales", href: "#", icon: FileText, current: false },
            { name: "Reportes", href: "#", icon: BarChart3, current: false },
        ],
    };

    // Tabs principales con distribución uniforme
    const tabs = [
        { id: "details", label: "Detalles del Curso", icon: BookOpen, count: null },
        { id: "students", label: "Estudiantes", icon: Users, count: students.length },
        { id: "ovas", label: "Recursos OVAs", icon: Layers, count: "3" }, // Placeholder
        { id: "evaluaciones", label: "Evaluaciones", icon: ClipboardList, count: "2" }, // Placeholder
        { id: "asistencia", label: "Asistencia", icon: CheckSquare, count: "85%" }, // Placeholder
    ];

    // Datos de ejemplo para enriquecer el dashboard
    const recentActivities = [
        { id: 1, type: "student", description: "María González se unió al curso", time: "Hace 2 horas", icon: UserPlus, color: "#0EAD69" },
        { id: 2, type: "material", description: "Nuevo material: Guía de ejercicios", time: "Hace 5 horas", icon: Upload, color: "#FFD23F" },
        { id: 3, type: "evaluation", description: "Evaluación parcial calificada", time: "Ayer", icon: Award, color: "#540D6E" },
    ];

    const upcomingEvents = [
        { name: "Entrega de notas", date: "20 Mar", time: "23:59", type: "deadline", color: "#EE4266" },
        { name: "Reunión de padres", date: "22 Mar", time: "18:00", type: "meeting", color: "#540D6E" },
        { name: "Evaluación parcial", date: "25 Mar", time: "10:00", type: "exam", color: "#FFD23F" },
    ];

    const studentStats = {
        total: students.length,
        active: students.length, // Asumimos que todos están activos
        averageGrade: "87%",
        attendanceRate: "92%",
    };

    return (
        <>
            <Head title={`${GRADE_LABELS[course.grade] ?? course.grade} — Sección ${course.section}`} />

            {/* Mobile sidebar backdrop */}
            {mobileSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />}

            {/* Mobile menu button */}
            <button onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden fixed bottom-4 right-4 z-30 p-3 rounded-full shadow-lg text-white"
                style={{ backgroundColor: "#540D6E" }}>
                <Menu className="w-6 h-6" />
            </button>

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out ${sidebarOpen ? "w-72" : "w-20"} ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
                <div className="h-full bg-white/90 backdrop-blur-xl border-r border-gray-200 shadow-xl flex flex-col">
                    {/* Header Sidebar */}
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <div className={`flex items-center gap-2 ${!sidebarOpen && "lg:justify-center w-full"}`}>
                            <div className="p-2 rounded-lg" style={{ backgroundColor: "#540D6E20" }}>
                                <GraduationCap className="w-6 h-6" style={{ color: "#540D6E" }} />
                            </div>
                            {sidebarOpen && (
                                <div>
                                    <span className="font-bold text-lg text-gray-900">EVA Platform</span>
                                    <p className="text-xs text-gray-500">Docente</p>
                                </div>
                            )}
                        </div>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="hidden lg:block p-1.5 rounded-lg hover:bg-gray-100">
                            {sidebarOpen ? <ChevronLeft className="w-4 h-4 text-gray-600" /> : <ChevronRight className="w-4 h-4 text-gray-600" />}
                        </button>
                    </div>

                    {/* Navegación */}
                    <nav className="flex-1 overflow-y-auto py-4 px-2">
                        {Object.entries(navigation).map(([key, items]) => (
                            <div key={key} className="mb-4">
                                {sidebarOpen && (
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                                        {key === 'principal' ? 'Principal' : 'Académico'}
                                    </p>
                                )}
                                <ul className="space-y-1">
                                    {items.map(item => {
                                        const Icon = item.icon;
                                        return (
                                            <li key={item.name}>
                                                <Link href={item.href}
                                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${item.current ? "text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"}`}
                                                    style={item.current ? { backgroundColor: "#540D6E" } : {}}>
                                                    <Icon className={`w-5 h-5 ${!sidebarOpen && "mx-auto"}`} />
                                                    {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                                                    {!sidebarOpen && (
                                                        <span className="absolute left-full ml-6 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                                            {item.name}
                                                        </span>
                                                    )}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </nav>

                    {/* Footer Sidebar - Usuario */}
                    <div className="border-t border-gray-200 p-2">
                        <ul className="space-y-1">
                            <li>
                                <div className="w-full flex items-center gap-3 px-3 py-2.5">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-sm
                                                    ${!sidebarOpen && "mx-auto"}`}
                                        style={{ background: "linear-gradient(to bottom right, #540D6E, #EE4266)" }}>
                                        {teacher?.name?.charAt(0)?.toUpperCase() ?? "D"}
                                    </div>
                                    {sidebarOpen && (
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-800 truncate max-w-[150px]">
                                                {teacher?.name}
                                            </span>
                                            <span className="text-xs text-gray-400 truncate max-w-[150px]">
                                                {teacher?.email}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </li>
                            <li>
                                <Link href={route("logout")} method="post" as="button"
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all group">
                                    <LogOut className={`w-5 h-5 ${!sidebarOpen && "mx-auto"}`} />
                                    {sidebarOpen && <span className="text-sm font-medium">Cerrar Sesión</span>}
                                    {!sidebarOpen && (
                                        <span className="absolute left-full ml-6 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                            Cerrar Sesión
                                        </span>
                                    )}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className={`transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:ml-72" : "lg:ml-20"} min-h-screen bg-gray-50`}>
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    {/* Contenedor central */}
                    <div className="max-w-7xl mx-auto">
                        {/* Breadcrumb */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Link href={route("teacher.index")} className="hover:text-purple-600 transition-colors">Mis Cursos</Link>
                                <span>/</span>
                                <span style={{ color: "#540D6E" }} className="font-medium">
                                    {GRADE_LABELS[course.grade] ?? course.grade} — Sección {course.section}
                                </span>
                            </div>
                        </div>

                        {/* Header con bienvenida */}
                        <div className="mb-8 animate-fade-in">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-4 rounded-xl shadow-sm border" style={{ backgroundColor: "white", borderColor: "#540D6E" }}>
                                        <GraduationCap className="w-10 h-10" style={{ color: "#540D6E" }} />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                            {GRADE_LABELS[course.grade] ?? course.grade} · Sección {course.section}
                                        </h1>
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                Año {course.school_year}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {students.length} estudiantes
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span className={`flex items-center gap-1 ${course.is_active ? "text-green-600" : "text-gray-400"}`}>
                                                <span className={`w-2 h-2 rounded-full ${course.is_active ? "animate-pulse" : ""}`}
                                                    style={{ backgroundColor: course.is_active ? "#0EAD69" : "#94A3B8" }} />
                                                {course.is_active ? "Activo" : "Inactivo"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Notificaciones */}
                                <div className="flex items-center gap-3">
                                    <button className="relative p-2.5 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                                        <Bell className="w-5 h-5 text-gray-600" />
                                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: "#EE4266" }}></span>
                                    </button>
                                    <button className="p-2.5 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                                        <MessageSquare className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards - Resumen del curso mejorado */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="p-3 rounded-lg" style={{ backgroundColor: "#F3E8FF" }}>
                                            <Users className="w-6 h-6" style={{ color: "#540D6E" }} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Estudiantes</p>
                                            <p className="text-2xl font-black mt-1" style={{ color: "#540D6E" }}>{studentStats.total}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <p className="text-xs text-gray-500">Inscritos en el curso</p>
                                    <span className="text-xs font-semibold text-green-600">+2 este mes</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="p-3 rounded-lg" style={{ backgroundColor: "#E8F5F0" }}>
                                            <Award className="w-6 h-6" style={{ color: "#0EAD69" }} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Rendimiento</p>
                                            <p className="text-2xl font-black mt-1" style={{ color: "#0EAD69" }}>{studentStats.averageGrade}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <p className="text-xs text-gray-500">Promedio general</p>
                                    <span className="text-xs font-semibold text-green-600">↑ 5%</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="p-3 rounded-lg" style={{ backgroundColor: "#FFF4E0" }}>
                                            <CheckSquare className="w-6 h-6" style={{ color: "#FFD23F" }} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Asistencia</p>
                                            <p className="text-2xl font-black mt-1" style={{ color: "#FFD23F" }}>{studentStats.attendanceRate}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <p className="text-xs text-gray-500">Promedio del curso</p>
                                    <span className="text-xs font-semibold text-green-600">↑ 2%</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="p-3 rounded-lg" style={{ backgroundColor: "#FEE2E2" }}>
                                            <ClipboardList className="w-6 h-6" style={{ color: "#EE4266" }} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Evaluaciones</p>
                                            <p className="text-2xl font-black mt-1" style={{ color: "#EE4266" }}>4</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <p className="text-xs text-gray-500">2 pendientes</p>
                                    <span className="text-xs font-semibold text-orange-600">Próxima: 25 Mar</span>
                                </div>
                            </div>
                        </div>

                        {/* Tabs de navegación - Distribución uniforme */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
                            <div className="flex flex-wrap divide-x divide-gray-200">
                                {tabs.map(({ id, label, icon: Icon, count }) => (
                                    <button
                                        key={id}
                                        onClick={() => setTab(id)}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold transition-all min-w-[120px] ${
                                            tab === id
                                                ? "text-white"
                                                : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                        style={tab === id ? { backgroundColor: "#540D6E" } : {}}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{label}</span>
                                        {count && (
                                            <span
                                                className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                                                    tab === id
                                                        ? "bg-white text-purple-700"
                                                        : "bg-gray-100 text-gray-600"
                                                }`}
                                            >
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Contenido de las pestañas */}
                        <div className="mt-6">
                            {/* TAB DETALLES - Versión enriquecida */}
                            {tab === "details" && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                                    {/* Columna izquierda - Información del curso */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Tarjeta de información principal */}
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                            <div className="p-6 border-b border-gray-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg" style={{ backgroundColor: "#F3E8FF" }}>
                                                        <BookOpen className="w-5 h-5" style={{ color: "#540D6E" }} />
                                                    </div>
                                                    <h2 className="text-lg font-bold text-gray-900">Información del Curso</h2>
                                                </div>
                                            </div>
                                            
                                            <div className="p-6">
                                                <dl className="grid grid-cols-2 gap-4">
                                                    <div className="col-span-2 sm:col-span-1 p-4 rounded-lg" style={{ backgroundColor: "#F8FAFC" }}>
                                                        <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Grado</dt>
                                                        <dd className="text-lg font-bold text-gray-900">{GRADE_LABELS[course.grade] ?? course.grade}</dd>
                                                    </div>
                                                    <div className="col-span-2 sm:col-span-1 p-4 rounded-lg" style={{ backgroundColor: "#F8FAFC" }}>
                                                        <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Sección</dt>
                                                        <dd className="text-lg font-bold text-gray-900">{course.section}</dd>
                                                    </div>
                                                    <div className="col-span-2 sm:col-span-1 p-4 rounded-lg" style={{ backgroundColor: "#F8FAFC" }}>
                                                        <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Año Escolar</dt>
                                                        <dd className="text-lg font-bold text-gray-900">{course.school_year}</dd>
                                                    </div>
                                                    <div className="col-span-2 sm:col-span-1 p-4 rounded-lg" style={{ backgroundColor: "#F8FAFC" }}>
                                                        <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Estado</dt>
                                                        <dd className="flex items-center gap-2">
                                                            <span className={`w-2 h-2 rounded-full ${course.is_active ? "animate-pulse" : ""}`}
                                                                style={{ backgroundColor: course.is_active ? "#0EAD69" : "#94A3B8" }} />
                                                            <span className="text-lg font-bold" style={{ color: course.is_active ? "#0EAD69" : "#94A3B8" }}>
                                                                {course.is_active ? "Activo" : "Inactivo"}
                                                            </span>
                                                        </dd>
                                                    </div>
                                                    {course.description && (
                                                        <div className="col-span-2 p-4 rounded-lg" style={{ backgroundColor: "#F8FAFC" }}>
                                                            <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Descripción</dt>
                                                            <dd className="text-sm text-gray-700">{course.description}</dd>
                                                        </div>
                                                    )}
                                                </dl>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Columna derecha - Actividad y eventos */}
                                    <div className="space-y-6">
                                        {/* Actividad reciente */}
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                            <div className="p-6 border-b border-gray-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg" style={{ backgroundColor: "#FFF4E0" }}>
                                                        <TrendingUp className="w-5 h-5" style={{ color: "#FFD23F" }} />
                                                    </div>
                                                    <h2 className="text-lg font-bold text-gray-900">Actividad Reciente</h2>
                                                </div>
                                            </div>
                                            
                                            <div className="divide-y divide-gray-100">
                                                {recentActivities.map((activity) => (
                                                    <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                                                        <div className="flex items-start gap-3">
                                                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${activity.color}15` }}>
                                                                <activity.icon className="w-4 h-4" style={{ color: activity.color }} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm text-gray-700">{activity.description}</p>
                                                                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB ESTUDIANTES - Versión mejorada */}
                            {tab === "students" && (
                                <div className="space-y-6 animate-fade-in">
                                    {/* Barra de acciones */}
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="relative flex-1">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                                <input
                                                    type="text"
                                                    placeholder="Buscar estudiante por nombre o username..."
                                                    value={search}
                                                    onChange={e => setSearch(e.target.value)}
                                                    className="w-full pl-9 pr-9 py-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none transition-all"
                                                    onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                                    onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"}
                                                />
                                                {search && (
                                                    <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="px-4 py-3 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2">
                                                    <Filter className="w-4 h-4" /> Filtrar
                                                </button>
                                                <button
                                                    onClick={() => setShowAddModal(true)}
                                                    className="px-4 py-3 text-sm font-bold text-white rounded-lg transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                                                    style={{ backgroundColor: "#540D6E" }}
                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}
                                                >
                                                    <UserPlus className="w-4 h-4" /> Agregar Estudiante
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Grid de estudiantes */}
                                    {filteredStudents.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {filteredStudents.map(student => (
                                                <div
                                                    key={student.id}
                                                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all group"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
                                                                style={{ background: "linear-gradient(135deg, #540D6E, #EE4266)" }}>
                                                                {getInitials(student.name)}
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold text-gray-900">{student.name}</h3>
                                                                <p className="text-xs text-gray-500">@{student.username}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => setStudentToRemove(student)}
                                                            className="opacity-0 group-hover:opacity-100 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        >
                                                            <UserX className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100">
                                                        <div className="text-center">
                                                            <p className="text-xs text-gray-400">Asistencia</p>
                                                            <p className="text-sm font-bold text-green-600">92%</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-xs text-gray-400">Promedio</p>
                                                            <p className="text-sm font-bold text-purple-600">85%</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-xs text-gray-400">Entregas</p>
                                                            <p className="text-sm font-bold text-blue-600">8/10</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 py-16 text-center">
                                            {search ? (
                                                <>
                                                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                    <p className="text-base font-semibold text-gray-500">No hay resultados para "{search}"</p>
                                                    <button onClick={() => setSearch("")} className="text-sm mt-2 hover:underline" style={{ color: "#540D6E" }}>
                                                        Limpiar búsqueda
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                                        style={{ background: "linear-gradient(135deg, #540D6E10, #EE426610)" }}>
                                                        <Users className="w-10 h-10" style={{ color: "#540D6E40" }} />
                                                    </div>
                                                    <p className="text-base font-bold text-gray-700 mb-1">No hay estudiantes inscritos</p>
                                                    <p className="text-sm text-gray-400 mb-4">Comienza agregando estudiantes al curso</p>
                                                    <button
                                                        onClick={() => setShowAddModal(true)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg"
                                                        style={{ backgroundColor: "#540D6E" }}
                                                    >
                                                        <UserPlus className="w-4 h-4" /> Agregar Estudiante
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Estadísticas de estudiantes */}
                                    {filteredStudents.length > 0 && (
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-600">
                                                    Mostrando <span className="font-bold text-gray-900">{filteredStudents.length}</span> de <span className="font-bold text-gray-900">{students.length}</span> estudiantes
                                                </p>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs text-gray-500">Promedio del curso: <span className="font-bold text-purple-600">87%</span></span>
                                                    <span className="text-xs text-gray-500">Asistencia: <span className="font-bold text-green-600">92%</span></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB OVAS - Mejorado */}
                            {tab === "ovas" && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                            <div className="p-6 border-b border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg" style={{ backgroundColor: "#F3E8FF" }}>
                                                            <Layers className="w-5 h-5" style={{ color: "#540D6E" }} />
                                                        </div>
                                                        <h2 className="text-lg font-bold text-gray-900">Recursos OVAs Disponibles</h2>
                                                    </div>
                                                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg"
                                                        style={{ backgroundColor: "#540D6E" }}>
                                                        <PlusCircle className="w-4 h-4" /> Asignar Nuevo
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="divide-y divide-gray-100">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-start gap-3">
                                                                <div className="p-2 rounded-lg" style={{ backgroundColor: "#E8F5F0" }}>
                                                                    <Video className="w-5 h-5" style={{ color: "#0EAD69" }} />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold text-gray-900">OVA {i}: Introducción a la materia</h3>
                                                                    <p className="text-xs text-gray-500 mt-1">Asignado el 15 Mar · 24 estudiantes completados</p>
                                                                    <div className="flex items-center gap-2 mt-2">
                                                                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                                                                            75% completado
                                                                        </span>
                                                                        <span className="text-xs text-gray-400">|</span>
                                                                        <span className="text-xs text-gray-500">Duración: 45 min</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                                                                    <Eye className="w-4 h-4" />
                                                                </button>
                                                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                            <h3 className="font-bold text-gray-900 mb-4">Estadísticas de OVAs</h3>
                                            <div className="space-y-3">
                                                <div>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-gray-600">Completados</span>
                                                        <span className="font-bold text-gray-900">24/32</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full rounded-full" style={{ width: "75%", backgroundColor: "#540D6E" }} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-gray-600">En progreso</span>
                                                        <span className="font-bold text-gray-900">5/32</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full rounded-full" style={{ width: "15%", backgroundColor: "#FFD23F" }} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-gray-600">No iniciados</span>
                                                        <span className="font-bold text-gray-900">3/32</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full rounded-full" style={{ width: "10%", backgroundColor: "#EE4266" }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TABS ADICIONALES - Placeholders mejorados */}
                            {tab === "evaluaciones" && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center animate-fade-in">
                                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                        style={{ background: "linear-gradient(135deg, #540D6E10, #EE426610)" }}>
                                        <ClipboardList className="w-10 h-10" style={{ color: "#540D6E40" }} />
                                    </div>
                                    <p className="text-lg font-bold text-gray-700 mb-2">Módulo de Evaluaciones</p>
                                    <p className="text-sm text-gray-400 mb-6">Próximamente podrás gestionar las evaluaciones del curso.</p>
                                    <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg"
                                        style={{ backgroundColor: "#540D6E" }}>
                                        <PlusCircle className="w-4 h-4" /> Crear Evaluación
                                    </button>
                                </div>
                            )}

                            {tab === "asistencia" && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center animate-fade-in">
                                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                        style={{ background: "linear-gradient(135deg, #540D6E10, #EE426610)" }}>
                                        <CheckSquare className="w-10 h-10" style={{ color: "#540D6E40" }} />
                                    </div>
                                    <p className="text-lg font-bold text-gray-700 mb-2">Control de Asistencia</p>
                                    <p className="text-sm text-gray-400 mb-6">Registra y da seguimiento a la asistencia de los estudiantes.</p>
                                    <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg"
                                        style={{ backgroundColor: "#540D6E" }}>
                                        <CheckSquare className="w-4 h-4" /> Registrar Asistencia
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Fondo académico */}
            <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-50">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(84, 13, 110, 0.05) 1px, transparent 0)`,
                    backgroundSize: "40px 40px"
                }} />
                <div className="absolute top-0 left-0 w-full h-1" style={{
                    background: "linear-gradient(to right, #540D6E, #EE4266, #FFD23F, #3BCEAC, #0EAD69)"
                }} />
            </div>

            {/* Modales */}
            {showAddModal && <AddStudentModal course={course} onClose={() => setShowAddModal(false)} />}
            {showCredentials && credentials && <CredentialsModal credentials={credentials} onClose={() => setShowCredentials(false)} />}
            {studentToRemove && <RemoveStudentModal student={studentToRemove} onConfirm={confirmRemove} onClose={() => setStudentToRemove(null)} />}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(.96) translateY(8px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes chipIn {
                    from { opacity: 0; transform: translateY(-4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out;
                }
                .animate-slide-up {
                    animation: slideUp 0.6s ease-out;
                }
                
                /* Scrollbar personalizada */
                .overflow-y-auto::-webkit-scrollbar {
                    width: 4px;
                }
                .overflow-y-auto::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                .overflow-y-auto::-webkit-scrollbar-thumb {
                    background: #540D6E;
                    border-radius: 4px;
                }
                .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                    background: #6B1689;
                }
            `}</style>
        </>
    );
}