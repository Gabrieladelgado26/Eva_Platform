// Resources/js/Pages/Teacher/Students/Index.jsx
import { Head, Link, usePage, router } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import AppSidebar, { useSidebarState } from '@/Components/AppSidebar';
import {
    User, Search, X, RotateCcw, Eye,
    GraduationCap, CheckCircle, UsersRound, BookOpen,
    ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight,
    UserPlus, Edit2, Power, AlertCircle, Check, Filter,
    EyeOff, KeyRound, Copy, Shield, FileSpreadsheet, Printer
} from "lucide-react";

const escapeCSV = (v) => {
    const s = String(v ?? "");
    return (s.includes(",") || s.includes('"') || s.includes("\n")) ? `"${s.replace(/"/g,'""')}"` : s;
};

// ─── Componente Toast con barra de progreso ───────────────────────────────────
function Toast({ message, type = 'success', onClose, duration = 4000 }) {
    const [progress, setProgress] = useState(100);
    
    useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);
            
            if (remaining <= 0) {
                onClose();
            }
        }, 50);

        return () => clearInterval(interval);
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

// ─── Avatar del estudiante ─────────────────────────────────────────────────────
function StudentAvatar({ student }) {
    if (student.avatar) {
        return (
            <img
                src={`/avatars/${student.avatar}.png`}
                alt={student.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                onError={(e) => {
                    e.currentTarget.style.display = 'none';
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
    return (
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
            style={{ background: "linear-gradient(to bottom right, #540D6E, #EE4266)" }}>
            {student.name?.charAt(0).toUpperCase() ?? 'E'}
        </div>
    );
}

// ─── Modal Activar Estudiante ─────────────────────────────────────────────────
function ActivateModal({ student, onClose, onConfirm }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full animate-slide-up overflow-hidden">
                <div className="h-1" style={{ background: 'linear-gradient(to right, #0EAD69, #3BCEAC)' }} />
                <div className="p-6">
                    <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-lg" style={{ backgroundColor: '#E8F5F0' }}>
                            <Power className="w-6 h-6" style={{ color: '#0EAD69' }} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Activar Estudiante</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                        ¿Estás seguro de activar a <span className="font-semibold text-gray-900">{student.name}</span>?
                    </p>
                    <div className="p-4 rounded-lg mb-6 flex gap-3" style={{ backgroundColor: '#E8F5F0', borderLeft: '4px solid #0EAD69' }}>
                        <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#0EAD69' }} />
                        <div>
                            <p className="text-sm font-medium text-gray-900 mb-1">¿Qué sucederá?</p>
                            <p className="text-xs text-gray-600">El estudiante podrá acceder al sistema y a sus cursos asignados.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                            Cancelar
                        </button>
                        <button onClick={onConfirm} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-md" style={{ backgroundColor: '#0EAD69' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#059669'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0EAD69'}>
                            Activar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Modal Desactivar Estudiante ──────────────────────────────────────────────
function DeactivateModal({ student, onClose, onConfirm }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full animate-slide-up overflow-hidden">
                <div className="h-1" style={{ background: 'linear-gradient(to right, #EE4266, #DC2F55)' }} />
                <div className="p-6">
                    <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-lg" style={{ backgroundColor: '#FEE2E2' }}>
                            <EyeOff className="w-6 h-6" style={{ color: '#EE4266' }} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Desactivar Estudiante</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                        ¿Estás seguro de desactivar a <span className="font-semibold text-gray-900">{student.name}</span>?
                    </p>
                    <div className="p-4 rounded-lg mb-6 flex gap-3" style={{ backgroundColor: '#FEE2E2', borderLeft: '4px solid #EE4266' }}>
                        <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#EE4266' }} />
                        <div>
                            <p className="text-sm font-medium text-gray-900 mb-1">¿Qué sucederá?</p>
                            <p className="text-xs text-gray-600">El estudiante perderá acceso al sistema inmediatamente.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                            Cancelar
                        </button>
                        <button onClick={onConfirm} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-md" style={{ backgroundColor: '#EE4266' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#DC2F55'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#EE4266'}>
                            Desactivar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Modal de Credenciales ────────────────────────────────────────────────────
function CredentialsModal({ credentials, onClose }) {
    const [copied, setCopied] = useState({ username: false, pin: false });

    const copyToClipboard = async (text, field) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(prev => ({ ...prev, [field]: true }));
            setTimeout(() => setCopied(prev => ({ ...prev, [field]: false })), 2000);
        } catch (err) { console.error("Error al copiar:", err); }
    };

    const handleCSV = () => {
        const csv = ["Usuario,PIN", [credentials.username, credentials.pin].map(escapeCSV).join(",")].join("\n");
        const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `credencial_${credentials.username}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
    };

    const handlePDF = () => {
        const date = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"/><title>Credencial</title>
        <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;padding:40px;color:#1e1e2e}
        .bar{height:6px;background:linear-gradient(to right,#540D6E,#EE4266);border-radius:3px;margin-bottom:28px}
        h1{font-size:20px;font-weight:700;color:#540D6E;margin-bottom:4px}.sub{font-size:13px;color:#6B7280;margin-bottom:24px}
        .card{border:1.5px solid #E5E7EB;border-radius:12px;padding:20px;margin-bottom:16px}
        .label{font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px}
        .value{font-family:'Courier New',monospace;font-size:18px;font-weight:700;color:#540D6E;letter-spacing:.06em}
        .note{font-size:12px;color:#6B7280;border-top:1px solid #E5E7EB;padding-top:16px;margin-top:16px}
        .date{font-size:11px;color:#9CA3AF;margin-top:4px}@media print{body{padding:24px}}</style></head><body>
        <div class="bar"></div>
        <h1>Credenciales de Acceso</h1><div class="sub">Sistema de Gestión Académica EVA</div>
        <div class="card"><div class="label">Usuario</div><div class="value">${credentials.username}</div></div>
        <div class="card"><div class="label">PIN de Acceso</div><div class="value">${credentials.pin}</div></div>
        <div class="note">Estas credenciales son únicas e intransferibles. Compártalas de forma segura con el estudiante.
        <div class="date">Generado el ${date}</div></div>
        <script>window.onload=function(){window.print()};<\/script></body></html>`;
        const win = window.open('', '_blank', 'width=700,height=600');
        if (win) { win.document.write(html); win.document.close(); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full animate-slide-up overflow-hidden">
                <div className="h-1.5" style={{ background: "linear-gradient(to right, #540D6E, #EE4266, #FFD23F)" }} />

                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-5">
                        <div className="p-3 rounded-xl shadow-md border border-gray-100 flex-shrink-0" style={{ backgroundColor: "#F3E8FF" }}>
                            <KeyRound className="w-7 h-7" style={{ color: "#540D6E" }} />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900">Credenciales de Acceso</h2>
                            <p className="text-sm text-gray-500 mt-0.5">Guarda estas credenciales para el estudiante</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Usuario */}
                    <div className="mb-4">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Usuario</label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm flex items-center gap-2">
                                <User className="w-4 h-4 flex-shrink-0" style={{ color: "#540D6E" }} />
                                <span className="text-gray-800 font-semibold">{credentials.username}</span>
                            </div>
                            <button onClick={() => copyToClipboard(credentials.username, 'username')}
                                className="p-2.5 rounded-lg transition-all border-2 hover:shadow-md flex-shrink-0"
                                style={{ borderColor: copied.username ? "#0EAD69" : "#540D6E", backgroundColor: copied.username ? "#E8F5F0" : "white" }}>
                                {copied.username ? <Check className="w-4 h-4" style={{ color: "#0EAD69" }} /> : <Copy className="w-4 h-4" style={{ color: "#540D6E" }} />}
                            </button>
                        </div>
                        {copied.username && <p className="text-xs text-green-600 mt-1">✓ Usuario copiado</p>}
                    </div>

                    {/* PIN */}
                    <div className="mb-5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">PIN de Acceso</label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg font-mono flex items-center gap-2">
                                <Shield className="w-4 h-4 flex-shrink-0" style={{ color: "#540D6E" }} />
                                <span className="text-gray-800 text-lg tracking-widest font-bold">{credentials.pin}</span>
                            </div>
                            <button onClick={() => copyToClipboard(credentials.pin, 'pin')}
                                className="p-2.5 rounded-lg transition-all border-2 hover:shadow-md flex-shrink-0"
                                style={{ borderColor: copied.pin ? "#0EAD69" : "#540D6E", backgroundColor: copied.pin ? "#E8F5F0" : "white" }}>
                                {copied.pin ? <Check className="w-4 h-4" style={{ color: "#0EAD69" }} /> : <Copy className="w-4 h-4" style={{ color: "#540D6E" }} />}
                            </button>
                        </div>
                        {copied.pin && <p className="text-xs text-green-600 mt-1">✓ PIN copiado</p>}
                    </div>

                    {/* Aviso */}
                    <div className="flex items-start gap-2.5 p-3.5 rounded-lg mb-5" style={{ backgroundColor: "#F3E8FF", borderLeft: "3px solid #540D6E" }}>
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#540D6E" }} />
                        <p className="text-xs text-gray-700">Estas credenciales son únicas. Compártelas de forma segura con el estudiante.</p>
                    </div>

                    {/* Exportar */}
                    <div className="flex gap-2 mb-3">
                        <button onClick={handleCSV}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold rounded-lg border transition-all hover:shadow-sm"
                            style={{ borderColor: "#540D6E20", backgroundColor: "#F3E8FF", color: "#540D6E" }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#EDD9FF"}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#F3E8FF"}>
                            <FileSpreadsheet className="w-4 h-4" /> CSV
                        </button>
                        <button onClick={handlePDF}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold rounded-lg border transition-all hover:shadow-sm"
                            style={{ borderColor: "#540D6E20", backgroundColor: "#F3E8FF", color: "#540D6E" }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#EDD9FF"}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#F3E8FF"}>
                            <Printer className="w-4 h-4" /> PDF
                        </button>
                    </div>

                    <button onClick={onClose}
                        className="w-full py-2.5 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                        style={{ backgroundColor: "#540D6E" }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}>
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Students({ students = {}, filters = {}, courses = [] }) {
    const { props } = usePage();
    const flash = props.flash || {};
    const [collapsed] = useSidebarState();
    
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [filterStatus, setFilterStatus] = useState(filters?.status || "all");
    
    const [showActivateModal, setShowActivateModal] = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [studentToToggle, setStudentToToggle] = useState(null);

    const [showCredentialsModal, setShowCredentialsModal] = useState(false);
    const [credentials, setCredentials] = useState(null);
    
    // Toast state
    const [toast, setToast] = useState(null);

    // Debounce timer ref
    const debounceTimer = useRef(null);

    const studentsData = students?.data ?? [];
    const currentPage = students?.current_page ?? 1;
    const lastPage = students?.last_page ?? 1;
    const from = students?.from ?? 0;
    const to = students?.to ?? 0;
    const total = students?.total ?? 0;
    const links = students?.links ?? [];

    const isUserActive = (user) => {
        if (typeof user.is_active === "boolean") return user.is_active;
        if (typeof user.is_active === "number") return user.is_active === 1;
        return user.is_active === "1" || user.is_active === "true";
    };

    // Mostrar toast y modal cuando hay flash messages
    useEffect(() => {
        if (flash?.success) {
            setToast({ message: flash.success, type: 'success' });
        }
        if (flash?.error) {
            setToast({ message: flash.error, type: 'error' });
        }
        if (flash?.credentials) {
            setCredentials(flash.credentials);
            setShowCredentialsModal(true);
        }
    }, [flash]);

    const hasActiveFilters = searchTerm || filterStatus !== "all";

    const clearFilters = () => {
        setSearchTerm("");
        setFilterStatus("all");
        router.get(route('teacher.students.index'), {}, { preserveScroll: true });
    };

    const applyFilters = () => {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (filterStatus !== "all") params.status = filterStatus;
        router.get(route('teacher.students.index'), params, { preserveScroll: true });
    };

    // Aplicar filtros automáticamente con debounce
    const handleSearchChange = (value) => {
        setSearchTerm(value);
        
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        
        debounceTimer.current = setTimeout(() => {
            const params = {};
            if (value) params.search = value;
            if (filterStatus !== "all") params.status = filterStatus;
            router.get(route('teacher.students.index'), params, { preserveScroll: true });
        }, 300);
    };

    const handleStatusChange = (value) => {
        setFilterStatus(value);
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (value !== "all") params.status = value;
        router.get(route('teacher.students.index'), params, { preserveScroll: true });
    };

    const goToPage = (url) => {
        if (!url) return;
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (filterStatus !== "all") params.status = filterStatus;
        router.get(url, params, { preserveScroll: true });
    };

    const handleToggleClick = (student) => {
        setStudentToToggle(student);
        student.is_active ? setShowDeactivateModal(true) : setShowActivateModal(true);
    };

    const confirmToggle = () => {
        router.patch(route('teacher.students.toggleStatus', studentToToggle.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setShowActivateModal(false);
                setShowDeactivateModal(false);
                setStudentToToggle(null);
                setToast({ 
                    message: studentToToggle.is_active ? 'Estudiante desactivado correctamente' : 'Estudiante activado correctamente', 
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

    const activeCount = studentsData.filter(isUserActive).length;
    const inactiveCount = studentsData.length - activeCount;

    return (
        <>
            <Head title="Mis Estudiantes" />
            <AppSidebar currentRoute="teacher.students.index" />

            {/* Toast */}
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                    duration={4000}
                />
            )}

            {/* Modal de Credenciales */}
            {showCredentialsModal && credentials && (
                <CredentialsModal 
                    credentials={credentials} 
                    onClose={() => setShowCredentialsModal(false)} 
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
                                <span style={{ color: "#540D6E" }} className="font-medium">Mis Estudiantes</span>
                            </div>
                        </div>

                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-4 rounded-xl shadow-sm border bg-white" style={{ borderColor: "#540D6E" }}>
                                        <GraduationCap className="w-10 h-10" style={{ color: "#540D6E" }} />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Mis Estudiantes</h1>
                                        <p className="text-gray-600 text-base">Visualiza y gestiona todos tus estudiantes de los cursos</p>
                                    </div>
                                </div>
                                <Link
                                    href={route("teacher.students.create")}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all shadow-sm hover:shadow-md whitespace-nowrap"
                                    style={{ backgroundColor: "#540D6E" }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}
                                >
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
                                    desc: "En tus cursos",
                                    value: total
                                },
                                {
                                    icon: CheckCircle,
                                    bg: "#E8F5F0",
                                    color: "#0EAD69",
                                    label: "Estudiantes Activos",
                                    desc: "Con acceso habilitado",
                                    value: activeCount
                                },
                                {
                                    icon: BookOpen,
                                    bg: "#FEF3C7",
                                    color: "#D97706",
                                    label: "Estudiantes Inactivos",
                                    desc: "Sin acceso actualmente",
                                    value: inactiveCount
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
                                        onChange={e => handleSearchChange(e.target.value)}
                                        className="w-full pl-12 pr-10 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all hover:border-gray-300"
                                        style={{ "--tw-ring-color": "rgba(84, 13, 110, 0.2)" }}
                                        onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                        onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
                                    />
                                    {searchTerm && (
                                        <button onClick={() => handleSearchChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <select
                                        value={filterStatus}
                                        onChange={e => handleStatusChange(e.target.value)}
                                        className="px-4 pr-10 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-offset-2 outline-none transition-all hover:border-gray-300 appearance-none"
                                        style={{ "--tw-ring-color": "rgba(84, 13, 110, 0.2)" }}
                                        onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                        onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
                                    >
                                        <option value="all">Todos los estados</option>
                                        <option value="active">Activos</option>
                                        <option value="inactive">Inactivos</option>
                                    </select>
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
                                                        <button onClick={() => handleSearchChange("")} className="hover:bg-white/50 p-0.5 rounded">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                )}
                                                {filterStatus !== "all" && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-medium"
                                                        style={{ backgroundColor: "#F3E8FF", borderColor: "#540D6E", color: "#540D6E" }}>
                                                        Estado: {filterStatus === "active" ? "Activo" : "Inactivo"}
                                                        <button onClick={() => handleStatusChange("all")} className="hover:bg-white/50 p-0.5 rounded">
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
                            {studentsData.length > 0 ? (
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
                                                    <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Cursos</div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Estado</div>
                                                </th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wide">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {studentsData.map(student => {
                                                const active = isUserActive(student);
                                                return (
                                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-3">
                                                                <StudentAvatar student={student} />
                                                                <p className="text-sm font-semibold text-gray-900">{student.name}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                                <User className="w-4 h-4 text-gray-400" />
                                                                <span className="font-mono text-sm">{student.username}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold"
                                                                style={{ backgroundColor: "#F3E8FF", color: "#540D6E" }}>
                                                                {student.courses_names || `${student.courses_count} ${student.courses_count === 1 ? 'curso' : 'cursos'}`}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border"
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
                                                                    onClick={() => handleToggleClick(student)}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-sm hover:shadow-md"
                                                                    style={{ backgroundColor: active ? "#6B7280" : "#0EAD69" }}
                                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = active ? "#4B5563" : "#059669"}
                                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = active ? "#6B7280" : "#0EAD69"}
                                                                >
                                                                    <Power className="w-4 h-4" />
                                                                    {active ? "Desactivar" : "Activar"}
                                                                </button>
                                                                <Link
                                                                    href={route('teacher.students.edit', student.id)}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 transition-all shadow-sm hover:shadow-md"
                                                                    style={{ backgroundColor: "#FFD23F" }}
                                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#F5C000"}
                                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#FFD23F"}
                                                                >
                                                                    <Edit2 className="w-4 h-4" /> Editar
                                                                </Link>
                                                                <Link
                                                                    href={route("teacher.students.show", student.id)}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-sm hover:shadow-md"
                                                                    style={{ backgroundColor: "#EE4266" }}
                                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#DC2F55"}
                                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#EE4266"}
                                                                >
                                                                    <Eye className="w-4 h-4" /> Ver
                                                                </Link>
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
                                        {hasActiveFilters ? "No se encontraron estudiantes" : "No hay estudiantes registrados"}
                                    </h3>
                                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                        {hasActiveFilters ? "Intente modificar los criterios de búsqueda" : "Registre estudiantes en sus cursos para que aparezcan aquí"}
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Link
                                            href={route('teacher.students.create')}
                                            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                                            style={{ backgroundColor: "#540D6E" }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}
                                        >
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

            {/* Modals */}
            {showActivateModal && studentToToggle && (
                <ActivateModal
                    student={studentToToggle}
                    onClose={() => { setShowActivateModal(false); setStudentToToggle(null); }}
                    onConfirm={confirmToggle}
                />
            )}
            
            {showDeactivateModal && studentToToggle && (
                <DeactivateModal
                    student={studentToToggle}
                    onClose={() => { setShowDeactivateModal(false); setStudentToToggle(null); }}
                    onConfirm={confirmToggle}
                />
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