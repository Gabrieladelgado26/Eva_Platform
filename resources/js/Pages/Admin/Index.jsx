import { Head, Link, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    UserPlus, Edit2, Trash2, Mail, User, Shield, Users, Search, Filter, X,
    RotateCcw, AlertCircle, CheckCircle, EyeOff, Power, GraduationCap, BookOpen,
    LayoutDashboard, Settings, LogOut, Menu, ChevronLeft, ChevronRight, Home,
    Calendar, ClipboardList, BarChart3, HelpCircle, ChevronDown, Eye, Copy, Check
} from "lucide-react";

export default function Index({ users = [], section = "users" }) {
    const { props } = usePage();
    const user = props.auth.user;
    const flash = usePage().props.flash || {};

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showCredentialsModal, setShowCredentialsModal] = useState(false);
    const [credentials, setCredentials] = useState(null);
    const [copied, setCopied] = useState({ username: false, pin: false });

    useEffect(() => {
        if (flash?.credentials) {
            setCredentials(flash.credentials);
            setShowCredentialsModal(true);
        }
    }, [flash?.credentials]);

    const roles = [...new Set(users.map(u => u.role?.slug))].filter(Boolean);
    const normalize = (value) => (value ?? "").toLowerCase();

    const filteredUsers = users.filter(u =>
        (
            normalize(u.name).includes(searchTerm.toLowerCase()) ||
            normalize(u.email).includes(searchTerm.toLowerCase()) ||
            normalize(u.username).includes(searchTerm.toLowerCase())
        ) &&
        (filterRole === "all" || u.role?.slug === filterRole)
    );

    const clearFilters = () => { setSearchTerm(""); setFilterRole("all"); };
    const hasActiveFilters = searchTerm || filterRole !== "all";

    const handleDeleteClick = (user) => { setUserToDelete(user); setShowDeleteModal(true); };
    
    const handleConfirmDelete = () => {
        router.delete(route("admin.users.destroy", userToDelete.id), {
            preserveScroll: true,
            onSuccess: () => { setShowDeleteModal(false); setUserToDelete(null); }
        });
    };

    const toggleUserStatus = (user) => {
        if (!confirm(`¿Está seguro de ${isUserActive(user) ? "desactivar" : "activar"} a ${user.name}?`)) return;
        router.patch(route("admin.users.toggleStatus", user.id), {}, { preserveScroll: true, preserveState: true });
    };

    const isUserActive = (user) => {
        if (typeof user.is_active === "boolean") return user.is_active;
        if (typeof user.is_active === "number") return user.is_active === 1;
        return user.is_active === "1" || user.is_active === "true";
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopied({ ...copied, [type]: true });
        setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
    };

    const navigation = {
        principal: [{ name: "Usuarios", href: route("admin.index", { section: "users" }), icon: Users, current: section === "users" }],
        academic: [
            { name: "Cursos", href: route("admin.index", { section: "courses" }), icon: BookOpen, current: section === "courses" },
            { name: "Calendario", href: route("admin.index", { section: "calendar" }), icon: Calendar, current: section === "calendar" },
            { name: "Evaluaciones", href: route("admin.index", { section: "evaluations" }), icon: ClipboardList, current: section === "evaluations" },
            { name: "Reportes", href: route("admin.index", { section: "reports" }), icon: BarChart3, current: section === "reports" }
        ]
    };

    const bottomNavigation = [
        { name: "Configuración", href: "#", icon: Settings, current: false },
        { name: "Ayuda", href: "#", icon: HelpCircle, current: false }
    ];

    return (
        <>
            <Head title="Usuarios" />

            {section === "users" && (
                <main className={`transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:ml-72" : "lg:ml-20"} min-h-screen`}>
                    <div className="py-8 px-4 sm:px-6 lg:px-8">
                        {/* Breadcrumb */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Link href={route("dashboard")} className="hover:text-purple-600 transition-colors">Gestión de Usuarios</Link>
                                <span>/</span>
                                <span style={{ color: "#540D6E" }} className="font-medium">Usuarios</span>
                            </div>
                        </div>

                        {/* Mensaje Flash */}
                        {flash?.message && (
                            <div className="max-w-7xl mx-auto mb-6">
                                <div className="p-4 rounded-lg border border-red-300 bg-red-50 text-red-700 font-semibold shadow-sm">
                                    {flash.message}
                                </div>
                            </div>
                        )}

                        <div className="max-w-7xl mx-auto">
                            {/* Header */}
                            <div className="mb-8 animate-fade-in">
                                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-4 rounded-xl shadow-sm border" style={{ backgroundColor: "white", borderColor: "#540D6E" }}>
                                            <Users className="w-10 h-10" style={{ color: "#540D6E" }} />
                                        </div>
                                        <div>
                                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
                                            <p className="text-gray-600 text-base">Administración y supervisión de usuarios institucionales</p>
                                        </div>
                                    </div>
                                    <Link href={route("admin.users.create")} 
                                        className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                                        style={{ backgroundColor: "#540D6E" }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}>
                                        <UserPlus className="w-5 h-5" /> Registrar Usuario
                                    </Link>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                                {[
                                    { icon: Users, bg: "#F3E8FF", color: "#540D6E", label: "Total Usuarios", desc: "Registrados en el sistema", value: users.length },
                                    { icon: CheckCircle, bg: "#E8F5F0", color: "#0EAD69", label: "Usuarios Activos", desc: "Con acceso habilitado", value: users.filter(isUserActive).length },
                                    { icon: Shield, bg: "#F3E8FF", color: "#540D6E", label: "Roles Asignados", desc: "Perfiles diferentes", value: new Set(users.map(u => u.role)).size }
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
                                        <input type="text" placeholder="Buscar por nombre o correo..." value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            className="w-full pl-12 pr-10 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all hover:border-gray-300"
                                            style={{ "--tw-ring-color": "rgba(84, 13, 110, 0.2)" }}
                                            onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                            onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                                        {searchTerm && (
                                            <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
                                            className="px-4 pr-10 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-offset-2 outline-none transition-all hover:border-gray-300 appearance-none"
                                            style={{ "--tw-ring-color": "rgba(84, 13, 110, 0.2)" }}
                                            onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                            onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}>
                                            <option value="all">Todos los roles</option>
                                            {roles.map(role => <option key={role} value={role}>{role}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        </div>
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
                                                    {filterRole !== "all" && (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-medium"
                                                            style={{ backgroundColor: "#F3E8FF", borderColor: "#540D6E", color: "#540D6E" }}>
                                                            Rol: {filterRole}
                                                            <button onClick={() => setFilterRole("all")} className="hover:bg-white/50 p-0.5 rounded">
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

                            {/* Tabla de usuarios */}
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                                {filteredUsers.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    {[
                                                        { icon: User, label: "Usuario" },
                                                        { icon: Mail, label: "Correo / Username" },
                                                        { icon: Shield, label: "Rol" },
                                                        { icon: CheckCircle, label: "Estado" }
                                                    ].map((col, i) => (
                                                        <th key={i} className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                            <div className="flex items-center gap-2">
                                                                <col.icon className="w-4 h-4" /> {col.label}
                                                            </div>
                                                        </th>
                                                    ))}
                                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wide">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {filteredUsers.map(u => {
                                                    <pre>{JSON.stringify(u, null, 2)}</pre>
                                                    const active = isUserActive(u);
                                                    return (
                                                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                                                                        style={{ background: "linear-gradient(to bottom right, #540D6E, #EE4266)" }}>
                                                                        {u.name.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <p className="text-sm font-semibold text-gray-900">{u.name}</p>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                                    <span className="font-medium">
                                                                        {u.role?.slug === "student" ? u.username : u.email}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm"
                                                                    style={{ backgroundColor: "#540D6E" }}>
                                                                    <Shield className="w-3.5 h-3.5" /> {u.role?.name}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border w-auto`}
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
                                                                    <button onClick={() => toggleUserStatus(u)}
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
                                            <User className="w-10 h-10 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {searchTerm || filterRole !== "all" ? "No se encontraron usuarios" : "No hay usuarios registrados"}
                                        </h3>
                                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                            {searchTerm || filterRole !== "all" ? "Intente modificar los criterios de búsqueda" : "Registre el primer usuario para comenzar"}
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                            <Link href={route("admin.users.create")}
                                                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                                                style={{ backgroundColor: "#540D6E" }}
                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}>
                                                <UserPlus className="w-5 h-5" /> Registrar Usuario
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

                            {/* Info adicional */}
                            {users.length > 0 && (
                                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <span>Mostrando <span className="font-bold" style={{ color: "#540D6E" }}>{filteredUsers.length}</span> de <span className="font-bold text-gray-900">{users.length}</span> usuarios</span>
                                            <span className="mx-2">•</span>
                                            <span className="font-bold" style={{ color: "#0EAD69" }}>{users.filter(isUserActive).length}</span> activos
                                        </div>
                                        <div className="text-gray-500">
                                            Actualizado: {new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            )}

            {/* Modal de Confirmación Eliminación */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full animate-slide-up">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: "#FECACA" }}>
                                    <Trash2 className="w-6 h-6" style={{ color: "#EE4266" }} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Confirmar Eliminación</h3>
                            </div>
                            <p className="text-gray-600 text-sm">Esta acción es irreversible y eliminará permanentemente al usuario</p>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start gap-3 p-4 rounded-lg border mb-4" style={{ backgroundColor: "#FEE2E2", borderColor: "#FECACA" }}>
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#EE4266" }} />
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-gray-900">Usuario a eliminar:</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                                            style={{ background: "linear-gradient(to bottom right, #540D6E, #EE4266)" }}>
                                            {userToDelete?.name?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{userToDelete?.name || "Usuario"}</p>
                                            <p className="text-sm text-gray-600">{userToDelete?.email || ""}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {["Se eliminarán todos los datos asociados al usuario", "El acceso al sistema será revocado inmediatamente"].map((text, i) => (
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCredentialsModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full animate-slide-up overflow-hidden">
                        {/* Barra superior delgada como la de la página principal - con los colores originales */}
                        <div className="h-1" style={{ background: "linear-gradient(to right, #540D6E, #EE4266)" }} />
                        
                        <div className="p-6">
                            {/* Header con icono al lado del título - icono más grande */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-xl bg-white shadow-md border border-gray-200">
                                    <GraduationCap className="w-8 h-8" style={{ color: "#540D6E" }} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Credenciales de Acceso</h2>
                                    <p className="text-sm text-gray-600">Guarda estas credenciales para el inicio de sesión del estudiante</p>
                                </div>
                            </div>

                            {/* Usuario */}
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
                                {copied.username && <p className="text-xs text-green-600 mt-1 animate-fade-in">✓ Usuario copiado</p>}
                            </div>

                            {/* PIN */}
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
                                {copied.pin && <p className="text-xs text-green-600 mt-1 animate-fade-in">✓ PIN copiado</p>}
                            </div>

                            {/* Nota de seguridad */}
                            <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: "#F3E8FF", borderLeft: "4px solid #540D6E" }}>
                                <p className="text-xs text-gray-700 flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#540D6E" }} />
                                    <span>Estas credenciales son únicas, asegúrate de compartirlas de forma segura con el estudiante.</span>
                                </p>
                            </div>

                            {/* Botón */}
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

            {/* Fondo académico */}
            <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-50">
                <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(84, 13, 110, 0.08) 1px, transparent 0)`, backgroundSize: "40px 40px" }} />
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: "linear-gradient(to right, #540D6E, #EE4266, #FFD23F, #3BCEAC, #0EAD69)" }} />
            </div>

            {/* Mobile sidebar backdrop */}
            {mobileSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />}

            {/* Mobile menu button */}
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden fixed bottom-4 right-4 z-30 p-3 rounded-full shadow-lg text-white" style={{ backgroundColor: "#540D6E" }}>
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
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:block p-1.5 rounded-lg hover:bg-gray-100">
                            {sidebarOpen ? <ChevronLeft className="w-4 h-4 text-gray-600" /> : <ChevronRight className="w-4 h-4 text-gray-600" />}
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-4 px-2">
                        {Object.entries(navigation).map(([key, items]) => (
                            <div key={key} className="mb-4">
                                {sidebarOpen && <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">{key === 'principal' ? 'Gestión de Usuarios' : 'Académico'}</p>}
                                <ul className="space-y-1">
                                    {items.map(item => {
                                        const Icon = item.icon;
                                        return (
                                            <li key={item.name}>
                                                <Link href={item.href}
                                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${item.current ? "text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"}`}
                                                    style={item.current ? { backgroundColor: "#540D6E" } : {}}>
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
                            {bottomNavigation.map(item => {
                                const Icon = item.icon;
                                return (
                                    <li key={item.name}>
                                        <Link href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-all group">
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
                            <li>
                                <Link href={route("logout")} method="post" as="button"
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all group">
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
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fadeIn 0.6s ease-out; }
                .animate-slide-up { animation: slideUp 0.6s ease-out; }
            `}</style>
        </>
    );
}