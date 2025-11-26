import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { BookOpen, PenTool, LogOut, User as UserIcon } from 'lucide-react';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-brand-600 text-white p-1.5 rounded-lg">
              <BookOpen size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-serif font-bold text-stone-900 tracking-tight">Novella</span>
          </Link>

          <nav className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === UserRole.AUTHOR && (
                  <Link 
                    to="/author" 
                    className="flex items-center gap-2 text-stone-600 hover:text-brand-600 transition-colors px-3 py-2 rounded-md hover:bg-stone-100"
                  >
                    <PenTool size={18} />
                    <span className="hidden sm:inline font-medium">Dashboard</span>
                  </Link>
                )}
                <div className="flex items-center gap-3 pl-4 border-l border-stone-200">
                  <div className="flex items-center gap-2">
                     {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.username} className="w-8 h-8 rounded-full border border-stone-200" />
                     ) : (
                        <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center">
                            <UserIcon size={16} className="text-stone-500" />
                        </div>
                     )}
                     <span className="text-sm font-medium text-stone-700 hidden md:block">{user.username}</span>
                  </div>
                  <button 
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <Link 
                to="/login"
                className="bg-brand-600 text-white px-5 py-2 rounded-full font-medium hover:bg-brand-900 transition-colors shadow-sm text-sm"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-stone-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-stone-400 text-sm">
          &copy; {new Date().getFullYear()} Novella Platform. Built for readers and dreamers.
        </div>
      </footer>
    </div>
  );
};

export default Layout;