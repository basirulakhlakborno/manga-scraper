/**
 * MangaPill API Usage Examples
 * 
 * This file contains practical examples of how to use the MangaPill API
 * in different scenarios and with different libraries.
 */

// ============================================================================
// EXAMPLE 1: Using with Node.js and Axios
// ============================================================================

const axios = require('axios');

const API_BASE = 'http://localhost:3000';

async function example1_GetHomepage() {
  try {
    const response = await axios.get(`${API_BASE}/api/homepage`);
    
    if (response.data.success) {
      const { featuredChapters, newChapters, trendingManga } = response.data.data;
      
      console.log('Featured Chapters:', featuredChapters.length);
      console.log('New Chapters:', newChapters.length);
      console.log('Trending Manga:', trendingManga.length);
      
      // Display first featured chapter
      if (featuredChapters.length > 0) {
        const firstChapter = featuredChapters[0];
        console.log('\nFirst Featured Chapter:');
        console.log('- Manga:', firstChapter.mangaName);
        console.log('- Chapter:', firstChapter.chapterNumber);
        console.log('- URL:', firstChapter.chapterUrl);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// EXAMPLE 2: Search and Get Manga Details
// ============================================================================

async function example2_SearchAndGetDetails() {
  try {
    // Search for manga
    const searchResponse = await axios.get(`${API_BASE}/api/search`, {
      params: { q: 'one piece', page: 1 }
    });
    
    if (searchResponse.data.success && searchResponse.data.data.results.length > 0) {
      const firstResult = searchResponse.data.data.results[0];
      console.log('Found manga:', firstResult.title);
      
      // Get detailed information
      const detailsResponse = await axios.get(`${API_BASE}/api/manga/${firstResult.id}`);
      
      if (detailsResponse.data.success) {
        const manga = detailsResponse.data.data;
        console.log('\nManga Details:');
        console.log('- Title:', manga.title);
        console.log('- Type:', manga.type);
        console.log('- Status:', manga.status);
        console.log('- Genres:', manga.genres?.join(', '));
        console.log('- Total Chapters:', manga.chapters.length);
        
        // Get latest chapter
        if (manga.chapters.length > 0) {
          const latestChapter = manga.chapters[0];
          console.log('\nLatest Chapter:');
          console.log('- Number:', latestChapter.chapterNumber);
          console.log('- URL:', latestChapter.chapterUrl);
        }
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// EXAMPLE 3: Get Chapter Pages for Reading
// ============================================================================

async function example3_GetChapterPages(chapterId) {
  try {
    const response = await axios.get(`${API_BASE}/api/chapter/${chapterId}`);
    
    if (response.data.success) {
      const chapter = response.data.data;
      
      console.log('Chapter Information:');
      console.log('- Manga:', chapter.mangaTitle);
      console.log('- Chapter:', chapter.chapterNumber);
      console.log('- Total Pages:', chapter.pages.length);
      
      console.log('\nPage URLs:');
      chapter.pages.forEach(page => {
        console.log(`Page ${page.pageNumber}: ${page.imageUrl}`);
      });
      
      // Navigation
      if (chapter.previousChapter) {
        console.log('\nPrevious Chapter:', chapter.previousChapter);
      }
      if (chapter.nextChapter) {
        console.log('Next Chapter:', chapter.nextChapter);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// EXAMPLE 4: Advanced Search with Filters
// ============================================================================

async function example4_AdvancedSearch() {
  try {
    const response = await axios.get(`${API_BASE}/api/search/advanced`, {
      params: {
        genres: 'Action,Adventure',
        status: 'publishing',
        type: 'manga',
        page: 1
      }
    });
    
    if (response.data.success) {
      const { results, currentPage, totalPages } = response.data.data;
      
      console.log(`Found ${results.length} manga (Page ${currentPage} of ${totalPages})`);
      
      results.forEach((manga, index) => {
        console.log(`\n${index + 1}. ${manga.title}`);
        console.log(`   Type: ${manga.type || 'N/A'}`);
        console.log(`   Year: ${manga.year || 'N/A'}`);
        console.log(`   Status: ${manga.status || 'N/A'}`);
        console.log(`   URL: ${manga.url}`);
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// EXAMPLE 5: Get Manga by Genre
// ============================================================================

async function example5_GetByGenre(genre, page = 1) {
  try {
    const response = await axios.get(`${API_BASE}/api/genre/${genre}`, {
      params: { page }
    });
    
    if (response.data.success) {
      const { results, currentPage, totalPages } = response.data.data;
      
      console.log(`${genre} Manga (Page ${currentPage} of ${totalPages || 'N/A'}):\n`);
      
      results.slice(0, 10).forEach((manga, index) => {
        console.log(`${index + 1}. ${manga.title}`);
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// EXAMPLE 6: Build a Simple Manga Reader
// ============================================================================

class SimpleMangaReader {
  constructor(apiBase = 'http://localhost:3000') {
    this.apiBase = apiBase;
    this.axios = axios.create({ baseURL: apiBase });
  }
  
  async searchManga(query) {
    const response = await this.axios.get('/api/search', {
      params: { q: query }
    });
    return response.data.data.results;
  }
  
  async getMangaDetails(mangaId) {
    const response = await this.axios.get(`/api/manga/${mangaId}`);
    return response.data.data;
  }
  
  async getChapterPages(chapterId) {
    const response = await this.axios.get(`/api/chapter/${chapterId}`);
    return response.data.data;
  }
  
  async readChapter(mangaId, chapterNumber) {
    // Construct chapter ID
    const chapterId = `${mangaId}-${chapterNumber}`;
    return await this.getChapterPages(chapterId);
  }
}

// Usage:
async function example6_UseMangaReader() {
  const reader = new SimpleMangaReader();
  
  // Search for manga
  const results = await reader.searchManga('naruto');
  console.log('Search results:', results.length);
  
  if (results.length > 0) {
    const mangaId = results[0].id;
    
    // Get manga details
    const details = await reader.getMangaDetails(mangaId);
    console.log('Manga:', details.title);
    console.log('Chapters:', details.chapters.length);
    
    // Read first chapter
    if (details.chapters.length > 0) {
      const firstChapter = details.chapters[0];
      const pages = await reader.getChapterPages(
        firstChapter.chapterUrl.split('/chapters/')[1]
      );
      console.log('Pages in first chapter:', pages.pages.length);
    }
  }
}

// ============================================================================
// EXAMPLE 7: Fetch Recent Updates
// ============================================================================

async function example7_GetRecentUpdates() {
  try {
    const response = await axios.get(`${API_BASE}/api/chapters/recent`, {
      params: { page: 1 }
    });
    
    if (response.data.success) {
      const chapters = response.data.data;
      
      console.log('Recent Chapter Updates:\n');
      
      chapters.slice(0, 15).forEach((chapter, index) => {
        console.log(`${index + 1}. ${chapter.mangaName} - Chapter ${chapter.chapterNumber}`);
        if (chapter.releaseDate) {
          console.log(`   Released: ${chapter.releaseDate}`);
        }
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// EXAMPLE 8: Get New Manga Additions
// ============================================================================

async function example8_GetNewManga() {
  try {
    const response = await axios.get(`${API_BASE}/api/manga/new`, {
      params: { page: 1 }
    });
    
    if (response.data.success) {
      const { results } = response.data.data;
      
      console.log('Newly Added Manga:\n');
      
      results.slice(0, 10).forEach((manga, index) => {
        console.log(`${index + 1}. ${manga.title}`);
        console.log(`   Type: ${manga.type || 'N/A'}`);
        console.log(`   Year: ${manga.year || 'N/A'}`);
        console.log(`   URL: ${manga.url}\n`);
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// EXAMPLE 9: Get Random Manga Recommendation
// ============================================================================

async function example9_GetRandomManga() {
  try {
    const response = await axios.get(`${API_BASE}/api/manga/random`);
    
    if (response.data.success) {
      const manga = response.data.data;
      
      console.log('Random Manga Recommendation:');
      console.log('- Title:', manga.title);
      console.log('- URL:', manga.url);
      
      // Get full details
      const detailsResponse = await axios.get(`${API_BASE}/api/manga/${manga.id}`);
      if (detailsResponse.data.success) {
        const details = detailsResponse.data.data;
        console.log('- Description:', details.description?.substring(0, 200) + '...');
        console.log('- Genres:', details.genres?.join(', '));
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// EXAMPLE 10: Using with Browser Fetch API
// ============================================================================

// For use in browser or modern Node.js
async function example10_BrowserFetch() {
  const API_BASE = 'http://localhost:3000';
  
  try {
    // Get homepage data
    const response = await fetch(`${API_BASE}/api/homepage`);
    const data = await response.json();
    
    if (data.success) {
      console.log('Featured Chapters:', data.data.featuredChapters.length);
      console.log('Trending Manga:', data.data.trendingManga.length);
    }
    
    // Search manga
    const searchResponse = await fetch(
      `${API_BASE}/api/search?q=${encodeURIComponent('attack on titan')}&page=1`
    );
    const searchData = await searchResponse.json();
    
    if (searchData.success) {
      searchData.data.results.forEach(manga => {
        console.log(manga.title);
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// ============================================================================
// EXAMPLE 11: Batch Processing Multiple Manga
// ============================================================================

async function example11_BatchProcessing() {
  const mangaIds = ['723', '3262', '1', '2']; // Chainsaw Man, One Punch Man, Berserk, One Piece
  
  try {
    // Fetch all manga details in parallel
    const promises = mangaIds.map(id => 
      axios.get(`${API_BASE}/api/manga/${id}`)
    );
    
    const responses = await Promise.all(promises);
    
    responses.forEach(response => {
      if (response.data.success) {
        const manga = response.data.data;
        console.log(`\n${manga.title}:`);
        console.log('- Status:', manga.status);
        console.log('- Chapters:', manga.chapters.length);
        console.log('- Genres:', manga.genres?.join(', '));
      }
    });
  } catch (error) {
    console.error('Error in batch processing:', error.message);
  }
}

// ============================================================================
// EXAMPLE 12: Error Handling Example
// ============================================================================

async function example12_ErrorHandling() {
  try {
    // Try to get a non-existent manga
    const response = await axios.get(`${API_BASE}/api/manga/999999`);
    
    if (!response.data.success) {
      console.log('Error:', response.data.error);
    }
  } catch (error) {
    if (error.response) {
      // Server responded with error
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data.error);
    } else if (error.request) {
      // Request made but no response
      console.log('No response from server');
    } else {
      // Other errors
      console.log('Error:', error.message);
    }
  }
}

// ============================================================================
// Run Examples (uncomment to test)
// ============================================================================

// example1_GetHomepage();
// example2_SearchAndGetDetails();
// example3_GetChapterPages('723-10230000');
// example4_AdvancedSearch();
// example5_GetByGenre('Action');
// example6_UseMangaReader();
// example7_GetRecentUpdates();
// example8_GetNewManga();
// example9_GetRandomManga();
// example10_BrowserFetch();
// example11_BatchProcessing();
// example12_ErrorHandling();

// Export for use in other files
module.exports = {
  example1_GetHomepage,
  example2_SearchAndGetDetails,
  example3_GetChapterPages,
  example4_AdvancedSearch,
  example5_GetByGenre,
  SimpleMangaReader,
  example7_GetRecentUpdates,
  example8_GetNewManga,
  example9_GetRandomManga,
  example11_BatchProcessing,
  example12_ErrorHandling
};
