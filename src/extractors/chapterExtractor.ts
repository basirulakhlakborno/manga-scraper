import * as cheerio from 'cheerio';
import { ChapterCard, ChapterInfo, PageInfo } from '../types';
import { config } from '../config/config';

export class ChapterExtractor {
  /**
   * Extract chapter card information
   */
  static extractChapterCard($: cheerio.CheerioAPI, elem: cheerio.Cheerio<cheerio.Element>): ChapterCard | null {
    try {
      const href = elem.attr('href');
      if (!href || !href.includes('/chapters/')) return null;

      // Extract chapter number from URL
      const chapterMatch = href.match(/chapter-(\d+(?:\.\d+)?)/i);
      const chapterNumber = chapterMatch ? chapterMatch[1] : 'Unknown';

      // Find manga link within or near the element
      let mangaLink = elem.find('a[href*="/manga/"]').first();
      if (!mangaLink.length) {
        mangaLink = elem.siblings('a[href*="/manga/"]').first();
      }
      if (!mangaLink.length) {
        mangaLink = elem.parent().find('a[href*="/manga/"]').first();
      }

      const mangaName = mangaLink.text().trim() || elem.find('div, span').first().text().trim() || 'Unknown';
      const mangaHref = mangaLink.attr('href');
      const mangaUrl = mangaHref ? config.baseURL + mangaHref : undefined;

      // Extract manga ID
      const mangaId = mangaHref?.match(/\/manga\/(\d+)\//)?.[1];

      // Get image
      const img = elem.find('img');
      const imageUrl = img.attr('src') || img.attr('data-src');

      // Get release date
      const dateElem = elem.find('time, .date, .release-date');
      let releaseDate = dateElem.text().trim();
      
      if (!releaseDate) {
        releaseDate = elem.next('time, .date, span').text().trim();
      }
      
      // Extract date in YYYY-MM-DD format
      const dateMatch = releaseDate.match(/\d{4}-\d{2}-\d{2}/);
      releaseDate = dateMatch ? dateMatch[0] : undefined;

      // Get chapter title
      const fullText = elem.text().trim();
      const chapterTitle = fullText.replace(mangaName, '').replace(/chapter\s*\d+/i, '').trim();

      return {
        chapterNumber,
        chapterUrl: config.baseURL + href,
        chapterTitle: chapterTitle || undefined,
        mangaName,
        mangaId,
        mangaUrl,
        imageUrl,
        releaseDate
      };
    } catch (error) {
      console.error('Error extracting chapter card:', error);
      return null;
    }
  }

  /**
   * Extract multiple chapter cards
   */
  static extractChapterCards($: cheerio.CheerioAPI, selector: string = 'a[href*="/chapters/"]'): ChapterCard[] {
    const cards: ChapterCard[] = [];
    
    $(selector).each((_, elem) => {
      const card = this.extractChapterCard($, $(elem));
      if (card) {
        cards.push(card);
      }
    });

    return cards;
  }

  /**
   * Extract chapter info from manga page
   */
  static extractChapterInfo($: cheerio.CheerioAPI, elem: cheerio.Cheerio<cheerio.Element>): ChapterInfo | null {
    try {
      const href = elem.attr('href');
      if (!href) return null;

      const chapterMatch = href.match(/chapter-(\d+(?:\.\d+)?)/i);
      const chapterNumber = chapterMatch ? chapterMatch[1] : 'Unknown';

      const chapterTitle = elem.text().trim();
      
      const dateElem = elem.find('time, .date');
      const releaseDate = dateElem.text().trim() || elem.next('time, .date').text().trim();

      return {
        chapterNumber,
        chapterTitle: chapterTitle || undefined,
        chapterUrl: config.baseURL + href,
        releaseDate: releaseDate || undefined
      };
    } catch (error) {
      console.error('Error extracting chapter info:', error);
      return null;
    }
  }

  /**
   * Extract chapter list from manga detail page
   */
  static extractChapterList($: cheerio.CheerioAPI): ChapterInfo[] {
    const chapters: ChapterInfo[] = [];

    $('a[href*="/chapters/"]').each((_, elem) => {
      const chapter = this.extractChapterInfo($, $(elem));
      if (chapter) {
        chapters.push(chapter);
      }
    });

    return chapters;
  }

  /**
   * Extract page images from chapter reader
   */
  static extractPages($: cheerio.CheerioAPI): PageInfo[] {
    const pages: PageInfo[] = [];

    // Method 1: Direct image elements
    $('img[src*="cdn"], .reader img, #chapter-container img, picture img, .page-img').each((index, elem) => {
      const src = $(elem).attr('src') || $(elem).attr('data-src');
      if (src && !src.includes('logo') && !src.includes('icon') && !src.includes('avatar')) {
        pages.push({
          pageNumber: pages.length + 1,
          imageUrl: src.startsWith('http') ? src : config.baseURL + src
        });
      }
    });

    // Method 2: Check for JavaScript image array
    if (pages.length === 0) {
      const scripts = $('script').toArray();
      for (const script of scripts) {
        const scriptContent = $(script).html() || '';
        
        // Try different patterns
        const patterns = [
          /images\s*=\s*(\[.+?\])/s,
          /pages\s*=\s*(\[.+?\])/s,
          /chapter_images\s*=\s*(\[.+?\])/s
        ];

        for (const pattern of patterns) {
          const match = scriptContent.match(pattern);
          if (match) {
            try {
              const images = JSON.parse(match[1]);
              images.forEach((img: string, index: number) => {
                pages.push({
                  pageNumber: index + 1,
                  imageUrl: img.startsWith('http') ? img : config.baseURL + img
                });
              });
              break;
            } catch (e) {
              console.error('Error parsing image array:', e);
            }
          }
        }

        if (pages.length > 0) break;
      }
    }

    return pages;
  }

  /**
   * Extract chapter navigation (prev/next)
   */
  static extractNavigation($: cheerio.CheerioAPI): { prev?: string; next?: string } {
    const prevLink = $('a:contains("Previous"), a:contains("Prev"), a.prev-chapter, .prev-link').attr('href');
    const nextLink = $('a:contains("Next"), a.next-chapter, .next-link').attr('href');

    return {
      prev: prevLink ? config.baseURL + prevLink : undefined,
      next: nextLink ? config.baseURL + nextLink : undefined
    };
  }

  /**
   * Extract chapter title
   */
  static extractChapterTitle($: cheerio.CheerioAPI): string | undefined {
    const selectors = [
      'h1',
      '.chapter-title',
      '.reader-title',
      'title'
    ];

    for (const selector of selectors) {
      const title = $(selector).first().text().trim();
      if (title) return title;
    }

    return undefined;
  }
}
