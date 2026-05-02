// Resources/js/Components/AppSidebar.jsx
import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Menu, GraduationCap, ClipboardList, BarChart3, Users, Palette } from 'lucide-react';
import {
    LayoutDashboard, BookOpen, Layers, Home, UserCog, GraduationCap as StudentIcon,
} from 'lucide-react';
import NavMain from '@/Components/NavMain';
import NavUser from '@/Components/NavUser';         

// Componente para efecto typewriter con reinicio
function TypewriterText({ text, speed = 100, pauseDuration = 3000 }) {
    const [displayedText, setDisplayedText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timeout;
        
        if (!isDeleting && displayedText.length < text.length) {
            // Escribiendo
            timeout = setTimeout(() => {
                setDisplayedText(text.slice(0, displayedText.length + 1));
            }, speed);
        } else if (!isDeleting && displayedText.length === text.length) {
            // Pausa al terminar de escribir
            timeout = setTimeout(() => {
                setIsDeleting(true);
            }, pauseDuration);
        } else if (isDeleting && displayedText.length > 0) {
            // Borrando
            timeout = setTimeout(() => {
                setDisplayedText(text.slice(0, displayedText.length - 1));
            }, speed / 2);
        } else if (isDeleting && displayedText.length === 0) {
            // Reiniciar
            setIsDeleting(false);
        }

        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, text, speed, pauseDuration]);

    // Parpadeo del cursor
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 530);
        return () => clearInterval(cursorInterval);
    }, []);

    // Reiniciar cuando cambia el texto
    useEffect(() => {
        setDisplayedText('');
        setIsDeleting(false);
    }, [text]);

    return (
        <p className="text-xs font-semibold text-gray-500 tracking-wide uppercase ml-10">
            {displayedText}
            <span 
                className={`inline-block w-[1px] h-3 ml-0.5 align-text-top transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
                style={{ backgroundColor: "#9CA3AF" }}
            />
        </p>
    );
}

function buildNavGroups(role, currentRoute) {
    const is = (...names) => names.includes(currentRoute);

    // Función segura para obtener rutas - MEJORADA
    const safeRoute = (name, params = {}) => {
        try {
            // Verificar si route existe
            if (typeof route === 'function') {
                return route(name, params);
            }
            console.error(`La función route no está disponible`);
            return '#';
        } catch (e) {
            console.error(`Ruta no encontrada: ${name}`, e.message);
            return '#';
        }
    };

    const menus = {
       admin: [
        {
            label: 'Principal',
            items: [
                {
                    title: 'Dashboard',
                    href: safeRoute('admin.dashboard'),
                    icon: LayoutDashboard,
                    current: is('admin.dashboard'),
                },
            ],
        },
        {
            label: 'Gestión de Usuarios',
            items: [
                {
                    title: 'Personal Institucional',
                    href: safeRoute('admin.staff'),  
                    icon: Users,
                    current: is('admin.staff', 'admin.users.create', 'admin.users.edit'),
                },
                {
                    title: 'Estudiantes',
                    href: safeRoute('admin.students'),
                    icon: StudentIcon,
                    current: is('admin.students'),
                },
            ],
        },
        {
            label: 'Contenido Educativo',
            items: [
                {
                    title: 'Gestionar OVAs',
                    href: safeRoute('admin.ovas.index'),
                    icon: Layers,
                    current: is('admin.ovas.index', 'admin.ovas.create', 'admin.ovas.edit', 'admin.ovas.show'),
                },
                {
                    title: 'Gestionar Cursos',
                    href: safeRoute('admin.courses.index'),
                    icon: BookOpen,
                    current: is('admin.courses.index'),
                },
            ],
        },
        {
            label: 'Evaluaciones',
            items: [
                {
                    title: 'Todas las Evaluaciones',
                    href: safeRoute('admin.evaluations.index'),
                    icon: ClipboardList,
                    current: is('admin.evaluations.index'),
                },
            ],
        },
        ],

        teacher: [
            {
                label: 'Principal',
                items: [
                    {
                        title: 'Mis Cursos',
                        href: safeRoute('teacher.dashboard'),
                        icon: BookOpen,
                        current: is(
                            'teacher.dashboard',
                            'teacher.courses.show',
                            'teacher.courses.create',
                            'teacher.courses.edit',
                            'teacher.courses.students.index',
                            'teacher.courses.ovas.index'
                        ),
                    },
                ],
            },
            {
                label: 'Académico',
                items: [
                    {
                        title: 'Mis Estudiantes',
                        href: safeRoute('teacher.students.index'),
                        icon: Users,
                        current: is('teacher.students.index', 'teacher.students.show'),
                    },
                    {
                        title: 'Evaluaciones',
                        href: safeRoute('teacher.evaluations.index'),
                        icon: ClipboardList,
                        current: is('teacher.evaluations.index'),
                    },
                ],
            },
            {
                label: 'Dashboard',
                items: [
                    {
                        title: 'Estadísticas',
                        href: safeRoute('teacher.analytics'),
                        icon: BarChart3,
                        current: is('teacher.analytics'),
                    },
                ],
            },
        ],

        student: [
            {
                label: 'Principal',
                items: [
                    {
                        title: 'Inicio',
                        href: safeRoute('student.dashboard'),
                        icon: Home,
                        current: is('student.dashboard', 'student.courses.show'),
                    },
                ],
            },
            {
                label: 'Mi Aprendizaje',
                items: [
                    {
                        title: 'Evaluaciones',
                        href: safeRoute('student.evaluations.index'),
                        icon: ClipboardList,
                        current: is('student.evaluations.index'),
                    },
                ],
            },
            {
                label: 'Mi Personaje',
                items: [
                    {
                        title: 'Cambiar Avatar',
                        href: safeRoute('student.avatar.index'),
                        icon: Palette,
                        current: is('student.avatar.index'),
                    },
                ],
            },
        ],
    };

    return menus[role] ?? [];
}

const roleSubtitle = {
    admin:   'Administrador',
    teacher: 'Docente',
    student: 'Estudiante',
};

export function useSidebarState() {
    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('sidebarCollapsed') === 'true';
        }
        return false;
    });

    const setCollapsedAndBroadcast = (val) => {
        const newVal = typeof val === 'function' ? val(collapsed) : val;
        setCollapsed(newVal);
        localStorage.setItem('sidebarCollapsed', String(newVal));
        window.dispatchEvent(new CustomEvent('sidebarToggle', { detail: { collapsed: newVal } }));
    };

    useEffect(() => {
        const handler = (e) => {
            setCollapsed(e.detail.collapsed);
        };
        window.addEventListener('sidebarToggle', handler);
        return () => window.removeEventListener('sidebarToggle', handler);
    }, []);

    return [collapsed, setCollapsedAndBroadcast];
}

export default function AppSidebar({ currentRoute = '' }) {
    const { props }  = usePage();
    const user       = props.auth?.user;
    const role       = user?.role?.slug ?? 'student';

    const [collapsed, setCollapsed] = useSidebarState();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        setGroups(buildNavGroups(role, currentRoute));
    }, [role, currentRoute]);

    const subtitle = roleSubtitle[role] ?? '';

    return (
        <>
            {mobileOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
            )}

            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed bottom-4 right-4 z-30 p-3 rounded-full shadow-lg text-white"
                style={{ backgroundColor: "#540D6E" }}
            >
                <Menu className="w-6 h-6" />
            </button>

            <aside className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out
                ${collapsed ? "w-20" : "w-72"}
                ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                <div className="h-full bg-white/90 backdrop-blur-xl border-r border-gray-200 shadow-xl flex flex-col">

                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        {!collapsed && (
                            <div className="flex-1 flex flex-col gap-1.5">
                                <div className="flex">
                                    <img 
                                        src="/assets/images/logos/logo-evaplatform.png" 
                                        alt="EVA" 
                                        className="w-[180px] h-auto object-contain transition-all duration-300"
                                    />
                                </div>
                                <TypewriterText text={subtitle} />
                            </div>
                        )}
                        
                        {/* Botón de colapsar */}
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 flex-shrink-0 transition-colors"
                        >
                            {collapsed
                                ? <ChevronRight className="w-4 h-4 text-gray-600" />
                                : <ChevronLeft  className="w-4 h-4 text-gray-600" />
                            }
                        </button>
                    </div>

                    <NavMain groups={groups} collapsed={collapsed} />

                    <NavUser user={user} collapsed={collapsed} />
                </div>
            </aside>
        </>
    );
}