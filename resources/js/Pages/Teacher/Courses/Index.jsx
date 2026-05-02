import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import {
    BookOpen, GraduationCap, Users, Search, X, UserPlus, UserX,
    Layers, ChevronRight, ChevronLeft, Copy, Check, AlertCircle,
    Loader2, LogOut, Menu, Calendar, BarChart3,
    Shield, User, Home, TrendingUp, ChevronDown,
    Bell, FileText, CheckSquare, Upload, Eye, Edit2, Download,
    PlusCircle, Video, FileSpreadsheet, Printer, ListPlus, 
    Award, Trash2, CheckCircle, Info, Trophy, ExternalLink
} from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import AppSidebar, { useSidebarState } from '@/Components/AppSidebar';

const GRADE_LABELS = {
    primero: "Primero", segundo: "Segundo", tercero: "Tercero",
    cuarto: "Cuarto", quinto: "Quinto"
};

const getInitials = (name) =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

const escapeCSV = (value) => {
    if (typeof value !== "string") return value;
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
};

const getCsrfToken = () => {
    // La cookie XSRF-TOKEN siempre está fresca (Laravel la actualiza en cada respuesta).
    // El meta tag csrf-token puede quedar desactualizado tras navegación SPA con Inertia.
    const xsrf = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='));
    if (xsrf) {
        try { return decodeURIComponent(xsrf.split('=')[1]); }
        catch { return xsrf.split('=')[1]; }
    }
    // Fallback: meta tag
    return document.querySelector('meta[name="csrf-token"]')?.content ?? '';
};

// ─── TOAST NOTIFICATION ───────────────────────────────────────────────────────
function ToastNotification({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-50 border-green-300' : type === 'error' ? 'bg-red-50 border-red-300' : 'bg-blue-50 border-blue-300';
    const textColor = type === 'success' ? 'text-green-800' : type === 'error' ? 'text-red-800' : 'text-blue-800';
    
    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
            <div className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border ${bgColor}`}>
                {type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                {type === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
                {type === 'info' && <Info className="w-4 h-4 text-blue-600" />}
                <span className={`text-sm font-medium ${textColor}`}>{message}</span>
            </div>
        </div>
    );
}

// ─── MODAL CONFIRMACIÓN RETIRAR OVA ───────────────────────────────────────────
function RemoveOvaConfirmModal({ ova, onConfirm, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" style={{ animation: "modalIn 0.2s ease-out" }}>
                <div className="h-1" style={{ background: "linear-gradient(to right, #EE4266, #FFD23F)" }} />
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#FEE2E2" }}>
                            <Trash2 className="w-5 h-5" style={{ color: "#EE4266" }} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Retirar OVA del curso</h3>
                            <p className="text-sm text-slate-500">El recurso dejará de estar disponible para los estudiantes</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl border" style={{ backgroundColor: "#FEE2E210", borderColor: "#EE426630" }}>
                        <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: "#F3E8FF" }}>
                            <Video className="w-5 h-5" style={{ color: "#540D6E" }} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">{ova.tematica}</p>
                            <p className="text-xs text-slate-500">{ova.area}</p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600">¿Confirmas retirar este OVA del curso? Los estudiantes ya no podrán acceder a este recurso.</p>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                            Cancelar
                        </button>
                        <button onClick={onConfirm}
                            className="flex-1 py-2.5 text-sm font-bold text-white rounded-lg transition-all"
                            style={{ backgroundColor: "#EE4266" }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#DC2F55"}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#EE4266"}>
                            Retirar OVA
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── MODAL CREDENCIALES ───────────────────────────────────────────────────────
function CredentialsListModal({ credentials, course, onClose }) {
    const [copied, setCopied] = useState({});
    const [copiedAll, setCopiedAll] = useState(false);
    const [downloadingPdf, setDownloadingPdf] = useState(false);
    const [showDownloadOptions, setShowDownloadOptions] = useState(false);
    const downloadRef = useRef(null);

    const safe = (credentials || []).filter(
        c => c && typeof c === "object" && c.name && c.username && c.pin
    );

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (downloadRef.current && !downloadRef.current.contains(e.target)) {
                setShowDownloadOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const copyOne = (cred, idx) => {
        navigator.clipboard.writeText(`Usuario: ${cred.username}\nPIN: ${cred.pin}`);
        setCopied({ [idx]: true });
        setTimeout(() => setCopied({}), 2000);
    };

    const copyAll = () => {
        const text = safe.map(c => `${c.name}\nUsuario: ${c.username}\nPIN: ${c.pin}`).join("\n---\n");
        navigator.clipboard.writeText(text);
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
    };

    const downloadCSV = () => {
        setShowDownloadOptions(false);
        const rows = [["Nombre", "Usuario", "PIN"], ...safe.map(c => [c.name, c.username, c.pin])];
        const csv = rows.map(r => r.map(escapeCSV).join(",")).join("\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `credenciales_${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
    };

    const downloadPDF = async () => {
        if (downloadingPdf) return;
        setDownloadingPdf(true);
        try {
            const response = await fetch(`/teacher/courses/${course.id}/students/bulk`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": getCsrfToken(),
                    "Accept": "application/pdf",
                },
                body: JSON.stringify({ generate_pdf: "1", students: safe }),
            });
            if (!response.ok) throw new Error(`Error ${response.status}`);
            const blob = await response.blob();
            const url = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
            const a = document.createElement("a");
            a.href = url;
            a.download = "credenciales.pdf";
            document.body.appendChild(a);
            a.click();
            setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
        } catch (err) {
            alert("No se pudo descargar el PDF: " + err.message);
        } finally {
            setDownloadingPdf(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden"
                style={{ animation: "modalIn 0.2s ease-out" }}>
                <div className="h-1" style={{ background: "linear-gradient(to right, #540D6E, #EE4266)" }} />
                <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#F3E8FF" }}>
                            <GraduationCap className="w-5 h-5" style={{ color: "#540D6E" }} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Credenciales generadas</h2>
                            <p className="text-sm text-slate-500">
                                {safe.length} estudiante{safe.length !== 1 ? "s" : ""} registrado{safe.length !== 1 ? "s" : ""} exitosamente
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="px-6 pt-4 pb-2 flex gap-2 justify-end">
                    <button onClick={copyAll} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg transition-all hover:shadow-sm" style={{ backgroundColor: "#F3E8FF", color: "#540D6E" }}>
                        {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copiar todo
                    </button>
                    <div className="relative" ref={downloadRef}>
                        <button
                            onClick={() => setShowDownloadOptions(v => !v)}
                            disabled={downloadingPdf}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg transition-all hover:shadow-sm disabled:opacity-60"
                            style={{ backgroundColor: "#F3E8FF", color: "#540D6E" }}>
                            {downloadingPdf
                                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generando...</>
                                : <><Download className="w-3.5 h-3.5" /> Descargar <ChevronDown className={`w-3 h-3 transition-transform ${showDownloadOptions ? "rotate-180" : ""}`} /></>}
                        </button>
                        {showDownloadOptions && !downloadingPdf && (
                            <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50"
                                style={{ animation: "modalIn 0.15s ease-out" }}>
                                <button onClick={downloadCSV}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-purple-50 transition-colors">
                                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: "#E8F5F0" }}>
                                        <FileSpreadsheet className="w-4 h-4" style={{ color: "#0EAD69" }} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-slate-900 text-xs">CSV</p>
                                        <p className="text-xs text-slate-500">Hoja de cálculo</p>
                                    </div>
                                </button>
                                <button onClick={downloadPDF}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-purple-50 transition-colors">
                                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: "#FEE2E2" }}>
                                        <FileText className="w-4 h-4" style={{ color: "#EE4266" }} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-slate-900 text-xs">PDF</p>
                                        <p className="text-xs text-slate-500">Documento PDF</p>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="px-6 pb-4 overflow-y-auto" style={{ maxHeight: "calc(85vh - 200px)" }}>
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    {["#", "Estudiante", "Usuario", "PIN", ""].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {safe.map((cred, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm text-slate-500">{idx + 1}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                                    style={{ background: "linear-gradient(135deg, #540D6E, #EE4266)" }}>
                                                    {cred.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium text-slate-900">{cred.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-mono text-slate-600">@{cred.username}</td>
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-sm font-bold tracking-wider" style={{ color: "#540D6E" }}>{cred.pin}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => copyOne(cred, idx)} className="p-1.5 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-slate-100 transition-colors">
                                                {copied[idx] ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100">
                    <button onClick={onClose}
                        className="w-full py-2.5 text-sm font-bold text-white rounded-xl transition-all"
                        style={{ backgroundColor: "#540D6E" }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── MODAL AGREGAR ESTUDIANTE ─────────────────────────────────────────────────
function AddStudentModal({ course, onClose, onSuccess }) {
    const [activeTab, setActiveTab] = useState("search");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [singleName, setSingleName] = useState("");
    const [multipleNames, setMultipleNames] = useState("");
    const debounceRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    useEffect(() => {
        if (activeTab !== "search") return;
        if (query.trim().length < 2) { setResults([]); return; }
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    route("teacher.courses.students.search", course.id) + `?q=${encodeURIComponent(query)}`
                );
                setResults(await res.json());
            } catch { setResults([]); }
            finally { setLoading(false); }
        }, 300);
        return () => clearTimeout(debounceRef.current);
    }, [query, activeTab, course.id]);

    const handleSelect = (s) => { setSelected(s); setQuery(s.name); setResults([]); };
    const handleClear = () => { setSelected(null); setQuery(""); setResults([]); inputRef.current?.focus(); };

    const handleAddExisting = () => {
        if (submitting || !selected) return;
        setSubmitting(true);
        router.post(
            route("teacher.courses.students.store", course.id),
            { student_id: selected.id, stay_on_page: true },
            { 
                preserveScroll: true, 
                preserveState: true,
                onFinish: () => setSubmitting(false), 
                onSuccess: (page) => {
                    onClose();
                    const cred = page.props.flash?.credentials;
                    if (cred && onSuccess) {
                        onSuccess([{ name: selected.name, username: cred.username, pin: String(cred.pin) }]);
                    }
                }
            }
        );
    };

    const handleCreateSingle = () => {
        if (submitting || !singleName.trim()) return;
        const name = singleName.trim();
        setSubmitting(true);
        router.post(
            route("teacher.courses.students.store", course.id),
            { name, stay_on_page: true },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setSubmitting(false),
                onSuccess: (page) => {
                    const cred = page.props.flash?.credentials;
                    onClose();
                    if (cred) onSuccess?.([{ name, username: cred.username, pin: String(cred.pin) }]);
                },
            }
        );
    };

    const submitBulk = (studentsList) => {
        if (submitting || studentsList.length === 0) return;
        setSubmitting(true);
        router.post(
            route("teacher.courses.students.bulk", course.id),
            { students: studentsList, stay_on_page: true },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setSubmitting(false),
                onSuccess: (page) => {
                    const bulk = page.props.flash?.bulk_credentials;
                    onClose();
                    if (bulk && bulk.length > 0) onSuccess?.(bulk.filter(c => c && c.name && c.username && c.pin));
                },
                onError: () => alert("Error al crear los estudiantes. Verifica los datos."),
            }
        );
    };

    const handleCreateMultiple = () => {
        const names = multipleNames.split(/\n|,/).map(n => n.trim()).filter(n => n.length >= 2);
        if (names.length === 0) return;
        submitBulk(names.map(name => ({ name })));
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        e.target.value = "";
        let rows = [];
        try {
            if (file.name.toLowerCase().endsWith(".csv")) {
                const text = await file.text();
                await new Promise(resolve => {
                    Papa.parse(text, {
                        header: true, skipEmptyLines: true,
                        complete: res => { rows = res.data; resolve(); }
                    });
                });
            } else {
                const buf = await file.arrayBuffer();
                const wb = XLSX.read(buf);
                rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
            }
        } catch { alert("No se pudo leer el archivo."); return; }

        const students = rows
            .map(r => ({ name: (r.name || r.nombre || r.Nombre || r.Name || r.estudiante || r.alumno || "").trim() }))
            .filter(s => s.name.length >= 2);

        if (students.length === 0) {
            alert("No se encontraron nombres válidos. Usa una columna llamada 'nombre' o 'name'.");
            return;
        }
        submitBulk(students);
    };

    const tabs = [
        { id: "search", label: "Buscar existente", icon: Search },
        { id: "single", label: "Crear uno", icon: UserPlus },
        { id: "multiple", label: "Crear varios", icon: ListPlus },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" style={{ animation: "modalIn 0.2s ease-out" }}>
                <div className="h-1" style={{ background: "linear-gradient(to right, #540D6E, #EE4266)" }} />
                <div className="px-6 pt-5 pb-3 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#540D6E15" }}>
                                <UserPlus className="w-5 h-5" style={{ color: "#540D6E" }} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Agregar estudiantes</h2>
                                <p className="text-sm text-slate-500">Busca, crea uno o carga desde archivo</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex gap-1">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab.id ? "text-white" : "text-slate-600 hover:bg-slate-50"}`}
                                style={activeTab === tab.id ? { backgroundColor: "#540D6E" } : {}}>
                                <tab.icon className="w-3.5 h-3.5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    {submitting && (
                        <div className="flex items-center justify-center gap-2 py-4 text-sm text-slate-500">
                            <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#540D6E" }} />
                            <span>Procesando estudiantes...</span>
                        </div>
                    )}
                    {activeTab === "search" && !submitting && (
                        <>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    {loading ? <Loader2 className="w-4 h-4 text-slate-400 animate-spin" /> : <Search className="w-4 h-4 text-slate-400" />}
                                </div>
                                <input ref={inputRef} type="text"
                                    placeholder="Buscar por nombre o username..."
                                    value={query}
                                    onChange={e => { setQuery(e.target.value); setSelected(null); }}
                                    disabled={!!selected}
                                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all disabled:opacity-50"
                                    onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                    onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"}
                                />
                                {results.length > 0 && (
                                    <ul className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl shadow-lg mt-1.5 max-h-48 overflow-y-auto">
                                        {results.map(s => (
                                            <li key={s.id} onClick={() => handleSelect(s)}
                                                className="px-3 py-2.5 hover:bg-violet-50 cursor-pointer flex justify-between items-center">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                                        style={{ background: "linear-gradient(135deg, #540D6E, #EE4266)" }}>
                                                        {s.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-800">{s.name}</span>
                                                </div>
                                                <span className="text-xs text-slate-400 font-mono">@{s.username}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {selected && (
                                <div className="p-3 rounded-xl border" style={{ backgroundColor: "#F3E8FF", borderColor: "#540D6E30" }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                            style={{ background: "linear-gradient(135deg, #540D6E, #EE4266)" }}>
                                            {selected.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-slate-900">{selected.name}</p>
                                            <p className="text-xs text-slate-500">@{selected.username}</p>
                                        </div>
                                        <button onClick={handleClear} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            )}
                            <button onClick={handleAddExisting} disabled={!selected}
                                className="w-full py-2.5 text-sm font-bold text-white rounded-xl transition-all disabled:opacity-40"
                                style={{ backgroundColor: "#540D6E" }}
                                onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = "#6B1689")}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}>
                                Agregar al curso
                            </button>
                        </>
                    )}
                    {activeTab === "single" && !submitting && (
                        <>
                            <input type="text"
                                placeholder="Nombre completo del estudiante"
                                value={singleName}
                                onChange={e => setSingleName(e.target.value)}
                                onKeyPress={e => e.key === "Enter" && handleCreateSingle()}
                                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none transition-all"
                                onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"}
                            />
                            <button onClick={handleCreateSingle} disabled={!singleName.trim()}
                                className="w-full py-2.5 text-sm font-bold text-white rounded-xl transition-all disabled:opacity-40"
                                style={{ backgroundColor: "#540D6E" }}
                                onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = "#6B1689")}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}>
                                Crear y agregar
                            </button>
                        </>
                    )}
                    {activeTab === "multiple" && !submitting && (
                        <>
                            <textarea rows={7}
                                placeholder={"Ingresa los nombres, uno por línea o separados por comas:\n\nMaría González\nJuan Pérez\nAna Martínez"}
                                value={multipleNames}
                                onChange={e => setMultipleNames(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none resize-none"
                                onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"}
                            />
                            <button onClick={handleCreateMultiple} disabled={!multipleNames.trim()}
                                className="w-full py-2.5 text-sm font-bold text-white rounded-xl transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                                style={{ backgroundColor: "#540D6E" }}
                                onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = "#6B1689")}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}>
                                <UserPlus className="w-4 h-4" /> Agregar estudiantes
                            </button>
                            <label className="w-full py-2.5 text-sm font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                style={{ color: "#540D6E" }}>
                                <Upload className="w-4 h-4" />
                                Subir desde CSV / Excel
                                <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileUpload} />
                            </label>
                            <p className="text-xs text-slate-400 text-center">
                                Se generarán credenciales automáticamente para cada estudiante
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── MODAL RETIRAR ESTUDIANTE ─────────────────────────────────────────────────
function RemoveStudentModal({ student, onConfirm, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" style={{ animation: "modalIn 0.2s ease-out" }}>
                <div className="h-1" style={{ background: "linear-gradient(to right, #EE4266, #FFD23F)" }} />
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#FEE2E2" }}>
                            <UserX className="w-5 h-5" style={{ color: "#EE4266" }} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Retirar estudiante</h3>
                            <p className="text-sm text-slate-500">El estudiante seguirá registrado en el sistema</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl border" style={{ backgroundColor: "#FEE2E210", borderColor: "#EE426630" }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #540D6E, #EE4266)" }}>
                            {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                            <p className="text-xs text-slate-500">@{student.username}</p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600">¿Confirmas retirar a este estudiante del curso? Podrás volver a agregarlo después.</p>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancelar</button>
                        <button onClick={onConfirm}
                            className="flex-1 py-2.5 text-sm font-bold text-white rounded-lg transition-all"
                            style={{ backgroundColor: "#EE4266" }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#DC2F55"}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#EE4266"}>
                            Retirar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── MODAL ASIGNAR OVAS ─────────────────────────────────
function AssignOvaModal({ course, onClose, onSuccess }) {
    const [availableOvas, setAvailableOvas] = useState([]);
    const [selectedOvas, setSelectedOvas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [selectedArea, setSelectedArea] = useState(null);
    const [toast, setToast] = useState(null);

    const AREAS = ['Matemáticas', 'Español', 'Ciencias Sociales', 'Ciencias Naturales', 'Inglés'];
    
    const MORADO = { color: '#540D6E', bg: '#F3E8FF' };

    useEffect(() => { loadAvailableOvas(); }, [course.id]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const loadAvailableOvas = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/teacher/courses/${course.id}/ovas/available`, {
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                credentials: 'same-origin'
            });
            if (response.status === 419) { window.location.reload(); return; }
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            
            let ovasArray = [];
            if (Array.isArray(data)) ovasArray = data;
            else if (data?.data && Array.isArray(data.data)) ovasArray = data.data;
            
            const validOvas = ovasArray.filter(ova => ova.url && ova.url.trim() !== '');
            setAvailableOvas(validOvas);
            
            const ovasByAreaTemp = {};
            validOvas.forEach(ova => {
                if (!ovasByAreaTemp[ova.area]) ovasByAreaTemp[ova.area] = [];
                ovasByAreaTemp[ova.area].push(ova);
            });
            const firstArea = AREAS.find(area => ovasByAreaTemp[area] && ovasByAreaTemp[area].length > 0);
            if (firstArea) {
                setSelectedArea(firstArea);
            }
        } catch (error) {
            console.error('Error loading OVAs:', error);
            setError('No se pudieron cargar los OVAs disponibles.');
            setAvailableOvas([]);
        } finally {
            setLoading(false);
        }
    };

    const ovasByArea = {};
    availableOvas.forEach(ova => {
        if (!ovasByArea[ova.area]) ovasByArea[ova.area] = [];
        ovasByArea[ova.area].push(ova);
    });

    const areasWithOvas = AREAS.filter(area => ovasByArea[area] && ovasByArea[area].length > 0);

    const handleAssign = async () => {
        if (selectedOvas.length === 0) {
            showToast('Selecciona al menos un OVA para asignar', 'error');
            return;
        }
        setSubmitting(true);
        try {
            const response = await fetch(
                route('teacher.courses.ovas.assign', course.id),
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-XSRF-TOKEN': getCsrfToken(),
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify({ ova_ids: selectedOvas }),
                }
            );
            if (response.status === 419) {
                showToast('Sesión expirada. Recargando...', 'info');
                setTimeout(() => window.location.reload(), 1000);
                return;
            }
            if (response.status === 403) {
                showToast('No tienes permiso para realizar esta acción', 'error');
                return;
            }
            const result = await response.json();
            if (response.ok && result?.success) {
                if (onSuccess) onSuccess(result.data ?? null);
                onClose();
                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('showToast', { 
                        detail: { message: `${selectedOvas.length} OVA(s) asignado(s) correctamente`, type: 'success' }
                    }));
                }, 300);
            } else {
                showToast(result?.message || 'Error al asignar los OVAs', 'error');
            }
        } catch (err) {
            showToast('Error de red al asignar los OVAs.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const toggleSelect = (ovaId) => {
        setSelectedOvas(prev => prev.includes(ovaId) 
            ? prev.filter(id => id !== ovaId) 
            : [...prev, ovaId]
        );
    };

    const selectAllInArea = (area, select) => {
        const areaOvas = ovasByArea[area] || [];
        const areaOvaIds = areaOvas.map(ova => ova.id);
        if (select) {
            const newSelected = [...selectedOvas];
            areaOvaIds.forEach(id => {
                if (!newSelected.includes(id)) newSelected.push(id);
            });
            setSelectedOvas(newSelected);
        } else {
            setSelectedOvas(prev => prev.filter(id => !areaOvaIds.includes(id)));
        }
    };

    const isAllSelectedInArea = (area) => {
        const areaOvas = ovasByArea[area] || [];
        if (areaOvas.length === 0) return false;
        return areaOvas.every(ova => selectedOvas.includes(ova.id));
    };

    const getSelectedCount = (area) => {
        const areaOvas = ovasByArea[area] || [];
        return areaOvas.filter(ova => selectedOvas.includes(ova.id)).length;
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden" style={{ animation: "modalIn 0.2s ease-out" }}>
                <div className="h-1" style={{ background: "linear-gradient(to right, #540D6E, #EE4266)" }} />
                <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#F3E8FF" }}>
                            <Layers className="w-5 h-5" style={{ color: "#540D6E" }} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Asignar OVAs al curso</h2>
                            <p className="text-sm text-slate-500">Selecciona los recursos por área temática</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex h-full" style={{ maxHeight: "calc(90vh - 130px)" }}>
                    <div className="w-64 border-r border-slate-200 bg-white overflow-y-auto flex-shrink-0">
                        <div className="p-3">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 px-2">Áreas</div>
                            {areasWithOvas.map(area => {
                                const areaOvas = ovasByArea[area];
                                const selectedCount = getSelectedCount(area);
                                
                                return (
                                    <button
                                        key={area}
                                        onClick={() => setSelectedArea(area)}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1 ${
                                            selectedArea === area 
                                                ? 'bg-white shadow-sm border' 
                                                : 'hover:bg-slate-50'
                                        }`}
                                        style={selectedArea === area ? { borderColor: `${MORADO.color}30`, color: MORADO.color } : {}}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: MORADO.color }} />
                                            <span className="flex-1 truncate">{area}</span>
                                            <span className="text-xs font-mono" style={{ color: MORADO.color }}>
                                                {areaOvas.length}
                                            </span>
                                        </div>
                                        {selectedCount > 0 && (
                                            <div className="text-xs mt-1 text-green-600">
                                                {selectedCount} seleccionado{selectedCount !== 1 ? 's' : ''}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#540D6E" }} />
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#FEE2E2" }}>
                                    <AlertCircle className="w-8 h-8" style={{ color: "#EE4266" }} />
                                </div>
                                <p className="text-base font-semibold text-slate-700 mb-2">Error</p>
                                <p className="text-sm text-slate-500 mb-4">{error}</p>
                                <button onClick={loadAvailableOvas} className="px-4 py-2 text-sm font-semibold text-white rounded-lg" style={{ backgroundColor: "#540D6E" }}>
                                    Reintentar
                                </button>
                            </div>
                        ) : availableOvas.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#F3E8FF" }}>
                                    <Layers className="w-8 h-8" style={{ color: "#540D6E" }} />
                                </div>
                                <p className="text-base font-semibold text-slate-700 mb-1">No hay OVAs disponibles</p>
                                <p className="text-sm text-slate-400">
                                    No hay OVAs con URL configurada para asignar
                                </p>
                            </div>
                        ) : selectedArea && ovasByArea[selectedArea] ? (
                            (() => {
                                const area = selectedArea;
                                const ovas = ovasByArea[area];
                                const allSelected = isAllSelectedInArea(area);
                                const selectedCount = getSelectedCount(area);
                                
                                return (
                                    <div className="border rounded-xl overflow-hidden" style={{ borderColor: `${MORADO.color}20` }}>
                                        <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: MORADO.bg }}>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: MORADO.color }} />
                                                <h3 className="font-bold text-sm" style={{ color: MORADO.color }}>{area}</h3>
                                                <span className="text-xs text-slate-500">({ovas.length} OVA{ovas.length !== 1 ? 's' : ''})</span>
                                                {selectedCount > 0 && (
                                                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                                                        {selectedCount} seleccionado{selectedCount !== 1 ? 's' : ''}
                                                    </span>
                                                )}
                                            </div>
                                            {ovas.length > 0 && (
                                                <button
                                                    onClick={() => selectAllInArea(area, !allSelected)}
                                                    className="text-xs px-2 py-1 rounded-md transition-all flex items-center gap-1"
                                                    style={{ backgroundColor: 'white', color: MORADO.color }}
                                                >
                                                    {allSelected ? <X className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                                                    {allSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
                                                </button>
                                            )}
                                        </div>
                                        <div className="p-4 space-y-3">
                                            {ovas.map(ova => (
                                                <div key={ova.id} 
                                                    onClick={() => toggleSelect(ova.id)}
                                                    className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${
                                                        selectedOvas.includes(ova.id) 
                                                            ? 'border-purple-600 bg-purple-50' 
                                                            : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2 rounded-lg flex-shrink-0" style={{ 
                                                            backgroundColor: selectedOvas.includes(ova.id) ? "#540D6E20" : "#F1F5F9" 
                                                        }}>
                                                            <Video className="w-5 h-5" style={{ 
                                                                color: selectedOvas.includes(ova.id) ? "#540D6E" : "#64748B" 
                                                            }} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: MORADO.color }}>
                                                                    {ova.area}
                                                                </p>
                                                                {ova.url && (
                                                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                                                                        Disponible
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h4 className="font-bold text-slate-900">{ova.tematica}</h4>
                                                            <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                                                                {ova.description || "Sin descripción"}
                                                            </p>
                                                        </div>
                                                        <input 
                                                            type="checkbox" 
                                                            checked={selectedOvas.includes(ova.id)} 
                                                            onChange={() => {}}
                                                            className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 flex-shrink-0 mt-0.5" 
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-base text-slate-500">Selecciona un área del menú lateral</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex gap-3 justify-between items-center">
                    <div className="text-sm text-slate-500">
                        {selectedOvas.length > 0 && (
                            <span className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                {selectedOvas.length} OVA{selectedOvas.length !== 1 ? 's' : ''} seleccionado{selectedOvas.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                            Cancelar
                        </button>
                        <button 
                            onClick={handleAssign} 
                            disabled={selectedOvas.length === 0 || submitting || loading}
                            className="px-4 py-2 text-sm font-bold text-white rounded-lg transition-all disabled:opacity-40 flex items-center gap-2 shadow-sm hover:shadow-md"
                            style={{ backgroundColor: "#540D6E" }}
                            onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = "#6B1689")}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}>
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                            Asignar ({selectedOvas.length})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── RENDIMIENTO ACADÉMICO CON PODIO TRASLÚCIDO ───────────────────────────────
function RendimientoTab({ course }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [top3, setTop3] = useState([]);
    const [ranking, setRanking] = useState([]);
    const [stats, setStats] = useState({ total_evaluations: 0, total_students: 0 });

    useEffect(() => {
        loadEvaluations();
    }, [course.id]);

    const loadEvaluations = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/teacher/courses/${course.id}/evaluations`, {
                headers: { 
                    'Accept': 'application/json', 
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': getCsrfToken()
                },
                credentials: 'same-origin'
            });
            
            if (response.status === 419) { 
                window.location.reload(); 
                return; 
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success && result.data) {
                setTop3(result.data.top3 || []);
                setRanking(result.data.ranking || []);
                setStats({
                    total_evaluations: result.data.total_evaluations || 0,
                    total_students: result.data.total_students || 0
                });
            } else {
                throw new Error(result.message || 'Error al cargar los datos');
            }
        } catch (err) {
            console.error('Error loading evaluations:', err);
            setError('No se pudieron cargar los datos de evaluación.');
        } finally {
            setLoading(false);
        }
    };

    const courseName = `${GRADE_LABELS[course.grade] ?? course.grade} - Sección ${course.section}`;

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 py-16 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: "#540D6E" }} />
                <p className="text-sm text-gray-600">Cargando datos de evaluación...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 py-16 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#FEE2E2" }}>
                    <AlertCircle className="w-8 h-8" style={{ color: "#EE4266" }} />
                </div>
                <p className="text-base font-semibold text-gray-700 mb-2">Error</p>
                <p className="text-sm text-gray-500 mb-4">{error}</p>
                <button 
                    onClick={loadEvaluations}
                    className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all"
                    style={{ backgroundColor: "#540D6E" }}
                >
                    Reintentar
                </button>
            </div>
        );
    }

    if (stats.total_evaluations === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 py-16 text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: "linear-gradient(135deg, #540D6E10, #EE426610)" }}>
                    <BarChart3 className="w-10 h-10" style={{ color: "#540D6E40" }} />
                </div>
                <p className="text-base font-bold text-gray-700 mb-1">Sin evaluaciones registradas</p>
                <p className="text-sm text-gray-400">Los estudiantes aún no han completado evaluaciones en este curso</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Mensaje introductorio centrado */}
            <div className="flex justify-center">
                <div className="bg-gradient-to-r from-purple-50 via-white to-purple-50/30 rounded-2xl border border-purple-100 p-6 shadow-sm max-w-7xl w-full">
                    <div className="text-center space-y-3">
                        <div className="flex items-center justify-center gap-3">
                            <div className="p-2.5 rounded-xl" style={{ backgroundColor: "#F3E8FF" }}>
                                <BarChart3 className="w-5 h-5" style={{ color: "#540D6E" }} />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">Desempeño General del Curso</h3>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed max-w-5xl mx-auto">
                            Aquí encontrarás el listado de estudiantes de <strong style={{ color: "#540D6E" }}>{courseName}</strong>, 
                            ordenados de mayor a menor rendimiento según el promedio obtenido en las calificaciones 
                            de todos los OVAs asignados a este curso.
                        </p>
                    </div>
                </div>
            </div>

            {/* Podio de Honor con escalones traslúcidos */}
            {top3.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: "#FFF4E0" }}>
                            <Trophy className="w-5 h-5" style={{ color: "#4B5563" }} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Podio de Honor</h2>
                    </div>
                    <div className="px-6 py-8">
                        {/* Escalones del podio traslúcidos con borde sólido */}
                        <div className="flex items-end justify-center gap-0">
                            {/* Segundo lugar (izquierda) */}
                            {top3[1] && (
                                <div className="flex-1 text-center">
                                    <div className="mb-3">
                                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: "#F3F4F6" }}>
                                            <span className="text-2xl font-bold text-gray-600">
                                                {top3[1].student.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="font-bold text-gray-800 text-sm mt-2">{top3[1].student.name}</p>
                                        <p className="text-xs text-gray-500">@{top3[1].student.username}</p>
                                        <p className="text-xl font-bold text-gray-600 mt-1">{top3[1].average_percentage}%</p>
                                    </div>
                                    <div className="h-28 rounded-t-xl flex items-end justify-center pb-2 border-2 border-b-0" style={{ backgroundColor: "rgba(156, 163, 175, 0.3)", borderColor: "#9CA3AF" }}>
                                        <span className="text-gray-700 font-bold text-lg">2°</span>
                                    </div>
                                </div>
                            )}

                            {/* Primer lugar (centro, más alto) */}
                            {top3[0] && (
                                <div className="flex-1 text-center relative" style={{ zIndex: 10 }}>
                                    <div className="mb-3">
                                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto border-4" style={{ borderColor: "#FFD23F", backgroundColor: "#FEF3C7" }}>
                                            <span className="text-3xl font-bold text-gray-700">
                                                {top3[0].student.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                            <Trophy className="w-8 h-8" style={{ color: "#FFD23F" }} />
                                        </div>
                                        <p className="font-bold text-gray-800 text-base mt-2 pt-2">{top3[0].student.name}</p>
                                        <p className="text-xs text-gray-500">@{top3[0].student.username}</p>
                                        <p className="text-2xl font-bold" style={{ color: "#FFD23F" }}>{top3[0].average_percentage}%</p>
                                    </div>
                                    <div className="h-36 rounded-t-xl flex items-end justify-center pb-2 border-2 border-b-0" style={{ backgroundColor: "rgba(255, 210, 63, 0.3)", borderColor: "#FFD23F" }}>
                                        <span className="text-gray-700 font-bold text-xl">1°</span>
                                    </div>
                                </div>
                            )}

                            {/* Tercer lugar (derecha) */}
                            {top3[2] && (
                                <div className="flex-1 text-center">
                                    <div className="mb-3">
                                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: "#FEE2E2" }}>
                                            <span className="text-2xl font-bold" style={{ color: "#EE4266" }}>
                                                {top3[2].student.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="font-bold text-gray-800 text-sm mt-2">{top3[2].student.name}</p>
                                        <p className="text-xs text-gray-500">@{top3[2].student.username}</p>
                                        <p className="text-xl font-bold" style={{ color: "#EE4266" }}>{top3[2].average_percentage}%</p>
                                    </div>
                                    <div className="h-20 rounded-t-xl flex items-end justify-center pb-2 border-2 border-b-0" style={{ backgroundColor: "rgba(238, 66, 102, 0.3)", borderColor: "#EE4266" }}>
                                        <span className="text-gray-700 font-bold text-lg">3°</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Ranking de Estudiantes */}
            {ranking.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: "#F3E8FF" }}>
                            <BarChart3 className="w-5 h-5" style={{ color: "#540D6E" }} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Ranking de Estudiantes</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">#</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Estudiante</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Promedio</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Evaluaciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {ranking.map((item, idx) => (
                                    <tr key={item.student.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-gray-400">{idx + 4}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                                    style={{ background: "linear-gradient(135deg, #540D6E, #EE4266)" }}>
                                                    {item.student.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">{item.student.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-mono text-gray-600">@{item.student.username}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-bold"
                                                style={{ 
                                                    backgroundColor: item.average_percentage >= 70 ? '#E8F5F0' : item.average_percentage >= 50 ? '#FEF3C7' : '#FEE2E2',
                                                    color: item.average_percentage >= 70 ? '#0EAD69' : item.average_percentage >= 50 ? '#4B5563' : '#EE4266'
                                                }}>
                                                {item.average_percentage}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm text-gray-600">{item.total_evaluations}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                        <p className="text-sm text-gray-600">
                            Mostrando <strong>{ranking.length}</strong> estudiante{ranking.length !== 1 ? 's' : ''} en el ranking
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function TeacherCourseShow({ course, students, courseOvas = [] }) {
    const { props } = usePage();
    const teacher = props.auth?.user ?? { name: "Docente", email: "docente@educacion.edu" };

    const [tab, setTab] = useState("students");
    const [showAddModal, setShowAddModal] = useState(false);
    const [generatedCredentials, setGeneratedCredentials] = useState([]);
    const [showCredentialsModal, setShowCredentialsModal] = useState(false);
    const [studentToRemove, setStudentToRemove] = useState(null);
    const [ovaToRemove, setOvaToRemove] = useState(null);
    const [search, setSearch] = useState("");
    const [ovas, setOvas] = useState(courseOvas);
    const [showAssignOvaModal, setShowAssignOvaModal] = useState(false);
    const [toast, setToast] = useState(null);

    const [collapsed] = useSidebarState();

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        const handleToast = (e) => {
            showToast(e.detail.message, e.detail.type);
        };
        window.addEventListener('showToast', handleToast);
        return () => window.removeEventListener('showToast', handleToast);
    }, []);

    const loadOvas = async () => {
        try {
            const csrfToken = getCsrfToken();
            const response = await fetch(`/teacher/courses/${course.id}/ovas`, {
                headers: { 
                    'Accept': 'application/json', 
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-XSRF-TOKEN': csrfToken
                },
                credentials: 'same-origin'
            });
            if (response.ok) {
                const data = await response.json();
                let ovasArray = [];
                if (Array.isArray(data)) ovasArray = data;
                else if (data?.data && Array.isArray(data.data)) ovasArray = data.data;
                setOvas(ovasArray);
            }
        } catch (error) {
            console.error('Error loading OVAs:', error);
        }
    };

    const handleStudentSuccess = (creds) => {
        const valid = (creds || []).filter(c => c && c.name && c.username && c.pin);
        if (valid.length === 0) return;
        setGeneratedCredentials(valid);
        setShowCredentialsModal(true);
    };

    const confirmRemoveStudent = () => {
        if (!studentToRemove) return;
        router.delete(
            route("teacher.courses.students.destroy", [course.id, studentToRemove.id]),
            { 
                onSuccess: () => {
                    setStudentToRemove(null);
                    showToast('Estudiante retirado del curso', 'success');
                }
            }
        );
    };

    const confirmRemoveOva = async () => {
        if (!ovaToRemove) return;
        
        try {
            const csrfToken = getCsrfToken();
            
            // Si no hay token, mostrar error
            if (!csrfToken) {
                showToast('Error de autenticación. Recargando página...', 'error');
                setTimeout(() => window.location.reload(), 1500);
                return;
            }
            
            const response = await fetch(`/teacher/courses/${course.id}/ovas/${ovaToRemove.id}`, {
                method: 'DELETE',
                headers: {
                    'X-XSRF-TOKEN': csrfToken,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin'
            });
            
            if (response.status === 419) {
                // Token expirado, recargar para obtener uno nuevo
                showToast('Sesión expirada. Recargando...', 'info');
                setTimeout(() => window.location.reload(), 1000);
                return;
            }
            
            if (response.status === 403) {
                showToast('No tienes permiso para realizar esta acción', 'error');
                return;
            }
            
            const result = await response.json().catch(() => null);
            
            if (response.ok && result?.success) {
                if (result.data && Array.isArray(result.data)) {
                    setOvas(result.data);
                } else {
                    await loadOvas();
                }
                setOvaToRemove(null);
                showToast('OVA retirado del curso', 'success');
            } else {
                showToast(result?.message || 'Error al remover el OVA', 'error');
            }
        } catch (error) {
            console.error('Error en confirmRemoveOva:', error);
            showToast('Error de red al remover el OVA', 'error');
        }
    };

    const handleOvaSuccess = async (data) => {
        if (data && Array.isArray(data)) setOvas(data);
        else await loadOvas();
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.username ?? "").toLowerCase().includes(search.toLowerCase())
    );

    const pageTabs = [
        { id: "students", label: "Estudiantes", icon: Users, count: students.length },
        { id: "ovas", label: "Recursos OVAs", icon: Layers, count: ovas.length },
        { id: "rendimiento", label: "Desempeño General", icon: BarChart3, count: null },
    ];

    // Agrupar OVAs por área para la vista
    const ovasByArea = {};
    ovas.forEach(ova => {
        if (!ovasByArea[ova.area]) ovasByArea[ova.area] = [];
        ovasByArea[ova.area].push(ova);
    });
    const areasWithOvas = Object.keys(ovasByArea).sort();

    return (
        <>
            <Head title={`${GRADE_LABELS[course.grade] ?? course.grade} — Sección ${course.section}`} />

            <AppSidebar currentRoute="teacher.courses.show" />

            <main className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-20" : "lg:ml-72"} min-h-screen bg-gray-50`}>
                {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">

                        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                            <Link href={route("teacher.dashboard")} className="hover:text-purple-600 transition-colors">Mis Cursos</Link>
                            <span>/</span>
                            <span style={{ color: "#540D6E" }} className="font-medium">
                                {GRADE_LABELS[course.grade] ?? course.grade} — Sección {course.section}
                            </span>
                        </div>

                        <div className="mb-8">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-4 rounded-xl shadow-sm border" style={{ backgroundColor: "white", borderColor: "#540D6E" }}>
                                        <GraduationCap className="w-10 h-10" style={{ color: "#540D6E" }} />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                            {GRADE_LABELS[course.grade] ?? course.grade} · Sección {course.section}
                                        </h1>
                                        <div className="flex flex-wrap items-center gap-3 text-gray-600">
                                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Año {course.school_year}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {students.length} estudiantes</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span className={`flex items-center gap-1 ${course.is_active ? "text-green-600" : "text-gray-400"}`}>
                                                <span className={`w-2 h-2 rounded-full ${course.is_active ? "animate-pulse" : ""}`}
                                                    style={{ backgroundColor: course.is_active ? "#0EAD69" : "#94A3B8" }} />
                                                {course.is_active ? "Activo" : "Inactivo"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Link 
                                    href={route("teacher.dashboard")}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-300 rounded-xl hover:bg-[#540D6E] hover:text-white hover:border-[#540D6E] transition-all text-gray-700 font-medium shadow-sm"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    <span>Regresar</span>
                                </Link>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                            {[
                                { label: "Estudiantes", value: students.length, sub: "Inscritos en el curso", Icon: Users, bg: "#F3E8FF", color: "#540D6E" },
                                { label: "OVAs asignados", value: ovas.length, sub: "Recursos disponibles", Icon: Layers, bg: "#E8F5F0", color: "#0EAD69" },
                                { label: "Áreas cubiertas", value: areasWithOvas.length, sub: "Áreas temáticas", Icon: BookOpen, bg: "#FEE2E2", color: "#EE4266" },
                            ].map(({ label, value, sub, Icon, bg, color }) => (
                                <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className="p-3 rounded-xl" style={{ backgroundColor: bg }}>
                                            <Icon className="w-6 h-6" style={{ color }} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</p>
                                            <p className="text-2xl font-black mt-1" style={{ color }}>{value}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-3">{sub}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
                            <div className="flex divide-x divide-gray-200">
                                {pageTabs.map(({ id, label, icon: Icon, count }) => (
                                    <button key={id} onClick={() => setTab(id)}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold transition-all ${tab === id ? "text-white" : "text-gray-600 hover:bg-gray-50"}`}
                                        style={tab === id ? { backgroundColor: "#540D6E" } : {}}>
                                        <Icon className="w-4 h-4" />
                                        <span>{label}</span>
                                        {count != null && (
                                            <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${tab === id ? "bg-white text-purple-700" : "bg-gray-100 text-gray-600"}`}>
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {tab === "students" && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                            <input type="text"
                                                placeholder="Buscar estudiante por nombre o username..."
                                                value={search}
                                                onChange={e => setSearch(e.target.value)}
                                                className="w-full pl-10 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none transition-all bg-gray-50 focus:bg-white"
                                                onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                                onBlur={e => e.currentTarget.style.borderColor = "#E2E8F0"}
                                            />
                                            {search && (
                                                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <button onClick={() => setShowAddModal(true)}
                                            className="px-5 py-2.5 text-sm font-bold text-white rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                                            style={{ backgroundColor: "#540D6E" }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}>
                                            <UserPlus className="w-4 h-4" /> Agregar Estudiante
                                        </button>
                                    </div>
                                </div>

                                {filteredStudents.length > 0 ? (
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-50 border-b border-gray-200">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Estudiante</th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Usuario</th>
                                                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {filteredStudents.map(student => (
                                                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
                                                                        style={{ background: "linear-gradient(135deg, #540D6E, #EE4266)" }}>
                                                                        {getInitials(student.name)}
                                                                    </div>
                                                                    <span className="text-sm font-semibold text-gray-900">{student.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="text-sm font-mono text-gray-500">@{student.username}</span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <button onClick={() => setStudentToRemove(student)}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all"
                                                                    style={{ color: "#EE4266", backgroundColor: "#FEE2E2" }}
                                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FECACA"}
                                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#FEE2E2"}>
                                                                    <UserX className="w-3.5 h-3.5" /> Retirar
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                                            <p className="text-sm text-gray-600">
                                                Mostrando <strong>{filteredStudents.length}</strong> de <strong>{students.length}</strong> estudiantes
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-16 text-center">
                                        {search ? (
                                            <>
                                                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-base font-semibold text-gray-500">No hay resultados para "{search}"</p>
                                                <button onClick={() => setSearch("")} className="text-sm mt-2 hover:underline" style={{ color: "#540D6E" }}>Limpiar búsqueda</button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                                    style={{ background: "linear-gradient(135deg, #540D6E10, #EE426610)" }}>
                                                    <Users className="w-12 h-12" style={{ color: "#540D6E40" }} />
                                                </div>
                                                <p className="text-base font-bold text-gray-700 mb-1">No hay estudiantes inscritos</p>
                                                <p className="text-sm text-gray-400 mb-4">Comienza agregando estudiantes al curso</p>
                                                <button onClick={() => setShowAddModal(true)}
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-sm hover:shadow-md transition-all"
                                                    style={{ backgroundColor: "#540D6E" }}>
                                                    <UserPlus className="w-4 h-4" /> Agregar Estudiante
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {tab === "ovas" && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="flex justify-end">
                                    <button onClick={() => setShowAssignOvaModal(true)}
                                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-sm hover:shadow-md transition-all"
                                        style={{ backgroundColor: "#540D6E" }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}>
                                        <PlusCircle className="w-4 h-4" /> Asignar OVAs
                                    </button>
                                </div>

                                {ovas.length === 0 ? (
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-16 text-center">
                                        <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                            style={{ background: "linear-gradient(135deg, #540D6E10, #EE426610)" }}>
                                                <Layers className="w-12 h-12" style={{ color: "#540D6E40" }} />
                                        </div>
                                        <p className="text-base font-bold text-gray-700 mb-1">No hay OVAs asignados</p>
                                        <p className="text-sm text-gray-400 mb-4">Asigna recursos educativos para tus estudiantes</p>
                                        <button onClick={() => setShowAssignOvaModal(true)}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-sm hover:shadow-md transition-all"
                                            style={{ backgroundColor: "#540D6E" }}>
                                            <PlusCircle className="w-4 h-4" /> Asignar OVAs
                                        </button>
                                        </div>
                                ) : (
                                    <div className="space-y-6">
                                        {areasWithOvas.map(area => (
                                            <div key={area} 
                                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-purple-100/20 transition-all duration-300">
                                                
                                                {/* Header del área - Diseño con gradiente */}
                                                <div className="px-6 py-4 flex items-center justify-between bg-gradient-to-r from-purple-50 via-white to-purple-50/30 border-b-2 border-purple-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full shadow-sm" 
                                                                style={{ 
                                                                    background: "#540D6E",
                                                                    boxShadow: "0 2px 4px rgba(84, 13, 110, 0.2)"
                                                                }} 
                                                            />
                                                            <h3 className="text-lg font-bold" style={{ color: "#540D6E" }}>
                                                                {area}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                    <span 
                                                        className="px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm"
                                                        style={{ 
                                                            background: "linear-gradient(135deg, #F3E8FF, #EDE9FE)",
                                                            color: "#540D6E",
                                                            border: "1px solid rgba(84, 13, 110, 0.1)"
                                                        }}
                                                    >
                                                        {ovasByArea[area].length} {ovasByArea[area].length === 1 ? 'recurso' : 'recursos'}
                                                    </span>
                                                </div>
                                                
                                                {/* Contenido de OVAs */}
                                                <div className="p-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {ovasByArea[area].map(ova => (
                                                            <div key={ova.id} 
                                                                className="group bg-white rounded-xl border-2 border-gray-100 hover:border-purple-100 hover:shadow-lg hover:shadow-purple-50 transition-all duration-300 overflow-hidden relative">
                                                                
                                                                {/* Línea decorativa al hacer hover */}
                                                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-900 to-red-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                                                                
                                                                <div className="p-5">
                                                                    <div className="flex items-start gap-4">
                                                                        {/* Icono del OVA */}
                                                                        <div className="relative flex-shrink-0">
                                                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
                                                                                style={{ backgroundColor: "#F3E8FF" }}>
                                                                                <Video className="w-5 h-5" style={{ color: "#540D6E" }} />
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        {/* Información del OVA */}
                                                                        <div className="flex-1 min-w-0">
                                                                            <h4 className="font-bold text-gray-900 mb-1.5 group-hover:text-purple-900 transition-colors">
                                                                                {ova.tematica}
                                                                            </h4>
                                                                            
                                                                            <div className="relative mb-4">
                                                                                <p className="text-sm text-gray-500 line-clamp-2 group-hover:text-gray-600 transition-colors">
                                                                                    {ova.description || "Sin descripción disponible"}
                                                                                </p>
                                                                            </div>
                                                                            
                                                                            {/* Botón de recurso principal */}
                                                                            {ova.url ? (
                                                                                <a 
                                                                                    href={ova.url} 
                                                                                    target="_blank" 
                                                                                    rel="noopener noreferrer"
                                                                                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95"
                                                                                    style={{ 
                                                                                        backgroundColor: "#540D6E",
                                                                                        boxShadow: "0 4px 6px -1px rgba(84, 13, 110, 0.1)"
                                                                                    }}
                                                                                    onMouseEnter={e => {
                                                                                        e.currentTarget.style.backgroundColor = "#6B1689";
                                                                                        e.currentTarget.style.boxShadow = "0 8px 12px -3px rgba(84, 13, 110, 0.2)";
                                                                                    }}
                                                                                    onMouseLeave={e => {
                                                                                        e.currentTarget.style.backgroundColor = "#540D6E";
                                                                                        e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(84, 13, 110, 0.1)";
                                                                                    }}
                                                                                >
                                                                                    <ExternalLink className="w-4 h-4" />
                                                                                    <span>Ver recurso</span>
                                                                                </a>
                                                                            ) : (
                                                                                <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 italic">
                                                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                                                    </svg>
                                                                                    Recurso no disponible
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        
                                                                        {/* Botón eliminar */}
                                                                        <button 
                                                                            onClick={() => setOvaToRemove(ova)}
                                                                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-1.5"
                                                                            style={{ color: "#EE4266" }}
                                                                            onMouseEnter={e => {
                                                                                e.currentTarget.style.backgroundColor = "#FEE2E2";
                                                                            }}
                                                                            onMouseLeave={e => {
                                                                                e.currentTarget.style.backgroundColor = "transparent";
                                                                            }}
                                                                            title="Retirar OVA"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                            <span className="text-xs font-medium">Retirar</span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {tab === "rendimiento" && (
                            <RendimientoTab course={course} />
                        )}

                    </div>
                </div>
            </main>

            <div className="fixed inset-0 -z-10 bg-gray-50">
                <div className="absolute inset-0" style={{
                    backgroundImage: "radial-gradient(circle at 1px 1px, rgba(84,13,110,0.05) 1px, transparent 0)",
                    backgroundSize: "40px 40px"
                }} />
                <div className="absolute top-0 left-0 w-full h-1" style={{
                    background: "linear-gradient(to right, #540D6E, #EE4266, #FFD23F, #3BCEAC, #0EAD69)"
                }} />
            </div>

            {showAddModal && <AddStudentModal course={course} onClose={() => setShowAddModal(false)} onSuccess={handleStudentSuccess} />}
            {showCredentialsModal && generatedCredentials.length > 0 && (
                <CredentialsListModal credentials={generatedCredentials} course={course}
                    onClose={() => { setShowCredentialsModal(false); setGeneratedCredentials([]); }} />
            )}
            {studentToRemove && <RemoveStudentModal student={studentToRemove} onConfirm={confirmRemoveStudent} onClose={() => setStudentToRemove(null)} />}
            {ovaToRemove && <RemoveOvaConfirmModal ova={ovaToRemove} onConfirm={confirmRemoveOva} onClose={() => setOvaToRemove(null)} />}
            {showAssignOvaModal && <AssignOvaModal course={course} onClose={() => setShowAssignOvaModal(false)} onSuccess={handleOvaSuccess} />}

            <style>{`
                @keyframes fadeIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
                @keyframes modalIn { from { opacity:0; transform:scale(.96) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }
                @keyframes slideDown { from { opacity:0; transform:translateY(-20px) } to { opacity:1; transform:translateY(0) } }
                .animate-fade-in { animation: fadeIn 0.5s ease-out; }
                .animate-slide-down { animation: slideDown 0.3s ease-out; }
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