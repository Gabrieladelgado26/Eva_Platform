// Resources/js/Components/AppSidebar.jsx
import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Menu, GraduationCap, ClipboardList } from 'lucide-react';
import {
    LayoutDashboard, Users, BookOpen, Layers, Home, UserCog, GraduationCap as StudentIcon,
} from 'lucide-react';
import NavMain from '@/Components/NavMain';
import NavUser from '@/Components/NavUser';         
import { label } from 'framer-motion/client';

function buildNavGroups(role, currentRoute) {
    const is = (...names) => names.includes(currentRoute);

    // Función segura para obtener rutas
    const safeRoute = (name, params = {}) => {
        try {
            return route(name, params);
        } catch (e) {
            console.warn(`Ruta no encontrada: ${name}`);
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
                    title: 'Personal',
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
            ],
        },

          {
        label: 'Evaluaciones',
        items: [
            {
                title: 'Todas las Evaluaciones',
                href: route('admin.evaluations.index'), // Usa la ruta de admin
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
                        title: 'Dashboard',
                        href: safeRoute('teacher.dashboard'),
                        icon: Home,
                        current: is('teacher.dashboard'),
                    },
                ],
            },
            {
                label: 'Académico',
                items: [
                    {
                        title: 'Mis Cursos',
                        href: safeRoute('teacher.dashboard'),
                        icon: BookOpen,
                        current: is(
                            'teacher.courses.show',
                            'teacher.courses.create',
                            'teacher.courses.edit',
                            'teacher.courses.students.index',
                            'teacher.courses.ovas.index'
                        ),
                    },
                     {
            title: 'Evaluaciones',
            href: route('teacher.evaluations.index'),
            icon: ClipboardList,   // importar de lucide-react
            current: is('teacher.evaluations.index'),
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
                        current: is('student.dashboard', 'student.courses.index'),
                    },
                ],
            },
            {
                label: 'Mi Aprendizaje',
                items: [
                    {
                        title: 'Mis Cursos',
                        href: safeRoute('student.courses.index'),
                        icon: BookOpen,
                        current: is('student.courses.show'),
                    },
                    {
                        title: 'Recursos OVA',
                        href: safeRoute('student.courses.index'),
                        icon: Layers,
                        current: is('student.ovas.show'),
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

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', String(collapsed));
    }, [collapsed]);

    return [collapsed, setCollapsed];
}

export default function AppSidebar({ currentRoute = '' }) {
    const { props }  = usePage();
    const user       = props.auth?.user;
    const role       = user?.role?.slug ?? 'student';

    const [collapsed, setCollapsed] = useSidebarState();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        // Construir los grupos después de que el componente se monte
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
                        <div className={`flex items-center gap-2 ${collapsed ? "lg:justify-center w-full" : ""}`}>
                            <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: "#540D6E20" }}>
                                <GraduationCap className="w-6 h-6" style={{ color: "#540D6E" }} />
                            </div>
                            {!collapsed && (
                                <div>
                                    <span className="font-bold text-lg text-gray-900 leading-none">EVA Platform</span>
                                    <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden lg:block p-1.5 rounded-lg hover:bg-gray-100 flex-shrink-0"
                        >
                            {collapsed
                                ? <ChevronRight className="w-4 h-4 text-gray-600" />
                                : <ChevronLeft  className="w-4 h-4 text-gray-600" />
                            }
                        </button>
                    </div>

                    <NavMain groups={groups} collapsed={collapsed} />
                    <NavUser user={user}   collapsed={collapsed} />
                </div>
            </aside>
        </>
    );
}