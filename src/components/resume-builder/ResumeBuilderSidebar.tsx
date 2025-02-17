import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Palette, 
  ChevronRight,
  FileText,
  Settings,
} from 'lucide-react';

interface SidebarLinkProps {
  icon: React.ElementType;
  tooltip: string;
  onClick?: () => void;
  isActive?: boolean;
  to?: string;
}

function SidebarLink({ icon: Icon, tooltip, onClick, isActive, to }: SidebarLinkProps) {
  const content = (
    <div
      className={`p-3 flex items-center justify-center rounded-xl transition-all duration-200
        ${isActive 
          ? 'bg-gradient-to-r from-blue-600/10 to-purple-600/10 text-blue-600' 
          : 'text-gray-500 hover:bg-gradient-to-r hover:from-blue-600/5 hover:to-purple-600/5 hover:text-blue-600'
        }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
    </div>
  );

  return (
    <div className="relative group">
      {to ? <Link to={to}>{content}</Link> : content}
      
      {/* Tooltip */}
      <div className="absolute left-full ml-2 pointer-events-none">
        <div className="relative px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -translate-x-1 group-hover:translate-x-0 transform transition-transform">
          <div className="absolute inset-0 rounded bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-50 blur"></div>
          <div className="relative bg-white border border-gray-100 rounded shadow-lg px-3 py-1.5">
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white border-l border-t border-gray-100 transform -rotate-45"></div>
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
              {tooltip}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResumeBuilderSidebar({ 
  onTemplateClick,
  onPreviewClick,
  onSettingsClick,
  currentView 
}: { 
  onTemplateClick: () => void;
  onPreviewClick: () => void;
  onSettingsClick: () => void;
  currentView: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`md:hidden fixed left-0 top-1/2 -translate-y-1/2 z-[60] p-2 bg-white border border-gray-200 rounded-r-xl shadow-lg
          transition-all duration-300 ${isOpen ? 'translate-x-16' : 'translate-x-0'}`}
      >
        <ChevronRight 
          className={`h-5 w-5 text-gray-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-16 bg-white border-r border-gray-200 z-50
        transition-transform duration-300 md:translate-x-0 pt-20 pb-24
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="relative h-full flex flex-col items-center py-4">
          {/* Gradient glow effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-transparent to-purple-50/50 opacity-50" />
          
          {/* Content - Split into top and bottom sections */}
          <div className="relative z-10 flex flex-col items-center justify-between h-full w-full">
            {/* Top icons */}
            <div className="flex flex-col items-center space-y-6">
              <SidebarLink
                to="/dashboard"
                icon={LayoutDashboard}
                tooltip="Dashboard"
              />
            </div>

            {/* Bottom icon - Settings */}
            <div className="mb-2">
              <Link
                to="/settings"
                state={{ from: '/builder' }}
                className={`p-3 flex items-center justify-center rounded-xl transition-all duration-200
                  ${currentView === 'settings' 
                    ? 'bg-gradient-to-r from-blue-600/10 to-purple-600/10 text-blue-600' 
                    : 'text-gray-500 hover:bg-gradient-to-r hover:from-blue-600/5 hover:to-purple-600/5 hover:text-blue-600'
                  }`}
              >
                <Settings className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}