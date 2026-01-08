import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getAdminProfile, fetchAdminPictureBlob } from '../../services/adminApi';

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [adminProfile, setAdminProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getAdminProfile();

        // Fetch profile picture if imageUrl exists
        let profileImageBlob = '';
        if (profileData.imageUrl) {
          profileImageBlob = await fetchAdminPictureBlob();
        }

        setAdminProfile({
          name: `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() || 'Administrateur',
          email: profileData.email,
          profileImage: profileImageBlob,
        });
      } catch (error) {
        console.error('Error loading admin profile:', error);
        // Fallback to auth context user if available
        if (user) {
          setAdminProfile({
            name: user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`.trim()
              : user.login || 'Administrateur',
            email: user.email || 'admin@espritlivre.fr',
            profileImage: '',
          });
        }
      }
    };

    fetchProfile();

    // Listen for profile updates
    const handleProfileUpdate = () => {
      fetchProfile();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [user]);

  const displayName = adminProfile?.name || 'Administrateur';
  const displayEmail = adminProfile?.email || 'admin@espritlivre.fr';
  const profileImage = adminProfile?.profileImage;

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
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-gray-900">{displayName}</div>
              <div className="text-xs text-gray-500">{displayEmail}</div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
