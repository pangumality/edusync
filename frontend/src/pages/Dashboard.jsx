import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  Home, 
  CreditCard 
} from 'lucide-react';
import ParentDashboard from './ParentDashboard';

const StatCard = ({ icon: Icon, title, count, tint, buttonLabel }) => {
  return (
    <div className="rounded-xl overflow-hidden flex flex-col bg-white shadow-soft">
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
};

const Dashboard = () => {
  const { currentUser } = useOutletContext() || {};

  if (currentUser?.role === 'parent') {
    return <ParentDashboard />;
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-700 mb-6 uppercase">My Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={GraduationCap} 
          title="Total Students" 
          count="0" 
          tint="bg-brand-500 text-white" 
          buttonLabel="Manage Students"
        />
        {(!currentUser || currentUser.role !== 'teacher') && (
          <StatCard 
            icon={Users} 
            title="Total Teachers" 
            count="0" 
            tint="bg-danger text-white" 
            buttonLabel="Manage Teachers"
          />
        )}
        <StatCard 
          icon={Home} 
          title="Total Administrators" 
          count="0" 
          tint="bg-success text-white" 
          buttonLabel={currentUser?.role === 'student' ? 'Subjects' : 'Classes'} 
        />
        {(!currentUser || currentUser.role !== 'teacher') && (
          <StatCard 
            icon={CreditCard} 
            title="Total Parents" 
            count="0" 
            tint="bg-purple text-white" 
            buttonLabel="Finance"
          />
        )}
      </div>

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
