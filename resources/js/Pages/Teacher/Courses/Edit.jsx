import { Head, Link, useForm, router } from "@inertiajs/react";
import {
    ArrowLeft, BookOpen, GraduationCap, Info, Check, AlertTriangle, 
    Layers, Hash, FileText, Power, EyeOff, Users, Clock, Shield, 
    RotateCcw, X, AlertCircle, Save
} from "lucide-react";
import { useState } from "react";

export default function Edit({ course, teacher = null }) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const { data, setData, put, errors, processing } = useForm({
        grade: course.grade || "",
        section: course.section || "",
        description: course.description || "",
        is_active: course.is_active ?? true
    });

    function submit(e) {
        e.preventDefault();
        put(route("teacher.courses.update", course.id), {
            preserveScroll: true,
        });
    }

    const handleToggleStatus = () => {
        setShowConfirmModal(true);
    };

    const confirmToggleStatus = () => {
        setShowConfirmModal(false);
        setData("is_active", !data.is_active);
    };

    const isFieldValid = (field) => {
        if (!data[field] && field !== "is_active") return false;
        if (field === "grade") return data.grade !== "";
        if (field === "section") return data.section !== "";
        return true;
    };

    const totalFields = 4; // grade, section, description, is_active
    const completedFields = 
        (data.grade ? 1 : 0) +
        (data.section ? 1 : 0) +
        (data.description ? 1 : 0) +
        1; // is_active siempre tiene un valor
    
    const progress = Math.round((completedFields / totalFields) * 100);

    const getGradeColor = (grade) => {
        const colors = {
            primero: { bg: "#F3E8FF", text: "#540D6E" },
            segundo: { bg: "#E8F5F0", text: "#0EAD69" },
            tercero: { bg: "#FFF4E5", text: "#FF8C42" },
            cuarto: { bg: "#FEF2F2", text: "#EE4266" },
            quinto: { bg: "#E6F3FF", text: "#3B9AE1" }
        };
        return colors[grade] || { bg: "#F3F4F6", text: "#6B7280" };
    };

    return (
        <>
            <Head title="Editar Curso" />

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

            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-5xl mx-auto">
                    {/* Header Académico */}
                    <div className="mb-12 animate-fade-in">
                        <Link
                            href={route('teacher.index')}
                            className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-8 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/80"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                            <span>Volver a Mis Cursos</span>
                        </Link>
                        
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-4 rounded-xl shadow-sm border" style={{ 
                                backgroundColor: 'white',
                                borderColor: '#FFD23F'
                            }}>
                                <GraduationCap className="w-10 h-10" style={{ color: '#FFD23F' }} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                    Actualización de Curso
                                </h1>
                                <p className="text-gray-600 text-base">
                                    Modifique la información del curso: {course.grade} {course.section}
                                </p>
                            </div>
                        </div>

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <BookOpen className="w-4 h-4" />
                            <span>Gestión de Cursos</span>
                            <span>/</span>
                            <Link href={route('teacher.index')} className="hover:text-purple-600 transition-colors">
                                Mis Cursos
                            </Link>
                            <span>/</span>
                            <span className="font-medium" style={{ color: '#540D6E' }}>Editar Curso</span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slide-up">
                                {/* Status Banner */}
                                <div 
                                    className="border-b border-gray-200 p-4"
                                    style={{ backgroundColor: data.is_active ? '#E8F5F0' : '#FEE2E2' }}
                                >
                                    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border" style={{ borderColor: data.is_active ? '#0EAD69' : '#EE4266' }}>
                                        {data.is_active ? (
                                            <>
                                                <Power className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#0EAD69' }} />
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 mb-1">
                                                        Curso Activo
                                                    </p>
                                                    <p className="text-sm text-gray-700">
                                                        El curso es visible para los estudiantes y pueden acceder a él.
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <EyeOff className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#EE4266' }} />
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 mb-1">
                                                        Curso Inactivo
                                                    </p>
                                                    <p className="text-sm text-gray-700">
                                                        El curso no es visible para los estudiantes. Active para permitir el acceso.
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <form onSubmit={submit} className="p-8 lg:p-10 space-y-8">
                                    <div className="border-b border-gray-200 pb-4 mb-6">
                                        <h2 className="text-lg font-bold text-gray-900">Información del Curso</h2>
                                        <p className="text-sm text-gray-500 mt-1">Actualice los datos del curso</p>
                                    </div>

                                    {/* Grade Field */}
                                    <div className="group/field">
                                        <label htmlFor="grade" className="block text-sm font-semibold text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <Layers className="w-4 h-4" style={{ color: '#540D6E' }} />
                                                <span>Grado</span>
                                                <span style={{ color: '#EE4266' }}>*</span>
                                                {isFieldValid('grade') && (
                                                    <Check className="w-4 h-4 ml-auto animate-scale-in" style={{ color: '#0EAD69' }} />
                                                )}
                                            </div>
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="grade"
                                                value={data.grade}
                                                onChange={(e) => setData("grade", e.target.value)}
                                                onFocus={() => setFocusedField('grade')}
                                                onBlur={() => setFocusedField(null)}
                                                className={`w-full px-4 py-3 border rounded-lg font-medium transition-all duration-200 appearance-none cursor-pointer ${
                                                    errors.grade
                                                        ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                                        : focusedField === 'grade'
                                                        ? "bg-white shadow-sm ring-2"
                                                        : "border-gray-300 bg-white hover:border-gray-400"
                                                }`}
                                                style={focusedField === 'grade' && !errors.grade ? { 
                                                    borderColor: '#540D6E',
                                                    '--tw-ring-color': 'rgba(84, 13, 110, 0.2)'
                                                } : {}}
                                            >
                                                <option value="">Seleccione un grado</option>
                                                <option value="primero">Primero</option>
                                                <option value="segundo">Segundo</option>
                                                <option value="tercero">Tercero</option>
                                                <option value="cuarto">Cuarto</option>
                                                <option value="quinto">Quinto</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                        {errors.grade && (
                                            <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg animate-slide-down" style={{
                                                borderLeftColor: '#EE4266'
                                            }}>
                                                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EE4266' }} />
                                                <p className="text-sm font-medium text-red-800">{errors.grade}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Section Field */}
                                    <div className="group/field">
                                        <label htmlFor="section" className="block text-sm font-semibold text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <Hash className="w-4 h-4" style={{ color: '#540D6E' }} />
                                                <span>Sección</span>
                                                <span style={{ color: '#EE4266' }}>*</span>
                                                {isFieldValid('section') && (
                                                    <Check className="w-4 h-4 ml-auto animate-scale-in" style={{ color: '#0EAD69' }} />
                                                )}
                                            </div>
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="section"
                                                value={data.section}
                                                onChange={(e) => setData("section", e.target.value)}
                                                onFocus={() => setFocusedField('section')}
                                                onBlur={() => setFocusedField(null)}
                                                className={`w-full px-4 py-3 border rounded-lg font-medium transition-all duration-200 appearance-none cursor-pointer ${
                                                    errors.section
                                                        ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                                        : focusedField === 'section'
                                                        ? "bg-white shadow-sm ring-2"
                                                        : "border-gray-300 bg-white hover:border-gray-400"
                                                }`}
                                                style={focusedField === 'section' && !errors.section ? { 
                                                    borderColor: '#540D6E',
                                                    '--tw-ring-color': 'rgba(84, 13, 110, 0.2)'
                                                } : {}}
                                            >
                                                <option value="">Seleccione una sección</option>
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="C">C</option>
                                                <option value="D">D</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                        {errors.section && (
                                            <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg animate-slide-down" style={{
                                                borderLeftColor: '#EE4266'
                                            }}>
                                                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EE4266' }} />
                                                <p className="text-sm font-medium text-red-800">{errors.section}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Description Field */}
                                    <div className="group/field">
                                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4" style={{ color: '#540D6E' }} />
                                                <span>Descripción</span>
                                                {data.description && (
                                                    <Check className="w-4 h-4 ml-auto animate-scale-in" style={{ color: '#0EAD69' }} />
                                                )}
                                            </div>
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                id="description"
                                                value={data.description}
                                                onChange={(e) => setData("description", e.target.value)}
                                                onFocus={() => setFocusedField('description')}
                                                onBlur={() => setFocusedField(null)}
                                                rows="4"
                                                className={`w-full px-4 py-3 border rounded-lg font-medium transition-all duration-200 resize-none ${
                                                    errors.description
                                                        ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                                        : focusedField === 'description'
                                                        ? "bg-white shadow-sm ring-2"
                                                        : "border-gray-300 bg-white hover:border-gray-400"
                                                }`}
                                                style={focusedField === 'description' && !errors.description ? { 
                                                    borderColor: '#540D6E',
                                                    '--tw-ring-color': 'rgba(84, 13, 110, 0.2)'
                                                } : {}}
                                                placeholder="Describa el contenido y objetivos del curso"
                                            />
                                            {data.description && (
                                                <div className="absolute right-3 bottom-3">
                                                    <div className="p-1 rounded-full" style={{ backgroundColor: '#E8F5F0' }}>
                                                        <Check className="w-4 h-4" style={{ color: '#0EAD69' }} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {errors.description && (
                                            <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg animate-slide-down" style={{
                                                borderLeftColor: '#EE4266'
                                            }}>
                                                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EE4266' }} />
                                                <p className="text-sm font-medium text-red-800">{errors.description}</p>
                                            </div>
                                        )}
                                        <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                                            <Info className="w-3 h-3" />
                                            <span>{data.description.length}/500 caracteres</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-end gap-4 pt-8 border-t border-gray-200">
                                        <Link
                                            href={route('teacher.index')}
                                            className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                                            style={{ '--tw-ring-color': 'rgba(107, 114, 128, 0.3)' }}
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
                                                    <span>Actualizando...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    <span>Actualizar Curso</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Security Notice */}
                            <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#E8F5F0' }}>
                                        <Shield className="w-5 h-5" style={{ color: '#0EAD69' }} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-gray-900 mb-1">
                                            Gestión Académica
                                        </h3>
                                        <p className="text-xs text-gray-600 leading-relaxed">
                                            Los cambios se reflejarán inmediatamente. Si desactiva el curso, 
                                            los estudiantes perderán el acceso hasta que sea reactivado.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Academic Sidebar */}
                        <div className="lg:col-span-1 space-y-6 animate-slide-left">
                            {/* Course Info Card */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#F3E8FF' }}>
                                        <GraduationCap className="w-5 h-5" style={{ color: '#540D6E' }} />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Información Actual</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm capitalize">
                                                {course.grade} {course.section}
                                            </p>
                                            <p className="text-xs text-gray-500">ID: #{course.id}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-start gap-2">
                                            <Users className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Estudiantes matriculados</p>
                                                <p className="text-gray-900 font-medium">{course.students_count || 0} estudiantes</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Año lectivo</p>
                                                <p className="text-gray-900 font-medium">{course.school_year || "2024"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Card */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#F3E8FF' }}>
                                        <Info className="w-5 h-5" style={{ color: '#540D6E' }} />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Progreso</h3>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { label: "Grado", completed: !!data.grade },
                                        { label: "Sección", completed: !!data.section },
                                        { label: "Descripción", completed: !!data.description },
                                        { label: "Estado", completed: true },
                                    ].map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-3 rounded-lg border transition-all duration-200"
                                            style={{
                                                borderColor: item.completed ? "#0EAD69" : "#E5E7EB",
                                                backgroundColor: item.completed ? "#F0FDF4" : "#FAFAFA",
                                            }}
                                        >
                                            <div
                                                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300`}
                                                style={{
                                                    backgroundColor: item.completed ? "#0EAD69" : "#E5E7EB",
                                                }}
                                            >
                                                {item.completed && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className={`text-sm font-medium transition-colors duration-300`} style={{
                                                color: item.completed ? "#0EAD69" : "#6B7280",
                                            }}>
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
                                        <div
                                            className="h-2 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${progress}%`,
                                                backgroundColor: "#0EAD69",
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Tips Card */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#FFF9E6' }}>
                                        <BookOpen className="w-5 h-5" style={{ color: '#D97706' }} />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Recomendaciones</h3>
                                </div>
                                <ul className="space-y-2.5 text-sm text-gray-600">
                                    <li className="flex gap-2.5 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#540D6E' }}></div>
                                        <span>La modificación del grado o sección afecta a todos los estudiantes</span>
                                    </li>
                                    <li className="flex gap-2.5 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#540D6E' }}></div>
                                        <span>Al desactivar el curso, los estudiantes pierden acceso inmediatamente</span>
                                    </li>
                                    <li className="flex gap-2.5 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#540D6E' }}></div>
                                        <span>Las evaluaciones y materiales asociados se conservan</span>
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

            {/* Modal de Confirmación para Cambiar Estado */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full animate-slide-up overflow-hidden">
                        <div className="h-1" style={{ background: 'linear-gradient(to right, #EE4266, #DC2F55)' }} />
                        
                        <div className="p-6">
                            <button onClick={() => setShowConfirmModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: '#FEE2E2' }}>
                                    {data.is_active ? (
                                        <EyeOff className="w-6 h-6" style={{ color: '#EE4266' }} />
                                    ) : (
                                        <Power className="w-6 h-6" style={{ color: '#EE4266' }} />
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {data.is_active ? 'Desactivar' : 'Activar'} Curso
                                </h3>
                            </div>

                            <p className="text-gray-600 mb-4">
                                ¿Estás seguro de {data.is_active ? 'desactivar' : 'activar'} el curso <span className="font-semibold text-gray-900 capitalize">{course.grade} {course.section}</span>?
                            </p>

                            <div className="p-3 rounded-lg mb-6 flex gap-2" style={{ backgroundColor: '#FEF2F2', borderLeft: '4px solid #EE4266' }}>
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EE4266' }} />
                                <p className="text-xs text-gray-700">
                                    {data.is_active 
                                        ? 'Los estudiantes no podrán acceder al curso hasta que sea reactivado.'
                                        : 'Los estudiantes podrán acceder al curso inmediatamente.'}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setShowConfirmModal(false)} 
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={confirmToggleStatus} 
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-md" 
                                    style={{ backgroundColor: data.is_active ? '#EE4266' : '#0EAD69' }} 
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = data.is_active ? '#DC2F55' : '#059669'} 
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = data.is_active ? '#EE4266' : '#0EAD69'}
                                >
                                    {data.is_active ? 'Desactivar' : 'Activar'}
                                </button>
                            </div>
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