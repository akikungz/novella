import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MockService } from '../services/mockData';
import { GeminiService } from '../services/geminiService';
import { Novel, Chapter } from '../types';
import { Save, Sparkles, ChevronLeft, Plus, Trash2, FileText, CornerDownRight } from 'lucide-react';

const ChapterEditor: React.FC = () => {
  const { novelId, chapterId } = useParams<{ novelId: string; chapterId: string }>();
  const navigate = useNavigate();

  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  
  // Editor State
  const [activeChapterId, setActiveChapterId] = useState<string | null>(chapterId || null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editParentId, setEditParentId] = useState<string | null>(null);
  
  const [saving, setSaving] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  useEffect(() => {
    if (!novelId) return;
    MockService.getNovelById(novelId).then(n => setNovel(n || null));
    refreshChapters();
  }, [novelId]);

  useEffect(() => {
    if (activeChapterId && chapters.length > 0) {
      const ch = chapters.find(c => c.id === activeChapterId);
      if (ch) {
        setEditTitle(ch.title);
        setEditContent(ch.content);
        setEditParentId(ch.parentId || null);
      }
    } else if (activeChapterId === 'new') {
        setEditTitle('');
        setEditContent('');
        setEditParentId(null);
    }
  }, [activeChapterId, chapters]);

  const refreshChapters = async () => {
    if (!novelId) return;
    const c = await MockService.getChaptersByNovelId(novelId);
    setChapters(c);
  };

  const handleSave = async () => {
    if (!novelId || !editTitle) return;
    setSaving(true);
    
    const chapterData = {
      novelId,
      title: editTitle,
      content: editContent,
      parentId: editParentId,
      orderIndex: chapters.length, // simplistic ordering
      isPublished: true // simplistic publish
    };

    if (activeChapterId && activeChapterId !== 'new') {
      await MockService.saveChapter({ ...chapterData, id: activeChapterId } as Chapter);
    } else {
      const newCh = await MockService.saveChapter(chapterData as any);
      setActiveChapterId(newCh.id);
      navigate(`/author/novel/${novelId}/chapter/${newCh.id}`, { replace: true });
    }
    
    await refreshChapters();
    setSaving(false);
  };

  const handleAiContinue = async () => {
    if (!novel) return;
    setAiGenerating(true);
    try {
      const continuation = await GeminiService.continueStory(editContent, novel.title);
      setEditContent(prev => prev + (prev ? '\n\n' : '') + continuation);
    } catch (e) {
      alert("AI Generation failed.");
    }
    setAiGenerating(false);
  };

  const createNewChapter = () => {
    setActiveChapterId('new');
    setEditTitle('');
    setEditContent('');
    setEditParentId(null);
    navigate(`/author/novel/${novelId}/chapter/new`);
  };
  
  const createSubChapter = (parentId: string) => {
    setActiveChapterId('new');
    setEditTitle('');
    setEditContent('');
    setEditParentId(parentId);
    // In a real app we'd probably want a more specific URL for creating subchapters or handle state better
  };

  // Helper to render sidebar list
  const renderSidebar = () => {
    const rootChapters = chapters.filter(c => !c.parentId);
    return (
        <div className="space-y-1">
            {rootChapters.map(c => (
                <div key={c.id}>
                    <button 
                        onClick={() => { setActiveChapterId(c.id); navigate(`/author/novel/${novelId}/chapter/${c.id}`); }}
                        className={`w-full text-left px-3 py-2 rounded flex items-center justify-between text-sm ${activeChapterId === c.id ? 'bg-brand-100 text-brand-900 font-medium' : 'hover:bg-stone-100 text-stone-700'}`}
                    >
                        <span className="truncate">{c.title}</span>
                        <button 
                           onClick={(e) => { e.stopPropagation(); createSubChapter(c.id); }}
                           className="p-1 hover:bg-stone-200 rounded text-stone-400 hover:text-stone-600"
                           title="Add Sub-chapter"
                        >
                            <Plus size={12} />
                        </button>
                    </button>
                    {/* Render Children */}
                    {chapters.filter(sub => sub.parentId === c.id).map(sub => (
                        <button 
                            key={sub.id}
                            onClick={() => { setActiveChapterId(sub.id); navigate(`/author/novel/${novelId}/chapter/${sub.id}`); }}
                            className={`w-full text-left pl-8 pr-3 py-1.5 rounded flex items-center gap-2 text-xs ${activeChapterId === sub.id ? 'bg-brand-50 text-brand-800' : 'hover:bg-stone-100 text-stone-500'}`}
                        >
                            <CornerDownRight size={10} />
                            <span className="truncate">{sub.title}</span>
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
  };

  if (!novel) return <div className="p-8">Loading...</div>;

  return (
    <div className="h-[calc(100vh-64px)] flex overflow-hidden bg-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-stone-200 flex flex-col bg-stone-50">
        <div className="p-4 border-b border-stone-200 bg-white">
          <button onClick={() => navigate('/author')} className="flex items-center text-stone-500 hover:text-brand-600 mb-4 text-sm">
            <ChevronLeft size={16} /> Back to Dashboard
          </button>
          <h2 className="font-bold text-stone-900 truncate" title={novel.title}>{novel.title}</h2>
          <p className="text-xs text-stone-500">{chapters.length} segments</p>
        </div>
        
        <div className="flex-grow overflow-y-auto p-2 no-scrollbar">
           {renderSidebar()}
        </div>

        <div className="p-4 border-t border-stone-200 bg-white">
          <button 
            onClick={createNewChapter}
            className="w-full flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-900 text-white py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} /> New Chapter
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-grow flex flex-col h-full overflow-hidden">
         {/* Toolbar */}
         <div className="h-14 border-b border-stone-200 flex items-center justify-between px-6 bg-white shrink-0">
            <div className="flex items-center gap-2 text-sm text-stone-500">
                {editParentId && <span className="bg-stone-100 px-2 py-0.5 rounded text-xs uppercase font-bold tracking-wider">Sub-chapter</span>}
                <span>{activeChapterId === 'new' ? 'Unsaved Draft' : 'Editing'}</span>
            </div>
            <div className="flex items-center gap-3">
               <button 
                 onClick={handleAiContinue}
                 disabled={aiGenerating}
                 className="flex items-center gap-2 text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
               >
                 {aiGenerating ? <span className="animate-spin">✨</span> : <Sparkles size={16} />}
                 AI Continue
               </button>
               <button 
                 onClick={handleSave}
                 disabled={saving}
                 className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-1.5 rounded-lg transition-colors text-sm font-medium shadow-sm"
               >
                 <Save size={16} />
                 {saving ? 'Saving...' : 'Save'}
               </button>
            </div>
         </div>

         {/* Editor Inputs */}
         <div className="flex-grow overflow-y-auto p-8 sm:p-12 bg-[#fcfbf9]">
            <div className="max-w-3xl mx-auto space-y-6">
               <input 
                 value={editTitle}
                 onChange={(e) => setEditTitle(e.target.value)}
                 placeholder="Chapter Title"
                 className="w-full text-3xl sm:text-4xl font-serif font-bold bg-transparent border-none placeholder-stone-300 focus:ring-0 text-stone-900 p-0"
               />
               <textarea 
                 value={editContent}
                 onChange={(e) => setEditContent(e.target.value)}
                 placeholder="Start writing your story here..."
                 className="w-full h-[60vh] resize-none bg-transparent border-none text-lg leading-loose font-serif text-stone-800 placeholder-stone-300 focus:ring-0 p-0"
               />
            </div>
         </div>
      </div>
    </div>
  );
};

export default ChapterEditor;