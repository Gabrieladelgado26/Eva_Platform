import { Head, Link, useForm, router, usePage } from "@inertiajs/react";
import { ArrowLeft, User, Mail, Lock, Shield, Check, AlertTriangle, KeyRound, GraduationCap, BookOpen, Info, RotateCcw, X, AlertCircle,Copy
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Edit({ user, roles }) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const { data, setData, put, errors, processing } = useForm({
        name: user.name ?? "",
        email: user.email ?? "",
        username: user.username ?? "",
        password: "",
        role_id: user.role_id,
    });

    const selectedRole = roles.find(r => r.id == data.role_id);
    const isStudentRole = selectedRole?.slug === "student";
    const { credentials } = usePage().props.flash;
    const { flash } = usePage().props;
    const [showCredentialsModal, setShowCredentialsModal] = useState(false);

    useEffect(() => {
        if (flash?.credentials) {
            setShowCredentialsModal(true);
        }
    }, [flash]);

    const [focusedField, setFocusedField] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState({
        username: false,
        pin: false
    });

    const handleRegeneratePin = () => {
        setShowConfirmModal(true);
    };

    const confirmRegeneratePin = () => {
        setShowConfirmModal(false);

        router.patch(route('admin.users.regeneratePin', user.id), {}, {
            preserveScroll: true,
        });
    };

    function submit(e) {
        e.preventDefault();

        put(route("admin.users.update", user.id), {
            preserveScroll: true,
        });
    }

    const getPasswordStrength = (password) => {
        if (!password) return { level: 0, text: "Mantener contraseña actual", color: "gray" };
        if (password.length < 6) return { level: 1, text: "Débil", color: "red" };
        if (password.length < 8) return { level: 2, text: "Aceptable", color: "yellow" };
        if (password.length < 12) return { level: 3, text: "Segura", color: "green" };
        return { level: 4, text: "Muy Segura", color: "emerald" };
    };

    const passwordStrength = getPasswordStrength(data.password);

    const isFieldValid = (field) => {
        if (!data[field]) return false;
        if (field === 'email') return data.email.includes('@') && data.email.includes('.');
        if (field === 'password') return !data.password || data.password.length >= 8;
        return true;
    };

    const copyToClipboard = async (text, field) => {
        try {
            await navigator.clipboard.writeText(text);

            setCopied(prev => ({
                ...prev,
                [field]: true
            }));

            // Quitar el estado después de 2 segundos
            setTimeout(() => {
                setCopied(prev => ({
                    ...prev,
                    [field]: false
                }));
            }, 2000);

        } catch (err) {
            console.error("Error al copiar:", err);
        }
    };

    return (
        <>
            <Head title="Editar Usuario" />
            
            {/* Fondo académico */}
            <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-50">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(84, 13, 110, 0.08) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}></div>
                <div className="absolute top-0 left-0 w-full h-1" style={{
                    background: 'linear-gradient(to right, #540D6E, #EE4266, #FFD23F, #3BCEAC, #0EAD69)'
                }}></div>
            </div>

            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-5xl mx-auto">
                    {/* Header Académico */}
                    <div className="mb-12 animate-fade-in">
                        <Link
                            href={route('admin.dashboard', { section: 'users' })}
                            className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-8 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/80"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                            <span>Volver al Panel de Usuarios</span>
                        </Link>
                        
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-4 rounded-xl shadow-sm border" style={{ 
                                backgroundColor: 'white',
                                borderColor: '#FFD23F'
                            }}>
                                <GraduationCap className="w-10 h-10" style={{ color: '#FFD23F' }} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                    Actualización de Usuario
                                </h1>
                                <p className="text-gray-600 text-base">
                                    Modifique la información del usuario: {user.name}
                                </p>
                            </div>
                        </div>

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <BookOpen className="w-4 h-4" />
                            <span>Gestión Académica</span>
                            <span>/</span>
                            <span>Usuarios</span>
                            <span>/</span>
                            <span className="font-medium" style={{ color: '#540D6E' }}>Editar Usuario</span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slide-up">

                                <form onSubmit={submit} className="p-8 lg:p-10 space-y-8">
                                    <div className="border-b border-gray-200 pb-4 mb-6">
                                        <h2 className="text-lg font-bold text-gray-900">Información Personal</h2>
                                        <p className="text-sm text-gray-500 mt-1">Actualice los datos del usuario</p>
                                    </div>

                                    {/* Name Field */}
                                    <div className="group/field">
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" style={{ color: '#540D6E' }} />
                                                <span>Nombre Completo</span>
                                                <span style={{ color: '#EE4266' }}>*</span>
                                                {isFieldValid('name') && (
                                                    <Check className="w-4 h-4 ml-auto animate-scale-in" style={{ color: '#0EAD69' }} />
                                                )}
                                            </div>
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData("name", e.target.value)}
                                                onFocus={() => setFocusedField('name')}
                                                onBlur={() => setFocusedField(null)}
                                                className={`w-full px-4 py-3 border rounded-lg font-medium transition-all duration-200 ${
                                                    errors.name
                                                        ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                                        : focusedField === 'name'
                                                        ? "bg-white shadow-sm ring-2"
                                                        : "border-gray-300 bg-white hover:border-gray-400"
                                                }`}
                                                style={focusedField === 'name' && !errors.name ? { 
                                                    borderColor: '#540D6E',
                                                    '--tw-ring-color': 'rgba(84, 13, 110, 0.2)'
                                                } : {}}
                                                placeholder="Ejemplo: Dr. Juan Pérez González"
                                                autoFocus
                                            />
                                            {isFieldValid('name') && !errors.name && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    <div className="p-1 rounded-full" style={{ backgroundColor: '#E8F5F0' }}>
                                                        <Check className="w-4 h-4" style={{ color: '#0EAD69' }} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {errors.name && (
                                            <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg animate-slide-down" style={{
                                                borderLeftColor: '#EE4266'
                                            }}>
                                                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EE4266' }} />
                                                <p className="text-sm font-medium text-red-800">{errors.name}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Username Field */}
                                    {isStudentRole && (
                                        <div className="group/field">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4" style={{ color: '#540D6E' }} />
                                                    <span>Username</span>
                                                </div>
                                            </label>

                                            <input
                                                type="text"
                                                value={data.username}
                                                disabled
                                                className="w-full px-4 py-3 border rounded-lg bg-gray-100 text-gray-600 font-medium cursor-not-allowed"
                                            />

                                            <p className="text-xs text-gray-500 mt-1">
                                                El username no puede modificarse.
                                            </p>
                                        </div>
                                    )}

                                    {/* Email Field */}
                                    {!isStudentRole && (
                                        <div className="group/field">
                                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4" style={{ color: '#540D6E' }} />
                                                    <span>Correo Electrónico Institucional</span>
                                                    <span style={{ color: '#EE4266' }}>*</span>
                                                    {isFieldValid('email') && (
                                                        <Check className="w-4 h-4 ml-auto animate-scale-in" style={{ color: '#0EAD69' }} />
                                                    )}
                                                </div>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData("email", e.target.value)}
                                                    onFocus={() => setFocusedField('email')}
                                                    onBlur={() => setFocusedField(null)}
                                                    className={`w-full px-4 py-3 border rounded-lg font-medium transition-all duration-200 ${
                                                        errors.email
                                                            ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                                            : focusedField === 'email'
                                                            ? "bg-white shadow-sm ring-2"
                                                            : "border-gray-300 bg-white hover:border-gray-400"
                                                    }`}
                                                    style={focusedField === 'email' && !errors.email ? { 
                                                        borderColor: '#540D6E',
                                                        '--tw-ring-color': 'rgba(84, 13, 110, 0.2)'
                                                    } : {}}
                                                    placeholder="usuario@universidad.edu"
                                                />
                                                {isFieldValid('email') && !errors.email && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                        <div className="p-1 rounded-full" style={{ backgroundColor: '#E8F5F0' }}>
                                                            <Check className="w-4 h-4" style={{ color: '#0EAD69' }} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {errors.email && (
                                                <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg animate-slide-down" style={{
                                                    borderLeftColor: '#EE4266'
                                                }}>
                                                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EE4266' }} />
                                                    <p className="text-sm font-medium text-red-800">{errors.email}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="border-b border-gray-200 pb-4 mb-6 mt-8">
                                        <h2 className="text-lg font-bold text-gray-900">Credenciales de Acceso</h2>
                                        <p className="text-sm text-gray-500 mt-1">Opcional: actualice la contraseña del usuario</p>
                                    </div>

                                    {/* Password Field */}
                                    {!isStudentRole && (
                                        <div className="group/field">
                                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <KeyRound className="w-4 h-4" style={{ color: '#540D6E' }} />
                                                    <span>Nueva Contraseña</span>
                                                    <span className="text-xs text-gray-500 ml-2">(Opcional)</span>
                                                    {data.password && isFieldValid('password') && (
                                                        <Check className="w-4 h-4 ml-auto animate-scale-in" style={{ color: '#0EAD69' }} />
                                                    )}
                                                </div>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    value={data.password}
                                                    onChange={(e) => setData("password", e.target.value)}
                                                    onFocus={() => setFocusedField('password')}
                                                    onBlur={() => setFocusedField(null)}
                                                    className={`w-full px-4 py-3 pr-12 border rounded-lg font-medium transition-all duration-200 ${
                                                        errors.password
                                                            ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                                            : focusedField === 'password'
                                                            ? "bg-white shadow-sm ring-2"
                                                            : "border-gray-300 bg-white hover:border-gray-400"
                                                    }`}
                                                    style={focusedField === 'password' && !errors.password ? { 
                                                        borderColor: '#540D6E',
                                                        '--tw-ring-color': 'rgba(84, 13, 110, 0.2)'
                                                    } : {}}
                                                    placeholder="Dejar en blanco para mantener actual"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded transition-colors"
                                                >
                                                    {showPassword ? (
                                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                            {errors.password ? (
                                                <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg animate-slide-down" style={{
                                                    borderLeftColor: '#EE4266'
                                                }}>
                                                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EE4266' }} />
                                                    <p className="text-sm font-medium text-red-800">{errors.password}</p>
                                                </div>
                                            ) : data.password ? (
                                                <div className="mt-3 space-y-2">
                                                    {/* Password strength bar */}
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4].map((level) => (
                                                            <div
                                                                key={level}
                                                                className={`h-1 flex-1 rounded-full transition-all duration-300`}
                                                                style={{
                                                                    backgroundColor: level <= passwordStrength.level
                                                                        ? passwordStrength.color === 'red' ? '#EE4266' :
                                                                        passwordStrength.color === 'yellow' ? '#FFD23F' :
                                                                        passwordStrength.color === 'green' ? '#3BCEAC' :
                                                                        passwordStrength.color === 'emerald' ? '#0EAD69' :
                                                                        '#E5E7EB'
                                                                        : '#E5E7EB'
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="font-medium text-gray-600">
                                                            Nivel de seguridad: <span className="font-semibold" style={{
                                                                color: passwordStrength.color === 'red' ? '#EE4266' :
                                                                    passwordStrength.color === 'yellow' ? '#D97706' :
                                                                    passwordStrength.color === 'green' ? '#3BCEAC' :
                                                                    passwordStrength.color === 'emerald' ? '#0EAD69' :
                                                                    '#6B7280'
                                                            }}>
                                                                {passwordStrength.text}
                                                            </span>
                                                        </span>
                                                        <span className="text-gray-400">
                                                            {data.password.length} caracteres
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
                                                    <Info className="w-3 h-3" />
                                                    Deje este campo vacío para mantener la contraseña actual
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Pin Field */}
                                    {isStudentRole && (
                                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F3E8FF' }}>
                                                        <KeyRound className="w-4 h-4" style={{ color: '#540D6E' }} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">PIN de acceso</h4>
                                                        <p className="text-xs text-gray-500">4 dígitos numéricos</p>
                                                    </div>
                                                </div>
                                                <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-gray-600 font-medium">Estudiante</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                                                    <KeyRound className="w-4 h-4 text-gray-400" />
                                                    <span className="font-mono text-base tracking-widest font-medium text-gray-600">••••</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleRegeneratePin}
                                                    className="px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors whitespace-nowrap"
                                                    style={{ backgroundColor: '#540D6E' }}
                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#6B1689'}
                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#540D6E'}
                                                >
                                                    Regenerar
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-end gap-4 pt-8 border-t border-gray-200">
                                        <Link
                                            href={route('admin.dashboard', { section: 'users' })}
                                            className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                                            style={{ '--tw-ring-color': 'rgba(107, 114, 128, 0.3)' }}
                                        >
                                            Cancelar
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                                            style={{
                                                backgroundColor: '#FFD23F',
                                                '--tw-ring-color': 'rgba(255, 210, 63, 0.5)'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5C000'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFD23F'}
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Procesando...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    <span>Actualizar Datos</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Academic Sidebar */}
                        <div className="lg:col-span-1 space-y-6 animate-slide-left">
                            {/* User Info Card */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#F3E8FF' }}>
                                        <User className="w-5 h-5" style={{ color: '#540D6E' }} />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Información Actual</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-sm" style={{
                                            background: 'linear-gradient(to bottom right, #540D6E, #EE4266)'
                                        }}>
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                                            <p className="text-xs text-gray-500">ID: #{user.id}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        {!isStudentRole && (
                                            <div className="flex items-start gap-2">
                                                <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium">Email actual</p>
                                                    <p className="text-gray-900 font-medium">{user.email}</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-start gap-2">
                                            <Shield className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Rol actual</p>
                                                <p className="text-gray-900 font-medium">{roles.find(r => r.id == user.role_id)?.name}</p>                               
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Fecha de registro</p>
                                                <p className="text-gray-900 font-medium">{new Date(user.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tips Card */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#FFF9E6' }}>
                                        <BookOpen className="w-5 h-5" style={{ color: '#D97706' }} />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Recomendaciones</h3>
                                </div>
                                <ul className="space-y-2.5 text-sm text-gray-600">
                                    <li className="flex gap-2.5 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#540D6E' }}></div>
                                        <span>La contraseña solo se modificará si ingresa una nueva</span>
                                    </li>
                                    <li className="flex gap-2.5 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#540D6E' }}></div>
                                        <span>Verifique que el correo electrónico sea válido</span>
                                    </li>
                                    <li className="flex gap-2.5 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#540D6E' }}></div>
                                        <span>Confirme que el rol asignado corresponde a las funciones del usuario</span>
                                    </li>
                                    <li className="flex gap-2.5 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#540D6E' }}></div>
                                        <span>Los cambios serán efectivos inmediatamente</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Confirmación para Regenerar PIN */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full animate-slide-up overflow-hidden">
                        <div className="h-1" style={{ background: 'linear-gradient(to right, #540D6E, #EE4266)' }} />
                        
                        <div className="p-6">
                            <button onClick={() => setShowConfirmModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-lg" style={{ backgroundColor: '#F3E8FF' }}>
                                    <RotateCcw className="w-5 h-5" style={{ color: '#540D6E' }} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Regenerar PIN</h3>
                            </div>

                            <p className="text-gray-600 mb-4">
                                ¿Estás seguro de regenerar el PIN de acceso para <span className="font-semibold text-gray-900">{user.name}</span>?
                            </p>

                            <div className="p-3 rounded-lg mb-6 flex gap-2" style={{ backgroundColor: '#FEF2F2', borderLeft: '4px solid #EE4266' }}>
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EE4266' }} />
                                <p className="text-xs text-gray-700">El PIN anterior dejará de funcionar inmediatamente. El estudiante deberá usar el nuevo PIN.</p>
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setShowConfirmModal(false)} 
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={confirmRegeneratePin} 
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-md" 
                                    style={{ backgroundColor: '#540D6E' }} 
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#6B1689'} 
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#540D6E'}
                                >
                                    Regenerar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Nuevo PIN Regenerado */}
            {showCredentialsModal && flash?.credentials && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCredentialsModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full animate-slide-up overflow-hidden">
                        {/* Barra superior delgada como la de la página principal - con los colores originales */}
                        <div className="h-1" style={{ background: "linear-gradient(to right, #540D6E, #EE4266)" }} />
                        
                        <div className="p-6">
                            {/* Header con icono al lado del título - icono más grande */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-xl bg-white shadow-md border border-gray-200">
                                    <KeyRound className="w-8 h-8" style={{ color: "#540D6E" }} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">PIN Regenerado</h2>
                                    <p className="text-sm text-gray-600">Nuevo PIN de acceso para el estudiante</p>
                                </div>
                            </div>

                            {/* PIN */}
                            <div className="mb-6">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Nuevo PIN</label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm flex items-center gap-2">
                                        <KeyRound className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-800 text-lg tracking-wider font-bold">{credentials.pin}</span>
                                    </div>
                                    <button onClick={() => copyToClipboard(credentials.pin, 'pin')}
                                        className="p-3 rounded-lg transition-all border-2 hover:shadow-md"
                                        style={{ borderColor: copied.pin ? "#0EAD69" : "#540D6E", backgroundColor: copied.pin ? "#E8F5F0" : "white" }}>
                                        {copied.pin ? <Check className="w-5 h-5" style={{ color: "#0EAD69" }} /> : <Copy className="w-5 h-5" style={{ color: "#540D6E" }} />}
                                    </button>
                                </div>
                                {copied.pin && <p className="text-xs text-green-600 mt-1 animate-fade-in">✓ PIN copiado</p>}
                            </div>

                            {/* Nota de seguridad actualizada */}
                            <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: "#F3E8FF", borderLeft: "4px solid #540D6E" }}>
                                <p className="text-xs text-gray-700 flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#540D6E" }} />
                                    <span>El PIN anterior ya no funciona, comparte este nuevo PIN de forma segura con el estudiante.</span>
                                </p>
                            </div>

                            {/* Botón */}
                            <button onClick={() => setShowCredentialsModal(false)}
                                className="w-full py-3 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                                style={{ backgroundColor: "#540D6E" }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#6B1689"}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#540D6E"}>
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideLeft {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0); }
                    to { opacity: 1; transform: scale(1); }
                }
                
                .animate-fade-in { animation: fadeIn 0.6s ease-out; }
                .animate-slide-up { animation: slideUp 0.6s ease-out; }
                .animate-slide-down { animation: slideDown 0.3s ease-out; }
                .animate-slide-left { animation: slideLeft 0.8s ease-out; }
                .animate-scale-in { animation: scaleIn 0.3s ease-out; }
            `}</style>
        </>
    );
}