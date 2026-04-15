// Resources/js/Pages/Admin/Staff.jsx
import { Head, Link, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AppSidebar, { useSidebarState } from '@/Components/AppSidebar';
import {
    UserPlus, Edit2, Trash2, Mail, User, Shield, Users, Search, Filter, X,
    RotateCcw, AlertCircle, CheckCircle, EyeOff, Power, GraduationCap, BookOpen,
    LayoutDashboard, Settings, LogOut, Menu, ChevronLeft, ChevronRight, Home,
    Calendar, ClipboardList, BarChart3, HelpCircle, ChevronDown, Eye, Copy, Check,
    UsersRound, ChevronsLeft, ChevronsRight, Briefcase, UserCog
} from "lucide-react";

export default function Staff({ users = [], section = "staff" }) {

    const { props } = usePage();
    const flash = props.flash || {};
    const { auth } = usePage().props;
    const user = auth?.user ?? { name: "Usuario" };

    const [collapsed] = useSidebarState();

    const stats = props.stats || {};

    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const [showActivateModal, setShowActivateModal] = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [userToActivate, setUserToActivate] = useState(null);
    const [userToDeactivate, setUserToDeactivate] = useState(null);

    const [showUniqueAdminWarning, setShowUniqueAdminWarning] = useState(false);
    const [uniqueAdminName, setUniqueAdminName] = useState('');
    const [warningAction, setWarningAction] = useState('');

    useEffect(() => {
        if (flash?.unique_admin_error) {
            setUniqueAdminName(flash.unique_admin_name);
            setWarningAction(flash.unique_admin_action);
            setShowUniqueAdminWarning(true);
        }
    }, [flash]);

    const normalize = (value) => (value ?? "").toLowerCase();

    const usersData = users?.data ?? [];

    const currentPage = users?.current_page ?? 1;
    const lastPage = users?.last_page ?? 1;
    const from = users?.from ?? 0;
    const to = users?.to ?? 0;
    const total = users?.total ?? 0;
    const links = users?.links ?? [];

    const roles = [...new Set(usersData.map(u => u.role?.slug))].filter(Boolean);

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
        router.patch(
            route("admin.users.toggleStatus", userToActivate.id),
            {},
            { preserveScroll: true, preserveState: true }
        );
        setShowActivateModal(false);
        setUserToActivate(null);
    };

    const confirmDeactivateUser = () => {
        router.patch(
            route("admin.users.toggleStatus", userToDeactivate.id),
            {},
            { preserveScroll: true, preserveState: true }
        );
        setShowDeactivateModal(false);
        setUserToDeactivate(null);
    };

    const roleLabels = {
        admin: "Administrador",
        teacher: "Docente",
    };

    const getRoleLabel = (slug) => roleLabels[slug] ?? slug;

    const getRoleIcon = (slug) => {
        if (slug === 'admin') return UserCog;
        if (slug === 'teacher') return Briefcase;
        return Shield;
    };

    const filteredUsers = usersData.filter((u) => {
        const matchesSearch =
            normalize(u.name).includes(searchTerm.toLowerCase()) ||
            normalize(u.email).includes(searchTerm.toLowerCase());

        const matchesRole =
            filterRole === "all" || u.role?.slug === filterRole;

        const matchesStatus =
            filterStatus === "all" ||
            (filterStatus === "active" && isUserActive(u)) ||
            (filterStatus === "inactive" && !isUserActive(u));

        return matchesSearch && matchesRole && matchesStatus;
    });

    const hasActiveFilters = searchTerm || filterRole !== "all" || filterStatus !== "all";

    const clearFilters = () => {
        setSearchTerm("");
        setFilterRole("all");
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
            }
        });
    };

    const goToPage = (url) => {
        if (!url) return;
        router.get(url, { section }, { preserveScroll: true, preserveState: false });
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
            <Head title="Personal" />

            <AppSidebar currentRoute="admin.staff" />

            <main className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-20" : "lg:ml-72"} min-h-screen bg-gray-50`}>
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Link href={route("dashboard")} className="hover:text-purple-600 transition-colors">Panel de Control</Link>
                            <span>/</span>
                            <Link href={route("admin.dashboard")} className="hover:text-purple-600 transition-colors">Administración</Link>
                            <span>/</span>
                            <span style={{ color: "#540D6E" }} className="font-medium">Personal</span>
                        </div>
                    </div>

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
                                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Personal</h1>
                                        <p className="text-gray-600 text-base">Administración de administradores y docentes</p>
                                    </div>
                                </div>
                                <Link href={route("admin.users.create")}
                                    className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                                    style={{ backgroundColor: "#540D6E" }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}>
                                    <UserPlus className="w-5 h-5" /> Registrar Personal
                                </Link>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
                            {[
                                { 
                                    icon: UsersRound, 
                                    bg: "#F3E8FF", 
                                    color: "#540D6E", 
                                    label: "Total Personal", 
                                    value: stats.total || total || usersData.length 
                                },
                                { 
                                    icon: CheckCircle, 
                                    bg: "#E8F5F0", 
                                    color: "#0EAD69", 
                                    label: "Personal Activo", 
                                    value: stats.active || usersData.filter(isUserActive).length 
                                },
                                { 
                                    icon: UserCog, 
                                    bg: "#FEF3C7", 
                                    color: "#F5C000", 
                                    label: "Administradores", 
                                    value: stats.admins || usersData.filter(u => u.role?.slug === 'admin').length 
                                },
                                {
                                    icon: Briefcase,
                                    bg: "#F3E8FF",
                                    color: "#540D6E",
                                    label: "Docentes",
                                    value: stats.teachers || usersData.filter(u => u.role?.slug === 'teacher').length
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
                                        {roles.map((role) => (<option key={role} value={role}>{getRoleLabel(role)}</option>))}
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
                                                        Rol: {getRoleLabel(filterRole)}
                                                        <button onClick={() => setFilterRole("all")} className="hover:bg-white/50 p-0.5 rounded">
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

                        {/* Tabla de personal */}
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                            {filteredUsers.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                {[
                                                    { icon: User, label: "Personal Administrativo" },
                                                    { icon: Mail, label: "Correo Electrónico" },
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
                                                const active = isUserActive(u);
                                                const RoleIcon = getRoleIcon(u.role?.slug);
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
                                                                <span className="font-medium">{u.email}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm"
                                                                style={{ backgroundColor: u.role?.slug === 'admin' ? "#540D6E" : "#540D6E" }}>
                                                                <RoleIcon className="w-3.5 h-3.5" /> {u.role?.name}
                                                            </span>
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
                                                                <button onClick={() => active ? handleDeactivateClick(u) : handleActivateClick(u)}
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
                                        <Users className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {searchTerm || filterRole !== "all" ? "No se encontraron usuarios" : "No hay personal registrado"}
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
                                            <UserPlus className="w-5 h-5" /> Registrar Personal
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
                                        {" "}usuarios
                                    </p>

                                    <div className="flex items-center gap-1 order-1 sm:order-2">
                                        <button
                                            onClick={() => goToPage(links[0]?.url)}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                            <ChevronsLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => goToPage(links[currentPage - 1]?.url ?? null)}
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
                                        <button
                                            onClick={() => goToPage(links[links.length - 1]?.url)}
                                            disabled={currentPage === lastPage}
                                            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                            <ChevronsRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modales (similares a Dashboard pero sin el modal de credenciales) */}
            {/* Modal de Eliminación */}
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
                                <div key={i} className="flex items-start gap-2 text-sm text-gray-600 mb-1">
                                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: "#EE4266" }} />
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                            <button onClick={() => setShowDeleteModal(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                                Cancelar
                            </button>
                            <button onClick={handleConfirmDelete}
                                className="px-6 py-2.5 text-sm font-bold text-white rounded-lg transition-all shadow-sm hover:shadow-md"
                                style={{ backgroundColor: "#EE4266" }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#DC2F55"}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#EE4266"}>
                                <span className="flex items-center gap-2"><Trash2 className="w-4 h-4" /> Confirmar Eliminación</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Activación */}
            {showActivateModal && userToActivate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowActivateModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full animate-slide-up overflow-hidden">
                        <div className="h-1" style={{ background: "linear-gradient(to right, #0EAD69, #3BCEAC)" }} />
                        <div className="p-6">
                            <button onClick={() => setShowActivateModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: "#E8F5F0" }}>
                                    <Power className="w-6 h-6" style={{ color: "#0EAD69" }} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Activar Personal</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                ¿Estás seguro de activar a <span className="font-semibold text-gray-900">{userToActivate.name}</span>?
                            </p>
                            <div className="p-4 rounded-lg mb-6 flex gap-3" style={{ backgroundColor: "#E8F5F0", borderLeft: "4px solid #0EAD69" }}>
                                <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#0EAD69" }} />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 mb-1">¿Qué sucederá?</p>
                                    <p className="text-xs text-gray-600">El usuario podrá acceder al sistema y gestionar sus funciones asignadas.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowActivateModal(false)}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                                    Cancelar
                                </button>
                                <button onClick={confirmActivateUser}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-md"
                                    style={{ backgroundColor: "#0EAD69" }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#059669"}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#0EAD69"}>
                                    Activar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Desactivación */}
            {showDeactivateModal && userToDeactivate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeactivateModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full animate-slide-up overflow-hidden">
                        <div className="h-1" style={{ background: "linear-gradient(to right, #EE4266, #DC2F55)" }} />
                        <div className="p-6">
                            <button onClick={() => setShowDeactivateModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: "#FEE2E2" }}>
                                    <EyeOff className="w-6 h-6" style={{ color: "#EE4266" }} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Desactivar Personal</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                ¿Estás seguro de desactivar a <span className="font-semibold text-gray-900">{userToDeactivate.name}</span>?
                            </p>
                            <div className="p-4 rounded-lg mb-6 flex gap-3" style={{ backgroundColor: "#FEE2E2", borderLeft: "4px solid #EE4266" }}>
                                <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#EE4266" }} />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 mb-1">¿Qué sucederá?</p>
                                    <p className="text-xs text-gray-600">El usuario perderá acceso al sistema inmediatamente.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowDeactivateModal(false)}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                                    Cancelar
                                </button>
                                <button onClick={confirmDeactivateUser}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-md"
                                    style={{ backgroundColor: "#EE4266" }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#DC2F55"}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#EE4266"}>
                                    Desactivar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Advertencia - Único Administrador */}
            {showUniqueAdminWarning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowUniqueAdminWarning(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertCircle className="w-6 h-6 text-red-500" />
                                <h3 className="text-xl font-bold text-gray-900">Acción no permitida</h3>
                            </div>
                            <p className="text-gray-700">
                                No se puede {warningAction} a <span className="font-semibold">{uniqueAdminName}</span>. Es el único administrador activo.
                            </p>
                            <button onClick={() => setShowUniqueAdminWarning(false)} className="mt-4 w-full py-2 text-white rounded-lg" style={{ backgroundColor: "#540D6E" }}>
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}