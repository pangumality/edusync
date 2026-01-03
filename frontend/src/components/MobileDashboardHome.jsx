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
  Activity
} from 'lucide-react';

const MobileDashboardHome = () => {
  const menuItems = [
    { icon: CreditCard, label: 'Pay Fees', to: '/finance' },
    { icon: Calendar, label: 'Attendance', to: '/attendance' },
    { icon: Home, label: 'Class Work', to: '/classes' }, // Using Classes for Class Work
    { icon: BookOpen, label: 'Learn @ Home', to: '/library' }, // Using Library as placeholder
    { icon: Users, label: 'Teachers', to: '/teachers' },
    { icon: Activity, label: 'Time-Table', to: '/classes' }, // Placeholder
    { icon: MessageSquare, label: 'Messages', to: '/messages' },
    { icon: BookOpen, label: 'Study Material', to: '/library' },
    { icon: Radio, label: 'E-Learning', to: '/radio' },
    { icon: Calendar, label: 'Datesheet', to: '/exams' },
    { icon: Calendar, label: 'Activity Calendar', to: '/dashboard' }, // Placeholder
    { icon: BookOpen, label: 'Newsletter', to: '/dashboard' }, // Placeholder
    { icon: Trophy, label: 'Events', to: '/sports' },
    { icon: Package, label: 'Gallery', to: '/inventory' },
    { icon: GraduationCap, label: 'Class Remarks', to: '/students' },
    { icon: Bus, label: 'Transport', to: '/transport' },
    { icon: Users, label: 'Group Studies', to: '/group-studies' },
    { icon: Home, label: 'Hostel', to: '/hostel' },
  ];

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-140px)] pb-20">
      <div className="p-4 grid grid-cols-3 gap-4">
        {menuItems.map((item, index) => (
          <Link 
            key={index} 
            to={item.to}
            className="flex flex-col items-center justify-center bg-white p-3 rounded-xl shadow-sm border border-gray-100 h-28 active:scale-95 transition-transform"
          >
            <item.icon size={28} className="text-[#0f172a] mb-2" strokeWidth={1.5} />
            <span className="text-[10px] font-medium text-center text-[#0f172a] leading-tight">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileDashboardHome;
