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

    const roles = [...new Set(users.map(u => u.role))];
    const filteredUsers = users.filter(u => 
        (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         u.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterRole === "all" || u.role === filterRole)
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
        principal: [{ name: "Usuarios", href: route("admin.dashboard", { section: "users" }), icon: Users, current: section === "users" }],
        academic: [
            { name: "Cursos", href: route("admin.dashboard", { section: "courses" }), icon: BookOpen, current: section === "courses" },
            { name: "Calendario", href: route("admin.dashboard", { section: "calendar" }), icon: Calendar, current: section === "calendar" },
            { name: "Evaluaciones", href: route("admin.dashboard", { section: "evaluations" }), icon: ClipboardList, current: section === "evaluations" },
            { name: "Reportes", href: route("admin.dashboard", { section: "reports" }), icon: BarChart3, current: section === "reports" }
        ]
    };

    const bottomNavigation = [
        { name: "Configuración", href: "#", icon: Settings, current: false },
        { name: "Ayuda", href: "#", icon: HelpCircle, current: false }
    ];

    return (
        <>
            <Head title="Usuarios" />

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