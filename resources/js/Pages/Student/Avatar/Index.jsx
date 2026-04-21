// Resources/js/Pages/Student/Avatar/Index.jsx
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    ArrowLeft, GraduationCap, MapPin, Sparkles,
    CheckCircle, Palette, Music, Microscope, Compass,
    Users, Calendar, Home, BookOpen, User, Award, Star
} from "lucide-react";
import AppSidebar, { useSidebarState } from "@/Components/AppSidebar";

// ─── Componente Toast con barra de progreso ───────────────────────────────────
function Toast({ message, type = 'success', onClose, duration = 4000 }) {
    const [progress, setProgress] = useState(100);
    
    useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);
            if (remaining <= 0) onClose();
        }, 50);
        return () => clearInterval(interval);
    }, [duration, onClose]);

    const bgColor = type === 'success' ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300';
    const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
    const progressColor = type === 'success' ? '#0EAD69' : '#EE4266';

    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-down min-w-[320px] max-w-md">
            <div className={`relative overflow-hidden rounded-lg shadow-xl border ${bgColor}`}>
                <div className="flex items-start gap-3 px-4 py-3">
                    <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${type === 'success' ? 'text-green-600' : 'text-red-600'}`} />
                    <div className="flex-1">
                        <p className={`text-sm font-medium ${textColor}`}>{message}</p>
                    </div>
                    <button onClick={onClose} className="flex-shrink-0 text-gray-400 hover:text-gray-600">×</button>
                </div>
                <div className="h-1 transition-all duration-50 ease-linear"
                    style={{ width: `${progress}%`, backgroundColor: progressColor }} />
            </div>
        </div>
    );
}

// ─── Datos de personajes ──────────────────────────────────────────────────────
const CHARACTERS = [
    {
        id: 'avatar2', name: 'William', nickname: 'Willy', age: 6, grade: 'Primero',
        origin: 'Pacífico Sur', location: 'Tumaco, Francisco Pizarro',
        icon: Compass, color: '#1D4ED8', bg: '#DBEAFE',
        description: 'Recoge conchas en la playa y hace collares. Le encanta hacer preguntas sobre el mar y las estrellas. Vive con su madre y su abuela.',
        traits: ['Alegre', 'Curioso', 'Aventurero'],
        emoji: '🧑‍🔬'
    },
    {
        id: 'avatar1', name: 'Pilar', nickname: 'Pili', age: 7, grade: 'Segundo',
        origin: 'La Sabana', location: 'Túquerres, Imués',
        icon: Palette, color: '#0EAD69', bg: '#E8F5F0',
        description: 'Dibuja los paisajes de su región y sueña con ser una gran artista. Quiere descubrir los secretos del volcán Azufral.',
        traits: ['Artista', 'Soñadora', 'Creativa'],
        emoji: '🧑‍🚀'
    },
    {
        id: 'avatar4', name: 'Alberto', nickname: 'Beto', age: 8, grade: 'Tercero',
        origin: 'Centro', location: 'Pasto, Nariño',
        icon: Microscope, color: '#FFD23F', bg: '#FEF3C7',
        description: 'Siempre pregunta "¿por qué?". Investiga el origen de los nombres en su municipio. Es un estudiante investigador de Investic.',
        traits: ['Investigador', 'Persistente', 'Inteligente'],
        emoji: '🧑‍🎽'
    },
    {
        id: 'avatar5', name: 'Ivy', nickname: 'Ivy', age: 10, grade: 'Cuarto',
        origin: 'Sanquianga', location: 'El Charco, La Tola',
        icon: Music, color: '#540D6E', bg: '#F3E8FF',
        description: 'Canta todo el tiempo y sueña con llevar la música de su región a todo el país. Lleva un diario de campo a todas partes.',
        traits: ['Cantante', 'Apasionada', 'Dedicada'],
        emoji: '🧑‍🎤'
    },
    {
        id: 'avatar6', name: 'Juliana', nickname: 'Juli', age: 12, grade: 'Quinto',
        origin: 'Occidente', location: 'Linares, Sandoná',
        icon: Users, color: '#3BCEAC', bg: '#E8F5F0',
        description: 'Líder natural. Aprende el arte de los sombreros de paja Toquilla y ayuda en la cosecha de café. Es muy amiguera.',
        traits: ['Líder', 'Trabajadora', 'Comprometida'],
        emoji: '🧑‍💻'
    },
    {
        id: 'avatar3', name: 'Felipe', nickname: 'Pipe', age: 15, grade: 'Secundaria',
        origin: 'Río Mayo', location: 'El Tablón, Albán',
        icon: Music, color: '#EE4266', bg: '#FEE2E2',
        description: 'Toca guitarra y compone sus propias canciones. Quiere entender la ciencia detrás de la música y grabar su propio disco.',
        traits: ['Músico', 'Compositor', 'Creativo'],
        emoji: '🧑‍🎨'
    },
];

// ─── Componente principal ─────────────────────────────────────────────────────
export default function AvatarIndex({ currentAvatar = null, flash = {} }) {
    const { props } = usePage();
    const [collapsed] = useSidebarState();
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [localCurrentAvatar, setLocalCurrentAvatar] = useState(currentAvatar);

    useEffect(() => {
        if (flash?.success) {
            setToast({ message: flash.success, type: 'success' });
        }
    }, [flash]);

    const handleSelectAvatar = (avatarId) => {
        setSelectedAvatar(avatarId);
    };

    const handleSaveAvatar = () => {
        if (!selectedAvatar || saving) return;
        setSaving(true);

        router.post(
            route('student.avatar.store'),
            { avatar: selectedAvatar },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    setSaving(false);
                    // Actualizar el avatar localmente sin recargar
                    setLocalCurrentAvatar(selectedAvatar);
                    setSelectedAvatar(null);
                    setToast({ message: '¡Avatar actualizado correctamente!', type: 'success' });
                    
                    // Disparar evento para que otros componentes se actualicen (ej: sidebar)
                    window.dispatchEvent(new CustomEvent('avatar-updated', { 
                        detail: { avatar: selectedAvatar }
                    }));
                },
                onError: () => {
                    setSaving(false);
                    setToast({ message: 'Error al guardar el avatar', type: 'error' });
                },
            }
        );
    };

    const currentAvatarData = CHARACTERS.find(c => c.id === localCurrentAvatar);

    return (
        <>
            <Head title="Cambiar Avatar" />
            <AppSidebar currentRoute="student.avatar.index" />

            {/* Toast */}
            {toast && (
                <Toast message={toast.message} type={toast.type} 
                    onClose={() => setToast(null)} duration={4000} />
            )}

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
                                <Link href={route("student.dashboard")} className="hover:text-purple-600 transition-colors">
                                    Mis Materias
                                </Link>
                                <span>/</span>
                                <span style={{ color: "#540D6E" }} className="font-medium">
                                    Cambiar Avatar
                                </span>
                            </div>
                        </div>

                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-4 rounded-xl shadow-sm border bg-white" style={{ borderColor: "#540D6E" }}>
                                        <User className="w-10 h-10" style={{ color: "#540D6E" }} />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Cambiar Avatar</h1>
                                        <p className="text-gray-600 text-base">
                                            Selecciona el personaje que te representará en tu aventura de aprendizaje
                                        </p>
                                    </div>
                                </div>
                                
                                <Link
                                    href={route("student.dashboard")}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Volver a Mis Materias
                                </Link>
                            </div>
                        </div>

                        {/* Avatar actual */}
                        {currentAvatarData && (
                            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center gap-4">
                                    <div className="text-sm text-gray-500">Avatar actual:</div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm"
                                            style={{ background: `linear-gradient(135deg, ${currentAvatarData.color}, ${currentAvatarData.color}dd)` }}>
                                            <img src={`/avatars/${localCurrentAvatar}.png`} alt={currentAvatarData.name}
                                                className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{currentAvatarData.name}</p>
                                            <p className="text-xs text-gray-500">{currentAvatarData.grade} · {currentAvatarData.origin}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Grid de personajes */}
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                            Elige uno de los siguientes personajes
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                            {CHARACTERS.map((avatar) => {
                                const IconComponent = avatar.icon;
                                const isSelected = selectedAvatar === avatar.id;
                                const isCurrent = localCurrentAvatar === avatar.id;
                                
                                return (
                                    <div
                                        key={avatar.id}
                                        className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all duration-300
                                            ${isSelected ? 'ring-2 ring-offset-2' : 'hover:shadow-lg hover:-translate-y-1'}
                                            ${isCurrent ? 'border-green-400' : 'border-gray-200'}
                                        `}
                                        style={{ 
                                            borderColor: isSelected ? avatar.color : (isCurrent ? '#0EAD69' : '#E5E7EB'),
                                            '--tw-ring-color': avatar.color
                                        }}
                                    >
                                        {/* Barra superior de color */}
                                        <div className="h-1.5 w-full" style={{ backgroundColor: avatar.color }} />

                                        <div className="p-5">
                                            {/* Cabecera con avatar e info */}
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="relative">
                                                    <div 
                                                        className="w-20 h-20 rounded-xl overflow-hidden shadow-md"
                                                        style={{ 
                                                            background: `linear-gradient(135deg, ${avatar.color}, ${avatar.color}dd)`,
                                                        }}
                                                    >
                                                        <img
                                                            src={`/avatars/${avatar.id}.png`}
                                                            alt={avatar.name}
                                                            className="w-full h-full object-cover"
                                                            onError={e => {
                                                                e.currentTarget.style.display = "none";
                                                                e.currentTarget.parentElement.innerHTML = `<span style="font-size:2.5rem">${avatar.emoji}</span>`;
                                                            }}
                                                        />
                                                    </div>
                                                    <div 
                                                        className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg flex items-center justify-center shadow-md bg-white"
                                                    >
                                                        <IconComponent className="w-4 h-4" style={{ color: avatar.color }} />
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-lg font-black text-gray-900">
                                                            {avatar.name}
                                                        </h3>
                                                        {isCurrent && (
                                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                                                Actual
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-500">"{avatar.nickname}"</p>
                                                </div>
                                            </div>

                                            {/* Datos */}
                                            <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {avatar.age} años
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <GraduationCap className="w-3 h-3" />
                                                    {avatar.grade}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {avatar.origin}
                                                </span>
                                            </div>

                                            {/* Descripción */}
                                            <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                                                {avatar.description}
                                            </p>

                                            {/* Rasgos */}
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {avatar.traits.map((trait, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2.5 py-1 rounded-full text-xs font-medium"
                                                        style={{ backgroundColor: avatar.bg, color: avatar.color }}
                                                    >
                                                        {trait}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Botón de selección */}
                                            {isCurrent ? (
                                                <div className="w-full py-2.5 text-center text-sm font-medium text-green-600 bg-green-50 rounded-lg border border-green-200">
                                                    <CheckCircle className="w-4 h-4 inline mr-1.5" />
                                                    Tu personaje actual
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleSelectAvatar(avatar.id)}
                                                    className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all duration-200 shadow-sm hover:shadow-md
                                                        ${isSelected ? 'text-white' : ''}
                                                    `}
                                                    style={isSelected ? {
                                                        backgroundColor: avatar.color,
                                                    } : {
                                                        backgroundColor: 'white',
                                                        border: `2px solid ${avatar.color}`,
                                                        color: avatar.color,
                                                    }}
                                                    onMouseEnter={e => {
                                                        if (!isSelected) {
                                                            e.currentTarget.style.backgroundColor = avatar.bg;
                                                        }
                                                    }}
                                                    onMouseLeave={e => {
                                                        if (!isSelected) {
                                                            e.currentTarget.style.backgroundColor = 'white';
                                                        }
                                                    }}
                                                >
                                                    {isSelected ? (
                                                        <span className="flex items-center justify-center gap-1.5">
                                                            <CheckCircle className="w-4 h-4" />
                                                            Seleccionado
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center justify-center gap-1.5">
                                                            <Sparkles className="w-4 h-4" />
                                                            Elegir a {avatar.name}
                                                        </span>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Botón de confirmar */}
                        {selectedAvatar && (
                            <div className="sticky bottom-6 z-40">
                                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md"
                                            style={{ 
                                                background: `linear-gradient(135deg, ${CHARACTERS.find(a => a.id === selectedAvatar)?.color || '#540D6E'}, ${CHARACTERS.find(a => a.id === selectedAvatar)?.color || '#EE4266'}dd)` 
                                            }}>
                                            <img
                                                src={`/avatars/${selectedAvatar}.png`}
                                                alt="Avatar seleccionado"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">
                                                ¿Cambiar a {CHARACTERS.find(a => a.id === selectedAvatar)?.name}?
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Este será tu nuevo avatar en la plataforma
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setSelectedAvatar(null)}
                                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleSaveAvatar}
                                            disabled={saving}
                                            className="px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                                            style={{ 
                                                backgroundColor: CHARACTERS.find(a => a.id === selectedAvatar)?.color || '#540D6E'
                                            }}
                                        >
                                            {saving ? 'Guardando...' : 'Confirmar cambio'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mensaje informativo */}
                        <div className="mt-8 p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-xl bg-white shadow-sm">
                                    <Award className="w-5 h-5" style={{ color: '#EE4266' }} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">¿Sabías que...?</h3>
                                    <p className="text-sm text-gray-600">
                                        Todos estos personajes representan estudiantes reales del programa Investic en Nariño. 
                                        Cada uno tiene una historia única y viene de una región diferente. 
                                        ¡Elige el que más te inspire!
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <style>{`
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-down { animation: slideDown 0.3s ease-out; }
            `}</style>
        </>
    );
}