import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, Search, Edit2, Trash2, Eye, Power, EyeOff, 
    Layers, Filter, X, RotateCcw, ChevronDown, ChevronUp
} from 'lucide-react';
import AppSidebar, { useSidebarState } from '@/Components/AppSidebar';

export default function Index({ ovas, filters, areas }) {
    const [collapsed] = useSidebarState();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedArea, setSelectedArea] = useState(filters.area || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [ovaToDelete, setOvaToDelete] = useState(null);

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

    const handleDeleteClick = (ova) => {
        setOvaToDelete(ova);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(route('admin.ovas.destroy', ovaToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setOvaToDelete(null);
            }
        });
    };

    const toggleStatus = (ova) => {
        router.patch(route('admin.ovas.toggle-status', ova.id), {}, {
            preserveScroll: true,
        });
    };

    const handleSort = (field) => {
        const newDirection = filters.sort === field && filters.direction === 'asc' ? 'desc' : 'asc';
        router.get(route('admin.ovas.index'), {
            ...filters,
            sort: field,
            direction: newDirection,
        }, { preserveState: true });
    };

    const SortIcon = ({ field }) => {
        if (filters.sort !== field) return <ChevronDown className="w-4 h-4 opacity-30" />;
        return filters.direction === 'asc' ? 
            <ChevronUp className="w-4 h-4" /> : 
            <ChevronDown className="w-4 h-4" />;
    };

    return (
        <>
            <Head title="Gestionar OVAs" />
            <AppSidebar currentRoute="admin.ovas.index" />
            
            <main className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-20" : "lg:ml-72"} min-h-screen bg-gray-50`}>
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className="p-4 rounded-xl shadow-sm border bg-white" style={{ borderColor: "#540D6E" }}>
                                    <Layers className="w-10 h-10" style={{ color: "#540D6E" }} />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de OVAs</h1>
                                    <p className="text-gray-600 text-base">Administración de Objetos Virtuales de Aprendizaje</p>
                                </div>
                            </div>
                            <Link href={route('admin.ovas.create')}
                                className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                                style={{ backgroundColor: "#540D6E" }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}>
                                <Plus className="w-5 h-5" /> Nueva OVA
                            </Link>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por área, temática..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && applyFilters()}
                                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 outline-none transition-all"
                                    style={{ "--tw-ring-color": "rgba(84, 13, 110, 0.2)" }}
                                    onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                />
                            </div>
                            <div className="relative">
                                <select
                                    value={selectedArea}
                                    onChange={e => setSelectedArea(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg appearance-none focus:ring-2 outline-none transition-all"
                                    style={{ "--tw-ring-color": "rgba(84, 13, 110, 0.2)" }}
                                    onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                >
                                    <option value="">Todas las áreas</option>
                                    {areas.map(area => (
                                        <option key={area} value={area}>{area}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                            <div className="relative">
                                <select
                                    value={selectedStatus}
                                    onChange={e => setSelectedStatus(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg appearance-none focus:ring-2 outline-none transition-all"
                                    style={{ "--tw-ring-color": "rgba(84, 13, 110, 0.2)" }}
                                    onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                >
                                    <option value="">Todos los estados</option>
                                    <option value="active">Activos</option>
                                    <option value="inactive">Inactivos</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-4">
                            {hasActiveFilters && (
                                <button onClick={clearFilters}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold border-2 border-gray-300 rounded-lg hover:bg-gray-50">
                                    <RotateCcw className="w-4 h-4" /> Limpiar
                                </button>
                            )}
                            <button onClick={applyFilters}
                                className="inline-flex items-center gap-2 px-6 py-2 text-white rounded-lg font-semibold transition-all"
                                style={{ backgroundColor: "#540D6E" }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}>
                                <Search className="w-4 h-4" /> Buscar
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('area')}>
                                            <div className="flex items-center gap-2">
                                                Área <SortIcon field="area" />
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('tematica')}>
                                            <div className="flex items-center gap-2">
                                                Temática <SortIcon field="tematica" />
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Descripción</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('is_active')}>
                                            <div className="flex items-center justify-center gap-2">
                                                Estado <SortIcon field="is_active" />
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wide">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {ovas.data.map(ova => (
                                        <tr key={ova.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                                                    style={{ backgroundColor: "#540D6E" }}>
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
                                                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border w-auto"
                                                    style={ova.is_active ? { backgroundColor: "#E8F5F0", borderColor: "#3BCEAC" } : { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }}>
                                                    <div className={`w-2 h-2 rounded-full ${ova.is_active ? "animate-pulse" : ""}`}
                                                        style={{ backgroundColor: ova.is_active ? "#0EAD69" : "#9CA3AF" }} />
                                                    <span className="text-xs font-medium" style={{ color: ova.is_active ? "#0EAD69" : "#6B7280" }}>
                                                        {ova.is_active ? "Activo" : "Inactivo"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => toggleStatus(ova)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-sm hover:shadow-md"
                                                        style={{ backgroundColor: ova.is_active ? "#6B7280" : "#0EAD69" }}
                                                        title={ova.is_active ? "Desactivar" : "Activar"}>
                                                        {ova.is_active ? <EyeOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                                                    </button>
                                                    <Link href={route('admin.ovas.show', ova.id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-sm hover:shadow-md"
                                                        style={{ backgroundColor: "#3B82F6" }}>
                                                        <Eye className="w-4 h-4" /> Ver
                                                    </Link>
                                                    <Link href={route('admin.ovas.edit', ova.id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 transition-all shadow-sm hover:shadow-md"
                                                        style={{ backgroundColor: "#FFD23F" }}>
                                                        <Edit2 className="w-4 h-4" /> Editar
                                                    </Link>
                                                    <button onClick={() => handleDeleteClick(ova)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-sm hover:shadow-md"
                                                        style={{ backgroundColor: "#EE4266" }}>
                                                        <Trash2 className="w-4 h-4" /> Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {ovas.data.length === 0 && (
                            <div className="text-center py-16 px-6">
                                <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No hay OVAs registradas</h3>
                                <p className="text-gray-600 mb-6">Comienza creando tu primera OVA</p>
                                <Link href={route('admin.ovas.create')}
                                    className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all"
                                    style={{ backgroundColor: "#540D6E" }}>
                                    <Plus className="w-5 h-5" /> Crear primera OVA
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {ovas.links && ovas.links.length > 3 && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex gap-2">
                                {ovas.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                            link.active
                                                ? 'text-white shadow-sm'
                                                : 'text-gray-700 bg-white border-2 border-gray-200 hover:border-gray-300'
                                        }`}
                                        style={link.active ? { backgroundColor: "#540D6E" } : {}}
                                        disabled={!link.url}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Delete Modal */}
            {showDeleteModal && ovaToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar Eliminación</h3>
                            <p className="text-gray-600 mb-6">
                                ¿Estás seguro de eliminar la OVA <span className="font-semibold">{ovaToDelete.tematica}</span>?
                                {ovaToDelete.courses_count > 0 && (
                                    <span className="text-red-600 block mt-2">
                                        ⚠️ Esta OVA está siendo utilizada en {ovaToDelete.courses_count} curso(s)
                                    </span>
                                )}
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50">
                                    Cancelar
                                </button>
                                <button onClick={confirmDelete}
                                    className="px-4 py-2 text-white rounded-lg bg-red-600 hover:bg-red-700">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}