import React, { useState } from 'react';
import { User, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Integrate with backend
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-700 relative overflow-hidden">
      {/* Background Geometric Shapes (Abstract representation of screenshot) */}
      <div className="absolute inset-0 bg-teal-800 transform -skew-y-6 origin-top-left translate-y-20 z-0"></div>
      <div className="absolute inset-0 bg-teal-600 transform skew-y-6 origin-bottom-right -translate-y-20 z-0 opacity-50"></div>

      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md z-10 relative">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-orange-500 flex items-center justify-center">
             <div className="text-orange-500 font-bold text-2xl flex gap-1">
                <User size={20} />
                <User size={20} />
             </div>
          </div>
        </div>

        <h2 className="text-center text-gray-700 text-xl font-medium mb-1">Login to your account</h2>
        <p className="text-center text-gray-400 text-sm mb-8">Your credentials</p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <div className="relative">
               <span className="absolute left-3 top-3 text-gray-400">
                 {/* Icon placeholder if needed */}
               </span>
               <input 
                 type="email" 
                 className="w-full bg-blue-50 border border-blue-100 rounded px-4 py-2 text-gray-700 focus:outline-none focus:border-blue-300"
                 placeholder="admin@admin.com"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
               />
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
               <input 
                 type="password" 
                 className="w-full bg-blue-50 border border-blue-100 rounded px-4 py-2 text-gray-700 focus:outline-none focus:border-blue-300"
                 placeholder="Password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
               />
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-gray-600 text-sm">
              <input type="checkbox" className="mr-2 rounded text-blue-500 focus:ring-blue-500" />
              Remember
            </label>
            <a href="#" className="text-blue-400 text-sm hover:underline">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded flex items-center justify-center gap-2 transition duration-200"
          >
            Sign in <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
