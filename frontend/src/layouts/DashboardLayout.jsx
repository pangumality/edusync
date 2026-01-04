import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  MessageSquare, 
  LogOut, 
  User, 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  CreditCard, 
  Library, 
  Home, 
  Bus,
  Radio,
  Trophy,
  Package,
  Menu,
  ArrowLeft,
  RotateCw,
  X,
  School as SchoolIcon,
  FileText
} from 'lucide-react';
import clsx from 'clsx';
import { seedAll } from '../utils/seed';
import MobileDashboardHome from '../components/MobileDashboardHome';
import api from '../utils/api';

const SidebarItem = ({ icon: Icon, label, to, active, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={clsx(
        'group flex items-center gap-3 px-4 py-3 mb-1 rounded-md border transition-colors',
        active
          ? 'bg-gray-800 text-white border-gray-800'
          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
      )}
    >
      <span
        className={clsx(
          'inline-block w-1.5 h-5 rounded-full bg-gray-400 group-hover:bg-gray-500'
        )}
      />
      <Icon size={20} className={clsx(active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700')} />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: Calendar, label: 'Attendance', to: '/attendance', allowedRoles: ['student','teacher','admin','staff'] },
  { icon: MessageSquare, label: 'Messages', to: '/messages', allowedRoles: ['student','teacher','admin','staff','parent'] },
  { icon: Users, label: 'Teachers', to: '/teachers', excludedRoles: ['student','teacher','parent'] },
  { icon: GraduationCap, label: 'Students', to: '/students', excludedRoles: ['student','parent'] },
  { icon: Home, label: 'Classes', to: '/classes', allowedRoles: ['teacher','admin','staff'] },
  { icon: SchoolIcon, label: 'Schools', to: '/schools', allowedRoles: ['admin'] },
  { icon: BookOpen, label: 'Exams', to: '/exams', excludedRoles: ['student','parent'] },
  { icon: FileText, label: 'My Exams', to: '/student/exams', allowedRoles: ['student'] },
  { icon: CreditCard, label: 'Finance', to: '/finance', excludedRoles: ['student','teacher','parent'] },
  { icon: Library, label: 'Library', to: '/library', allowedRoles: ['student','admin','staff'] },
  { icon: Home, label: 'Hostel', to: '/hostel', allowedRoles: ['student','admin','staff'] },
  { icon: Bus, label: 'Transport', to: '/transport', excludedRoles: ['student','teacher','parent'] },
  { icon: Radio, label: 'E-Learning', to: '/e-learning', allowedRoles: ['student','teacher','admin','staff'] },
  { icon: BookOpen, label: 'Subjects', to: '/subjects', allowedRoles: ['student','teacher','admin','staff'] },
  { icon: Trophy, label: 'Sports', to: '/sports', excludedRoles: ['student','teacher','parent'] },
  { icon: Users, label: 'Group Studies', to: '/group-studies', allowedRoles: ['student','teacher','admin','staff'] },
  { icon: Package, label: 'Inventory', to: '/inventory', excludedRoles: ['student','teacher','parent'] },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // For desktop
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // For mobile
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const loadUser = () => {
      const savedUserId = localStorage.getItem('current_demo_user_id');
      // Also check authToken
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      let foundUser = null;
      
      const teachers = JSON.parse(localStorage.getItem('teachers:doonites') || '[]');
      const students = JSON.parse(localStorage.getItem('students:doonites') || '[]');
      const admins = JSON.parse(localStorage.getItem('admins:doonites') || '[]');
      const librarians = JSON.parse(localStorage.getItem('librarians:doonites') || '[]');
      const parents = JSON.parse(localStorage.getItem('parents:doonites') || '[]');
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));

      const allUsers = [...admins, ...teachers, ...librarians, ...students, ...parents];

      // Prioritize the currentUser from login
      if (currentUser) {
        foundUser = currentUser;
      } else if (allUsers.length === 0) {
        seedAll();
        return; 
      } else if (savedUserId) {
        foundUser = allUsers.find(u => u.id === savedUserId);
      }

      if (!foundUser) {
        if (admins.length > 0) foundUser = admins[0];
        else if (teachers.length > 0) foundUser = teachers[0];
      }

      setCurrentUser(foundUser);
    };

    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('current_demo_user_id');
    navigate('/login');
    window.location.reload(); // Ensure state clears
  };

  // Handle Mobile Header
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col relative overflow-hidden">
        {/* Mobile Header - Curved */}
        <div className="bg-[#1e40af] text-white pt-6 pb-12 px-6 rounded-b-[40px] shadow-lg relative z-10 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
               <button onClick={() => setMobileMenuOpen(true)}>
                 <Menu size={24} />
               </button>
               <span className="font-medium text-lg">The Asian School</span>
            </div>
            {/* Optional: Add notification or user icon here if needed */}
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-light mb-1">
              Hi! {currentUser ? currentUser.firstName : 'User'}
            </h1>
            <p className="text-sm opacity-90">
              Role: {currentUser ? currentUser.role : '...'}
            </p>
            {currentUser && currentUser.role === 'student' && (
              <p className="text-sm opacity-90">Class: X - D</p>
            )}
          </div>
        </div>

        {/* Mobile Sidebar Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Drawer Content */}
            <div className="relative bg-white w-[80%] max-w-sm h-full shadow-2xl flex flex-col animate-slide-in">
              <div className="p-4 bg-[#0f172a] text-white flex justify-between items-center">
                <span className="font-bold text-lg">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 hover:bg-white/10 rounded">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                 {MENU_ITEMS.map((item) => (
                   <SidebarItem 
                     key={item.to}
                     icon={item.icon} 
                     label={item.label} 
                     to={item.to} 
                     active={location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))}
                     onClick={() => setMobileMenuOpen(false)}
                   />
                 ))}
              </div>

              <div className="p-4 border-t bg-gray-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                    {currentUser?.firstName?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{currentUser?.firstName} {currentUser?.lastName}</p>
                    <p className="text-xs text-gray-500 capitalize">{currentUser?.role}</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-red-500 w-full p-2 hover:bg-red-50 rounded">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Content */}
        <main className="flex-1 -mt-6 z-20 px-2 overflow-y-auto pb-20">
          {location.pathname === '/' ? (
            <MobileDashboardHome />
          ) : (
             <div className="bg-white rounded-t-3xl min-h-full p-4 shadow-inner">
               <Outlet />
             </div>
          )}
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#0f172a] text-white h-16 flex items-center justify-between px-8 shadow-lg z-50">
          <Link to="/" className="flex flex-col items-center gap-1 opacity-90 hover:opacity-100">
            <Home size={24} />
          </Link>
          <button onClick={() => navigate(-1)} className="flex flex-col items-center gap-1 opacity-90 hover:opacity-100">
            <ArrowLeft size={24} />
          </button>
          <button onClick={() => window.location.reload()} className="flex flex-col items-center gap-1 opacity-90 hover:opacity-100">
            <RotateCw size={24} />
          </button>
           <button onClick={handleLogout} className="flex items-center gap-1 hover:text-red-400 text-red-400">
            <LogOut size={24} />
          </button>
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-[#0f172a] text-white h-16 flex items-center justify-between px-6 shadow-md z-20">
        <div className="flex items-center gap-4">
           <h1 className="text-xl font-bold tracking-wider">doonITes weBBed serVIces ERP</h1>
        </div>
        <div className="flex items-center gap-6">
           <button className="relative hover:text-gray-300">
             <Bell size={20} className="text-yellow-500" />
             <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
           </button>
           <div className="flex items-center gap-2">
             <User size={20} className="text-purple-400" />
             <span className="text-sm font-medium">
               {currentUser ? `${currentUser.firstName} (${currentUser.role})` : 'Loading...'}
             </span>
           </div>
           <Link to="/messages" className="flex items-center gap-1 hover:text-gray-300">
             <MessageSquare size={20} />
             <span className="text-sm">Messages</span>
           </Link>
           <button onClick={handleLogout} className="flex items-center gap-1 hover:text-red-400">
             <span className="text-sm">Logout</span>
           </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 border-r border-gray-200 overflow-y-auto flex-shrink-0 pb-10">
          <div className="p-4">
             <h3 className="text-gray-500 font-bold text-xs uppercase mb-2">Main Menu</h3>
          </div>
          <div className="flex flex-col px-3">
             {MENU_ITEMS.map((item) => {
               // Filter logic
               if (item.allowedRoles && (!currentUser || !item.allowedRoles.includes(currentUser.role))) return null;
               if (item.excludedRoles && currentUser && item.excludedRoles.includes(currentUser.role)) return null;

               return (
                 <SidebarItem 
                   key={item.to}
                   icon={item.icon} 
                   label={item.label} 
                   to={item.to} 
                   active={location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))} 
                 />
               );
             })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
           <Outlet context={{ currentUser }} />
        </main>
      </div>
      
      <footer className="w-full bg-white border-t border-gray-200 py-4 px-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} School ERP. All rights reserved.
      </footer>
    </div>
  );
};

export default DashboardLayout;
