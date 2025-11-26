import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MockService } from '../services/mockData';
import { Novel, Chapter, User } from '../types';
import { Book, User as UserIcon, Calendar, Share2, Bookmark, ChevronRight } from 'lucide-react';

const NovelDetail: React.FC = () => {
  const { novelId } = useParams<{ novelId: string }>();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!novelId) return;

    const fetchData = async () => {
      const n = await MockService.getNovelById(novelId);
      if (n) {
        setNovel(n);
        const [a, c] = await Promise.all([
          MockService.getUser(n.authorId),
          MockService.getChaptersByNovelId(n.id)
        ]);
        setAuthor(a || null);
        setChapters(c);
      }
      setLoading(false);
    };

    fetchData();
  }, [novelId]);

  if (loading || !novel) return <div className="p-10 text-center text-stone-400">Loading...</div>;

  // Organize chapters hierarchically
  const rootChapters = chapters.filter(c => !c.parentId);

  return (
    <div className="bg-white min-h-screen">
       {/* Banner/Header */}
       <div className="bg-stone-900 text-white py-12 px-4 sm:px-6 lg:px-8">
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
           <div className="w-full md:w-48 lg:w-64 flex-shrink-0">
             <img 
               src={novel.coverUrl} 
               alt={novel.title} 
               className="w-full rounded-lg shadow-2xl border-4 border-white/10"
             />
           </div>
           <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-3 mb-2 text-sm">
                <span className="bg-brand-600 text-white px-2 py-0.5 rounded font-medium">{novel.genre}</span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-300">{novel.status}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4">{novel.title}</h1>
              
              <div className="flex items-center gap-2 mb-6 text-stone-300">
                 <UserIcon size={16} />
                 <span className="font-medium hover:text-white cursor-pointer">{author?.username || 'Unknown Author'}</span>
                 <span className="mx-2">|</span>
                 <Calendar size={16} />
                 <span>Last updated {new Date(novel.updatedAt).toLocaleDateString()}</span>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                 <button className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-brand-900/30 transition-all transform hover:-translate-y-0.5">
                   Read First Chapter
                 </button>
                 <button className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors" title="Bookmark">
                   <Bookmark size={20} />
                 </button>
                 <button className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors" title="Share">
                   <Share2 size={20} />
                 </button>
              </div>
           </div>
         </div>
       </div>

       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                <Book className="text-brand-600" size={20} />
                Synopsis
              </h2>
              <p className="text-stone-600 leading-relaxed whitespace-pre-line text-lg">
                {novel.description}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-stone-900 mb-6 border-b border-stone-200 pb-2">
                Table of Contents ({chapters.length})
              </h2>
              
              <div className="space-y-3">
                {rootChapters.length === 0 ? (
                  <p className="text-stone-400 italic">No chapters published yet.</p>
                ) : (
                  rootChapters.map(chapter => {
                    const subChapters = chapters.filter(c => c.parentId === chapter.id);
                    return (
                      <div key={chapter.id} className="group">
                        <Link 
                          to={`/read/${novel.id}/${chapter.id}`}
                          className="flex items-center justify-between p-4 rounded-lg bg-stone-50 hover:bg-stone-100 border border-transparent hover:border-stone-200 transition-all"
                        >
                          <span className="font-serif font-medium text-stone-800 group-hover:text-brand-700">
                            {chapter.title}
                          </span>
                          <span className="text-xs text-stone-400">{new Date(chapter.createdAt).toLocaleDateString()}</span>
                        </Link>
                        
                        {/* Sub-chapters */}
                        {subChapters.length > 0 && (
                          <div className="ml-8 mt-2 space-y-2 border-l-2 border-stone-100 pl-4">
                             {subChapters.map(sub => (
                               <Link 
                                key={sub.id}
                                to={`/read/${novel.id}/${sub.id}`}
                                className="flex items-center gap-2 text-sm text-stone-600 hover:text-brand-600 py-1"
                               >
                                 <ChevronRight size={14} className="text-stone-300" />
                                 {sub.title}
                               </Link>
                             ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
             <div className="bg-stone-50 p-6 rounded-xl border border-stone-100">
               <h3 className="font-bold text-stone-900 mb-4">About the Author</h3>
               <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-stone-200 overflow-hidden flex-shrink-0">
                    {author?.avatarUrl ? <img src={author.avatarUrl} alt="" /> : null}
                  </div>
                  <div>
                    <div className="font-medium text-stone-900">{author?.username}</div>
                    <div className="text-xs text-stone-500">Joined 2023</div>
                  </div>
               </div>
               <p className="text-sm text-stone-600 mb-4">
                 {author?.bio || 'No bio available.'}
               </p>
             </div>
          </div>
       </div>
    </div>
  );
};

export default NovelDetail;