// Resources/js/Pages/Student/Dashboard.jsx
import { Head, Link, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    BookOpen, Layers, ChevronRight, GraduationCap,
    Clock, X, ChevronLeft, PlayCircle, Lock, Search, Filter,
    RotateCcw, ChevronDown, Calculator, BookMarked, 
    FlaskConical, Globe, Languages, LayoutGrid, List,
    CheckCircle, Sparkles, User
} from "lucide-react";
import AppSidebar, { useSidebarState } from "@/Components/AppSidebar";

// ─── Configuración de materias con colores de la paleta ───────────────────────
const MATERIAS = [
    {
        area:    'Matemáticas',
        icon:    Calculator,
        color:   '#FFD23F',
        bg:      '#FEF3C7',
        border:  '#FFD23F',
        description: 'Números y operaciones',
        textColor: '#374151'
    },
    {
        area:    'Español',
        icon:    BookMarked,
        color:   '#540D6E',
        bg:      '#F3E8FF',
        border:  '#540D6E',
        description: 'Lectura y escritura',
        textColor: '#FFFFFF'
    },
    {
        area:    'Ciencias Naturales',
        icon:    FlaskConical,
        color:   '#0EAD69',
        bg:      '#E8F5F0',
        border:  '#0EAD69',
        description: 'Explora el mundo natural',
        textColor: '#FFFFFF'
    },
    {
        area:    'Ciencias Sociales',
        icon:    Globe,
        color:   '#EE4266',
        bg:      '#FEE2E2',
        border:  '#EE4266',
        description: 'Descubre historia y geografía',
        textColor: '#FFFFFF'
    },
    {
        area:    'Inglés',
        icon:    Languages,
        color:   '#3BCEAC',
        bg:      '#E8F5F0',
        border:  '#3BCEAC',
        description: 'Aprende un nuevo idioma',
        textColor: '#FFFFFF'
    },
];

// ─── Avatares ────────────────────────────────────────────────────────────────
const AVATARS = [
    { id: 'avatar1', label: 'Pilar',    emoji: '🧑‍🚀', color: '#0EAD69' },
    { id: 'avatar2', label: 'William',  emoji: '🧑‍🔬', color: '#1D4ED8' },
    { id: 'avatar3', label: 'Felipe',   emoji: '🧑‍🎨', color: '#EE4266' },
    { id: 'avatar4', label: 'Beto',     emoji: '🧑‍🎽', color: '#FFD23F' },
    { id: 'avatar5', label: 'Ivy',      emoji: '🧑‍🎤', color: '#540D6E' },
    { id: 'avatar6', label: 'Juliana',  emoji: '🧑‍💻', color: '#3BCEAC' },
];

const GRADE_LABELS = {
    primero: 'Primero', segundo: 'Segundo', tercero: 'Tercero',
    cuarto: 'Cuarto',   quinto: 'Quinto',
};

function groupOvasByArea(courses) {
    const grouped = {};
    courses.forEach(course => {
        course.ovas.forEach(ova => {
            if (!grouped[ova.area]) grouped[ova.area] = [];
            if (!grouped[ova.area].find(o => o.id === ova.id)) {
                grouped[ova.area].push({ ...ova, course });
            }
        });
    });
    return grouped;
}

// ─── Modal de Avatar Profesional ──────────────────────────────────────────────
function AvatarPickerModal({ onClose }) {
    const [selected, setSelected] = useState(null);
    const [saving, setSaving] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [hoveredAvatar, setHoveredAvatar] = useState(null);

    const handleSave = () => {
        if (!selected || saving) return;
        setSaving(true);

        router.post(
            route('student.avatar.store'),
            { avatar: selected },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setConfirmed(true);
                    setTimeout(() => onClose(), 1500);
                },
                onFinish: () => setSaving(false),
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-lg w-full overflow-hidden animate-slide-up">
                {/* Barra superior de color */}
                <div className="h-1" style={{ background: "linear-gradient(to right, #540D6E, #EE4266)" }} />
                
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-lg" style={{ backgroundColor: "#F3E8FF" }}>
                            <User className="w-6 h-6" style={{ color: "#540D6E" }} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Elige tu avatar</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Selecciona el personaje que te representará</p>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {AVATARS.map(av => {
                            const isSelected = selected === av.id;
                            const isHovered = hoveredAvatar === av.id;
                            
                            return (
                                <button
                                    key={av.id}
                                    onClick={() => setSelected(av.id)}
                                    onMouseEnter={() => setHoveredAvatar(av.id)}
                                    onMouseLeave={() => setHoveredAvatar(null)}
                                    className="relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200"
                                    style={{
                                        borderColor: isSelected ? av.color : "#E5E7EB",
                                        backgroundColor: isSelected ? `${av.color}10` : "white",
                                        transform: isSelected ? "scale(1.02)" : "scale(1)",
                                        boxShadow: isSelected ? `0 8px 20px ${av.color}20` : "none"
                                    }}
                                >
                                    {isSelected && (
                                        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
                                            style={{ backgroundColor: "#0EAD69", border: "2px solid white" }}>
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        </div>
                                    )}

                                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center transition-transform duration-200 hover:scale-105"
                                        style={{ 
                                            background: isSelected || isHovered
                                                ? `linear-gradient(135deg, ${av.color}, ${av.color}dd)` 
                                                : "#F3F4F6"
                                        }}>
                                        <img
                                            src={`/avatars/${av.id}.png`}
                                            alt={av.label}
                                            className="w-full h-full object-cover"
                                            onError={e => {
                                                e.currentTarget.style.display = "none";
                                                e.currentTarget.parentElement.innerHTML = `<span style="font-size:2.5rem">${av.emoji}</span>`;
                                            }}
                                        />
                                    </div>

                                    <span className="text-sm font-bold" style={{ color: isSelected ? av.color : "#4B5563" }}>
                                        {av.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {confirmed ? (
                        <div className="w-full relative overflow-hidden rounded-lg">
                            <div 
                                className="flex items-center justify-center gap-3 py-4 px-6 text-white font-bold shadow-lg"
                                style={{ 
                                    background: "linear-gradient(135deg, #0EAD69 0%, #3BCEAC 100%)",
                                }}
                            >
                                <div className="absolute inset-0 bg-white/10"></div>
                                <Sparkles className="w-5 h-5 relative z-10" />
                                <span className="relative z-10">¡Perfecto! Bienvenido a tu aventura</span>
                                <CheckCircle className="w-5 h-5 relative z-10" />
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={handleSave}
                            disabled={!selected || saving}
                            className="w-full py-3.5 rounded-lg text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                            style={{ 
                                background: selected 
                                    ? `linear-gradient(135deg, ${AVATARS.find(a => a.id === selected)?.color || '#540D6E'}, ${AVATARS.find(a => a.id === selected)?.color || '#EE4266'}dd)` 
                                    : "#D1D5DB"
                            }}
                        >
                            {saving ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Guardando...
                                </span>
                            ) : (
                                selected 
                                    ? `¡Elegir a ${AVATARS.find(a => a.id === selected)?.label}!` 
                                    : "Selecciona un personaje"
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function StudentDashboard({ courses = [], needsAvatar = false }) {
    const { props } = usePage();
    const flash = props.flash || {};
    const pageProps = props;

    const [collapsed] = useSidebarState();
    const [activeArea, setActiveArea] = useState(null);
    const [search, setSearch] = useState("");
    const [filterArea, setFilterArea] = useState("all");
    const [viewMode, setViewMode] = useState("table");
    const [visible, setVisible] = useState(false);
    const [showAvatar, setShowAvatar] = useState(false);

    const course = courses[0] ?? null;
    const ovasByArea = groupOvasByArea(courses);
    const totalOvas = Object.values(ovasByArea).flat().length;

    const areasConOvas = MATERIAS.filter(m => (ovasByArea[m.area]?.length ?? 0) > 0).map(m => m.area);
    const hasActiveFilters = search || filterArea !== "all";

    const clearFilters = () => {
        setSearch("");
        setFilterArea("all");
    };

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    // ✅ CORRECCIÓN: Verificar needsAvatar de múltiples fuentes
    useEffect(() => {
        const needsAvatarFromProp = needsAvatar;
        const needsAvatarFromPage = pageProps?.needs_avatar || props?.needs_avatar;
        
        if (needsAvatarFromProp || needsAvatarFromPage) {
            setTimeout(() => setShowAvatar(true), 600);
        }
    }, [needsAvatar, pageProps, props]);

    const activeOvas = activeArea
        ? (ovasByArea[activeArea] ?? []).filter(o => {
            const matchesSearch = o.tematica.toLowerCase().includes(search.toLowerCase()) ||
                                 (o.description ?? "").toLowerCase().includes(search.toLowerCase());
            const matchesFilter = filterArea === "all" || o.area === filterArea;
            return matchesSearch && matchesFilter;
          })
        : [];

    const activeMateria = MATERIAS.find(m => m.area === activeArea);
    const activeMaterias = MATERIAS.filter(m => (ovasByArea[m.area]?.length ?? 0) > 0).length;

    return (
        <>
            <Head title="Mis Materias" />
            <AppSidebar currentRoute="student.dashboard" />

            {/* Modal de Avatar */}
            {showAvatar && <AvatarPickerModal onClose={() => setShowAvatar(false)} />}

            <main className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-20" : "lg:ml-72"} min-h-screen bg-gray-50`}>
                
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        
                        {/* Breadcrumb */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Link href={route("dashboard")} className="hover:text-purple-600 transition-colors">
                                    Panel de Control
                                </Link>
                                <span>/</span>
                                <span style={{ color: "#540D6E" }} className="font-medium">
                                    Mis Materias
                                </span>
                            </div>
                        </div>

                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-4 rounded-xl shadow-sm border" style={{ backgroundColor: "white", borderColor: "#540D6E" }}>
                                        <BookOpen className="w-10 h-10" style={{ color: "#540D6E" }} />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Mis Materias</h1>
                                        <p className="text-gray-600 text-base">
                                            {course ? (
                                                <>Explora tus recursos educativos · {GRADE_LABELS[course.grade] ?? course.grade} · Sección {course.section} · {course.school_year}</>
                                            ) : (
                                                "Explora tus recursos educativos"
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                            {[
                                { 
                                    icon: Layers, 
                                    bg: "#F3E8FF", 
                                    color: "#540D6E", 
                                    label: "Total Recursos", 
                                    desc: "Disponibles en tu curso", 
                                    value: totalOvas 
                                },
                                { 
                                    icon: BookOpen, 
                                    bg: "#E8F5F0", 
                                    color: "#0EAD69", 
                                    label: "Materias Activas", 
                                    desc: "Con contenido disponible", 
                                    value: `${activeMaterias} de ${MATERIAS.length}` 
                                },
                                { 
                                    icon: GraduationCap, 
                                    bg: "#FEF3C7", 
                                    color: "#FFD23F", 
                                    label: "Grado", 
                                    desc: course ? "Nivel educativo actual" : "Sin curso asignado", 
                                    value: course ? GRADE_LABELS[course.grade] ?? course.grade : "—" 
                                }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="p-3 rounded-lg" style={{ backgroundColor: stat.bg }}>
                                                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{stat.label}</p>
                                                <p className="text-sm text-gray-600 mt-0.5">{stat.desc}</p>
                                            </div>
                                        </div>
                                        <p className="text-4xl font-black" style={{ color: stat.color }}>{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sin curso */}
                        {!course && (
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                                <div className="text-center py-16 px-6">
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-sm"
                                        style={{ background: "linear-gradient(to bottom right, #540D6E, #EE4266)" }}>
                                        <BookOpen className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Aún no estás inscrito en un curso
                                    </h3>
                                    <p className="text-gray-600 max-w-md mx-auto">
                                        Tu profesor te agregará próximamente a un curso
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ─── CARDS DE MATERIAS ─── */}
                        {course && !activeArea && (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {MATERIAS.map((materia, i) => {
                                        const Icon = materia.icon;
                                        const ovas = ovasByArea[materia.area] ?? [];
                                        const hasOvas = ovas.length > 0;

                                        return (
                                            <button
                                                key={materia.area}
                                                onClick={() => hasOvas && setActiveArea(materia.area)}
                                                disabled={!hasOvas}
                                                className={`text-left bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all duration-300 group relative
                                                    ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                                                    ${hasOvas ? "cursor-pointer hover:shadow-lg hover:-translate-y-1" : "cursor-not-allowed opacity-75"}
                                                `}
                                                style={{
                                                    borderColor: hasOvas ? materia.border : "#E5E7EB",
                                                    transitionDelay: `${i * 60}ms`,
                                                }}
                                            >
                                                <div 
                                                    className="h-1.5 w-full"
                                                    style={{ 
                                                        background: hasOvas 
                                                            ? `linear-gradient(to right, ${materia.color}, ${materia.color}cc)` 
                                                            : "#E5E7EB" 
                                                    }}
                                                />

                                                <div className="p-5">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="p-3 rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-110"
                                                            style={{ backgroundColor: materia.bg }}>
                                                            <Icon className="w-6 h-6" style={{ color: materia.color }} />
                                                        </div>
                                                        
                                                        <div className="text-right">
                                                            <span className="text-2xl font-black" style={{ color: materia.color }}>
                                                                {ovas.length}
                                                            </span>
                                                            <p className="text-xs text-gray-400 font-medium">
                                                                {ovas.length === 1 ? 'Recurso' : 'Recursos'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                        {materia.area}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mb-4">
                                                        {materia.description}
                                                    </p>

                                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                        {hasOvas ? (
                                                            <>
                                                                <div className="flex -space-x-1.5">
                                                                    {[...Array(Math.min(3, ovas.length))].map((_, idx) => (
                                                                        <div 
                                                                            key={idx}
                                                                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                                                            style={{ 
                                                                                backgroundColor: materia.color,
                                                                                opacity: 1 - (idx * 0.15)
                                                                            }}
                                                                        />
                                                                    ))}
                                                                    {ovas.length > 3 && (
                                                                        <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center shadow-sm">
                                                                            <span className="text-gray-600 font-bold text-[10px]">
                                                                                +{ovas.length - 3}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-1 text-sm font-bold transition-all duration-300 group-hover:gap-2"
                                                                    style={{ color: materia.color }}>
                                                                    Explorar <ChevronRight className="w-4 h-4" />
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-gray-400 w-full justify-center">
                                                                <Lock className="w-4 h-4" />
                                                                <span className="text-sm font-medium">Próximamente</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {/* ─── VISTA OVAs de una materia ─── */}
                        {activeArea && activeMateria && (
                            <div className={`transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>

                                {/* Header de retorno */}
                                <div className="mb-8">
                                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                        <div className="flex items-start gap-4">
                                            <button
                                                onClick={() => { setActiveArea(null); setSearch(""); setFilterArea("all"); }}
                                                className="p-4 rounded-xl shadow-sm border bg-white hover:bg-gray-50 transition-colors"
                                                style={{ borderColor: activeMateria.color }}
                                            >
                                                <ChevronLeft className="w-6 h-6" style={{ color: activeMateria.color }} />
                                            </button>
                                            <div className="flex items-start gap-4">
                                                <div className="p-4 rounded-xl shadow-sm border" 
                                                     style={{ backgroundColor: "white", borderColor: activeMateria.color }}>
                                                    <activeMateria.icon className="w-10 h-10" style={{ color: activeMateria.color }} />
                                                </div>
                                                <div>
                                                    <h2 className="text-4xl font-bold text-gray-900 mb-2">{activeArea}</h2>
                                                    <p className="text-gray-600 text-base">
                                                        {ovasByArea[activeArea]?.length ?? 0} recurso{(ovasByArea[activeArea]?.length ?? 0) !== 1 ? "s" : ""} disponible{(ovasByArea[activeArea]?.length ?? 0) !== 1 ? "s" : ""} · {course ? `${GRADE_LABELS[course.grade]} ${course.section}` : ""}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Filtros + Toggle de vista */}
                                <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="flex flex-col lg:flex-row gap-4">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input 
                                                type="text" 
                                                placeholder={`Buscar recurso en ${activeArea}...`} 
                                                value={search}
                                                onChange={e => setSearch(e.target.value)}
                                                className="w-full pl-12 pr-10 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all hover:border-gray-300"
                                                style={{ "--tw-ring-color": "rgba(84, 13, 110, 0.2)" }}
                                                onFocus={e => e.currentTarget.style.borderColor = activeMateria.color}
                                                onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} 
                                            />
                                            {search && (
                                                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <select
                                                value={filterArea}
                                                onChange={e => setFilterArea(e.target.value)}
                                                className="px-4 pr-10 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-offset-2 outline-none transition-all hover:border-gray-300 appearance-none"
                                                style={{ "--tw-ring-color": "rgba(84, 13, 110, 0.2)" }}
                                                onFocus={e => e.currentTarget.style.borderColor = activeMateria.color}
                                                onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
                                            >
                                                <option value="all">Todas las áreas</option>
                                                {areasConOvas.map((area) => (
                                                    <option key={area} value={area}>{area}</option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <ChevronDown className="w-4 h-4 text-gray-400" />
                                            </div>
                                        </div>
                                        
                                        {/* Toggle de vista */}
                                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                            <button
                                                onClick={() => setViewMode("table")}
                                                className={`p-2 rounded-md transition-all duration-200 ${
                                                    viewMode === "table" 
                                                        ? "bg-white shadow-sm" 
                                                        : "text-gray-500 hover:text-gray-700"
                                                }`}
                                                style={{ 
                                                    color: viewMode === "table" ? activeMateria.color : undefined 
                                                }}
                                                title="Vista de tabla"
                                            >
                                                <List className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => setViewMode("grid")}
                                                className={`p-2 rounded-md transition-all duration-200 ${
                                                    viewMode === "grid" 
                                                        ? "bg-white shadow-sm" 
                                                        : "text-gray-500 hover:text-gray-700"
                                                }`}
                                                style={{ 
                                                    color: viewMode === "grid" ? activeMateria.color : undefined 
                                                }}
                                                title="Vista de cuadrícula"
                                            >
                                                <LayoutGrid className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Indicador de filtros activos */}
                                {hasActiveFilters && (
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg" style={{ backgroundColor: activeMateria.bg }}>
                                                    <Filter className="w-4 h-4" style={{ color: activeMateria.color }} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">Filtros Aplicados</p>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {search && (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-medium"
                                                                style={{ backgroundColor: activeMateria.bg, borderColor: activeMateria.color, color: activeMateria.color }}>
                                                                Búsqueda: "{search}"
                                                                <button onClick={() => setSearch("")} className="hover:bg-white/50 p-0.5 rounded">
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </span>
                                                        )}
                                                        {filterArea !== "all" && (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-medium"
                                                                style={{ backgroundColor: activeMateria.bg, borderColor: activeMateria.color, color: activeMateria.color }}>
                                                                Área: {filterArea}
                                                                <button onClick={() => setFilterArea("all")} className="hover:bg-white/50 p-0.5 rounded">
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <button onClick={clearFilters} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all">
                                                <RotateCcw className="w-4 h-4" /> Limpiar
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Contenido - Tabla o Grid */}
                                {activeOvas.length > 0 ? (
                                    viewMode === "table" ? (
                                        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead className="bg-gray-50 border-b border-gray-200">
                                                        <tr>
                                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                                <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Recurso</div>
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Descripción</div>
                                                            </th>
                                                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wide">Acción</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {activeOvas.map((ova) => (
                                                            <tr key={ova.id} className="hover:bg-gray-50 transition-colors">
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center gap-3">
                                                                        {ova.thumbnail ? (
                                                                            <img 
                                                                                src={ova.thumbnail.startsWith('http') ? ova.thumbnail : `/storage/${ova.thumbnail}`}
                                                                                alt={ova.tematica}
                                                                                className="w-12 h-12 rounded-lg object-cover shadow-sm"
                                                                            />
                                                                        ) : (
                                                                            <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm"
                                                                                 style={{ backgroundColor: activeMateria.bg }}>
                                                                                <activeMateria.icon className="w-6 h-6" style={{ color: activeMateria.color }} />
                                                                            </div>
                                                                        )}
                                                                        <div>
                                                                            <p className="text-sm font-bold text-gray-900">{ova.tematica}</p>
                                                                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-xs font-medium"
                                                                                style={{ backgroundColor: activeMateria.bg, color: activeMateria.color }}>
                                                                                <activeMateria.icon className="w-3 h-3" />
                                                                                {ova.area}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <p className="text-sm text-gray-600 max-w-lg line-clamp-2">
                                                                        {ova.description || "Sin descripción disponible"}
                                                                    </p>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                                    {ova.url ? (
                                                                        <a
                                                                            href={`${ova.url}?ova_id=${ova.id}&course_id=${ova.course?.id}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm hover:shadow-md"
                                                                            style={{ 
                                                                                backgroundColor: activeMateria.color,
                                                                                color: activeMateria.textColor || '#FFFFFF'
                                                                            }}
                                                                            onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                                                                            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                                                                        >
                                                                            <PlayCircle className="w-4 h-4" /> Abrir recurso
                                                                        </a>
                                                                    ) : (
                                                                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-400 bg-gray-50 border border-gray-200">
                                                                            <Clock className="w-4 h-4" /> Próximamente
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                            {activeOvas.map((ova, i) => (
                                                <div key={ova.id} 
                                                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-gray-100"
                                                    style={{ animation: `fadeUp 0.4s ease-out ${i * 60}ms both` }}>
                                                    
                                                    {ova.thumbnail ? (
                                                        <div className="relative overflow-hidden h-40">
                                                            <img
                                                                src={ova.thumbnail.startsWith('http') ? ova.thumbnail : `/storage/${ova.thumbnail}`}
                                                                alt={ova.tematica}
                                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                                        </div>
                                                    ) : (
                                                        <div className="h-40 flex flex-col items-center justify-center relative overflow-hidden"
                                                            style={{ 
                                                                background: `linear-gradient(135deg, ${activeMateria.color}20, ${activeMateria.color}10)`
                                                            }}>
                                                            <activeMateria.icon className="w-14 h-14 mb-2 opacity-30 transition-transform duration-300 group-hover:scale-110"
                                                                style={{ color: activeMateria.color }} />
                                                            <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10"
                                                                style={{ backgroundColor: activeMateria.color }} />
                                                            <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full opacity-10"
                                                                style={{ backgroundColor: activeMateria.color }} />
                                                        </div>
                                                    )}

                                                    <div className="p-5">
                                                        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full mb-3"
                                                            style={{ backgroundColor: activeMateria.bg, color: activeMateria.color }}>
                                                            <activeMateria.icon className="w-3 h-3" />
                                                            {ova.area}
                                                        </span>

                                                        <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 leading-snug">
                                                            {ova.tematica}
                                                        </h3>

                                                        {ova.description && (
                                                            <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                                                                {ova.description}
                                                            </p>
                                                        )}

                                                        {ova.url ? (
                                                            <a href={`${ova.url}?ova_id=${ova.id}&course_id=${ova.course?.id}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                                                                style={{ 
                                                                    backgroundColor: activeMateria.color,
                                                                    color: activeMateria.textColor || '#FFFFFF'
                                                                }}
                                                                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                                                                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                                                                <PlayCircle className="w-4 h-4" /> Abrir recurso OVA
                                                            </a>
                                                        ) : (
                                                            <div className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-gray-400 rounded-xl bg-gray-50 border border-gray-100">
                                                                <Clock className="w-4 h-4" /> Recurso próximamente
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                ) : (
                                    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                                        <div className="text-center py-16 px-6">
                                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-sm"
                                                style={{ backgroundColor: activeMateria.bg }}>
                                                <Search className="w-10 h-10" style={{ color: activeMateria.color }} />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {search || filterArea !== "all" ? "No se encontraron recursos" : "No hay recursos en esta materia"}
                                            </h3>
                                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                                {search || filterArea !== "all" ? "Intente modificar los criterios de búsqueda" : "Pronto tendrás contenido disponible"}
                                            </p>
                                            {hasActiveFilters && (
                                                <button 
                                                    onClick={clearFilters}
                                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
                                                >
                                                    <RotateCcw className="w-5 h-5" /> Limpiar Filtros
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </main>

            <style>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { 
                    opacity: 0;
                    animation: fadeIn 0.3s ease-out forwards; 
                }
                .animate-slide-up { 
                    animation: slideUp 0.3s ease-out forwards; 
                }
            `}</style>
        </>
    );
}