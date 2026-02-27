import { httpClient } from '../utils/httpClient';
import { MangaExtractor } from '../extractors/mangaExtractor';
import { ChapterExtractor } from '../extractors/chapterExtractor';
import { logger } from '../utils/logger';
import { config } from '../config/config';
import {
  HomepageData,
  MangaDetails,
  ChapterPages,
  SearchResult,
  MangaCard,
  ChapterCard,
  NewsItem
} from '../types';

export class ScraperService {
  /**
   * Get homepage data
   */
  async getHomepage(): Promise<HomepageData> {
    logger.info('Fetching homepage');
    const $ = await httpClient.fetchPage('/');
    
    if (!$) {
      throw new Error('Failed to fetch homepage');
    }

    return {
      featuredChapters: this.parseFeaturedChapters($),
      newChapters: this.parseNewChapters($),
      trendingManga: this.parseTrendingManga($),
      latestNews: this.parseLatestNews($)
    };
  }

  /**
   * Parse featured chapters from homepage
   */
  private parseFeaturedChapters($: cheerio.CheerioAPI): ChapterCard[] {
    const chapters: ChapterCard[] = [];
    
    $('h4').each((_, elem) => {
      const text = $(elem).text();
      if (text.includes('Featured')) {
        const container = $(elem).next();
        const extracted = ChapterExtractor.extractChapterCards($, container.find('a[href*="/chapters/"]'));
        chapters.push(...extracted);
      }
    });

    return chapters;
  }

  /**
   * Parse new chapters from homepage
   */
  private parseNewChapters($: cheerio.CheerioAPI): ChapterCard[] {
    const chapters: ChapterCard[] = [];
    
    $('h4').each((_, elem) => {
      const text = $(elem).text();
      if (text.includes('New Chapters')) {
        const container = $(elem).next();
        const extracted = ChapterExtractor.extractChapterCards($, container.find('a[href*="/chapters/"]'));
        chapters.push(...extracted);
      }
    });

    return chapters;
  }

  /**
   * Parse trending manga from homepage
   */
  private parseTrendingManga($: cheerio.CheerioAPI): MangaCard[] {
    const manga: MangaCard[] = [];
    
    $('h4').each((_, elem) => {
      const text = $(elem).text();
      if (text.includes('Trending')) {
        const container = $(elem).next();
        const extracted = MangaExtractor.extractMangaCards($, container.find('a[href*="/manga/"]'));
        manga.push(...extracted);
      }
    });

    return manga;
  }

  /**
   * Parse latest news from homepage
   */
  private parseLatestNews($: cheerio.CheerioAPI): NewsItem[] {
    const news: NewsItem[] = [];
    
    $('h4').each((_, elem) => {
      const text = $(elem).text();
      if (text.includes('Latest News')) {
        const container = $(elem).next();
        container.find('a[href*="/news/"]').each((_, newsElem) => {
          const $news = $(newsElem);
          news.push({
            title: $news.text().trim(),
            url: config.baseURL + $news.attr('href')
          });
        });
      }
    });

    return news;
  }

  /**
   * Get manga details by ID
   */
  async getMangaDetails(mangaId: string): Promise<MangaDetails | null> {
    logger.info(`Fetching manga details for ID: ${mangaId}`);
    const url = `/manga/${mangaId}`;
    const $ = await httpClient.fetchPage(url);
    
    if (!$) return null;

    try {
      // Extract basic info
      const title = $('h1').first().text().trim();
      if (!title) return null;

      const alternativeTitles = MangaExtractor.extractAlternativeTitles($);
      const imageUrl = MangaExtractor.extractCoverImage($, title);
      const description = MangaExtractor.extractDescription($);
      const genres = MangaExtractor.extractGenres($);

      // Extract metadata
      const type = MangaExtractor.extractMetadata($, 'Type');
      const year = MangaExtractor.extractMetadata($, 'Year');
      const status = MangaExtractor.extractMetadata($, 'Status');
      const rating = MangaExtractor.extractMetadata($, 'Rating');
      const author = MangaExtractor.extractListMetadata($, 'Author');
      const artist = MangaExtractor.extractListMetadata($, 'Artist');

      // Extract chapters
      const chapters = ChapterExtractor.extractChapterList($);

      return {
        id: mangaId,
        title,
        alternativeTitles: alternativeTitles.length > 0 ? alternativeTitles : undefined,
        imageUrl,
        description,
        type,
        year,
        status,
        author: author.length > 0 ? author : undefined,
        artist: artist.length > 0 ? artist : undefined,
        genres: genres.length > 0 ? genres : undefined,
        rating,
        chapters
      };
    } catch (error) {
      logger.error(`Error parsing manga details for ID ${mangaId}:`, error);
      return null;
    }
  }

  /**
   * Get chapter pages and images
   */
  async getChapterPages(chapterId: string): Promise<ChapterPages | null> {
    logger.info(`Fetching chapter pages for ID: ${chapterId}`);
    const url = `/chapters/${chapterId}`;
    const $ = await httpClient.fetchPage(url);
    
    if (!$) return null;

    try {
      // Get manga info
      const mangaLink = $('a[href*="/manga/"]').first();
      const mangaTitle = mangaLink.text().trim();
      const mangaUrl = config.baseURL + mangaLink.attr('href');

      // Get chapter info
      const chapterTitle = ChapterExtractor.extractChapterTitle($);
      const chapterMatch = chapterTitle?.match(/chapter\s*(\d+(?:\.\d+)?)/i);
      const chapterNumber = chapterMatch ? chapterMatch[1] : chapterId.split('-').pop() || 'Unknown';

      // Get navigation
      const navigation = ChapterExtractor.extractNavigation($);

      // Get pages
      const pages = ChapterExtractor.extractPages($);

      return {
        chapterId,
        chapterNumber,
        chapterTitle,
        mangaTitle,
        mangaUrl,
        pages,
        previousChapter: navigation.prev,
        nextChapter: navigation.next
      };
    } catch (error) {
      logger.error(`Error parsing chapter pages for ID ${chapterId}:`, error);
      return null;
    }
  }

  /**
   * Search for manga
   */
  async search(query: string, page: number = 1): Promise<SearchResult> {
    logger.info(`Searching for: ${query} (page ${page})`);
    const url = `/search?q=${encodeURIComponent(query)}&page=${page}`;
    const $ = await httpClient.fetchPage(url);
    
    if (!$) {
      throw new Error('Failed to perform search');
    }

    const results = MangaExtractor.extractMangaCards($);
    
    // Try to get pagination info
    const totalResults = parseInt($('.total-results, .result-count').text().match(/\d+/)?.[0] || '0');
    const totalPages = parseInt($('.pagination a').last().text() || '1');

    return {
      results,
      totalResults: totalResults || undefined,
      currentPage: page,
      totalPages: totalPages || undefined
    };
  }

  /**
   * Get new manga
   */
  async getNewManga(page: number = 1): Promise<SearchResult> {
    logger.info(`Fetching new manga (page ${page})`);
    const url = `/mangas/new?page=${page}`;
    const $ = await httpClient.fetchPage(url);
    
    if (!$) {
      throw new Error('Failed to fetch new manga');
    }

    const results = MangaExtractor.extractMangaCards($);
    const totalPages = parseInt($('.pagination a').last().text() || '1');

    return {
      results,
      currentPage: page,
      totalPages: totalPages || undefined
    };
  }

  /**
   * Get recent chapters
   */
  async getRecentChapters(page: number = 1): Promise<ChapterCard[]> {
    logger.info(`Fetching recent chapters (page ${page})`);
    const url = `/chapters?page=${page}`;
    const $ = await httpClient.fetchPage(url);
    
    if (!$) {
      throw new Error('Failed to fetch recent chapters');
    }

    return ChapterExtractor.extractChapterCards($);
  }

  /**
   * Search by genre
   */
  async searchByGenre(genre: string, page: number = 1): Promise<SearchResult> {
    logger.info(`Searching by genre: ${genre} (page ${page})`);
    const url = `/search?genre=${encodeURIComponent(genre)}&page=${page}`;
    const $ = await httpClient.fetchPage(url);
    
    if (!$) {
      throw new Error('Failed to search by genre');
    }

    const results = MangaExtractor.extractMangaCards($);
    const totalPages = parseInt($('.pagination a').last().text() || '1');

    return {
      results,
      currentPage: page,
      totalPages: totalPages || undefined
    };
  }

  /**
   * Get random manga
   */
  async getRandomManga(): Promise<MangaCard | null> {
    logger.info('Fetching random manga');
    const url = '/mangas/random';
    const $ = await httpClient.fetchPage(url, false); // Don't cache random
    
    if (!$) return null;

    const mangaLink = $('a[href*="/manga/"]').first();
    if (!mangaLink.length) return null;

    return MangaExtractor.extractMangaCard($, mangaLink);
  }

  /**
   * Advanced search with filters
   */
  async advancedSearch(params: {
    query?: string;
    genres?: string[];
    type?: string;
    status?: string;
    year?: string;
    page?: number;
  }): Promise<SearchResult> {
    logger.info('Performing advanced search', params);
    
    const searchParams = new URLSearchParams();
    
    if (params.query) searchParams.append('q', params.query);
    if (params.genres) params.genres.forEach(g => searchParams.append('genre', g));
    if (params.type) searchParams.append('type', params.type);
    if (params.status) searchParams.append('status', params.status);
    if (params.year) searchParams.append('year', params.year);
    searchParams.append('page', (params.page || 1).toString());

    const url = `/search?${searchParams.toString()}`;
    const $ = await httpClient.fetchPage(url);
    
    if (!$) {
      throw new Error('Failed to perform advanced search');
    }

    const results = MangaExtractor.extractMangaCards($);
    const totalPages = parseInt($('.pagination a').last().text() || '1');

    return {
      results,
      currentPage: params.page || 1,
      totalPages: totalPages || undefined
    };
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return httpClient.getCacheStats();
  }

  /**
   * Clear cache
   */
  clearCache() {
    httpClient.clearCache();
    logger.info('Cache cleared');
  }
}

// Export singleton instance
export const scraperService = new ScraperService();
