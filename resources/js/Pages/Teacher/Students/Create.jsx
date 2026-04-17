// Resources/js/Pages/Teacher/Students/Create.jsx
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import {
    ArrowLeft, User, Check, Loader2, GraduationCap, 
    Info, BookOpen, KeyRound, AlertCircle
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
                        <AlertCircle className="w-4 h-4" />
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

export default function Create({ courses = [] }) {
    const [collapsed] = useSidebarState();
    const { props } = usePage();
    const flash = props.flash || {};
    
    const [toast, setToast] = useState(null);
    const [focusedField, setFocusedField] = useState(null);

    const { data, setData, post, errors, processing } = useForm({
        name: "",
        course_id: courses.length > 0 ? courses[0].id.toString() : "",
    });

    // Mostrar toast cuando hay flash messages
    useEffect(() => {
        if (flash?.success) {
            setToast({ message: flash.success, type: 'success' });
        }
        if (flash?.error) {
            setToast({ message: flash.error, type: 'error' });
        }
    }, [flash]);

    function submit(e) {
        e.preventDefault();
        
        const courseId = data.course_id;
        if (!courseId) {
            setToast({ message: 'Debe seleccionar un curso', type: 'error' });
            return;
        }

        post(route("teacher.courses.students.store", courseId), {
            preserveScroll: true,
            onSuccess: () => {
                setToast({ message: 'Estudiante registrado correctamente', type: 'success' });
            },
            onError: () => {
                setToast({ message: 'Error al registrar el estudiante', type: 'error' });
            }
        });
    }

    const isFieldValid = (field) => {
        if (!data[field]) return false;
        return true;
    };

    const totalFields = 2;
    const completedFields = (data.name ? 1 : 0) + (data.course_id ? 1 : 0);
    const progress = Math.round((completedFields / totalFields) * 100);

    const GRADE_LABELS = {
        primero: "Primero", segundo: "Segundo", tercero: "Tercero",
        cuarto: "Cuarto", quinto: "Quinto",
    };

    return (
        <>
            <Head title="Registrar Estudiante" />
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
                                    Registrar Estudiante
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
                                <div className="p-4 rounded-xl shadow-sm border bg-white" style={{ borderColor: "#540D6E" }}>
                                    <GraduationCap className="w-10 h-10" style={{ color: "#540D6E" }} />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Registrar Estudiante</h1>
                                    <p className="text-gray-600 text-base">
                                        Complete el formulario para agregar un nuevo estudiante a su curso
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Main Form */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slide-up">
                                    {/* Progress indicator */}
                                    <div className="h-1 bg-gray-100 relative overflow-hidden">
                                        <div
                                            className="absolute inset-y-0 left-0 transition-all duration-500 ease-out"
                                            style={{
                                                width: `${progress}%`,
                                                background: "linear-gradient(to right, #540D6E, #EE4266)",
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                                        </div>
                                    </div>

                                    <form onSubmit={submit} className="p-8 lg:p-10 space-y-8">
                                        <div className="border-b border-gray-200 pb-4 mb-6">
                                            <h2 className="text-lg font-bold text-gray-900">Información del Estudiante</h2>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Los campos marcados con{" "}
                                                <span style={{ color: "#EE4266" }}>*</span>{" "}
                                                son obligatorios
                                            </p>
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
                                                    onFocus={() => setFocusedField('name')}
                                                    onBlur={() => setFocusedField(null)}
                                                    className={`w-full px-4 py-3 border rounded-lg font-medium transition-all duration-200 ${
                                                        errors.name
                                                            ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                                            : focusedField === 'name'
                                                            ? "bg-white shadow-sm ring-2"
                                                            : "border-gray-300 bg-white hover:border-gray-400"
                                                    }`}
                                                    style={focusedField === 'name' && !errors.name ? { 
                                                        borderColor: '#540D6E',
                                                        '--tw-ring-color': 'rgba(84, 13, 110, 0.2)'
                                                    } : {}}
                                                    placeholder="Ejemplo: Juan Pérez González"
                                                    autoFocus
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

                                        {/* Course Selection Field */}
                                        <div className="group/field">
                                            <label htmlFor="course" className="block text-sm font-semibold text-gray-700 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="w-4 h-4" style={{ color: '#540D6E' }} />
                                                    <span>Asignar a Curso</span>
                                                    <span style={{ color: '#EE4266' }}>*</span>
                                                    {isFieldValid('course_id') && (
                                                        <Check className="w-4 h-4 ml-auto animate-scale-in" style={{ color: '#0EAD69' }} />
                                                    )}
                                                </div>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    id="course"
                                                    value={data.course_id}
                                                    onChange={(e) => setData("course_id", e.target.value)}
                                                    onFocus={() => setFocusedField('course')}
                                                    onBlur={() => setFocusedField(null)}
                                                    className={`w-full px-4 py-3 border rounded-lg font-medium transition-all duration-200 appearance-none cursor-pointer ${
                                                        errors.course_id
                                                            ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                                            : focusedField === 'course'
                                                            ? "bg-white shadow-sm ring-2"
                                                            : "border-gray-300 bg-white hover:border-gray-400"
                                                    }`}
                                                    style={focusedField === 'course' && !errors.course_id ? { 
                                                        borderColor: '#540D6E',
                                                        '--tw-ring-color': 'rgba(84, 13, 110, 0.2)'
                                                    } : {}}
                                                >
                                                    <option value="">Seleccione un curso</option>
                                                    {courses.map((course) => (
                                                        <option key={course.id} value={course.id}>
                                                            {GRADE_LABELS[course.grade] ?? course.grade} {course.section} - {course.school_year}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                            {errors.course_id && (
                                                <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg animate-slide-down" style={{
                                                    borderLeftColor: '#EE4266'
                                                }}>
                                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EE4266' }} />
                                                    <p className="text-sm font-medium text-red-800">{errors.course_id}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Credenciales automáticas */}
                                        <div className="mb-6 overflow-hidden rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-white shadow-sm">
                                            <div className="flex items-start gap-4 p-4">
                                                <div className="flex-shrink-0">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 shadow-sm">
                                                        <KeyRound className="h-5 w-5" style={{ color: '#540D6E' }} />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 mb-1">
                                                        Credenciales automáticas para estudiante
                                                    </h3>
                                                    <p className="text-sm text-gray-600 leading-relaxed">
                                                        El sistema generará automáticamente un{" "}
                                                        <span className="font-medium text-purple-700">usuario único</span> y un{" "}
                                                        <span className="font-medium text-purple-700">PIN de 4 dígitos</span>. 
                                                        Estas credenciales se mostrarán al guardar el registro.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 bg-purple-100/50 px-4 py-2 text-xs border-t border-purple-200">
                                                <Info className="h-3.5 w-3.5" style={{ color: '#540D6E' }} />
                                                <span className="text-purple-800">El estudiante usará estas credenciales para iniciar sesión</span>
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
                                                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                                                style={{
                                                    backgroundColor: "#540D6E",
                                                    '--tw-ring-color': 'rgba(84, 13, 110, 0.5)'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#6B1689"}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#540D6E"}
                                            >
                                                {processing ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span>Registrando...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check className="w-4 h-4" />
                                                        <span>Registrar Estudiante</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1 space-y-6 animate-slide-left">
                                {/* Progress Card */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="p-2 rounded-lg" style={{ backgroundColor: '#F3E8FF' }}>
                                            <Info className="w-5 h-5" style={{ color: '#540D6E' }} />
                                        </div>
                                        <h3 className="font-bold text-gray-900">Estado del Formulario</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { label: "Nombre Completo", completed: !!data.name },
                                            { label: "Curso Asignado", completed: !!data.course_id },
                                        ].map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-3 rounded-lg border transition-all duration-200"
                                                style={{
                                                    borderColor: item.completed ? "#0EAD69" : "#E5E7EB",
                                                    backgroundColor: item.completed ? "#F0FDF4" : "#FAFAFA",
                                                }}
                                            >
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300`}
                                                    style={{ backgroundColor: item.completed ? "#0EAD69" : "#E5E7EB" }}>
                                                    {item.completed && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                                <span className={`text-sm font-medium transition-colors duration-300`}
                                                    style={{ color: item.completed ? "#0EAD69" : "#6B7280" }}>
                                                    {item.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-5 pt-5 border-t border-gray-200">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-semibold text-gray-700">Progreso Total</span>
                                            <span className="font-bold" style={{ color: '#540D6E' }}>{progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${progress}%`, backgroundColor: "#0EAD69" }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Available Courses */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg" style={{ backgroundColor: '#E8F5F0' }}>
                                            <BookOpen className="w-5 h-5" style={{ color: '#0EAD69' }} />
                                        </div>
                                        <h3 className="font-bold text-gray-900">Mis Cursos</h3>
                                    </div>
                                    <div className="space-y-2 max-h-80 overflow-y-auto">
                                        {courses.length > 0 ? (
                                            courses.map((course) => (
                                                <div
                                                    key={course.id}
                                                    className={`p-3 rounded-lg border transition-all duration-200 ${
                                                        data.course_id === course.id.toString()
                                                            ? "text-white shadow-sm"
                                                            : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
                                                    }`}
                                                    style={
                                                        data.course_id === course.id.toString()
                                                            ? { backgroundColor: "#540D6E", borderColor: "#540D6E" }
                                                            : {}
                                                    }
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="w-4 h-4" />
                                                        <span className="text-sm font-semibold">
                                                            {GRADE_LABELS[course.grade] ?? course.grade} {course.section}
                                                        </span>
                                                        {data.course_id === course.id.toString() && (
                                                            <Check className="w-4 h-4 ml-auto" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs mt-1 opacity-80">{course.school_year}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500 text-center py-4">
                                                No tienes cursos activos
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Tips Card */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg" style={{ backgroundColor: '#FEF3C7' }}>
                                            <Info className="w-5 h-5" style={{ color: '#D97706' }} />
                                        </div>
                                        <h3 className="font-bold text-gray-900">Información Importante</h3>
                                    </div>
                                    <ul className="space-y-2.5 text-sm text-gray-600">
                                        <li className="flex gap-2.5 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#540D6E' }}></div>
                                            <span>El estudiante será asignado al curso seleccionado</span>
                                        </li>
                                        <li className="flex gap-2.5 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#540D6E' }}></div>
                                            <span>Se generará un usuario y PIN únicos automáticamente</span>
                                        </li>
                                        <li className="flex gap-2.5 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#540D6E' }}></div>
                                            <span>Las credenciales se mostrarán una sola vez al crear</span>
                                        </li>
                                        <li className="flex gap-2.5 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#540D6E' }}></div>
                                            <span>Puede asignar el estudiante a más cursos después</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
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
                @keyframes slideDownToast {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-shimmer { animation: shimmer 2s infinite; }
                .animate-fade-in { animation: fadeIn 0.6s ease-out; }
                .animate-slide-up { animation: slideUp 0.6s ease-out; }
                .animate-slide-down { animation: slideDown 0.3s ease-out; }
                .animate-slide-left { animation: slideLeft 0.8s ease-out; }
                .animate-scale-in { animation: scaleIn 0.3s ease-out; }
                .animate-slide-down-toast { animation: slideDownToast 0.3s ease-out; }
            `}</style>
        </>
    );
}