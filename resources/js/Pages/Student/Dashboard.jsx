import { Head, Link, usePage, router } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import {
    BookOpen, Layers, ChevronRight, GraduationCap,
    Clock, X, ChevronLeft, PlayCircle, Lock, Search, Filter,
    RotateCcw, ChevronDown, Calculator, BookMarked, 
    FlaskConical, Globe, Languages, LayoutGrid, List, Palette,
    CheckCircle, Sparkles, User, ChevronsLeft, ChevronsRight, Star, Compass
} from "lucide-react";
import AppSidebar, { useSidebarState } from "@/Components/AppSidebar";

// ─── Configuración de materias con colores de la paleta ───────────────────────
const MATERIAS = [
    {
        area:    'Matemáticas',
        icon:    Calculator,
        color:   '#FFD23F',
        bg:      'rgba(255, 210, 63, 0.15)',
        border:  '#FFD23F',
        description: 'Números y operaciones',
        textColor: '#374151',
        gradient: 'linear-gradient(135deg, rgba(255, 210, 63, 0.12), rgba(245, 192, 0, 0.06))',
        glow: '0 0 20px rgba(255, 210, 63, 0.15)'
    },
    {
        area:    'Español',
        icon:    BookMarked,
        color:   '#540D6E',
        bg:      'rgba(187, 98, 220, 0.15)',
        border:  '#540D6E',
        description: 'Lectura y escritura',
        textColor: '#FFFFFF',
        gradient: 'linear-gradient(135deg, rgba(84, 13, 110, 0.12), rgba(107, 22, 137, 0.06))',
        glow: '0 0 20px rgba(84, 13, 110, 0.15)'
    },
    {
        area:    'Ciencias Naturales',
        icon:    FlaskConical,
        color:   '#0EAD69',
        bg:      'rgba(14, 173, 105, 0.15)',
        border:  '#0EAD69',
        description: 'Explora el mundo natural',
        textColor: '#FFFFFF',
        gradient: 'linear-gradient(135deg, rgba(14, 173, 105, 0.12), rgba(59, 206, 172, 0.06))',
        glow: '0 0 20px rgba(14, 173, 105, 0.15)'
    },
    {
        area:    'Ciencias Sociales',
        icon:    Globe,
        color:   '#EE4266',
        bg:      'rgba(238, 66, 102, 0.15)',
        border:  '#EE4266',
        description: 'Descubre historia y geografía',
        textColor: '#FFFFFF',
        gradient: 'linear-gradient(135deg, rgba(238, 66, 102, 0.12), rgba(255, 107, 107, 0.06))',
        glow: '0 0 20px rgba(238, 66, 102, 0.15)'
    },
    {
        area:    'Inglés',
        icon:    Languages,
        color:   '#3BCEAC',
        bg:      'rgba(59, 206, 172, 0.15)',
        border:  '#3BCEAC',
        description: 'Aprende un nuevo idioma',
        textColor: '#FFFFFF',
        gradient: 'linear-gradient(135deg, rgba(59, 206, 172, 0.12), rgba(43, 168, 142, 0.06))',
        glow: '0 0 20px rgba(59, 206, 172, 0.15)'
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

// ─── Componente de Slider Circular Continuo con transición lateral ────────────
function SubjectSlider({ subjects, onSelectSubject, visible }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const autoPlayRef = useRef(null);
    const itemsPerPage = 3;
    
    const extendedSubjects = [...subjects, ...subjects, ...subjects];
    const startIndex = subjects.length;
    const visibleSubjects = extendedSubjects.slice(
        startIndex + currentIndex,
        startIndex + currentIndex + itemsPerPage
    );

    const nextSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => prev + 1);
        setTimeout(() => setIsAnimating(false), 400);
    };

    const prevSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => prev - 1);
        setTimeout(() => setIsAnimating(false), 400);
    };

    useEffect(() => {
        if (currentIndex >= subjects.length) {
            setTimeout(() => {
                setCurrentIndex(currentIndex - subjects.length);
                setTimeout(() => setIsAnimating(false), 50);
            }, 400);
        } else if (currentIndex < 0) {
            setTimeout(() => {
                setCurrentIndex(currentIndex + subjects.length);
                setTimeout(() => setIsAnimating(false), 50);
            }, 400);
        }
    }, [currentIndex, subjects.length]);

    useEffect(() => {
        if (isAutoPlaying && subjects.length > itemsPerPage) {
            autoPlayRef.current = setInterval(() => {
                nextSlide();
            }, 5000);
        }
        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        };
    }, [isAutoPlaying, subjects.length]);

    const handleMouseEnter = () => setIsAutoPlaying(false);
    const handleMouseLeave = () => setIsAutoPlaying(true);

    if (subjects.length === 0) return null;

    return (
        <div 
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {subjects.length > itemsPerPage && (
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={prevSlide}
                        className="p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 hover:scale-110"
                        style={{ backgroundColor: 'white' }}
                    >
                        <ChevronsLeft className="w-5 h-5" style={{ color: '#540D6E' }} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 hover:scale-110"
                        style={{ backgroundColor: 'white' }}
                    >
                        <ChevronsRight className="w-5 h-5" style={{ color: '#540D6E' }} />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-400 ease-in-out">
                {visibleSubjects.map((subject, idx) => {
                    const Icon = subject.icon;
                    const hasContent = subject.ovas && subject.ovas.length > 0;
                    const delay = idx * 100;
                    
                    return (
                        <button
                            key={`${subject.area}-${currentIndex}-${idx}`}
                            onClick={() => hasContent && onSelectSubject(subject.area)}
                            disabled={!hasContent}
                            className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                                visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                            } ${hasContent ? 'cursor-pointer hover:-translate-y-2' : 'cursor-not-allowed opacity-60'}`}
                            style={{
                                transitionDelay: `${delay}ms`,
                                animation: `fadeInRight 0.5s ease-out ${delay}ms both`,
                                background: subject.gradient,
                                backdropFilter: 'blur(12px)',
                                border: `1px solid ${subject.color}40`,
                                boxShadow: subject.glow
                            }}
                        >
                            <div 
                                className="absolute top-0 left-0 h-1.5 transition-all duration-300 group-hover:h-2"
                                style={{ 
                                    width: '100%',
                                    background: `linear-gradient(to right, ${subject.color}, ${subject.color}cc)`
                                }}
                            />
                            
                            <div className="relative p-6 h-full flex flex-col min-h-[260px]">
                                <div className="flex items-start justify-between mb-4">
                                    <div 
                                        className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-md"
                                        style={{ backgroundColor: subject.bg }}
                                    >
                                        <Icon className="w-8 h-8" style={{ color: subject.color }} />
                                    </div>
                                    
                                    <div className="text-right">
                                        <span 
                                            className="text-3xl font-black"
                                            style={{ fontFamily: "'Chewy', cursive", color: subject.color }}
                                        >
                                            {subject.ovas?.length || 0}
                                        </span>
                                        <p className="text-xs text-gray-400 font-medium">
                                            {(subject.ovas?.length || 0) === 1 ? 'Recurso' : 'Recursos'}
                                        </p>
                                    </div>
                                </div>
                                
                                <h3 className="text-xl font-bold mb-3 transition-colors duration-300 text-gray-800">
                                    {subject.area}
                                </h3>
                                
                                <p className="text-lg text-gray-600 mb-4 flex-1 leading-relaxed">
                                    {subject.description}
                                </p>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100/50">
                                    {hasContent ? (
                                        <>
                                            <div className="flex -space-x-2">
                                                {[...Array(Math.min(3, subject.ovas.length))].map((_, idx2) => (
                                                    <div 
                                                        key={idx2}
                                                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm transition-transform duration-300 group-hover:scale-110"
                                                        style={{ 
                                                            backgroundColor: subject.color,
                                                            opacity: 1 - (idx2 * 0.15),
                                                            boxShadow: `0 0 8px ${subject.color}80`
                                                        }}
                                                    />
                                                ))}
                                                {subject.ovas.length > 3 && (
                                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center shadow-sm">
                                                        <span className="text-gray-600 font-bold text-xs">
                                                            +{subject.ovas.length - 3}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div 
                                                className="flex items-center gap-1 text-sm font-bold transition-all duration-300 group-hover:gap-2"
                                                style={{ color: subject.color }}
                                            >
                                                Explorar <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                            
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500">
                                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
                            </div>
                        </button>
                    );
                })}
            </div>
            
            {subjects.length > itemsPerPage && (
                <div className="flex justify-center gap-3 mt-10">
                    {subjects.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                if (isAnimating) return;
                                setIsAnimating(true);
                                setCurrentIndex(idx);
                                setTimeout(() => setIsAnimating(false), 400);
                            }}
                            className="transition-all duration-300 rounded-full"
                            style={{
                                width: (currentIndex % subjects.length) === idx ? '32px' : '8px',
                                height: '8px',
                                backgroundColor: (currentIndex % subjects.length) === idx ? '#540D6E' : '#E5E7EB',
                                boxShadow: (currentIndex % subjects.length) === idx ? '0 0 8px rgba(84, 13, 110, 0.5)' : 'none'
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Componente de Tabla de OVAs ──────────────────────────────────────────────
function OVATable({ ovas, materia, courseId }) {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
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
                        {ovas.map((ova) => (
                            <tr key={ova.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {ova.thumbnail ? (
                                            <img 
                                                src={ova.thumbnail.startsWith('http') ? ova.thumbnail : `/storage/${ova.thumbnail}`}
                                                alt={ova.tematica}
                                                className="w-12 h-12 rounded-xl object-cover shadow-sm"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                                                style={{ backgroundColor: materia.bg }}>
                                                <materia.icon className="w-6 h-6" style={{ color: materia.color }} />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{ova.tematica}</p>
                                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-lg text-xs font-medium"
                                                style={{ backgroundColor: materia.bg, color: materia.color }}>
                                                <materia.icon className="w-3 h-3" />
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
                                            href={`${ova.url}?ova_id=${ova.id}&course_id=${courseId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg"
                                            style={{ 
                                                backgroundColor: materia.color,
                                                color: materia.textColor || '#FFFFFF'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                                            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                                        >
                                            <PlayCircle className="w-4 h-4" /> Abrir recurso
                                        </a>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 bg-gray-50 border border-gray-200">
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
    );
}

// ─── Componente de OVAs en Grid ──────────────────────────────────────────────
function OVAGrid({ ovas, materia, courseId }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ovas.map((ova, index) => (
                <div 
                    key={ova.id} 
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-200"
                    style={{ 
                        animation: `fadeUp 0.5s ease-out ${index * 80}ms both`,
                        borderTop: `4px solid ${materia.color}`
                    }}
                >
                    {/* Cabecera con color sólido y patrón decorativo */}
                    <div className="relative overflow-hidden h-32" style={{ backgroundColor: `${materia.color}10` }}>
                        
                        {/* Círculos decorativos estáticos */}
                        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full" style={{ backgroundColor: materia.color, opacity: 0.12 }} />
                        <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full" style={{ backgroundColor: materia.color, opacity: 0.1 }} />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full" style={{ backgroundColor: materia.color, opacity: 0.08 }} />
                        
                        {/* Contenido de la cabecera */}
                        {ova.thumbnail ? (
                            <>
                                <img
                                    src={ova.thumbnail.startsWith('http') ? ova.thumbnail : `/storage/${ova.thumbnail}`}
                                    alt={ova.tematica}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 relative z-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            </>
                        ) : (
                            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                                <materia.icon className="w-14 h-14" style={{ color: materia.color, opacity: 0.5 }} />
                            </div>
                        )}
                        
                        {/* Badge de área */}
                        <div className="absolute top-3 left-3 z-10">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/95 backdrop-blur-sm shadow-md"
                                style={{ color: materia.color }}>
                                <materia.icon className="w-3 h-3" />
                                {ova.area}
                            </span>
                        </div>
                    </div>
                    
                    {/* Contenido con más espacio */}
                    <div className="p-5">
                        <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 leading-relaxed group-hover:text-purple-900 transition-colors duration-300">
                            {ova.tematica}
                        </h3>
                        
                        {ova.description && (
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                                {ova.description}
                            </p>
                        )}
                        
                        {/* Línea decorativa */}
                        <div className="mb-4">
                            <div className="w-12 h-0.5 rounded-full" style={{ backgroundColor: materia.color, opacity: 0.3 }} />
                        </div>
                        
                        {ova.url ? (
                            <a
                                href={`${ova.url}?ova_id=${ova.id}&course_id=${courseId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                                style={{ 
                                    backgroundColor: materia.color,
                                    color: materia.textColor || '#FFFFFF'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                            >
                                <PlayCircle className="w-4 h-4" /> 
                                <span>Comenzar recurso</span>
                            </a>
                        ) : (
                            <div className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-gray-400 rounded-xl bg-gray-50 border border-gray-100">
                                <Clock className="w-4 h-4" /> 
                                <span>Próximamente</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Modal de Avatar ──────────────────────────────────────────────────────────
function AvatarPickerModal({ onClose, onSuccess }) {
    const [selected, setSelected] = useState(null);
    const [saving, setSaving] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [step, setStep] = useState(1);

    const handleSave = () => {
        if (!selected || saving) return;
        setSaving(true);
        router.post(
            route('student.avatar.store'),
            { avatar: selected },
            {
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => {
                    setConfirmed(true);
                    setTimeout(() => {
                        onClose();
                        if (onSuccess) onSuccess();
                    }, 1200);
                },
                onFinish: () => setSaving(false),
            }
        );
    };

    const selectedAvatar = AVATARS.find(a => a.id === selected);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay sin onClick — no se puede cerrar haciendo clic afuera */}
            <div
                className="absolute inset-0"
                style={{ background: "rgba(84, 13, 110, 0.18)", backdropFilter: "blur(6px)" }}
            />

            <div
                className="relative w-full"
                style={{
                    maxWidth: "500px",
                    borderRadius: "28px",
                    background: "#FFFFFF",
                    border: "1.5px solid rgba(84, 13, 110, 0.12)",
                    boxShadow: "0 24px 60px rgba(84,13,110,0.18), 0 8px 24px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                    animation: "avatarModalIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both",
                }}
            >
                {/* Franja superior con los colores de la plataforma */}
                <div style={{
                    height: "5px",
                    background: "linear-gradient(90deg, #540D6E 0%, #EE4266 45%, #FFD23F 100%)",
                }}/>

                {/* ─── PASO 1: Bienvenida ─── */}
                {step === 1 && (
                    <div style={{ padding: "44px 40px 40px", textAlign: "center", animation: "fadeSlideIn 0.35s ease both" }}>

                        {/* Ícono central */}
                        <div style={{ position: "relative", display: "inline-flex", marginBottom: "28px" }}>
                            {/* Anillo exterior decorativo */}
                            <div style={{
                                position: "absolute", inset: "-14px",
                                borderRadius: "50%",
                                border: "1.5px dashed rgba(84,13,110,0.2)",
                                animation: "spinSlow 18s linear infinite",
                            }}/>
                            <div style={{
                                width: "80px", height: "80px", borderRadius: "50%",
                                background: "linear-gradient(135deg, #F3E8FF, #EDE0F7)",
                                border: "2px solid rgba(84,13,110,0.15)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 8px 24px rgba(84,13,110,0.15)",
                            }}>
                                <Palette style={{ width: "36px", height: "36px", color: "#540D6E" }} />
                            </div>
                        </div>

                        <h2 style={{
                            fontSize: "28px", fontWeight: 800, margin: "0 0 10px",
                            fontFamily: "'Chewy', cursive",
                            color: "#540D6E",
                            letterSpacing: "0.5px",
                        }}>
                            Elige tu personaje
                        </h2>
                        <p style={{
                            color: "#6B7280", fontSize: "15px", lineHeight: 1.65,
                            margin: "0 0 32px", maxWidth: "320px",
                            marginLeft: "auto", marginRight: "auto",
                            fontFamily: "'Quicksand', sans-serif",
                        }}>
                            Selecciona el personaje que te acompañará en tu aventura de aprendizaje.
                        </p>

                        {/* Previa de avatares */}
                        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "36px" }}>
                            {AVATARS.map((av, i) => (
                                <div
                                    key={av.id}
                                    style={{
                                        width: "40px", height: "40px", borderRadius: "50%",
                                        background: `${av.color}18`,
                                        border: `2px solid ${av.color}40`,
                                        overflow: "hidden",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        animation: `popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 60}ms both`,
                                        boxShadow: `0 4px 10px ${av.color}25`,
                                        transition: "transform 0.2s",
                                    }}
                                >
                                    <img
                                        src={`/avatars/${av.id}.png`}
                                        alt=""
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        onError={e => { e.currentTarget.style.display = "none"; }}
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            style={{
                                width: "100%", padding: "15px 24px",
                                borderRadius: "16px", border: "none", cursor: "pointer",
                                background: "linear-gradient(135deg, #540D6E 0%, #8B1FA8 100%)",
                                color: "#fff", fontSize: "16px", fontWeight: 700,
                                fontFamily: "'Quicksand', sans-serif",
                                boxShadow: "0 8px 24px rgba(84,13,110,0.35)",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                transition: "all 0.25s ease",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(84,13,110,0.45)"; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(84,13,110,0.35)"; }}
                        >
                            Ver personajes
                            <ChevronRight style={{ width: "16px", height: "16px" }} />
                        </button>

                        <p style={{
                            marginTop: "16px", marginBottom: 0,
                            fontSize: "12px", color: "#9CA3AF",
                            fontFamily: "'Quicksand', sans-serif",
                        }}>
                            Podrás cambiar tu personaje en cualquier momento
                        </p>
                    </div>
                )}

                {/* ─── PASO 2: Selección ─── */}
                {step === 2 && (
                    <div style={{ animation: "fadeSlideIn 0.35s ease both" }}>

                        {/* Header */}
                        <div style={{
                            padding: "24px 32px 20px",
                            borderBottom: "1px solid rgba(84,13,110,0.08)",
                            display: "flex", alignItems: "center", gap: "12px",
                        }}>
                            <button
                                onClick={() => setStep(1)}
                                style={{
                                    width: "34px", height: "34px", borderRadius: "10px",
                                    background: "rgba(84,13,110,0.06)",
                                    border: "1px solid rgba(84,13,110,0.12)",
                                    cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    transition: "all 0.2s", flexShrink: 0, color: "#540D6E",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(84,13,110,0.12)"}
                                onMouseLeave={e => e.currentTarget.style.background = "rgba(84,13,110,0.06)"}
                            >
                                <ChevronLeft style={{ width: "16px", height: "16px" }} />
                            </button>
                            <div>
                                <h3 style={{
                                    fontSize: "20px", fontWeight: 800, margin: 0,
                                    fontFamily: "'Chewy', cursive", color: "#540D6E",
                                    letterSpacing: "0.3px",
                                }}>
                                    Tu personaje
                                </h3>
                            </div>
                        </div>

                        {/* Grid de avatares */}
                        <div style={{
                            padding: "20px 24px",
                            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px",
                        }}>
                            {AVATARS.map((av, i) => {
                                const isSelected = selected === av.id;
                                return (
                                    <button
                                        key={av.id}
                                        onClick={() => setSelected(av.id)}
                                        style={{
                                            borderRadius: "18px", border: "none", cursor: "pointer",
                                            padding: "16px 8px 14px",
                                            background: isSelected ? `${av.color}10` : "#FAFAFA",
                                            outline: isSelected ? `2px solid ${av.color}` : "1.5px solid #F0F0F0",
                                            display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
                                            transition: "all 0.25s cubic-bezier(0.34,1.2,0.64,1)",
                                            transform: isSelected ? "scale(1.04)" : "scale(1)",
                                            boxShadow: isSelected ? `0 6px 20px ${av.color}30` : "none",
                                            animation: `popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 50}ms both`,
                                        }}
                                        onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.background = `${av.color}08`; e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.outline = `1.5px solid ${av.color}40`; } }}
                                        onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.background = "#FAFAFA"; e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.outline = "1.5px solid #F0F0F0"; } }}
                                    >
                                        {/* Imagen del avatar */}
                                        <div style={{
                                            width: "68px", height: "68px", borderRadius: "50%",
                                            overflow: "hidden", position: "relative",
                                            background: `${av.color}18`,
                                            border: `2.5px solid ${isSelected ? av.color : av.color + "30"}`,
                                            boxShadow: isSelected ? `0 0 0 4px ${av.color}15` : "none",
                                            transition: "all 0.25s ease",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                            <img
                                                src={`/avatars/${av.id}.png`}
                                                alt={av.label}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                onError={e => { e.currentTarget.style.display = "none"; }}
                                            />
                                            {isSelected && (
                                                <div style={{
                                                    position: "absolute", bottom: "-1px", right: "-1px",
                                                    width: "22px", height: "22px", borderRadius: "50%",
                                                    background: av.color,
                                                    border: "2px solid #fff",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                }}>
                                                    <CheckCircle style={{ width: "11px", height: "11px", color: "#fff" }} />
                                                </div>
                                            )}
                                        </div>

                                        <span style={{
                                            fontSize: "13px", fontWeight: 700,
                                            color: isSelected ? av.color : "#6B7280",
                                            fontFamily: "'Quicksand', sans-serif",
                                            transition: "color 0.2s",
                                        }}>
                                            {av.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Botón confirmar */}
                        <div style={{ padding: "4px 24px 28px" }}>
                            {confirmed ? (
                                <div style={{
                                    width: "100%", padding: "15px",
                                    borderRadius: "16px",
                                    background: "linear-gradient(135deg, #0EAD69, #3BCEAC)",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                                    boxShadow: "0 8px 24px rgba(14,173,105,0.3)",
                                    animation: "fadeSlideIn 0.3s ease both",
                                }}>
                                    <CheckCircle style={{ width: "18px", height: "18px", color: "#fff" }} />
                                    <span style={{ color: "#fff", fontWeight: 700, fontSize: "15px", fontFamily: "'Quicksand', sans-serif" }}>
                                        Listo, que empiece la aventura
                                    </span>
                                </div>
                            ) : (
                                <button
                                    onClick={handleSave}
                                    disabled={!selected || saving}
                                    style={{
                                        width: "100%", padding: "15px 24px",
                                        borderRadius: "16px", border: "none",
                                        cursor: selected ? "pointer" : "not-allowed",
                                        background: selected
                                            ? `linear-gradient(135deg, ${selectedAvatar?.color}, ${selectedAvatar?.color}cc)`
                                            : "#F3F4F6",
                                        color: selected ? "#fff" : "#9CA3AF",
                                        fontSize: "15px", fontWeight: 700,
                                        fontFamily: "'Quicksand', sans-serif",
                                        boxShadow: selected ? `0 8px 24px ${selectedAvatar?.color}40` : "none",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                        transition: "all 0.3s cubic-bezier(0.34,1.2,0.64,1)",
                                        transform: selected ? "scale(1)" : "scale(0.98)",
                                    }}
                                    onMouseEnter={e => { if (selected) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${selectedAvatar?.color}50`; } }}
                                    onMouseLeave={e => { if (selected) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 8px 24px ${selectedAvatar?.color}40`; } }}
                                >
                                    {saving ? (
                                        <>
                                            <svg style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }} viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
                                                <path d="M4 12a8 8 0 018-8" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                                            </svg>
                                            Guardando...
                                        </>
                                    ) : selected ? (
                                        <>
                                            <Star style={{ width: "16px", height: "16px" }} />
                                            Comenzar con {selectedAvatar?.label}
                                        </>
                                    ) : (
                                        "Selecciona un personaje para continuar"
                                    )}
                                </button>
                            )}

                            <p style={{
                                textAlign: "center", fontSize: "12px", color: "#898989",
                                marginTop: "12px", marginBottom: 0,
                                fontFamily: "'Quicksand', sans-serif",
                            }}>
                                Puedes cambiar tu avatar desde la configuración en cualquier momento
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes avatarModalIn {
                    from { opacity: 0; transform: scale(0.88) translateY(20px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateX(10px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.7); }
                    to   { opacity: 1; transform: scale(1); }
                }
                @keyframes spinSlow {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function StudentDashboard({ courses = [], needsAvatar = false }) {
    const { props } = usePage();
    const flash = props.flash || {};

    const [collapsed] = useSidebarState();
    const [activeArea, setActiveArea] = useState(null);
    const [search, setSearch] = useState("");
    const [filterArea, setFilterArea] = useState("all");
    const [viewMode, setViewMode] = useState("grid");
    const [visible, setVisible] = useState(false);
    const [showAvatar, setShowAvatar] = useState(false);
    const [avatarSelected, setAvatarSelected] = useState(false);

    const course = courses[0] ?? null;
    const ovasByArea = groupOvasByArea(courses);
    const totalOvas = Object.values(ovasByArea).flat().length;

    const subjectsWithOvas = MATERIAS.map(materia => ({
        ...materia,
        ovas: ovasByArea[materia.area] || []
    }));

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

    useEffect(() => {
        const needsAvatarFromProp = needsAvatar === true;
        
        if (needsAvatarFromProp && !avatarSelected) {
            const timer = setTimeout(() => {
                setShowAvatar(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [needsAvatar, avatarSelected]);

    const handleAvatarSuccess = () => {
        setAvatarSelected(true);
        setShowAvatar(false);
    };

    const handleSelectSubject = (area) => {
        setActiveArea(area);
    };

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

            {showAvatar && (
                <AvatarPickerModal 
                    onClose={() => setShowAvatar(false)} 
                    onSuccess={handleAvatarSuccess}
                />
            )}

            <main className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-20" : "lg:ml-72"} min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden`}>
                
                {/* Figuras decorativas de fondo */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Anillos de esquinas - más visibles */}
                    <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full border-8 border-purple-300/25 animate-float-slow" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full border-8 border-purple-300/20 animate-float-medium" />
                    
                    {/* Anillos secundarios */}
                    <div className="absolute top-1/3 left-[12%] w-64 h-64 rounded-full border-4 border-purple-200/15 animate-float-fast" />
                    <div className="absolute bottom-1/3 right-[18%] w-72 h-72 rounded-full border-4 border-purple-200/15 animate-float-slow" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border-4 border-purple-100/10 animate-pulse-slow" />
                    
                    {/* Burbujas - pequeñas, claritas y estratégicamente distribuidas */}
                    <div className="absolute top-[15%] left-[8%] w-6 h-6 rounded-full bg-purple-200/20 animate-bubble-slow" />
                    <div className="absolute top-[30%] right-[12%] w-5 h-5 rounded-full bg-purple-200/15 animate-bubble-medium" style={{ animationDelay: '1s' }} />
                    <div className="absolute bottom-[25%] left-[15%] w-7 h-7 rounded-full bg-purple-200/20 animate-bubble-slow" style={{ animationDelay: '2s' }} />
                    <div className="absolute bottom-[40%] right-[20%] w-4 h-4 rounded-full bg-purple-200/15 animate-bubble-fast" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute top-[60%] left-[25%] w-5 h-5 rounded-full bg-purple-200/18 animate-bubble-medium" style={{ animationDelay: '3s' }} />
                    <div className="absolute top-[20%] right-[30%] w-6 h-6 rounded-full bg-purple-200/15 animate-bubble-slow" style={{ animationDelay: '1.5s' }} />
                    <div className="absolute bottom-[15%] right-[35%] w-4 h-4 rounded-full bg-purple-200/20 animate-bubble-fast" style={{ animationDelay: '2.5s' }} />
                    <div className="absolute top-[75%] left-[40%] w-5 h-5 rounded-full bg-purple-200/15 animate-bubble-medium" style={{ animationDelay: '4s' }} />
                    <div className="absolute bottom-[60%] left-[55%] w-6 h-6 rounded-full bg-purple-200/18 animate-bubble-slow" style={{ animationDelay: '0.8s' }} />
                    <div className="absolute top-[45%] right-[45%] w-4 h-4 rounded-full bg-purple-200/15 animate-bubble-fast" style={{ animationDelay: '3.5s' }} />
                </div>
                
                <div className="py-8 px-4 sm:px-6 lg:px-8 relative z-10">
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

                        {/* Header mejorado */}
                        <div className="mb-12 relative">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                                <div className="flex items-start gap-4">
                                    <div className="p-4 rounded-2xl shadow-lg border bg-white/80 backdrop-blur-sm" style={{ borderColor: "#540D6E" }}>
                                        <BookOpen className="w-9 h-9" style={{ color: "#540D6E" }} />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                            Mis Materias
                                        </h1>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <span>
                                                {course ? (
                                                    <>Explora tus recursos educativos · {GRADE_LABELS[course.grade] ?? course.grade} · Sección {course.section} · {course.school_year}</>
                                                ) : (
                                                    "Explora tus recursos educativos"
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                            {[
                                { 
                                    icon: Layers, 
                                    bg: "#F3E8FF", 
                                    color: "#540D6E", 
                                    label: "Total Recursos", 
                                    desc: "Disponibles en tu curso", 
                                    value: totalOvas,
                                    iconBg: "bg-purple-100"
                                },
                                { 
                                    icon: BookOpen, 
                                    bg: "#E8F5F0", 
                                    color: "#0EAD69", 
                                    label: "Materias Activas", 
                                    desc: "Con contenido disponible", 
                                    value: `${activeMaterias} de ${MATERIAS.length}`,
                                    iconBg: "bg-green-100"
                                },
                                { 
                                    icon: GraduationCap, 
                                    bg: "#FEF3C7", 
                                    color: "#FFD23F", 
                                    label: "Grado", 
                                    desc: course ? "Nivel educativo actual" : "Sin curso asignado", 
                                    value: course ? GRADE_LABELS[course.grade] ?? course.grade : "—",
                                    iconBg: "bg-yellow-100"
                                }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group min-h-[100px]">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${stat.iconBg}`}>
                                                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{stat.label}</p>
                                                <p className="text-sm text-gray-600 mt-0.5">{stat.desc}</p>
                                            </div>
                                        </div>
                                        <p className="text-4xl font-black" style={{ color: stat.color, fontFamily: "'Chewy', cursive" }}>{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sin curso */}
                        {!course && (
                            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-gray-200">
                                <div className="text-center py-16 px-6">
                                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 shadow-lg"
                                        style={{ background: "linear-gradient(135deg, #540D6E, #EE4266)" }}>
                                        <BookOpen className="w-12 h-12 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        Aún no estás inscrito en un curso
                                    </h3>
                                    <p className="text-gray-600 max-w-md mx-auto">
                                        Tu profesor te agregará próximamente a un curso
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ─── CARDS DE MATERIAS CON SLIDER ─── */}
                        {course && !activeArea && (
                            <div className="relative">
                                <div className="text-center mb-10">
                                    <h2 className="text-4xl font-bold mb-3" style={{ fontFamily: "'Chewy', cursive", color: "#540D6E" }}>
                                        Explora tus materias
                                    </h2>
                                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                                        Selecciona un área para comenzar tu aventura de aprendizaje
                                    </p>
                                </div>
                                
                                <SubjectSlider 
                                    subjects={subjectsWithOvas}
                                    onSelectSubject={handleSelectSubject}
                                    visible={visible}
                                />
                            </div>
                        )}

                        {/* ─── VISTA OVAs de una materia ─── */}
                        {activeArea && activeMateria && (
                            <div className={`transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
                                <div className="mb-8">
                                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                        <div className="flex items-start gap-4">
                                            <button
                                                onClick={() => { setActiveArea(null); setSearch(""); setFilterArea("all"); }}
                                                className="group p-4 rounded-2xl shadow-md border bg-white/80 backdrop-blur-sm hover:bg-gray-50 transition-all duration-300 hover:-translate-x-1"
                                                style={{ borderColor: activeMateria.color }}
                                            >
                                                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" style={{ color: activeMateria.color }} />
                                            </button>
                                            <div className="flex items-start gap-4">
                                                <div className="p-4 rounded-2xl shadow-md border bg-white/80 backdrop-blur-sm" 
                                                     style={{ borderColor: activeMateria.color }}>
                                                    <activeMateria.icon className="w-10 h-10" style={{ color: activeMateria.color }} />
                                                </div>
                                                <div>
                                                    <h2 className="text-4xl font-bold text-gray-900 mb-2">
                                                        {activeArea}
                                                    </h2>
                                                    <p className="text-gray-600 text-base">
                                                        {ovasByArea[activeArea]?.length ?? 0} recurso{(ovasByArea[activeArea]?.length ?? 0) !== 1 ? "s" : ""} disponible{(ovasByArea[activeArea]?.length ?? 0) !== 1 ? "s" : ""} · {course ? `${GRADE_LABELS[course.grade]} ${course.section}` : ""}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Filtros y Toggle de vista */}
                                <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200 p-6">
                                    <div className="flex flex-col lg:flex-row gap-4">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input 
                                                type="text" 
                                                placeholder={`Buscar recurso en ${activeArea}...`} 
                                                value={search}
                                                onChange={e => setSearch(e.target.value)}
                                                className="w-full pl-12 pr-10 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-offset-2 outline-none transition-all hover:border-gray-300"
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
                                        <div className="relative w-64">
                                            <select
                                                value={filterArea}
                                                onChange={e => setFilterArea(e.target.value)}
                                                className="w-full px-4 pr-10 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-offset-2 outline-none transition-all hover:border-gray-300 appearance-none"
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
                                        <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                                            <button
                                                onClick={() => setViewMode("grid")}
                                                className={`p-2 rounded-lg transition-all duration-200 ${
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
                                            <button
                                                onClick={() => setViewMode("table")}
                                                className={`p-2 rounded-lg transition-all duration-200 ${
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
                                        </div>
                                    </div>
                                </div>

                                {/* Indicador de filtros activos */}
                                {hasActiveFilters && (
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-xl" style={{ backgroundColor: activeMateria.bg }}>
                                                    <Filter className="w-4 h-4" style={{ color: activeMateria.color }} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">Filtros Aplicados</p>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {search && (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium"
                                                                style={{ backgroundColor: activeMateria.bg, borderColor: activeMateria.color, color: activeMateria.color }}>
                                                                Búsqueda: "{search}"
                                                                <button onClick={() => setSearch("")} className="hover:bg-white/50 p-0.5 rounded">
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </span>
                                                        )}
                                                        {filterArea !== "all" && (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium"
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
                                            <button onClick={clearFilters} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all">
                                                <RotateCcw className="w-4 h-4" /> Limpiar
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Contenido - Grid o Tabla de OVAs */}
                                {activeOvas.length > 0 ? (
                                    viewMode === "grid" ? (
                                        <OVAGrid 
                                            ovas={activeOvas} 
                                            materia={activeMateria} 
                                            courseId={course?.id} 
                                        />
                                    ) : (
                                        <OVATable 
                                            ovas={activeOvas} 
                                            materia={activeMateria} 
                                            courseId={course?.id} 
                                        />
                                    )
                                ) : (
                                    <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-gray-200">
                                        <div className="text-center py-16 px-6">
                                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 shadow-lg"
                                                style={{ backgroundColor: activeMateria.bg }}>
                                                <Search className="w-12 h-12" style={{ color: activeMateria.color }} />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                {search || filterArea !== "all" ? "No se encontraron recursos" : "No hay recursos en esta materia"}
                                            </h3>
                                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                                {search || filterArea !== "all" ? "Intente modificar los criterios de búsqueda" : "Pronto tendrás contenido disponible"}
                                            </p>
                                            {hasActiveFilters && (
                                                <button 
                                                    onClick={clearFilters}
                                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
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
                @import url('https://fonts.googleapis.com/css2?family=Chewy&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
                
                body {
                    font-family: 'Quicksand', sans-serif;
                }
                
                h1, h2, h3, h4, h5, h6 {
                    font-family: 'Quicksand', sans-serif;
                }
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fadeInRight {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
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
                    0% {
                        transform: translateY(0) translateX(0) scale(1);
                        opacity: 0;
                    }
                    20% {
                        opacity: 0.4;
                    }
                    80% {
                        opacity: 0.2;
                    }
                    100% {
                        transform: translateY(-100px) translateX(30px) scale(1.2);
                        opacity: 0;
                    }
                }
                
                @keyframes bubble-medium {
                    0% {
                        transform: translateY(0) translateX(0) scale(1);
                        opacity: 0;
                    }
                    20% {
                        opacity: 0.35;
                    }
                    80% {
                        opacity: 0.15;
                    }
                    100% {
                        transform: translateY(-120px) translateX(40px) scale(1.3);
                        opacity: 0;
                    }
                }
                
                @keyframes bubble-fast {
                    0% {
                        transform: translateY(0) translateX(0) scale(1);
                        opacity: 0;
                    }
                    20% {
                        opacity: 0.3;
                    }
                    80% {
                        opacity: 0.1;
                    }
                    100% {
                        transform: translateY(-80px) translateX(20px) scale(1.1);
                        opacity: 0;
                    }
                }
                
                .animate-float-slow { animation: float-slow 18s ease-in-out infinite; }
                .animate-float-medium { animation: float-medium 12s ease-in-out infinite; }
                .animate-float-fast { animation: float-fast 8s ease-in-out infinite; }
                .animate-pulse-slow { animation: pulse-slow 10s ease-in-out infinite; }
                .animate-bubble-slow { animation: bubble-slow 8s ease-in-out infinite; }
                .animate-bubble-medium { animation: bubble-medium 6s ease-in-out infinite; }
                .animate-bubble-fast { animation: bubble-fast 4s ease-in-out infinite; }
                
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