import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  Users, 
  GraduationCap, 
  Home, 
  BookOpen, 
  CreditCard, 
  Library, 
  Bus,
  Radio,
  Trophy,
  Package,
  Activity,
  Image as ImageIcon,
  Newspaper
} from 'lucide-react';

const MobileDashboardHome = ({ currentUser }) => {
  const menuItems = [
    { icon: CreditCard, label: 'Pay Fees', to: '/finance', excludedRoles: ['teacher'] },
    { icon: Calendar, label: 'Attendance', to: '/attendance' },
    { icon: BookOpen, label: 'Subjects', to: '/subjects' },
    { icon: BookOpen, label: 'Learn @ Home', to: '/library', excludedRoles: ['teacher'] }, // Using Library as placeholder
    { icon: Users, label: 'Teachers', to: '/teachers', excludedRoles: ['teacher'] },
    { icon: Activity, label: 'Time-Table', to: '/classes' }, // Placeholder
    { icon: MessageSquare, label: 'Messages', to: '/messages' },
    { icon: BookOpen, label: 'Study Material', to: '/library', excludedRoles: ['teacher'] },
    { icon: Radio, label: 'E-Learning', to: '/radio' },
    { icon: Calendar, label: 'Datesheet', to: '/exams' },
    { icon: Calendar, label: 'Activity Calendar', to: '/dashboard' }, // Placeholder
    { icon: Newspaper, label: 'Newsletter', to: '/newsletters' },
    { icon: Trophy, label: 'Events', to: '/sports', excludedRoles: ['teacher'] },
    { icon: ImageIcon, label: 'Gallery', to: '/gallery' },
    { icon: GraduationCap, label: 'Class Remarks', to: '/students' },
    { icon: Bus, label: 'Transport', to: '/transport', excludedRoles: ['teacher'] },
    { icon: Users, label: 'Group Studies', to: '/group-studies' },
    { icon: Home, label: 'Hostel', to: '/hostel', excludedRoles: ['teacher'] },
  ];

  return (
    <div className="bg-surface-50 min-h-[calc(100vh-140px)] pb-24">
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {menuItems.map((item, index) => {
          if (item.excludedRoles && currentUser && item.excludedRoles.includes(currentUser.role)) return null;
          
          return (
            <Link 
              key={index} 
              to={item.to}
              className="flex flex-col items-center justify-center bg-white/90 backdrop-blur p-3 rounded-2xl shadow-[0_2px_10px_-6px_rgba(15,23,42,0.35)] border border-surface-200 h-28 active:scale-95 transition-all duration-200 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-50/70 via-white/30 to-sidebar-bg-2/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="p-2.5 rounded-xl bg-surface-100 text-slate-700 mb-2 group-hover:bg-brand-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-700/25 transition-all duration-300 relative z-10">
                <item.icon size={24} strokeWidth={2} />
              </div>
              
              <span className="text-[11px] font-extrabold text-center text-slate-700 leading-tight group-hover:text-brand-700 transition-colors relative z-10">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileDashboardHome;
