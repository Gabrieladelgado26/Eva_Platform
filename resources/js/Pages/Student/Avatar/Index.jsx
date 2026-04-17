import { Head, Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    ArrowLeft, Sparkles, CheckCircle, Palette, Music,
    Microscope, Compass, Users, Calendar, GraduationCap,
    MapPin, Trophy, Crown, ChevronLeft, ChevronRight
} from "lucide-react";
import AppSidebar, { useSidebarState } from "@/Components/AppSidebar";

// ─── Toast Limpio y Estructurado ───────────────────────────────────────────
function Toast({ message, type = 'success', onClose, duration = 4000 }) {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const start = Date.now();
        const iv = setInterval(() => {
            const rem = Math.max(0, 100 - ((Date.now() - start) / duration) * 100);
            setProgress(rem);
            if (rem <= 0) onClose();
        }, 50);
        return () => clearInterval(iv);
    }, [duration, onClose]);

    const palette = {
        success: { wrap: 'bg-white border-green-500', text: 'text-green-600', bar: 'bg-green-500' },
        error:   { wrap: 'bg-white border-red-500',     text: 'text-red-600',   bar: 'bg-red-500' },
        info:    { wrap: 'bg-white border-blue-500',    text: 'text-blue-600',  bar: 'bg-blue-500' },
    };
    const p = palette[type] ?? palette.info;

    return (
        <div className="fixed top-8 right-8 z-[100] animate-bounce-in">
            <div className={`relative overflow-hidden rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border-t-8 ${p.wrap} px-8 py-6`}>
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${p.bar} bg-opacity-20`}>
                        <CheckCircle className={`w-6 h-6 ${p.text}`} strokeWidth={3} />
                    </div>
                    <p className="text-lg font-black text-gray-700">{message}</p>
                </div>
                <div className="absolute bottom-0 left-0 h-2 opacity-30" style={{ width: `${progress}%`, backgroundColor: 'currentColor' }} class={p.text} />
            </div>
        </div>
    );
}

// ─── Componentes de Información en Recuadros ────────────────────────────────
function InfoBox({ icon: Icon, label, value, color }) {
    return (
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-[24px] border-2 shadow-sm transition-all hover:shadow-md flex items-center gap-4" style={{ borderColor: `${color}30` }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 shadow-inner" style={{ backgroundColor: `${color}10`, borderColor: color }}>
                <Icon className="w-6 h-6" style={{ color: color }} strokeWidth={2.5} />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-tighter text-gray-400">{label}</p>
                <p className="text-base font-bold text-gray-700 leading-tight">{value}</p>
            </div>
        </div>
    );
}

function SkillCard({ label, value, color, animate }) {
    return (
        <div className="bg-white p-5 rounded-[30px] shadow-[6px_6px_12px_#e2e8f0,-6px_-6px_12px_#ffffff] space-y-3">
            <div className="flex justify-between items-center">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</span>
                <span className="text-sm font-black p-1.5 rounded-lg" style={{ backgroundColor: `${color}15`, color: color }}>{value}%</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden p-1 shadow-inner">
                <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: animate ? `${value}%` : '0%', backgroundColor: color }}
                />
            </div>
        </div>
    );
}

// ─── Personajes ───────────────────────────────────────────────────────────────
const CHARACTERS = [
    { id: 'avatar2', name: 'William', title: 'Explorador Costero', age: 6, grade: '1° Primaria', origin: 'Pacífico Sur', icon: Compass, color: '#3B82F6', description: 'Willy vive con su madre y su abuela. Le encanta hacer preguntas sobre el mar.', catchphrase: '"¡El mar siempre tiene secretos!"' },
    { id: 'avatar1', name: 'Pilar', title: 'Artista de los Volcanes', age: 7, grade: '2° Primaria', origin: 'La Sabana', icon: Palette, color: '#10B981', description: 'Pili expresa su amor por las montañas y volcanes en sus dibujos llenos de color.', catchphrase: '"¡Cada paisaje cuenta una historia!"' },
    { id: 'avatar4', name: 'Alberto', title: 'Investigador Incansable', age: 8, grade: '3° Primaria', origin: 'Centro', icon: Microscope, color: '#F59E0B', description: 'Beto nunca se conforma con la primera respuesta. Convierte dudas en ciencia.', catchphrase: '"¡Investigar es mi superpoder!"' },
    { id: 'avatar5', name: 'Ivy', title: 'Voz de Sanquianga', age: 10, grade: '4° Primaria', origin: 'Sanquianga', icon: Music, color: '#8B5CF6', description: 'Ivy ama el folclor y lleva un diario de campo donde anota sus descubrimientos.', catchphrase: '"¡La música es el alma de mi tierra!"' },
    { id: 'avatar6', name: 'Juliana', title: 'Líder Cafetera', age: 12, grade: '5° Primaria', origin: 'Occidente', icon: Users, color: '#0D9488', description: 'Juli es reconocida por su compromiso con la comunidad y el medio ambiente.', catchphrase: '"¡Juntos llegamos más lejos!"' },
    { id: 'avatar3', name: 'Felipe', title: 'Músico Científico', age: 15, grade: 'Secundaria', origin: 'Río Mayo', icon: Music, color: '#EF4444', description: 'Pipe aprendió guitarra solo y quiere saber cómo se produce el sonido físicamente.', catchphrase: '"¡La música y la ciencia son hermanas!"' },
];

export default function AvatarIndex({ currentAvatar = null, flash = {} }) {
    const [collapsed] = useSidebarState();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedId, setSelectedId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [animating, setAnimating] = useState(false);

    const char = CHARACTERS[currentIndex];
    const isCurrent = char.id === currentAvatar;
    const isSelected = selectedId === char.id;

    useEffect(() => {
        if (flash?.success) setToast({ message: flash.success, type: 'success' });
    }, [flash]);

    const navigateTo = (index) => {
        if (animating) return;
        setAnimating(true);
        setSelectedId(null);
        setTimeout(() => {
            setCurrentIndex(index);
            setAnimating(false);
        }, 300);
    };

    const handleConfirm = () => {
        if (!selectedId || saving) return;
        setSaving(true);
        router.post(route('student.avatar.store'), { avatar: selectedId }, {
            onSuccess: () => {
                setSaving(false);
                setToast({ message: `¡Excelente elección! ${char.name} te espera.`, type: 'success' });
            },
            onError: () => setSaving(false)
        });
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden">
            <Head title="Elige tu Compañero" />
            <AppSidebar currentRoute="student.avatar.index" />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <main className={`transition-all duration-500 ${collapsed ? "lg:ml-20" : "lg:ml-72"} relative min-h-screen`}>
                
                {/* Fondo con Formas Orgánicas */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full opacity-10 blur-3xl animate-pulse" style={{ backgroundColor: char.color }} />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full opacity-10 blur-3xl animate-pulse" style={{ backgroundColor: char.color }} />
                </div>

                <div className="relative z-10 p-6 lg:p-12 max-w-[1400px] mx-auto">
                    
                    {/* Header Limpio */}
                    <div className="flex justify-between items-center mb-12">
                        <Link href={route("student.dashboard")} className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all font-bold text-gray-500 hover:text-gray-700">
                            <ArrowLeft className="w-5 h-5" />
                            Regresar
                        </Link>
                        <h1 className="hidden md:block text-sm font-black text-gray-300 uppercase tracking-[0.2em]">Selección de Investigador</h1>
                    </div>

                    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-12 items-center">
                        
                        {/* Visual del Avatar */}
                        <div className="relative flex flex-col items-center">
                            <div className={`relative transition-all duration-500 ${animating ? 'scale-75 opacity-0 rotate-12' : 'scale-100 opacity-100 rotate-0'}`}>
                                
                                {/* Contenedor Principal */}
                                <div className="w-80 h-[480px] lg:w-[450px] lg:h-[600px] bg-white rounded-[70px] p-8 shadow-[20px_20px_60px_#d1d5db,-20px_-20px_60px_#ffffff] relative overflow-hidden group">
                                    <div className="absolute inset-0 opacity-10 animate-pulse" style={{ background: `radial-gradient(circle, ${char.color} 0%, transparent 70%)` }} />
                                    
                                    <img 
                                        src={`/avatars/${char.id}.png`} 
                                        className="w-full h-full object-cover rounded-[50px] transition-transform duration-700 group-hover:scale-105 relative z-10"
                                        alt={char.name}
                                    />

                                    {isCurrent && (
                                        <div className="absolute top-10 left-10 z-20 bg-yellow-400 px-6 py-2 rounded-2xl shadow-lg border-4 border-white font-black text-yellow-900 text-sm flex items-center gap-2">
                                            <Crown className="w-5 h-5" /> ACTUAL
                                        </div>
                                    )}
                                </div>

                                {/* Controles Flotantes */}
                                <div className="absolute top-1/2 -translate-y-1/2 -left-8 -right-8 flex justify-between pointer-events-none">
                                    <button onClick={() => navigateTo((currentIndex - 1 + CHARACTERS.length) % CHARACTERS.length)} className="pointer-events-auto w-16 h-16 rounded-3xl bg-white shadow-xl flex items-center justify-center text-gray-400 hover:text-gray-800 transition-all border border-gray-100"><ChevronLeft className="w-8 h-8" /></button>
                                    <button onClick={() => navigateTo((currentIndex + 1) % CHARACTERS.length)} className="pointer-events-auto w-16 h-16 rounded-3xl bg-white shadow-xl flex items-center justify-center text-gray-400 hover:text-gray-800 transition-all border border-gray-100"><ChevronRight className="w-8 h-8" /></button>
                                </div>
                            </div>
                        </div>

                        {/* Información del Personaje */}
                        <div className={`space-y-10 transition-all duration-500 delay-100 ${animating ? 'translate-x-10 opacity-0' : 'translate-x-0 opacity-100'}`}>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: char.color }} />
                                    <p className="text-lg font-black uppercase tracking-widest" style={{ color: char.color }}>{char.title}</p>
                                </div>
                                <h2 className="text-7xl font-black text-gray-800 tracking-tighter">{char.name}</h2>
                                <p className="text-2xl text-gray-400 font-medium leading-relaxed italic">"{char.catchphrase}"</p>
                            </div>

                            {/* Grid de Recuadros de Información */}
                            <div className="grid grid-cols-2 gap-4">
                                <InfoBox icon={Calendar} label="Edad" value={`${char.age} años`} color={char.color} />
                                <InfoBox icon={GraduationCap} label="Grado" value={char.grade} color={char.color} />
                                <div className="col-span-2">
                                    <InfoBox icon={MapPin} label="Ubicación" value={char.origin} color={char.color} />
                                </div>
                            </div>

                            {/* Sección de Habilidades (Neomorfismo) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <SkillCard label="Curiosidad" value={95} color="#3B82F6" animate={!animating} />
                                <SkillCard label="Creatividad" value={88} color="#EC4899" animate={!animating} />
                            </div>

                            {/* Botón de Selección */}
                            <div className="pt-4">
                                <button
                                    onClick={() => isSelected ? handleConfirm() : setSelectedId(char.id)}
                                    disabled={isCurrent || saving}
                                    className={`w-full py-8 rounded-[40px] font-black text-2xl transition-all flex items-center justify-center gap-4 relative overflow-hidden
                                        ${isCurrent 
                                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-inner' 
                                            : isSelected 
                                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_20px_40px_rgba(34,197,94,0.3)] hover:scale-[1.02]'
                                                : 'bg-white text-gray-700 shadow-[10px_10px_20px_#e2e8f0,-10px_-10px_20px_#ffffff] hover:shadow-[15px_15px_30px_#cbd5e1] border-2 border-transparent hover:border-gray-100 active:scale-95'
                                        }`}
                                >
                                    {isCurrent ? (
                                        'YA ES TU COMPAÑERO'
                                    ) : isSelected ? (
                                        <> <CheckCircle className="w-8 h-8" strokeWidth={3} /> {saving ? 'CARGANDO...' : '¡CONFIRMAR AHORA!'} </>
                                    ) : (
                                        <> <Sparkles className="w-7 h-7" style={{ color: char.color }} /> {`ELEGIR A ${char.name.toUpperCase()}`} </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Selector Inferior - Miniaturas */}
                    <div className="mt-20 flex justify-center gap-6 px-4 overflow-x-auto py-6 no-scrollbar">
                        {CHARACTERS.map((c, i) => (
                            <button
                                key={c.id}
                                onClick={() => navigateTo(i)}
                                className={`group shrink-0 relative w-24 h-24 rounded-[30px] transition-all duration-300 border-4
                                    ${i === currentIndex 
                                        ? 'bg-white scale-125 z-20 shadow-xl' 
                                        : 'bg-gray-50 scale-100 opacity-60 hover:opacity-100 border-transparent shadow-sm'
                                    }`}
                                style={{ borderColor: i === currentIndex ? c.color : 'transparent' }}
                            >
                                <img src={`/avatars/${c.id}.png`} className="w-full h-full object-cover rounded-[22px]" />
                            </button>
                        ))}
                    </div>
                </div>
            </main>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                @keyframes bounceIn {
                    0% { transform: scale(0.3); opacity: 0; }
                    50% { transform: scale(1.05); opacity: 1; }
                    70% { transform: scale(0.9); }
                    100% { transform: scale(1); }
                }
                .animate-bounce-in { animation: bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
            `}</style>
        </div>
    );
}