# API Documentation

Complete API reference for MangaPill Scraper.

## Base URL

```
http://localhost:3000
```

## Response Format

All endpoints return JSON in this format:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "ISO 8601 timestamp"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "ISO 8601 timestamp"
}
```

## HTTP Status Codes

- `200` - Success
- `400` - Bad Request (missing/invalid parameters)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP
- **Headers:**
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time (ISO 8601)

---

## Endpoints

### System Endpoints

#### GET /

Get API information and quick reference.

**Response:**
```json
{
  "name": "MangaPill API Scraper",
  "version": "2.0.0",
  "description": "...",
  "documentation": "http://localhost:3000/api/docs",
  "health": "http://localhost:3000/health",
  "quickStart": { ... },
  "features": [ ... ]
}
```

#### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "uptime": 12345.678,
  "environment": "development",
  "timestamp": "2024-02-27T12:00:00.000Z",
  "memory": {
    "used": 45,
    "total": 100,
    "unit": "MB"
  }
}
```

#### GET /api/docs

Get detailed API documentation.

**Response:** Comprehensive API documentation object

---

### Homepage Endpoint

#### GET /api/homepage

Get homepage data including featured chapters, new chapters, and trending manga.

**Parameters:** None

**Response:**
```json
{
  "success": true,
  "data": {
    "featuredChapters": [
      {
        "chapterNumber": "225",
        "chapterUrl": "https://mangapill.com/chapters/3262-10225000/...",
        "chapterTitle": "Chapter 225",
        "mangaName": "One-Punch Man",
        "mangaId": "3262",
        "mangaUrl": "https://mangapill.com/manga/3262/one-punch-man",
        "imageUrl": "https://...",
        "releaseDate": "2026-02-26"
      }
    ],
    "newChapters": [ ... ],
    "trendingManga": [
      {
        "id": "723",
        "title": "Chainsaw Man",
        "url": "https://mangapill.com/manga/723/chainsaw-man",
        "imageUrl": "https://...",
        "type": "manga",
        "year": "2018",
        "status": "publishing"
      }
    ],
    "latestNews": [
      {
        "title": "Notice: Images Not Loading Issue",
        "url": "https://mangapill.com/news/26/..."
      }
    ]
  },
  "timestamp": "2024-02-27T12:00:00.000Z"
}
```

---

### Manga Endpoints

#### GET /api/manga/:id

Get detailed manga information by ID.

**Parameters:**
- `id` (path, required) - Manga ID

**Example:**
```
GET /api/manga/723
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "723",
    "title": "Chainsaw Man",
    "alternativeTitles": ["チェンソーマン"],
    "imageUrl": "https://cdn.mangapill.com/...",
    "description": "Denji is a teenage boy...",
    "type": "manga",
    "year": "2018",
    "status": "publishing",
    "author": ["Fujimoto Tatsuki"],
    "artist": ["Fujimoto Tatsuki"],
    "genres": ["Action", "Comedy", "Horror", "Supernatural"],
    "rating": "8.7",
    "chapters": [
      {
        "chapterNumber": "230",
        "chapterTitle": "Chapter 230",
        "chapterUrl": "https://mangapill.com/chapters/...",
        "releaseDate": "2024-01-10"
      }
    ]
  },
  "timestamp": "2024-02-27T12:00:00.000Z"
}
```

#### GET /api/manga/new

Get newly added manga.

**Parameters:**
- `page` (query, optional) - Page number (default: 1)

**Example:**
```
GET /api/manga/new?page=1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "9999",
        "title": "New Manga Title",
        "url": "https://mangapill.com/manga/9999/...",
        "imageUrl": "https://...",
        "type": "manga",
        "year": "2024",
        "status": "publishing"
      }
    ],
    "currentPage": 1,
    "totalPages": 10
  },
  "timestamp": "2024-02-27T12:00:00.000Z"
}
```

#### GET /api/manga/random

Get a random manga.

**Parameters:** None

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1234",
    "title": "Random Manga",
    "url": "https://mangapill.com/manga/1234/random-manga",
    "imageUrl": "https://...",
    "type": "manga",
    "year": "2020",
    "status": "publishing"
  },
  "timestamp": "2024-02-27T12:00:00.000Z"
}
```

---

### Chapter Endpoints

#### GET /api/chapter/:chapterId

Get all pages/images for a specific chapter.

**Parameters:**
- `chapterId` (path, required) - Chapter ID (format: `mangaId-chapterNumber`)

**Example:**
```
GET /api/chapter/723-10230000
```

**Response:**
```json
{
  "success": true,
  "data": {
    "chapterId": "723-10230000",
    "chapterNumber": "230",
    "chapterTitle": "Chainsaw Man Chapter 230",
    "mangaTitle": "Chainsaw Man",
    "mangaUrl": "https://mangapill.com/manga/723/chainsaw-man",
    "pages": [
      {
        "pageNumber": 1,
        "imageUrl": "https://cdn.mangapill.com/manga/723/chapter-230/page-1.jpg"
      },
      {
        "pageNumber": 2,
        "imageUrl": "https://cdn.mangapill.com/manga/723/chapter-230/page-2.jpg"
      }
    ],
    "previousChapter": "https://mangapill.com/chapters/...",
    "nextChapter": "https://mangapill.com/chapters/..."
  },
  "timestamp": "2024-02-27T12:00:00.000Z"
}
```

#### GET /api/chapters/recent

Get recently released chapters.

**Parameters:**
- `page` (query, optional) - Page number (default: 1)

**Example:**
```
GET /api/chapters/recent?page=1
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "chapterNumber": "112",
      "chapterUrl": "https://mangapill.com/chapters/...",
      "chapterTitle": "Chapter 112",
      "mangaName": "Fool Night",
      "mangaId": "5966",
      "mangaUrl": "https://mangapill.com/manga/5966/fool-night",
      "imageUrl": "https://...",
      "releaseDate": "2026-02-27"
    }
  ],
  "timestamp": "2024-02-27T12:00:00.000Z"
}
```

---

### Search Endpoints

#### GET /api/search

Basic manga search by title.

**Parameters:**
- `q` (query, required) - Search query
- `page` (query, optional) - Page number (default: 1)

**Example:**
```
GET /api/search?q=naruto&page=1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "150",
        "title": "Naruto",
        "url": "https://mangapill.com/manga/150/naruto",
        "imageUrl": "https://...",
        "type": "manga",
        "year": "1999",
        "status": "finished"
      }
    ],
    "totalResults": 15,
    "currentPage": 1,
    "totalPages": 2
  },
  "timestamp": "2024-02-27T12:00:00.000Z"
}
```

#### GET /api/search/advanced

Advanced search with multiple filters.

**Parameters:**
- `q` (query, optional) - Search query
- `genres` (query, optional) - Comma-separated genres (e.g., "Action,Adventure")
- `type` (query, optional) - Type: manga, manhwa, or manhua
- `status` (query, optional) - Status: publishing or finished
- `year` (query, optional) - Publication year
- `page` (query, optional) - Page number (default: 1)

**Example:**
```
GET /api/search/advanced?genres=Action,Adventure&status=publishing&page=1
```

**Response:** Same as basic search

#### GET /api/genre/:genre

Search manga by specific genre.

**Parameters:**
- `genre` (path, required) - Genre name (e.g., "Action", "Romance")
- `page` (query, optional) - Page number (default: 1)

**Example:**
```
GET /api/genre/Action?page=1
```

**Response:** Same as basic search

---

### Cache Endpoints

#### GET /api/cache/stats

Get cache statistics.

**Parameters:** None

**Response:**
```json
{
  "success": true,
  "data": {
    "size": 45,
    "enabled": true,
    "ttl": 300000
  },
  "timestamp": "2024-02-27T12:00:00.000Z"
}
```

#### POST /api/cache/clear

Clear the cache.

**Parameters:** None

**Response:**
```json
{
  "success": true,
  "message": "Cache cleared successfully",
  "timestamp": "2024-02-27T12:00:00.000Z"
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Query parameter 'q' is required",
  "timestamp": "2024-02-27T12:00:00.000Z"
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Manga not found",
  "timestamp": "2024-02-27T12:00:00.000Z"
}
```

### 429 Too Many Requests

```json
{
  "success": false,
  "error": "Too many requests. Please try again later.",
  "timestamp": "2024-02-27T12:00:00.000Z"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Internal server error",
  "timestamp": "2024-02-27T12:00:00.000Z"
}
```

---

## Best Practices

1. **Use caching** - Results are cached for 5 minutes
2. **Respect rate limits** - Max 100 requests per 15 minutes
3. **Handle errors** - Always check `success` field
4. **Paginate results** - Use `page` parameter for large datasets
5. **Check headers** - Monitor rate limit headers
6. **Use appropriate endpoints** - Use specific search when possible

## Code Examples

### JavaScript/Fetch

```javascript
// Get homepage
const response = await fetch('http://localhost:3000/api/homepage');
const data = await response.json();

if (data.success) {
  console.log(data.data);
}
```

### Node.js/Axios

```javascript
const axios = require('axios');

try {
  const response = await axios.get('http://localhost:3000/api/search', {
    params: { q: 'naruto', page: 1 }
  });
  console.log(response.data);
} catch (error) {
  console.error(error.response.data);
}
```

### cURL

```bash
curl -X GET "http://localhost:3000/api/manga/723"
```

---

For more information, visit [GitHub Repository](https://github.com/basirulakhlakborno/manga-scraper)
