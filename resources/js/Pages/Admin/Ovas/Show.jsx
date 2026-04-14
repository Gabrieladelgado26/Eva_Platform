import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft, Layers, Calendar, Eye, Globe, FileText, Tag, 
    Image as ImageIcon, CheckCircle, XCircle, BookOpen, Users, 
    ExternalLink, Download, Printer
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
                ></div>
                <div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{
                        background: "linear-gradient(to right, #540D6E, #EE4266, #FFD23F, #3BCEAC, #0EAD69)",
                    }}
                ></div>
            </div>

            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
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
                                <Link
                                    href={route("admin.ovas.edit", ova.id)}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                                >
                                    Editar OVA
                                </Link>
                                <button
                                    onClick={() => window.print()}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    <Printer className="w-4 h-4" />
                                    Imprimir
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 mb-6">
                            <div
                                className="p-4 rounded-xl shadow-sm border"
                                style={{
                                    backgroundColor: "white",
                                    borderColor: "#540D6E",
                                }}
                            >
                                <Layers
                                    className="w-10 h-10"
                                    style={{ color: "#540D6E" }}
                                />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                    {ova.tematica}
                                </h1>
                                <div className="flex flex-wrap items-center gap-3">
                                    <span
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm"
                                        style={{ backgroundColor: "#540D6E" }}
                                    >
                                        <Tag className="w-3.5 h-3.5" />
                                        {ova.area}
                                    </span>
                                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border"
                                        style={ova.is_active ? { backgroundColor: "#E8F5F0", borderColor: "#3BCEAC" } : { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }}>
                                        <div className={`w-2 h-2 rounded-full ${ova.is_active ? "animate-pulse" : ""}`}
                                            style={{ backgroundColor: ova.is_active ? "#0EAD69" : "#9CA3AF" }} />
                                        <span className="text-xs font-medium" style={{ color: ova.is_active ? "#0EAD69" : "#6B7280" }}>
                                            {ova.is_active ? "Activo" : "Inactivo"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <BookOpen className="w-4 h-4" />
                            <span>Gestión De Contenido</span>
                            <span>/</span>
                            <span>OVAs</span>
                            <span>/</span>
                            <span>Detalles</span>
                            <span>/</span>
                            <span className="font-medium" style={{ color: "#540D6E" }}>
                                {ova.tematica}
                            </span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
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
                                                <span className="text-xs font-medium" style={{ color: ova.is_active ? "#0EAD69" : "#6B7280" }}>
                                                    {ova.is_active ? "Activo" : "Inactivo"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slide-up">
                                <div className="border-b border-gray-200 px-6 py-4">
                                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <FileText className="w-5 h-5" style={{ color: "#540D6E" }} />
                                        Descripción
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-700 leading-relaxed">
                                        {truncateDescription(ova.description)}
                                    </p>
                                    {ova.description && ova.description.length > 200 && (
                                        <button
                                            onClick={() => setShowFullDescription(!showFullDescription)}
                                            className="mt-3 text-sm font-semibold hover:underline transition-colors"
                                            style={{ color: "#540D6E" }}
                                        >
                                            {showFullDescription ? "Ver menos" : "Ver más"}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* URL Resource */}
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

                            {/* Courses using this OVA */}
                            {ova.courses && ova.courses.length > 0 && (
                                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slide-up">
                                    <div className="border-b border-gray-200 px-6 py-4">
                                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <BookOpen className="w-5 h-5" style={{ color: "#540D6E" }} />
                                            Cursos que utilizan esta OVA
                                        </h2>
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {ova.courses.map((course) => (
                                            <div key={course.id} className="p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{course.name}</p>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Asignada: {formatDate(course.pivot?.assigned_at)}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700">
                                                            Orden: {course.pivot?.order || 0}
                                                        </span>
                                                        {course.pivot?.is_required && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-700">
                                                                Obligatoria
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6 animate-slide-left">
                            {/* Information Card */}
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

                            {/* Quick Actions */}
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

                            {/* Stats */}
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
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideLeft { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
                .animate-fade-in { animation: fadeIn 0.6s ease-out; }
                .animate-slide-up { animation: slideUp 0.6s ease-out; }
                .animate-slide-left { animation: slideLeft 0.8s ease-out; }
            `}</style>
        </>
    );
}