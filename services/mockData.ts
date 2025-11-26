import { Chapter, Novel, NovelStatus, User, UserRole } from '../types';

// Initial Mock Data
const USERS: User[] = [
  {
    id: 'u1',
    username: 'DemoAuthor',
    email: 'author@novella.com',
    role: UserRole.AUTHOR,
    bio: 'Writes sci-fi and fantasy.',
    avatarUrl: 'https://picsum.photos/id/1005/200/200'
  },
  {
    id: 'u2',
    username: 'BookWorm',
    email: 'reader@novella.com',
    role: UserRole.READER,
    avatarUrl: 'https://picsum.photos/id/1011/200/200'
  }
];

const NOVELS: Novel[] = [
  {
    id: 'n1',
    authorId: 'u1',
    title: 'The Last Starship',
    description: 'In a galaxy where silence is the only law, one pilot dares to turn on the radio.',
    genre: 'Sci-Fi',
    status: NovelStatus.ONGOING,
    coverUrl: 'https://picsum.photos/id/452/600/900',
    createdAt: Date.now() - 10000000,
    updatedAt: Date.now()
  },
  {
    id: 'n2',
    authorId: 'u1',
    title: 'Echoes of the Forest',
    description: 'The trees whisper secrets of the past, but only the lost can hear them.',
    genre: 'Fantasy',
    status: NovelStatus.COMPLETED,
    coverUrl: 'https://picsum.photos/id/1044/600/900',
    createdAt: Date.now() - 50000000,
    updatedAt: Date.now() - 1000000
  }
];

const CHAPTERS: Chapter[] = [
  {
    id: 'c1',
    novelId: 'n1',
    title: 'Chapter 1: Ignition',
    content: `The engine hummed with a vibration that rattled Kael's teeth. It wasn't the clean, synthetic purr of modern craft; this was the growl of something old, something illegal. 

"Systems check," he muttered, flipping toggles that felt satisfyingly mechanical.

The display flickered to life, bathing the cockpit in an amber glow. Outside, the hangar bay was dark, the only light coming from the distant stars visible through the force field. He took a deep breath. This was it. The moment he'd been planning for three years.

He pushed the throttle forward. The ship lurched, not smoothly, but with the eagerness of a chained beast released.`,
    orderIndex: 0,
    isPublished: true,
    createdAt: Date.now() - 10000000,
    updatedAt: Date.now() - 10000000
  },
  {
    id: 'c2',
    novelId: 'n1',
    title: 'Chapter 2: The Void',
    content: `Silence. Absolute silence. That was the first thing they taught you about space, but experiencing it was different. Even the ship seemed to hold its breath.

Kael floated in zero-G, looking out the viewport. The nebula ahead was a bruise on the face of the universe, purple and black.`,
    orderIndex: 1,
    isPublished: true,
    createdAt: Date.now() - 9000000,
    updatedAt: Date.now() - 9000000
  },
  {
    id: 'c2-1',
    novelId: 'n1',
    parentId: 'c2',
    title: 'Part A: The Signal',
    content: `A blip on the radar. Small, rhythmic. It shouldn't be there. No one came this far out into the Rim.

Kael adjusted the frequency scanner. "Hello?" he whispered into the comms, breaking the one law that mattered.`,
    orderIndex: 0,
    isPublished: true,
    createdAt: Date.now() - 8500000,
    updatedAt: Date.now() - 8500000
  }
];

// Helper to simulate async operations
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const MockService = {
  getNovels: async (): Promise<Novel[]> => {
    await delay(300);
    return [...NOVELS].sort((a, b) => b.updatedAt - a.updatedAt);
  },

  getNovelById: async (id: string): Promise<Novel | undefined> => {
    await delay(200);
    return NOVELS.find(n => n.id === id);
  },

  getChaptersByNovelId: async (novelId: string): Promise<Chapter[]> => {
    await delay(200);
    return CHAPTERS.filter(c => c.novelId === novelId).sort((a, b) => {
      // Sort by parent order, then sub-chapter order
      // This is a simplified sort; in production, you'd do a tree traversal or recursive sort
      return a.orderIndex - b.orderIndex;
    });
  },

  getChapterById: async (id: string): Promise<Chapter | undefined> => {
    await delay(100);
    return CHAPTERS.find(c => c.id === id);
  },

  getUser: async (id: string): Promise<User | undefined> => {
    await delay(100);
    return USERS.find(u => u.id === id);
  },

  // Author Actions
  createNovel: async (novel: Omit<Novel, 'id' | 'createdAt' | 'updatedAt'>): Promise<Novel> => {
    await delay(500);
    const newNovel: Novel = {
      ...novel,
      id: `n${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    NOVELS.push(newNovel);
    return newNovel;
  },

  updateNovel: async (novel: Novel): Promise<void> => {
    await delay(300);
    const index = NOVELS.findIndex(n => n.id === novel.id);
    if (index !== -1) {
      NOVELS[index] = { ...novel, updatedAt: Date.now() };
    }
  },

  saveChapter: async (chapter: Omit<Chapter, 'id' | 'createdAt' | 'updatedAt'> | Chapter): Promise<Chapter> => {
    await delay(400);
    if ('id' in chapter) {
      // Update
      const index = CHAPTERS.findIndex(c => c.id === chapter.id);
      if (index !== -1) {
        CHAPTERS[index] = { ...chapter as Chapter, updatedAt: Date.now() };
        return CHAPTERS[index];
      }
    }
    // Create
    const newChapter: Chapter = {
      ...chapter,
      id: `c${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    } as Chapter;
    CHAPTERS.push(newChapter);
    
    // Update Novel timestamp
    const novelIdx = NOVELS.findIndex(n => n.id === chapter.novelId);
    if (novelIdx !== -1) {
      NOVELS[novelIdx].updatedAt = Date.now();
    }
    
    return newChapter;
  },

  deleteChapter: async (id: string): Promise<void> => {
    await delay(300);
    const index = CHAPTERS.findIndex(c => c.id === id);
    if (index !== -1) CHAPTERS.splice(index, 1);
  }
};