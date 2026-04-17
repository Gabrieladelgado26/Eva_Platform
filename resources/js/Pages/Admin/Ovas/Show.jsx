import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft, Layers, Calendar, Globe, FileText, Tag,
    CheckCircle, XCircle, BookOpen, Users,
    ExternalLink, Printer, Info
} from "lucide-react";
import { useState } from "react";

export default function Show({ ova }) {
    const [showFullDescription, setShowFullDescription] = useState(false);

    const formatDate = (date) => {
        if (!date) return "No disponible";
        return new Date(date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const truncateDescription = (text, length = 200) => {
        if (!text) return "Sin descripción";
        if (text.length <= length || showFullDescription) return text;
        return text.substring(0, length) + "...";
    };

    return (
        <>
            <Head title={`Detalles: ${ova.tematica}`} />

            <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-50">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(84, 13, 110, 0.08) 1px, transparent 0)`,
                        backgroundSize: "40px 40px",
                    }}
                />
                <div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{
                        background: "linear-gradient(to right, #540D6E, #EE4266, #FFD23F, #3BCEAC, #0EAD69)",
                    }}
                />
            </div>

            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-6xl mx-auto">

                    {/* ── Header ── */}
                    <div className="mb-12 animate-fade-in">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                            <Link
                                href={route("admin.ovas.index")}
                                className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/80"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                                <span>Volver al Panel de OVAs</span>
                            </Link>

                            <div className="flex gap-3">

                                {/* Editar — translúcido morado */}
                                <Link
                                    href={route("admin.ovas.edit", ova.id)}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl border-2 transition-all duration-200 shadow-sm hover:shadow-md"
                                    style={{
                                        backgroundColor: "rgba(84,13,110,0.08)",
                                        borderColor: "rgba(84,13,110,0.30)",
                                        color: "#540D6E",
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.backgroundColor = "rgba(84,13,110,0.15)";
                                        e.currentTarget.style.borderColor = "rgba(84,13,110,0.50)";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.backgroundColor = "rgba(84,13,110,0.08)";
                                        e.currentTarget.style.borderColor = "rgba(84,13,110,0.30)";
                                    }}
                                >
                                    <FileText className="w-4 h-4" />
                                    Editar OVA
                                </Link>
                                {/* Imprimir — translúcido verde */}
                                <button
                                    onClick={() => window.print()}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl border-2 transition-all duration-200 shadow-sm hover:shadow-md"
                                    style={{
                                        backgroundColor: "rgba(14,173,105,0.08)",
                                        borderColor: "rgba(14,173,105,0.30)",
                                        color: "#0EAD69",
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.backgroundColor = "rgba(14,173,105,0.15)";
                                        e.currentTarget.style.borderColor = "rgba(14,173,105,0.50)";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.backgroundColor = "rgba(14,173,105,0.08)";
                                        e.currentTarget.style.borderColor = "rgba(14,173,105,0.30)";
                                    }}
                                >
                                    <Printer className="w-4 h-4" />
                                    Imprimir
                                </button>
                            </div>
                        </div>

                        {/* Icon + Title block */}
                        <div className="flex items-start gap-4 mb-6">
                            <div
                                className="p-4 rounded-xl shadow-sm border"
                                style={{ backgroundColor: "white", borderColor: "#540D6E" }}
                            >
                                <Layers className="w-10 h-10" style={{ color: "#540D6E" }} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                    Objeto Virtual de Aprendizaje
                                </h1>
                                <p className="text-gray-600 text-base">
                                    Información del OVA: <span className="font-semibold" style={{ color: "#540D6E" }}>{ova.tematica}</span>
                                </p>
                            </div>
                        </div>

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <BookOpen className="w-4 h-4" />
                            <span>Gestión De Contenido</span>
                            <span>/</span>
                            <span>OVAs</span>
                            <span>/</span>
                            <span>Ver</span>
                            <span>/</span>
                            <span className="font-medium" style={{ color: "#540D6E" }}>
                                {ova.tematica}
                            </span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* ── Columna principal ── */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Card: Información del Recurso Educativo */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slide-up">
                                <div className="p-8 lg:p-10 space-y-8">
                                    {/* Section header */}
                                    <div className="border-b border-gray-200 pb-4 mb-6">
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Título: <span className="font-semibold" style={{ color: "#540D6E" }}>{ova.tematica || <span className="text-gray-400">No especificado</span>}</span>
                                        </h2>
                                    </div>

                                    {/* Área de Conocimiento */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-4 h-4" style={{ color: "#540D6E" }} />
                                                <span>Área de Conocimiento</span>
                                            </div>
                                        </label>
                                        <div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 font-medium">
                                            {ova.area || <span className="text-gray-400">No especificado</span>}
                                        </div>
                                    </div>

                                    {/* Descripción */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4" style={{ color: "#540D6E" }} />
                                                <span>Descripción</span>
                                            </div>
                                        </label>
                                        <div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 leading-relaxed min-h-[50px]">
                                            {ova.description
                                                ? <>{truncateDescription(ova.description)}
                                                    {ova.description.length > 200 && (
                                                        <button
                                                            onClick={() => setShowFullDescription(!showFullDescription)}
                                                            className="block mt-2 text-sm font-semibold hover:underline transition-colors"
                                                            style={{ color: "#540D6E" }}
                                                        >
                                                            {showFullDescription ? "Ver menos" : "Ver más"}
                                                        </button>
                                                    )}
                                                </>
                                                : <span className="text-gray-400">Sin descripción</span>
                                            }
                                        </div>
                                    </div>

                                    {/* Estado del OVA */}
                                    <div
                                        className="flex items-center justify-between p-4 rounded-lg border-2"
                                        style={{
                                            borderColor: ova.is_active ? "#0EAD69" : "#E5E7EB",
                                            backgroundColor: ova.is_active ? "#E8F5F0" : "#F9FAFB",
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg transition-colors duration-200"
                                                style={{ backgroundColor: ova.is_active ? "#CCF2E5" : "#E5E7EB" }}>
                                                <Layers className="w-4 h-4"
                                                    style={{ color: ova.is_active ? "#0EAD69" : "#9CA3AF" }} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">Estado del OVA</p>
                                                <p className="text-xs mt-0.5" style={{ color: ova.is_active ? "#059669" : "#6B7280" }}>
                                                    {ova.is_active
                                                        ? "Activo — Disponible para asignarse a cursos"
                                                        : "Inactivo — No aparecerá en los cursos"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border"
                                            style={ova.is_active
                                                ? { backgroundColor: "#E8F5F0", borderColor: "#3BCEAC" }
                                                : { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }}>
                                            <div className={`w-2 h-2 rounded-full ${ova.is_active ? "animate-pulse" : ""}`}
                                                style={{ backgroundColor: ova.is_active ? "#0EAD69" : "#9CA3AF" }} />
                                            <span className="text-xs font-semibold"
                                                style={{ color: ova.is_active ? "#0EAD69" : "#6B7280" }}>
                                                {ova.is_active ? "Activo" : "Inactivo"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card separada: Nota morada */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slide-up">
                                <div className="p-6">
                                    <div className="rounded-lg p-4 flex items-start gap-3"
                                        style={{ backgroundColor: "#F3E8FF", borderLeft: "4px solid #540D6E" }}>
                                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#540D6E" }} />
                                        <p className="text-sm leading-relaxed" style={{ color: "#540D6E" }}>
                                            Los OVAs son recursos educativos digitales diseñados para apoyar el proceso de
                                            enseñanza‑aprendizaje. Pueden asignarse a múltiples cursos simultáneamente.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Thumbnail */}
                            {ova.thumbnail && (
                                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slide-up">
                                    <div className="relative">
                                        <img
                                            src={`/storage/${ova.thumbnail}`}
                                            alt={ova.tematica}
                                            className="w-full h-64 object-cover"
                                        />
                                        <div className="absolute top-4 right-4">
                                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border bg-white shadow-sm"
                                                style={ova.is_active ? { borderColor: "#3BCEAC" } : { borderColor: "#E5E7EB" }}>
                                                <div className={`w-2 h-2 rounded-full ${ova.is_active ? "animate-pulse" : ""}`}
                                                    style={{ backgroundColor: ova.is_active ? "#0EAD69" : "#9CA3AF" }} />
                                                <span className="text-xs font-medium"
                                                    style={{ color: ova.is_active ? "#0EAD69" : "#6B7280" }}>
                                                    {ova.is_active ? "Activo" : "Inactivo"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Recurso Digital */}
                            {ova.url && (
                                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slide-up">
                                    <div className="border-b border-gray-200 px-6 py-4">
                                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <Globe className="w-5 h-5" style={{ color: "#540D6E" }} />
                                            Recurso Digital
                                        </h2>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="p-2 rounded-lg bg-white shadow-sm">
                                                <ExternalLink className="w-5 h-5" style={{ color: "#540D6E" }} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600 break-all">{ova.url}</p>
                                            </div>
                                            <a
                                                href={ova.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all shadow-sm hover:shadow-md"
                                                style={{ backgroundColor: "#540D6E" }}
                                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#6B1689")}
                                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#540D6E")}
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                Abrir recurso
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Sidebar ── */}
                        <div className="space-y-6 animate-slide-left">

                            {/* Información del Recurso */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden sticky top-6">
                                <div className="bg-gradient-to-r from-purple-50 to-white px-6 py-4 border-b border-gray-200">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" style={{ color: "#540D6E" }} />
                                        Información del Recurso
                                    </h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                            Fecha de creación
                                        </p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatDate(ova.created_at)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                            Última actualización
                                        </p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatDate(ova.updated_at)}
                                        </p>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Estado:</span>
                                            <div className="inline-flex items-center gap-1.5">
                                                {ova.is_active ? (
                                                    <>
                                                        <CheckCircle className="w-4 h-4" style={{ color: "#0EAD69" }} />
                                                        <span className="text-sm font-semibold" style={{ color: "#0EAD69" }}>Activo</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="w-4 h-4" style={{ color: "#9CA3AF" }} />
                                                        <span className="text-sm font-semibold text-gray-500">Inactivo</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Acciones Rápidas */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-purple-50 to-white px-6 py-4 border-b border-gray-200">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <Layers className="w-4 h-4" style={{ color: "#540D6E" }} />
                                        Acciones Rápidas
                                    </h3>
                                </div>
                                <div className="p-4 space-y-2">
                                    <Link
                                        href={route("admin.ovas.edit", ova.id)}
                                        className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-all w-full"
                                    >
                                        <FileText className="w-4 h-4" style={{ color: "#540D6E" }} />
                                        Editar información
                                    </Link>
                                    {ova.url && (
                                        <a
                                            href={ova.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-all w-full"
                                        >
                                            <ExternalLink className="w-4 h-4" style={{ color: "#540D6E" }} />
                                            Abrir recurso
                                        </a>
                                    )}
                                    <button
                                        onClick={() => window.print()}
                                        className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-all w-full"
                                    >
                                        <Printer className="w-4 h-4" style={{ color: "#540D6E" }} />
                                        Imprimir detalles
                                    </button>
                                </div>
                            </div>

                            {/* Estadísticas */}
                            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-lg border border-purple-200 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-white shadow-sm">
                                        <Users className="w-5 h-5" style={{ color: "#540D6E" }} />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Estadísticas</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Cursos asociados:</span>
                                        <span className="font-bold" style={{ color: "#540D6E" }}>
                                            {ova.courses?.length || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">ID del recurso:</span>
                                        <span className="text-xs font-mono text-gray-500">#{ova.id}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn  { from { opacity: 0; transform: translateY(20px);  } to { opacity: 1; transform: translateY(0);  } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px);  } to { opacity: 1; transform: translateY(0);  } }
                @keyframes slideLeft { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
                .animate-fade-in   { animation: fadeIn    0.6s ease-out; }
                .animate-slide-up  { animation: slideUp   0.6s ease-out; }
                .animate-slide-left { animation: slideLeft 0.8s ease-out; }
            `}</style>
        </>
    );
}