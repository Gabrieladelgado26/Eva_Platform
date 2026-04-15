import { Link } from '@inertiajs/react';
import { LogOut } from 'lucide-react';

const AVATAR_COLORS = [
    "linear-gradient(to bottom right, #540D6E, #EE4266)",
    "linear-gradient(to bottom right, #1D4ED8, #0EAD69)",
    "linear-gradient(to bottom right, #D97706, #EE4266)",
];

export default function NavUser({ user = null, collapsed = false }) {
    if (!user) return null;

    const initials = user.name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U';

    const avatarSrc = user.avatar ? `/avatars/${user.avatar}.png` : null;

    const Avatar = ({ size = "w-8 h-8", textSize = "text-sm" }) => (
        avatarSrc ? (
            <img
                src={avatarSrc}
                alt={user.name}
                className={`${size} rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0`}
            />
        ) : (
            <div
                className={`${size} rounded-full flex items-center justify-center text-white font-bold ${textSize} shadow-sm flex-shrink-0`}
                style={{ background: AVATAR_COLORS[0] }}
            >
                {initials}
            </div>
        )
    );

    return (
        <div className="border-t border-gray-200 p-2 mt-auto">
            {!collapsed ? (
                <div className="space-y-1">
                    <div className="flex items-center gap-3 px-3 py-2.5">
                        <Avatar />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 truncate">
                                {user.email ?? user.username}
                            </p>
                        </div>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">Cerrar Sesión</span>
                    </Link>
                </div>
            ) : (
                <div className="relative group flex flex-col items-center gap-1 py-1">
                    <Avatar />
                    {/* Tooltip nombre */}
                    <span className="absolute left-full ml-3 top-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity duration-200 shadow-lg">
                        {user.name}
                    </span>
                    {/* Cerrar sesión */}
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all mt-1"
                        title="Cerrar Sesión"
                    >
                        <LogOut className="w-4 h-4" />
                    </Link>
                </div>
            )}
        </div>
    );
}