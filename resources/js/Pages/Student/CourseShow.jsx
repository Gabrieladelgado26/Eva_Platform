import { Head, Link } from "@inertiajs/react";
import { BookOpen, ChevronLeft, Eye, Video, Clock, Layers } from "lucide-react";
import AppSidebar, { useSidebarState } from "@/Components/AppSidebar";

const GRADE_LABELS = {
    primero: "Primero", segundo: "Segundo", tercero: "Tercero",
    cuarto: "Cuarto",   quinto: "Quinto"
};

export default function StudentCourseShow({ course, ovas = [] }) {
    const [collapsed] = useSidebarState();

    return (
        <>
            <Head title={`${GRADE_LABELS[course.grade] ?? course.grade} — Sección ${course.section}`} />
            <AppSidebar currentRoute="student.courses.show" />

            <main className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-20" : "lg:ml-72"} min-h-screen bg-gray-50`}>
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">

                        {/* Breadcrumb */}
                        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                            <Link href={route("student.courses.index")}
                                className="hover:text-purple-600 transition-colors flex items-center gap-1">
                                <ChevronLeft className="w-4 h-4" /> Mis cursos
                            </Link>
                            <span>/</span>
                            <span style={{ color: "#540D6E" }} className="font-medium">
                                {GRADE_LABELS[course.grade] ?? course.grade} — Sección {course.section}
                            </span>
                        </div>

                        {/* Header */}
                        <div className="mb-8 flex items-start gap-4">
                            <div className="p-4 rounded-xl shadow-sm border bg-white" style={{ borderColor: "#540D6E" }}>
                                <BookOpen className="w-8 h-8" style={{ color: "#540D6E" }} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                                    {GRADE_LABELS[course.grade] ?? course.grade} — Sección {course.section}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Año {course.school_year} · {ovas.length} recurso{ovas.length !== 1 ? "s" : ""} OVA
                                </p>
                                {course.description && (
                                    <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                                )}
                            </div>
                        </div>

                        {/* Sin OVAs */}
                        {ovas.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 py-16 text-center">
                                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                    style={{ background: "linear-gradient(135deg,#540D6E10,#EE426610)" }}>
                                    <Layers className="w-10 h-10" style={{ color: "#540D6E40" }} />
                                </div>
                                <p className="text-base font-bold text-gray-700 mb-1">No hay OVAs asignados aún</p>
                                <p className="text-sm text-gray-400">Tu profesor asignará recursos próximamente</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {ovas.map((ova, index) => (
                                    <div key={ova.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                                        {/* Número de orden */}
                                        <div className="px-4 pt-3 pb-0 flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                                style={{ backgroundColor: "#540D6E" }}>
                                                {index + 1}
                                            </span>
                                            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "#540D6E" }}>
                                                {ova.area}
                                            </p>
                                        </div>

                                        {/* Thumbnail */}
                                        {ova.thumbnail ? (
                                            <img src={`/storage/${ova.thumbnail}`} alt={ova.tematica} className="w-full h-36 object-cover mt-3" />
                                        ) : (
                                            <div className="w-full h-36 flex items-center justify-center mt-3"
                                                style={{ background: "linear-gradient(135deg,#540D6E10,#EE426610)" }}>
                                                <Video className="w-10 h-10" style={{ color: "#540D6E30" }} />
                                            </div>
                                        )}

                                        <div className="p-4">
                                            <h3 className="font-bold text-gray-900 mb-1">{ova.tematica}</h3>
                                            {ova.description && (
                                                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{ova.description}</p>
                                            )}
                                            {ova.url ? (
                                                <a href={ova.url} target="_blank" rel="noopener noreferrer"
                                                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white rounded-lg transition-all"
                                                    style={{ backgroundColor: "#540D6E" }}
                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}>
                                                    <Eye className="w-4 h-4" /> Ver recurso OVA
                                                </a>
                                            ) : (
                                                <div className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-gray-400 rounded-lg bg-gray-100">
                                                    <Clock className="w-4 h-4" /> Sin enlace disponible
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            </main>

            {/* Fondo */}
            <div className="fixed inset-0 -z-10 bg-gray-50">
                <div className="absolute inset-0" style={{
                    backgroundImage: "radial-gradient(circle at 1px 1px,rgba(84,13,110,0.05) 1px,transparent 0)",
                    backgroundSize: "40px 40px"
                }} />
                <div className="absolute top-0 left-0 w-full h-1" style={{
                    background: "linear-gradient(to right,#540D6E,#EE4266,#FFD23F,#3BCEAC,#0EAD69)"
                }} />
            </div>

            <style>{`
                .line-clamp-2 {
                    display:-webkit-box;
                    -webkit-line-clamp:2;
                    -webkit-box-orient:vertical;
                    overflow:hidden;
                }
            `}</style>
        </>
    );
}