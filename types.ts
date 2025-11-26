export enum UserRole {
  GUEST = 'GUEST',
  READER = 'READER',
  AUTHOR = 'AUTHOR',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
}

export enum NovelStatus {
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  HIATUS = 'HIATUS'
}

export interface Novel {
  id: string;
  authorId: string;
  title: string;
  description: string;
  coverUrl: string;
  genre: string;
  status: NovelStatus;
  createdAt: number;
  updatedAt: number;
}

export interface Chapter {
  id: string;
  novelId: string;
  parentId?: string | null; // If null, it's a top-level chapter. If set, it's a sub-chapter.
  title: string;
  content: string;
  orderIndex: number;
  isPublished: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}