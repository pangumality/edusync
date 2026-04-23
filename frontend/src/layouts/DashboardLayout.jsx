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
  FileText,
  Newspaper,
  Clock,
  FileCheck,
  Award,
  ChevronLeft,
  ChevronRight,
  Check,
  CheckCheck,
  Image as ImageIcon
} from 'lucide-react';
import clsx from 'clsx';
import { seedAll } from '../utils/seed';
import MobileDashboardHome from '../components/MobileDashboardHome';
import api from '../utils/api';

const SidebarItem = ({ icon: Icon, label, to, active, onClick, isCollapsed }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={clsx(
        'group flex items-center gap-3 px-4 py-3 mb-1.5 rounded-xl border border-transparent transition-all duration-300 relative overflow-hidden',
        active
          ? 'bg-white/10 text-white shadow-lg shadow-black/20'
          : 'bg-transparent text-white/75 hover:bg-white/5 hover:text-white',
        isCollapsed ? 'justify-center px-2' : ''
      )}
      title={isCollapsed ? label : ''}
    >
      {!isCollapsed && active && (
        <span className="absolute left-0 top-0 bottom-0 w-1 bg-sidebar-bg-2" />
      )}
      <Icon 
        size={20} 
        className={clsx(
          'transition-colors duration-300',
          active ? 'text-sidebar-bg-2' : 'text-white/70 group-hover:text-white'
        )} 
      />
      {!isCollapsed && <span className="font-medium whitespace-nowrap overflow-hidden tracking-wide">{label}</span>}
      {!isCollapsed && !active && (
         <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-white/40" />
      )}
    </Link>
  );
};

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: Calendar, label: 'Attendance', to: '/attendance', allowedRoles: ['student','teacher','admin','staff'] },
  { icon: MessageSquare, label: 'Messages', to: '/messages', allowedRoles: ['student','teacher','admin','staff','parent'] },
  { icon: Newspaper, label: 'Newsletters', to: '/newsletters', allowedRoles: ['student','teacher','admin','staff','parent'] },
  { icon: ImageIcon, label: 'Gallery', to: '/gallery', allowedRoles: ['student','teacher','admin','staff','parent'] },
  { icon: FileCheck, label: 'Leaves', to: '/leaves', allowedRoles: ['student','parent','admin','staff','teacher'] },
  { icon: Clock, label: 'Time Table', to: '/timetable', allowedRoles: ['student','teacher','admin','staff','parent'] },
  { icon: Award, label: 'Certificates', to: '/certificates', allowedRoles: ['student','parent','admin','staff'] },
  { icon: Users, label: 'Teachers', to: '/teachers', excludedRoles: ['student','teacher','parent'] },
  { icon: GraduationCap, label: 'Students', to: '/students', excludedRoles: ['student','parent'] },
  { icon: Home, label: 'Classes', to: '/classes', allowedRoles: ['teacher','admin','staff'] },
  { icon: Users, label: 'Users', to: '/users', allowedRoles: ['admin','staff'] },
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // For mobile
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const loadUser = () => {
      const readList = (key) => JSON.parse(
        localStorage.getItem(`${key}:edusync`) ||
        localStorage.getItem(`${key}:doonites`) ||
        '[]'
      );

      const savedUserId = localStorage.getItem('current_demo_user_id');
      // Also check authToken
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      let foundUser = null;
      
      const teachers = readList('teachers');
      const students = readList('students');
      const admins = readList('admins');
      const librarians = readList('librarians');
      const parents = readList('parents');
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

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const markAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    if (notification.activityType === 'MESSAGE') {
      navigate('/messages');
    } else if (notification.activityType === 'LEAVE_REQUEST') {
      navigate('/leaves');
    } else if (notification.activityType === 'HOMEWORK') {
      navigate('/e-learning');
    }
    // Add other navigations as needed
    
    setShowNotifications(false);
  };

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
      <div className="min-h-screen bg-surface-50 flex flex-col relative overflow-hidden">
        {/* Mobile Header - Curved */}
        <div className="bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 text-white pt-6 pb-16 px-6 rounded-b-[40px] shadow-xl relative z-10 transition-all duration-300">
          <div className="absolute inset-0 bg-white/10 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
               <button onClick={() => setMobileMenuOpen(true)}>
                 <Menu size={24} />
               </button>
               <span className="font-medium text-lg">The Asian School</span>
            </div>
            <Link to="/profile" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
              <User size={20} />
            </Link>
          </div>
          
          <div className="text-center">
            <Link to="/profile" className="inline-block">
              <h1 className="text-2xl font-light mb-1 hover:underline decoration-white/50 underline-offset-4 transition-all">
                Hi! {currentUser ? currentUser.firstName : 'User'}
              </h1>
            </Link>
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
            <div className="relative bg-white w-4/5 max-w-sm h-full shadow-2xl flex flex-col animate-slide-in">
              <div className="p-4 bg-gradient-to-r from-sidebar-bg via-sidebar-bg-mid to-sidebar-bg-2 text-white flex justify-between items-center relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.20),transparent_55%)] opacity-70" />
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

              <div className="p-4 border-t border-surface-200 bg-surface-50">
                <Link 
                  to="/profile" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 mb-4 hover:bg-surface-100 p-2 rounded-lg -mx-2 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-800 font-bold">
                    {currentUser?.firstName?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{currentUser?.firstName} {currentUser?.lastName}</p>
                    <p className="text-xs text-gray-500 capitalize">{currentUser?.role}</p>
                  </div>
                </Link>
                <button onClick={handleLogout} className="ui-btn ui-btn-secondary w-full justify-start text-danger hover:bg-danger/10">
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
             <div className="bg-white/90 backdrop-blur rounded-t-3xl min-h-full p-4 shadow-inner border border-white/60">
               <Outlet />
             </div>
          )}
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-sidebar-bg via-sidebar-bg-mid to-sidebar-bg-2 text-white h-16 flex items-center justify-between px-4 sm:px-8 shadow-lg z-50 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.14),transparent_60%)] opacity-70" />
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
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-white/85 backdrop-blur h-16 flex items-center justify-between px-6 shadow-sm border-b border-surface-200 z-20 sticky top-0">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 shadow-lg shadow-brand-700/20 flex items-center justify-center overflow-hidden">
             <img src="/systemlogo.jpg" alt="Edusync" className="w-full h-full object-cover" />
           </div>
           <div>
             <h1 className="text-base font-semibold text-slate-900 tracking-tight">Dashboard</h1>
             <div className="text-[11px] text-slate-500 font-medium">
               {currentUser ? `${currentUser.firstName} · ${currentUser.role}` : 'Loading...'}
             </div>
           </div>
        </div>
        <div className="flex items-center gap-6 relative">
           <div className="relative">
             <button 
              className="relative text-slate-700 hover:text-slate-900 focus:outline-none"
               onClick={() => setShowNotifications(!showNotifications)}
             >
               <Bell size={20} className={unreadCount > 0 ? "text-sidebar-bg" : "text-slate-400"} />
               {unreadCount > 0 && (
                 <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center text-white">
                   {unreadCount}
                 </span>
               )}
             </button>

             {showNotifications && (
               <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-md shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                 <div className="p-3 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
                   <h3 className="font-semibold text-sm">Notifications</h3>
                   {unreadCount > 0 && (
                     <button 
                       onClick={markAllAsRead}
                       className="text-xs text-brand-700 hover:text-brand-800 flex items-center gap-1"
                     >
                       <CheckCheck size={14} /> Mark all read
                     </button>
                   )}
                 </div>
                 
                 {notifications.length === 0 ? (
                   <div className="p-4 text-center text-gray-500 text-sm">
                     No notifications
                   </div>
                 ) : (
                   <div className="divide-y divide-gray-100">
                     {notifications.map(notification => (
                       <div 
                         key={notification.id}
                         onClick={() => handleNotificationClick(notification)}
                         className={clsx(
                           "p-3 cursor-pointer hover:bg-gray-50 transition-colors",
                           !notification.isRead ? "bg-brand-50/70" : ""
                         )}
                       >
                         <div className="flex justify-between items-start gap-2">
                           <p className={clsx("text-sm", !notification.isRead ? "font-medium" : "text-gray-600")}>
                             {notification.message}
                           </p>
                           {!notification.isRead && (
                             <button 
                               onClick={(e) => markAsRead(notification.id, e)}
                               className="text-gray-400 hover:text-brand-700"
                               title="Mark as read"
                             >
                               <Check size={14} />
                             </button>
                           )}
                         </div>
                         <span className="text-xs text-gray-400 mt-1 block">
                           {new Date(notification.createdAt).toLocaleString()}
                         </span>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
             )}
           </div>

           <Link to="/profile" className="flex items-center gap-2 hover:bg-surface-100 px-2 py-1 rounded-lg transition-colors">
             <User size={20} className="text-brand-700" />
             <span className="text-sm font-medium text-slate-700">
               {currentUser ? currentUser.firstName : 'Loading...'}
             </span>
           </Link>
           <Link to="/messages" className="flex items-center gap-1 text-slate-700 hover:text-slate-900">
             <MessageSquare size={20} />
             <span className="text-sm font-medium">Messages</span>
           </Link>
           <button onClick={handleLogout} className="flex items-center gap-1 text-slate-700 hover:text-red-600">
             <span className="text-sm font-medium">Logout</span>
           </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={clsx(
            "bg-gradient-to-b from-sidebar-bg via-sidebar-bg-mid to-sidebar-bg-2 text-white border-r border-sidebar-border overflow-y-auto flex-shrink-0 pb-10 transition-all duration-300 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.35)] z-10 relative",
            isCollapsed ? "w-20" : "w-72"
        )}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_55%)] opacity-70" />
          <div className="pointer-events-none absolute -top-28 -right-28 h-80 w-80 rounded-full bg-sidebar-bg-2/20 blur-3xl opacity-70" />
          <div className={clsx("p-4 flex items-center relative z-10", isCollapsed ? "justify-center" : "justify-between")}>
             {!isCollapsed && (
               <div className="flex items-center gap-3 px-2">
                 <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden shadow-lg shadow-black/20">
                   <img src="/systemlogo.jpg" alt="Edusync" className="w-full h-full object-cover" />
                 </div>
                 <div>
                   <div className="text-sm font-semibold tracking-wide">Edusync</div>
                   <div className="text-[11px] text-white/60">Navigation</div>
                 </div>
               </div>
             )}
             <button 
                onClick={() => setIsCollapsed(!isCollapsed)} 
                className="p-1.5 hover:bg-white/10 text-white/80 rounded-lg transition-colors"
             >
                {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
             </button>
          </div>
          <div className="flex flex-col px-3 relative z-10 gap-1">
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
                   isCollapsed={isCollapsed}
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
        © {new Date().getFullYear()} Edusync. All rights reserved.
      </footer>
    </div>
  );
};

export default DashboardLayout;
