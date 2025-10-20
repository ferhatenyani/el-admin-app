import { useNavigate } from 'react-router-dom';
import { Menu, User } from 'lucide-react';

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();

 

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-50">
      {/* Left side */}
      <div className="flex items-center gap-4 flex-1">
        {/* Hamburger menu for mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>

        {/* Dashboard title - visible only on desktop when sidebar is present */}
        <h1 className="hidden lg:block text-2xl font-semibold text-gray-800">Dashboard</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
       

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => navigate('/admin/profile')}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-gray-900">Admin</div>
              <div className="text-xs text-gray-500">admin@espritlivre.fr</div>
            </div>
          </button>

          
        </div>
      </div>
    </header>
  );
};

export default Topbar;
