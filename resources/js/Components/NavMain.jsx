// resources/js/Components/NavMain.jsx
import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function NavMain({ groups = [], collapsed = false }) {
    const [openMenus, setOpenMenus] = useState({});

    const toggleMenu = (index) => {
        if (!collapsed) {
            setOpenMenus(prev => ({ ...prev, [index]: !prev[index] }));
        }
    };

    if (!groups || groups.length === 0) {
        return null;
    }

    return (
        <nav className="flex-1 overflow-y-auto py-4 px-2">
            {groups.map((group, groupIdx) => (
                <div key={groupIdx} className="mb-4">
                    {!collapsed && (
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                            {group.label}
                        </p>
                    )}
                    <ul className="space-y-1">
                        {group.items.map((item, itemIdx) => {
                            const Icon = item.icon;
                            const hasChildren = item.items && item.items.length > 0;
                            
                            return (
                                <li key={itemIdx}>
                                    {hasChildren ? (
                                        <div>
                                            <button
                                                onClick={() => toggleMenu(`${groupIdx}-${itemIdx}`)}
                                                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                                                    item.current ? 'text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                                style={item.current ? { backgroundColor: "#540D6E" } : {}}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {Icon && <Icon className={`w-5 h-5 ${collapsed ? "mx-auto" : ""}`} />}
                                                    {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                                                </div>
                                                {!collapsed && (
                                                    <ChevronDown className={`w-4 h-4 transition-transform ${openMenus[`${groupIdx}-${itemIdx}`] ? 'rotate-180' : ''}`} />
                                                )}
                                            </button>
                                            {!collapsed && openMenus[`${groupIdx}-${itemIdx}`] && (
                                                <ul className="mt-1 ml-6 space-y-1">
                                                    {item.items.map((subItem, subIdx) => {
                                                        const SubIcon = subItem.icon;
                                                        return (
                                                            <li key={subIdx}>
                                                                <Link
                                                                    href={subItem.href}
                                                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                                                                        subItem.current
                                                                            ? 'text-white shadow-sm'
                                                                            : 'text-gray-600 hover:bg-gray-100'
                                                                    }`}
                                                                    style={subItem.current ? { backgroundColor: "#540D6E" } : {}}
                                                                >
                                                                    {SubIcon && <SubIcon className="w-4 h-4" />}
                                                                    <span className="text-sm">{subItem.title}</span>
                                                                </Link>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                                                item.current ? 'text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                            style={item.current ? { backgroundColor: "#540D6E" } : {}}
                                        >
                                            {Icon && <Icon className={`w-5 h-5 ${collapsed ? "mx-auto" : ""}`} />}
                                            {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                                            {collapsed && (
                                                <span className="absolute left-full ml-6 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                                    {item.title}
                                                </span>
                                            )}
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </nav>
    );
}