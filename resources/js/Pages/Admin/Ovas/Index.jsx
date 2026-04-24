import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Plus, Search, Edit2, Trash2, Eye, Power, EyeOff, AlertCircle,
    Layers, Filter, X, RotateCcw, ChevronDown, ChevronUp, CheckCircle,
    ChevronLeft, ChevronRight, BookOpen, FileText, AlertCircle as AlertIcon, RotateCcw as RotateIcon
} from 'lucide-react';
import AppSidebar, { useSidebarState } from '@/Components/AppSidebar';

// ─── Componente Toast con barra de progreso ───────────────────────────────────
function Toast({ message, type = 'success', onClose, duration = 4000 }) {
    const [progress, setProgress] = useState(100);
    const intervalRef = React.useRef(null);
    const startTimeRef = React.useRef(Date.now());

    useEffect(() => {
        const updateProgress = () => {
            const elapsed = Date.now() - startTimeRef.current;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);
            
            if (remaining <= 0) {
                onClose();
            }
        };

        intervalRef.current = setInterval(updateProgress, 50);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
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
                        <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
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

export default function Index({ ovas, filters, areas }) {
    const { props } = usePage();
    const flash = props.flash || {};
    const [collapsed] = useSidebarState();
    
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedArea, setSelectedArea] = useState(filters.area || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [ovaToDelete, setOvaToDelete] = useState(null);
    const [showActivateModal, setShowActivateModal] = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [ovaToToggle, setOvaToToggle] = useState(null);

    // Toast state
    const [toast, setToast] = useState(null);

    const ovasData = ovas?.data ?? [];
    const currentPage = ovas?.current_page ?? 1;
    const lastPage = ovas?.last_page ?? 1;
    const from = ovas?.from ?? 0;
    const to = ovas?.to ?? 0;
    const total = ovas?.total ?? 0;
    const links = ovas?.links ?? [];

    // Mostrar toast cuando hay flash messages
    useEffect(() => {
        if (flash?.success) {
            setToast({ message: flash.success, type: 'success' });
            // Limpiar el flash después de mostrarlo
            flash.success = null;
        }
        if (flash?.error) {
            setToast({ message: flash.error, type: 'error' });
            // Limpiar el flash después de mostrarlo
            flash.error = null;
        }
    }, [flash]);

    const hasActiveFilters = searchTerm || selectedArea || selectedStatus;

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedArea('');
        setSelectedStatus('');
        router.get(route('admin.ovas.index'), {}, { preserveState: true });
    };

    const applyFilters = () => {
        router.get(route('admin.ovas.index'), {
            search: searchTerm,
            area: selectedArea,
            status: selectedStatus,
        }, { preserveState: true });
    };

    const goToPage = (url) => {
        if (!url) return;
        router.get(url, {
            search: searchTerm,
            area: selectedArea,
            status: selectedStatus,
        }, { preserveState: true });
    };

    const handleDeleteClick = (ova) => { 
        setOvaToDelete(ova); 
        setShowDeleteModal(true); 
    };

    const confirmDelete = () => {
        router.delete(route('admin.ovas.destroy', ovaToDelete.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                setShowDeleteModal(false);
                setOvaToDelete(null);
                
                // Usar el mensaje exacto que viene del servidor
                if (page.props.flash?.error) {
                    setToast({ 
                        message: page.props.flash.error, 
                        type: 'error' 
                    });
                } else if (page.props.flash?.success) {
                    setToast({ 
                        message: page.props.flash.success, 
                        type: 'success' 
                    });
                }
            },
            onError: (errors) => {
                setShowDeleteModal(false);
                setOvaToDelete(null);
                
                // Mostrar errores de validación si los hay
                const errorMessage = Object.values(errors).flat().join('\n') || 'Error al eliminar el OVA';
                setToast({ 
                    message: errorMessage, 
                    type: 'error' 
                });
            }
        });
    };

    const handleToggleClick = (ova) => {
        setOvaToToggle(ova);
        ova.is_active ? setShowDeactivateModal(true) : setShowActivateModal(true);
    };

    const confirmToggle = () => {
        router.patch(route('admin.ovas.toggle-status', ovaToToggle.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setShowActivateModal(false);
                setShowDeactivateModal(false);
                setOvaToToggle(null);
                setToast({ 
                    message: ovaToToggle.is_active ? 'OVA desactivado correctamente' : 'OVA activado correctamente', 
                    type: 'success' 
                });
            },
            onError: () => {
                setToast({ message: 'Error al cambiar el estado', type: 'error' });
            }
        });
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

    const selectStyle = {
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        appearance: 'none',
    };

    return (
        <>
            <Head title="Gestión de OVAs" />
            <AppSidebar currentRoute="admin.ovas.index" />

            {/* Toast */}
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                    duration={4000}
                />
            )}

            <main className={`transition-all duration-300 ease-in-out ${collapsed ? 'lg:ml-20' : 'lg:ml-72'} min-h-screen bg-gray-50`}>
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
                                    OVAs
                                </span>
                            </div>
                        </div>

                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-4 rounded-xl shadow-sm border bg-white" style={{ borderColor: '#540D6E' }}>
                                        <Layers className="w-10 h-10" style={{ color: '#540D6E' }} />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de OVAs</h1>
                                        <p className="text-gray-600 text-base">Administración de Objetos Virtuales de Aprendizaje</p>
                                    </div>
                                </div>
                                <Link
                                    href={route('admin.ovas.create')}
                                    className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                                    style={{ backgroundColor: '#540D6E' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#6B1689'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#540D6E'}
                                >
                                    <Plus className="w-5 h-5" /> Nuevo OVA
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
                                        placeholder="Buscar por área o temática..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && applyFilters()}
                                        className="w-full pl-12 pr-10 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all hover:border-gray-300"
                                        style={{ "--tw-ring-color": "rgba(84, 13, 110, 0.2)" }}
                                        onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                        onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
                                    />
                                    {searchTerm && (
                                        <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <select
                                        value={selectedArea}
                                        onChange={e => setSelectedArea(e.target.value)}
                                        style={selectStyle}
                                        className="px-4 pr-10 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-offset-2 outline-none transition-all hover:border-gray-300 appearance-none"
                                        onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                        onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
                                    >
                                        <option value="">Todas las áreas</option>
                                        {areas.map(area => (
                                            <option key={area} value={area}>{area}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                                <div className="relative">
                                    <select
                                        value={selectedStatus}
                                        onChange={e => setSelectedStatus(e.target.value)}
                                        style={selectStyle}
                                        className="px-4 pr-10 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-offset-2 outline-none transition-all hover:border-gray-300 appearance-none"
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
                                                        <button onClick={() => setSearchTerm('')} className="hover:bg-white/50 p-0.5 rounded">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                )}
                                                {selectedArea && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-medium"
                                                        style={{ backgroundColor: "#F3E8FF", borderColor: "#540D6E", color: "#540D6E" }}>
                                                        Área: {selectedArea}
                                                        <button onClick={() => setSelectedArea('')} className="hover:bg-white/50 p-0.5 rounded">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                )}
                                                {selectedStatus && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-medium"
                                                        style={{ backgroundColor: "#F3E8FF", borderColor: "#540D6E", color: "#540D6E" }}>
                                                        Estado: {selectedStatus === 'active' ? 'Activo' : 'Inactivo'}
                                                        <button onClick={() => setSelectedStatus('')} className="hover:bg-white/50 p-0.5 rounded">
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
                            {ovasData.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                    <div className="flex items-center gap-2"><Layers className="w-4 h-4" /> Área</div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                    <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Temática</div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                    <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> Descripción</div>
                                                </th>
                                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                    <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Estado</div>
                                                </th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wide">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {ovasData.map(ova => (
                                                <tr key={ova.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold text-white shadow-sm"
                                                            style={{ backgroundColor: '#540D6E' }}>
                                                            {ova.area}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm font-semibold text-gray-900">{ova.tematica}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm text-gray-600 line-clamp-2 max-w-md">{ova.description || 'Sin descripción'}</p>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border"
                                                            style={ova.is_active
                                                                ? { backgroundColor: '#E8F5F0', borderColor: '#3BCEAC' }
                                                                : { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' }}>
                                                            <div className={`w-2 h-2 rounded-full ${ova.is_active ? 'animate-pulse' : ''}`}
                                                                style={{ backgroundColor: ova.is_active ? '#0EAD69' : '#9CA3AF' }} />
                                                            <span className="text-sm font-medium"
                                                                style={{ color: ova.is_active ? '#0EAD69' : '#6B7280' }}>
                                                                {ova.is_active ? 'Activo' : 'Inactivo'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleToggleClick(ova)}
                                                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-sm hover:shadow-md"
                                                                style={{ backgroundColor: ova.is_active ? '#6B7280' : '#0EAD69' }}
                                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = ova.is_active ? '#4B5563' : '#059669'}
                                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = ova.is_active ? '#6B7280' : '#0EAD69'}
                                                            >
                                                                {ova.is_active ? <EyeOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                                                            </button>
                                                            <Link
                                                                href={route('admin.ovas.show', ova.id)}
                                                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-sm hover:shadow-md"
                                                                style={{ backgroundColor: '#3BCEAC' }}
                                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2BA88E'}
                                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#3BCEAC'}
                                                            >
                                                                <Eye className="w-4 h-4" /> 
                                                            </Link>
                                                            <Link
                                                                href={route('admin.ovas.edit', ova.id)}
                                                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 transition-all shadow-sm hover:shadow-md"
                                                                style={{ backgroundColor: '#FFD23F' }}
                                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5C000'}
                                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFD23F'}
                                                            >
                                                                <Edit2 className="w-4 h-4" /> 
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDeleteClick(ova)}
                                                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-sm hover:shadow-md"
                                                                style={{ backgroundColor: '#EE4266' }}
                                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#DC2F55'}
                                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#EE4266'}
                                                            >
                                                                <Trash2 className="w-4 h-4" /> 
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
                                        <Layers className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {hasActiveFilters ? "No se encontraron OVAs" : "No hay OVAs registrados"}
                                    </h3>
                                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                        {hasActiveFilters ? "Intente modificar los criterios de búsqueda" : "Cree el primer OVA para comenzar"}
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Link
                                            href={route('admin.ovas.create')}
                                            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                                            style={{ backgroundColor: "#540D6E" }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}
                                        >
                                            <Plus className="w-5 h-5" /> Crear OVA
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
                                        {" "}OVAs
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

            {/* ── Modal Eliminación ──────────────────────────────────────── */}
            {showDeleteModal && ovaToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full animate-slide-up overflow-hidden">
                        <div className="h-1" style={{ background: 'linear-gradient(to right, #EE4266, #DC2F55)' }} />
                        <div className="p-6">
                            <button onClick={() => setShowDeleteModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: '#FEE2E2' }}>
                                    <Trash2 className="w-6 h-6" style={{ color: '#EE4266' }} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Confirmar Eliminación</h3>
                            </div>
                            
                            <p className="text-gray-600 mb-4">
                                ¿Estás seguro de eliminar permanentemente el OVA{" "}
                                <span className="font-semibold text-gray-900">{ovaToDelete.tematica}</span>?
                            </p>

                            <div className="p-4 rounded-lg mb-6 flex gap-3" style={{ backgroundColor: '#FEE2E2', borderLeft: '4px solid #EE4266' }}>
                                <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#EE4266' }} />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 mb-1">Esta acción no se puede deshacer</p>
                                    <p className="text-xs text-gray-600">El OVA será eliminado de todos los cursos donde esté asignado.</p>
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
                                    onClick={confirmDelete}
                                    className="flex-1 py-2.5 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                                    style={{ backgroundColor: '#EE4266' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#DC2F55'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#EE4266'}
                                >
                                    Eliminar OVA
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal Activar ─────────────────────────────────────────── */}
            {showActivateModal && ovaToToggle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowActivateModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full animate-slide-up overflow-hidden">
                        <div className="h-1" style={{ background: 'linear-gradient(to right, #0EAD69, #3BCEAC)' }} />
                        <div className="p-6">
                            <button onClick={() => setShowActivateModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: '#E8F5F0' }}>
                                    <Power className="w-6 h-6" style={{ color: '#0EAD69' }} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Activar OVA</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                ¿Estás seguro de activar <span className="font-semibold text-gray-900">{ovaToToggle.tematica}</span>?
                            </p>
                            <div className="p-4 rounded-lg mb-6 flex gap-3" style={{ backgroundColor: '#E8F5F0', borderLeft: '4px solid #0EAD69' }}>
                                <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#0EAD69' }} />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 mb-1">¿Qué sucederá?</p>
                                    <p className="text-xs text-gray-600">El OVA quedará visible y disponible para los cursos asignados.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowActivateModal(false)}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                                    Cancelar
                                </button>
                                <button onClick={confirmToggle}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-md"
                                    style={{ backgroundColor: '#0EAD69' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#059669'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0EAD69'}>
                                    Activar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal Desactivar ──────────────────────────────────────── */}
            {showDeactivateModal && ovaToToggle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeactivateModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full animate-slide-up overflow-hidden">
                        <div className="h-1" style={{ background: 'linear-gradient(to right, #EE4266, #DC2F55)' }} />
                        <div className="p-6">
                            <button onClick={() => setShowDeactivateModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: '#FEE2E2' }}>
                                    <EyeOff className="w-6 h-6" style={{ color: '#EE4266' }} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Desactivar OVA</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                ¿Estás seguro de desactivar <span className="font-semibold text-gray-900">{ovaToToggle.tematica}</span>?
                            </p>
                            <div className="p-4 rounded-lg mb-6 flex gap-3" style={{ backgroundColor: '#FEE2E2', borderLeft: '4px solid #EE4266' }}>
                                <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#EE4266' }} />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 mb-1">¿Qué sucederá?</p>
                                    <p className="text-xs text-gray-600">El OVA quedará oculto y los estudiantes no podrán acceder a él.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowDeactivateModal(false)}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                                    Cancelar
                                </button>
                                <button onClick={confirmToggle}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-md"
                                    style={{ backgroundColor: '#EE4266' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#DC2F55'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#EE4266'}>
                                    Desactivar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
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
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fadeIn 0.3s ease-out; }
                .animate-slide-up { animation: slideUp 0.3s ease-out; }
                .animate-slide-down { animation: slideDown 0.3s ease-out; }
            `}</style>
        </>
    );
}