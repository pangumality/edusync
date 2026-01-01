import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
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
  Package
} from 'lucide-react';
import clsx from 'clsx';
import { seedAll } from '../utils/seed';

const SidebarItem = ({ icon: Icon, label, to, active }) => {
  return (
    <Link
      to={to}
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

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const loadUser = () => {
      // 1. Try to get the specifically selected demo user
      const savedUserId = localStorage.getItem('current_demo_user_id');
      
      let foundUser = null;
      
      // Load all lists
      const teachers = JSON.parse(localStorage.getItem('teachers:doonites') || '[]');
      const students = JSON.parse(localStorage.getItem('students:doonites') || '[]');
      const admins = JSON.parse(localStorage.getItem('admins:doonites') || '[]');
      const librarians = JSON.parse(localStorage.getItem('librarians:doonites') || '[]');
      const parents = JSON.parse(localStorage.getItem('parents:doonites') || '[]');

      const allUsers = [...admins, ...teachers, ...librarians, ...students, ...parents];

      if (allUsers.length === 0) {
        // Fallback if nothing seeded yet (should be handled by Messages page, but safety first)
        seedAll();
        return; 
      }

      if (savedUserId) {
        foundUser = allUsers.find(u => u.id === savedUserId);
      }

      // Default if no specific user selected
      if (!foundUser) {
        if (admins.length > 0) foundUser = admins[0];
        else if (teachers.length > 0) foundUser = teachers[0];
      }

      setCurrentUser(foundUser);
    };

    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

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
               {currentUser ? `${currentUser.name} (${currentUser.role})` : 'Loading...'}
             </span>
           </div>
           <Link to="/messages" className="flex items-center gap-1 hover:text-gray-300">
             <MessageSquare size={20} />
             <span className="text-sm">Messages</span>
           </Link>
           <button className="flex items-center gap-1 hover:text-red-400">
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
             <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" active={location.pathname === '/'} />
             <SidebarItem icon={Calendar} label="Attendance" to="/attendance" active={location.pathname.startsWith('/attendance')} />
             <SidebarItem icon={MessageSquare} label="Messages" to="/messages" active={location.pathname.startsWith('/messages')} />
             <SidebarItem icon={Users} label="Teachers" to="/teachers" active={location.pathname.startsWith('/teachers')} />
             <SidebarItem icon={GraduationCap} label="Students" to="/students" active={location.pathname.startsWith('/students')} />
             <SidebarItem icon={Home} label="Classes" to="/classes" active={location.pathname.startsWith('/classes')} />
             <SidebarItem icon={BookOpen} label="Exams" to="/exams" active={location.pathname.startsWith('/exams')} />
             <SidebarItem icon={CreditCard} label="Finance" to="/finance" active={location.pathname.startsWith('/finance')} />
             <SidebarItem icon={Library} label="Library" to="/library" active={location.pathname.startsWith('/library')} />
             <SidebarItem icon={Home} label="Hostel" to="/hostel" active={location.pathname.startsWith('/hostel')} />
             <SidebarItem icon={Bus} label="Transport" to="/transport" active={location.pathname.startsWith('/transport')} />
             <SidebarItem icon={Radio} label="Radio" to="/radio" active={location.pathname.startsWith('/radio')} />
             <SidebarItem icon={Trophy} label="Sports" to="/sports" active={location.pathname.startsWith('/sports')} />
             <SidebarItem icon={Users} label="Group Studies" to="/group-studies" active={location.pathname.startsWith('/group-studies')} />
             <SidebarItem icon={Package} label="Inventory" to="/inventory" active={location.pathname.startsWith('/inventory')} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
           <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
