import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowLeft, BookOpen, GraduationCap, Info, Check, Loader2, AlertCircle,
    Shield, FileText, Layers, Hash, Users, Calendar, Save, EyeOff, Power,
    Clock, X, AlertTriangle
} from "lucide-react";
import { useState } from "react";
import AppSidebar, { useSidebarState } from "@/Components/AppSidebar";

const GRADES = [
    { value: 'primero', label: 'Primero' },
    { value: 'segundo', label: 'Segundo' },
    { value: 'tercero', label: 'Tercero' },
    { value: 'cuarto', label: 'Cuarto' },
    { value: 'quinto', label: 'Quinto' },
];

export default function Edit({ course, teachers = [] }) {
    const [collapsed] = useSidebarState();
    const { data, setData, put, errors, processing } = useForm({
        grade: course.grade || "",
        section: course.section || "",
        school_year: course.school_year || "",
        teacher_id: course.teacher?.id || "",
        description: course.description || "",
        is_active: course.is_active ?? true
    });

    const [focusedField, setFocusedField] = useState(null);
    const [showToggleModal, setShowToggleModal] = useState(false);

    function submit(e) {
        e.preventDefault();
        put(route("admin.courses.update", course.id), {
            preserveScroll: true,
        });
    }

    const handleToggleStatus = () => {
        setShowToggleModal(true);
    };

    const confirmToggleStatus = () => {
        setShowToggleModal(false);
        setData("is_active", !data.is_active);
    };

    const isFieldValid = (field) => {
        if (!data[field] && field !== "is_active" && field !== "description") return false;
        if (field === "grade") return data.grade !== "";
        if (field === "section") return data.section !== "";
        if (field === "school_year") return data.school_year !== "";
        if (field === "teacher_id") return data.teacher_id !== "";
        return true;
    };

    const totalFields = 5;
    const completedFields = 
        (data.grade ? 1 : 0) +
        (data.section ? 1 : 0) +
        (data.school_year ? 1 : 0) +
        (data.teacher_id ? 1 : 0) +
        (data.description ? 1 : 0);
    
    const progress = Math.round((completedFields / totalFields) * 100);

    const getGradeColor = (grade) => {
        const colors = {
            primero: { bg: "#F3E8FF", text: "#540D6E" },
            segundo: { bg: "#E8F5F0", text: "#0EAD69" },
            tercero: { bg: "#FEF3C7", text: "#D97706" },
            cuarto: { bg: "#FEE2E2", text: "#EE4266" },
            quinto: { bg: "#DBEAFE", text: "#1D4ED8" }
        };
        return colors[grade] || { bg: "#F3F4F6", text: "#6B7280" };
    };

    const gradeLabel = GRADES.find(g => g.value === course.grade)?.label || course.grade;

    return (
        <>
            <Head title={`Editar Curso - ${gradeLabel} ${course.section}`} />
            <AppSidebar currentRoute="admin.courses.index" />

            <main className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-20" : "lg:ml-72"} min-h-screen bg-gray-50`}>
                
                {/* Fondo académico */}
                <div className="fixed inset-0 -z-10 overflow-hidden">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(84, 13, 110, 0.08) 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }} />
                    <div className="absolute top-0 left-0 w-full h-1" style={{
                        background: 'linear-gradient(to right, #540D6E, #EE4266, #FFD23F, #3BCEAC, #0EAD69)'
                    }} />
                </div>

                <div className="py-8 px-4 sm:px-6 lg:px-8 relative">
                    <div className="max-w-5xl mx-auto">
                        
                        {/* Breadcrumb */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Link href={route("dashboard")} className="hover:text-purple-600 transition-colors">
                                    Panel de Control
                                </Link>
                                <span>/</span>
                                <Link href={route("admin.dashboard")} className="hover:text-purple-600 transition-colors">
                                    Administración
                                </Link>
                                <span>/</span>
                                <Link href={route("admin.courses.index")} className="hover:text-purple-600 transition-colors">
                                    Cursos
                                </Link>
                                <span>/</span>
                                <span style={{ color: "#540D6E" }} className="font-medium">
                                    Editar Curso
                                </span>
                            </div>
                        </div>

                        {/* Header */}
                        <div className="mb-8 animate-fade-in">
                            <Link
                                href={route("admin.courses.index")}
                                className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-6 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/80"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                                <span>Volver a Cursos</span>
                            </Link>

                            <div className="flex items-start gap-4">
                                <div className="p-4 rounded-xl shadow-sm border bg-white" style={{ borderColor: "#FFD23F" }}>
                                    <GraduationCap className="w-10 h-10" style={{ color: "#D97706" }} />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Editar Curso</h1>
                                    <p className="text-gray-600 text-base">
                                        Modifique la información del curso: {gradeLabel} {course.section}
                                    </p>
                                </div>
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
                                                        <p className="text-sm font-bold text-gray-900 mb-1">Curso Activo</p>
                                                        <p className="text-sm text-gray-700">
                                                            El curso es visible para los estudiantes y pueden acceder a él.
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#EE4266' }} />
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 mb-1">Curso Inactivo</p>
                                                        <p className="text-sm text-gray-700">
                                                            El curso no es visible para los estudiantes. Active para permitir el acceso.
                                                        </p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress indicator */}
                                    <div className="h-1 bg-gray-100 relative overflow-hidden">
                                        <div
                                            className="absolute inset-y-0 left-0 transition-all duration-500 ease-out"
                                            style={{
                                                width: `${progress}%`,
                                                background: "linear-gradient(to right, #FFD23F, #F5C000)",
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                                        </div>
                                    </div>

                                    <form onSubmit={submit} className="p-8 lg:p-10 space-y-6">
                                        <div className="border-b border-gray-200 pb-4 mb-4">
                                            <h2 className="text-lg font-bold text-gray-900">Información del Curso</h2>
                                            <p className="text-sm text-gray-500 mt-1">Actualice los datos del curso</p>
                                        </div>

                                        {/* Grade Field */}
                                        <div>
                                            <label htmlFor="grade" className="block text-sm font-semibold text-gray-700 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Layers className="w-4 h-4" style={{ color: "#540D6E" }} />
                                                    <span>Grado</span>
                                                    <span style={{ color: "#EE4266" }}>*</span>
                                                    {isFieldValid("grade") && (
                                                        <Check className="w-4 h-4 ml-auto animate-scale-in" style={{ color: "#0EAD69" }} />
                                                    )}
                                                </div>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    id="grade"
                                                    value={data.grade}
                                                    onChange={(e) => setData("grade", e.target.value)}
                                                    onFocus={() => setFocusedField("grade")}
                                                    onBlur={() => setFocusedField(null)}
                                                    className={`w-full px-4 py-3 border rounded-lg font-medium transition-all duration-200 appearance-none cursor-pointer ${
                                                        errors.grade
                                                            ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                                            : focusedField === "grade"
                                                            ? "bg-white shadow-sm ring-2"
                                                            : "border-gray-300 bg-white hover:border-gray-400"
                                                    }`}
                                                    style={focusedField === "grade" && !errors.grade ? { 
                                                        borderColor: '#540D6E',
                                                        '--tw-ring-color': 'rgba(84, 13, 110, 0.2)'
                                                    } : {}}
                                                >
                                                    <option value="">Seleccione un grado</option>
                                                    {GRADES.map(grade => (
                                                        <option key={grade.value} value={grade.value}>{grade.label}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                            {errors.grade && (
                                                <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg animate-slide-down" style={{ borderLeftColor: '#EE4266' }}>
                                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EE4266' }} />
                                                    <p className="text-sm font-medium text-red-800">{errors.grade}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Section Field */}
                                        <div>
                                            <label htmlFor="section" className="block text-sm font-semibold text-gray-700 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Hash className="w-4 h-4" style={{ color: "#540D6E" }} />
                                                    <span>Sección</span>
                                                    <span style={{ color: "#EE4266" }}>*</span>
                                                    {isFieldValid("section") && (
                                                        <Check className="w-4 h-4 ml-auto animate-scale-in" style={{ color: "#0EAD69" }} />
                                                    )}
                                                </div>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    id="section"
                                                    value={data.section}
                                                    onChange={(e) => setData("section", e.target.value)}
                                                    onFocus={() => setFocusedField("section")}
                                                    onBlur={() => setFocusedField(null)}
                                                    className={`w-full px-4 py-3 border rounded-lg font-medium transition-all duration-200 appearance-none cursor-pointer ${
                                                        errors.section
                                                            ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                                            : focusedField === "section"
                                                            ? "bg-white shadow-sm ring-2"
                                                            : "border-gray-300 bg-white hover:border-gray-400"
                                                    }`}
                                                    style={focusedField === "section" && !errors.section ? { 
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
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                            {errors.section && (
                                                <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg animate-slide-down" style={{ borderLeftColor: '#EE4266' }}>
                                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EE4266' }} />
                                                    <p className="text-sm font-medium text-red-800">{errors.section}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* School Year Field */}
                                        <div>
                                            <label htmlFor="school_year" className="block text-sm font-semibold text-gray-700 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" style={{ color: "#540D6E" }} />
                                                    <span>Año Escolar</span>
                                                    <span style={{ color: "#EE4266" }}>*</span>
                                                    {isFieldValid("school_year") && (
                                                        <Check className="w-4 h-4 ml-auto animate-scale-in" style={{ color: "#0EAD69" }} />
                                                    )}
                                                </div>
                                            </label>
                                            <input
                                                type="text"
                                                id="school_year"
                                                value={data.school_year}
                                                onChange={(e) => setData("school_year", e.target.value)}
                                                onFocus={() => setFocusedField("school_year")}
                                                onBlur={() => setFocusedField(null)}
                                                placeholder="Ej: 2025"
                                                className={`w-full px-4 py-3 border rounded-lg font-medium transition-all duration-200 ${
                                                    errors.school_year
                                                        ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                                        : focusedField === "school_year"
                                                        ? "bg-white shadow-sm ring-2"
                                                        : "border-gray-300 bg-white hover:border-gray-400"
                                                }`}
                                                style={focusedField === "school_year" && !errors.school_year ? { 
                                                    borderColor: '#540D6E',
                                                    '--tw-ring-color': 'rgba(84, 13, 110, 0.2)'
                                                } : {}}
                                            />
                                            {errors.school_year && (
                                                <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg animate-slide-down" style={{ borderLeftColor: '#EE4266' }}>
                                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EE4266' }} />
                                                    <p className="text-sm font-medium text-red-800">{errors.school_year}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Teacher Field */}
                                        <div>
                                            <label htmlFor="teacher_id" className="block text-sm font-semibold text-gray-700 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4" style={{ color: "#540D6E" }} />
                                                    <span>Docente a cargo</span>
                                                    <span style={{ color: "#EE4266" }}>*</span>
                                                    {isFieldValid("teacher_id") && (
                                                        <Check className="w-4 h-4 ml-auto animate-scale-in" style={{ color: "#0EAD69" }} />
                                                    )}
                                                </div>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    id="teacher_id"
                                                    value={data.teacher_id}
                                                    onChange={(e) => setData("teacher_id", e.target.value)}
                                                    onFocus={() => setFocusedField("teacher_id")}
                                                    onBlur={() => setFocusedField(null)}
                                                    className={`w-full px-4 py-3 border rounded-lg font-medium transition-all duration-200 appearance-none cursor-pointer ${
                                                        errors.teacher_id
                                                            ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                                            : focusedField === "teacher_id"
                                                            ? "bg-white shadow-sm ring-2"
                                                            : "border-gray-300 bg-white hover:border-gray-400"
                                                    }`}
                                                    style={focusedField === "teacher_id" && !errors.teacher_id ? { 
                                                        borderColor: '#540D6E',
                                                        '--tw-ring-color': 'rgba(84, 13, 110, 0.2)'
                                                    } : {}}
                                                >
                                                    <option value="">Seleccione un docente</option>
                                                    {teachers.map(teacher => (
                                                        <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                            {errors.teacher_id && (
                                                <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg animate-slide-down" style={{ borderLeftColor: '#EE4266' }}>
                                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EE4266' }} />
                                                    <p className="text-sm font-medium text-red-800">{errors.teacher_id}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Description Field */}
                                        <div>
                                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4" style={{ color: "#540D6E" }} />
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
                                                    onFocus={() => setFocusedField("description")}
                                                    onBlur={() => setFocusedField(null)}
                                                    rows="4"
                                                    className={`w-full px-4 py-3 border rounded-lg font-medium transition-all duration-200 resize-none ${
                                                        errors.description
                                                            ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                                            : focusedField === "description"
                                                            ? "bg-white shadow-sm ring-2"
                                                            : "border-gray-300 bg-white hover:border-gray-400"
                                                    }`}
                                                    style={focusedField === "description" && !errors.description ? { 
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
                                                <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg animate-slide-down" style={{ borderLeftColor: '#EE4266' }}>
                                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EE4266' }} />
                                                    <p className="text-sm font-medium text-red-800">{errors.description}</p>
                                                </div>
                                            )}
                                            <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                                                <Info className="w-3 h-3" />
                                                <span>{data.description.length}/500 caracteres</span>
                                            </div>
                                        </div>

                                        {/* Preview Section */}
                                        {data.grade && data.section && (
                                            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white shadow-sm">
                                                <div className="flex items-start gap-4 p-4">
                                                    <div className="flex-shrink-0">
                                                        <div 
                                                            className="flex h-10 w-10 items-center justify-center rounded-lg shadow-sm"
                                                            style={{ backgroundColor: getGradeColor(data.grade).bg }}
                                                        >
                                                            <GraduationCap className="h-5 w-5" style={{ color: getGradeColor(data.grade).text }} />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-semibold text-gray-900 capitalize">
                                                                {GRADES.find(g => g.value === data.grade)?.label} {data.section}
                                                            </h3>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                                data.is_active 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {data.is_active ? 'Activo' : 'Inactivo'}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 leading-relaxed">
                                                            {data.description || "No se ha agregado una descripción para este curso."}
                                                        </p>
                                                        {data.teacher_id && (
                                                            <p className="text-xs text-gray-500 mt-2">
                                                                Docente: {teachers.find(t => t.id == data.teacher_id)?.name}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 bg-gray-100/50 px-4 py-2 text-xs border-t border-gray-200">
                                                    <Info className="h-3.5 w-3.5" style={{ color: '#540D6E' }} />
                                                    <span className="text-gray-600">Vista previa del curso</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                                            <button
                                                type="button"
                                                onClick={handleToggleStatus}
                                                className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all shadow-sm hover:shadow-md ${
                                                    data.is_active 
                                                        ? 'text-white' 
                                                        : 'text-white'
                                                }`}
                                                style={{ backgroundColor: data.is_active ? '#6B7280' : '#0EAD69' }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = data.is_active ? '#4B5563' : '#059669'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = data.is_active ? '#6B7280' : '#0EAD69'}
                                            >
                                                {data.is_active ? (
                                                    <><EyeOff className="w-4 h-4" /> Desactivar Curso</>
                                                ) : (
                                                    <><Power className="w-4 h-4" /> Activar Curso</>
                                                )}
                                            </button>
                                            
                                            <div className="flex items-center gap-4">
                                                <Link
                                                    href={route("admin.courses.index")}
                                                    className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                                >
                                                    Cancelar
                                                </Link>
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                                                    style={{ backgroundColor: '#FFD23F' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5C000'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFD23F'}
                                                >
                                                    {processing ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            <span>Guardando...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="w-4 h-4" />
                                                            <span>Guardar Cambios</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                {/* Security Notice */}
                                <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg" style={{ backgroundColor: "#E8F5F0" }}>
                                            <Shield className="w-5 h-5" style={{ color: "#0EAD69" }} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-bold text-gray-900 mb-1">Gestión Académica</h3>
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
                                        <div className="p-2 rounded-lg" style={{ backgroundColor: "#F3E8FF" }}>
                                            <GraduationCap className="w-5 h-5" style={{ color: "#540D6E" }} />
                                        </div>
                                        <h3 className="font-bold text-gray-900">Información Actual</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm capitalize">
                                                    {gradeLabel} {course.section}
                                                </p>
                                                <p className="text-xs text-gray-500">ID: #{course.id}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-start gap-2">
                                                <Users className="w-4 h-4 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium">Estudiantes</p>
                                                    <p className="text-gray-900 font-medium">{course.students_count || 0} estudiantes</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium">Año lectivo actual</p>
                                                    <p className="text-gray-900 font-medium">{course.school_year || "—"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <Users className="w-4 h-4 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium">Docente actual</p>
                                                    <p className="text-gray-900 font-medium">{course.teacher?.name || 'Sin asignar'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Card */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="p-2 rounded-lg" style={{ backgroundColor: "#F3E8FF" }}>
                                            <Info className="w-5 h-5" style={{ color: "#540D6E" }} />
                                        </div>
                                        <h3 className="font-bold text-gray-900">Progreso</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { label: "Grado", completed: !!data.grade },
                                            { label: "Sección", completed: !!data.section },
                                            { label: "Año Escolar", completed: !!data.school_year },
                                            { label: "Docente", completed: !!data.teacher_id },
                                            { label: "Descripción", completed: !!data.description },
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
                                            <span className="font-bold" style={{ color: "#540D6E" }}>{progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${progress}%`, backgroundColor: "#0EAD69" }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Tips Card */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg" style={{ backgroundColor: '#FEF3C7' }}>
                                            <BookOpen className="w-5 h-5" style={{ color: '#D97706' }} />
                                        </div>
                                        <h3 className="font-bold text-gray-900">Recomendaciones</h3>
                                    </div>
                                    <ul className="space-y-2.5 text-sm text-gray-600">
                                        <li className="flex gap-2.5 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#540D6E' }} />
                                            <span>La modificación del grado o sección afecta a todos los estudiantes</span>
                                        </li>
                                        <li className="flex gap-2.5 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#540D6E' }} />
                                            <span>Al desactivar el curso, los estudiantes pierden acceso inmediatamente</span>
                                        </li>
                                        <li className="flex gap-2.5 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#540D6E' }} />
                                            <span>Las evaluaciones y materiales asociados se conservan</span>
                                        </li>
                                        <li className="flex gap-2.5 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#540D6E' }} />
                                            <span>Los cambios serán efectivos inmediatamente</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal de Confirmación para Cambiar Estado */}
            {showToggleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowToggleModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full animate-slide-up overflow-hidden">
                        <div className="h-1" style={{ background: data.is_active ? 'linear-gradient(to right, #EE4266, #DC2F55)' : 'linear-gradient(to right, #0EAD69, #3BCEAC)' }} />
                        
                        <div className="p-6">
                            <button onClick={() => setShowToggleModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: data.is_active ? '#FEE2E2' : '#E8F5F0' }}>
                                    {data.is_active ? (
                                        <EyeOff className="w-6 h-6" style={{ color: '#EE4266' }} />
                                    ) : (
                                        <Power className="w-6 h-6" style={{ color: '#0EAD69' }} />
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {data.is_active ? 'Desactivar' : 'Activar'} Curso
                                </h3>
                            </div>

                            <p className="text-gray-600 mb-4">
                                ¿Estás seguro de {data.is_active ? 'desactivar' : 'activar'} el curso{" "}
                                <span className="font-semibold text-gray-900 capitalize">
                                    {GRADES.find(g => g.value === data.grade)?.label || gradeLabel} {data.section}
                                </span>?
                            </p>

                            <div className="p-3 rounded-lg mb-6 flex gap-2" style={{ 
                                backgroundColor: data.is_active ? '#FEF2F2' : '#F0FDF4', 
                                borderLeft: data.is_active ? '4px solid #EE4266' : '4px solid #0EAD69' 
                            }}>
                                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: data.is_active ? '#EE4266' : '#0EAD69' }} />
                                <p className="text-xs text-gray-700">
                                    {data.is_active 
                                        ? 'Los estudiantes no podrán acceder al curso hasta que sea reactivado.'
                                        : 'Los estudiantes podrán acceder al curso inmediatamente.'}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setShowToggleModal(false)} 
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
                .animate-shimmer { animation: shimmer 2s infinite; }
                .animate-fade-in { animation: fadeIn 0.6s ease-out; }
                .animate-slide-up { animation: slideUp 0.6s ease-out; }
                .animate-slide-down { animation: slideDown 0.3s ease-out; }
                .animate-slide-left { animation: slideLeft 0.8s ease-out; }
                .animate-scale-in { animation: scaleIn 0.3s ease-out; }
            `}</style>
        </>
    );
}