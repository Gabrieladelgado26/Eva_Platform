import { Head, Link, useForm, router, usePage } from "@inertiajs/react";
import { 
    ArrowLeft, User, KeyRound, GraduationCap, BookOpen, Info, 
    RotateCcw, X, AlertCircle, Copy, Check, Eye, EyeOff
} from "lucide-react";
import { useState, useEffect } from "react";
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
            
            if (remaining <= 0) {
                onClose();
            }
        }, 50);

        return () => clearInterval(interval);
    }, [duration, onClose]);

    const bgColor = type === 'success' 
        ? 'bg-green-50 border-green-300' 
        : type === 'error' 
            ? 'bg-red-50 border-red-300' 
            : 'bg-blue-50 border-blue-300';
    
    const textColor = type === 'success' 
        ? 'text-green-800' 
        : type === 'error' 
            ? 'text-red-800' 
            : 'text-blue-800';
    
    const iconColor = type === 'success' 
        ? 'text-green-600' 
        : type === 'error' 
            ? 'text-red-600' 
            : 'text-blue-600';
    
    const progressColor = type === 'success' 
        ? '#0EAD69' 
        : type === 'error' 
            ? '#EE4266' 
            : '#3B9AE1';

    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-down min-w-[320px] max-w-md">
            <div className={`relative overflow-hidden rounded-lg shadow-xl border ${bgColor}`}>
                <div className="flex items-start gap-3 px-4 py-3">
                    {type === 'success' ? (
                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
                    ) : type === 'error' ? (
                        <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
                    ) : (
                        <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
                    )}
                    <div className="flex-1">
                        <p className={`text-sm font-medium ${textColor}`}>{message}</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                
                <div 
                    className="h-1 transition-all duration-50 ease-linear"
                    style={{ 
                        width: `${progress}%`,
                        backgroundColor: progressColor
                    }}
                />
            </div>
        </div>
    );
}

// ─── Avatar del estudiante ─────────────────────────────────────────────────────
function StudentAvatar({ student }) {
    if (student?.avatar) {
        return (
            <img
                src={`/avatars/${student.avatar}.png`}
                alt={student.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent && !parent.querySelector('.avatar-fallback')) {
                        const fallback = document.createElement('div');
                        fallback.className = "avatar-fallback w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm";
                        fallback.style.background = "linear-gradient(to bottom right, #540D6E, #EE4266)";
                        fallback.textContent = student.name?.charAt(0).toUpperCase() ?? 'E';
                        parent.appendChild(fallback);
                    }
                }}
            />
        );
    }
    return (
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
            style={{ background: "linear-gradient(to bottom right, #540D6E, #EE4266)" }}>
            {student?.name?.charAt(0).toUpperCase() ?? 'E'}
        </div>
    );
}

export default function Edit({ student, courses = [] }) {
    const [collapsed] = useSidebarState();
    const { props } = usePage();
    const flash = props.flash || {};
    
    const [showPinModal, setShowPinModal] = useState(false);
    const [showCredentialsModal, setShowCredentialsModal] = useState(false);
    const [credentials, setCredentials] = useState(null);
    const [copied, setCopied] = useState({ pin: false });
    const [toast, setToast] = useState(null);

    const { data, setData, put, errors, processing } = useForm({
        name: student.name ?? "",
    });

    // Mostrar toast cuando hay flash messages
    useEffect(() => {
        if (flash?.success) {
            setToast({ message: flash.success, type: 'success' });
        }
        if (flash?.error) {
            setToast({ message: flash.error, type: 'error' });
        }
        if (flash?.credentials) {
            setCredentials(flash.credentials);
            setShowCredentialsModal(true);
        }
    }, [flash]);

    function submit(e) {
        e.preventDefault();
        put(route("teacher.students.update", student.id), {
            preserveScroll: true,
            onSuccess: () => {
                setToast({ message: 'Estudiante actualizado correctamente', type: 'success' });
            },
            onError: () => {
                setToast({ message: 'Error al actualizar el estudiante', type: 'error' });
            }
        });
    }

    const handleRegeneratePin = () => {
        setShowPinModal(true);
    };

    const confirmRegeneratePin = () => {
        setShowPinModal(false);
        router.post(route('teacher.students.regeneratePin', student.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                // El flash de credentials se manejará en el useEffect
            },
            onError: () => {
                setToast({ message: 'Error al regenerar el PIN', type: 'error' });
            }
        });
    };

    const copyToClipboard = async (text, field) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(prev => ({ ...prev, [field]: true }));
            setTimeout(() => {
                setCopied(prev => ({ ...prev, [field]: false }));
            }, 2000);
        } catch (err) {
            console.error("Error al copiar:", err);
        }
    };

    const isFieldValid = (field) => {
        if (!data[field]) return false;
        return true;
    };

    return (
        <>
            <Head title={`Editar Estudiante - ${student.name}`} />
            <AppSidebar currentRoute="teacher.students.index" />

            {/* Toast */}
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                    duration={4000}
                />
            )}

            {/* Fondo académico */}
            <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-50">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(84, 13, 110, 0.08) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}></div>
                <div className="absolute top-0 left-0 w-full h-1" style={{
                    background: 'linear-gradient(to right, #540D6E, #EE4266, #FFD23F, #3BCEAC, #0EAD69)'
                }}></div>
            </div>

            <main className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-20" : "lg:ml-72"} min-h-screen bg-transparent relative`}>
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        
                        {/* Breadcrumb */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Link href={route("dashboard")} className="hover:text-purple-600 transition-colors">
                                    Panel de Control
                                </Link>
                                <span>/</span>
                                <Link href={route("teacher.students.index")} className="hover:text-purple-600 transition-colors">
                                    Mis Estudiantes
                                </Link>
                                <span>/</span>
                                <span style={{ color: "#540D6E" }} className="font-medium">
                                    Editar Estudiante
                                </span>
                            </div>
                        </div>

                        {/* Header */}
                        <div className="mb-8 animate-fade-in">
                            <Link
                                href={route("teacher.students.index")}
                                className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-6 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/80"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                                <span>Volver a Mis Estudiantes</span>
                            </Link>
                            
                            <div className="flex items-start gap-4">
                                <div className="p-4 rounded-xl shadow-sm border bg-white" style={{ borderColor: "#FFD23F" }}>
                                    <GraduationCap className="w-10 h-10" style={{ color: "#D97706" }} />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Editar Estudiante</h1>
                                    <p className="text-gray-600 text-base">
                                        Modifique la información del estudiante: {student.name}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Main Form */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slide-up">
                                    <form onSubmit={submit} className="p-8 lg:p-10 space-y-8">
                                        <div className="border-b border-gray-200 pb-4 mb-6">
                                            <h2 className="text-lg font-bold text-gray-900">Información Personal</h2>
                                            <p className="text-sm text-gray-500 mt-1">Actualice los datos del estudiante</p>
                                        </div>

                                        {/* Name Field */}
                                        <div className="group/field">
                                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4" style={{ color: '#540D6E' }} />
                                                    <span>Nombre Completo</span>
                                                    <span style={{ color: '#EE4266' }}>*</span>
                                                    {isFieldValid('name') && (
                                                        <Check className="w-4 h-4 ml-auto animate-scale-in" style={{ color: '#0EAD69' }} />
                                                    )}
                                                </div>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="name"
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) => setData("name", e.target.value)}
                                                    className={`w-full px-4 py-3 border rounded-lg font-medium transition-all duration-200 ${
                                                        errors.name
                                                            ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                                            : "border-gray-300 bg-white hover:border-gray-400 focus:bg-white focus:shadow-sm focus:ring-2"
                                                    }`}
                                                    style={!errors.name ? { 
                                                        borderColor: '#540D6E',
                                                        '--tw-ring-color': 'rgba(84, 13, 110, 0.2)'
                                                    } : {}}
                                                    placeholder="Ejemplo: Juan Pérez González"
                                                />
                                                {isFieldValid('name') && !errors.name && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                        <div className="p-1 rounded-full" style={{ backgroundColor: '#E8F5F0' }}>
                                                            <Check className="w-4 h-4" style={{ color: '#0EAD69' }} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {errors.name && (
                                                <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg animate-slide-down" style={{
                                                    borderLeftColor: '#EE4266'
                                                }}>
                                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EE4266' }} />
                                                    <p className="text-sm font-medium text-red-800">{errors.name}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Username Field (solo lectura) */}
                                        <div className="group/field">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4" style={{ color: '#540D6E' }} />
                                                    <span>Usuario</span>
                                                </div>
                                            </label>
                                            <input
                                                type="text"
                                                value={student.username}
                                                disabled
                                                className="w-full px-4 py-3 border rounded-lg bg-gray-100 text-gray-600 font-medium cursor-not-allowed"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                El nombre de usuario no puede modificarse.
                                            </p>
                                        </div>

                                        {/* PIN Field */}
                                        <div className="bg-white rounded-xl border border-gray-200 p-5 mt-8">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F3E8FF' }}>
                                                        <KeyRound className="w-4 h-4" style={{ color: '#540D6E' }} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">PIN de acceso</h4>
                                                        <p className="text-xs text-gray-500">4 dígitos numéricos</p>
                                                    </div>
                                                </div>
                                                <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-gray-600 font-medium">Estudiante</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                                                    <KeyRound className="w-4 h-4 text-gray-400" />
                                                    <span className="font-mono text-base tracking-widest font-medium text-gray-600">••••</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleRegeneratePin}
                                                    className="px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors whitespace-nowrap"
                                                    style={{ backgroundColor: '#540D6E' }}
                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#6B1689'}
                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#540D6E'}
                                                >
                                                    <RotateCcw className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-end gap-4 pt-8 border-t border-gray-200">
                                            <Link
                                                href={route("teacher.students.index")}
                                                className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                                            >
                                                Cancelar
                                            </Link>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                                                style={{
                                                    backgroundColor: '#FFD23F',
                                                    '--tw-ring-color': 'rgba(255, 210, 63, 0.5)'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5C000'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFD23F'}
                                            >
                                                {processing ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        <span>Guardando...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check className="w-4 h-4" />
                                                        <span>Guardar Cambios</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1 space-y-6 animate-slide-left">
                                {/* Student Info Card */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="p-2 rounded-lg" style={{ backgroundColor: '#F3E8FF' }}>
                                            <User className="w-5 h-5" style={{ color: '#540D6E' }} />
                                        </div>
                                        <h3 className="font-bold text-gray-900">Información Actual</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <StudentAvatar student={student} />
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">{student.name}</p>
                                                <p className="text-xs text-gray-500">ID: #{student.id}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-start gap-2">
                                                <User className="w-4 h-4 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium">Usuario</p>
                                                    <p className="text-gray-900 font-medium">{student.username}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <BookOpen className="w-4 h-4 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium">Cursos inscritos</p>
                                                    <p className="text-gray-900 font-medium">{student.courses_count || 0} curso(s)</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium">Fecha de registro</p>
                                                    <p className="text-gray-900 font-medium">
                                                        {new Date(student.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Courses Card */}
                                {courses.length > 0 && (
                                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg" style={{ backgroundColor: '#E8F5F0' }}>
                                                <BookOpen className="w-5 h-5" style={{ color: '#0EAD69' }} />
                                            </div>
                                            <h3 className="font-bold text-gray-900">Cursos del Estudiante</h3>
                                        </div>
                                        <div className="space-y-2">
                                            {courses.map(course => (
                                                <div key={course.id} className="p-3 bg-gray-50 rounded-lg">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {course.grade} {course.section}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{course.school_year}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tips Card */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg" style={{ backgroundColor: '#FEF3C7' }}>
                                            <Info className="w-5 h-5" style={{ color: '#D97706' }} />
                                        </div>
                                        <h3 className="font-bold text-gray-900">Recomendaciones</h3>
                                    </div>
                                    <ul className="space-y-2.5 text-sm text-gray-600">
                                        <li className="flex gap-2.5 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#540D6E' }}></div>
                                            <span>El nombre del estudiante será visible en todos los reportes</span>
                                        </li>
                                        <li className="flex gap-2.5 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#540D6E' }}></div>
                                            <span>El PIN se regenera automáticamente y se muestra una sola vez</span>
                                        </li>
                                        <li className="flex gap-2.5 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#540D6E' }}></div>
                                            <span>Los cambios serán efectivos inmediatamente</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal de Confirmación para Regenerar PIN */}
            {showPinModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPinModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full animate-slide-up overflow-hidden">
                        <div className="h-1" style={{ background: 'linear-gradient(to right, #540D6E, #EE4266)' }} />
                        
                        <div className="p-6">
                            <button onClick={() => setShowPinModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: '#F3E8FF' }}>
                                    <RotateCcw className="w-5 h-5" style={{ color: '#540D6E' }} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Regenerar PIN</h3>
                            </div>

                            <p className="text-gray-600 mb-4">
                                ¿Estás seguro de regenerar el PIN de acceso para <span className="font-semibold text-gray-900">{student.name}</span>?
                            </p>

                            <div className="p-3 rounded-lg mb-6 flex gap-2" style={{ backgroundColor: '#FEF2F2', borderLeft: '4px solid #EE4266' }}>
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EE4266' }} />
                                <p className="text-xs text-gray-700">El PIN anterior dejará de funcionar inmediatamente. El estudiante deberá usar el nuevo PIN.</p>
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setShowPinModal(false)} 
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={confirmRegeneratePin} 
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-md" 
                                    style={{ backgroundColor: '#540D6E' }} 
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#6B1689'} 
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#540D6E'}
                                >
                                    Regenerar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Nuevo PIN Regenerado */}
            {showCredentialsModal && credentials && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCredentialsModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full animate-slide-up overflow-hidden">
                        <div className="h-1" style={{ background: "linear-gradient(to right, #540D6E, #EE4266)" }} />
                        
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-xl bg-white shadow-md border border-gray-200">
                                    <KeyRound className="w-8 h-8" style={{ color: "#540D6E" }} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">PIN Regenerado</h2>
                                    <p className="text-sm text-gray-600">Nuevo PIN de acceso para el estudiante</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Nuevo PIN</label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm flex items-center gap-2">
                                        <KeyRound className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-800 text-lg tracking-wider font-bold">{credentials.pin}</span>
                                    </div>
                                    <button onClick={() => copyToClipboard(credentials.pin, 'pin')}
                                        className="p-3 rounded-lg transition-all border-2 hover:shadow-md"
                                        style={{ borderColor: copied.pin ? "#0EAD69" : "#540D6E", backgroundColor: copied.pin ? "#E8F5F0" : "white" }}>
                                        {copied.pin ? <Check className="w-5 h-5" style={{ color: "#0EAD69" }} /> : <Copy className="w-5 h-5" style={{ color: "#540D6E" }} />}
                                    </button>
                                </div>
                                {copied.pin && <p className="text-xs text-green-600 mt-1 animate-fade-in">✓ PIN copiado</p>}
                            </div>

                            <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: "#F3E8FF", borderLeft: "4px solid #540D6E" }}>
                                <p className="text-xs text-gray-700 flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#540D6E" }} />
                                    <span>El PIN anterior ya no funciona, comparte este nuevo PIN de forma segura con el estudiante.</span>
                                </p>
                            </div>

                            <button onClick={() => setShowCredentialsModal(false)}
                                className="w-full py-3 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                                style={{ backgroundColor: "#540D6E" }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}>
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideLeft {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0); }
                    to { opacity: 1; transform: scale(1); }
                }
                
                .animate-fade-in { animation: fadeIn 0.6s ease-out; }
                .animate-slide-up { animation: slideUp 0.6s ease-out; }
                .animate-slide-down { animation: slideDown 0.3s ease-out; }
                .animate-slide-left { animation: slideLeft 0.8s ease-out; }
                .animate-scale-in { animation: scaleIn 0.3s ease-out; }
            `}</style>
        </>
    );
}