import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { User, Mail, Lock, Eye, EyeOff, GraduationCap, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const fieldStyle = (name) => ({
        borderColor: focusedField === name ? '#540D6E' : errors[name] ? '#EE4266' : '#E5E7EB',
        boxShadow: focusedField === name ? '0 0 0 3px rgba(84,13,110,0.12)' : 'none',
        transition: 'all 0.2s',
    });

    return (
        <>
            <Head title="Registro de Usuario" />

            {/* Fondo académico — idéntico al Index */}
            <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-50">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(84, 13, 110, 0.08) 1px, transparent 0)`,
                        backgroundSize: '40px 40px',
                    }}
                />
                {/* Barra superior de colores institucionales */}
                <div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{
                        background:
                            'linear-gradient(to right, #540D6E, #EE4266, #FFD23F, #3BCEAC, #0EAD69)',
                    }}
                />
                {/* Manchas de color difusas para darle calidez académica */}
                <div
                    className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-10 blur-3xl"
                    style={{ backgroundColor: '#540D6E' }}
                />
                <div
                    className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-10 blur-3xl"
                    style={{ backgroundColor: '#EE4266' }}
                />
            </div>

            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
                <div className="w-full max-w-md animate-fade-in">

                    {/* Encabezado de institución */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center mb-4">
                            <div
                                className="p-4 rounded-xl shadow-md border"
                                style={{ backgroundColor: 'white', borderColor: '#540D6E' }}
                            >
                                <GraduationCap className="w-10 h-10" style={{ color: '#540D6E' }} />
                            </div>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                            Portal Académico
                        </h1>
                        <p className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1.5">
                            <BookOpen className="w-4 h-4" />
                            Sistema de Gestión Institucional
                        </p>

                        {/* Breadcrumb */}
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-3">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Acceso</span>
                            <span>/</span>
                            <span className="font-semibold" style={{ color: '#540D6E' }}>
                                Registro de Usuario
                            </span>
                        </div>
                    </div>

                    {/* Tarjeta principal */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

                        {/* Banner superior de la tarjeta */}
                        <div
                            className="px-6 py-5 border-b border-gray-100"
                            style={{
                                background: 'linear-gradient(135deg, #540D6E 0%, #7B1FA2 100%)',
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <ShieldCheck className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-white font-bold text-base leading-tight">
                                        Registro de Nuevo Usuario
                                    </h2>
                                    <p className="text-purple-200 text-xs mt-0.5">
                                        Complete los datos para crear su cuenta institucional
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Formulario */}
                        <form onSubmit={submit} className="px-6 py-6 space-y-5">

                            {/* Nombre */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5"
                                >
                                    Nombre Completo
                                </label>
                                <div className="relative">
                                    <User
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                                        style={{ color: focusedField === 'name' ? '#540D6E' : '#9CA3AF' }}
                                    />
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={data.name}
                                        autoComplete="name"
                                        autoFocus
                                        required
                                        placeholder="Ej. María García López"
                                        onChange={(e) => setData('name', e.target.value)}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border-2 rounded-lg outline-none placeholder-gray-400 text-gray-900"
                                        style={fieldStyle('name')}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-1.5 text-xs font-medium flex items-center gap-1" style={{ color: '#EE4266' }}>
                                        <span className="inline-block w-1 h-1 rounded-full bg-current" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Correo */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5"
                                >
                                    Correo Electrónico Institucional
                                </label>
                                <div className="relative">
                                    <Mail
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                                        style={{ color: focusedField === 'email' ? '#540D6E' : '#9CA3AF' }}
                                    />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={data.email}
                                        autoComplete="username"
                                        required
                                        placeholder="usuario@institucion.edu"
                                        onChange={(e) => setData('email', e.target.value)}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border-2 rounded-lg outline-none placeholder-gray-400 text-gray-900"
                                        style={fieldStyle('email')}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1.5 text-xs font-medium flex items-center gap-1" style={{ color: '#EE4266' }}>
                                        <span className="inline-block w-1 h-1 rounded-full bg-current" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Separador visual */}
                            <div className="flex items-center gap-3 py-1">
                                <div className="flex-1 h-px bg-gray-100" />
                                <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">
                                    Seguridad
                                </span>
                                <div className="flex-1 h-px bg-gray-100" />
                            </div>

                            {/* Contraseña */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5"
                                >
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                                        style={{ color: focusedField === 'password' ? '#540D6E' : '#9CA3AF' }}
                                    />
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        autoComplete="new-password"
                                        required
                                        placeholder="Mínimo 8 caracteres"
                                        onChange={(e) => setData('password', e.target.value)}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border-2 rounded-lg outline-none placeholder-gray-400 text-gray-900"
                                        style={fieldStyle('password')}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword
                                            ? <EyeOff className="w-4 h-4" />
                                            : <Eye className="w-4 h-4" />
                                        }
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1.5 text-xs font-medium flex items-center gap-1" style={{ color: '#EE4266' }}>
                                        <span className="inline-block w-1 h-1 rounded-full bg-current" />
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Confirmar contraseña */}
                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5"
                                >
                                    Confirmar Contraseña
                                </label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                                        style={{ color: focusedField === 'password_confirmation' ? '#540D6E' : '#9CA3AF' }}
                                    />
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={data.password_confirmation}
                                        autoComplete="new-password"
                                        required
                                        placeholder="Repita su contraseña"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        onFocus={() => setFocusedField('password_confirmation')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border-2 rounded-lg outline-none placeholder-gray-400 text-gray-900"
                                        style={fieldStyle('password_confirmation')}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirmPassword
                                            ? <EyeOff className="w-4 h-4" />
                                            : <Eye className="w-4 h-4" />
                                        }
                                    </button>
                                </div>
                                {/* Indicador de coincidencia */}
                                {data.password_confirmation && data.password && (
                                    <p
                                        className="mt-1.5 text-xs font-medium flex items-center gap-1"
                                        style={{
                                            color: data.password === data.password_confirmation
                                                ? '#0EAD69'
                                                : '#EE4266',
                                        }}
                                    >
                                        <span className="inline-block w-1 h-1 rounded-full bg-current" />
                                        {data.password === data.password_confirmation
                                            ? 'Las contraseñas coinciden'
                                            : 'Las contraseñas no coinciden'}
                                    </p>
                                )}
                                {errors.password_confirmation && (
                                    <p className="mt-1.5 text-xs font-medium flex items-center gap-1" style={{ color: '#EE4266' }}>
                                        <span className="inline-block w-1 h-1 rounded-full bg-current" />
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            {/* Botón de registro */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 py-3 px-6 text-white font-bold rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                                style={{ backgroundColor: '#540D6E' }}
                                onMouseEnter={(e) => !processing && (e.currentTarget.style.backgroundColor = '#6B1689')}
                                onMouseLeave={(e) => !processing && (e.currentTarget.style.backgroundColor = '#540D6E')}
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        <span>Procesando...</span>
                                    </>
                                ) : (
                                    <>
                                        <GraduationCap className="w-4 h-4" />
                                        <span>Crear Cuenta Institucional</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Pie de la tarjeta */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-1.5 text-sm text-gray-600">
                            <span>¿Ya tiene una cuenta?</span>
                            <Link
                                href={route('login')}
                                className="font-bold hover:underline transition-colors"
                                style={{ color: '#540D6E' }}
                            >
                                Iniciar sesión
                            </Link>
                        </div>
                    </div>

                    {/* Nota de seguridad */}
                    <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Acceso restringido a personal autorizado de la institución
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out both;
                }
            `}</style>
        </>
    );
}