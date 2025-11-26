import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MockService } from '../services/mockData';
import { GeminiService } from '../services/geminiService';
import { Chapter, Novel } from '../types';
import { ArrowLeft, ArrowRight, Home, List, Sparkles } from 'lucide-react';

const Reader: React.FC = () => {
  const { novelId, chapterId } = useParams<{ novelId: string; chapterId: string }>();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [novel, setNovel] = useState<Novel | null>(null);
  const [allChapters, setAllChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  
  // AI Summary State
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Scroll progress
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!novelId || !chapterId) return;

    const loadData = async () => {
      setLoading(true);
      setSummary(null); // Reset summary on chapter change
      const [n, chs, c] = await Promise.all([
        MockService.getNovelById(novelId),
        MockService.getChaptersByNovelId(novelId),
        MockService.getChapterById(chapterId)
      ]);
      setNovel(n || null);
      setAllChapters(chs);
      setChapter(c || null);
      setLoading(false);
      window.scrollTo(0, 0);
    };
    loadData();
  }, [novelId, chapterId]);

  const handleSummarize = async () => {
    if (!chapter?.content) return;
    setLoadingSummary(true);
    try {
      const result = await GeminiService.summarizeChapter(chapter.content);
      setSummary(result);
    } catch (e) {
      alert("Failed to generate summary. Please try again.");
    }
    setLoadingSummary(false);
  };

  if (loading || !chapter || !novel) {
    return <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-400">Loading...</div>;
  }

  // Determine Nav Links
  // Flatten hierarchy for simpler prev/next logic
  // A robust implementation would walk the tree, but for this mock, we rely on the sorted list from service
  const currentIndex = allChapters.findIndex(c => c.id === chapter.id);
  const prevChapter = allChapters[currentIndex - 1];
  const nextChapter = allChapters[currentIndex + 1];

  return (
    <div className="bg-[#fcfbf9] min-h-screen text-stone-800">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-brand-600 z-50 transition-all duration-150" style={{ width: `${scrollProgress}%` }} />

      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-[#fcfbf9]/95 backdrop-blur border-b border-stone-200 px-4 h-14 flex items-center justify-between shadow-sm">
         <Link to={`/novel/${novel.id}`} className="flex items-center gap-2 text-stone-500 hover:text-brand-600 transition-colors">
            <ArrowLeft size={18} />
            <span className="hidden sm:inline font-medium text-sm truncate max-w-[200px]">{novel.title}</span>
         </Link>
         
         <div className="font-serif font-bold text-stone-800 text-sm sm:text-base truncate max-w-[150px] sm:max-w-md">
            {chapter.title}
         </div>

         <div className="flex items-center gap-2">
            <button 
              onClick={handleSummarize}
              className="text-stone-400 hover:text-brand-600 p-2 rounded-full hover:bg-stone-100 transition-colors"
              title="AI Summary"
            >
              <Sparkles size={18} />
            </button>
            <Link to={`/novel/${novel.id}`} className="text-stone-400 hover:text-brand-600 p-2 rounded-full hover:bg-stone-100 transition-colors">
               <List size={20} />
            </Link>
         </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-12 text-center text-stone-900 leading-tight">
          {chapter.title}
        </h1>

        {summary && (
          <div className="mb-12 p-6 bg-brand-50 border border-brand-100 rounded-xl">
             <div className="flex items-center gap-2 text-brand-800 font-bold mb-3 text-sm uppercase tracking-wide">
               <Sparkles size={16} /> AI Summary
             </div>
             <div className="prose prose-sm text-brand-900 leading-relaxed">
               {summary}
             </div>
          </div>
        )}

        {loadingSummary && (
          <div className="mb-12 p-6 bg-stone-50 border border-stone-100 rounded-xl animate-pulse">
            <div className="h-4 bg-stone-200 rounded w-1/4 mb-4"></div>
            <div className="h-3 bg-stone-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-stone-200 rounded w-5/6"></div>
          </div>
        )}

        <article className="prose prose-lg prose-stone font-serif mx-auto leading-loose text-stone-800 focus:outline-none">
          {/* Use whitespace-pre-wrap to preserve basic formatting from plain text, or render HTML if content is HTML */}
          <div className="whitespace-pre-wrap">
            {chapter.content}
          </div>
        </article>

        <div className="mt-20 pt-8 border-t border-stone-200 flex justify-between items-center">
          {prevChapter ? (
            <Link to={`/read/${novel.id}/${prevChapter.id}`} className="flex flex-col items-start group">
              <span className="text-xs text-stone-400 uppercase tracking-wider mb-1">Previous</span>
              <div className="flex items-center gap-2 text-stone-600 group-hover:text-brand-600 font-medium">
                <ArrowLeft size={16} />
                <span className="max-w-[120px] truncate">{prevChapter.title}</span>
              </div>
            </Link>
          ) : (
            <div></div>
          )}

          {nextChapter ? (
            <Link to={`/read/${novel.id}/${nextChapter.id}`} className="flex flex-col items-end group">
              <span className="text-xs text-stone-400 uppercase tracking-wider mb-1">Next</span>
              <div className="flex items-center gap-2 text-stone-600 group-hover:text-brand-600 font-medium">
                <span className="max-w-[120px] truncate">{nextChapter.title}</span>
                <ArrowRight size={16} />
              </div>
            </Link>
          ) : (
            <div className="text-stone-400 italic text-sm">End of Content</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Reader;