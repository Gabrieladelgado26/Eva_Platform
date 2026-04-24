import { Head, Link, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AppSidebar, { useSidebarState } from "@/Components/AppSidebar";
import {
    BookOpen, Plus, Edit2, Trash2, Search, X, RotateCcw,
    AlertCircle, Power, Users, Calendar, GraduationCap,
    ChevronDown, Filter, ChevronLeft, ChevronRight, EyeOff,
    CheckCircle, AlertTriangle, UserPlus
} from "lucide-react";

const GRADES = [
    { value: 'primero', label: 'Primero' },
    { value: 'segundo', label: 'Segundo' },
    { value: 'tercero', label: 'Tercero' },
    { value: 'cuarto', label: 'Cuarto' },
    { value: 'quinto', label: 'Quinto' },
];

// Componente Toast
function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
                type === 'success' 
                    ? 'bg-green-50 border-green-300 text-green-800' 
                    : 'bg-red-50 border-red-300 text-red-800'
            }`}>
                {type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm font-medium">{message}</span>
                <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default function Index({ courses, teachers, filters }) {
    const { props } = usePage();
    const flash = props.flash || {};
    const [collapsed] = useSidebarState();

    const coursesData = courses?.data ?? [];
    const currentPage = courses?.current_page ?? 1;
    const lastPage = courses?.last_page ?? 1;
    const from = courses?.from ?? 0;
    const to = courses?.to ?? 0;
    const total = courses?.total ?? 0;
    const links = courses?.links ?? [];

    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [filterTeacherId, setFilterTeacherId] = useState(filters?.teacher_id || "");
    const [filterStatus, setFilterStatus] = useState(filters?.status || "");

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showToggleModal, setShowToggleModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    // Toast state
    const [toast, setToast] = useState(null);

    const [formData, setFormData] = useState({
        grade: '',
        section: '',
        school_year: '',
        teacher_id: '',
        description: '',
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

    const hasActiveFilters = searchTerm || filterTeacherId || filterStatus;

    const clearFilters = () => {
        setSearchTerm("");
        setFilterTeacherId("");
        setFilterStatus("");
        router.get(route('admin.courses.index'), {}, { preserveScroll: true });
    };

    const applyFilters = () => {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (filterTeacherId) params.teacher_id = filterTeacherId;
        if (filterStatus) params.status = filterStatus;
        router.get(route('admin.courses.index'), params, { preserveScroll: true });
    };

    const goToPage = (url) => {
        if (!url) return;
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (filterTeacherId) params.teacher_id = filterTeacherId;
        if (filterStatus) params.status = filterStatus;
        router.get(url, params, { preserveScroll: true });
    };

    const buildPageNumbers = () => {
        if (lastPage <= 7) {
            return Array.from({ length: lastPage }, (_, i) => i + 1);
        }
        const pages = [];
        pages.push(1);
        if (currentPage > 3) pages.push(null);
        for (
            let p = Math.max(2, currentPage - 1);
            p <= Math.min(lastPage - 1, currentPage + 1);
            p++
        ) {
            pages.push(p);
        }
        if (currentPage < lastPage - 2) pages.push(null);
        pages.push(lastPage);
        return pages;
    };

    const pageNumbers = buildPageNumbers();

    const handleCreateClick = () => {
        setFormData({
            grade: '',
            section: '',
            school_year: new Date().getFullYear().toString(),
            teacher_id: '',
            description: '',
        });
        setShowCreateModal(true);
    };

    const handleEditClick = (course) => {
        setSelectedCourse(course);
        setFormData({
            grade: course.grade,
            section: course.section,
            school_year: course.school_year,
            teacher_id: course.teacher?.id || '',
            description: course.description || '',
        });
        setShowEditModal(true);
    };

    const handleDeleteClick = (course) => {
        setSelectedCourse(course);
        setShowDeleteModal(true);
    };

    const handleToggleClick = (course) => {
        setSelectedCourse(course);
        setShowToggleModal(true);
    };

    const handleSubmitCreate = (e) => {
        e.preventDefault();
        router.post(route('admin.courses.store'), formData, {
            onSuccess: () => {
                setShowCreateModal(false);
                setToast({ message: 'Curso creado exitosamente', type: 'success' });
            },
            onError: () => {
                setToast({ message: 'Error al crear el curso', type: 'error' });
            }
        });
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        router.put(route('admin.courses.update', selectedCourse.id), formData, {
            onSuccess: () => {
                setShowEditModal(false);
                setToast({ message: 'Curso actualizado exitosamente', type: 'success' });
            },
            onError: () => {
                setToast({ message: 'Error al actualizar el curso', type: 'error' });
            }
        });
    };

    const handleConfirmDelete = () => {
        router.delete(route('admin.courses.destroy', selectedCourse.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setToast({ message: 'Curso eliminado exitosamente', type: 'success' });
            },
            onError: () => {
                setToast({ message: 'Error al eliminar el curso', type: 'error' });
            }
        });
    };

    const handleConfirmToggle = () => {
        router.patch(route('admin.courses.toggleStatus', selectedCourse.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setShowToggleModal(false);
                setToast({ 
                    message: selectedCourse.is_active ? 'Curso desactivado' : 'Curso activado', 
                    type: 'success' 
                });
            },
            onError: () => {
                setToast({ message: 'Error al cambiar el estado', type: 'error' });
            }
        });
    };

    const gradeLabelMap = Object.fromEntries(GRADES.map(g => [g.value, g.label]));

    return (
        <>
            <Head title="Gestión de Cursos" />
            <AppSidebar currentRoute="admin.courses.index" />

            {/* Toast */}
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
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
                                <Link href={route("admin.dashboard")} className="hover:text-purple-600 transition-colors">
                                    Administración
                                </Link>
                                <span>/</span>
                                <span style={{ color: "#540D6E" }} className="font-medium">
                                    Cursos
                                </span>
                            </div>
                        </div>

                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-4 rounded-xl shadow-sm border bg-white" style={{ borderColor: "#540D6E" }}>
                                        <BookOpen className="w-10 h-10" style={{ color: "#540D6E" }} />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Cursos</h1>
                                        <p className="text-gray-600 text-base">Administra todos los cursos del sistema</p>
                                    </div>
                                </div>
                                <Link
                                    href={route("admin.courses.create")}
                                    className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                                    style={{ backgroundColor: "#540D6E" }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}
                                >
                                    <Plus className="w-5 h-5" /> Crear Curso
                                </Link>
                            </div>
                        </div>

                        {/* Filtros */}
                        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por grado, sección o docente..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && applyFilters()}
                                        className="w-full pl-12 pr-10 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all hover:border-gray-300"
                                        style={{ "--tw-ring-color": "rgba(84, 13, 110, 0.2)" }}
                                        onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                        onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
                                    />
                                    {searchTerm && (
                                        <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <select
                                        value={filterTeacherId}
                                        onChange={e => setFilterTeacherId(e.target.value)}
                                        className="px-4 pr-10 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-offset-2 outline-none transition-all hover:border-gray-300 appearance-none"
                                        style={{ "--tw-ring-color": "rgba(84, 13, 110, 0.2)" }}
                                        onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                        onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
                                    >
                                        <option value="">Todos los docentes</option>
                                        {teachers.map(teacher => (
                                            <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
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
                                        className="px-4 pr-10 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-offset-2 outline-none transition-all hover:border-gray-300 appearance-none"
                                        style={{ "--tw-ring-color": "rgba(84, 13, 110, 0.2)" }}
                                        onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                        onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
                                    >
                                        <option value="">Todos los estados</option>
                                        <option value="active">Activos</option>
                                        <option value="inactive">Inactivos</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                                <button
                                    onClick={applyFilters}
                                    className="px-6 py-3 text-sm font-bold text-white rounded-lg transition-all shadow-sm hover:shadow-md"
                                    style={{ backgroundColor: "#540D6E" }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Indicador de filtros activos */}
                        {hasActiveFilters && (
                            <div className="mb-6">
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
                                                {filterTeacherId && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-medium"
                                                        style={{ backgroundColor: "#F3E8FF", borderColor: "#540D6E", color: "#540D6E" }}>
                                                        Docente: {teachers.find(t => t.id == filterTeacherId)?.name}
                                                        <button onClick={() => setFilterTeacherId("")} className="hover:bg-white/50 p-0.5 rounded">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                )}
                                                {filterStatus && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-medium"
                                                        style={{ backgroundColor: "#F3E8FF", borderColor: "#540D6E", color: "#540D6E" }}>
                                                        Estado: {filterStatus === "active" ? "Activo" : "Inactivo"}
                                                        <button onClick={() => setFilterStatus("")} className="hover:bg-white/50 p-0.5 rounded">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={clearFilters} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all">
                                        <RotateCcw className="w-4 h-4" /> Limpiar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Tabla */}
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                            {coursesData.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                    <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Curso</div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                    <div className="flex items-center gap-2"><Users className="w-4 h-4" /> Docente</div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Año Escolar</div>
                                                </th>
                                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                    <div className="flex items-center gap-2"><Users className="w-4 h-4" /> Estudiantes</div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                    <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Estado</div>
                                                </th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wide">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {coursesData.map(course => (
                                                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-lg" style={{ backgroundColor: "#F3E8FF" }}>
                                                                <GraduationCap className="w-4 h-4" style={{ color: "#540D6E" }} />
                                                            </div>
                                                            <p className="text-sm font-semibold text-gray-900">
                                                                {gradeLabelMap[course.grade]} {course.section}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <p className="text-sm text-gray-700">{course.teacher?.name || 'Sin asignar'}</p>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                                                            style={{ backgroundColor: "#FEF3C7", color: "#D97706" }}>
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            {course.school_year}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                                                            style={{ backgroundColor: "#DBEAFE", color: "#1D4ED8" }}>
                                                            <Users className="w-3.5 h-3.5" />
                                                            {course.students_count || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border"
                                                            style={course.is_active ? 
                                                                { backgroundColor: "#E8F5F0", borderColor: "#3BCEAC" } : 
                                                                { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }
                                                            }>
                                                            <div className={`w-2 h-2 rounded-full ${course.is_active ? "animate-pulse" : ""}`}
                                                                style={{ backgroundColor: course.is_active ? "#0EAD69" : "#9CA3AF" }} />
                                                            <span className="text-xs font-medium" 
                                                                style={{ color: course.is_active ? "#0EAD69" : "#6B7280" }}>
                                                                {course.is_active ? "Activo" : "Inactivo"}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {/* Botón Estudiantes (segundo) */}
                                                            <Link
                                                                href={route("admin.courses.students", course.id)}
                                                                className="p-2 rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center"
                                                                style={{ backgroundColor: "#3BCEAC" }}
                                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2BA88E"}
                                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#3BCEAC"}
                                                                title="Gestionar estudiantes del curso"
                                                            >
                                                                <Users className="w-4 h-4 text-white" />
                                                            </Link>
                                                            
                                                            {/* Botón Activar/Desactivar (primero) */}
                                                            <button
                                                                onClick={() => handleToggleClick(course)}
                                                                className="p-2 rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center"
                                                                style={{ backgroundColor: course.is_active ? "#6B7280" : "#0EAD69" }}
                                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = course.is_active ? "#4B5563" : "#059669"}
                                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = course.is_active ? "#6B7280" : "#0EAD69"}
                                                                title={course.is_active ? "Desactivar curso" : "Activar curso"}
                                                            >
                                                                <Power className="w-4 h-4 text-white" />
                                                            </button>
                                                            
                                                            {/* Botón Editar */}
                                                            <Link
                                                                href={route("admin.courses.edit", course.id)}
                                                                className="p-2 rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center"
                                                                style={{ backgroundColor: "#FFD23F" }}
                                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#F5C000"}
                                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#FFD23F"}
                                                                title="Editar curso"
                                                            >
                                                                <Edit2 className="w-4 h-4 text-gray-700" />
                                                            </Link>
                                                            
                                                            {/* Botón Eliminar */}
                                                            <button
                                                                onClick={() => handleDeleteClick(course)}
                                                                className="p-2 rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center"
                                                                style={{ backgroundColor: "#EE4266" }}
                                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#DC2F55"}
                                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#EE4266"}
                                                                title="Eliminar curso"
                                                            >
                                                                <Trash2 className="w-4 h-4 text-white" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-16 px-6">
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-sm"
                                        style={{ background: "linear-gradient(to bottom right, #540D6E, #EE4266)" }}>
                                        <BookOpen className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {hasActiveFilters ? "No se encontraron cursos" : "No hay cursos registrados"}
                                    </h3>
                                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                        {hasActiveFilters ? "Intente modificar los criterios de búsqueda" : "Cree el primer curso para comenzar"}
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Link
                                            href={route("admin.courses.create")}
                                            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                                            style={{ backgroundColor: "#540D6E" }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}
                                        >
                                            <Plus className="w-5 h-5" /> Crear Curso
                                        </Link>
                                        {hasActiveFilters && (
                                            <button onClick={clearFilters}
                                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all">
                                                <RotateCcw className="w-5 h-5" /> Limpiar Filtros
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Paginación */}
                        {lastPage > 1 && (
                            <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm px-6 py-4">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <p className="text-sm text-gray-600 order-2 sm:order-1">
                                        Mostrando{" "}
                                        <span className="font-bold text-gray-900">{from}</span>
                                        {" "}–{" "}
                                        <span className="font-bold text-gray-900">{to}</span>
                                        {" "}de{" "}
                                        <span className="font-bold" style={{ color: "#540D6E" }}>{total}</span>
                                        {" "}cursos
                                    </p>

                                    <div className="flex items-center gap-1 order-1 sm:order-2">
                                        <button
                                            onClick={() => goToPage(links[0]?.url)}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        {pageNumbers.map((page, idx) =>
                                            page === null ? (
                                                <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 select-none">…</span>
                                            ) : (
                                                <button
                                                    key={page}
                                                    onClick={() => {
                                                        const link = links.find(l => l.label === String(page));
                                                        goToPage(link?.url ?? null);
                                                    }}
                                                    className="min-w-[36px] h-9 px-2 rounded-lg border text-sm font-semibold transition-all"
                                                    style={
                                                        page === currentPage
                                                            ? { backgroundColor: "#540D6E", borderColor: "#540D6E", color: "#fff" }
                                                            : { backgroundColor: "#fff", borderColor: "#E5E7EB", color: "#374151" }
                                                    }
                                                    onMouseEnter={e => {
                                                        if (page !== currentPage) e.currentTarget.style.backgroundColor = "#F3E8FF";
                                                    }}
                                                    onMouseLeave={e => {
                                                        if (page !== currentPage) e.currentTarget.style.backgroundColor = "#fff";
                                                    }}>
                                                    {page}
                                                </button>
                                            )
                                        )}
                                        <button
                                            onClick={() => goToPage(links[currentPage + 1]?.url ?? null)}
                                            disabled={currentPage === lastPage}
                                            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal de Creación */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full animate-slide-up overflow-hidden">
                        <div className="h-1" style={{ background: "linear-gradient(to right, #540D6E, #EE4266)" }} />
                        <div className="p-6">
                            <button onClick={() => setShowCreateModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: "#F3E8FF" }}>
                                    <Plus className="w-6 h-6" style={{ color: "#540D6E" }} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Crear Curso</h3>
                            </div>
                            <form onSubmit={handleSubmitCreate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Grado *</label>
                                    <select
                                        value={formData.grade}
                                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                                        required
                                    >
                                        <option value="">Seleccione un grado</option>
                                        {GRADES.map(grade => (
                                            <option key={grade.value} value={grade.value}>{grade.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Sección *</label>
                                    <input
                                        type="text"
                                        value={formData.section}
                                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                                        placeholder="Ej: A, B, C"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Docente *</label>
                                    <select
                                        value={formData.teacher_id}
                                        onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                                        required
                                    >
                                        <option value="">Seleccione un docente</option>
                                        {teachers.map(teacher => (
                                            <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Año Escolar *</label>
                                    <input
                                        type="text"
                                        value={formData.school_year}
                                        onChange={(e) => setFormData({ ...formData, school_year: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                                        placeholder="Ej: 2024"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                                        rows="3"
                                        placeholder="Descripción del curso (opcional)"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-2.5 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                                        style={{ backgroundColor: "#540D6E" }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}
                                    >
                                        Crear Curso
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Edición */}
            {showEditModal && selectedCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full animate-slide-up overflow-hidden">
                        <div className="h-1" style={{ background: "linear-gradient(to right, #540D6E, #EE4266)" }} />
                        <div className="p-6">
                            <button onClick={() => setShowEditModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: "#F3E8FF" }}>
                                    <Edit2 className="w-6 h-6" style={{ color: "#540D6E" }} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Editar Curso</h3>
                            </div>
                            <form onSubmit={handleSubmitEdit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Grado *</label>
                                    <select
                                        value={formData.grade}
                                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                                        required
                                    >
                                        <option value="">Seleccione un grado</option>
                                        {GRADES.map(grade => (
                                            <option key={grade.value} value={grade.value}>{grade.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Sección *</label>
                                    <input
                                        type="text"
                                        value={formData.section}
                                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                                        placeholder="Ej: A, B, C"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Docente *</label>
                                    <select
                                        value={formData.teacher_id}
                                        onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                                        required
                                    >
                                        <option value="">Seleccione un docente</option>
                                        {teachers.map(teacher => (
                                            <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Año Escolar *</label>
                                    <input
                                        type="text"
                                        value={formData.school_year}
                                        onChange={(e) => setFormData({ ...formData, school_year: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                                        placeholder="Ej: 2024"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                                        rows="3"
                                        placeholder="Descripción del curso (opcional)"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-2.5 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                                        style={{ backgroundColor: "#540D6E" }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}
                                    >
                                        Actualizar Curso
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmación para Activar/Desactivar */}
            {showToggleModal && selectedCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowToggleModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full animate-slide-up overflow-hidden">
                        <div className="h-1" style={{ background: selectedCourse.is_active ? 'linear-gradient(to right, #EE4266, #DC2F55)' : 'linear-gradient(to right, #0EAD69, #3BCEAC)' }} />
                        
                        <div className="p-6">
                            <button onClick={() => setShowToggleModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: selectedCourse.is_active ? '#FEE2E2' : '#E8F5F0' }}>
                                    {selectedCourse.is_active ? (
                                        <EyeOff className="w-6 h-6" style={{ color: '#EE4266' }} />
                                    ) : (
                                        <Power className="w-6 h-6" style={{ color: '#0EAD69' }} />
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {selectedCourse.is_active ? 'Desactivar' : 'Activar'} Curso
                                </h3>
                            </div>

                            <p className="text-gray-600 mb-4">
                                ¿Estás seguro de {selectedCourse.is_active ? 'desactivar' : 'activar'} el curso{" "}
                                <span className="font-semibold text-gray-900 capitalize">
                                    {gradeLabelMap[selectedCourse.grade]} {selectedCourse.section}
                                </span>?
                            </p>

                            <div className="p-3 rounded-lg mb-6 flex gap-2" style={{ 
                                backgroundColor: selectedCourse.is_active ? '#FEF2F2' : '#F0FDF4', 
                                borderLeft: selectedCourse.is_active ? '4px solid #EE4266' : '4px solid #0EAD69' 
                            }}>
                                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: selectedCourse.is_active ? '#EE4266' : '#0EAD69' }} />
                                <p className="text-xs text-gray-700">
                                    {selectedCourse.is_active 
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
                                    onClick={handleConfirmToggle} 
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-md" 
                                    style={{ backgroundColor: selectedCourse.is_active ? '#EE4266' : '#0EAD69' }} 
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = selectedCourse.is_active ? '#DC2F55' : '#059669'} 
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = selectedCourse.is_active ? '#EE4266' : '#0EAD69'}
                                >
                                    {selectedCourse.is_active ? 'Desactivar' : 'Activar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && selectedCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full animate-slide-up overflow-hidden">
                        <div className="h-1" style={{ background: 'linear-gradient(to right, #EE4266, #DC2F55)' }} />
                        <div className="p-6">
                            <button onClick={() => setShowDeleteModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: "#FEE2E2" }}>
                                    <Trash2 className="w-6 h-6" style={{ color: "#EE4266" }} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Confirmar Eliminación</h3>
                            </div>
                            
                            <p className="text-gray-600 mb-4">
                                ¿Estás seguro de eliminar permanentemente el curso{" "}
                                <span className="font-semibold text-gray-900">
                                    {gradeLabelMap[selectedCourse.grade]} {selectedCourse.section}
                                </span>?
                            </p>
                            
                            <div className="p-4 rounded-lg mb-6 flex gap-3" style={{ backgroundColor: "#FEE2E2", borderLeft: "4px solid #EE4266" }}>
                                <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#EE4266" }} />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 mb-1">Esta acción no se puede deshacer</p>
                                    <p className="text-xs text-gray-600">Se eliminarán todas las relaciones con estudiantes y OVAs asociados.</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="flex-1 py-2.5 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                                    style={{ backgroundColor: "#EE4266" }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#DC2F55"}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#EE4266"}
                                >
                                    Eliminar Curso
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
                .animate-fade-in { animation: fadeIn 0.3s ease-out; }
                .animate-slide-up { animation: slideUp 0.3s ease-out; }
                .animate-slide-down { animation: slideDown 0.3s ease-out; }
            `}</style>
        </>
    );
}