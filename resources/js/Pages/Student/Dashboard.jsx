import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    BookOpen, Layers, Eye, ChevronRight, GraduationCap,
    Video, Clock, X, ChevronLeft, FlaskConical,
    Globe, BookMarked, Calculator, Languages, Sparkles,
    PlayCircle, Lock
} from "lucide-react";
import AppSidebar, { useSidebarState } from "@/Components/AppSidebar";

const MATERIAS = [
    {
        area:        'Ciencias Naturales',
        icon:        FlaskConical,
        color:       '#0EAD69',
        bg:          '#E8F5F0',
        bgCard:      'linear-gradient(135deg, #0EAD6920, #3BCEAC10)',
        border:      '#0EAD6930',
        emoji:       '🔬',
    },
    {
        area:        'Ciencias Sociales',
        icon:        Globe,
        color:       '#EE4266',
        bg:          '#FEE2E2',
        bgCard:      'linear-gradient(135deg, #EE426620, #FFD23F10)',
        border:      '#EE426630',
        emoji:       '🌍',
    },
    {
        area:        'Español',
        icon:        BookMarked,
        color:       '#540D6E',
        bg:          '#F3E8FF',
        bgCard:      'linear-gradient(135deg, #540D6E20, #EE426610)',
        border:      '#540D6E30',
        emoji:       '📖',
    },
    {
        area:        'Matemáticas',
        icon:        Calculator,
        color:       '#1D4ED8',
        bg:          '#DBEAFE',
        bgCard:      'linear-gradient(135deg, #1D4ED820, #60A5FA10)',
        border:      '#1D4ED830',
        emoji:       '📐',
    },
    {
        area:        'Inglés',
        icon:        Languages,
        color:       '#D97706',
        bg:          '#FEF3C7',
        bgCard:      'linear-gradient(135deg, #D9770620, #FFD23F10)',
        border:      '#D9770630',
        emoji:       '🗣️',
    },
];

const GRADE_LABELS = {
    primero: 'Primero', segundo: 'Segundo', tercero: 'Tercero',
    cuarto: 'Cuarto', quinto: 'Quinto',
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

export default function StudentDashboard({ courses = [] }) {
    const [collapsed]  = useSidebarState();
    const [activeArea, setActiveArea] = useState(null);
    const [search,     setSearch]     = useState("");
    const [visible,    setVisible]    = useState(false);

    const course     = courses[0] ?? null;
    const ovasByArea = groupOvasByArea(courses);
    const totalOvas  = Object.values(ovasByArea).flat().length;

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    const activeOvas = activeArea
        ? (ovasByArea[activeArea] ?? []).filter(o =>
            o.tematica.toLowerCase().includes(search.toLowerCase()) ||
            (o.description ?? "").toLowerCase().includes(search.toLowerCase())
          )
        : [];

    const activeMateria = MATERIAS.find(m => m.area === activeArea);

    return (
        <>
            <Head title="Mis Materias" />
            <AppSidebar currentRoute="student.dashboard" />

            <main className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-20" : "lg:ml-72"} min-h-screen`}
               >

                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">

                        {/* ── Hero Banner ── */}
                        <div className={`mb-8 rounded-2xl overflow-hidden shadow-lg transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                            style={{ background: "linear-gradient(135deg, #540D6E 0%, #7C3AED 50%, #EE4266 100%)" }}>
                            <div className="relative px-8 py-8 flex items-center justify-between">
                                {/* Círculos decorativos */}
                                <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
                                    style={{ background: "white", transform: "translate(30%, -30%)" }} />
                                <div className="absolute bottom-0 left-1/2 w-40 h-40 rounded-full opacity-10"
                                    style={{ background: "white", transform: "translate(-50%, 50%)" }} />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-5 h-5 text-yellow-300" />
                                        <span className="text-yellow-300 text-sm font-semibold">¡Bienvenido de vuelta!</span>
                                    </div>
                                    <h1 className="text-3xl font-black text-white mb-1">
                                        Mis Materias
                                    </h1>
                                    {course ? (
                                        <p className="text-purple-200 text-sm">
                                            {GRADE_LABELS[course.grade] ?? course.grade} · Sección {course.section} · Año {course.school_year}
                                        </p>
                                    ) : (
                                        <p className="text-purple-200 text-sm">Explora tus recursos educativos</p>
                                    )}
                                </div>

                                <div className="relative z-10 hidden sm:block">
                                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                                        style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
                                        <GraduationCap className="w-10 h-10 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Barra de progreso decorativa */}
                            <div className="px-8 pb-5 relative z-10">
                                <div className="flex items-center justify-between text-xs text-purple-200 mb-1.5">
                                    <span>{totalOvas} OVAs disponibles en tu curso</span>
                                    <span>{MATERIAS.filter(m => (ovasByArea[m.area]?.length ?? 0) > 0).length} de {MATERIAS.length} materias activas</span>
                                </div>
                                <div className="h-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                                    <div className="h-1.5 rounded-full transition-all duration-1000"
                                        style={{
                                            width: `${(MATERIAS.filter(m => (ovasByArea[m.area]?.length ?? 0) > 0).length / MATERIAS.length) * 100}%`,
                                            background: "linear-gradient(to right, #FFD23F, #3BCEAC)"
                                        }} />
                                </div>
                            </div>
                        </div>

                        {/* ── Sin curso ── */}
                        {!course && (
                            <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 py-16 text-center transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                                <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                    style={{ background: "linear-gradient(135deg,#540D6E15,#EE426615)" }}>
                                    <BookOpen className="w-12 h-12" style={{ color: "#540D6E40" }} />
                                </div>
                                <p className="text-lg font-bold text-gray-700 mb-2">Aún no estás inscrito en un curso</p>
                                <p className="text-sm text-gray-400">Tu profesor te agregará próximamente</p>
                            </div>
                        )}

                        {/* ── Vista principal: materias ── */}
                        {course && !activeArea && (
                            <>
                                <p className={`text-xs font-bold text-gray-400 uppercase tracking-wider mb-5 transition-all duration-700 delay-100 ${visible ? "opacity-100" : "opacity-0"}`}>
                                    Selecciona una materia para ver sus recursos
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {MATERIAS.map((materia, i) => {
                                        const Icon    = materia.icon;
                                        const ovas    = ovasByArea[materia.area] ?? [];
                                        const hasOvas = ovas.length > 0;

                                        return (
                                            <button key={materia.area}
                                                onClick={() => hasOvas && setActiveArea(materia.area)}
                                                disabled={!hasOvas}
                                                className={`text-left rounded-2xl border-2 overflow-hidden transition-all duration-500 group relative
                                                    ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                                                    ${hasOvas ? "cursor-pointer hover:shadow-xl hover:-translate-y-1" : "cursor-not-allowed"}
                                                `}
                                                style={{
                                                    borderColor:     hasOvas ? materia.border : "#E5E7EB",
                                                    backgroundColor: "white",
                                                    transitionDelay: `${150 + i * 80}ms`,
                                                }}
                                                onMouseEnter={e => { if (hasOvas) e.currentTarget.style.borderColor = materia.color; }}
                                                onMouseLeave={e => { if (hasOvas) e.currentTarget.style.borderColor = materia.border; }}
                                            >
                                                {/* Franja de color superior */}
                                                <div className="h-1.5 w-full"
                                                    style={{ background: hasOvas ? `linear-gradient(to right, ${materia.color}, ${materia.color}88)` : "#E5E7EB" }} />

                                                {/* Fondo hover */}
                                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                                    style={{ background: materia.bgCard }} />

                                                <div className="relative p-6">
                                                    <div className="flex items-start justify-between mb-5">
                                                        <div className="relative">
                                                            <div className="p-3.5 rounded-2xl transition-transform duration-300 group-hover:scale-110"
                                                                style={{ backgroundColor: materia.bg }}>
                                                                <Icon className="w-7 h-7" style={{ color: materia.color }} />
                                                            </div>
                                                            {/* Emoji flotante */}
                                                            <span className="absolute -top-1 -right-1 text-base">{materia.emoji}</span>
                                                        </div>

                                                        {hasOvas ? (
                                                            <div className="text-right">
                                                                <span className="text-2xl font-black" style={{ color: materia.color }}>
                                                                    {ovas.length}
                                                                </span>
                                                                <p className="text-xs text-gray-400 leading-none">
                                                                    OVA{ovas.length !== 1 ? 's' : ''}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <Lock className="w-4 h-4 text-gray-300 mt-1" />
                                                        )}
                                                    </div>

                                                    <h3 className="text-base font-bold text-gray-900 mb-1">{materia.area}</h3>

                                                    {hasOvas ? (
                                                        <div className="flex items-center justify-between mt-3">
                                                            {/* Mini pills de OVAs */}
                                                            <div className="flex -space-x-1">
                                                                {ovas.slice(0, 3).map((_, idx) => (
                                                                    <div key={idx} className="w-5 h-5 rounded-full border-2 border-white"
                                                                        style={{ backgroundColor: materia.color + (idx === 0 ? 'FF' : idx === 1 ? 'BB' : '77') }} />
                                                                ))}
                                                                {ovas.length > 3 && (
                                                                    <div className="w-5 h-5 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
                                                                        <span className="text-gray-600 font-bold" style={{ fontSize: "8px" }}>+{ovas.length - 3}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-1 text-xs font-bold transition-transform duration-300 group-hover:translate-x-1"
                                                                style={{ color: materia.color }}>
                                                                Explorar <ChevronRight className="w-3.5 h-3.5" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs text-gray-400 mt-1">Sin recursos asignados</p>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {/* ── Vista de OVAs de una materia ── */}
                        {activeArea && activeMateria && (
                            <div className={`transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>

                                {/* Header de la materia */}
                                <div className="flex items-center gap-4 mb-6">
                                    <button onClick={() => { setActiveArea(null); setSearch(""); }}
                                        className="p-2.5 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-white bg-white/80 transition-all shadow-sm">
                                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="p-3 rounded-2xl" style={{ backgroundColor: activeMateria.bg }}>
                                            <activeMateria.icon className="w-6 h-6" style={{ color: activeMateria.color }} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-gray-900">{activeArea}</h2>
                                            <p className="text-sm text-gray-500">
                                                {ovasByArea[activeArea]?.length ?? 0} recurso{(ovasByArea[activeArea]?.length ?? 0) !== 1 ? "s" : ""} · {course ? `${GRADE_LABELS[course.grade]} ${course.section}` : ""}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Buscador */}
                                <div className="relative mb-6">
                                    <input type="text"
                                        placeholder={`Buscar en ${activeArea}...`}
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="w-full pl-5 pr-10 py-3.5 text-sm border-2 rounded-xl focus:outline-none transition-all bg-white shadow-sm"
                                        style={{ borderColor: "#E5E7EB" }}
                                        onFocus={e => e.currentTarget.style.borderColor = activeMateria.color}
                                        onBlur={e  => e.currentTarget.style.borderColor = "#E5E7EB"}
                                    />
                                    {search && (
                                        <button onClick={() => setSearch("")}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Sin resultados */}
                                {activeOvas.length === 0 && (
                                    <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center shadow-sm">
                                        <Layers className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                        <p className="text-base font-semibold text-gray-500">
                                            {search ? "Sin resultados para esta búsqueda" : "No hay OVAs en esta materia"}
                                        </p>
                                        {search && (
                                            <button onClick={() => setSearch("")}
                                                className="text-sm mt-2 font-semibold hover:underline"
                                                style={{ color: activeMateria.color }}>
                                                Limpiar búsqueda
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Grid OVAs */}
                                {activeOvas.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {activeOvas.map((ova, i) => (
                                            <OvaCard key={ova.id} ova={ova} materia={activeMateria} index={i} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </main>

            {/* Fondo */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: "radial-gradient(circle at 1px 1px,rgba(84,13,110,0.04) 1px,transparent 0)",
                    backgroundSize: "32px 32px"
                }} />
                <div className="absolute top-0 left-0 w-full h-1" style={{
                    background: "linear-gradient(to right,#540D6E,#EE4266,#FFD23F,#3BCEAC,#0EAD69)"
                }} />
            </div>

            <style>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-up { animation: fadeUp 0.5s ease-out forwards; }
            `}</style>
        </>
    );
}

// ─── Tarjeta OVA ──────────────────────────────────────────────────────────────
function OvaCard({ ova, materia, index }) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group animate-fade-up border border-gray-100"
            style={{ animationDelay: `${index * 80}ms` }}>

            {/* Thumbnail */}
            {ova.thumbnail ? (
                <div className="relative overflow-hidden h-44">
                    <img src={ova.thumbnail.startsWith('http') ? ova.thumbnail : `/storage/${ova.thumbnail}`}
                        alt={ova.tematica}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
            ) : (
                <div className="h-44 flex flex-col items-center justify-center relative overflow-hidden"
                    style={{ background: materia.bgCard }}>
                    <materia.icon className="w-14 h-14 mb-2 opacity-20 transition-transform duration-300 group-hover:scale-110"
                        style={{ color: materia.color }} />
                    <span className="text-3xl">{materia.emoji}</span>
                    {/* Círculos decorativos */}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10"
                        style={{ backgroundColor: materia.color }} />
                    <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full opacity-10"
                        style={{ backgroundColor: materia.color }} />
                </div>
            )}

            <div className="p-5">
                {/* Badge área */}
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full mb-3"
                    style={{ backgroundColor: materia.bg, color: materia.color }}>
                    <materia.icon className="w-3 h-3" />
                    {ova.area}
                </span>

                {/* Temática */}
                <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 leading-snug">
                    {ova.tematica}
                </h3>

                {/* Descripción */}
                {ova.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{ova.description}</p>
                )}

                {/* Botón */}
                {ova.url ? (
                    <a href={ova.url} target="_blank" rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                        style={{ backgroundColor: materia.color }}
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
    );
}