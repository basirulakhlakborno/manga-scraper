# 📚 MangaPill API Scraper

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/basirulakhlakborno/manga-scraper)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/basirulakhlakborno/manga-scraper)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/basirulakhlakborno/manga-scraper)

A **production-ready**, **enterprise-grade** RESTful API for scraping manga data from [MangaPill.com](https://mangapill.com). Built with TypeScript, Express, and modern best practices.

## ⭐ Key Features

- 🏗️ **Modular Architecture** - Clean separation of concerns (Controllers, Services, Extractors, Utils)
- ⚡ **Performance Optimized** - Smart caching with 5-minute TTL
- 🔄 **Auto-Retry Logic** - Exponential backoff for failed requests
- 🛡️ **Rate Limiting** - 100 requests per 15 minutes per IP
- 📝 **Comprehensive Logging** - Request/response logging with timestamps
- 🔒 **Type-Safe** - Full TypeScript support
- 🌐 **CORS Enabled** - Ready for frontend integration
- 📊 **Cache Management** - Built-in cache statistics and clearing
- 🎯 **Error Handling** - Graceful error handling at all layers

## 📋 Table of Contents

- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Response Format](#-response-format)
- [Use Cases](#-use-cases)
- [Configuration](#️-configuration)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## 🚀 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/basirulakhlakborno/manga-scraper.git
cd mangapill-scraper

# Install dependencies
npm install

# Configure environment (optional)
cp .env.example .env

# Run in development mode
npm run dev

# Or build and run in production
npm run build
npm start
```

The server will start at `http://localhost:3000`

## ⚡ Quick Start

```bash
# Get homepage data
curl http://localhost:3000/api/homepage

# Search for manga
curl "http://localhost:3000/api/search?q=naruto"

# Get manga details
curl http://localhost:3000/api/manga/723

# Get chapter pages
curl http://localhost:3000/api/chapter/723-10230000

# Get recent chapters
curl http://localhost:3000/api/chapters/recent
```

## 📁 Project Structure

```
mangapill-scraper/
├── src/
│   ├── config/
│   │   └── config.ts              # Configuration management
│   ├── controllers/
│   │   ├── homepageController.ts  # Homepage logic
│   │   ├── mangaController.ts     # Manga operations
│   │   ├── chapterController.ts   # Chapter operations
│   │   └── searchController.ts    # Search operations
│   ├── extractors/
│   │   ├── mangaExtractor.ts      # Manga data extraction
│   │   └── chapterExtractor.ts    # Chapter data extraction
│   ├── middleware/
│   │   ├── errorHandler.ts        # Error handling
│   │   ├── requestLogger.ts       # Request logging
│   │   └── rateLimiter.ts         # Rate limiting
│   ├── routes/
│   │   ├── index.ts               # Route aggregator
│   │   ├── mangaRoutes.ts         # Manga routes
│   │   ├── chapterRoutes.ts       # Chapter routes
│   │   ├── searchRoutes.ts        # Search routes
│   │   └── ...                    # Other routes
│   ├── services/
│   │   └── scraperService.ts      # Core scraping logic
│   ├── utils/
│   │   ├── httpClient.ts          # HTTP client with caching
│   │   ├── logger.ts              # Logging utility
│   │   └── response.ts            # Response formatting
│   ├── types.ts                   # TypeScript interfaces
│   └── server.ts                  # Express server
├── dist/                          # Compiled JavaScript
├── package.json
├── tsconfig.json
├── .env
└── README.md
```

### Architecture Layers

1. **Controllers** - Handle HTTP requests/responses
2. **Services** - Business logic and data orchestration
3. **Extractors** - HTML parsing and data extraction
4. **Utils** - Shared utilities (HTTP, logging, formatting)
5. **Middleware** - Request processing (logging, rate limiting, errors)
6. **Routes** - Endpoint definitions

## 📡 API Endpoints

### Base URL
```
http://localhost:3000
```

### Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API information |
| `/health` | GET | Health check |
| `/api/docs` | GET | API documentation |
| `/api/homepage` | GET | Homepage data |
| `/api/manga/:id` | GET | Manga details |
| `/api/manga/new` | GET | New manga |
| `/api/manga/random` | GET | Random manga |
| `/api/chapter/:chapterId` | GET | Chapter pages |
| `/api/chapters/recent` | GET | Recent chapters |
| `/api/search` | GET | Search manga |
| `/api/search/advanced` | GET | Advanced search |
| `/api/genre/:genre` | GET | Genre search |
| `/api/cache/stats` | GET | Cache statistics |
| `/api/cache/clear` | POST | Clear cache |

## 📦 Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": {
    ... // Endpoint-specific data
  },
  "timestamp": "2024-02-27T12:00:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message description",
  "timestamp": "2024-02-27T12:00:00.000Z"
}
```

## 📋 Detailed API Responses

### 1. Homepage (`GET /api/homepage`)

```json
{
  "success": true,
  "data": {
    "featuredChapters": [
      {
        "chapterNumber": "225",
        "chapterUrl": "https://mangapill.com/chapters/3262-10225000/one-punch-man-chapter-225",
        "chapterTitle": "Chapter 225",
        "mangaName": "One-Punch Man",
        "mangaId": "3262",
        "mangaUrl": "https://mangapill.com/manga/3262/one-punch-man",
        "imageUrl": "https://...",
        "releaseDate": "2026-02-26"
      }
    ],
    "newChapters": [...],
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

### 2. Manga Details (`GET /api/manga/:id`)

```json
{
  "success": true,
  "data": {
    "id": "723",
    "title": "Chainsaw Man",
    "alternativeTitles": ["チェンソーマン"],
    "imageUrl": "https://cdn.mangapill.com/...",
    "description": "Denji is a teenage boy living with a Chainsaw Devil named Pochita...",
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
        "chapterUrl": "https://mangapill.com/chapters/723-10230000/chainsaw-man-chapter-230",
        "releaseDate": "2024-01-10"
      },
      {
        "chapterNumber": "229",
        "chapterTitle": "Chapter 229",
        "chapterUrl": "https://mangapill.com/chapters/723-10229000/chainsaw-man-chapter-229",
        "releaseDate": "2024-01-03"
      }
    ]
  },
  "timestamp": "2024-02-27T12:00:00.000Z"
}
```

### 3. Chapter Pages (`GET /api/chapter/:chapterId`)

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
      },
      {
        "pageNumber": 3,
        "imageUrl": "https://cdn.mangapill.com/manga/723/chapter-230/page-3.jpg"
      }
    ],
    "previousChapter": "https://mangapill.com/chapters/723-10229000/chainsaw-man-chapter-229",
    "nextChapter": "https://mangapill.com/chapters/723-10231000/chainsaw-man-chapter-231"
  },
  "timestamp": "2024-02-27T12:00:00.000Z"
}
```

### 4. Search Results (`GET /api/search?q=naruto`)

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "150",
        "title": "Naruto",
        "url": "https://mangapill.com/manga/150/naruto",
        "imageUrl": "https://cdn.mangapill.com/...",
        "type": "manga",
        "year": "1999",
        "status": "finished"
      },
      {
        "id": "151",
        "title": "Naruto: Shippuden",
        "url": "https://mangapill.com/manga/151/naruto-shippuden",
        "imageUrl": "https://cdn.mangapill.com/...",
        "type": "manga",
        "year": "2007",
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

### 5. Recent Chapters (`GET /api/chapters/recent`)

```json
{
  "success": true,
  "data": [
    {
      "chapterNumber": "112",
      "chapterUrl": "https://mangapill.com/chapters/5966-10112000/fool-night-chapter-112",
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

## 💡 Use Cases

### 1. Manga Discovery App

Build a manga recommendation and discovery platform:

```javascript
// Get trending manga
const trending = await fetch('http://localhost:3000/api/homepage');
const data = await trending.json();
const trendingList = data.data.trendingManga;

// Search by genre
const action = await fetch('http://localhost:3000/api/genre/Action');
const actionManga = await action.json();

// Get random recommendations
const random = await fetch('http://localhost:3000/api/manga/random');
const randomManga = await random.json();
```

### 2. Manga Reader Application

Create a full-featured manga reading app:

```javascript
// Search for manga
const search = await fetch('http://localhost:3000/api/search?q=one+piece');
const results = await search.json();

// Get manga details and chapters
const manga = await fetch(`http://localhost:3000/api/manga/${results.data.results[0].id}`);
const mangaData = await manga.json();

// Load chapter pages
const chapter = await fetch(`http://localhost:3000/api/chapter/${chapterId}`);
const pages = await chapter.json();

// Display images
pages.data.pages.forEach(page => {
  displayImage(page.imageUrl);
});
```

### 3. Update Notification System

Track new chapters and notify users:

```javascript
// Get recent chapters
const recent = await fetch('http://localhost:3000/api/chapters/recent');
const chapters = await recent.json();

// Filter for followed manga
const updates = chapters.data.filter(ch => 
  followedManga.includes(ch.mangaId)
);

// Send notifications
updates.forEach(update => {
  notifyUser(`New chapter of ${update.mangaName}: Chapter ${update.chapterNumber}`);
});
```

### 4. Manga Database/Archive

Build a comprehensive manga database:

```javascript
// Scrape all new manga
const newManga = await fetch('http://localhost:3000/api/manga/new?page=1');
const data = await newManga.json();

// Store in database
for (const manga of data.data.results) {
  const details = await fetch(`http://localhost:3000/api/manga/${manga.id}`);
  const fullData = await details.json();
  
  await database.manga.create(fullData.data);
}
```

### 5. Analytics Dashboard

Track manga trends and statistics:

```javascript
// Get homepage stats
const homepage = await fetch('http://localhost:3000/api/homepage');
const stats = await homepage.json();

// Analyze trending manga genres
const genres = stats.data.trendingManga.flatMap(m => m.genres || []);
const genreCount = genres.reduce((acc, g) => {
  acc[g] = (acc[g] || 0) + 1;
  return acc;
}, {});

// Track update frequency
const recent = await fetch('http://localhost:3000/api/chapters/recent');
const updates = await recent.json();
const updatesByDate = groupByDate(updates.data);
```

### 6. RSS Feed Generator

Create RSS feeds for manga updates:

```javascript
const feed = new RSS({
  title: 'Latest Manga Updates',
  description: 'Latest chapter releases'
});

const recent = await fetch('http://localhost:3000/api/chapters/recent');
const chapters = await recent.json();

chapters.data.forEach(chapter => {
  feed.item({
    title: `${chapter.mangaName} - Chapter ${chapter.chapterNumber}`,
    url: chapter.chapterUrl,
    date: chapter.releaseDate
  });
});
```

### 7. Batch Downloader

Download entire manga series:

```javascript
async function downloadManga(mangaId) {
  // Get all chapters
  const manga = await fetch(`http://localhost:3000/api/manga/${mangaId}`);
  const data = await manga.json();
  
  // Download each chapter
  for (const chapter of data.data.chapters) {
    const chapterId = chapter.chapterUrl.split('/chapters/')[1];
    const pages = await fetch(`http://localhost:3000/api/chapter/${chapterId}`);
    const pagesData = await pages.json();
    
    // Download all pages
    await downloadChapter(pagesData.data);
  }
}
```

## ⚙️ Configuration

Edit `.env` file:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=*

# Cache Configuration (in milliseconds)
CACHE_TTL=300000  # 5 minutes
CACHE_CLEANUP_INTERVAL=600000  # 10 minutes

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

## 🛠️ Development

```bash
# Development mode with auto-reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run tests
npm test

# Lint code
npm run lint
```

## 🧪 Testing

```bash
# Run automated test suite
node api-tests.js

# Or use Postman collection
# Import: MangaPill-API.postman_collection.json
```

## 📊 Performance

- **Caching**: 5-minute TTL reduces repeated requests
- **Retry Logic**: Automatic retry with exponential backoff
- **Rate Limiting**: Prevents API abuse
- **Memory Efficient**: Automatic cache cleanup
- **Fast Response**: Average response time < 500ms (with cache)

## 🔧 Advanced Features

### Cache Management

```bash
# Get cache statistics
curl http://localhost:3000/api/cache/stats

# Clear cache
curl -X POST http://localhost:3000/api/cache/clear
```

### Rate Limit Headers

All responses include rate limit information:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2024-02-27T12:15:00.000Z
```

## 🚢 Deployment

### One-Click Deploy

Click the buttons above to deploy instantly to Vercel, Render, or Netlify.

### Docker (Recommended)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Build & Deploy

```bash
# Build
docker build -t mangapill-api .

# Run
docker run -p 3000:3000 mangapill-api
```

### Environment Variables

Set in your deployment platform:
- `PORT`
- `NODE_ENV=production`
- `CORS_ORIGIN=https://yourdomain.com`

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⚠️ Legal Disclaimer

This project is for **educational purposes only**. Please respect:
- MangaPill's terms of service
- Copyright laws
- Rate limits and server resources

Do not use for commercial purposes or to harm the original website.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [MangaPill.com](https://mangapill.com) for providing manga content
- Express.js community
- TypeScript team
- All contributors

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/basirulakhlakborno/manga-scraper/issues)
- **Documentation**: [API Docs](http://localhost:3000/api/docs)
- **Email**: basirulakhlakborno@gmail.com

## 🗺️ Roadmap

- [ ] GraphQL API support
- [ ] WebSocket for real-time updates
- [ ] Database integration (PostgreSQL)
- [ ] Docker Compose setup
- [ ] Kubernetes deployment
- [ ] CI/CD pipeline
- [ ] Unit & integration tests
- [ ] API key authentication
- [ ] Request queuing system
- [ ] Enhanced error tracking (Sentry)

---

**Built with ❤️ by Basirul Akhlak Borno**

**Star ⭐ this repo if you find it helpful!**
