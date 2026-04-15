import { GraduationCap } from 'lucide-react';

export default function AppLogo({ collapsed = false }) {
    return (
        <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: "#540D6E20" }}>
                <GraduationCap className="w-6 h-6" style={{ color: "#540D6E" }} />
            </div>
            {!collapsed && (
                <div>
                    <span className="font-bold text-lg text-gray-900">EVA Platform</span>
                    <p className="text-xs text-gray-500 leading-none mt-0.5">
                        {/* subtítulo por rol se pone desde AppSidebar */}
                    </p>
                </div>
            )}
        </div>
    );
}