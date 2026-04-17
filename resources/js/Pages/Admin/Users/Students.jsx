import { Head, Link, usePage, router } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import AppSidebar, { useSidebarState } from '@/Components/AppSidebar';
import {
    UserPlus, Edit2, Trash2, User, Shield, Users, Search, Filter, X,
    RotateCcw, AlertCircle, CheckCircle, EyeOff, Power, GraduationCap, BookOpen,
    ChevronLeft, ChevronRight, Eye, Copy, Check,
    UsersRound, ChevronsLeft, ChevronsRight, ChevronDown
} from "lucide-react";

// ─── Componente Toast con barra de progreso ───────────────────────────────────
function Toast({ message, type = 'success', onClose, duration = 4000 }) {
    const [progress, setProgress] = useState(100);
    const intervalRef = useRef(null);
    const startTimeRef = useRef(Date.now());

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
                
                {/* Barra de progreso */}
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

// ── Avatar del estudiante ─────────────────────────────────────────────────────
function StudentAvatar({ student }) {
    // Si tiene avatar personalizado
    if (student.avatar) {
        return (
            <img 
                src={`/avatars/${student.avatar}.png`} 
                alt={student.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                onError={(e) => { 
                    e.currentTarget.style.display = 'none';
                    // Mostrar fallback
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
    // Fallback: avatar con inicial
    return (
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
            style={{ background: "linear-gradient(to bottom right, #540D6E, #EE4266)" }}>
            {student.name?.charAt(0).toUpperCase() ?? 'E'}
        </div>
    );
}

export default function Students({ users = [], stats = {} }) {
    const { props } = usePage();
    const flash = props.flash || {};
    const { auth } = usePage().props;
    
    const [collapsed] = useSidebarState();

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const [showCredentialsModal, setShowCredentialsModal] = useState(false);
    const [credentials, setCredentials] = useState(null);

    const [showActivateModal, setShowActivateModal] = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [userToActivate, setUserToActivate] = useState(null);
    const [userToDeactivate, setUserToDeactivate] = useState(null);

    const [copied, setCopied] = useState({ username: false, pin: false });

    const [showPinModal, setShowPinModal] = useState(false);
    const [pinUserId, setPinUserId] = useState(null);
    const [pinUserName, setPinUserName] = useState('');

    // Toast state
    const [toast, setToast] = useState(null);

    // Mostrar toast cuando hay flash messages
    useEffect(() => {
        if (flash?.success) {
            setToast({ message: flash.success, type: 'success' });
        }
        if (flash?.error) {
            setToast({ message: flash.error, type: 'error' });
        }
    }, [flash]);

    useEffect(() => {
        if (flash?.credentials) {
            setCredentials(flash.credentials);
            setShowCredentialsModal(true);
        }
    }, [flash?.credentials]);

    const normalize = (value) => (value ?? "").toLowerCase();

    const usersData = users?.data ?? [];

    const currentPage = users?.current_page ?? 1;
    const lastPage = users?.last_page ?? 1;
    const from = users?.from ?? 0;
    const to = users?.to ?? 0;
    const total = users?.total ?? 0;
    const links = users?.links ?? [];

    const isUserActive = (user) => {
        if (typeof user.is_active === "boolean") return user.is_active;
        if (typeof user.is_active === "number") return user.is_active === 1;
        return user.is_active === "1" || user.is_active === "true";
    };

    const handleActivateClick = (user) => {
        setUserToActivate(user);
        setShowActivateModal(true);
    };

    const handleDeactivateClick = (user) => {
        setUserToDeactivate(user);
        setShowDeactivateModal(true);
    };

    const confirmActivateUser = () => {
        router.patch(route("admin.users.toggleStatus", userToActivate.id), {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setShowActivateModal(false);
                setUserToActivate(null);
                setToast({ message: 'Estudiante activado correctamente', type: 'success' });
            },
            onError: () => {
                setToast({ message: 'Error al activar el estudiante', type: 'error' });
            }
        });
    };

    const confirmDeactivateUser = () => {
        router.patch(route("admin.users.toggleStatus", userToDeactivate.id), {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setShowDeactivateModal(false);
                setUserToDeactivate(null);
                setToast({ message: 'Estudiante desactivado correctamente', type: 'success' });
            },
            onError: () => {
                setToast({ message: 'Error al desactivar el estudiante', type: 'error' });
            }
        });
    };

    const filteredUsers = usersData.filter((u) => {
        const matchesSearch =
            normalize(u.name).includes(normalize(searchTerm)) ||
            normalize(u.username).includes(normalize(searchTerm));

        const matchesStatus =
            filterStatus === "all" ||
            (filterStatus === "active" && isUserActive(u)) ||
            (filterStatus === "inactive" && !isUserActive(u));

        return matchesSearch && matchesStatus;
    });

    const hasActiveFilters = searchTerm || filterStatus !== "all";

    const clearFilters = () => {
        setSearchTerm("");
        setFilterStatus("all");
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        router.delete(route("admin.users.destroy", userToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setUserToDelete(null);
                setToast({ message: 'Estudiante eliminado correctamente', type: 'success' });
            },
            onError: () => {
                setToast({ message: 'Error al eliminar el estudiante', type: 'error' });
            }
        });
    };

    const handleRegeneratePin = (userId, userName) => {
        setPinUserId(userId);
        setPinUserName(userName);
        setShowPinModal(true);
    };

    const confirmRegeneratePin = () => {
        setShowPinModal(false);
        router.post(route("admin.users.regeneratePin", pinUserId), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setToast({ message: 'PIN regenerado correctamente', type: 'success' });
            },
            onError: () => {
                setToast({ message: 'Error al regenerar el PIN', type: 'error' });
            }
        });
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopied((prev) => ({ ...prev, [type]: true }));
        setTimeout(() => {
            setCopied((prev) => ({ ...prev, [type]: false }));
        }, 2000);
    };

    const goToPage = (url) => {
        if (!url) return;
        router.get(url, {}, { preserveScroll: true, preserveState: false });
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

    return (
        <>
            <Head title="Estudiantes" />

            <AppSidebar currentRoute="admin.students" />

            {/* Toast */}
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                    duration={4000}
                />
            )}

            <main className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-20" : "lg:ml-72"} min-h-screen bg-gray-50`}>
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Breadcrumb */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Link href={route("dashboard")} className="hover:text-purple-600 transition-colors">Panel de Control</Link>
                                <span>/</span>
                                <Link href={route("admin.dashboard")} className="hover:text-purple-600 transition-colors">Administración</Link>
                                <span>/</span>
                                <span style={{ color: "#540D6E" }} className="font-medium">Estudiantes</span>
                            </div>
                        </div>

                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-4 rounded-xl shadow-sm border" style={{ backgroundColor: "white", borderColor: "#540D6E" }}>
                                        <GraduationCap className="w-10 h-10" style={{ color: "#540D6E" }} />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Estudiantes</h1>
                                        <p className="text-gray-600 text-base">Administración de estudiantes y gestión de credenciales</p>
                                    </div>
                                </div>
                                <Link href={route("admin.users.create", { role: "student" })}
                                    className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                                    style={{ backgroundColor: "#540D6E" }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}>
                                    <UserPlus className="w-5 h-5" /> Registrar Estudiante
                                </Link>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                            {[
                                { 
                                    icon: UsersRound, 
                                    bg: "#F3E8FF", 
                                    color: "#540D6E", 
                                    label: "Total Estudiantes", 
                                    desc: "Registrados en el sistema", 
                                    value: stats?.total ?? usersData.length 
                                },
                                { 
                                    icon: CheckCircle, 
                                    bg: "#E8F5F0", 
                                    color: "#0EAD69", 
                                    label: "Estudiantes Activos", 
                                    desc: "Con acceso habilitado", 
                                    value: stats?.active ?? usersData.filter(isUserActive).length 
                                },
                                { 
                                    icon: BookOpen, 
                                    bg: "#F3E8FF", 
                                    color: "#540D6E", 
                                    label: "Promedio por Grupo", 
                                    desc: "Distribución académica", 
                                    value: stats?.avg_per_group ?? 0 
                                }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="p-3 rounded-lg" style={{ backgroundColor: stat.bg }}>
                                                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{stat.label}</p>
                                                <p className="text-sm text-gray-600 mt-0.5">{stat.desc}</p>
                                            </div>
                                        </div>
                                        <p className="text-4xl font-black" style={{ color: stat.color }}>{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Filtros */}
                        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Buscar por nombre o usuario..." 
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
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
                                        value={filterStatus}
                                        onChange={e => setFilterStatus(e.target.value)}
                                        className="px-4 pr-10 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-offset-2 outline-none transition-all hover:border-gray-300 appearance-none"
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
                                    <button onClick={clearFilters} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all">
                                        <RotateCcw className="w-4 h-4" /> Limpiar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Tabla de estudiantes */}
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                            {filteredUsers.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                    <div className="flex items-center gap-2"><User className="w-4 h-4" /> Estudiante</div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                    <div className="flex items-center gap-2"><User className="w-4 h-4" /> Usuario</div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                    <div className="flex items-center gap-2"><Shield className="w-4 h-4" /> PIN</div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Estado</div>
                                                </th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wide">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredUsers.map(u => {
                                                const active = isUserActive(u);
                                                return (
                                                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-3">
                                                                <StudentAvatar student={u} />
                                                                <p className="text-sm font-semibold text-gray-900">{u.name}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                                <User className="w-4 h-4 text-gray-400" />
                                                                <span className="font-mono text-sm">{u.username}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <button
                                                                onClick={() => handleRegeneratePin(u.id, u.name)}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                                                                style={{ backgroundColor: "#540D6E", color: "#FFFFFF" }}
                                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}>
                                                                <RotateCcw className="w-3 h-3" /> Regenerar PIN
                                                            </button>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border w-auto"
                                                                style={active ? { backgroundColor: "#E8F5F0", borderColor: "#3BCEAC" } : { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }}>
                                                                <div className={`w-2 h-2 rounded-full ${active ? "animate-pulse" : ""}`}
                                                                    style={{ backgroundColor: active ? "#0EAD69" : "#9CA3AF" }} />
                                                                <span className="text-xs font-medium" style={{ color: active ? "#0EAD69" : "#6B7280" }}>
                                                                    {active ? "Activo" : "Inactivo"}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button 
                                                                    onClick={() => active ? handleDeactivateClick(u) : handleActivateClick(u)}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-sm hover:shadow-md"
                                                                    style={{ backgroundColor: active ? "#6B7280" : "#0EAD69" }}
                                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = active ? "#4B5563" : "#059669"}
                                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = active ? "#6B7280" : "#0EAD69"}>
                                                                    {active ? <><EyeOff className="w-4 h-4" /> Desactivar</> : <><Power className="w-4 h-4" /> Activar</>}
                                                                </button>
                                                                <Link href={route("admin.users.edit", u.id)}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 transition-all shadow-sm hover:shadow-md"
                                                                    style={{ backgroundColor: "#FFD23F" }}
                                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#F5C000"}
                                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#FFD23F"}>
                                                                    <Edit2 className="w-4 h-4" /> Editar
                                                                </Link>
                                                                <button onClick={() => handleDeleteClick(u)}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-sm hover:shadow-md"
                                                                    style={{ backgroundColor: "#EE4266" }}
                                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#DC2F55"}
                                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#EE4266"}>
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
                            ) : (
                                <div className="text-center py-16 px-6">
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-sm"
                                        style={{ background: "linear-gradient(to bottom right, #540D6E, #EE4266)" }}>
                                        <GraduationCap className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {searchTerm ? "No se encontraron estudiantes" : "No hay estudiantes registrados"}
                                    </h3>
                                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                        {searchTerm ? "Intente modificar los criterios de búsqueda" : "Registre el primer estudiante para comenzar"}
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Link href={route("admin.users.create", { role: "student" })}
                                            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                                            style={{ backgroundColor: "#540D6E" }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}>
                                            <UserPlus className="w-5 h-5" /> Registrar Estudiante
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
                                        {" "}estudiantes
                                    </p>

                                    <div className="flex items-center gap-1 order-1 sm:order-2">
                                        <button
                                            onClick={() => goToPage(links[0]?.url)}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                            title="Primera página">
                                            <ChevronsLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => goToPage(links[currentPage - 1]?.url ?? null)}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                            title="Página anterior">
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
                                            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                            title="Página siguiente">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => goToPage(links[links.length - 1]?.url)}
                                            disabled={currentPage === lastPage}
                                            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                            title="Última página">
                                            <ChevronsRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal de Eliminación */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: "#FECACA" }}>
                                    <Trash2 className="w-6 h-6" style={{ color: "#EE4266" }} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Confirmar Eliminación</h3>
                            </div>
                            <p className="text-gray-600 text-sm">Esta acción es irreversible y eliminará permanentemente al estudiante</p>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start gap-3 p-4 rounded-lg border mb-4" style={{ backgroundColor: "#FEE2E2", borderColor: "#FECACA" }}>
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#EE4266" }} />
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-gray-900">Estudiante a eliminar:</p>
                                    <div className="flex items-center gap-3">
                                        <StudentAvatar student={userToDelete || {}} />
                                        <div>
                                            <p className="font-bold text-gray-900">{userToDelete?.name || "Estudiante"}</p>
                                            <p className="text-sm text-gray-600">{userToDelete?.username || ""}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {["Se eliminarán todos los datos asociados al estudiante", "El acceso al sistema será revocado inmediatamente"].map((text, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: "#EE4266" }} />
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                            <button onClick={() => setShowDeleteModal(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all">
                                Cancelar
                            </button>
                            <button onClick={handleConfirmDelete}
                                className="px-6 py-2.5 text-sm font-bold text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-sm hover:shadow-md"
                                style={{ backgroundColor: "#EE4266", "--tw-ring-color": "rgba(238, 66, 102, 0.5)" }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#DC2F55"}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#EE4266"}>
                                <span className="flex items-center gap-2"><Trash2 className="w-4 h-4" /> Confirmar Eliminación</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Credenciales */}
            {showCredentialsModal && credentials && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCredentialsModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden">
                        <div className="h-1" style={{ background: "linear-gradient(to right, #540D6E, #EE4266)" }} />
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-xl bg-white shadow-md border border-gray-200">
                                    <GraduationCap className="w-8 h-8" style={{ color: "#540D6E" }} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Credenciales de Acceso</h2>
                                    <p className="text-sm text-gray-600">Guarda estas credenciales para el inicio de sesión del estudiante</p>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Usuario</label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-800">{credentials.username}</span>
                                    </div>
                                    <button onClick={() => copyToClipboard(credentials.username, 'username')}
                                        className="p-3 rounded-lg transition-all border-2 hover:shadow-md"
                                        style={{ borderColor: copied.username ? "#0EAD69" : "#540D6E", backgroundColor: copied.username ? "#E8F5F0" : "white" }}>
                                        {copied.username ? <Check className="w-5 h-5" style={{ color: "#0EAD69" }} /> : <Copy className="w-5 h-5" style={{ color: "#540D6E" }} />}
                                    </button>
                                </div>
                                {copied.username && <p className="text-xs text-green-600 mt-1">✓ Usuario copiado</p>}
                            </div>
                            <div className="mb-6">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">PIN de Acceso</label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-800 text-lg tracking-wider font-bold">{credentials.pin}</span>
                                    </div>
                                    <button onClick={() => copyToClipboard(credentials.pin, 'pin')}
                                        className="p-3 rounded-lg transition-all border-2 hover:shadow-md"
                                        style={{ borderColor: copied.pin ? "#0EAD69" : "#540D6E", backgroundColor: copied.pin ? "#E8F5F0" : "white" }}>
                                        {copied.pin ? <Check className="w-5 h-5" style={{ color: "#0EAD69" }} /> : <Copy className="w-5 h-5" style={{ color: "#540D6E" }} />}
                                    </button>
                                </div>
                                {copied.pin && <p className="text-xs text-green-600 mt-1">✓ PIN copiado</p>}
                            </div>
                            <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: "#F3E8FF", borderLeft: "4px solid #540D6E" }}>
                                <p className="text-xs text-gray-700 flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#540D6E" }} />
                                    <span>Estas credenciales son únicas, asegúrate de compartirlas de forma segura con el estudiante.</span>
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

            {/* Modal de Activación */}
            {showActivateModal && userToActivate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowActivateModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden">
                        <div className="h-1" style={{ background: "linear-gradient(to right, #0EAD69, #3BCEAC)" }} />
                        <div className="p-6">
                            <button onClick={() => setShowActivateModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: "#E8F5F0" }}>
                                    <Power className="w-6 h-6" style={{ color: "#0EAD69" }} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Activar Estudiante</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                ¿Estás seguro de activar a <span className="font-semibold text-gray-900">{userToActivate.name}</span>?
                            </p>
                            <div className="p-4 rounded-lg mb-6 flex gap-3" style={{ backgroundColor: "#E8F5F0", borderLeft: "4px solid #0EAD69" }}>
                                <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#0EAD69" }} />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 mb-1">¿Qué sucederá?</p>
                                    <p className="text-xs text-gray-600">El estudiante podrá acceder al sistema con sus credenciales.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowActivateModal(false)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                                    Cancelar
                                </button>
                                <button onClick={confirmActivateUser} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-md" style={{ backgroundColor: "#0EAD69" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#059669"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#0EAD69"}>
                                    Activar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Desactivación */}
            {showDeactivateModal && userToDeactivate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeactivateModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden">
                        <div className="h-1" style={{ background: "linear-gradient(to right, #EE4266, #DC2F55)" }} />
                        <div className="p-6">
                            <button onClick={() => setShowDeactivateModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: "#FEE2E2" }}>
                                    <EyeOff className="w-6 h-6" style={{ color: "#EE4266" }} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Desactivar Estudiante</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                ¿Estás seguro de desactivar a <span className="font-semibold text-gray-900">{userToDeactivate.name}</span>?
                            </p>
                            <div className="p-4 rounded-lg mb-6 flex gap-3" style={{ backgroundColor: "#FEE2E2", borderLeft: "4px solid #EE4266" }}>
                                <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#EE4266" }} />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 mb-1">¿Qué sucederá?</p>
                                    <p className="text-xs text-gray-600">El estudiante perderá acceso al sistema inmediatamente.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowDeactivateModal(false)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                                    Cancelar
                                </button>
                                <button onClick={confirmDeactivateUser} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-md" style={{ backgroundColor: "#EE4266" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#DC2F55"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#EE4266"}>
                                    Desactivar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Confirmar Regenerar PIN */}
            {showPinModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPinModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden">
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
                                ¿Estás seguro de regenerar el PIN de acceso para <span className="font-semibold text-gray-900">{pinUserName}</span>?
                            </p>
                            <div className="p-3 rounded-lg mb-6 flex gap-2" style={{ backgroundColor: '#FEF2F2', borderLeft: '4px solid #EE4266' }}>
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EE4266' }} />
                                <p className="text-xs text-gray-700">El PIN anterior dejará de funcionar inmediatamente. El estudiante deberá usar el nuevo PIN para ingresar.</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowPinModal(false)}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                                    Cancelar
                                </button>
                                <button onClick={confirmRegeneratePin}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-md"
                                    style={{ backgroundColor: '#540D6E' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#6B1689'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#540D6E'}>
                                    Regenerar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slide-down {
                    animation: slideDown 0.3s ease-out;
                }
            `}</style>
        </>
    );
}