// Resources/js/Components/NavMain.jsx
import { Link } from '@inertiajs/react';

export default function NavMain({ groups, collapsed }) {
    return (
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {groups.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-2">
                    {!collapsed && (
                        <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
                            {group.label}
                        </span>
                    )}

                    <div className="space-y-1">
                        {group.items.map((item, itemIndex) => {
                            const Icon = item.icon;
                            const isActive = item.current;
                            
                            return (
                                <Link
                                    key={itemIndex}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                        ${collapsed ? 'justify-center' : ''}
                                        ${isActive 
                                            ? 'bg-purple-50 text-purple-700 shadow-sm' 
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        }
                                    `}
                                    style={isActive ? { backgroundColor: '#F3E8FF', color: '#540D6E' } : {}}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-purple-700' : 'text-gray-500'}`} style={isActive ? { color: '#540D6E' } : {}} />
                                    {!collapsed && <span>{item.title}</span>}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </nav>
    );
}