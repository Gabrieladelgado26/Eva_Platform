import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowLeft, BookOpen, GraduationCap, Info, Check, Loader2, AlertCircle, 
    Shield, FileText, Layers, Hash, Users, Calendar
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

export default function Create({ teachers = [] }) {
    const [collapsed] = useSidebarState();
    const { data, setData, post, errors, processing } = useForm({
        grade: "",
        section: "",
        school_year: new Date().getFullYear().toString(),
        teacher_id: "",
        description: ""
    });

    const [focusedField, setFocusedField] = useState(null);

    function submit(e) {
        e.preventDefault();
        post(route("admin.courses.store"));
    }

    const isFieldValid = (field) => {
        if (!data[field]) return false;
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

    return (
        <>
            <Head title="Crear Curso" />
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
                                    Crear Curso
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
                                <div className="p-4 rounded-xl shadow-sm border bg-white" style={{ borderColor: "#540D6E" }}>
                                    <GraduationCap className="w-10 h-10" style={{ color: "#540D6E" }} />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Crear Nuevo Curso</h1>
                                    <p className="text-gray-600 text-base">Complete el formulario con la información del curso</p>
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

                                    <form onSubmit={submit} className="p-8 lg:p-10 space-y-6">
                                        <div className="border-b border-gray-200 pb-4 mb-4">
                                            <h2 className="text-lg font-bold text-gray-900">Información del Curso</h2>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Los campos marcados con <span style={{ color: "#EE4266" }}>*</span> son obligatorios
                                            </p>
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
                                                    placeholder="Describa el contenido y objetivos del curso (opcional)"
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
                                                        <h3 className="font-semibold text-gray-900 mb-1 capitalize">
                                                            {GRADES.find(g => g.value === data.grade)?.label} {data.section}
                                                        </h3>
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
                                                    <span className="text-gray-600">Vista previa del curso a crear</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-end gap-4 pt-8 border-t border-gray-200">
                                            <Link
                                                href={route("admin.courses.index")}
                                                className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                            >
                                                Cancelar
                                            </Link>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                                                style={{ backgroundColor: "#540D6E" }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#6B1689"}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#540D6E"}
                                            >
                                                {processing ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span>Creando...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check className="w-4 h-4" />
                                                        <span>Crear Curso</span>
                                                    </>
                                                )}
                                            </button>
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
                                                El curso quedará asociado al docente seleccionado. Podrá gestionar estudiantes, 
                                                evaluaciones y contenido una vez creado.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Academic Sidebar */}
                            <div className="lg:col-span-1 space-y-6 animate-slide-left">
                                {/* Progress Card */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="p-2 rounded-lg" style={{ backgroundColor: "#F3E8FF" }}>
                                            <Info className="w-5 h-5" style={{ color: "#540D6E" }} />
                                        </div>
                                        <h3 className="font-bold text-gray-900">Estado del Formulario</h3>
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

                                {/* Requirements */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg" style={{ backgroundColor: "#FEF3C7" }}>
                                            <Info className="w-5 h-5" style={{ color: "#D97706" }} />
                                        </div>
                                        <h3 className="font-bold text-gray-900">Información importante</h3>
                                    </div>
                                    <ul className="space-y-2.5 text-sm text-gray-600">
                                        <li className="flex gap-2.5 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: "#540D6E" }} />
                                            <span>Los cursos pueden tener múltiples estudiantes</span>
                                        </li>
                                        <li className="flex gap-2.5 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: "#540D6E" }} />
                                            <span>Puede activar/desactivar el curso después de creado</span>
                                        </li>
                                        <li className="flex gap-2.5 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: "#540D6E" }} />
                                            <span>Asigne un docente responsable del curso</span>
                                        </li>
                                        <li className="flex gap-2.5 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: "#540D6E" }} />
                                            <span>La descripción ayuda a identificar el contenido</span>
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