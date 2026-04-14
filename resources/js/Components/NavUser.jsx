import { Link } from '@inertiajs/react';
import { LogOut } from 'lucide-react';

export default function NavUser({ user = null, collapsed = false }) {
    if (!user) {
        return null;
    }

    const initials = user.name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U';

    return (
        <div className="border-t border-gray-200 p-2 mt-auto">
            {!collapsed ? (
                // Modo expandido
                <div className="space-y-2">
                    <div className="flex items-center gap-3 px-3 py-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0"
                            style={{ background: "linear-gradient(to bottom right, #540D6E, #EE4266)" }}>
                            {initials}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                    </div>
                    
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Cerrar Sesión</span>
                    </Link>
                </div>
            ) : (
                // Modo colapsado
                <div className="relative group">
                    <div className="w-full flex justify-center px-3 py-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
                            style={{ background: "linear-gradient(to bottom right, #540D6E, #EE4266)" }}>
                            {initials}
                        </div>
                    </div>
                    
                    {/* Tooltip para el nombre */}
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity duration-200">
                        {user.name}
                    </div>

                    {/* Tooltip para cerrar sesión */}
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="absolute left-full ml-2 top-full -translate-y-6 px-3 py-1.5 bg-red-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-auto whitespace-nowrap z-50 transition-opacity duration-200 hover:bg-red-700 flex items-center gap-1"
                    >
                        <LogOut className="w-3 h-3" />
                        Cerrar Sesión
                    </Link>
                </div>
            )}
        </div>
    );
}