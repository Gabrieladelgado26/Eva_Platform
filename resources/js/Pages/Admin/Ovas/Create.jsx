import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowLeft, Layers, Check, Loader2, AlertCircle, Info, BookOpen,
    Globe, FileText, Tag, ExternalLink
} from "lucide-react";
import { useState } from "react";

// ──────────────────────────────────────────────
// Materias fijas del sistema
// ──────────────────────────────────────────────
const AREAS = [
    "Ciencias Naturales",
    "Ciencias Sociales",
    "Español",
    "Matemáticas",
    "Inglés",
];

// ──────────────────────────────────────────────
// OVAs disponibles en resources/js/Pages/OVA/
// El valor (path) es la ruta que se abrirá con window.open.
// Ajusta los paths según tus rutas reales de Laravel/Inertia.
// ──────────────────────────────────────────────
const OVA_RECURSOS = [
    { label: "Ciencias Naturales", path: "/ova/index" },
    { label: "Ciencias Sociales",  path: "/ova/ciencias-sociales"  },
    { label: "Español",            path: "/ova/espanol"            },
    { label: "Matemáticas",        path: "/ova/matematicas"        },
    { label: "Inglés",             path: "/ova/ingles"             },
];

export default function Create() {
    const { data, setData, post, errors, processing } = useForm({
        area:        "",
        tematica:    "",
        description: "",
        url:         "",
        is_active:   true,
    });

    const [focusedField, setFocusedField] = useState(null);

    // ── Abrir el recurso OVA en ventana emergente (no pantalla completa) ──
    function abrirRecurso() {
        if (!data.url) return;

        const ancho = Math.min(1100, window.screen.width  * 0.85);
        const alto  = Math.min(750,  window.screen.height * 0.85);
        const left  = Math.round((window.screen.width  - ancho) / 2);
        const top   = Math.round((window.screen.height - alto)  / 2);

        const features = [
            `width=${Math.round(ancho)}`,
            `height=${Math.round(alto)}`,
            `left=${left}`,
            `top=${top}`,
            "resizable=yes",
            "scrollbars=yes",
            "toolbar=no",
            "menubar=no",
            "location=no",
            "status=no",
        ].join(",");

        window.open(data.url, "ova_recurso", features);
    }

    function submit(e) {
        e.preventDefault();
        post(route("admin.ovas.store"));
    }

    const isFieldValid = (field) => {
        if (!data[field]) return false;
        if (field === "area")     return data.area.length >= 2;
        if (field === "tematica") return data.tematica.length >= 3;
        if (field === "url")      return data.url.length > 0;
        return true;
    };

    const completedFields =
        (data.area        ? 1 : 0) +
        (data.tematica    ? 1 : 0) +
        (data.description ? 1 : 0) +
        (data.url         ? 1 : 0);

    const progress = Math.round((completedFields / 4) * 100);

    return (
        <>
            <Head title="Crear Nueva OVA" />

            {/* Fondo decorativo */}
            <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-50">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(84,13,110,0.08) 1px, transparent 0)`,
                        backgroundSize: "40px 40px",
                    }}
                />
                <div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{
                        background: "linear-gradient(to right,#540D6E,#EE4266,#FFD23F,#3BCEAC,#0EAD69)",
                    }}
                />
            </div>

            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-5xl mx-auto">

                    {/* Header */}
                    <div className="mb-12 animate-fade-in">
                        <Link
                            href={route("admin.ovas.index")}
                            className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-8 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/80"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                            <span>Volver al Panel de OVAs</span>
                        </Link>

                        <div className="flex items-start gap-4 mb-6">
                            <div
                                className="p-4 rounded-xl shadow-sm border"
                                style={{ backgroundColor: "white", borderColor: "#540D6E" }}
                            >
                                <Layers className="w-10 h-10" style={{ color: "#540D6E" }} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                    Registro de Nueva OVA
                                </h1>
                                <p className="text-gray-600 text-base">
                                    Complete el formulario con la información del Objeto Virtual de Aprendizaje
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <BookOpen className="w-4 h-4" />
                            <span>Gestión De Contenido</span>
                            <span>/</span>
                            <span>OVAs</span>
                            <span>/</span>
                            <span className="font-medium" style={{ color: "#540D6E" }}>Nueva OVA</span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">

                        {/* ── Formulario principal ── */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slide-up">

                                {/* Barra de progreso */}
                                <div className="h-1 bg-gray-100 relative overflow-hidden">
                                    <div
                                        className="absolute inset-y-0 left-0 transition-all duration-500 ease-out"
                                        style={{
                                            width: `${progress}%`,
                                            background: "linear-gradient(to right,#540D6E,#EE4266)",
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                                    </div>
                                </div>

                                <form onSubmit={submit} className="p-8 lg:p-10 space-y-8">

                                    {/* Sección: Información */}
                                    <div className="border-b border-gray-200 pb-4 mb-6">
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Información del Recurso Educativo
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Los campos marcados con{" "}
                                            <span style={{ color: "#EE4266" }}>*</span>{" "}
                                            son obligatorios
                                        </p>
                                    </div>

                                    {/* ── SELECT: Área de Conocimiento ── */}
                                    <div className="group/field">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-4 h-4" style={{ color: "#540D6E" }} />
                                                <span>Área de Conocimiento</span>
                                                <span style={{ color: "#EE4266" }}>*</span>
                                                {isFieldValid("area") && (
                                                    <Check className="w-4 h-4 ml-auto animate-scale-in" style={{ color: "#0EAD69" }} />
                                                )}
                                            </div>
                                        </label>

                                        <select
                                            value={data.area}
                                            onChange={(e) => setData("area", e.target.value)}
                                            onFocus={() => setFocusedField("area")}
                                            onBlur={() => setFocusedField(null)}
                                            className={`w-full px-4 py-3 border rounded-lg font-medium transition-all duration-200 bg-white appearance-none cursor-pointer ${
                                                errors.area
                                                    ? "border-red-300 bg-red-50/50"
                                                    : focusedField === "area"
                                                        ? "shadow-sm ring-2"
                                                        : "border-gray-300 hover:border-gray-400"
                                            }`}
                                            style={
                                                focusedField === "area" && !errors.area
                                                    ? { borderColor: "#540D6E", "--tw-ring-color": "rgba(84,13,110,0.2)" }
                                                    : {}
                                            }
                                        >
                                            <option value="">— Seleccione un área —</option>
                                            {AREAS.map((area) => (
                                                <option key={area} value={area}>{area}</option>
                                            ))}
                                        </select>

                                        {errors.area && (
                                            <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg animate-slide-down" style={{ borderLeftColor: "#EE4266" }}>
                                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#EE4266" }} />
                                                <p className="text-sm font-medium text-red-800">{errors.area}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* ── INPUT: Temática / Título ── */}
                                    <div className="group/field">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4" style={{ color: "#540D6E" }} />
                                                <span>Temática / Título</span>
                                                <span style={{ color: "#EE4266" }}>*</span>
                                                {isFieldValid("tematica") && (
                                                    <Check className="w-4 h-4 ml-auto animate-scale-in" style={{ color: "#0EAD69" }} />
                                                )}
                                            </div>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={data.tematica}
                                                onChange={(e) => setData("tematica", e.target.value)}
                                                onFocus={() => setFocusedField("tematica")}
                                                onBlur={() => setFocusedField(null)}
                                                className={`w-full px-4 py-3 border rounded-lg font-medium transition-all duration-200 ${
                                                    errors.tematica
                                                        ? "border-red-300 bg-red-50/50"
                                                        : focusedField === "tematica"
                                                            ? "bg-white shadow-sm ring-2"
                                                            : "border-gray-300 bg-white hover:border-gray-400"
                                                }`}
                                                style={
                                                    focusedField === "tematica" && !errors.tematica
                                                        ? { borderColor: "#540D6E", "--tw-ring-color": "rgba(84,13,110,0.2)" }
                                                        : {}
                                                }
                                                placeholder="Ejemplo: Operaciones Básicas, Sistema Solar..."
                                                autoFocus
                                            />
                                            {isFieldValid("tematica") && !errors.tematica && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    <div className="p-1 rounded-full" style={{ backgroundColor: "#E8F5F0" }}>
                                                        <Check className="w-4 h-4" style={{ color: "#0EAD69" }} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {errors.tematica && (
                                            <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg animate-slide-down" style={{ borderLeftColor: "#EE4266" }}>
                                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#EE4266" }} />
                                                <p className="text-sm font-medium text-red-800">{errors.tematica}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* ── TEXTAREA: Descripción ── */}
                                    <div className="group/field">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4" style={{ color: "#540D6E" }} />
                                                <span>Descripción</span>
                                            </div>
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData("description", e.target.value)}
                                            onFocus={() => setFocusedField("description")}
                                            onBlur={() => setFocusedField(null)}
                                            rows={4}
                                            className={`w-full px-4 py-3 border rounded-lg font-medium transition-all duration-200 resize-y ${
                                                errors.description
                                                    ? "border-red-300 bg-red-50/50"
                                                    : focusedField === "description"
                                                        ? "bg-white shadow-sm ring-2"
                                                        : "border-gray-300 bg-white hover:border-gray-400"
                                            }`}
                                            style={
                                                focusedField === "description" && !errors.description
                                                    ? { borderColor: "#540D6E", "--tw-ring-color": "rgba(84,13,110,0.2)" }
                                                    : {}
                                            }
                                            placeholder="Describa el contenido, objetivos educativos y alcance de la OVA..."
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Una descripción clara ayuda a los docentes a identificar el contenido adecuado
                                        </p>
                                    </div>

                                    {/* Sección: Recursos Multimedia */}
                                    <div className="border-b border-gray-200 pb-4 mb-6">
                                        <h2 className="text-lg font-bold text-gray-900">Recursos Multimedia</h2>
                                    </div>

                                    {/* ── SELECT: Recurso OVA (URL interna Pages/OVA/) ── */}
                                    <div className="group/field">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4" style={{ color: "#540D6E" }} />
                                                <span>Recurso OVA</span>
                                                <span className="text-xs font-normal text-gray-400">(opcional)</span>
                                                {isFieldValid("url") && (
                                                    <Check className="w-4 h-4 ml-auto animate-scale-in" style={{ color: "#0EAD69" }} />
                                                )}
                                            </div>
                                        </label>

                                        <div className="flex gap-2">
                                            {/* Select del recurso */}
                                            <select
                                                value={data.url}
                                                onChange={(e) => setData("url", e.target.value)}
                                                onFocus={() => setFocusedField("url")}
                                                onBlur={() => setFocusedField(null)}
                                                className={`flex-1 px-4 py-3 border rounded-lg font-medium transition-all duration-200 bg-white appearance-none cursor-pointer ${
                                                    errors.url
                                                        ? "border-red-300 bg-red-50/50"
                                                        : focusedField === "url"
                                                            ? "shadow-sm ring-2"
                                                            : "border-gray-300 hover:border-gray-400"
                                                }`}
                                                style={
                                                    focusedField === "url" && !errors.url
                                                        ? { borderColor: "#540D6E", "--tw-ring-color": "rgba(84,13,110,0.2)" }
                                                        : {}
                                                }
                                            >
                                                <option value="">— Seleccione un recurso —</option>
                                                {OVA_RECURSOS.map((r) => (
                                                    <option key={r.path} value={r.path}>
                                                        {r.label}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* Botón: abrir en ventana emergente */}
                                            <button
                                                type="button"
                                                disabled={!data.url}
                                                onClick={abrirRecurso}
                                                title="Abrir recurso OVA en ventana emergente"
                                                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-bold text-white transition-all duration-200 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                                                style={{ backgroundColor: "#540D6E" }}
                                                onMouseEnter={(e) => { if (data.url) e.currentTarget.style.backgroundColor = "#6B1689"; }}
                                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#540D6E")}
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                Abrir OVA
                                            </button>
                                        </div>

                                        <p className="text-xs text-gray-500 mt-2">
                                            Seleccione el recurso interactivo correspondiente. El botón{" "}
                                            <strong>Abrir OVA</strong> lo previsualizará en una ventana emergente sin abandonar el formulario.
                                        </p>

                                        {errors.url && (
                                            <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg animate-slide-down" style={{ borderLeftColor: "#EE4266" }}>
                                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#EE4266" }} />
                                                <p className="text-sm font-medium text-red-800">{errors.url}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* ── Estado Activo ── */}
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            checked={data.is_active}
                                            onChange={(e) => setData("is_active", e.target.checked)}
                                            className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                        />
                                        <div>
                                            <label htmlFor="is_active" className="text-sm font-semibold text-gray-700 cursor-pointer">
                                                Activo
                                            </label>
                                            <p className="text-xs text-gray-500">
                                                Las OVAs activas estarán disponibles para ser asignadas a cursos
                                            </p>
                                        </div>
                                    </div>

                                    {/* ── Botones de acción ── */}
                                    <div className="flex items-center justify-end gap-4 pt-8 border-t border-gray-200">
                                        <Link
                                            href={route("admin.ovas.index")}
                                            className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                        >
                                            Cancelar
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                                            style={{ backgroundColor: "#540D6E" }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#6B1689")}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#540D6E")}
                                        >
                                            {processing ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Guardando...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    <span>Guardar OVA</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* ── Sidebar ── */}
                        <div className="lg:col-span-1 space-y-6 animate-slide-left">

                            {/* Progreso */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="p-2 rounded-lg" style={{ backgroundColor: "#F3E8FF" }}>
                                        <Info className="w-5 h-5" style={{ color: "#540D6E" }} />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Estado del Formulario</h3>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { label: "Área de Conocimiento", completed: !!data.area        },
                                        { label: "Temática / Título",    completed: !!data.tematica    },
                                        { label: "Descripción",          completed: !!data.description },
                                        { label: "Recurso OVA",          completed: !!data.url         },
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-3 p-3 rounded-lg border transition-all duration-200"
                                            style={{
                                                borderColor:     item.completed ? "#0EAD69" : "#E5E7EB",
                                                backgroundColor: item.completed ? "#F0FDF4" : "#FAFAFA",
                                            }}
                                        >
                                            <div
                                                className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300"
                                                style={{ backgroundColor: item.completed ? "#0EAD69" : "#E5E7EB" }}
                                            >
                                                {item.completed && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className={`text-sm font-medium ${item.completed ? "text-green-700" : "text-gray-500"}`}>
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-5 pt-5 border-t border-gray-200">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-semibold text-gray-700">Progreso Total</span>
                                        <span className="font-bold" style={{ color: "#540D6E" }}>{progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${progress}%`, backgroundColor: "#0EAD69" }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Requisitos */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg" style={{ backgroundColor: "#FFF9E6" }}>
                                        <BookOpen className="w-5 h-5" style={{ color: "#D97706" }} />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Requisitos de la OVA</h3>
                                </div>
                                <ul className="space-y-2.5 text-sm text-gray-600">
                                    {[
                                        "Contenido educativo y relevante",
                                        "Seleccionar el área correspondiente",
                                        "Descripción clara y detallada",
                                        "Recurso OVA funcional (opcional)",
                                    ].map((req, i) => (
                                        <li key={i} className="flex gap-2.5 items-start">
                                            <div
                                                className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                                style={{ backgroundColor: "#540D6E" }}
                                            />
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Tip ventana emergente */}
                                <div className="mt-4 pt-4 border-t border-gray-100 p-3 rounded-lg" style={{ backgroundColor: "#F3E8FF" }}>
                                    <div className="flex items-start gap-2">
                                        <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#540D6E" }} />
                                        <p className="text-xs text-purple-800">
                                            El botón <strong>Abrir OVA</strong> previsualiza el recurso seleccionado en una ventana emergente sin abandonar el formulario.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shimmer   { 0%   { transform:translateX(-100%); } 100% { transform:translateX(100%); } }
                @keyframes fadeIn    { from { opacity:0; transform:translateY(20px);  } to { opacity:1; transform:translateY(0);  } }
                @keyframes slideUp   { from { opacity:0; transform:translateY(30px);  } to { opacity:1; transform:translateY(0);  } }
                @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0);  } }
                @keyframes slideLeft { from { opacity:0; transform:translateX(30px);  } to { opacity:1; transform:translateX(0);  } }
                @keyframes scaleIn   { from { opacity:0; transform:scale(0);          } to { opacity:1; transform:scale(1);          } }
                .animate-shimmer   { animation: shimmer   2s infinite;   }
                .animate-fade-in   { animation: fadeIn    0.6s ease-out; }
                .animate-slide-up  { animation: slideUp   0.6s ease-out; }
                .animate-slide-down{ animation: slideDown 0.3s ease-out; }
                .animate-slide-left{ animation: slideLeft 0.8s ease-out; }
                .animate-scale-in  { animation: scaleIn   0.3s ease-out; }
            `}</style>
        </>
    );
}