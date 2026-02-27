/**
 * MangaPill API Test Collection
 * 
 * Run this file to test all API endpoints
 * Usage: node api-tests.js
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3000';
const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Test results tracker
const results = {
  passed: 0,
  failed: 0,
  total: 0
};

function log(color, message) {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function logTest(name, passed, details = '') {
  results.total++;
  if (passed) {
    results.passed++;
    log('green', `✓ ${name}`);
  } else {
    results.failed++;
    log('red', `✗ ${name}`);
  }
  if (details) {
    log('cyan', `  ${details}`);
  }
}

async function testEndpoint(name, url, validator) {
  try {
    const response = await axios.get(`${API_BASE}${url}`);
    const passed = validator(response.data);
    logTest(name, passed, passed ? `Status: ${response.status}` : 'Validation failed');
    return response.data;
  } catch (error) {
    logTest(name, false, error.message);
    return null;
  }
}

// ============================================================================
// Test Suite
// ============================================================================

async function runTests() {
  log('blue', '\n╔══════════════════════════════════════════════════════════╗');
  log('blue', '║       MangaPill API Test Suite                          ║');
  log('blue', '╚══════════════════════════════════════════════════════════╝\n');

  // Test 1: Health Check
  log('yellow', '\n[1] Testing Health Check...');
  await testEndpoint(
    'Health Check',
    '/health',
    (data) => data.status === 'healthy'
  );

  // Test 2: Homepage
  log('yellow', '\n[2] Testing Homepage...');
  const homepage = await testEndpoint(
    'Homepage Data',
    '/api/homepage',
    (data) => data.success && data.data.featuredChapters && data.data.trendingManga
  );
  
  if (homepage) {
    log('cyan', `  Featured: ${homepage.data.featuredChapters.length}`);
    log('cyan', `  New: ${homepage.data.newChapters.length}`);
    log('cyan', `  Trending: ${homepage.data.trendingManga.length}`);
  }

  // Test 3: Search
  log('yellow', '\n[3] Testing Search...');
  const search = await testEndpoint(
    'Search - "naruto"',
    '/api/search?q=naruto&page=1',
    (data) => data.success && data.data.results && data.data.results.length > 0
  );
  
  if (search) {
    log('cyan', `  Found: ${search.data.results.length} results`);
    log('cyan', `  First: ${search.data.results[0].title}`);
  }

  // Test 4: Manga Details
  log('yellow', '\n[4] Testing Manga Details...');
  const mangaId = '723'; // Chainsaw Man
  const manga = await testEndpoint(
    'Manga Details - ID 723',
    `/api/manga/${mangaId}`,
    (data) => data.success && data.data.title && data.data.chapters
  );
  
  if (manga) {
    log('cyan', `  Title: ${manga.data.title}`);
    log('cyan', `  Chapters: ${manga.data.chapters.length}`);
    log('cyan', `  Genres: ${manga.data.genres?.join(', ') || 'N/A'}`);
  }

  // Test 5: Chapter Pages
  log('yellow', '\n[5] Testing Chapter Pages...');
  const chapterId = '723-10230000'; // Chainsaw Man Ch 230
  const chapter = await testEndpoint(
    'Chapter Pages - 723-10230000',
    `/api/chapter/${chapterId}`,
    (data) => data.success && data.data.pages && data.data.pages.length > 0
  );
  
  if (chapter) {
    log('cyan', `  Manga: ${chapter.data.mangaTitle}`);
    log('cyan', `  Chapter: ${chapter.data.chapterNumber}`);
    log('cyan', `  Pages: ${chapter.data.pages.length}`);
  }

  // Test 6: Advanced Search
  log('yellow', '\n[6] Testing Advanced Search...');
  const advSearch = await testEndpoint(
    'Advanced Search - Action+Adventure',
    '/api/search/advanced?genres=Action,Adventure&status=publishing&page=1',
    (data) => data.success && data.data.results
  );
  
  if (advSearch) {
    log('cyan', `  Results: ${advSearch.data.results.length}`);
  }

  // Test 7: Search by Genre
  log('yellow', '\n[7] Testing Genre Search...');
  const genre = await testEndpoint(
    'Genre Search - Action',
    '/api/genre/Action?page=1',
    (data) => data.success && data.data.results && data.data.results.length > 0
  );
  
  if (genre) {
    log('cyan', `  Results: ${genre.data.results.length}`);
    log('cyan', `  Page: ${genre.data.currentPage}`);
  }

  // Test 8: New Manga
  log('yellow', '\n[8] Testing New Manga...');
  const newManga = await testEndpoint(
    'New Manga',
    '/api/manga/new?page=1',
    (data) => data.success && data.data.results && data.data.results.length > 0
  );
  
  if (newManga) {
    log('cyan', `  New manga: ${newManga.data.results.length}`);
  }

  // Test 9: Recent Chapters
  log('yellow', '\n[9] Testing Recent Chapters...');
  const recent = await testEndpoint(
    'Recent Chapters',
    '/api/chapters/recent?page=1',
    (data) => data.success && Array.isArray(data.data) && data.data.length > 0
  );
  
  if (recent) {
    log('cyan', `  Recent chapters: ${recent.data.length}`);
    if (recent.data[0]) {
      log('cyan', `  Latest: ${recent.data[0].mangaName} - Ch ${recent.data[0].chapterNumber}`);
    }
  }

  // Test 10: Random Manga
  log('yellow', '\n[10] Testing Random Manga...');
  const random = await testEndpoint(
    'Random Manga',
    '/api/manga/random',
    (data) => data.success && data.data && data.data.title
  );
  
  if (random) {
    log('cyan', `  Random: ${random.data.title}`);
  }

  // Test 11: API Documentation
  log('yellow', '\n[11] Testing API Documentation...');
  await testEndpoint(
    'API Documentation',
    '/api/docs',
    (data) => data.title && data.endpoints && Array.isArray(data.endpoints)
  );

  // Test 12: Error Handling - 404
  log('yellow', '\n[12] Testing Error Handling...');
  try {
    await axios.get(`${API_BASE}/api/manga/999999999`);
    logTest('Error Handling - 404', false, 'Should return 404');
  } catch (error) {
    logTest(
      'Error Handling - 404',
      error.response?.status === 404,
      `Status: ${error.response?.status}`
    );
  }

  // Test 13: Error Handling - Missing Parameter
  try {
    await axios.get(`${API_BASE}/api/search`);
    logTest('Error Handling - Missing Param', false, 'Should return 400');
  } catch (error) {
    logTest(
      'Error Handling - Missing Param',
      error.response?.status === 400,
      `Status: ${error.response?.status}`
    );
  }

  // Test 14: Pagination
  log('yellow', '\n[14] Testing Pagination...');
  const page1 = await testEndpoint(
    'Pagination - Page 1',
    '/api/chapters/recent?page=1',
    (data) => data.success && Array.isArray(data.data)
  );
  
  const page2 = await testEndpoint(
    'Pagination - Page 2',
    '/api/chapters/recent?page=2',
    (data) => data.success && Array.isArray(data.data)
  );

  if (page1 && page2) {
    const different = JSON.stringify(page1.data) !== JSON.stringify(page2.data);
    logTest('Pagination - Different Results', different);
  }

  // Test 15: Response Format
  log('yellow', '\n[15] Testing Response Format...');
  const format = await testEndpoint(
    'Response Format',
    '/api/homepage',
    (data) => {
      return (
        data.hasOwnProperty('success') &&
        data.hasOwnProperty('timestamp') &&
        (data.hasOwnProperty('data') || data.hasOwnProperty('error'))
      );
    }
  );

  // Print Summary
  log('blue', '\n╔══════════════════════════════════════════════════════════╗');
  log('blue', '║       Test Summary                                       ║');
  log('blue', '╚══════════════════════════════════════════════════════════╝\n');
  
  log('cyan', `Total Tests: ${results.total}`);
  log('green', `Passed: ${results.passed}`);
  log('red', `Failed: ${results.failed}`);
  
  const percentage = ((results.passed / results.total) * 100).toFixed(1);
  log('yellow', `Success Rate: ${percentage}%`);
  
  if (results.failed === 0) {
    log('green', '\n✓ All tests passed! 🎉\n');
  } else {
    log('red', `\n✗ ${results.failed} test(s) failed\n`);
  }
}

// Run tests
if (require.main === module) {
  runTests().catch(error => {
    log('red', `\nFatal error: ${error.message}\n`);
    log('yellow', 'Make sure the server is running on http://localhost:3000\n');
    process.exit(1);
  });
}

module.exports = { runTests };
