import { Head, Link } from "@inertiajs/react";
import {
    BookOpen, ChevronLeft, Eye, Clock, Layers, PlayCircle, Lock, FlaskConical,
    Globe, BookMarked, Calculator, Languages
} from "lucide-react";
import AppSidebar, { useSidebarState } from "@/Components/AppSidebar";

const GRADE_LABELS = {
    primero: "Primero", segundo: "Segundo", tercero: "Tercero",
    cuarto: "Cuarto",   quinto: "Quinto"
};

const MATERIAS = [
    { area: 'Ciencias Naturales', icon: FlaskConical, color: '#0EAD69', bg: '#E8F5F0' },
    { area: 'Ciencias Sociales',  icon: Globe,        color: '#EE4266', bg: '#FEE2E2' },
    { area: 'Español',            icon: BookMarked,   color: '#540D6E', bg: '#F3E8FF' },
    { area: 'Matemáticas',        icon: Calculator,   color: '#1D4ED8', bg: '#DBEAFE' },
    { area: 'Inglés',             icon: Languages,    color: '#D97706', bg: '#FEF3C7' },
];

function OvaCard({ ova, index }) {
    const materia = MATERIAS.find(m => m.area === ova.area);
    const Icon = materia?.icon ?? BookOpen;
    const color = materia?.color ?? '#540D6E';

    return (
        <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all flex flex-col"
            style={{ animation: `fadeUp 0.5s ease-out ${index * 80}ms both` }}>
            {/* Top color block */}
            <div className="h-28 flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: color }}>
                <Icon className="w-12 h-12 text-white opacity-90" />
            </div>
            {/* Bottom text */}
            <div className="p-4 bg-white flex flex-col gap-2 flex-1">
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color }}>
                    {ova.area}
                </span>
                <h3 className="font-bold text-gray-900 text-sm leading-snug">{ova.tematica}</h3>
                {ova.url ? (
                    <a href={ova.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-white rounded-lg transition-all"
                        style={{ backgroundColor: color }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                        <PlayCircle className="w-4 h-4" /> Ver OVA
                    </a>
                ) : (
                    <div className="mt-auto w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-gray-400 rounded-lg bg-gray-100">
                        <Lock className="w-4 h-4" /> No disponible
                    </div>
                )}
            </div>
        </div>
    );
}

export default function StudentCourseShow({ course, ovas = [] }) {
    const [collapsed] = useSidebarState();

    return (
        <>
            <Head title={`${GRADE_LABELS[course.grade] ?? course.grade} — Sección ${course.section}`} />
            <AppSidebar currentRoute="student.courses.show" />

            <main className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-20" : "lg:ml-72"} min-h-screen bg-gray-50`}>
                
                {/* Top gradient line */}
                <div className="h-1 w-full" style={{ background: 'linear-gradient(to right, #540D6E, #EE4266, #FFD23F, #3BCEAC, #0EAD69)' }} />

                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">

                        {/* Back Button */}
                        <div className="mb-6">
                            <Link href={route("student.courses.index")}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-white bg-white/80 transition-all shadow-sm text-sm font-semibold text-gray-700">
                                <ChevronLeft className="w-4 h-4" /> Volver a mis cursos
                            </Link>
                        </div>

                        {/* Header */}
                        <div className="mb-8 rounded-2xl overflow-hidden shadow-lg"
                            style={{ background: "linear-gradient(135deg, #540D6E 0%, #7C3AED 50%, #EE4266 100%)" }}>
                            <div className="relative px-8 py-8 flex items-start gap-6">
                                <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
                                    style={{ background: "white", transform: "translate(30%,-30%)" }} />
                                <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-10"
                                    style={{ background: "white", transform: "translate(-50%,50%)" }} />

                                <div className="relative z-10 flex-1">
                                    <h1 className="text-3xl font-black text-white mb-2">
                                        {GRADE_LABELS[course.grade] ?? course.grade}
                                    </h1>
                                    <p className="text-purple-200 text-base mb-3">
                                        Sección {course.section} · Año {course.school_year}
                                    </p>
                                    <p className="text-purple-100 text-sm">
                                        {ovas.length} recurso{ovas.length !== 1 ? "s" : ""} OVA disponible{ovas.length !== 1 ? "s" : ""}
                                    </p>
                                    {course.description && (
                                        <p className="text-purple-200 text-sm mt-2">{course.description}</p>
                                    )}
                                </div>

                                <div className="relative z-10 hidden sm:block flex-shrink-0">
                                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                                        style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
                                        <BookOpen className="w-10 h-10 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sin OVAs */}
                        {ovas.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 text-center">
                                <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                    style={{ background: "linear-gradient(135deg,#540D6E15,#EE426615)" }}>
                                    <Layers className="w-12 h-12" style={{ color: "#540D6E40" }} />
                                </div>
                                <p className="text-lg font-bold text-gray-700 mb-1">No hay OVAs asignados aún</p>
                                <p className="text-sm text-gray-400">Tu profesor asignará recursos próximamente</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {ovas.map((ova, index) => (
                                    <OvaCard key={ova.id} ova={ova} index={index} />
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            </main>

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    );
}
