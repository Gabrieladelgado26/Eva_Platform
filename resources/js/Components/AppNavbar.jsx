// resources/js/Components/AppNavbar.jsx
import { Link } from '@inertiajs/react';
import { ArrowRight, Home } from 'lucide-react';

export default function AppNavbar({ 
    auth = null, 
    variant = 'welcome',
    className = '' 
}) {
    return (
        <div className={`sticky top-0 z-50 ${className}`}>
            {/* Línea superior decorativa */}
            <div 
                className="h-1" 
                style={{ background: 'linear-gradient(90deg, #540D6E 0%, #EE4266 50%, #FFD23F 100%)' }} 
            />
            
            <nav className="relative bg-white/90 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo - Corregido para usar '/' o ruta que exista */}
                        <div className="flex items-center gap-3">
                            <Link href="/">
                                <img 
                                    src="/assets/images/logos/logo.png" 
                                    alt="EVA Logo" 
                                    className="w-26 h-16 object-contain"
                                />
                            </Link>
                            <div className="hidden sm:block">
                                <span 
                                    className="text-lg text-gray-500 ml-1 font-medium" 
                                    style={{ fontFamily: "'Quicksand', sans-serif" }}
                                >
                                    Explora • Investiga • Aprende
                                </span>
                            </div>
                        </div>

                        {/* Links de navegación */}
                        <div className="flex items-center gap-4">
                            {variant === 'welcome' ? (
                                // Variante para la página Welcome
                                <>
                                    {auth?.user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-base font-bold text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                                            style={{ 
                                                background: 'linear-gradient(135deg, #540D6E, #6B1689)',
                                                fontFamily: "'Quicksand', sans-serif"
                                            }}
                                        >
                                            Ir al Panel
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route('login')}
                                                className="px-6 py-2.5 rounded-xl text-base font-bold border-2 transition-all duration-200 hover:shadow-md"
                                                style={{ 
                                                    borderColor: '#540D6E',
                                                    color: '#540D6E',
                                                    fontFamily: "'Quicksand', sans-serif"
                                                }}
                                            >
                                                Iniciar Sesión
                                            </Link>
                                            <Link
                                                href={route('register')}
                                                className="px-6 py-2.5 rounded-xl text-base font-bold text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                                                style={{ 
                                                    background: 'linear-gradient(135deg, #540D6E, #6B1689)',
                                                    fontFamily: "'Quicksand', sans-serif"
                                                }}
                                            >
                                                Registro Docente
                                            </Link>
                                        </>
                                    )}
                                </>
                            ) : (
                                // Variante para páginas de autenticación
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-base font-semibold transition-all duration-200 hover:shadow-md"
                                    style={{ 
                                        color: '#540D6E',
                                        borderColor: '#540D6E',
                                        border: '2px solid #540D6E',
                                        fontFamily: "'Quicksand', sans-serif"
                                    }}
                                >
                                    Volver al Inicio
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Ola estática inferior del navbar */}
                <div 
                    className="absolute bottom-0 left-0 w-full overflow-hidden leading-none" 
                    style={{ height: '14px', transform: 'translateY(100%)' }}
                >
                    <svg
                        viewBox="0 0 1440 14"
                        preserveAspectRatio="none"
                        style={{ display: 'block', width: '100%', height: '100%' }}
                    >
                        <path
                            d="M0,7 Q180,14 360,7 Q540,0 720,7 Q900,14 1080,7 Q1260,0 1440,7"
                            fill="none"
                            stroke="#D1D5DB"
                            strokeWidth="1.5"
                        />
                    </svg>
                </div>
            </nav>
        </div>
    );
}