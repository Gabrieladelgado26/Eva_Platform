import { Head, Link, useForm } from '@inertiajs/react';
import { User, Mail, Lock, Eye, EyeOff, GraduationCap, BookOpen, ShieldCheck, ArrowRight, Users, Building2, Award } from 'lucide-react';
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
                <div className="w-full max-w-6xl animate-fade-in">
                    {/* Layout de dos columnas */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        
                        {/* COLUMNA IZQUIERDA - Totalmente centrada */}
                        <div className="flex items-center justify-center">
                            <div className="w-full max-w-md space-y-10 text-center">
                                {/* Encabezado de institución - centrado */}
                                <div className="group">
                                    {/* Títulos con gradiente y animación */}
                                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent animate-gradient-text">
                                        Portal Académico
                                    </h1>
                                    <p className="text-gray-500 text-base mt-2 flex items-center justify-center gap-2">
                                        Sistema de Gestión Institucional
                                    </p>

                                    {/* Breadcrumb elegante con decoración */}
                                    <div className="flex items-center justify-center gap-2 mt-4">
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100/50 backdrop-blur-sm">
                                            <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="text-xs text-gray-500">Acceso</span>
                                            <span className="text-gray-300">/</span>
                                            <span className="text-xs font-semibold bg-gradient-to-r from-[#540D6E] to-[#EE4266] bg-clip-text text-transparent">
                                                Registro de Usuario
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Mensaje de uso exclusivo para docentes - centrado */}
                                <div className="relative">
                                    <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#540D6E]/20 to-transparent" />
                                    
                                    <div className="py-6">
                                        <div className="flex flex-col items-center justify-center text-center gap-4">
                                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#540D6E]/10 to-[#EE4266]/10 border border-[#540D6E]/20">
                                                <ShieldCheck className="w-4 h-4 text-[#540D6E]" />
                                                <span className="text-xs font-semibold text-[#540D6E] uppercase tracking-wider">Acceso Autorizado</span>
                                            </div>
                                            
                                            <p className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#540D6E] via-[#EE4266] to-[#540D6E] bg-clip-text text-transparent animate-gradient-text">
                                                Uso exclusivo para docentes
                                            </p>
                                            
                                            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                                                Este registro está habilitado únicamente para el personal docente 
                                                de instituciones educativas pertenecientes a nuestra red académica.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#540D6E]/20 to-transparent" />
                                </div>

                                {/* Estadísticas sutiles - centradas */}
                                <div className="flex items-center justify-center gap-6 pt-2">
                                    <div className="text-center">
                                        <p className="text-xl font-bold bg-gradient-to-r from-[#540D6E] to-[#EE4266] bg-clip-text text-transparent">
                                            +2,500
                                        </p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Docentes Activos</p>
                                    </div>
                                    <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
                                    <div className="text-center">
                                        <p className="text-xl font-bold bg-gradient-to-r from-[#540D6E] to-[#EE4266] bg-clip-text text-transparent">
                                            +180
                                        </p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Instituciones</p>
                                    </div>
                                    <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
                                    <div className="text-center">
                                        <p className="text-xl font-bold bg-gradient-to-r from-[#540D6E] to-[#EE4266] bg-clip-text text-transparent">
                                            99%
                                        </p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Satisfacción</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COLUMNA DERECHA - Tarjeta del formulario */}
                        <div>
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
                        </div>
                    </div>

                    {/* Nota de seguridad */}
                    <p className="text-center text-xs text-gray-400 mt-8 flex items-center justify-center gap-1.5">
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

                @keyframes gradient-text {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                .animate-gradient-text {
                    background-size: 200% auto;
                    animation: gradient-text 3s ease infinite;
                }
            `}</style>
        </>
    );
}