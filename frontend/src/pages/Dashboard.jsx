import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  Home, 
  CreditCard,
  BarChart2,
  Building2,
  DollarSign,
  MessageSquare,
  Activity
} from 'lucide-react';
import ParentDashboard from './ParentDashboard';
import api from '../utils/api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatCard = ({
  icon: Icon,
  title,
  count,
  accentFrom,
  accentTo,
  iconBg,
  iconText,
  iconShadow,
  buttonLabel,
  link
}) => {
  const CardContent = () => (
    <>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${accentFrom} ${accentTo} opacity-55 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 group-hover:opacity-80 pointer-events-none`} />
      
      <div className={`absolute top-6 right-6 p-3 rounded-xl ${iconBg} ${iconShadow} transform group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={22} className={iconText} />
      </div>
      
      <div>
        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
        <span className="text-4xl font-black text-slate-800 tracking-tight">{count}</span>
        {buttonLabel && (
          <div className="mt-3">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-100">
              {buttonLabel}
            </span>
          </div>
        )}
      </div>
    </>
  );

  if (link) {
    return (
      <Link to={link} className="group relative ui-card p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden block">
        <CardContent />
      </Link>
    );
  }

  return (
    <Link to="/" className="group relative ui-card p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden block">
      <CardContent />
    </Link>
  );
};

const Dashboard = () => {
  const { currentUser } = useOutletContext() || {};
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    parents: 0,
    // Super Admin stats
    schools: 0,
    users: 0,
    revenue: 0,
    messages: 0
  });

  useEffect(() => {
    if (currentUser?.role && currentUser.role !== 'parent') {
      fetchStats();
    }
  }, [currentUser]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  if (currentUser?.role === 'parent') {
    return <ParentDashboard />;
  }

  // Chart Data Logic
  const chartData = currentUser?.role === 'admin' ? {
    labels: ['Schools', 'Users', 'Messages (x10)', 'Revenue (x100)'],
    datasets: [
      {
        label: 'System Overview',
        data: [
            stats.schools, 
            stats.users, 
            Math.round(stats.messages / 10), 
            Math.round(stats.revenue / 100)
        ],
        backgroundColor: [
          'rgba(124, 58, 237, 0.82)',
          'rgba(6, 182, 212, 0.82)',
          'rgba(245, 158, 11, 0.82)',
          'rgba(100, 116, 139, 0.82)'
        ],
        hoverBackgroundColor: [
          'rgba(124, 58, 237, 1)',
          'rgba(6, 182, 212, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(100, 116, 139, 1)'
        ],
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.6,
        categoryPercentage: 0.8
      }
    ]
  } : {
    labels: ['Students', 'Teachers', 'Classes', 'Parents'],
    datasets: [
      {
        label: 'School Statistics',
        data: [stats.students, stats.teachers, stats.classes, stats.parents],
        backgroundColor: [
          'rgba(124, 58, 237, 0.82)',
          'rgba(6, 182, 212, 0.82)',
          'rgba(245, 158, 11, 0.82)',
          'rgba(100, 116, 139, 0.82)'
        ],
        hoverBackgroundColor: [
          'rgba(124, 58, 237, 1)',
          'rgba(6, 182, 212, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(100, 116, 139, 1)'
        ],
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.6,
        categoryPercentage: 0.8
      }
    ]
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-black text-slate-800 tracking-tight">Dashboard Overview</h2>
           <p className="text-slate-500 mt-1">Welcome back, {currentUser?.firstName || 'Guest'}! Here's what's happening today.</p>
        </div>
        <div className="text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
           {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      
      {currentUser?.role === 'admin' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={Building2} 
            title="Total Schools" 
            count={stats.schools} 
            accentFrom="from-brand-400"
            accentTo="to-brand-300"
            iconBg="bg-brand-200 border border-brand-300"
            iconText="text-brand-700"
            iconShadow="shadow-lg shadow-brand-700/20"
            buttonLabel="Manage"
            link="/schools"
          />
          <StatCard 
            icon={Users} 
            title="Total Users" 
            count={stats.users} 
            accentFrom="from-cyan-400"
            accentTo="to-sky-300"
            iconBg="bg-cyan-200 border border-cyan-300"
            iconText="text-cyan-900"
            iconShadow="shadow-lg shadow-cyan-500/20"
            buttonLabel="View All"
            link="/users"
          />
          <StatCard 
            icon={DollarSign} 
            title="Total Revenue" 
            count={`ZMW ${Number(stats.revenue || 0).toLocaleString('en-ZM')}`}
            accentFrom="from-amber-300"
            accentTo="to-yellow-300"
            iconBg="bg-amber-200 border border-amber-300"
            iconText="text-amber-900"
            iconShadow="shadow-lg shadow-amber-500/20"
            buttonLabel="Finance"
            link="/finance"
          />
          <StatCard 
            icon={MessageSquare} 
            title="Total Messages" 
            count={stats.messages} 
            accentFrom="from-fuchsia-400"
            accentTo="to-pink-400"
            iconBg="bg-fuchsia-200 border border-fuchsia-300"
            iconText="text-fuchsia-900"
            iconShadow="shadow-lg shadow-rose-500/20"
            buttonLabel="Messages"
            link="/messages"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={GraduationCap} 
            title="Total Students" 
            count={stats.students} 
            accentFrom="from-brand-400"
            accentTo="to-brand-300"
            iconBg="bg-brand-200 border border-brand-300"
            iconText="text-brand-700"
            iconShadow="shadow-lg shadow-brand-700/20"
            buttonLabel="View All"
            link="/students"
          />
          {(!currentUser || currentUser.role !== 'teacher') && (
            <StatCard 
              icon={Users} 
              title="Total Teachers" 
              count={stats.teachers} 
              accentFrom="from-cyan-400"
              accentTo="to-sky-300"
              iconBg="bg-cyan-200 border border-cyan-300"
              iconText="text-cyan-900"
              iconShadow="shadow-lg shadow-cyan-500/20"
              buttonLabel="View All"
              link="/teachers"
            />
          )}
          <StatCard 
            icon={Home} 
            title="Total Classes" 
            count={stats.classes} 
            accentFrom="from-amber-300"
            accentTo="to-yellow-300"
            iconBg="bg-amber-200 border border-amber-300"
            iconText="text-amber-900"
            iconShadow="shadow-lg shadow-amber-500/20"
            buttonLabel={currentUser?.role === 'student' ? 'My Subjects' : 'View All'} 
            link={currentUser?.role === 'student' ? '/subjects' : '/classes'}
          />
          {(!currentUser || currentUser.role !== 'teacher') && (
            <StatCard 
              icon={CreditCard} 
              title="Total Parents" 
              count={stats.parents} 
              accentFrom="from-fuchsia-400"
              accentTo="to-pink-400"
              iconBg="bg-fuchsia-200 border border-fuchsia-300"
              iconText="text-fuchsia-900"
              iconShadow="shadow-lg shadow-rose-500/20"
              buttonLabel="Finance"
              link="/finance"
            />
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {currentUser?.role === 'admin' && (
          <Link to="/schools" className="lg:col-span-2 ui-card ui-card-muted p-6 group relative overflow-hidden block hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-400 to-brand-300 opacity-55 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 group-hover:opacity-80 pointer-events-none" />
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-200 text-brand-700 rounded-lg border border-brand-300 shadow-lg shadow-brand-700/25 relative z-10">
                  <BarChart2 size={20} className="text-brand-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 relative z-10">Statistics Overview</h3>
              </div>
            </div>
            <div className="h-80 relative z-10">
              <Bar 
                data={chartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: '#1e293b',
                      padding: 12,
                      cornerRadius: 8,
                      titleFont: { size: 14, weight: 'bold' },
                      bodyFont: { size: 13 },
                      displayColors: false,
                    }
                  },
                  scales: {
                    y: {
                      grid: { color: '#f1f5f9' },
                      border: { display: false },
                      ticks: { color: '#64748b', font: { size: 12 } }
                    },
                    x: {
                      grid: { display: false },
                      border: { display: false },
                      ticks: { color: '#64748b', font: { weight: 'bold' } }
                    }
                  }
                }} 
              />
            </div>
          </Link>
        )}

        <Link
          to="/timetable"
          className={`ui-card ui-card-muted p-6 group relative overflow-hidden block hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${!(currentUser?.role === 'admin' || currentUser?.role === 'super_admin') ? 'lg:col-span-3' : ''}`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400 to-sky-300 opacity-55 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 group-hover:opacity-80 pointer-events-none" />
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-200 text-cyan-700 rounded-lg border border-cyan-300 shadow-lg shadow-cyan-500/25 relative z-10">
                <Activity size={20} className="text-cyan-900" />
              </div>
              <h3 className="font-bold text-slate-700 relative z-10">Events Calendar</h3>
            </div>
            <span className="text-cyan-800 text-sm font-semibold transition-colors relative z-10">View All</span>
          </div>
          
          <div className="text-center mb-6 relative z-10">
             <h3 className="text-xl font-bold text-slate-800">December 2025</h3>
             <p className="text-sm text-slate-400">School Activities & Holidays</p>
          </div>

          {/* Simple Calendar Grid Mockup */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm relative z-10">
            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
               {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                 <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">{day}</div>
               ))}
            </div>
            <div className="grid grid-cols-7 bg-white">
               {/* Padding days */}
               {[1, 2, 3, 4, 5, 6].map(d => (
                 <div key={`pad-${d}`} className="h-20 border-r border-b border-slate-100 last:border-r-0"></div>
               ))}
               
               {/* Days 1-31 */}
               {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                 <div key={day} className={`h-20 border-r border-b border-slate-100 last:border-r-0 p-1 relative hover:bg-slate-50 transition-colors group`}>
                   <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${day === 30 ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25' : 'text-slate-600'}`}>
                     {day}
                   </span>
                   {day === 30 && (
                     <div className="mt-1">
                       <div className="h-1.5 w-full bg-rose-400 rounded-full mb-0.5"></div>
                       <div className="h-1.5 w-2/3 bg-accent rounded-full"></div>
                     </div>
                   )}
                 </div>
               ))}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
