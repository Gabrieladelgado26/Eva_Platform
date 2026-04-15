import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowLeft, Layers, Check, Loader2, AlertCircle, Info, BookOpen,
    Upload, X, Globe, FileText, Tag, Image as ImageIcon, Eye, EyeOff, Trash2
} from "lucide-react";
import { useState } from "react";

export default function Edit({ ova }) {
    const { data, setData, put, errors, processing } = useForm({
        area: ova.area || "",
        tematica: ova.tematica || "",
        description: ova.description || "",
        url: ova.url || "",
        thumbnail: null,
        is_active: ova.is_active ?? true,
    });

    const [preview, setPreview] = useState(ova.thumbnail ? `/storage/${ova.thumbnail}` : null);
    const [focusedField, setFocusedField] = useState(null);
    const [showUrlPreview, setShowUrlPreview] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                return;
            }
            
            if (file.size > 2 * 1024 * 1024) {
                return;
            }

            setData("thumbnail", file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const removeThumbnail = () => {
        setPreview(null);
        setData("thumbnail", null);
    };

    function submit(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("area", data.area);
        formData.append("tematica", data.tematica);
        formData.append("description", data.description || "");
        formData.append("url", data.url || "");
        formData.append("is_active", data.is_active ? "1" : "0");
        
        if (data.thumbnail && data.thumbnail instanceof File) {
            formData.append("thumbnail", data.thumbnail);
        }
        
        post(route("admin.ovas.update", ova.id), {
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }

    const isFieldValid = (field) => {
        if (!data[field]) return false;
        if (field === "url") {
            return data.url.includes("http") && data.url.includes(".");
        }
        if (field === "area") return data.area.length >= 2;
        if (field === "tematica") return data.tematica.length >= 3;
        return true;
    };

    const totalFields = 4;
    const completedFields = 
        (data.area ? 1 : 0) +
        (data.tematica ? 1 : 0) +
        (data.description ? 1 : 0) +
        (data.url ? 1 : 0);
    
    const progress = Math.round((completedFields / totalFields) * 100);

    return (
        <>
            <Head title={`Editar OVA: ${ova.tematica}`} />

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
                <div className="max-w-5xl mx-auto">
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
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                    Editar Objeto Virtual de Aprendizaje
                                </h1>
                                <p className="text-gray-600 text-base">
                                    Modificando: <span className="font-semibold" style={{ color: "#540D6E" }}>{ova.tematica}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <BookOpen className="w-4 h-4" />
                            <span>Gestión De Contenido</span>
                            <span>/</span>
                            <span>OVAs</span>
                            <span>/</span>
                            <span>Editar</span>
                            <span>/</span>
                            <span
                                className="font-medium"
                                style={{ color: "#540D6E" }}
                            >
                                {ova.tematica}
                            </span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slide-up">
                                <div className="h-1 bg-gray-100 relative overflow-hidden">
                                    <div
                                        className="absolute inset-y-0 left-0 transition-all duration-500 ease-out"
                                        style={{
                                            width: `${progress}%`,
                                            background: "linear-gradient(to right, #540D6E, #EE4266)",
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                                    </div>
                                </div>

                                <form onSubmit={submit} className="p-8 lg:p-10 space-y-8">
                                    <div className="border-b border-gray-200 pb-4 mb-6">
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Información del Recurso Educativo
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Los campos marcados con{" "}
                                            <span style={{ color: "#EE4266" }}>
                                                *
                                            </span>{" "}
                                            son obligatorios
                                        </p>
                                    </div>

                                    {/* Área Field */}
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
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={data.area}
                                                onChange={(e) => setData("area", e.target.value)}
                                                onFocus={() => setFocusedField("area")}
                                                onBlur={() => setFocusedField(null)}
                                                className={`w-full px-4 py-3 border rounded-lg font-medium transition-all duration-200 ${
                                                    errors.area
                                                        ? "border-red-300 bg-red-50/50"
                                                        : focusedField === "area"
                                                            ? "bg-white shadow-sm ring-2"
                                                            : "border-gray-300 bg-white hover:border-gray-400"
                                                }`}
                                                style={
                                                    focusedField === "area" && !errors.area
                                                        ? { borderColor: "#540D6E", "--tw-ring-color": "rgba(84, 13, 110, 0.2)" }
                                                        : {}
                                                }
                                                placeholder="Ejemplo: Matemáticas, Ciencias Naturales..."
                                            />
                                            {isFieldValid("area") && !errors.area && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    <div className="p-1 rounded-full" style={{ backgroundColor: "#E8F5F0" }}>
                                                        <Check className="w-4 h-4" style={{ color: "#0EAD69" }} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {errors.area && (
                                            <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg animate-slide-down" style={{ borderLeftColor: "#EE4266" }}>
                                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#EE4266" }} />
                                                <p className="text-sm font-medium text-red-800">{errors.area}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Temática Field */}
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
                                                        ? { borderColor: "#540D6E", "--tw-ring-color": "rgba(84, 13, 110, 0.2)" }
                                                        : {}
                                                }
                                                placeholder="Ejemplo: Operaciones Básicas, Sistema Solar..."
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

                                    {/* Descripción Field */}
                                    <div className="group/field">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <Info className="w-4 h-4" style={{ color: "#540D6E" }} />
                                                <span>Descripción</span>
                                                {data.description && (
                                                    <Check className="w-4 h-4 ml-auto animate-scale-in" style={{ color: "#0EAD69" }} />
                                                )}
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
                                                    ? { borderColor: "#540D6E", "--tw-ring-color": "rgba(84, 13, 110, 0.2)" }
                                                    : {}
                                            }
                                            placeholder="Describa el contenido, objetivos educativos y alcance de la OVA..."
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Una descripción clara ayuda a los docentes a identificar el contenido adecuado
                                        </p>
                                    </div>

                                    <div className="border-b border-gray-200 pb-4 mb-6">
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Recursos Multimedia
                                        </h2>
                                    </div>

                                    {/* URL Field */}
                                    <div className="group/field">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4" style={{ color: "#540D6E" }} />
                                                <span>URL del Recurso</span>
                                                {data.url && isFieldValid("url") && (
                                                    <Check className="w-4 h-4 ml-auto animate-scale-in" style={{ color: "#0EAD69" }} />
                                                )}
                                            </div>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="url"
                                                value={data.url}
                                                onChange={(e) => setData("url", e.target.value)}
                                                onFocus={() => setFocusedField("url")}
                                                onBlur={() => setFocusedField(null)}
                                                className={`w-full px-4 py-3 border rounded-lg font-medium transition-all duration-200 ${
                                                    errors.url
                                                        ? "border-red-300 bg-red-50/50"
                                                        : focusedField === "url"
                                                            ? "bg-white shadow-sm ring-2"
                                                            : "border-gray-300 bg-white hover:border-gray-400"
                                                }`}
                                                style={
                                                    focusedField === "url" && !errors.url
                                                        ? { borderColor: "#540D6E", "--tw-ring-color": "rgba(84, 13, 110, 0.2)" }
                                                        : {}
                                                }
                                                placeholder="https://ejemplo.com/recurso-ova"
                                            />
                                            {data.url && isFieldValid("url") && !errors.url && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowUrlPreview(!showUrlPreview)}
                                                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                    >
                                                        {showUrlPreview ? (
                                                            <EyeOff className="w-4 h-4 text-gray-500" />
                                                        ) : (
                                                            <Eye className="w-4 h-4 text-gray-500" />
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        {showUrlPreview && data.url && (
                                            <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <p className="text-xs text-gray-600 break-all">
                                                    <span className="font-semibold">Vista previa:</span> {data.url}
                                                </p>
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-500 mt-1">
                                            Enlace externo al contenido interactivo (opcional)
                                        </p>
                                        {errors.url && (
                                            <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg animate-slide-down" style={{ borderLeftColor: "#EE4266" }}>
                                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#EE4266" }} />
                                                <p className="text-sm font-medium text-red-800">{errors.url}</p>
                                            </div>
                                        )}
                                    </div>

                                  
                                    {/* ── Estado del OVA ── */}
                                    <div
                                        className="flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer select-none"
                                        style={{
                                            borderColor: data.is_active ? '#0EAD69' : '#E5E7EB',
                                            backgroundColor: data.is_active ? '#E8F5F0' : '#F9FAFB',
                                        }}
                                        onClick={() => setData("is_active", !data.is_active)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg transition-colors duration-200"
                                                style={{ backgroundColor: data.is_active ? '#CCF2E5' : '#E5E7EB' }}>
                                                <Layers className="w-4 h-4 transition-colors duration-200"
                                                    style={{ color: data.is_active ? '#0EAD69' : '#9CA3AF' }} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">Estado del OVA</p>
                                                <p className="text-xs mt-0.5" style={{ color: data.is_active ? '#059669' : '#6B7280' }}>
                                                    {data.is_active
                                                        ? 'Activo — Disponible para asignarse a cursos'
                                                        : 'Inactivo — No aparecerá en los cursos'}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Toggle visual */}
                                        <div className="relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                                            style={{ backgroundColor: data.is_active ? '#0EAD69' : '#D1D5DB' }}>
                                            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                                                style={{ transform: data.is_active ? 'translateX(24px)' : 'translateX(0)' }} />
                                        </div>
                                        <input type="checkbox" id="is_active" className="sr-only"
                                            checked={data.is_active}
                                            onChange={(e) => setData("is_active", e.target.checked)} />
                                    </div>

                                    {/* Action Buttons */}
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
                                                    <span>Actualizando...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    <span>Actualizar OVA</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Security Notice */}
                            <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg" style={{ backgroundColor: "#E8F5F0" }}>
                                        <Layers className="w-5 h-5" style={{ color: "#0EAD69" }} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-gray-900 mb-1">
                                            Calidad de Contenido Educativo
                                        </h3>
                                        <p className="text-xs text-gray-600 leading-relaxed">
                                            Asegúrese de que el contenido sea educativo, apropiado para el nivel académico
                                            y cumpla con los estándares de calidad institucional.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6 animate-slide-left">
                            {/* Progress Card */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="p-2 rounded-lg" style={{ backgroundColor: "#F3E8FF" }}>
                                        <Info className="w-5 h-5" style={{ color: "#540D6E" }} />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Estado del Formulario</h3>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { label: "Área de Conocimiento", completed: !!data.area },
                                        { label: "Temática / Título", completed: !!data.tematica },
                                        { label: "Descripción", completed: !!data.description },
                                        { label: "URL del Recurso", completed: !!data.url },
                                    ].map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-3 rounded-lg border transition-all duration-200"
                                            style={{
                                                borderColor: item.completed ? "#0EAD69" : "#E5E7EB",
                                                backgroundColor: item.completed ? "#F0FDF4" : "#FAFAFA",
                                            }}
                                        >
                                            <div
                                                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300`}
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
                                        <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: "#0EAD69" }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Requirements */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg" style={{ backgroundColor: "#FFF9E6" }}>
                                        <BookOpen className="w-5 h-5" style={{ color: "#D97706" }} />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Requisitos de la OVA</h3>
                                </div>
                                <ul className="space-y-2.5 text-sm text-gray-600">
                                    <li className="flex gap-2.5 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: "#540D6E" }}></div>
                                        <span>Contenido educativo y relevante</span>
                                    </li>
                                    <li className="flex gap-2.5 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: "#540D6E" }}></div>
                                        <span>URL funcional y accesible</span>
                                    </li>
                                    <li className="flex gap-2.5 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: "#540D6E" }}></div>
                                        <span>Imagen representativa del contenido</span>
                                    </li>
                                    <li className="flex gap-2.5 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: "#540D6E" }}></div>
                                        <span>Descripción clara y detallada</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideLeft { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
                .animate-shimmer { animation: shimmer 2s infinite; }
                .animate-fade-in { animation: fadeIn 0.6s ease-out; }
                .animate-slide-up { animation: slideUp 0.6s ease-out; }
                .animate-slide-down { animation: slideDown 0.3s ease-out; }
                .animate-slide-left { animation: slideLeft 0.8s ease-out; }
                .animate-scale-in { animation: scaleIn 0.3s ease-out; }
            `}</style>
        </>
    );
}