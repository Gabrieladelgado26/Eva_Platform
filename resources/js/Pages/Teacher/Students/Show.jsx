import { Head, Link, usePage, router } from "@inertiajs/react";
import { useState } from "react";
import AppSidebar, { useSidebarState } from '@/Components/AppSidebar';
import {
    User, Eye, EyeOff, Shield, RotateCcw, AlertCircle, CheckCircle,
    GraduationCap, BookOpen, Award, Calendar, X, Copy, Check, ArrowLeft,
    Edit2, Power, Loader2
} from "lucide-react";

function StudentAvatar({ student }) {
    if (student.avatar) {
        return (
            <img
                src={`/avatars/${student.avatar}.png`}
                alt={student.name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-md"
                onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent && !parent.querySelector('.avatar-fallback')) {
                        const fallback = document.createElement('div');
                        fallback.className = "avatar-fallback w-20 h-20 rounded-full flex items-center justify-center text-white font-bold shadow-md";
                        fallback.style.background = "linear-gradient(to bottom right, #540D6E, #EE4266)";
                        fallback.textContent = student.name?.charAt(0).toUpperCase() ?? 'E';
                        parent.appendChild(fallback);
                    }
                }}
            />
        );
    }
    return (
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold shadow-md text-2xl"
            style={{ background: "linear-gradient(to bottom right, #540D6E, #EE4266)" }}>
            {student.name?.charAt(0).toUpperCase() ?? 'E'}
        </div>
    );
}

function PinRevealField({ pin, student, onCredentialsGenerated }) {
    const [revealed, setRevealed] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showRegenerateModal, setShowRegenerateModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const isHashed = pin?.startsWith('$2y') || pin?.startsWith('$2b') || pin?.startsWith('$');

    const handleCopy = () => {
        if (revealed && !isHashed) {
            navigator.clipboard.writeText(pin);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const confirmRegenerate = () => {
        setLoading(true);
        router.post(route('teacher.students.regeneratePin', student.id), {}, {
            preserveScroll: true,
            onSuccess: (page) => {
                setShowRegenerateModal(false);
                setRevealed(false);
                const flash = page.props.flash;
                if (flash?.new_pin) {
                    onCredentialsGenerated({
                        pin: flash.new_pin,
                        name: flash.student_name,
                        username: flash.student_username
                    });
                }
            },
            onFinish: () => setLoading(false)
        });
    };

    return (
        <>
            {/* Regenerate Confirmation Modal */}
            {showRegenerateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowRegenerateModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden">
                        <div className="h-1" style={{ background: 'linear-gradient(to right, #540D6E, #EE4266)' }} />
                        <div className="p-6">
                            <button onClick={() => setShowRegenerateModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: '#F3E8FF' }}>
                                    <RotateCcw className="w-5 h-5" style={{ color: '#540D6E' }} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Regenerar PIN</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                ¿Estás seguro de regenerar el PIN de acceso para <span className="font-semibold text-gray-900">{student.name}</span>?
                            </p>
                            <div className="p-3 rounded-lg mb-6 flex gap-2" style={{ backgroundColor: '#FEF2F2', borderLeft: '4px solid #EE4266' }}>
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EE4266' }} />
                                <p className="text-xs text-gray-700">El PIN anterior dejará de funcionar inmediatamente. El estudiante deberá usar el nuevo PIN para ingresar.</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowRegenerateModal(false)}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
                                    disabled={loading}>
                                    Cancelar
                                </button>
                                <button onClick={confirmRegenerate}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                                    style={{ backgroundColor: '#540D6E' }}
                                    onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = '#6B1689')}
                                    onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = '#540D6E')}
                                    disabled={loading}>
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                                    {loading ? 'Regenerando...' : 'Regenerar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function EditNameModal({ student, onClose }) {
    const [name, setName] = useState(student.name || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        
        setLoading(true);
        router.put(route('teacher.students.update', student.id), {
            name: name.trim()
        }, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },
            onFinish: () => setLoading(false)
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden">
                <div className="h-1" style={{ background: 'linear-gradient(to right, #540D6E, #EE4266)' }} />
                <div className="p-6">
                    <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-lg" style={{ backgroundColor: '#F3E8FF' }}>
                            <Edit2 className="w-5 h-5" style={{ color: '#540D6E' }} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Editar Nombre</h3>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ej: Juan Pérez"
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
                                style={{ "--tw-ring-color": "rgba(84, 13, 110, 0.2)" }}
                                onFocus={e => e.target.style.borderColor = "#540D6E"}
                                onBlur={e => e.target.style.borderColor = "#E5E7EB"}
                                disabled={loading}
                                autoFocus
                            />
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={onClose}
                                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
                                disabled={loading}>
                                Cancelar
                            </button>
                            <button type="submit"
                                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                                style={{ backgroundColor: '#540D6E' }}
                                onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = '#6B1689')}
                                onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = '#540D6E')}
                                disabled={loading}>
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                {loading ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function ToggleStatusModal({ student, newStatus, onClose, onConfirm }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden">
                <div className="h-1" style={{ background: 'linear-gradient(to right, #540D6E, #EE4266)' }} />
                <div className="p-6">
                    <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-lg" style={{ backgroundColor: newStatus ? '#E8F5F0' : '#FEF2F2' }}>
                            <Power className="w-5 h-5" style={{ color: newStatus ? '#0EAD69' : '#EE4266' }} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                            {newStatus ? 'Activar' : 'Desactivar'} Estudiante
                        </h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                        {newStatus
                            ? `Vas a activar a ${student.name}. El estudiante podrá acceder a sus cursos.`
                            : `Vas a desactivar a ${student.name}. El estudiante no podrá acceder a sus cursos.`
                        }
                    </p>
                    <div className="flex gap-3">
                        <button onClick={onClose}
                            className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                            Cancelar
                        </button>
                        <button onClick={onConfirm}
                            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-md"
                            style={{ backgroundColor: newStatus ? '#0EAD69' : '#EE4266' }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                            {newStatus ? 'Activar' : 'Desactivar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function StudentShow({ student = {}, courses = [], evaluations = [] }) {
    const { props } = usePage();
    const flash = props.flash || {};
    const [collapsed] = useSidebarState();
    const [showNewCredentials, setShowNewCredentials] = useState(null);
    const [editingName, setEditingName] = useState(false);
    const [toggleStatus, setToggleStatus] = useState(false);

    const isActive = typeof student.is_active === 'boolean' ? student.is_active :
        typeof student.is_active === 'number' ? student.is_active === 1 :
            student.is_active === "1" || student.is_active === "true";

    const avgPercentage = evaluations.length > 0
        ? Math.round(evaluations.reduce((sum, e) => sum + e.percentage, 0) / evaluations.length)
        : 0;

    const handleToggleStatus = () => {
        router.patch(route('teacher.students.toggleStatus', student.id), {}, {
            preserveScroll: true,
            onSuccess: () => setToggleStatus(false)
        });
    };

    return (
        <>
            <Head title={`${student.name} - Mis Estudiantes`} />

            <AppSidebar currentRoute="teacher.students.index" />

            <main className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-20" : "lg:ml-72"} min-h-screen bg-gray-50`}>
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Breadcrumb */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Link href={route("dashboard")} className="hover:text-purple-600 transition-colors">Panel de Control</Link>
                                <span>/</span>
                                <Link href={route("teacher.students.index")} className="hover:text-purple-600 transition-colors">Mis Estudiantes</Link>
                                <span>/</span>
                                <span style={{ color: "#540D6E" }} className="font-medium">{student.name}</span>
                            </div>
                        </div>

                        {/* Back Button */}
                        <Link href={route('teacher.students.index')}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 mb-4 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Volver a Mis Estudiantes
                        </Link>

                        {/* Flash Messages */}
                        {flash?.success && (
                            <div className="mb-6">
                                <div className="p-4 rounded-lg border border-green-300 bg-green-50 text-green-700 font-semibold shadow-sm">
                                    {flash.success}
                                </div>
                            </div>
                        )}

                        {/* Student Header */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                <StudentAvatar student={student} />
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
                                        <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
                                        <button
                                            onClick={() => setEditingName(true)}
                                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                                            style={{ backgroundColor: "#F3E8FF", color: "#540D6E" }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#E9D5FF"}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#F3E8FF"}>
                                            <Edit2 className="w-4 h-4" /> Editar
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600 font-mono">{student.username}</span>
                                        </div>
                                        {student.email && (
                                            <div className="flex items-center gap-3">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-600">{student.email}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border" style={isActive ? { backgroundColor: "#E8F5F0", borderColor: "#3BCEAC" } : { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }}>
                                                <div className={`w-2 h-2 rounded-full ${isActive ? "animate-pulse" : ""}`}
                                                    style={{ backgroundColor: isActive ? "#0EAD69" : "#9CA3AF" }} />
                                                <span className="text-xs font-medium" style={{ color: isActive ? "#0EAD69" : "#6B7280" }}>
                                                    {isActive ? "Activo" : "Inactivo"}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setToggleStatus(true)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                                                style={{
                                                    backgroundColor: isActive ? "#FEE2E2" : "#E8F5F0",
                                                    color: isActive ? "#EE4266" : "#0EAD69"
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                                                <Power className="w-3 h-3" /> {isActive ? 'Desactivar' : 'Activar'}
                                            </button>
                                            {student.created_at && (
                                                <span className="text-sm text-gray-500 ml-4">
                                                    Registrado desde {new Date(student.created_at).toLocaleDateString('es-ES')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PIN Section */}
                        <PinRevealField pin={student.pin} student={student} onCredentialsGenerated={setShowNewCredentials} />

                        {/* Courses Section */}
                        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-lg" style={{ backgroundColor: "#F3E8FF" }}>
                                    <BookOpen className="w-6 h-6" style={{ color: "#540D6E" }} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Cursos Inscritos</h2>
                                    <p className="text-sm text-gray-600">{courses.length} {courses.length === 1 ? 'curso' : 'cursos'}</p>
                                </div>
                            </div>

                            {courses.length > 0 ? (
                                <div className="space-y-3">
                                    {courses.map((course) => (
                                        <div key={course.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{course.name}</h3>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Grado {course.grade} - Sección {course.section}
                                                    </p>
                                                </div>
                                                <Link href={route("teacher.courses.show", course.id)}
                                                    className="px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                                                    style={{ backgroundColor: "#F3E8FF", color: "#540D6E" }}
                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#E9D5FF"}
                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#F3E8FF"}>
                                                    Ver Curso
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No inscrito en ningún curso</p>
                                </div>
                            )}
                        </div>

                        {/* Evaluations Section */}
                        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-lg" style={{ backgroundColor: "#FFF4E6" }}>
                                    <Award className="w-6 h-6" style={{ color: "#FFD23F" }} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Evaluaciones</h2>
                                    <p className="text-sm text-gray-600">{evaluations.length} evaluaciones realizadas</p>
                                </div>
                            </div>

                            {/* Stats */}
                            {evaluations.length > 0 && (
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Porcentaje Promedio</p>
                                        <p className="text-3xl font-black mt-2" style={{ color: avgPercentage >= 70 ? "#0EAD69" : avgPercentage >= 50 ? "#FFD23F" : "#EE4266" }}>
                                            {avgPercentage}%
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Evaluaciones</p>
                                        <p className="text-3xl font-black mt-2" style={{ color: "#540D6E" }}>
                                            {evaluations.length}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {evaluations.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">OVA</th>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Área</th>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Puntaje</th>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">%</th>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Intento</th>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Fecha</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {evaluations.map((ev) => (
                                                <tr key={ev.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3 font-semibold text-gray-900">{ev.ova?.tematica || 'N/A'}</td>
                                                    <td className="px-4 py-3 text-gray-600">{ev.ova?.area || 'N/A'}</td>
                                                    <td className="px-4 py-3 font-mono text-gray-700">{ev.score}/{ev.total}</td>
                                                    <td className="px-4 py-3">
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                                                            style={{
                                                                backgroundColor: ev.percentage >= 70 ? "#E8F5F0" : ev.percentage >= 50 ? "#FFF4E6" : "#FEE2E2",
                                                                color: ev.percentage >= 70 ? "#0EAD69" : ev.percentage >= 50 ? "#F59E0B" : "#EE4266"
                                                            }}>
                                                            {ev.percentage}%
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600">{ev.attempt}</td>
                                                    <td className="px-4 py-3 text-gray-500 text-xs">{ev.created_at}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No hay evaluaciones registradas</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Modals */}
            {showNewCredentials && <CredentialsModal credentials={showNewCredentials} onClose={() => setShowNewCredentials(null)} />}
            {editingName && <EditNameModal student={student} onClose={() => setEditingName(false)} />}
            {toggleStatus && (
                <ToggleStatusModal
                    student={student}
                    newStatus={!isActive}
                    onClose={() => setToggleStatus(false)}
                    onConfirm={handleToggleStatus}
                />
            )}
        </>
    );
}
