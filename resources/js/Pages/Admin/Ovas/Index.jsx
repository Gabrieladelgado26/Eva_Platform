import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus, Search, Edit2, Trash2, Eye, Power, EyeOff, AlertCircle,
    Layers, Filter, X, RotateCcw, ChevronDown, ChevronUp, CheckCircle
} from 'lucide-react';
import AppSidebar, { useSidebarState } from '@/Components/AppSidebar';

export default function Index({ ovas, filters, areas }) {
    const [collapsed] = useSidebarState();
    const [searchTerm, setSearchTerm]     = useState(filters.search || '');
    const [selectedArea, setSelectedArea] = useState(filters.area   || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

    const [showDeleteModal, setShowDeleteModal]       = useState(false);
    const [ovaToDelete, setOvaToDelete]               = useState(null);
    const [showActivateModal, setShowActivateModal]   = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [ovaToToggle, setOvaToToggle]               = useState(null);

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

    const handleDeleteClick = (ova) => { setOvaToDelete(ova); setShowDeleteModal(true); };

    const confirmDelete = () => {
        router.delete(route('admin.ovas.destroy', ovaToDelete.id), {
            preserveScroll: true,
            onSuccess: () => { setShowDeleteModal(false); setOvaToDelete(null); }
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
            }
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
        if (filters.sort !== field) return <ChevronDown className="w-3.5 h-3.5 opacity-30" />;
        return filters.direction === 'asc'
            ? <ChevronUp className="w-3.5 h-3.5" style={{ color: '#540D6E' }} />
            : <ChevronDown className="w-3.5 h-3.5" style={{ color: '#540D6E' }} />;
    };

    /* ─── Estilos reutilizables ──────────────────────────────────── */
    const selectStyle = {
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        appearance: 'none',
    };

    const iconBtn = (bg, hoverBg, title, onClick, children) => (
        <button
            onClick={onClick}
            title={title}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-white transition-all shadow-sm hover:shadow-md"
            style={{ backgroundColor: bg }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBg}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = bg}
        >
            {children}
        </button>
    );

    return (
        <>
            <Head title="Gestionar OVAs" />
            <AppSidebar currentRoute="admin.ovas.index" />

            <main className={`transition-all duration-300 ease-in-out ${collapsed ? 'lg:ml-20' : 'lg:ml-72'} min-h-screen bg-gray-50 text-sm`}>
                <div className="py-8 px-4 sm:px-6 lg:px-8">

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

                    {/* ── Filtros ──────────────────────────────────────────────── */}
                    <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-4">
                            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">

                                {/* Búsqueda */}
                                <div className="relative flex-1 min-w-0">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por área o temática…"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && applyFilters()}
                                        className="w-full pl-9 pr-8 py-2.5 text-sm bg-white border-2 border-gray-200 rounded-lg outline-none transition-all"
                                        onFocus={e => e.currentTarget.style.borderColor = '#540D6E'}
                                        onBlur={e => e.currentTarget.style.borderColor = '#E5E7EB'}
                                    />
                                    {searchTerm && (
                                        <button onClick={() => setSearchTerm('')}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>

                                {/* Área */}
                                <div className="relative lg:w-80">
                                    <select
                                        value={selectedArea}
                                        onChange={e => setSelectedArea(e.target.value)}
                                        style={selectStyle}
                                        className="w-full px-3 pr-9 py-2.5 text-sm bg-white border-2 border-gray-200 rounded-lg outline-none transition-all text-gray-700 cursor-pointer"
                                        onFocus={e => e.currentTarget.style.borderColor = '#540D6E'}
                                        onBlur={e => e.currentTarget.style.borderColor = '#E5E7EB'}
                                    >
                                        <option value="">Todas las áreas</option>
                                        {areas.map(area => (
                                            <option key={area} value={area}>{area}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>

                                {/* Estado */}
                                <div className="relative lg:w-80">
                                    <select
                                        value={selectedStatus}
                                        onChange={e => setSelectedStatus(e.target.value)}
                                        style={selectStyle}
                                        className="w-full px-3 pr-9 py-2.5 text-sm bg-white border-2 border-gray-200 rounded-lg outline-none transition-all text-gray-700 cursor-pointer"
                                        onFocus={e => e.currentTarget.style.borderColor = '#540D6E'}
                                        onBlur={e => e.currentTarget.style.borderColor = '#E5E7EB'}
                                    >
                                        <option value="">Todos los estados</option>
                                        <option value="active">Activos</option>
                                        <option value="inactive">Inactivos</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>

                                {/* Botones */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-gray-600"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" /> Limpiar
                                        </button>
                                    )}
                                    <button
                                        onClick={applyFilters}
                                        className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                                        style={{ backgroundColor: '#540D6E' }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#6B1689'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#540D6E'}
                                    >
                                        <Search className="w-3.5 h-3.5" /> Buscar
                                    </button>
                                </div>
                            </div>

                            {/* Badges de filtros activos */}
                            {hasActiveFilters && (
                                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                                    {searchTerm && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                                            style={{ backgroundColor: '#F3E8FF', borderColor: '#540D6E', color: '#540D6E' }}>
                                            Búsqueda: "{searchTerm}"
                                            <button onClick={() => setSearchTerm('')}><X className="w-3 h-3" /></button>
                                        </span>
                                    )}
                                    {selectedArea && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                                            style={{ backgroundColor: '#F3E8FF', borderColor: '#540D6E', color: '#540D6E' }}>
                                            Área: {selectedArea}
                                            <button onClick={() => setSelectedArea('')}><X className="w-3 h-3" /></button>
                                        </span>
                                    )}
                                    {selectedStatus && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                                            style={{ backgroundColor: '#F3E8FF', borderColor: '#540D6E', color: '#540D6E' }}>
                                            Estado: {selectedStatus === 'active' ? 'Activo' : 'Inactivo'}
                                            <button onClick={() => setSelectedStatus('')}><X className="w-3 h-3" /></button>
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Tabla ─────────────────────────────────────────────────── */}
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-100 select-none"
                                            onClick={() => handleSort('area')}>
                                            <div className="flex items-center gap-1.5">Área <SortIcon field="area" /></div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-100 select-none"
                                            onClick={() => handleSort('tematica')}>
                                            <div className="flex items-center gap-1.5">Temática <SortIcon field="tematica" /></div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Descripción</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-100 select-none"
                                            onClick={() => handleSort('is_active')}>
                                            <div className="flex items-center justify-center gap-1.5">Estado <SortIcon field="is_active" /></div>
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wide">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {ovas.data.map(ova => (
                                        <tr key={ova.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold text-white"
                                                    style={{ backgroundColor: '#540D6E' }}>
                                                    {ova.area}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-semibold text-gray-900">{ova.tematica}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">{ova.description || 'Sin descripción'}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border"
                                                    style={ova.is_active
                                                        ? { backgroundColor: '#E8F5F0', borderColor: '#3BCEAC' }
                                                        : { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' }}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${ova.is_active ? 'animate-pulse' : ''}`}
                                                        style={{ backgroundColor: ova.is_active ? '#0EAD69' : '#9CA3AF' }} />
                                                    <span className="text-sm font-medium"
                                                        style={{ color: ova.is_active ? '#0EAD69' : '#6B7280' }}>
                                                        {ova.is_active ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {/* Toggle estado */}
                                                    {iconBtn(
                                                        ova.is_active ? '#6B7280' : '#0EAD69',
                                                        ova.is_active ? '#4B5563' : '#059669',
                                                        ova.is_active ? 'Desactivar' : 'Activar',
                                                        () => handleToggleClick(ova),
                                                        ova.is_active ? <EyeOff className="w-4 h-4" /> : <Power className="w-4 h-4" />
                                                    )}
                                                    {/* Ver */}
                                                    <Link
                                                        href={route('admin.ovas.show', ova.id)}
                                                        title="Ver detalle"
                                                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-white transition-all shadow-sm hover:shadow-md"
                                                        style={{ backgroundColor: '#2EB89A' }}
                                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#249C84'}
                                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2EB89A'}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    {/* Editar */}
                                                    <Link
                                                        href={route('admin.ovas.edit', ova.id)}
                                                        title="Editar"
                                                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-800 transition-all shadow-sm hover:shadow-md"
                                                        style={{ backgroundColor: '#FFD23F' }}
                                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5C000'}
                                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFD23F'}
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                    {/* Eliminar */}
                                                    {iconBtn(
                                                        '#EE4266', '#DC2F55',
                                                        'Eliminar',
                                                        () => handleDeleteClick(ova),
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
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
                                {hasActiveFilters ? (
                                    <>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron OVAs</h3>
                                        <p className="text-gray-600 mb-6">Ningún OVA coincide con los filtros aplicados. Intenta con otros criterios de búsqueda.</p>
                                        <button onClick={clearFilters}
                                            className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all"
                                            style={{ backgroundColor: '#540D6E' }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#6B1689'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#540D6E'}>
                                            <RotateCcw className="w-5 h-5" /> Limpiar filtros
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">No hay OVAs registrados</h3>
                                        <p className="text-gray-600 mb-6">Comienza creando tu primer OVA</p>
                                        <Link href={route('admin.ovas.create')}
                                            className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all"
                                            style={{ backgroundColor: '#540D6E' }}>
                                            <Plus className="w-5 h-5" /> Crear primer OVA
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Paginación */}
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
                                        style={link.active ? { backgroundColor: '#540D6E' } : {}}
                                        disabled={!link.url}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* ── Modal Eliminación ──────────────────────────────────────── */}
            {showDeleteModal && ovaToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full animate-slide-up">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: '#FECACA' }}>
                                    <Trash2 className="w-6 h-6" style={{ color: '#EE4266' }} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Confirmar Eliminación</h3>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">Esta acción es irreversible</p>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start gap-3 p-4 rounded-lg border mb-4"
                                style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA' }}>
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#EE4266' }} />
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 mb-0.5">OVA a eliminar:</p>
                                    <p className="font-bold text-gray-900">{ovaToDelete.tematica}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{ovaToDelete.area}</p>
                                    {ovaToDelete.courses_count > 0 && (
                                        <p className="text-xs font-semibold mt-1.5" style={{ color: '#EE4266' }}>
                                            ⚠️ Usada en {ovaToDelete.courses_count} curso(s)
                                        </p>
                                    )}
                                </div>
                            </div>
                            {['Se eliminarán todos los datos asociados a esta OVA',
                              'Los cursos que la usen perderán el recurso inmediatamente'].map((text, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm text-gray-600 mb-1">
                                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#EE4266' }} />
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 pt-0 border-t border-gray-200 flex items-center justify-end gap-3 pt-4">
                            <button onClick={() => setShowDeleteModal(false)}
                                className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                                Cancelar
                            </button>
                            <button onClick={confirmDelete}
                                className="px-6 py-2.5 text-sm font-bold text-white rounded-lg transition-all shadow-sm hover:shadow-md"
                                style={{ backgroundColor: '#EE4266' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#DC2F55'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#EE4266'}>
                                <span className="flex items-center gap-2"><Trash2 className="w-4 h-4" /> Confirmar Eliminación</span>
                            </button>
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
                                    <p className="text-sm font-medium text-gray-900 mb-0.5">¿Qué sucederá?</p>
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
                                    <p className="text-sm font-medium text-gray-900 mb-0.5">¿Qué sucederá?</p>
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
        </>
    );
}
