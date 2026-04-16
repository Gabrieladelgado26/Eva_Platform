import { Head, Link } from "@inertiajs/react";
import { ChevronLeft, ExternalLink, BookOpen } from "lucide-react";
import AppSidebar, { useSidebarState } from "@/Components/AppSidebar";

const GRADE_LABELS = {
    primero: "Primero", segundo: "Segundo", tercero: "Tercero",
    cuarto: "Cuarto",   quinto: "Quinto"
};

export default function OvaViewer({ ova, course }) {
    const [collapsed] = useSidebarState();

    return (
        <>
            <Head title={ova.tematica} />
            <AppSidebar currentRoute="student.ovas.show" />

            <main className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-20" : "lg:ml-72"} min-h-screen bg-gray-900 flex flex-col`}>

                {/* Barra superior */}
                <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 flex-shrink-0">
                    <Link href={route("student.courses.show", course.id)}
                        className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-purple-700 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                        <BookOpen className="w-4 h-4" />
                        {GRADE_LABELS[course.grade] ?? course.grade} — Sección {course.section}
                    </Link>

                    <div className="h-4 w-px bg-gray-200" />

                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wide truncate" style={{ color: "#540D6E" }}>
                            {ova.area}
                        </p>
                        <p className="text-sm font-bold text-gray-900 truncate">{ova.tematica}</p>
                    </div>

                    {ova.url && (
                        <a href={ova.url} target="_blank" rel="noopener noreferrer"
                            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border-2 transition-all"
                            style={{ borderColor: "#540D6E", color: "#540D6E" }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#540D6E"; e.currentTarget.style.color = "white"; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#540D6E"; }}>
                            <ExternalLink className="w-3.5 h-3.5" /> Abrir en nueva pestaña
                        </a>
                    )}
                </div>

                {/* Iframe del recurso OVA */}
                <div className="flex-1 relative">
                    {ova.url ? (
                        <iframe
                            src={ova.url}
                            title={ova.tematica}
                            className="w-full h-full absolute inset-0 border-0"
                            style={{ minHeight: "calc(100vh - 65px)" }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                            allowFullScreen
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full min-h-96">
                            <div className="text-center text-white">
                                <p className="text-xl font-bold mb-2">Este recurso no tiene enlace disponible</p>
                                <p className="text-gray-400 text-sm">Tu profesor aún no ha agregado la URL del recurso</p>
                                <Link href={route("student.courses.show", course.id)}
                                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                                    style={{ backgroundColor: "#540D6E" }}>
                                    <ChevronLeft className="w-4 h-4" /> Volver al curso
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}