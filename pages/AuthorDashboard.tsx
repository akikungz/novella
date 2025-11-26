import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MockService } from '../services/mockData';
import { Novel, NovelStatus } from '../types';
import { Plus, Edit2, Trash2, Book } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GeminiService } from '../services/geminiService';

const AuthorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [novels, setNovels] = useState<Novel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Novel Form State
  const [newTitle, setNewTitle] = useState('');
  const [newGenre, setNewGenre] = useState('Fantasy');
  const [newDesc, setNewDesc] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      MockService.getNovels().then(data => {
        // Filter for this author only
        setNovels(data.filter(n => n.authorId === user.id));
      });
    }
  }, [user]);

  const handleGenerateSynopsis = async () => {
    if (!newTitle) return alert("Please enter a title first");
    setGenerating(true);
    try {
      const synopsis = await GeminiService.generateSynopsis(newTitle, newGenre);
      setNewDesc(synopsis);
    } catch (e) {
      alert("Failed to generate synopsis.");
    }
    setGenerating(false);
  };

  const handleCreateNovel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const newNovel = await MockService.createNovel({
      authorId: user.id,
      title: newTitle,
      description: newDesc,
      genre: newGenre,
      status: NovelStatus.ONGOING,
      coverUrl: `https://picsum.photos/seed/${newTitle.replace(/\s/g, '')}/600/900`
    });
    
    setNovels([newNovel, ...novels]);
    setIsModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-stone-900">Author Dashboard</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm"
        >
          <Plus size={18} />
          Create Novel
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        {novels.length === 0 ? (
          <div className="p-12 text-center text-stone-500">
            <Book size={48} className="mx-auto mb-4 text-stone-300" />
            <p className="text-lg">You haven't written any novels yet.</p>
            <p className="text-sm">Click "Create Novel" to start your journey.</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {novels.map(novel => (
              <div key={novel.id} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-stone-50 transition-colors">
                <div className="w-24 h-36 bg-stone-200 rounded overflow-hidden flex-shrink-0">
                  <img src={novel.coverUrl} alt={novel.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-stone-900 mb-1">{novel.title}</h3>
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-wider bg-stone-100 px-2 py-0.5 rounded">
                        {novel.genre}
                      </span>
                    </div>
                    <div className="flex gap-2">
                       <Link 
                        to={`/author/novel/${novel.id}/chapter`}
                        className="text-brand-600 hover:bg-brand-50 p-2 rounded transition-colors"
                        title="Edit Chapters"
                       >
                         <Edit2 size={18} />
                       </Link>
                    </div>
                  </div>
                  <p className="mt-3 text-stone-600 text-sm line-clamp-2">{novel.description}</p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-stone-400">
                    <span>Status: {novel.status}</span>
                    <span>Last Updated: {new Date(novel.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Novel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-serif font-bold mb-6">Create New Novel</h2>
            <form onSubmit={handleCreateNovel} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
                <input 
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  placeholder="The Lost World"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Genre</label>
                <select 
                  value={newGenre}
                  onChange={e => setNewGenre(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option>Fantasy</option>
                  <option>Sci-Fi</option>
                  <option>Romance</option>
                  <option>Mystery</option>
                  <option>Horror</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Synopsis</label>
                <div className="relative">
                  <textarea 
                    required
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg p-2 h-32 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    placeholder="Describe your story..."
                  />
                  <button 
                    type="button"
                    onClick={handleGenerateSynopsis}
                    disabled={generating}
                    className="absolute bottom-2 right-2 text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded hover:bg-brand-200 transition-colors flex items-center gap-1"
                  >
                    {generating ? 'Generating...' : '✨ AI Generate'}
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                >
                  Create Novel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorDashboard;