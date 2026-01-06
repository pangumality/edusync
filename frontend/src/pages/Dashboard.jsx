import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  Home, 
  CreditCard,
  BarChart2
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

const StatCard = ({ icon: Icon, title, count, tint, buttonLabel, link }) => {
  const CardContent = (
    <div className="rounded-xl overflow-hidden flex flex-col bg-white shadow-soft h-full hover:shadow-md transition-shadow cursor-pointer">
      <div className={`p-3 flex items-center justify-center text-text-base font-medium ${tint}`}>
        <Icon size={20} className="mr-2" />
        {buttonLabel}
      </div>
      <div className="p-6 h-32 flex flex-col justify-center">
        <h3 className="text-xs uppercase text-text-muted mb-1">{title}</h3>
        <span className="text-4xl font-bold text-text-base">{count}</span>
      </div>
    </div>
  );

  return link ? <Link to={link}>{CardContent}</Link> : CardContent;
};

const Dashboard = () => {
  const { currentUser } = useOutletContext() || {};
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    parents: 0
  });

  useEffect(() => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'super_admin') {
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

  const chartData = {
    labels: ['Students', 'Teachers', 'Classes', 'Parents'],
    datasets: [
      {
        label: 'School Statistics',
        data: [stats.students, stats.teachers, stats.classes, stats.parents],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-700 mb-6 uppercase">My Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={GraduationCap} 
          title="Total Students" 
          count={stats.students} 
          tint="bg-brand-500 text-white" 
          buttonLabel="Manage Students"
          link="/students"
        />
        {(!currentUser || currentUser.role !== 'teacher') && (
          <StatCard 
            icon={Users} 
            title="Total Teachers" 
            count={stats.teachers} 
            tint="bg-danger text-white" 
            buttonLabel="Manage Teachers"
            link="/teachers"
          />
        )}
        <StatCard 
          icon={Home} 
          title="Total Classes" 
          count={stats.classes} 
          tint="bg-success text-white" 
          buttonLabel={currentUser?.role === 'student' ? 'Subjects' : 'Classes'} 
          link={currentUser?.role === 'student' ? '/subjects' : '/classes'}
        />
        {(!currentUser || currentUser.role !== 'teacher') && (
          <StatCard 
            icon={CreditCard} 
            title="Total Parents" 
            count={stats.parents} 
            tint="bg-purple text-white" 
            buttonLabel="Finance"
            link="/finance"
          />
        )}
      </div>

      {(currentUser?.role === 'admin' || currentUser?.role === 'super_admin') && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="text-gray-500" />
            <h3 className="text-lg font-bold text-gray-700">Statistics Overview</h3>
          </div>
          <div className="h-64">
            <Bar 
              data={chartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' }
                }
              }} 
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded shadow p-4">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <div className="flex items-center gap-2 text-gray-700 font-bold">
            <span role="img" aria-label="calendar">📅</span>
            School Events Calendar
          </div>
          <button className="text-blue-500 text-sm hover:underline">Hide / Show</button>
        </div>
        
        <div className="text-center mb-4">
           <h3 className="text-lg text-gray-600">December 2025</h3>
        </div>

        {/* Simple Calendar Grid Mockup */}
        <div className="border rounded overflow-hidden">
          <div className="grid grid-cols-7 bg-gray-50 border-b">
             {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
               <div key={day} className="py-2 px-4 text-xs font-bold text-gray-600 border-r last:border-r-0">{day}</div>
             ))}
          </div>
          <div className="grid grid-cols-7">
             {/* Padding days */}
             {[1, 2, 3, 4, 5, 6].map(d => (
               <div key={`pad-${d}`} className="h-24 border-r border-b last:border-r-0"></div>
             ))}
             
             {/* Days 1-31 */}
             {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
               <div key={day} className={`h-24 border-r border-b last:border-r-0 p-2 relative ${day === 30 ? 'bg-blue-400 text-white' : ''}`}>
                 <span className="text-xs">{day}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
