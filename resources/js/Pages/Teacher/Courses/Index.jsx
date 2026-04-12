import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import {
    BookOpen, GraduationCap, Users, Search, X, UserPlus, UserX,
    Layers, ChevronRight, ChevronLeft, Copy, Check, AlertCircle,
    Loader2, LogOut, Menu, Calendar, BarChart3,
    Shield, User, Home, TrendingUp,
    Bell, FileText, CheckSquare,
    Upload, Eye, Edit2,
    MessageSquare, PlusCircle, Video,
    FileSpreadsheet, Printer, ListPlus, Award, Trash2
} from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

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
    // Intenta primero con el meta tag (más confiable con Inertia)
    const meta = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (meta) return meta;
    // Fallback: cookie XSRF-TOKEN (viene URL-encoded completo)
    const cookie = document.cookie
        .split('; ')
        .find(r => r.startsWith('XSRF-TOKEN='))
        ?.split('=').slice(1).join('='); // re-join por si el valor tiene '='
    if (cookie) {
        try { return decodeURIComponent(cookie); } catch { return cookie; }
    }
    return '';
};

// ─── MODAL CREDENCIALES (único, sirve para 1 o N estudiantes) ────────────────
function CredentialsListModal({ credentials, course, onClose }) {
    const [copied, setCopied] = useState({});
    const [copiedAll, setCopiedAll] = useState(false);
    const [downloadingPdf, setDownloadingPdf] = useState(false);

    const safe = (credentials || []).filter(
        c => c && typeof c === "object" && c.name && c.username && c.pin
    );

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
        const csv = rows
            .map(r => r.map(escapeCSV).join(","))
            .join("\n");
        const blob = new Blob(["\uFEFF" + csv], {
            type: "text/csv;charset=utf-8;"
        });
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
            const url = `/teacher/courses/${course.id}/students/bulk`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": getCsrfToken(),
                    "Accept": "application/pdf",
                },
                body: JSON.stringify({
                    generate_pdf: "1",
                    students: safe,
                }),
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Response body:", text);
                throw new Error(`Error ${response.status}`);
            }

            const blob = await response.blob();
            const pdfBlob = new Blob([blob], { type: "application/pdf" });
            const blobUrl = URL.createObjectURL(pdfBlob);

            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = "credenciales.pdf";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(blobUrl);
            }, 1000);

        } catch (err) {
            console.error("PDF error:", err);
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
                    <button onClick={copyAll} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg" style={{ backgroundColor: "#F3E8FF", color: "#540D6E" }}>
                        {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copiar todo
                    </button>
                    <button onClick={downloadCSV} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg" style={{ backgroundColor: "#F3E8FF", color: "#540D6E" }}>
                        <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
                    </button>
                    <button
                        onClick={downloadPDF}
                        disabled={downloadingPdf}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg disabled:opacity-60"
                        style={{ backgroundColor: "#F3E8FF", color: "#540D6E" }}
                    >
                        {downloadingPdf
                            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generando...</>
                            : <><Printer className="w-3.5 h-3.5" /> PDF</>
                        }
                    </button>
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
            { student_id: selected.id },
            {
                preserveScroll: true,
                onFinish: () => setSubmitting(false),
                onSuccess: () => onClose(),
            }
        );
    };

    const handleCreateSingle = () => {
        if (submitting || !singleName.trim()) return;
        const name = singleName.trim();
        setSubmitting(true);
        router.post(
            route("teacher.courses.students.store", course.id),
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
            route("teacher.courses.students.bulk", course.id),
            { students: studentsList },
            {
                preserveScroll: true,
                onFinish: () => setSubmitting(false),
                onSuccess: (page) => {
                    const bulk = page.props.flash?.bulk_credentials;
                    onClose();
                    if (bulk && bulk.length > 0) {
                        onSuccess?.(bulk.filter(c => c && c.name && c.username && c.pin));
                    }
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
                        header: true,
                        skipEmptyLines: true,
                        complete: res => {
                            rows = res.data;
                            resolve();
                        }
                    });
                });
            } else {
                const buf = await file.arrayBuffer();
                const wb = XLSX.read(buf);
                rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
            }
        } catch {
            alert("No se pudo leer el archivo."); return;
        }

        const students = rows
            .map(r => ({
                name: (r.name || r.nombre || r.Nombre || r.Name || r.estudiante || r.alumno || "").trim()
            }))
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
                                    {loading
                                        ? <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                                        : <Search className="w-4 h-4 text-slate-400" />}
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

// ─── MODAL RETIRAR ───────────────────────────────────────────────────────────
function RemoveStudentModal({ student, onConfirm, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" style={{ animation: "modalIn 0.2s ease-out" }}>
                <div className="h-1" style={{ background: "linear-gradient(to right, #EE4266, #FFD23F)" }} />
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#FEE2E2" }}>
                            <UserX className="w-4 h-4" style={{ color: "#EE4266" }} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Retirar estudiante</h3>
                            <p className="text-xs text-slate-500">El estudiante seguirá registrado en el sistema</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl border" style={{ backgroundColor: "#FEE2E210", borderColor: "#EE426630" }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #540D6E, #EE4266)" }}>
                            {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                            <p className="text-xs text-slate-500">@{student.username}</p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600">¿Confirmas retirar a este estudiante del curso? Podrás volver a agregarlo después.</p>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
                        <button onClick={onConfirm}
                            className="flex-1 py-2.5 text-sm font-bold text-white rounded-xl transition-all"
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

// ─── MODAL ASIGNAR OVAS (CORREGIDO COMPLETAMENTE) ─────────────────────────────
function AssignOvaModal({ course, onClose, onSuccess }) {
    const [availableOvas, setAvailableOvas] = useState([]);
    const [selectedOvas, setSelectedOvas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadAvailableOvas();
    }, [course.id]);

    const loadAvailableOvas = async () => {
        setLoading(true);
        setError(null);
        try {
            // Usar Inertia para la petición GET también
            const response = await fetch(`/teacher/courses/${course.id}/ovas/available`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
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
            
            const data = await response.json();
            
            let ovasArray = [];
            if (data && Array.isArray(data)) {
                ovasArray = data;
            } else if (data && data.data && Array.isArray(data.data)) {
                ovasArray = data.data;
            } else if (data && data.success && data.data && Array.isArray(data.data)) {
                ovasArray = data.data;
            }
            
            setAvailableOvas(ovasArray);
        } catch (error) {
            console.error('Error loading OVAs:', error);
            setError('No se pudieron cargar los OVAs disponibles.');
            setAvailableOvas([]);
        } finally {
            setLoading(false);
        }
    };
const handleAssign = async () => {
    if (selectedOvas.length === 0) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
        const token = getCsrfToken();
        
        const response = await fetch(route('teacher.courses.ovas.assign', course.id), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token,
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'same-origin',
            body: JSON.stringify({ ova_ids: selectedOvas })
        });
        
        if (response.status === 419) {
            alert('La sesión ha expirado. Recargando la página...');
            window.location.reload();
            return;
        }
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            // Actualizar la lista de OVAs
            if (result.data && Array.isArray(result.data)) {
                if (onSuccess) await onSuccess(result.data);
            } else {
                if (onSuccess) await onSuccess();
            }
            onClose();
        } else {
            setError(result.message || 'Error al asignar los OVAs');
        }
    } catch (err) {
        console.error('Assignment error:', err);
        setError('Error de red al asignar los OVAs');
    } finally {
        setSubmitting(false);
    }
};

    const toggleSelect = (ovaId) => {
        setSelectedOvas(prev => 
            prev.includes(ovaId) 
                ? prev.filter(id => id !== ovaId)
                : [...prev, ovaId]
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden" style={{ animation: "modalIn 0.2s ease-out" }}>
                <div className="h-1" style={{ background: "linear-gradient(to right, #540D6E, #EE4266)" }} />
                
                <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#F3E8FF" }}>
                            <Layers className="w-5 h-5" style={{ color: "#540D6E" }} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Asignar OVAs al curso</h2>
                            <p className="text-sm text-slate-500">Selecciona los recursos que estarán disponibles</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="px-6 py-4 overflow-y-auto" style={{ maxHeight: "calc(85vh - 180px)" }}>
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
                            <p className="text-sm text-slate-500">{error}</p>
                            <button 
                                onClick={loadAvailableOvas}
                                className="mt-4 px-4 py-2 text-sm font-semibold text-white rounded-lg"
                                style={{ backgroundColor: "#540D6E" }}>
                                Reintentar
                            </button>
                        </div>
                    ) : availableOvas.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#F3E8FF" }}>
                                <Layers className="w-8 h-8" style={{ color: "#540D6E" }} />
                            </div>
                            <p className="text-base font-semibold text-slate-700 mb-1">No hay OVAs disponibles</p>
                            <p className="text-sm text-slate-400">Todos los OVAs ya están asignados a este curso</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {availableOvas.map(ova => (
                                <div
                                    key={ova.id}
                                    onClick={() => toggleSelect(ova.id)}
                                    className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${
                                        selectedOvas.includes(ova.id)
                                            ? 'border-purple-600 bg-purple-50'
                                            : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: selectedOvas.includes(ova.id) ? "#540D6E20" : "#F1F5F9" }}>
                                            <Video className="w-5 h-5" style={{ color: selectedOvas.includes(ova.id) ? "#540D6E" : "#64748B" }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-900">{ova.title}</h4>
                                            <p className="text-sm text-slate-500 line-clamp-2">{ova.description || "Sin descripción"}</p>
                                            {ova.duration && (
                                                <p className="text-xs text-slate-400 mt-1">Duración: {ova.duration} min</p>
                                            )}
                                        </div>
                                        <div className="flex-shrink-0">
                                            <input
                                                type="checkbox"
                                                checked={selectedOvas.includes(ova.id)}
                                                onChange={() => {}}
                                                className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex gap-3 justify-end">
                    <button onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        Cancelar
                    </button>
                    <button onClick={handleAssign}
                        disabled={selectedOvas.length === 0 || submitting || loading}
                        className="px-4 py-2 text-sm font-bold text-white rounded-lg transition-all disabled:opacity-40 flex items-center gap-2"
                        style={{ backgroundColor: "#540D6E" }}
                        onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = "#6B1689")}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}>
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                        Asignar ({selectedOvas.length})
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────
export default function TeacherCourseShow({ course, students, courseOvas = [] }) {
    const { props } = usePage();
    const teacher = props.auth?.user ?? { name: "Docente", email: "docente@educacion.edu" };

    const [tab, setTab] = useState("students");
    const [showAddModal, setShowAddModal] = useState(false);
    const [generatedCredentials, setGeneratedCredentials] = useState([]);
    const [showCredentialsModal, setShowCredentialsModal] = useState(false);
    const [studentToRemove, setStudentToRemove] = useState(null);
    const [search, setSearch] = useState("");
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        if (typeof window !== "undefined") return localStorage.getItem("teacherSidebarOpen") !== "false";
        return true;
    });
    
    // Estado para OVAs - Inicializar con los datos del servidor
    const [ovas, setOvas] = useState(courseOvas);
    const [showAssignOvaModal, setShowAssignOvaModal] = useState(false);

    useEffect(() => {
        localStorage.setItem("teacherSidebarOpen", String(sidebarOpen));
    }, [sidebarOpen]);

    // Función para cargar las OVAs actualizadas
    const loadOvas = async () => {
        try {
            const response = await fetch(`/teacher/courses/${course.id}/ovas`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin'
            });
            
            if (response.ok) {
                const data = await response.json();
                let ovasArray = [];
                if (data && Array.isArray(data)) {
                    ovasArray = data;
                } else if (data && data.data && Array.isArray(data.data)) {
                    ovasArray = data.data;
                } else if (data && data.success && data.data && Array.isArray(data.data)) {
                    ovasArray = data.data;
                }
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

    const confirmRemove = () => {
        if (!studentToRemove) return;
        router.delete(
            route("teacher.courses.students.destroy", [course.id, studentToRemove.id]),
            { onSuccess: () => setStudentToRemove(null) }
        );
    };

    // Función que se ejecuta después de asignar OVAs exitosamente
    const handleOvaSuccess = async () => {
        await loadOvas(); // Recargar la lista de OVAs
        setShowAssignOvaModal(false); // Cerrar el modal
    };

    // Función para remover OVA
    const handleRemoveOva = async (ovaId) => {
        if (!confirm('¿Remover este OVA del curso?')) return;
        try {
            const token = getCsrfToken();

            const response = await fetch(`/teacher/courses/${course.id}/ovas/${ovaId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin'
            });

            if (response.status === 419) {
                alert('La sesión ha expirado. Recargando la página...');
                window.location.reload();
                return;
            }

            if (response.status === 403) {
                alert('No tienes permiso para realizar esta acción.');
                return;
            }

            const result = await response.json().catch(() => null);

            if (response.ok && result?.success) {
                if (result.data && Array.isArray(result.data)) {
                    setOvas(result.data);
                } else {
                    await loadOvas();
                }
            } else {
                const msg = result?.message || `Error ${response.status} al remover el OVA`;
                console.error('Remove OVA error:', msg, result);
                alert(msg);
            }
        } catch (error) {
            console.error('Remove OVA exception:', error);
            alert('Error de red al remover el OVA. Revisa la consola para más detalles.');
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.username ?? "").toLowerCase().includes(search.toLowerCase())
    );

    const navigation = {
        principal: [
            { name: "Dashboard", href: route("teacher.dashboard"), icon: Home, current: false },
            { name: "Mis Cursos", href: route("teacher.dashboard"), icon: BookOpen, current: true },
            { name: "Calendario", href: "#", icon: Calendar, current: false },
        ],
        academic: [
            { name: "Materiales", href: "#", icon: FileText, current: false },
            { name: "Reportes", href: "#", icon: BarChart3, current: false },
        ],
    };

    const pageTabs = [
        { id: "students", label: "Estudiantes", icon: Users, count: students.length },
        { id: "details", label: "Detalles del Curso", icon: BookOpen, count: null },
        { id: "ovas", label: "Recursos OVAs", icon: Layers, count: ovas.length },
    ];

    const recentActivities = [
        { id: 1, description: "María González se unió al curso", time: "Hace 2 horas", icon: UserPlus, color: "#0EAD69" },
        { id: 2, description: "Nuevo material: Guía de ejercicios", time: "Hace 5 horas", icon: Upload, color: "#FFD23F" },
        { id: 3, description: "Evaluación parcial calificada", time: "Ayer", icon: Award, color: "#540D6E" },
    ];

    return (
        <>
            <Head title={`${GRADE_LABELS[course.grade] ?? course.grade} — Sección ${course.section}`} />

            {mobileSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
            )}
            <button onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden fixed bottom-4 right-4 z-30 p-3 rounded-full shadow-lg text-white"
                style={{ backgroundColor: "#540D6E" }}>
                <Menu className="w-6 h-6" />
            </button>

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out
                ${sidebarOpen ? "w-72" : "w-20"}
                ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
                <div className="h-full bg-white/90 backdrop-blur-xl border-r border-gray-200 shadow-xl flex flex-col">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <div className={`flex items-center gap-2 ${!sidebarOpen && "lg:justify-center w-full"}`}>
                            <div className="p-2 rounded-lg" style={{ backgroundColor: "#540D6E20" }}>
                                <GraduationCap className="w-6 h-6" style={{ color: "#540D6E" }} />
                            </div>
                            {sidebarOpen && (
                                <div>
                                    <span className="font-bold text-lg text-gray-900">EVA Platform</span>
                                    <p className="text-xs text-gray-500">Docente</p>
                                </div>
                            )}
                        </div>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:block p-1.5 rounded-lg hover:bg-gray-100">
                            {sidebarOpen ? <ChevronLeft className="w-4 h-4 text-gray-600" /> : <ChevronRight className="w-4 h-4 text-gray-600" />}
                        </button>
                    </div>
                    <nav className="flex-1 overflow-y-auto py-4 px-2">
                        {Object.entries(navigation).map(([key, items]) => (
                            <div key={key} className="mb-4">
                                {sidebarOpen && (
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                                        {key === 'principal' ? 'Principal' : 'Académico'}
                                    </p>
                                )}
                                <ul className="space-y-1">
                                    {items.map(item => {
                                        const Icon = item.icon;
                                        return (
                                            <li key={item.name}>
                                                <Link href={item.href}
                                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${item.current ? "text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"}`}
                                                    style={item.current ? { backgroundColor: "#540D6E" } : {}}>
                                                    <Icon className={`w-5 h-5 flex-shrink-0 ${!sidebarOpen && "mx-auto"}`} />
                                                    {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                                                    {!sidebarOpen && (
                                                        <span className="absolute left-full ml-6 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
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
                        <div className="flex items-center gap-3 px-3 py-2.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${!sidebarOpen && "mx-auto"}`}
                                style={{ background: "linear-gradient(to bottom right, #540D6E, #EE4266)" }}>
                                {teacher?.name?.charAt(0)?.toUpperCase() ?? "D"}
                            </div>
                            {sidebarOpen && (
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium text-gray-800 truncate">{teacher?.name}</span>
                                    <span className="text-xs text-gray-400 truncate">{teacher?.email}</span>
                                </div>
                            )}
                        </div>
                        <Link href={route("logout")} method="post" as="button"
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all group relative">
                            <LogOut className={`w-5 h-5 flex-shrink-0 ${!sidebarOpen && "mx-auto"}`} />
                            {sidebarOpen && <span className="text-sm font-medium">Cerrar Sesión</span>}
                            {!sidebarOpen && (
                                <span className="absolute left-full ml-6 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                    Cerrar Sesión
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main className={`transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:ml-72" : "lg:ml-20"} min-h-screen bg-gray-50`}>
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">

                        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                            <Link href={route("teacher.dashboard")} className="hover:text-purple-600 transition-colors">Mis Cursos</Link>
                            <span>/</span>
                            <span style={{ color: "#540D6E" }} className="font-medium">
                                {GRADE_LABELS[course.grade] ?? course.grade} — Sección {course.section}
                            </span>
                        </div>

                        <div className="mb-8 animate-fade-in">
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
                                <div className="flex items-center gap-3">
                                    <button className="relative p-2.5 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                                        <Bell className="w-5 h-5 text-gray-600" />
                                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: "#EE4266" }} />
                                    </button>
                                    <button className="p-2.5 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                                        <MessageSquare className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[
                                { label: "Estudiantes", value: students.length, sub: "Inscritos en el curso", Icon: Users, bg: "#F3E8FF", color: "#540D6E" },
                                { label: "Rendimiento", value: "87%", sub: "Promedio general", Icon: Award, bg: "#E8F5F0", color: "#0EAD69" },
                                { label: "Asistencia", value: "92%", sub: "Promedio del curso", Icon: CheckSquare, bg: "#FFF4E0", color: "#FFD23F" },
                                { label: "OVAs", value: ovas.length, sub: "Recursos disponibles", Icon: Layers, bg: "#FEE2E2", color: "#EE4266" },
                            ].map(({ label, value, sub, Icon, bg, color }) => (
                                <div key={label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className="p-3 rounded-lg" style={{ backgroundColor: bg }}>
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

                        {/* Tab nav */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
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

                        {/* ── Estudiantes ── */}
                        {tab === "students" && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                            <input type="text"
                                                placeholder="Buscar estudiante por nombre o username..."
                                                value={search}
                                                onChange={e => setSearch(e.target.value)}
                                                className="w-full pl-9 pr-9 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none transition-all"
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
                                            className="px-4 py-3 text-sm font-bold text-white rounded-lg transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                                            style={{ backgroundColor: "#540D6E" }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}>
                                            <UserPlus className="w-4 h-4" /> Agregar Estudiante
                                        </button>
                                    </div>
                                </div>

                                {filteredStudents.length > 0 ? (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-50 border-b border-gray-200">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Estudiante</th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Usuario</th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Correo</th>
                                                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {filteredStudents.map(student => (
                                                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                                                        style={{ background: "linear-gradient(to bottom right, #540D6E, #EE4266)" }}>
                                                                        {getInitials(student.name)}
                                                                    </div>
                                                                    <span className="text-sm font-semibold text-gray-900">{student.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="text-sm font-mono text-gray-600">@{student.username}</span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="text-sm text-gray-500">{student.email || "—"}</span>
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
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 py-16 text-center">
                                        {search ? (
                                            <>
                                                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-base font-semibold text-gray-500">No hay resultados para "{search}"</p>
                                                <button onClick={() => setSearch("")} className="text-sm mt-2 hover:underline" style={{ color: "#540D6E" }}>
                                                    Limpiar búsqueda
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                                    style={{ background: "linear-gradient(135deg, #540D6E10, #EE426610)" }}>
                                                    <Users className="w-10 h-10" style={{ color: "#540D6E40" }} />
                                                </div>
                                                <p className="text-base font-bold text-gray-700 mb-1">No hay estudiantes inscritos</p>
                                                <p className="text-sm text-gray-400 mb-4">Comienza agregando estudiantes al curso</p>
                                                <button onClick={() => setShowAddModal(true)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg"
                                                    style={{ backgroundColor: "#540D6E" }}>
                                                    <UserPlus className="w-4 h-4" /> Agregar Estudiante
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Detalles ── */}
                        {tab === "details" && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                                <div className="lg:col-span-2">
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
                                            <div className="p-2 rounded-lg" style={{ backgroundColor: "#F3E8FF" }}>
                                                <BookOpen className="w-5 h-5" style={{ color: "#540D6E" }} />
                                            </div>
                                            <h2 className="text-lg font-bold text-gray-900">Información del Curso</h2>
                                        </div>
                                        <div className="p-6">
                                            <dl className="grid grid-cols-2 gap-4">
                                                {[
                                                    { label: "Grado", value: GRADE_LABELS[course.grade] ?? course.grade },
                                                    { label: "Sección", value: course.section },
                                                    { label: "Año Escolar", value: course.school_year },
                                                ].map(item => (
                                                    <div key={item.label} className="p-4 rounded-lg" style={{ backgroundColor: "#F8FAFC" }}>
                                                        <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{item.label}</dt>
                                                        <dd className="text-lg font-bold text-gray-900">{item.value}</dd>
                                                    </div>
                                                ))}
                                                <div className="p-4 rounded-lg" style={{ backgroundColor: "#F8FAFC" }}>
                                                    <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Estado</dt>
                                                    <dd className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${course.is_active ? "animate-pulse" : ""}`}
                                                            style={{ backgroundColor: course.is_active ? "#0EAD69" : "#94A3B8" }} />
                                                        <span className="text-lg font-bold" style={{ color: course.is_active ? "#0EAD69" : "#94A3B8" }}>
                                                            {course.is_active ? "Activo" : "Inactivo"}
                                                        </span>
                                                    </dd>
                                                </div>
                                                {course.description && (
                                                    <div className="col-span-2 p-4 rounded-lg" style={{ backgroundColor: "#F8FAFC" }}>
                                                        <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Descripción</dt>
                                                        <dd className="text-sm text-gray-700">{course.description}</dd>
                                                    </div>
                                                )}
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
                                            <div className="p-2 rounded-lg" style={{ backgroundColor: "#FFF4E0" }}>
                                                <TrendingUp className="w-5 h-5" style={{ color: "#FFD23F" }} />
                                            </div>
                                            <h2 className="text-lg font-bold text-gray-900">Actividad Reciente</h2>
                                        </div>
                                        <div className="divide-y divide-gray-100">
                                            {recentActivities.map(a => (
                                                <div key={a.id} className="p-4 hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${a.color}15` }}>
                                                            <a.icon className="w-4 h-4" style={{ color: a.color }} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-700">{a.description}</p>
                                                            <p className="text-xs text-gray-400 mt-1">{a.time}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── OVAs ── */}
                        {tab === "ovas" && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="flex justify-end">
                                    <button 
                                        onClick={() => setShowAssignOvaModal(true)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg shadow-sm hover:shadow-md transition-all"
                                        style={{ backgroundColor: "#540D6E" }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}>
                                        <PlusCircle className="w-4 h-4" /> Asignar OVAs
                                    </button>
                                </div>

                                {ovas.length === 0 ? (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 py-16 text-center">
                                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                            style={{ background: "linear-gradient(135deg, #540D6E10, #EE426610)" }}>
                                            <Layers className="w-10 h-10" style={{ color: "#540D6E40" }} />
                                        </div>
                                        <p className="text-base font-bold text-gray-700 mb-1">No hay OVAs asignados</p>
                                        <p className="text-sm text-gray-400 mb-4">Comienza asignando recursos OVA al curso</p>
                                        <button 
                                            onClick={() => setShowAssignOvaModal(true)}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg"
                                            style={{ backgroundColor: "#540D6E" }}>
                                            <PlusCircle className="w-4 h-4" /> Asignar OVAs
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {ovas.map(ova => (
                                            <div key={ova.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                                                <div className="p-5">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-start gap-3 flex-1">
                                                            <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: "#F3E8FF" }}>
                                                                <Video className="w-5 h-5" style={{ color: "#540D6E" }} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h3 className="font-bold text-gray-900">{ova.title}</h3>
                                                                <p className="text-sm text-gray-500 mt-1">{ova.description || "Sin descripción"}</p>
                                                                {ova.duration && (
                                                                    <p className="text-xs text-gray-400 mt-2">Duración: {ova.duration} minutos</p>
                                                                )}
                                                                {ova.url && (
                                                                    <a 
                                                                        href={ova.url} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer"
                                                                        className="text-xs text-purple-600 hover:text-purple-700 mt-2 inline-flex items-center gap-1">
                                                                        <Eye className="w-3 h-3" /> Ver recurso
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleRemoveOva(ova.id)}
                                                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </main>

            {/* Fondo */}
            <div className="fixed inset-0 -z-10 bg-gray-50">
                <div className="absolute inset-0" style={{
                    backgroundImage: "radial-gradient(circle at 1px 1px, rgba(84,13,110,0.05) 1px, transparent 0)",
                    backgroundSize: "40px 40px"
                }} />
                <div className="absolute top-0 left-0 w-full h-1" style={{
                    background: "linear-gradient(to right, #540D6E, #EE4266, #FFD23F, #3BCEAC, #0EAD69)"
                }} />
            </div>

            {/* ── Modales ── */}
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
                    onClose={() => { setShowCredentialsModal(false); setGeneratedCredentials([]); }}
                />
            )}

            {studentToRemove && (
                <RemoveStudentModal
                    student={studentToRemove}
                    onConfirm={confirmRemove}
                    onClose={() => setStudentToRemove(null)}
                />
            )}

            {showAssignOvaModal && (
                <AssignOvaModal
                    course={course}
                    onClose={() => setShowAssignOvaModal(false)}
                    onSuccess={handleOvaSuccess}
                />
            )}

            <style>{`
                @keyframes fadeIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
                @keyframes modalIn { from { opacity:0; transform:scale(.96) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }
                .animate-fade-in { animation: fadeIn 0.5s ease-out; }
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