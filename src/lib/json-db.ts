import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const IDEAS_FILE = path.join(DATA_DIR, 'ideas.json');
const BOOKMARKS_FILE = path.join(DATA_DIR, 'bookmarks.json');
const PROFILES_FILE = path.join(DATA_DIR, 'profiles.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize files if they don't exist
if (!fs.existsSync(IDEAS_FILE)) {
  fs.writeFileSync(IDEAS_FILE, JSON.stringify([]), 'utf8');
}
if (!fs.existsSync(BOOKMARKS_FILE)) {
  fs.writeFileSync(BOOKMARKS_FILE, JSON.stringify([]), 'utf8');
}
if (!fs.existsSync(PROFILES_FILE)) {
  fs.writeFileSync(PROFILES_FILE, JSON.stringify([]), 'utf8');
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  slug: string;
  url?: string;
  isIdeaOfTheDay?: boolean;
  marketScore?: number;
  difficulty?: number;
  buildType?: string;
  tags?: string[];
  createdAt?: string;
}

export interface Bookmark {
  id: string;
  ideaId: string;
  userId: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  skills?: string[];
  experience?: string;
  interests?: string[];
  createdAt: string;
}

// Ideas CRUD
export function getAllIdeas(): Idea[] {
  const data = fs.readFileSync(IDEAS_FILE, 'utf8');
  return JSON.parse(data);
}

export function getIdeaBySlug(slug: string): Idea | undefined {
  const ideas = getAllIdeas();
  return ideas.find((idea) => idea.slug === slug);
}

export function getIdeaById(id: string): Idea | undefined {
  const ideas = getAllIdeas();
  return ideas.find((idea) => idea.id === id);
}

export function createIdea(idea: Omit<Idea, 'id' | 'createdAt'>): Idea {
  const ideas = getAllIdeas();
  const newIdea: Idea = {
    ...idea,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  ideas.push(newIdea);
  fs.writeFileSync(IDEAS_FILE, JSON.stringify(ideas, null, 2), 'utf8');
  return newIdea;
}

export function updateIdea(id: string, updates: Partial<Idea>): Idea | null {
  const ideas = getAllIdeas();
  const index = ideas.findIndex((idea) => idea.id === id);

  if (index === -1) return null;

  ideas[index] = { ...ideas[index], ...updates };
  fs.writeFileSync(IDEAS_FILE, JSON.stringify(ideas, null, 2), 'utf8');
  return ideas[index];
}

// Bookmarks CRUD
export function getAllBookmarks(): Bookmark[] {
  const data = fs.readFileSync(BOOKMARKS_FILE, 'utf8');
  return JSON.parse(data);
}

export function getBookmarksByUserId(userId: string): Bookmark[] {
  const bookmarks = getAllBookmarks();
  return bookmarks.filter((bookmark) => bookmark.userId === userId);
}

export function createBookmark(ideaId: string, userId: string): Bookmark {
  const bookmarks = getAllBookmarks();
  const newBookmark: Bookmark = {
    id: Date.now().toString(),
    ideaId,
    userId,
    createdAt: new Date().toISOString(),
  };
  bookmarks.push(newBookmark);
  fs.writeFileSync(BOOKMARKS_FILE, JSON.stringify(bookmarks, null, 2), 'utf8');
  return newBookmark;
}

export function deleteBookmark(id: string): boolean {
  const bookmarks = getAllBookmarks();
  const filtered = bookmarks.filter((bookmark) => bookmark.id !== id);

  if (filtered.length === bookmarks.length) return false;

  fs.writeFileSync(BOOKMARKS_FILE, JSON.stringify(filtered, null, 2), 'utf8');
  return true;
}

// Profiles CRUD
export function getAllProfiles(): Profile[] {
  const data = fs.readFileSync(PROFILES_FILE, 'utf8');
  return JSON.parse(data);
}

export function getProfileById(id: string): Profile | undefined {
  const profiles = getAllProfiles();
  return profiles.find((profile) => profile.id === id);
}

export function createProfile(profile: Omit<Profile, 'id' | 'createdAt'>): Profile {
  const profiles = getAllProfiles();
  const newProfile: Profile = {
    ...profile,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  profiles.push(newProfile);
  fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2), 'utf8');
  return newProfile;
}

export function updateProfile(id: string, updates: Partial<Profile>): Profile | null {
  const profiles = getAllProfiles();
  const index = profiles.findIndex((profile) => profile.id === id);

  if (index === -1) return null;

  profiles[index] = { ...profiles[index], ...updates };
  fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2), 'utf8');
  return profiles[index];
}
