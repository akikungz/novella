import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { BookOpen } from 'lucide-react';

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (role: UserRole) => {
    await login(role);
    navigate(role === UserRole.AUTHOR ? '/author' : '/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-stone-100">
        <div className="flex justify-center mb-6">
           <div className="bg-brand-600 text-white p-3 rounded-xl">
              <BookOpen size={32} strokeWidth={2} />
           </div>
        </div>
        <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">Welcome to Novella</h1>
        <p className="text-stone-500 mb-8">Select a demo account to continue</p>

        <div className="space-y-4">
          <button 
            onClick={() => handleLogin(UserRole.READER)}
            disabled={isLoading}
            className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Continue as Reader
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-stone-400">or</span>
            </div>
          </div>

          <button 
            onClick={() => handleLogin(UserRole.AUTHOR)}
            disabled={isLoading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? 'Signing In...' : 'Continue as Author'}
          </button>
        </div>

        <p className="mt-8 text-xs text-stone-400">
          This is a demonstration build. No real authentication is performed.
        </p>
      </div>
    </div>
  );
};

export default Login;