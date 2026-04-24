import { Head, Link, router } from "@inertiajs/react";
import { useState, useEffect, useRef, useCallback } from "react";
import {
    ArrowLeft, GraduationCap, MapPin, Palette,
    CheckCircle, Music, Microscope, Compass,
    Users, Calendar, Award, ChevronLeft, ChevronRight,
    Home,
} from "lucide-react";
import AppSidebar, { useSidebarState } from "@/Components/AppSidebar";

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type = 'success', onClose, duration = 4000 }) {
    const [progress, setProgress] = useState(100);
    useEffect(() => {
        const startTime = Date.now();
        const iv = setInterval(() => {
            const elapsed   = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);
            if (remaining <= 0) onClose();
        }, 50);
        return () => clearInterval(iv);
    }, [duration, onClose]);

    const bg = type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
    const tx = type === 'success' ? 'text-green-800'               : 'text-red-800';
    const pc = type === 'success' ? '#0EAD69'                      : '#EE4266';

    return (
        <div className="fixed top-4 right-4 z-[999] min-w-[240px] max-w-[340px]" style={{ animation: 'slideDown .3s ease' }}>
            <div className={`relative overflow-hidden rounded-2xl shadow-xl border ${bg}`}>
                <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: pc + '20' }}>
                        <CheckCircle className="w-4 h-4" style={{ color: pc }} />
                    </div>
                    <p className={`text-sm font-semibold flex-1 ${tx}`}>{message}</p>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-1">×</button>
                </div>
                <div className="h-0.5 transition-all duration-50" style={{ width: `${progress}%`, backgroundColor: pc }} />
            </div>
        </div>
    );
}

// ─── Personajes ───────────────────────────────────────────────────────────────
const CHARACTERS = [
    {
        id: 'avatar2', name: 'William', nickname: 'Willy', age: 6, grade: 'Primero',
        origin: 'Pacífico Sur', location: 'Tumaco, Francisco Pizarro',
        icon: Compass,
        color: '#1D4ED8', colorLight: '#BFDBFE', bg: '#EFF6FF',
        description: 'Recoge conchas en la playa y hace collares. Le encanta hacer preguntas sobre el mar y las estrellas. Vive con su madre y su abuela.',
        traits: ['Alegre', 'Curioso', 'Aventurero'],
    },
    {
        id: 'avatar1', name: 'Pilar', nickname: 'Pili', age: 7, grade: 'Segundo',
        origin: 'La Sabana', location: 'Túquerres, Imués',
        icon: Palette,
        color: '#059669', colorLight: '#A7F3D0', bg: '#ECFDF5',
        description: 'Dibuja los paisajes de su región y sueña con ser una gran artista. Quiere descubrir los secretos del volcán Azufral.',
        traits: ['Artista', 'Soñadora', 'Creativa'],
    },
    {
        // Alberto = AMARILLO de la paleta
        id: 'avatar4', name: 'Alberto', nickname: 'Beto', age: 8, grade: 'Tercero',
        origin: 'Centro', location: 'Pasto, Nariño',
        icon: Microscope,
        color: '#D4A000', colorLight: '#FFE97A', bg: '#FFFBEB',
        description: 'Siempre pregunta "¿por qué?". Investiga el origen de los nombres en su municipio. Es un estudiante investigador de Investic.',
        traits: ['Investigador', 'Persistente', 'Inteligente'],
    },
    {
        id: 'avatar5', name: 'Ivy', nickname: 'Ivy', age: 10, grade: 'Cuarto',
        origin: 'Sanquianga', location: 'El Charco, La Tola',
        icon: Music,
        color: '#6D28D9', colorLight: '#DDD6FE', bg: '#F5F3FF',
        description: 'Canta todo el tiempo y sueña con llevar la música de su región a todo el país. Lleva un diario de campo a todas partes.',
        traits: ['Cantante', 'Apasionada', 'Dedicada'],
    },
    {
        id: 'avatar6', name: 'Juliana', nickname: 'Juli', age: 12, grade: 'Quinto',
        origin: 'Occidente', location: 'Linares, Sandoná',
        icon: Users,
        color: '#0F766E', colorLight: '#99F6E4', bg: '#F0FDFA',
        description: 'Líder natural. Aprende el arte de los sombreros de paja Toquilla y ayuda en la cosecha de café. Es muy amiguera.',
        traits: ['Líder', 'Trabajadora', 'Comprometida'],
    },
    {
        id: 'avatar3', name: 'Felipe', nickname: 'Pipe', age: 15, grade: 'Secundaria',
        origin: 'Río Mayo', location: 'El Tablón, Albán',
        icon: Music,
        color: '#BE123C', colorLight: '#FECDD3', bg: '#FFF1F2',
        description: 'Toca guitarra y compone sus propias canciones. Quiere entender la ciencia detrás de la música y grabar su propio disco.',
        traits: ['Músico', 'Compositor', 'Creativo'],
    },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AvatarIndex({ currentAvatar = null, flash = {} }) {
    const [collapsed] = useSidebarState();
    const [currentIdx, setCurrentIdx]           = useState(0);
    const [selectedAvatar, setSelectedAvatar]   = useState(null);
    const [saving, setSaving]                   = useState(false);
    const [toast, setToast]                     = useState(null);
    const [localCurrentAvatar, setLocalCurrentAvatar] = useState(currentAvatar);
    const [isAnimating, setIsAnimating]         = useState(false);
    const [visible, setVisible]                 = useState(false);
    const dragStartX = useRef(null);

    useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);
    useEffect(() => {
        if (flash?.success) setToast({ message: flash.success, type: 'success' });
    }, [flash]);
    useEffect(() => {
        if (currentAvatar) {
            const idx = CHARACTERS.findIndex(c => c.id === currentAvatar);
            if (idx !== -1) setCurrentIdx(idx);
        }
    }, []);

    const navigate = useCallback((dir) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIdx(prev => (prev + dir + CHARACTERS.length) % CHARACTERS.length);
            setIsAnimating(false);
        }, 320);
    }, [isAnimating]);

    const goTo = useCallback((idx) => {
        if (isAnimating || idx === currentIdx) return;
        setIsAnimating(true);
        setTimeout(() => { setCurrentIdx(idx); setIsAnimating(false); }, 320);
    }, [isAnimating, currentIdx]);

    const avatar        = CHARACTERS[currentIdx];
    const isCurrent     = localCurrentAvatar === avatar.id;
    const isSelected    = selectedAvatar === avatar.id;
    const IconComponent = avatar.icon;
    const selectedChar  = CHARACTERS.find(a => a.id === selectedAvatar);

    const handleSelect = () => {
        if (isCurrent) return;
        setSelectedAvatar(prev => prev === avatar.id ? null : avatar.id);
    };

    const handleSave = () => {
        if (!selectedAvatar || saving) return;
        setSaving(true);
        router.post(route('student.avatar.store'), { avatar: selectedAvatar }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setSaving(false);
                setLocalCurrentAvatar(selectedAvatar);
                setSelectedAvatar(null);
                // No mostrar toast aquí - vendrá del flash del backend
                window.dispatchEvent(new CustomEvent('avatar-updated', { detail: { avatar: selectedAvatar } }));
            },
            onError: () => {
                setSaving(false);
                setToast({ message: 'Error al guardar el avatar', type: 'error' });
            },
        });
    };

    // Swipe táctil
    const onPointerDown = (e) => { dragStartX.current = e.clientX; };
    const onPointerUp   = (e) => {
        if (dragStartX.current === null) return;
        const dx = e.clientX - dragStartX.current;
        if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
        dragStartX.current = null;
    };

    // Datos 2×2 — van AL FINAL, justo antes del botón
    const infoGrid = [
        { Icon: Calendar,      label: 'Edad',   value: `${avatar.age} años` },
        { Icon: GraduationCap, label: 'Grado',  value: avatar.grade },
        { Icon: Home,          label: 'Región', value: avatar.origin },
        { Icon: MapPin,        label: 'Lugar',  value: avatar.location },
    ];

    return (
        <>
            <Head title="Cambiar Avatar" />
            <AppSidebar currentRoute="student.avatar.index" />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <main
                className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-20" : "lg:ml-72"} min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden`}
                style={{ fontFamily: "'Quicksand', sans-serif" }}
            >
                {/* ── Fondo animado ── */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full border-8 border-purple-300/25 animate-float-slow" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full border-8 border-purple-300/20 animate-float-medium" />
                    <div className="absolute top-1/3 left-[12%] w-64 h-64 rounded-full border-4 border-purple-200/15 animate-float-fast" />
                    <div className="absolute bottom-1/3 right-[18%] w-72 h-72 rounded-full border-4 border-purple-200/15 animate-float-slow" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border-4 border-purple-100/10 animate-pulse-slow" />
                    <div className="absolute top-[15%]    left-[8%]   w-6 h-6 rounded-full bg-purple-200/20 animate-bubble-slow" />
                    <div className="absolute top-[30%]    right-[12%] w-5 h-5 rounded-full bg-purple-200/15 animate-bubble-medium" style={{ animationDelay: '1s' }} />
                    <div className="absolute bottom-[25%] left-[15%]  w-7 h-7 rounded-full bg-purple-200/20 animate-bubble-slow"   style={{ animationDelay: '2s' }} />
                    <div className="absolute bottom-[40%] right-[20%] w-4 h-4 rounded-full bg-purple-200/15 animate-bubble-fast"   style={{ animationDelay: '0.5s' }} />
                    <div className="absolute top-[60%]    left-[25%]  w-5 h-5 rounded-full bg-purple-200/20 animate-bubble-medium" style={{ animationDelay: '3s' }} />
                    <div className="absolute top-[20%]    right-[30%] w-6 h-6 rounded-full bg-purple-200/15 animate-bubble-slow"   style={{ animationDelay: '1.5s' }} />
                    <div className="absolute bottom-[15%] right-[35%] w-4 h-4 rounded-full bg-purple-200/20 animate-bubble-fast"   style={{ animationDelay: '2.5s' }} />
                    <div className="absolute top-[75%]    left-[40%]  w-5 h-5 rounded-full bg-purple-200/15 animate-bubble-medium" style={{ animationDelay: '4s' }} />
                    <div className="absolute bottom-[60%] left-[55%]  w-6 h-6 rounded-full bg-purple-200/20 animate-bubble-slow"   style={{ animationDelay: '0.8s' }} />
                    <div className="absolute top-[45%]    right-[45%] w-4 h-4 rounded-full bg-purple-200/15 animate-bubble-fast"   style={{ animationDelay: '3.5s' }} />
                </div>

                <div className="py-8 px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-5xl mx-auto">

                        {/* ── Breadcrumb ── */}
                        <div className={`mb-6 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}>
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Link href={route("dashboard")} className="hover:text-purple-700 transition-colors">
                                        Panel de Control
                                    </Link>
                                    <span>/</span>
                                    <Link href={route("student.dashboard")} className="hover:text-purple-700 transition-colors">
                                        Mis Materias
                                    </Link>
                                    <span>/</span>
                                    <span className="font-semibold" style={{ color: '#540D6E' }}>Cambiar Avatar</span>
                                </div>
                                <Link
                                    href={route("student.dashboard")}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-600 hover:text-gray-900 hover:shadow-md transition-all"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Volver a Mis Materias
                                </Link>
                            </div>
                        </div>

                        {/* ── Header ── */}
                        <div className={`mb-10 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <div className="flex flex-col items-center text-center gap-3">
                                <div className="flex items-center justify-center gap-3">
                                    <div className="p-3 rounded-xl flex-shrink-0" style={{ background: '#540D6E12' }}>
                                        <Palette className="w-6 h-6" style={{ color: '#540D6E' }} />
                                    </div>
                                    <h1 className="text-4xl font-bold text-gray-900"
                                        style={{ fontFamily: "'Chewy', cursive", letterSpacing: '0.02em', color: '#540D6E' }}>
                                        Cambiar Avatar
                                    </h1>
                                </div>
                                <p className="text-gray-500 text-sm">
                                    Selecciona el personaje que te representará en tu aventura de aprendizaje
                                </p>
                            </div>
                        </div>

                        {/* ── Slider principal ── */}
                        <div
                            className={`relative transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            onPointerDown={onPointerDown}
                            onPointerUp={onPointerUp}
                            style={{ userSelect: 'none' }}
                        >
                            <div
                                className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border"
                                style={{ borderColor: `${avatar.color}25` }}
                            >
                                {/* Barra de color superior */}
                                <div className="h-1.5 w-full transition-all duration-500"
                                    style={{ background: `linear-gradient(90deg, ${avatar.color}, ${avatar.colorLight})` }} />

                                <div className="flex flex-col lg:flex-row">

                                    {/* ── Panel izquierdo: imagen + nombre ── */}
                                    <div
                                        className="relative flex flex-col items-center justify-center lg:w-64 xl:w-72 shrink-0 py-8 px-6 overflow-hidden"
                                        style={{
                                            background: `linear-gradient(160deg, ${avatar.bg} 0%, ${avatar.colorLight}30 60%, rgba(255,255,255,0.5) 100%)`,
                                            borderRight: `3px solid ${avatar.color}22`,
                                            boxShadow: `inset -6px 0 24px ${avatar.color}08`,
                                        }}
                                    >
                                        {/* Número decorativo */}
                                        <div
                                            className="absolute top-3 left-4 font-black select-none pointer-events-none"
                                            style={{
                                                fontFamily: "'Chewy', cursive",
                                                fontSize: '5rem',
                                                lineHeight: 1,
                                                color: avatar.color,
                                                opacity: 0.07,
                                            }}
                                        >
                                            0{currentIdx + 1}
                                        </div>

                                        {/* Imagen con animación al cambiar */}
                                        <div
                                            key={avatar.id + '_img'}
                                            style={{ animation: 'charIn 0.4s cubic-bezier(.34,1.56,.64,1) both' }}
                                        >
                                            <div className="relative">
                                                <div
                                                    className="w-40 h-40 rounded-2xl overflow-hidden shadow-lg"
                                                    style={{ border: `3px solid ${avatar.color}30`, background: avatar.bg }}
                                                >
                                                    <img
                                                        src={`/avatars/${avatar.id}.png`}
                                                        alt={avatar.name}
                                                        className="w-full h-full object-cover"
                                                        onError={e => {
                                                            e.currentTarget.style.display = 'none';
                                                            const p = e.currentTarget.parentElement;
                                                            p.style.cssText += 'display:flex;align-items:center;justify-content:center;';
                                                            const ic = document.createElement('div');
                                                            ic.style.cssText = `width:60px;height:60px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:${avatar.color}18`;
                                                            ic.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${avatar.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;
                                                            p.appendChild(ic);
                                                        }}
                                                    />
                                                </div>

                                                {/* Badge ícono del personaje */}
                                                <div
                                                    className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
                                                    style={{ background: avatar.color, border: '2.5px solid white' }}
                                                >
                                                    <IconComponent className="w-4 h-4 text-white" />
                                                </div>

                                                {/* Badge "actual" */}
                                                {isCurrent && (
                                                    <div
                                                        className="absolute -top-2 -left-2 w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
                                                        style={{ background: '#0EAD69', border: '2.5px solid white' }}
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Nombre + apodo */}
                                        <div
                                            key={avatar.id + '_name'}
                                            className="mt-5 text-center"
                                            style={{ animation: 'charIn 0.44s cubic-bezier(.34,1.56,.64,1) .06s both' }}
                                        >
                                            <h2 className="text-3xl font-black text-gray-900 leading-tight"
                                                style={{ fontFamily: "'Chewy', cursive", letterSpacing: '0.02em' }}>
                                                {avatar.name}
                                            </h2>
                                            <p className="text-lg font-bold mt-0.5" style={{ color: avatar.color }}>
                                                "{avatar.nickname}"
                                            </p>
                                            {isCurrent && (
                                                <span
                                                    className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-bold"
                                                    style={{ background: '#0EAD6915', color: '#0EAD69' }}
                                                >
                                                    Personaje actual
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* ── Panel derecho: info ── */}
                                    <div
                                        key={avatar.id + '_info'}
                                        className="flex-1 p-6 lg:p-8 flex flex-col"
                                        style={{ animation: 'infoIn 0.42s ease both' }}
                                    >
                                        {/* 1. Descripción */}
                                        <p className="text-sm text-gray-600 leading-relaxed mb-5">
                                            {avatar.description}
                                        </p>

                                        {/* 2. Rasgos */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {avatar.traits.map(trait => (
                                                <span
                                                    key={trait}
                                                    className="px-3 py-1 rounded-full text-sm font-bold"
                                                    style={{
                                                        background: avatar.color + '10',
                                                        color:      avatar.color,
                                                        border:     `1.5px solid ${avatar.color}25`,
                                                    }}
                                                >
                                                    {trait}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Divisor */}
                                        <div className="h-px mb-5" style={{ background: `${avatar.color}12` }} />

                                        {/* 3. Grid 2×2 — justo antes del botón */}
                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            {infoGrid.map(({ Icon, label, value }) => (
                                                <div
                                                    key={label}
                                                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 backdrop-blur-sm"
                                                    style={{ border: `1.5px solid ${avatar.color}18` }}
                                                >
                                                    <div
                                                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                                                        style={{ background: avatar.color + '18' }}
                                                    >
                                                        <Icon className="w-4 h-4" style={{ color: avatar.color }} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm text-gray-400 font-medium leading-none mb-0.5">{label}</p>
                                                        <p className="text-sm font-bold text-gray-800 leading-tight truncate">{value}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* 4. Botón */}
                                        {isCurrent ? (
                                            <div
                                                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold self-start"
                                                style={{ background: '#0EAD690e', color: '#0EAD69', border: '1.5px solid #0EAD6928' }}
                                            >
                                                <div className="w-5 h-5 rounded-md flex items-center justify-center"
                                                    style={{ background: '#0EAD6922' }}>
                                                    <CheckCircle className="w-3.5 h-3.5" style={{ color: '#0EAD69' }} />
                                                </div>
                                                Tu personaje actual
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleSelect}
                                                className="self-start relative overflow-hidden px-7 py-3 rounded-2xl text-sm font-bold transition-all duration-200 active:scale-95"
                                                style={{
                                                    background:   isSelected ? avatar.color : 'white',
                                                    color:        isSelected ? 'white'       : avatar.color,
                                                    border:       `2px solid ${avatar.color}`,
                                                    boxShadow:    isSelected
                                                        ? `0 4px 16px ${avatar.color}45`
                                                        : `0 2px 8px ${avatar.color}20`,
                                                }}
                                                /* Efecto hover vía CSS class en <style> */
                                                onMouseEnter={e => {
                                                    if (!isSelected) {
                                                        e.currentTarget.style.background  = avatar.color;
                                                        e.currentTarget.style.color       = 'white';
                                                        e.currentTarget.style.boxShadow   = `0 6px 20px ${avatar.color}50`;
                                                        e.currentTarget.style.transform   = 'translateY(-2px)';
                                                    }
                                                }}
                                                onMouseLeave={e => {
                                                    if (!isSelected) {
                                                        e.currentTarget.style.background  = 'white';
                                                        e.currentTarget.style.color       = avatar.color;
                                                        e.currentTarget.style.boxShadow   = `0 2px 8px ${avatar.color}20`;
                                                        e.currentTarget.style.transform   = 'translateY(0)';
                                                    }
                                                }}
                                            >
                                                <span className="relative z-10 flex items-center gap-2">
                                                    {isSelected
                                                        ? <><CheckCircle className="w-4 h-4" /> Seleccionado</>
                                                        : `Elegir a ${avatar.name}`
                                                    }
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Flechas de navegación */}
                            <button
                                onClick={() => navigate(-1)}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 lg:-translate-x-6 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg border border-gray-100 hover:scale-110 hover:shadow-xl transition-all active:scale-95"
                                style={{ color: avatar.color }}
                                aria-label="Anterior"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => navigate(1)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 lg:translate-x-6 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg border border-gray-100 hover:scale-110 hover:shadow-xl transition-all active:scale-95"
                                style={{ color: avatar.color }}
                                aria-label="Siguiente"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* ── Indicadores: dots + miniaturas ── */}
                        <div className={`mt-6 flex flex-col items-center gap-4 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            {/* Dots */}
                            <div className="flex items-center gap-2">
                                {CHARACTERS.map((c, i) => (
                                    <button
                                        key={c.id}
                                        onClick={() => goTo(i)}
                                        className="rounded-full transition-all duration-300"
                                        style={{
                                            width:     i === currentIdx ? 28 : 8,
                                            height:    8,
                                            background: i === currentIdx ? avatar.color : '#D1D5DB',
                                            boxShadow: i === currentIdx ? `0 0 8px ${avatar.color}60` : 'none',
                                        }}
                                        aria-label={`Ir a ${c.name}`}
                                    />
                                ))}
                            </div>

                            {/* Miniaturas */}
                            <div className="flex items-end gap-2.5 flex-wrap justify-center">
                                {CHARACTERS.map((c, i) => {
                                    const isActive = i === currentIdx;
                                    const isCurr   = localCurrentAvatar === c.id;
                                    return (
                                        <button
                                            key={c.id}
                                            onClick={() => goTo(i)}
                                            className="relative rounded-xl overflow-visible transition-all duration-300 group"
                                            style={{
                                                width:      isActive ? 60 : 46,
                                                height:     isActive ? 60 : 46,
                                                border:     `2.5px solid ${isActive ? c.color : isCurr ? '#0EAD69' : '#E5E7EB'}`,
                                                boxShadow:  isActive ? `0 4px 14px ${c.color}35` : 'none',
                                                background: c.bg,
                                                flexShrink: 0,
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                            }}
                                            title={c.name}
                                        >
                                            <img
                                                src={`/avatars/${c.id}.png`}
                                                alt={c.name}
                                                className="w-full h-full object-cover"
                                                onError={e => { e.currentTarget.style.display = 'none'; }}
                                            />
                                            {isCurr && (
                                                <div className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-green-500 border border-white" />
                                            )}
                                            {/* Tooltip */}
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm font-semibold px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                {c.name}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── Confirmar cambio (sticky) ── */}
                        {selectedAvatar && (
                            <div className="mt-6 sticky bottom-6 z-40" style={{ animation: 'slideUp .3s ease' }}>
                                <div
                                    className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border p-4 flex items-center justify-between gap-4"
                                    style={{ borderColor: selectedChar?.color + '28' }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0"
                                            style={{ border: `2px solid ${selectedChar?.color}30`, background: selectedChar?.bg }}
                                        >
                                            <img src={`/avatars/${selectedAvatar}.png`} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">
                                                ¿Cambiar a {selectedChar?.name}?
                                            </p>
                                            <p className="text-sm text-gray-400">Este será tu nuevo avatar en la plataforma</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => setSelectedAvatar(null)}
                                            className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition-all"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
                                            style={{
                                                background: selectedChar?.color,
                                                boxShadow: `0 4px 14px ${selectedChar?.color}40`,
                                            }}
                                        >
                                            {saving ? 'Guardando...' : 'Confirmar cambio'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Footer "¿Sabías que...?" ── */}
                        <div className={`mt-8 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-md flex flex-col items-center text-center">
                                <div className="flex items-center justify-center gap-3 mb-2">
                                    <div className="p-3 rounded-xl flex-shrink-0" style={{ background: '#EE426612' }}>
                                        <Award className="w-5 h-5" style={{ color: '#EE4266' }} />
                                    </div>
                                    <h3 className="font-bold text-gray-900"
                                        style={{ fontFamily: "'Chewy', cursive", fontSize: '1.1rem', letterSpacing: '0.02em' }}>
                                        ¿Sabías que...?
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
                                    Todos estos personajes representan estudiantes reales del programa{' '}
                                    <strong className="text-gray-700">Investic en Nariño</strong>.
                                    Cada uno viene de una región diferente. ¡Elige el que más te inspire!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Chewy&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');

                body { font-family: 'Quicksand', sans-serif; }

                @keyframes charIn {
                    from { opacity: 0; transform: translateY(18px) scale(0.92); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes infoIn {
                    from { opacity: 0; transform: translateX(16px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-12px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }

                @keyframes float-slow {
                    0%, 100% { transform: translate(0,0) rotate(0deg); }
                    25%      { transform: translate(20px,-25px) rotate(5deg); }
                    50%      { transform: translate(-10px,-35px) rotate(-3deg); }
                    75%      { transform: translate(-25px,-20px) rotate(8deg); }
                }
                @keyframes float-medium {
                    0%, 100% { transform: translate(0,0) rotate(0deg); }
                    33%      { transform: translate(-20px,-30px) rotate(-6deg); }
                    66%      { transform: translate(25px,-20px) rotate(4deg); }
                }
                @keyframes float-fast {
                    0%, 100% { transform: translate(0,0) rotate(0deg); }
                    50%      { transform: translate(30px,-25px) rotate(10deg); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.06; transform: scale(1); }
                    50%      { opacity: 0.12; transform: scale(1.05); }
                }
                @keyframes bubble-slow {
                    0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
                    20%  { opacity: 0.4; }
                    80%  { opacity: 0.2; }
                    100% { transform: translateY(-100px) translateX(30px) scale(1.2); opacity: 0; }
                }
                @keyframes bubble-medium {
                    0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
                    20%  { opacity: 0.35; }
                    80%  { opacity: 0.15; }
                    100% { transform: translateY(-120px) translateX(40px) scale(1.3); opacity: 0; }
                }
                @keyframes bubble-fast {
                    0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
                    20%  { opacity: 0.3; }
                    80%  { opacity: 0.1; }
                    100% { transform: translateY(-80px) translateX(20px) scale(1.1); opacity: 0; }
                }

                .animate-float-slow    { animation: float-slow    18s ease-in-out infinite; }
                .animate-float-medium  { animation: float-medium   12s ease-in-out infinite; }
                .animate-float-fast    { animation: float-fast      8s ease-in-out infinite; }
                .animate-pulse-slow    { animation: pulse-slow     10s ease-in-out infinite; }
                .animate-bubble-slow   { animation: bubble-slow     8s ease-in-out infinite; }
                .animate-bubble-medium { animation: bubble-medium   6s ease-in-out infinite; }
                .animate-bubble-fast   { animation: bubble-fast     4s ease-in-out infinite; }
            `}</style>
        </>
    );
}