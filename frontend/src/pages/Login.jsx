import React, { useState } from 'react';
import { User, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/login`, {
        email: email.trim(),
        password: password.trim()
      });

      const { token, user } = response.data;
      
      // Store auth data
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // For demo compatibility with existing localStorage logic
      // We'll mimic the "current_demo_user_id" which the DashboardLayout uses
      localStorage.setItem('current_demo_user_id', user.id);
      
      // Redirect
      navigate('/');
      
      // Force reload to ensure context picks up new user (simple way for now)
      window.location.reload();

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Calm, serious background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-slate-50 to-slate-100 z-0" />
      <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl z-0" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-brand-300/30 blur-3xl z-0" />

      <div className="bg-white/90 backdrop-blur p-8 rounded-2xl shadow-soft border border-slate-200 w-full max-w-md z-10 relative">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-600/20">
            <User size={22} className="text-white" />
          </div>
        </div>

        <h2 className="text-center text-slate-900 text-xl font-semibold mb-1">Sign in</h2>
        <p className="text-center text-slate-500 text-sm mb-8">Use your account credentials</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <div className="relative">
               <span className="absolute left-3 top-3 text-slate-400">
                 <User size={18} />
               </span>
               <input 
                 type="email" 
                 className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
                 placeholder="Email Address"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
               />
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
               <span className="absolute left-3 top-3 text-slate-400">
                 <Lock size={18} />
               </span>
               <input 
                 type="password" 
                 className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
                 placeholder="Password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
               />
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-slate-600 text-sm cursor-pointer select-none">
              <input type="checkbox" className="mr-2 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
              Remember
            </label>
            <a href="#" className="text-brand-700 text-sm hover:underline decoration-brand-300 underline-offset-4">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-brand-600/20"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <>Sign in <ArrowRight size={16} /></>}
          </button>
        </form>
      </div>
      
      <footer className="absolute bottom-3 left-0 right-0 text-center text-xs text-slate-400 z-10">
        © {new Date().getFullYear()} Edusync. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
