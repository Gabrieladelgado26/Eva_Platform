import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import {
    ArrowLeft, Users, Search, X, UserPlus, UserX, Upload,
    ListPlus, Copy, Check, AlertCircle, Loader2, Calendar,
    GraduationCap, Trash2, FileSpreadsheet, Printer, Eye, CheckCircle,
    Filter, RotateCcw, Download, ChevronDown, FileText
} from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import AppSidebar, { useSidebarState } from "@/Components/AppSidebar";

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
    // Cookie is freshest — Laravel updates XSRF-TOKEN on every response
    const xsrf = document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='));
    if (xsrf) {
        try { return decodeURIComponent(xsrf.split('=')[1]); }
        catch  { return xsrf.split('=')[1]; }
    }
    // Fallback: meta tag
    return document.querySelector('meta[name="csrf-token"]')?.content ?? '';
};

// ─── TOAST NOTIFICATION ───────────────────────────────────────────────────────
function ToastNotification({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-50 border-green-300' : type === 'error' ? 'bg-red-50 border-red-300' : 'bg-blue-50 border-blue-300';
    const textColor = type === 'success' ? 'text-green-800' : type === 'error' ? 'text-red-800' : 'text-blue-800';
    
    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
            <div className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border ${bgColor}`}>
                {type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                {type === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
                <span className={`text-sm font-medium ${textColor}`}>{message}</span>
                <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                </button>
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
                    route("admin.courses.students.search", course.id) + `?q=${encodeURIComponent(query)}`
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
            route("admin.courses.students.store", course.id),
            { student_id: selected.id },
            { preserveScroll: true, onFinish: () => setSubmitting(false), onSuccess: () => onClose() }
        );
    };

    const handleCreateSingle = () => {
        if (submitting || !singleName.trim()) return;
        const name = singleName.trim();
        setSubmitting(true);
        router.post(
            route("admin.courses.students.store", course.id),
            { name },
            {
                preserveScroll: true,
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
            route("admin.courses.students.bulk", course.id),
            { students: studentsList },
            {
                preserveScroll: true,
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
        const rows = [["Nombre", "Usuario", "PIN"], ...safe.map(c => [c.name, c.username, c.pin])];
        const csv = rows.map(r => r.map(escapeCSV).join(",")).join("\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `credenciales_${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
        setShowDownloadOptions(false);
    };

    const downloadPDF = async () => {
        if (downloadingPdf) return;
        setShowDownloadOptions(false);
        setDownloadingPdf(true);
        try {
            const response = await fetch(`/admin/courses/${course.id}/students/bulk`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": getCsrfToken(),
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

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function AdminCourseStudents({ course, students }) {
    const { props } = usePage();
    const flash = props.flash || {};
    const [collapsed] = useSidebarState();

    const [search, setSearch] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showCredentialsModal, setShowCredentialsModal] = useState(false);
    const [studentToRemove, setStudentToRemove] = useState(null);
    const [generatedCredentials, setGeneratedCredentials] = useState([]);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    useEffect(() => {
        if (flash?.success) {
            showToast(flash.success, 'success');
        }
        if (flash?.error) {
            showToast(flash.error, 'error');
        }
    }, [flash]);

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.username ?? "").toLowerCase().includes(search.toLowerCase())
    );

    const handleStudentSuccess = (creds) => {
        const valid = (creds || []).filter(c => c && c.name && c.username && c.pin);
        if (valid.length === 0) return;
        setGeneratedCredentials(valid);
        setShowCredentialsModal(true);
    };

    const confirmRemoveStudent = () => {
        if (!studentToRemove) return;
        router.delete(
            route("admin.courses.students.destroy", [course.id, studentToRemove.id]),
            { 
                onSuccess: () => {
                    setStudentToRemove(null);
                    showToast('Estudiante retirado del curso', 'success');
                },
                onError: () => {
                    showToast('Error al retirar el estudiante', 'error');
                }
            }
        );
    };

    const hasSearchFilter = search !== "";

    return (
        <>
            <Head title={`Estudiantes - ${GRADE_LABELS[course.grade] ?? course.grade} ${course.section}`} />
            <AppSidebar currentRoute="admin.courses.students" />

            {/* Toast */}
            {toast && (
                <ToastNotification 
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
                                <Link href={route("admin.dashboard")} className="hover:text-purple-600 transition-colors">
                                    Panel de Control
                                </Link>
                                <span>/</span>
                                <Link href={route("admin.courses.index")} className="hover:text-purple-600 transition-colors">
                                    Cursos
                                </Link>
                                <span>/</span>
                                <span style={{ color: "#540D6E" }} className="font-medium">
                                    {GRADE_LABELS[course.grade] ?? course.grade} {course.section}
                                </span>
                                <span>/</span>
                                <span style={{ color: "#540D6E" }} className="font-medium">
                                    Estudiantes
                                </span>
                            </div>
                        </div>

                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-4 rounded-xl shadow-sm border" style={{ backgroundColor: "white", borderColor: "#540D6E" }}>
                                        <Users className="w-10 h-10" style={{ color: "#540D6E" }} />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                            Estudiantes del Curso
                                        </h1>
                                        <div className="flex flex-wrap items-center gap-3 text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <GraduationCap className="w-4 h-4" />
                                                {GRADE_LABELS[course.grade] ?? course.grade} {course.section}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                Año {course.school_year}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {students.length} estudiantes inscritos
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    href={route("admin.courses.index")}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Volver al Curso
                                </Link>
                            </div>
                        </div>

                        {/* Filtros - Estilo mejorado */}
                        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar estudiante por nombre o username..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="w-full pl-12 pr-10 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all hover:border-gray-300"
                                        style={{ "--tw-ring-color": "rgba(84, 13, 110, 0.2)" }}
                                        onFocus={e => e.currentTarget.style.borderColor = "#540D6E"}
                                        onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
                                    />
                                    {search && (
                                        <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="px-6 py-3 text-sm font-bold text-white rounded-lg transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                                    style={{ backgroundColor: "#540D6E" }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}
                                >
                                    <UserPlus className="w-5 h-5" /> Agregar Estudiante
                                </button>
                            </div>
                        </div>

                        {/* Indicador de filtros activos */}
                        {hasSearchFilter && (
                            <div className="mb-6">
                                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg" style={{ backgroundColor: "#F3E8FF" }}>
                                            <Filter className="w-4 h-4" style={{ color: "#540D6E" }} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Búsqueda Activa</p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-medium"
                                                    style={{ backgroundColor: "#F3E8FF", borderColor: "#540D6E", color: "#540D6E" }}>
                                                    Búsqueda: "{search}"
                                                    <button onClick={() => setSearch("")} className="hover:bg-white/50 p-0.5 rounded">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => setSearch("")} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all">
                                        <RotateCcw className="w-4 h-4" /> Limpiar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Tabla de estudiantes */}
                        {filteredStudents.length > 0 ? (
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">#</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                    <div className="flex items-center gap-2"><Users className="w-4 h-4" /> Estudiante</div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                    <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Usuario</div>
                                                </th>
                                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                    <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Estado</div>
                                                </th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wide">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredStudents.map((student, idx) => (
                                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-gray-500 font-medium">{idx + 1}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                                                                style={{ background: "linear-gradient(135deg, #540D6E, #EE4266)" }}>
                                                                {getInitials(student.name)}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold text-gray-900">{student.name}</p>
                                                                {student.email && (
                                                                    <p className="text-xs text-gray-500">{student.email}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded-md">@{student.username}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border"
                                                            style={student.is_active ? 
                                                                { backgroundColor: "#E8F5F0", borderColor: "#3BCEAC" } : 
                                                                { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }
                                                            }>
                                                            <div className={`w-2 h-2 rounded-full ${student.is_active ? "animate-pulse" : ""}`}
                                                                style={{ backgroundColor: student.is_active ? "#0EAD69" : "#9CA3AF" }} />
                                                            <span className="text-xs font-medium" 
                                                                style={{ color: student.is_active ? "#0EAD69" : "#6B7280" }}>
                                                                {student.is_active ? "Activo" : "Inactivo"}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => setStudentToRemove(student)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all"
                                                            style={{ color: "#EE4266", backgroundColor: "#FEE2E2" }}
                                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FECACA"}
                                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#FEE2E2"}
                                                        >
                                                            <UserX className="w-3.5 h-3.5" /> Retirar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                    <p className="text-sm text-gray-600">
                                        Mostrando <strong>{filteredStudents.length}</strong> de <strong>{students.length}</strong> estudiantes
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                                <div className="text-center py-16 px-6">
                                    {search ? (
                                        <>
                                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-sm"
                                                style={{ background: "linear-gradient(to bottom right, #540D6E, #EE4266)" }}>
                                                <Search className="w-10 h-10 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron estudiantes</h3>
                                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                                No hay resultados para "{search}"
                                            </p>
                                            <button 
                                                onClick={() => setSearch("")}
                                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
                                            >
                                                <RotateCcw className="w-5 h-5" /> Limpiar Búsqueda
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-sm"
                                                style={{ background: "linear-gradient(to bottom right, #540D6E, #EE4266)" }}>
                                                <Users className="w-10 h-10 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">No hay estudiantes inscritos</h3>
                                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                                Comienza agregando estudiantes al curso
                                            </p>
                                            <button
                                                onClick={() => setShowAddModal(true)}
                                                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                                                style={{ backgroundColor: "#540D6E" }}
                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}
                                            >
                                                <UserPlus className="w-5 h-5" /> Agregar Estudiante
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modales */}
            {showAddModal && (
                <AddStudentModal 
                    course={course} 
                    onClose={() => setShowAddModal(false)} 
                    onSuccess={handleStudentSuccess}
                />
            )}
            {showCredentialsModal && generatedCredentials.length > 0 && (
                <CredentialsListModal 
                    credentials={generatedCredentials} 
                    course={course}
                    onClose={() => { 
                        setShowCredentialsModal(false); 
                        setGeneratedCredentials([]); 
                    }} 
                />
            )}
            {studentToRemove && (
                <RemoveStudentModal 
                    student={studentToRemove} 
                    onConfirm={confirmRemoveStudent} 
                    onClose={() => setStudentToRemove(null)} 
                />
            )}

            <style>{`
                @keyframes fadeIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
                @keyframes modalIn { from { opacity:0; transform:scale(.96) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }
                @keyframes slideDown { from { opacity:0; transform:translateY(-20px) } to { opacity:1; transform:translateY(0) } }
                .animate-fade-in { animation: fadeIn 0.5s ease-out; }
                .animate-slide-down { animation: slideDown 0.3s ease-out; }
            `}</style>
        </>
    );
}