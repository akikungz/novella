import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MockService } from '../services/mockData';
import { Novel } from '../types';
import { Clock, TrendingUp, Search } from 'lucide-react';

const Home: React.FC = () => {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MockService.getNovels().then(data => {
      setNovels(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-32 bg-stone-200 rounded mb-4"></div>
          <div className="h-64 w-full max-w-sm bg-stone-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-12 bg-stone-900 rounded-2xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4 leading-tight">
            Discover Worlds <br/> <span className="text-brand-500">Unimagined</span>
          </h1>
          <p className="text-stone-300 text-lg mb-8">
            Dive into thousands of serialized novels written by creators from around the globe.
          </p>
          <div className="flex gap-4">
             <button className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-lg font-medium transition-colors">
               Start Reading
             </button>
             <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors backdrop-blur-sm">
               Write Your Own
             </button>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-brand-900/50 to-transparent pointer-events-none"></div>
      </div>

      {/* Filter/Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
          <TrendingUp className="text-brand-600" size={24} />
          Trending Now
        </h2>
        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Search titles..." 
            className="w-full pl-10 pr-4 py-2 rounded-full border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          />
          <Search className="absolute left-3 top-2.5 text-stone-400" size={18} />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {novels.map(novel => (
          <Link key={novel.id} to={`/novel/${novel.id}`} className="group">
            <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col">
              <div className="aspect-[2/3] relative overflow-hidden bg-stone-200">
                <img 
                  src={novel.coverUrl} 
                  alt={novel.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded">
                  {novel.genre}
                </div>
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-serif font-bold text-lg text-stone-900 leading-snug mb-1 group-hover:text-brand-600 transition-colors">
                  {novel.title}
                </h3>
                <p className="text-stone-500 text-sm line-clamp-2 mb-4 flex-grow">
                  {novel.description}
                </p>
                <div className="flex items-center justify-between text-xs text-stone-400 pt-3 border-t border-stone-100">
                   <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>Updated {new Date(novel.updatedAt).toLocaleDateString()}</span>
                   </div>
                   <span className={`px-2 py-0.5 rounded-full ${novel.status === 'ONGOING' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                     {novel.status}
                   </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;