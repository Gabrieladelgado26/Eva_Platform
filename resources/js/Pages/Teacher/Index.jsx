import { Head, Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    BookOpen, Plus, LayoutGrid, Table as TableIcon, Edit2, Trash2, Power,
    EyeOff, CheckCircle, AlertCircle, Users, GraduationCap, Search, X,
    RotateCcw, Filter, ChevronDown, Menu, ChevronLeft, ChevronRight,
    LogOut, Settings, HelpCircle, Calendar, ClipboardList, BarChart3,
    LayoutDashboard, Home, School, Grid, List, User, Clock, BookMarked,
    TrendingUp, Award, FileText, MoreVertical, Star, Sparkles, UsersRound,
    Shield, Copy, Check
} from "lucide-react";

export default function Index({ courses = [], teacher = null }) {
    const [viewMode, setViewMode] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("teacherViewMode") || "cards";
        }
        return "cards";
    });

    const [sidebarOpen, setSidebarOpen] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("sidebarOpen") === "true";
        }
        return false;
    });

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterGrade, setFilterGrade] = useState("all");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [courseToToggle, setCourseToToggle] = useState(null);
    const [toggleAction, setToggleAction] = useState("");
    const [copied, setCopied] = useState({ username: false, pin: false });
    const [showCredentialsModal, setShowCredentialsModal] = useState(false);
    const [credentials, setCredentials] = useState(null);

    useEffect(() => {
        localStorage.setItem("teacherViewMode", viewMode);
    }, [viewMode]);

    useEffect(() => {
        localStorage.setItem("sidebarOpen", String(sidebarOpen));
    }, [sidebarOpen]);

    const navigation = {
        principal: [
            {
                name: "Cursos",
                href: route("teacher.index"),
                icon: BookOpen,
                current: true
            }
        ],
        academic: [
            {
                name: "Calendario",
                href: "#",
                icon: Calendar,
                current: false
            },
            {
                name: "Evaluaciones",
                href: "#",
                icon: ClipboardList,
                current: false
            },
            {
                name: "Reportes",
                href: "#",
                icon: BarChart3,
                current: false
            }
        ]
    };

    const grades = [
        { value: "primero", label: "Primero" },
        { value: "segundo", label: "Segundo" },
        { value: "tercero", label: "Tercero" },
        { value: "cuarto", label: "Cuarto" },
        { value: "quinto", label: "Quinto" }
    ];

    const filteredCourses = courses.filter(course => {
        const matchesSearch = 
            course.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (course.description?.toLowerCase() || "").includes(searchTerm.toLowerCase());

        const matchesStatus = 
            filterStatus === "all" ||
            (filterStatus === "active" && course.is_active) ||
            (filterStatus === "inactive" && !course.is_active);

        const matchesGrade = 
            filterGrade === "all" || course.grade === filterGrade;

        return matchesSearch && matchesStatus && matchesGrade;
    });

    const hasActiveFilters = searchTerm || filterStatus !== "all" || filterGrade !== "all";

    const clearFilters = () => {
        setSearchTerm("");
        setFilterStatus("all");
        setFilterGrade("all");
    };

    const confirmDelete = (course) => {
        setCourseToDelete(course);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        router.delete(route("teacher.courses.destroy", courseToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setCourseToDelete(null);
            }
        });
    };

    const confirmToggleStatus = (course) => {
        const action = course.is_active ? "desactivar" : "activar";
        setToggleAction(action);
        setCourseToToggle(course);
        setShowStatusModal(true);
    };

    const handleConfirmToggle = () => {
        router.patch(route("teacher.courses.toggleStatus", courseToToggle.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setShowStatusModal(false);
                setCourseToToggle(null);
            }
        });
    };

    const getGradeLabel = (grade) => {
        const labels = {
            primero: "Primero",
            segundo: "Segundo",
            tercero: "Tercero",
            cuarto: "Cuarto",
            quinto: "Quinto"
        };
        return labels[grade] || grade;
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopied((prev) => ({ ...prev, [type]: true }));
        setTimeout(() => {
            setCopied((prev) => ({ ...prev, [type]: false }));
        }, 2000);
    };

    // Array de gradientes con la paleta rosado/morado
    const courseGradients = [
        "from-pink-500 to-purple-600",
        "from-purple-500 to-pink-500",
        "from-rose-400 to-purple-600",
        "from-fuchsia-500 to-pink-600",
        "from-purple-600 to-rose-500",
        "from-pink-600 to-purple-700",
        "from-rose-500 to-fuchsia-600",
        "from-purple-500 to-pink-600",
        "from-pink-400 to-purple-500",
        "from-fuchsia-600 to-rose-500"
    ];

    return (
        <>
            <Head title="Cursos" />

            <main className={`transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:ml-72" : "lg:ml-20"} min-h-screen`}>
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Link href={route("dashboard")} className="hover:text-purple-600 transition-colors">
                                Panel Principal
                            </Link>
                            <span>/</span>
                            <span style={{ color: "#540D6E" }} className="font-medium">Cursos</span>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8 animate-fade-in">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-4 rounded-xl shadow-sm border relative overflow-hidden" 
                                         style={{ backgroundColor: "white", borderColor: "#540D6E" }}>
                                        <div className="absolute inset-0 opacity-10" 
                                             style={{  backgroundColor: "white", borderColor: "#540D6E" }} />
                                        <BookOpen className="w-10 h-10 relative z-10" style={{ color: "#540D6E" }} />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Cursos</h1>
                                        <p className="text-gray-600 text-base">Administración y supervisión de cursos</p>
                                    </div>
                                </div>
                                <Link
                                    href={route("teacher.courses.create")}
                                    className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md group relative overflow-hidden"
                                    style={{ backgroundColor: "#540D6E" }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.backgroundColor = "#6B1689";
                                        e.currentTarget.querySelector('.shine-effect').style.transform = 'translateX(100%)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.backgroundColor = "#540D6E";
                                        e.currentTarget.querySelector('.shine-effect').style.transform = 'translateX(-100%)';
                                    }}
                                >
                                    <span className="shine-effect absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-700" />
                                    <Plus className="w-5 h-5 relative z-10" /> 
                                    <span className="relative z-10">Crear Curso</span>
                                </Link>
                            </div>
                        </div>

                        {/* Stats Cards - Ocupando todo el espacio */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {[
                                { 
                                    icon: BookOpen, 
                                    bg: "#F3E8FF", 
                                    color: "#540D6E", 
                                    label: "Total Cursos", 
                                    desc: "Cursos asignados", 
                                    value: courses.length,
                                    trend: "Total en el sistema"
                                },
                                { 
                                    icon: CheckCircle, 
                                    bg: "#E8F5F0", 
                                    color: "#0EAD69", 
                                    label: "Cursos Activos", 
                                    desc: "En período lectivo", 
                                    value: courses.filter(c => c.is_active).length,
                                    trend: `${Math.round((courses.filter(c => c.is_active).length / (courses.length || 1)) * 100)}% del total`
                                },
                                { 
                                    icon: Users, 
                                    bg: "#FFF4E5", 
                                    color: "#FF8C42", 
                                    label: "Total Estudiantes", 
                                    desc: "Matriculados", 
                                    value: courses.reduce((acc, c) => acc + (c.students_count || 0), 0),
                                    trend: "Distribuidos en cursos"
                                }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="p-3 rounded-lg transition-transform group-hover:scale-110" style={{ backgroundColor: stat.bg }}>
                                                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{stat.label}</p>
                                                <p className="text-sm text-gray-600 mt-0.5">{stat.desc}</p>
                                            </div>
                                        </div>
                                        <p className="text-3xl font-black" style={{ color: stat.color }}>{stat.value}</p>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            {stat.trend}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Filtros y Vista */}
                        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por grado, sección o descripción..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-10 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all hover:border-gray-300"
                                        style={{ "--tw-ring-color": "rgba(84, 13, 110, 0.2)" }}
                                        onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                        onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm("")}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="relative">
                                    <select
                                        value={filterGrade}
                                        onChange={e => setFilterGrade(e.target.value)}
                                        className="px-4 pr-10 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-offset-2 outline-none transition-all hover:border-gray-300 appearance-none min-w-[160px]"
                                        style={{ "--tw-ring-color": "rgba(84, 13, 110, 0.2)" }}
                                        onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                        onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
                                    >
                                        <option value="all">Todos los grados</option>
                                        {grades.map(grade => (
                                            <option key={grade.value} value={grade.value}>
                                                {grade.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>

                                <div className="relative">
                                    <select
                                        value={filterStatus}
                                        onChange={e => setFilterStatus(e.target.value)}
                                        className="px-4 pr-10 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-offset-2 outline-none transition-all hover:border-gray-300 appearance-none min-w-[160px]"
                                        style={{ "--tw-ring-color": "rgba(84, 13, 110, 0.2)" }}
                                        onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                        onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
                                    >
                                        <option value="all">Todos los estados</option>
                                        <option value="active">Activos</option>
                                        <option value="inactive">Inactivos</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setViewMode("cards")}
                                        className={`p-3 rounded-lg border-2 transition-all relative group ${
                                            viewMode === "cards"
                                                ? "border-purple-600 bg-purple-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                        style={viewMode === "cards" ? { borderColor: "#540D6E", backgroundColor: "#F3E8FF" } : {}}
                                        title="Vista de tarjetas"
                                    >
                                        <Grid className={`w-5 h-5 ${viewMode === "cards" ? "text-purple-600" : "text-gray-400"}`} />
                                        {viewMode !== "cards" && (
                                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                Vista tarjetas
                                            </span>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setViewMode("table")}
                                        className={`p-3 rounded-lg border-2 transition-all relative group ${
                                            viewMode === "table"
                                                ? "border-purple-600 bg-purple-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                        style={viewMode === "table" ? { borderColor: "#540D6E", backgroundColor: "#F3E8FF" } : {}}
                                        title="Vista de tabla"
                                    >
                                        <List className={`w-5 h-5 ${viewMode === "table" ? "text-purple-600" : "text-gray-400"}`} />
                                        {viewMode !== "table" && (
                                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                Vista tabla
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Indicador de filtros activos */}
                        {hasActiveFilters && (
                            <div className="mb-6 animate-fade-in">
                                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg" style={{ backgroundColor: "#F3E8FF" }}>
                                            <Filter className="w-4 h-4" style={{ color: "#540D6E" }} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Filtros Aplicados</p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {searchTerm && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-medium"
                                                        style={{ backgroundColor: "#F3E8FF", borderColor: "#540D6E", color: "#540D6E" }}>
                                                        Búsqueda: "{searchTerm}"
                                                        <button onClick={() => setSearchTerm("")} className="hover:bg-white/50 p-0.5 rounded">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                )}
                                                {filterGrade !== "all" && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-medium capitalize"
                                                        style={{ backgroundColor: "#F3E8FF", borderColor: "#540D6E", color: "#540D6E" }}>
                                                        Grado: {filterGrade}
                                                        <button onClick={() => setFilterGrade("all")} className="hover:bg-white/50 p-0.5 rounded">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                )}
                                                {filterStatus !== "all" && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-medium"
                                                        style={{ backgroundColor: "#F3E8FF", borderColor: "#540D6E", color: "#540D6E" }}>
                                                        Estado: {filterStatus === "active" ? "Activo" : "Inactivo"}
                                                        <button onClick={() => setFilterStatus("all")} className="hover:bg-white/50 p-0.5 rounded">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={clearFilters}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                                    >
                                        <RotateCcw className="w-4 h-4" /> Limpiar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Contenido Principal - con key para forzar re-renderizado y evitar saltos */}
                        <div key={viewMode} className="transition-all duration-300">
                            {filteredCourses.length === 0 ? (
                                <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-sm relative overflow-hidden"
                                         style={{ background: "linear-gradient(135deg, #540D6E 0%, #EE4266 100%)" }}>
                                        <BookOpen className="w-10 h-10 text-white relative z-10" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {searchTerm || filterStatus !== "all" || filterGrade !== "all" 
                                            ? "No se encontraron cursos" 
                                            : "Comienza tu aventura educativa"}
                                    </h3>
                                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                        {searchTerm || filterStatus !== "all" || filterGrade !== "all"
                                            ? "Intenta con otros filtros de búsqueda"
                                            : "Crea tu primer curso y comienza a gestionar tus clases"}
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Link
                                            href={route("teacher.courses.create")}
                                            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                                            style={{ backgroundColor: "#540D6E" }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}
                                        >
                                            <Plus className="w-5 h-5" /> Crear Curso
                                        </Link>
                                        {hasActiveFilters && (
                                            <button
                                                onClick={clearFilters}
                                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
                                            >
                                                <RotateCcw className="w-5 h-5" /> Limpiar Filtros
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {viewMode === "cards" ? (
                                        /* Vista de Tarjetas */
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredCourses.map((course, index) => {
                                                const gradient = courseGradients[index % courseGradients.length];
                                                return (
                                                    <div 
                                                        key={course.id} 
                                                        className="group bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 animate-fade-in relative"
                                                    >
                                                        {/* Badge de estado flotante */}
                                                        <div className="absolute top-8 right-4 z-10">
                                                            <div className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-sm flex items-center gap-1.5
                                                                ${course.is_active 
                                                                    ? "bg-green-100 text-green-700 border border-green-200" 
                                                                    : "bg-gray-100 text-gray-600 border border-gray-200"
                                                                }`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${course.is_active ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                                                                {course.is_active ? "Activo" : "Inactivo"}
                                                            </div>
                                                        </div>

                                                        {/* Contenido de la tarjeta - Estilo modal */}
                                                        <div className="p-6">
                                                            {/* Header con icono y título */}
                                                            <div className="flex items-center gap-4 mb-4">
                                                                <div className="p-3 rounded-xl bg-white shadow-md border border-gray-200">
                                                                    <GraduationCap className="w-8 h-8" style={{ color: "#540D6E" }} />
                                                                </div>
                                                                <div>
                                                                    <h2 className="text-2xl font-bold text-gray-900 capitalize">
                                                                        {getGradeLabel(course.grade)}
                                                                    </h2>
                                                                    <p className="text-sm text-gray-600">Sección {course.section}</p>
                                                                </div>
                                                            </div>

                                                            {/* Descripción */}
                                                            {course.description ? (
                                                                <div className="p-3 rounded-lg mb-4 bg-gray-50 border border-gray-200">
                                                                    <p className="text-xs text-gray-600 flex items-center gap-2">
                                                                        <BookOpen className="w-4 h-4 text-gray-400" />
                                                                        {course.description}
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <div className="p-3 rounded-lg mb-4 bg-gray-50 border border-gray-200">
                                                                    <p className="text-xs text-gray-400 italic flex items-center gap-2">
                                                                        <BookOpen className="w-4 h-4 text-gray-400" />
                                                                        Sin descripción
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {/* Estadísticas */}
                                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                                                                    <Users className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                                                                    <p className="text-xs text-gray-500">Estudiantes</p>
                                                                    <p className="text-lg font-bold text-gray-900">{course.students_count || 0}</p>
                                                                </div>
                                                                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                                                                    <BookMarked className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                                                                    <p className="text-xs text-gray-500">Materias</p>
                                                                    <p className="text-lg font-bold text-gray-900">6</p>
                                                                </div>
                                                            </div>

                                                            {/* Progreso */}
                                                            <div className="mb-4">
                                                                <div className="flex items-center justify-between text-xs mb-1">
                                                                    <span className="text-gray-600">Progreso del período</span>
                                                                    <span className="font-semibold text-gray-900">65%</span>
                                                                </div>
                                                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                                    <div className="h-full rounded-full" style={{ width: "65%", background: "linear-gradient(to right, #540D6E, #EE4266)" }} />
                                                                </div>
                                                            </div>

                                                            {/* Acciones - botón estilo modal */}
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => confirmToggleStatus(course)}
                                                                    className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all shadow-sm hover:shadow-md ${
                                                                        course.is_active
                                                                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                                            : "text-white"
                                                                    }`}
                                                                    style={!course.is_active ? { backgroundColor: "#0EAD69" } : {}}
                                                                >
                                                                    {course.is_active ? (
                                                                        <span className="flex items-center justify-center gap-2">
                                                                            <EyeOff className="w-4 h-4" /> Desactivar
                                                                        </span>
                                                                    ) : (
                                                                        <span className="flex items-center justify-center gap-2">
                                                                            <Power className="w-4 h-4" /> Activar
                                                                        </span>
                                                                    )}
                                                                </button>

                                                                <Link
                                                                    href={route("teacher.courses.edit", course.id)}
                                                                    className="p-3 rounded-lg transition-all shadow-sm hover:shadow-md"
                                                                    style={{ backgroundColor: "#FFD23F" }}
                                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#F5C000"}
                                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#FFD23F"}
                                                                    title="Editar curso"
                                                                >
                                                                    <Edit2 className="w-5 h-5 text-gray-700" />
                                                                </Link>

                                                                <button
                                                                    onClick={() => confirmDelete(course)}
                                                                    className="p-3 rounded-lg text-white transition-all shadow-sm hover:shadow-md"
                                                                    style={{ backgroundColor: "#EE4266" }}
                                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#DC2F55"}
                                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#EE4266"}
                                                                    title="Eliminar curso"
                                                                >
                                                                    <Trash2 className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        /* Vista de Tabla - Mejorada con líneas de color */
                                        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead className="bg-gray-50 border-b border-gray-200">
                                                        <tr>
                                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                                <div className="flex items-center gap-2">
                                                                    <School className="w-4 h-4" /> Curso
                                                                </div>
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                                <div className="flex items-center gap-2">
                                                                    <User className="w-4 h-4" /> Profesor
                                                                </div>
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                                <div className="flex items-center gap-2">
                                                                    <Users className="w-4 h-4" /> Estudiantes
                                                                </div>
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                                <div className="flex items-center gap-2">
                                                                    <CheckCircle className="w-4 h-4" /> Estado
                                                                </div>
                                                            </th>
                                                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                                Acciones
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {filteredCourses.map((course, index) => {
                                                            const gradient = courseGradients[index % courseGradients.length];
                                                            return (
                                                                <tr key={course.id} className="hover:bg-gray-50 transition-colors group">
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <div className="flex items-center gap-3">
                                                                            {/* Línea de color en lugar de icono con fondo */}
                                                                            <div className="w-1 h-10 rounded-full" style={{ background: "linear-gradient(to bottom, #540D6E, #EE4266)" }} />
                                                                            <div>
                                                                                <p className="text-sm font-semibold text-gray-900 capitalize">
                                                                                    {getGradeLabel(course.grade)} {course.section}
                                                                                </p>
                                                                                {course.description && (
                                                                                    <p className="text-xs text-gray-500 truncate max-w-xs">
                                                                                        {course.description}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                                                                <span className="text-xs font-semibold text-gray-700">
                                                                                    {teacher?.name?.charAt(0) || "P"}
                                                                                </span>
                                                                            </div>
                                                                            <span className="text-sm text-gray-700">
                                                                                {teacher?.name?.split(' ')[0] || "Profesor"}
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <span className="text-sm font-medium text-gray-900">
                                                                            {course.students_count || 0}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border ${
                                                                            course.is_active 
                                                                                ? "bg-green-50 border-green-200" 
                                                                                : "bg-gray-50 border-gray-200"
                                                                        }`}>
                                                                            <div className={`w-2 h-2 rounded-full ${
                                                                                course.is_active ? "bg-green-500 animate-pulse" : "bg-gray-400"
                                                                            }`} />
                                                                            <span className={`text-xs font-medium ${
                                                                                course.is_active ? "text-green-700" : "text-gray-600"
                                                                            }`}>
                                                                                {course.is_active ? "Activo" : "Inactivo"}
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                                        <div className="flex items-center justify-end gap-2">
                                                                            <button
                                                                                onClick={() => confirmToggleStatus(course)}
                                                                                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                                                                                    course.is_active
                                                                                        ? "text-gray-700 bg-gray-100 hover:bg-gray-200"
                                                                                        : "text-white"
                                                                                }`}
                                                                                style={!course.is_active ? { backgroundColor: "#0EAD69" } : {}}
                                                                            >
                                                                                {course.is_active ? (
                                                                                    <>
                                                                                        <EyeOff className="w-4 h-4" /> Desactivar
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <Power className="w-4 h-4" /> Activar
                                                                                    </>
                                                                                )}
                                                                            </button>
                                                                            <Link
                                                                                href={route("teacher.courses.edit", course.id)}
                                                                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 transition-all"
                                                                                style={{ backgroundColor: "#FFD23F" }}
                                                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#F5C000"}
                                                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#FFD23F"}
                                                                            >
                                                                                <Edit2 className="w-4 h-4" /> Editar
                                                                            </Link>
                                                                            <button
                                                                                onClick={() => confirmDelete(course)}
                                                                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-all"
                                                                                style={{ backgroundColor: "#EE4266" }}
                                                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#DC2F55"}
                                                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#EE4266"}
                                                                            >
                                                                                <Trash2 className="w-4 h-4" /> Eliminar
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Info adicional con nombre del profesor */}
                        {filteredCourses.length > 0 && (
                            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <span>Mostrando <span className="font-bold" style={{ color: "#540D6E" }}>{filteredCourses.length}</span> de <span className="font-bold text-gray-900">{courses.length}</span> cursos</span>
                                            <span className="mx-2">•</span>
                                            <span className="font-bold" style={{ color: "#0EAD69" }}>{courses.filter(c => c.is_active).length}</span> activos
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <User className="w-3 h-3" />
                                            <span className="text-gray-500">{teacher?.name || "Profesor"}</span>
                                        </div>
                                    </div>
                                    <div className="text-gray-500 flex items-center gap-2">
                                        <Clock className="w-3 h-3" />
                                        Actualizado: {new Date().toLocaleDateString("es-ES", { 
                                            day: "2-digit", 
                                            month: "long", 
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal de Confirmación Eliminación */}
            {showDeleteModal && courseToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full animate-slide-up overflow-hidden">
                        <div className="h-1" style={{ background: "linear-gradient(to right, #EE4266, #DC2F55)" }} />
                        
                        <div className="p-6">
                            <button onClick={() => setShowDeleteModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: "#FEE2E2" }}>
                                    <Trash2 className="w-6 h-6" style={{ color: "#EE4266" }} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Eliminar Curso</h3>
                            </div>

                            <p className="text-gray-600 mb-4">
                                ¿Estás seguro de eliminar el curso <span className="font-semibold text-gray-900 capitalize">{courseToDelete.grade} {courseToDelete.section}</span>?
                            </p>

                            <div className="p-4 rounded-lg mb-6 flex gap-3" style={{ backgroundColor: "#FEE2E2", borderLeft: "4px solid #EE4266" }}>
                                <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#EE4266" }} />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 mb-1">¿Qué sucederá?</p>
                                    <p className="text-xs text-gray-600">Se eliminará permanentemente el curso y toda la información asociada. Esta acción no se puede deshacer.</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-md"
                                    style={{ backgroundColor: "#EE4266" }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#DC2F55"}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#EE4266"}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmación Cambio de Estado */}
            {showStatusModal && courseToToggle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowStatusModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full animate-slide-up overflow-hidden">
                        <div className="h-1" style={{ background: toggleAction === "activar" ? "linear-gradient(to right, #0EAD69, #3BCEAC)" : "linear-gradient(to right, #EE4266, #DC2F55)" }} />
                        
                        <div className="p-6">
                            <button onClick={() => setShowStatusModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: toggleAction === "activar" ? "#E8F5F0" : "#FEE2E2" }}>
                                    {toggleAction === "activar" ? (
                                        <Power className="w-6 h-6" style={{ color: "#0EAD69" }} />
                                    ) : (
                                        <EyeOff className="w-6 h-6" style={{ color: "#EE4266" }} />
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 capitalize">{toggleAction} Curso</h3>
                            </div>

                            <p className="text-gray-600 mb-4">
                                ¿Estás seguro de {toggleAction} el curso <span className="font-semibold text-gray-900 capitalize">{courseToToggle.grade} {courseToToggle.section}</span>?
                            </p>

                            <div className={`p-4 rounded-lg mb-6 flex gap-3 ${
                                toggleAction === "activar" ? "bg-green-50" : "bg-red-50"
                            }`} style={{ borderLeft: `4px solid ${toggleAction === "activar" ? "#0EAD69" : "#EE4266"}` }}>
                                {toggleAction === "activar" ? (
                                    <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#0EAD69" }} />
                                ) : (
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#EE4266" }} />
                                )}
                                <div>
                                    <p className="text-sm font-medium text-gray-900 mb-1">¿Qué sucederá?</p>
                                    <p className="text-xs text-gray-600">
                                        {toggleAction === "activar" 
                                            ? "El curso será visible y los estudiantes podrán acceder a él."
                                            : "El curso dejará de ser visible. Los estudiantes no podrán acceder hasta que sea reactivado."}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowStatusModal(false)}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleConfirmToggle}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-md"
                                    style={{ backgroundColor: toggleAction === "activar" ? "#0EAD69" : "#EE4266" }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = toggleAction === "activar" ? "#059669" : "#DC2F55"}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = toggleAction === "activar" ? "#0EAD69" : "#EE4266"}
                                >
                                    {toggleAction === "activar" ? "Activar" : "Desactivar"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Fondo académico */}
            <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-50">
                <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(84, 13, 110, 0.08) 1px, transparent 0)`, backgroundSize: "40px 40px" }} />
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: "linear-gradient(to right, #540D6E, #EE4266, #FFD23F, #3BCEAC, #0EAD69)" }} />
            </div>

            {/* Mobile sidebar backdrop */}
            {mobileSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />}

            {/* Mobile menu button */}
            <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden fixed bottom-4 right-4 z-30 p-3 rounded-full shadow-lg text-white"
                style={{ backgroundColor: "#540D6E" }}
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out ${sidebarOpen ? "w-72" : "w-20"} ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
                <div className="h-full bg-white/90 backdrop-blur-xl border-r border-gray-200 shadow-xl flex flex-col">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <div className={`flex items-center gap-2 ${!sidebarOpen && "lg:justify-center w-full"}`}>
                            <div className="p-2 rounded-lg" style={{ backgroundColor: "#540D6E20" }}>
                                <GraduationCap className="w-6 h-6" style={{ color: "#540D6E" }} />
                            </div>
                            {sidebarOpen && <span className="font-bold text-lg text-gray-900">EVA Platform</span>}
                        </div>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="hidden lg:block p-1.5 rounded-lg hover:bg-gray-100"
                        >
                            {sidebarOpen ? <ChevronLeft className="w-4 h-4 text-gray-600" /> : <ChevronRight className="w-4 h-4 text-gray-600" />}
                        </button>
                    </div>

                    <nav className="flex-1 overflow-visible py-4 px-2">
                        {Object.entries(navigation).map(([key, items]) => (
                            <div key={key} className="mb-4">
                                {sidebarOpen && (
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                                        {key === 'principal' ? 'Principal' : 'Académico'}
                                    </p>
                                )}
                                <ul className="space-y-1">
                                    {items.map(item => {
                                        const Icon = item.icon;
                                        return (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                                                        item.current ? "text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"
                                                    }`}
                                                    style={item.current ? { backgroundColor: "#540D6E" } : {}}
                                                >
                                                    <Icon className={`w-5 h-5 ${!sidebarOpen && "mx-auto"}`} />
                                                    {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                                                    {!sidebarOpen && (
                                                        <span className="absolute left-full ml-6 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                                                            {item.name}
                                                        </span>
                                                    )}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </nav>

                    <div className="border-t border-gray-200 p-2">
                        <ul className="space-y-1">
                            <li>
                                <div className="w-full flex items-center gap-3 px-3 py-2.5">
                                    <div
                                        className={`w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-700 ${
                                            !sidebarOpen && "mx-auto"
                                        }`}
                                    >
                                        {teacher?.name?.charAt(0)?.toUpperCase() || "P"}
                                    </div>

                                    {sidebarOpen && (
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-800 truncate">
                                                {teacher?.name || "Profesor"}
                                            </span>
                                            <span className="text-xs text-gray-400 truncate">
                                                {teacher?.email || ""}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </li>
                            <li>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all group"
                                >
                                    <LogOut className={`w-5 h-5 ${!sidebarOpen && "mx-auto"}`} />
                                    {sidebarOpen && <span className="text-sm font-medium">Cerrar Sesión</span>}
                                    {!sidebarOpen && (
                                        <span className="absolute left-full ml-6 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                                            Cerrar Sesión
                                        </span>
                                    )}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fadeIn 0.6s ease-out; }
                .animate-slide-up { animation: slideUp 0.6s ease-out; }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </>
    );
}