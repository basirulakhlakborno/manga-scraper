// Type definitions for MangaPill API

export interface MangaCard {
  id: string;
  title: string;
  url: string;
  imageUrl?: string;
  type?: string;
  year?: string;
  status?: string;
}

export interface ChapterCard {
  chapterNumber: string;
  chapterUrl: string;
  chapterTitle?: string;
  mangaName: string;
  mangaId?: string;
  mangaUrl?: string;
  imageUrl?: string;
  releaseDate?: string;
}

export interface MangaDetails {
  id: string;
  title: string;
  alternativeTitles?: string[];
  imageUrl?: string;
  description?: string;
  type?: string;
  year?: string;
  status?: string;
  author?: string[];
  artist?: string[];
  genres?: string[];
  rating?: string;
  chapters: ChapterInfo[];
}

export interface ChapterInfo {
  chapterNumber: string;
  chapterTitle?: string;
  chapterUrl: string;
  releaseDate?: string;
}

export interface ChapterPages {
  chapterId: string;
  chapterNumber: string;
  chapterTitle?: string;
  mangaTitle: string;
  mangaUrl: string;
  pages: PageInfo[];
  previousChapter?: string;
  nextChapter?: string;
}

export interface PageInfo {
  pageNumber: number;
  imageUrl: string;
}

export interface SearchResult {
  results: MangaCard[];
  totalResults?: number;
  currentPage: number;
  totalPages?: number;
}

export interface HomepageData {
  featuredChapters: ChapterCard[];
  newChapters: ChapterCard[];
  trendingManga: MangaCard[];
  latestNews: NewsItem[];
}

export interface NewsItem {
  title: string;
  url: string;
}

export interface CategoryData {
  category: string;
  manga: MangaCard[];
  currentPage: number;
  totalPages?: number;
}

export interface ScraperOptions {
  timeout?: number;
  retries?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
