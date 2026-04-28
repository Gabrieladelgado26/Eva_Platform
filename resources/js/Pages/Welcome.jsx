import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Zap, ArrowRight, ChevronRight, Shield, Compass, Palette, Microscope, Music, MapPin, Home, Calendar, GraduationCap, Star, ChevronLeft } from 'lucide-react';

// ─── Componente Welcome Principal ─────────────────────────────────────────────
export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const features = [
        {
            icon: BookOpen,
            title: 'Contenido Interactivo',
            description: 'OVAs diseñados con metodología pedagógica activa para un aprendizaje significativo y autónomo.',
            color: '#540D6E',
            bgColor: '#F3E8FF'
        },
        {
            icon: Users,
            title: 'Aprendizaje Colaborativo',
            description: 'Espacios que fomentan la interacción entre estudiantes, docentes y contenido educativo de calidad.',
            color: '#EE4266',
            bgColor: '#FEE2E2'
        },
        {
            icon: Shield,
            title: 'Entorno Seguro',
            description: 'Plataforma protegida con acceso personalizado para cada estudiante, garantizando privacidad y control.',
            color: '#0EAD69',
            bgColor: '#E8F5F0'
        },
        {
            icon: Zap,
            title: 'Resultados Medibles',
            description: 'Seguimiento detallado del progreso académico con estadísticas claras para docentes y administradores.',
            color: '#FFD23F',
            bgColor: '#FFF9E6'
        }
    ];

    const stats = [
        { value: '1,200+', label: 'Estudiantes Activos', color: '#540D6E' },
        { value: '150+', label: 'OVAs Disponibles', color: '#EE4266' },
        { value: '45+', label: 'Docentes', color: '#0EAD69' },
        { value: '6', label: 'Regiones de Nariño', color: '#FFD23F' }
    ];

    // ─── Datos de personajes ───
    const CHARACTERS = [
        {
            id: 'avatar2', name: 'William', nickname: 'Willy', age: 6, grade: 'Primero',
            origin: 'Pacífico Sur', location: 'Tumaco, Francisco Pizarro',
            icon: Compass,
            color: '#1D4ED8', colorLight: '#BFDBFE', bg: '#EFF6FF',
            description: 'Recoge conchas en la playa y hace collares. Le encanta hacer preguntas sobre el mar y las estrellas. Vive con su madre y su abuela.',
            traits: ['Alegre', 'Curioso', 'Aventurero'],
        },
        {
            id: 'avatar1', name: 'Pilar', nickname: 'Pili', age: 7, grade: 'Segundo',
            origin: 'La Sabana', location: 'Túquerres, Imués',
            icon: Palette,
            color: '#059669', colorLight: '#A7F3D0', bg: '#ECFDF5',
            description: 'Dibuja los paisajes de su región y sueña con ser una gran artista. Quiere descubrir los secretos del volcán Azufral.',
            traits: ['Artista', 'Soñadora', 'Creativa'],
        },
        {
            id: 'avatar4', name: 'Alberto', nickname: 'Beto', age: 8, grade: 'Tercero',
            origin: 'Centro', location: 'Pasto, Nariño',
            icon: Microscope,
            color: '#D4A000', colorLight: '#FFE97A', bg: '#FFFBEB',
            description: 'Siempre pregunta "¿por qué?". Investiga el origen de los nombres en su municipio. Es un estudiante investigador.',
            traits: ['Investigador', 'Persistente', 'Inteligente'],
        },
        {
            id: 'avatar5', name: 'Ivy', nickname: 'Ivy', age: 10, grade: 'Cuarto',
            origin: 'Sanquianga', location: 'El Charco, La Tola',
            icon: Music,
            color: '#6D28D9', colorLight: '#DDD6FE', bg: '#F5F3FF',
            description: 'Canta todo el tiempo y sueña con llevar la música de su región a todo el país. Lleva un diario de campo a todas partes.',
            traits: ['Cantante', 'Apasionada', 'Dedicada'],
        },
        {
            id: 'avatar6', name: 'Juliana', nickname: 'Juli', age: 12, grade: 'Quinto',
            origin: 'Occidente', location: 'Linares, Sandoná',
            icon: Users,
            color: '#0F766E', colorLight: '#99F6E4', bg: '#F0FDFA',
            description: 'Líder natural. Aprende el arte de los sombreros de paja Toquilla y ayuda en la cosecha de café. Es muy amiguera.',
            traits: ['Líder', 'Trabajadora', 'Comprometida'],
        },
        {
            id: 'avatar3', name: 'Felipe', nickname: 'Pipe', age: 15, grade: 'Secundaria',
            origin: 'Río Mayo', location: 'El Tablón, Albán',
            icon: Music,
            color: '#BE123C', colorLight: '#FECDD3', bg: '#FFF1F2',
            description: 'Toca guitarra y compone sus propias canciones. Quiere entender la ciencia detrás de la música y grabar su propio disco.',
            traits: ['Músico', 'Compositor', 'Creativo'],
        },
    ];

    const [currentChar, setCurrentChar] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimatingChar, setIsAnimatingChar] = useState(false);

    const navigateChar = (dir) => {
        if (isAnimatingChar) return;
        setIsAnimatingChar(true);
        setTimeout(() => {
            setCurrentChar(prev => (prev + dir + CHARACTERS.length) % CHARACTERS.length);
            setIsAnimatingChar(false);
        }, 350);
    };

    const goToChar = (idx) => {
        if (isAnimatingChar || idx === currentChar) return;
        setIsAnimatingChar(true);
        setTimeout(() => {
            setCurrentChar(idx);
            setIsAnimatingChar(false);
        }, 350);
    };

    return (
        <>
            <Head title="EVA" />

            <div className={`min-h-screen bg-white transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>

                {/* ─── Navegación con ola estática ─── */}
                <div className="sticky top-0 z-50">
                    {/* Línea superior decorativa */}
                    <div className="h-1" style={{ background: 'linear-gradient(90deg, #540D6E 0%, #EE4266 50%, #FFD23F 100%)' }} />
                    
                    <nav className="relative bg-white/90 backdrop-blur-md">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between h-16">
                                {/* Logo */}
                                <div className="flex items-center gap-3">
                                    <img 
                                        src="/assets/images/logos/logo.png" 
                                        alt="EVA Logo" 
                                        className="w-26 h-16 object-contain"
                                    />
                                    <div>
                                        <span className="text-lg text-gray-500 ml-1 font-medium" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                            Explora • Investiga • Aprende
                                        </span>
                                    </div>
                                </div>

                                {/* Links de navegación */}
                                <div className="flex items-center gap-4">
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
                                        <div className="flex items-center gap-3">
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
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Ola estática inferior del navbar */}
                        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none" style={{ height: '14px', transform: 'translateY(100%)' }}>
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

                {/* ─── Hero Section ─── */}
                <section className="relative overflow-hidden">
                    {/* Fondo decorativo */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-10"
                            style={{ background: 'radial-gradient(circle, #540D6E 0%, transparent 70%)' }} />
                        <div className="absolute -bottom-[40px] -left-40 w-[500px] h-[500px] rounded-full opacity-[0.2]"
                            style={{ background: 'radial-gradient(circle, #EE4266 0%, transparent 70%)' }} />
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-5"
                            style={{ background: 'radial-gradient(circle, #FFD23F 0%, transparent 70%)' }} />
                    </div>

                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
                        <div className={`text-center transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <h1 
                                className="text-4xl lg:text-5xl font-black text-black leading-tight mb-6"
                                style={{ 
                                    fontFamily: "'Chewy', sans-serif",
                                    letterSpacing: '0.02em',
                                }}
                            >
                                Transformando la{' '}
                                <span style={{ 
                                    background: 'linear-gradient(135deg, #540D6E, #EE4266)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    Educación
                                </span>
                                <br />
                                en Nariño
                            </h1>

                            <p 
                                className="text-lg text-gray-600 leading-relaxed mb-10 max-w-3xl mx-auto"
                                style={{ fontFamily: "'Quicksand', sans-serif" }}
                            >
                                Una plataforma interactiva diseñada para potenciar el aprendizaje 
                                de estudiantes de primaria y secundaria a través de Objetos Virtuales 
                                de Aprendizaje contextualizados en las regiones de Nariño.
                            </p>

                            {/* Botones con estilo de cards de features */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {!auth?.user && (
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold text-white transition-all duration-300 hover:-translate-y-1"
                                        style={{ 
                                            background: 'linear-gradient(135deg, #540D6E, #6B1689)',
                                            fontFamily: "'Quicksand', sans-serif",
                                            border: '1.5px solid #540D6E30',
                                            borderLeft: '4px solid #540D6E',
                                            boxShadow: '0 4px 15px rgba(84, 13, 110, 0.3)'
                                        }}
                                    >
                                        Comenzar
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>
                                )}
                                <a
                                    href="#features"
                                    className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 hover:-translate-y-1"
                                    style={{ 
                                        border: '1.5px solid #0EAD6930',
                                        borderLeft: '4px solid #0EAD69',
                                        color: '#0EAD69',
                                        fontFamily: "'Quicksand', sans-serif",
                                        background: '#E8F5F0',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                    }}
                                >
                                    Conocer Más
                                    <ChevronRight className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Stats Section ─── */}
                <section className="relative py-16 bg-gray-100 overflow-hidden">
                    {/* Ola superior */}
                    <div className="absolute top-0 left-0 w-full overflow-hidden leading-none" style={{ height: '36px' }}>
                        <svg
                            viewBox="0 0 1440 36"
                            preserveAspectRatio="none"
                            style={{ 
                                display: 'block', 
                                width: '200%', 
                                height: '100%',
                                marginLeft: '-50%',
                                animation: 'waveSlideTop 4s ease-in-out infinite'
                            }}
                        >
                            <path
                                d="M0,0 L0,14 Q120,36 240,22 Q360,8 480,24 Q600,36 720,20 Q840,6 960,22 Q1080,36 1200,18 Q1320,4 1440,16 L1440,0 Z"
                                fill="white"
                            />
                        </svg>
                    </div>

                    {/* Contenido */}
                    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <p
                                        className="text-4xl lg:text-5xl font-black mb-2"
                                        style={{ fontFamily: "'Chewy', cursive", color: stat.color }}
                                    >
                                        {stat.value}
                                    </p>
                                    <p
                                        className="text-sm font-semibold text-gray-600"
                                        style={{ fontFamily: "'Quicksand', sans-serif" }}
                                    >
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ola inferior (volteada) */}
                    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none" style={{ height: '36px', transform: 'rotate(180deg)' }}>
                        <svg
                            viewBox="0 0 1440 36"
                            preserveAspectRatio="none"
                            style={{ 
                                display: 'block', 
                                width: '200%', 
                                height: '100%',
                                marginLeft: '-50%',
                                animation: 'waveSlideBottom 4s ease-in-out infinite'
                            }}
                        >
                            <path
                                d="M0,0 L0,14 Q120,36 240,22 Q360,8 480,24 Q600,36 720,20 Q840,6 960,22 Q1080,36 1200,18 Q1320,4 1440,16 L1440,0 Z"
                                fill="white"
                            />
                        </svg>
                    </div>
                </section>

                {/* ─── Features Section ─── */}
                <section id="features" className="py-20 lg:py-28 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <h2 
                                className="text-4xl lg:text-5xl font-black mb-4 leading-tight"
                                style={{ 
                                    fontFamily: "'Chewy', cursive",
                                    letterSpacing: '0.02em',
                                    color: '#1a1a2e'
                                }}
                            >
                                Una plataforma pensada para
                                <br />
                                {' '}
                                <span style={{ 
                                    background: 'linear-gradient(135deg, #540D6E, #EE4266)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    aprender diferente
                                </span>
                            </h2>

                            <p 
                                className="text-gray-600 text-lg max-w-2xl mx-auto mt-4"
                                style={{ fontFamily: "'Quicksand', sans-serif" }}
                            >
                                Una plataforma diseñada pensando en las necesidades educativas 
                                de los estudiantes de las regiones de Nariño.
                            </p>
                        </div>

                        {/* Grid de features con efecto 3D sutil */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ perspective: '1000px' }}>
                            {features.map((feature, index) => (
                                <div 
                                    key={index}
                                    className={`group relative bg-white rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                                    style={{ 
                                        transitionDelay: `${300 + index * 100}ms`,
                                        border: `1.5px solid ${feature.color}30`,
                                        borderLeft: `4px solid ${feature.color}`,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                        transformStyle: 'preserve-3d',
                                        transition: 'all 0.4s ease-in-out'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'rotate3d(0.3, 0.5, 0, 8deg) translateY(-8px)';
                                        e.currentTarget.style.boxShadow = `0 16px 40px ${feature.color}20`;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'rotate3d(0, 0, 0, 0deg) translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                                    }}
                                >
                                    <div 
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                                        style={{ 
                                            background: feature.bgColor,
                                            transform: 'translateZ(20px)'
                                        }}
                                    >
                                        <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                                    </div>

                                    <h3 
                                        className="text-xl font-bold mb-3 text-gray-900"
                                        style={{ 
                                            fontFamily: "'Quicksand', sans-serif",
                                            transform: 'translateZ(30px)'
                                        }}
                                    >
                                        {feature.title}
                                    </h3>
                                    <p 
                                        className="text-gray-600 text-sm leading-relaxed"
                                        style={{ 
                                            fontFamily: "'Quicksand', sans-serif",
                                            transform: 'translateZ(15px)'
                                        }}
                                    >
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── Sección: Diversidad de Nariño ─── */}
                <section className="py-16 bg-gray-100 border-y border-gray-200">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        
                        <h2 
                            className="text-4xl lg:text-4xl font-black mb-4"
                            style={{ 
                                fontFamily: "'Chewy', cursive",
                                letterSpacing: '0.02em',
                                color: '#111827'
                            }}
                        >
                            Representamos toda la diversidad de Nariño
                        </h2>
                        <br />
                        <p 
                            className="text-xl lg:text-lg text-gray-600 font-medium leading-relaxed mb-6 max-w-2xl mx-auto"
                            style={{ fontFamily: "'Quicksand', sans-serif" }}
                        >
                            Nuestros personajes vienen de municipios reales de toda la región, 
                            desde el{' '}
                            <strong style={{ color: '#540D6E', fontWeight: 700 }}>Pacífico</strong>
                            {' '}hasta el{' '}
                            <strong style={{ color: '#540D6E', fontWeight: 700 }}>Centro</strong>
                            , pasando por el{' '}
                            <strong style={{ color: '#540D6E', fontWeight: 700 }}>Río Mayo</strong>
                            {' '}y la{' '}
                            <strong style={{ color: '#540D6E', fontWeight: 700 }}>Sanquianga</strong>
                            .
                        </p>
                        <br />
                        <div className="flex gap-3 justify-center overflow-x-auto whitespace-nowrap">
                            {[
                                { name: 'Pacífico Sur', bg: 'rgba(84, 13, 110, 0.08)', color: '#540D6E' },
                                { name: 'La Sabana', bg: 'rgba(238, 66, 102, 0.08)', color: '#EE4266' },
                                { name: 'Pasto', bg: 'rgba(14, 173, 105, 0.08)', color: '#0EAD69' },
                                { name: 'Sanquianga', bg: 'rgba(59, 206, 172, 0.1)', color: '#0F766E' },
                                { name: 'Río Mayo', bg: 'rgba(212, 160, 0, 0.1)', color: '#8A6000' },
                                { name: 'Occidente', bg: 'rgba(84, 13, 110, 0.08)', color: '#540D6E' },
                            ].map((region) => (
                                <span
                                    key={region.name}
                                    className="px-4 py-2 rounded-full text-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-sm"
                                    style={{
                                        background: region.bg,
                                        color: region.color,
                                        fontFamily: "'Quicksand', sans-serif",
                                    }}
                                >
                                    {region.name}
                                </span>
                            ))}
                        </div>

                    </div>
                </section>

                {/* ─── Sección: Personajes ─── */}
                <section className="py-20 lg:py-28 bg-gray-50 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        
                        {/* Header */}
                        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <h2 
                                className="text-4xl lg:text-5xl font-black mb-4 text-gray-900"
                                style={{ 
                                    fontFamily: "'Chewy', cursive",
                                    letterSpacing: '0.02em',
                                }}
                            >
                                Nuestros{' '}
                                <span style={{ 
                                    background: 'linear-gradient(135deg, #540D6E, #EE4266)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    Personajes
                                </span>
                            </h2>
                            <p 
                                className="text-lg text-gray-500 max-w-2xl mx-auto"
                                style={{ fontFamily: "'Quicksand', sans-serif" }}
                            >
                                Cada estudiante representa una región de Nariño, con historias y 
                                personalidades que inspiran el aprendizaje.
                            </p>
                        </div>

                        {/* Carrusel automático infinito */}
                        <div className="relative overflow-hidden" 
                            style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)' }}>
                            <div 
                                className="flex gap-6 animate-scroll"
                                style={{ width: 'max-content' }}
                            >
                                {/* Primer set de personajes */}
                                {CHARACTERS.map((char) => (
                                    <div 
                                        key={char.id}
                                        className="w-[320px] flex-shrink-0"
                                    >
                                        <div 
                                            className="group bg-white rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col hover:-translate-y-2"
                                            style={{
                                                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.boxShadow = `0 16px 40px ${char.color}15`;
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                                            }}
                                        >
                                            {/* Imagen */}
                                            <div className="relative h-56 flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white">
                                                <div className="absolute w-44 h-44 rounded-full opacity-10" 
                                                    style={{ background: char.color }} />
                                                
                                                <div className="relative z-10 w-40 h-40 rounded-full overflow-hidden ring-4 ring-white shadow-md transition-transform duration-300 group-hover:scale-105"
                                                    style={{ background: char.bg }}>
                                                    <img
                                                        src={`/avatars/${char.id}.png`}
                                                        alt={char.name}
                                                        className="w-full h-full object-cover"
                                                        onError={e => {
                                                            e.currentTarget.style.display = 'none';
                                                            e.currentTarget.parentElement.style.cssText += 'display:flex;align-items:center;justify-content:center;';
                                                            const div = document.createElement('div');
                                                            div.className = "text-4xl font-black";
                                                            div.style.color = char.color;
                                                            div.style.fontFamily = "'Chewy', cursive";
                                                            div.textContent = char.name.charAt(0);
                                                            e.currentTarget.parentElement.appendChild(div);
                                                        }}
                                                    />
                                                </div>

                                                {/* Badge de región flotante */}
                                                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <span className="px-3 py-1.5 rounded-full text-xs font-bold shadow-sm bg-white"
                                                        style={{ color: char.color, fontFamily: "'Quicksand', sans-serif" }}>
                                                        {char.origin}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Contenido */}
                                            <div className="p-6 flex-1 flex flex-col">
                                                <h3 
                                                    className="text-xl font-black mb-1"
                                                    style={{ 
                                                        fontFamily: "'Chewy', cursive",
                                                        letterSpacing: '0.02em',
                                                        color: '#111827'
                                                    }}
                                                >
                                                    {char.name}
                                                </h3>
                                                <p 
                                                    className="text-sm font-bold mb-3"
                                                    style={{ color: char.color, fontFamily: "'Quicksand', sans-serif" }}
                                                >
                                                    "{char.nickname}" • {char.age} años
                                                </p>

                                                <div className="flex items-center gap-2 mb-3">
                                                    <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: char.color }} />
                                                    <span className="text-sm text-gray-500" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                                        {char.location}
                                                    </span>
                                                </div>

                                                <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                                    {char.description}
                                                </p>

                                                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                                                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold"
                                                        style={{
                                                            background: char.color + '12',
                                                            color: char.color,
                                                            fontFamily: "'Quicksand', sans-serif"
                                                        }}>
                                                        {char.grade}
                                                    </span>
                                                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold"
                                                        style={{
                                                            background: char.color + '12',
                                                            color: char.color,
                                                            fontFamily: "'Quicksand', sans-serif"
                                                        }}>
                                                        {char.origin}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {/* Duplicado para loop infinito */}
                                {CHARACTERS.map((char) => (
                                    <div 
                                        key={`dup-${char.id}`}
                                        className="w-[320px] flex-shrink-0"
                                    >
                                        <div 
                                            className="group bg-white rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col hover:-translate-y-2"
                                            style={{
                                                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                                            }}
                                        >
                                            <div className="relative h-56 flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white">
                                                <div className="absolute w-44 h-44 rounded-full opacity-10" 
                                                    style={{ background: char.color }} />
                                                <div className="relative z-10 w-40 h-40 rounded-full overflow-hidden ring-4 ring-white shadow-md transition-transform duration-300 group-hover:scale-105"
                                                    style={{ background: char.bg }}>
                                                    <img
                                                        src={`/avatars/${char.id}.png`}
                                                        alt={char.name}
                                                        className="w-full h-full object-cover"
                                                        onError={e => {
                                                            e.currentTarget.style.display = 'none';
                                                            e.currentTarget.parentElement.style.cssText += 'display:flex;align-items:center;justify-content:center;';
                                                            const div = document.createElement('div');
                                                            div.className = "text-4xl font-black";
                                                            div.style.color = char.color;
                                                            div.style.fontFamily = "'Chewy', cursive";
                                                            div.textContent = char.name.charAt(0);
                                                            e.currentTarget.parentElement.appendChild(div);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-6 flex-1 flex flex-col">
                                                <h3 className="text-xl font-black mb-1" style={{ fontFamily: "'Chewy', cursive", letterSpacing: '0.02em', color: '#111827' }}>
                                                    {char.name}
                                                </h3>
                                                <p className="text-sm font-bold mb-3" style={{ color: char.color, fontFamily: "'Quicksand', sans-serif" }}>
                                                    "{char.nickname}" • {char.age} años
                                                </p>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: char.color }} />
                                                    <span className="text-sm text-gray-500" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                                        {char.location}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                                    {char.description}
                                                </p>
                                                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                                                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: char.color + '12', color: char.color, fontFamily: "'Quicksand', sans-serif" }}>
                                                        {char.grade}
                                                    </span>
                                                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: char.color + '12', color: char.color, fontFamily: "'Quicksand', sans-serif" }}>
                                                        {char.origin}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── CTA Section ─── */}
                <section className="py-20 relative overflow-hidden">
                    <div 
                        className="absolute inset-0"
                        style={{ 
                            background: 'linear-gradient(135deg, #540D6E 0%, #3a0850 50%, #1a0030 100%)' 
                        }}
                    />
                    
                    {/* Patrón decorativo */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-72 h-72 rounded-full border-8 border-white" 
                            style={{ transform: 'translate(-50%, -50%)' }} />
                        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full border-8 border-white" 
                            style={{ transform: 'translate(50%, 50%)' }} />
                    </div>

                    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <h2 
                                className="text-4xl lg:text-5xl font-black mb-6 text-white"
                                style={{ fontFamily: "'Chewy', cursive", letterSpacing: '0.02em' }}
                            >
                                ¿Listo para comenzar la aventura del aprendizaje?
                            </h2>
                            <p 
                                className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto"
                                style={{ fontFamily: "'Quicksand', sans-serif" }}
                            >
                                Únete a los cientos de estudiantes y docentes que ya están 
                                transformando la educación en Nariño con EVA.
                            </p>
                            
                            {!auth?.user ? (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl text-lg font-bold transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
                                        style={{ 
                                            background: '#FFD23F',
                                            color: '#1a1a2e',
                                            fontFamily: "'Quicksand', sans-serif",
                                            boxShadow: '0 4px 20px rgba(255, 210, 63, 0.3)'
                                        }}
                                    >
                                        Crear Cuenta de Docente
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl text-xl font-bold border-2 border-white text-white transition-all duration-200 hover:bg-white/10"
                                        style={{ fontFamily: "'Quicksand', sans-serif" }}
                                    >
                                        Iniciar Sesión
                                    </Link>
                                </div>
                            ) : (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl text-lg font-bold transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
                                    style={{ 
                                        background: '#FFD23F',
                                        color: '#1a1a2e',
                                        fontFamily: "'Quicksand', sans-serif",
                                        boxShadow: '0 4px 20px rgba(255, 210, 63, 0.3)'
                                    }}
                                >
                                    Ir al Panel de Control
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

                {/* ─── Footer ─── */}
                <footer className="bg-gray-50 border-t border-gray-100 py-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                {/* Logo */}
                                <img 
                                    src="/assets/images/logos/logo-slogan.png" 
                                    alt="EVA Logo" 
                                    className="w-30 h-24 object-contain"
                                />
                            </div>
                            
                            <p 
                                className="text-sm text-gray-600"
                                style={{ fontFamily: "'Quicksand', sans-serif" }}
                            >
                                © {new Date().getFullYear()} EVA - Entorno Virtual de Aprendizaje. 
                                Todos los derechos reservados.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Chewy&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');

                @keyframes waveSlideTop {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(25%); }
                }
                @keyframes waveSlideBottom {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(-25%); }
                }
                
                @keyframes charIn {
                    from { opacity: 0; transform: translateY(18px) scale(0.92); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes infoIn {
                    from { opacity: 0; transform: translateX(16px); }
                    to   { opacity: 1; transform: translateX(0); }
                }

                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }

                html { scroll-behavior: smooth; }
            `}</style>
        </>
    );
}