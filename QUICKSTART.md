# MangaPill API Scraper - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web server framework
- `axios` - HTTP client for scraping
- `cheerio` - HTML parsing library
- `cors` - Enable CORS
- `tsx` - TypeScript executor
- `typescript` - TypeScript compiler

### Step 2: Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

### Step 3: Test the API

Open your browser or use curl:

```bash
# Homepage data
curl http://localhost:3000/api/homepage

# Search for manga
curl "http://localhost:3000/api/search?q=naruto"

# Get manga details
curl http://localhost:3000/api/manga/723

# Get chapter pages
curl http://localhost:3000/api/chapter/723-10230000
```

## 📖 Quick Examples

### Example 1: Get Homepage Data

```javascript
const response = await fetch('http://localhost:3000/api/homepage');
const data = await response.json();

console.log('Featured Chapters:', data.data.featuredChapters);
console.log('Trending Manga:', data.data.trendingManga);
```

### Example 2: Search and Read

```javascript
// Search
const search = await fetch('http://localhost:3000/api/search?q=chainsaw+man');
const searchData = await search.json();
const mangaId = searchData.data.results[0].id;

// Get details
const details = await fetch(`http://localhost:3000/api/manga/${mangaId}`);
const manga = await details.json();

// Get first chapter pages
const firstChapter = manga.data.chapters[0];
const chapterId = firstChapter.chapterUrl.split('/chapters/')[1];
const chapter = await fetch(`http://localhost:3000/api/chapter/${chapterId}`);
const pages = await chapter.json();

console.log('Pages:', pages.data.pages);
```

## 🔥 Common Use Cases

### Use Case 1: Display Recent Updates
```bash
curl "http://localhost:3000/api/chapters/recent?page=1"
```

### Use Case 2: Browse by Genre
```bash
curl "http://localhost:3000/api/genre/Action?page=1"
```

### Use Case 3: Advanced Search
```bash
curl "http://localhost:3000/api/search/advanced?genres=Action,Adventure&status=publishing"
```

### Use Case 4: Random Manga Discovery
```bash
curl "http://localhost:3000/api/manga/random"
```

## 📝 API Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/homepage` | GET | Get homepage data |
| `/api/manga/:id` | GET | Get manga details |
| `/api/chapter/:id` | GET | Get chapter pages |
| `/api/search` | GET | Search manga |
| `/api/search/advanced` | GET | Advanced search |
| `/api/genre/:genre` | GET | Search by genre |
| `/api/manga/new` | GET | Get new manga |
| `/api/chapters/recent` | GET | Get recent chapters |
| `/api/manga/random` | GET | Get random manga |
| `/api/docs` | GET | API documentation |
| `/health` | GET | Health check |

## 🛠️ Configuration

Edit `.env` file:
```env
PORT=3000
NODE_ENV=development
```

## 📚 Documentation

- Full Documentation: http://localhost:3000/api/docs
- Examples: See `examples.js` file
- README: See `README.md` for detailed guide

## 🐛 Troubleshooting

### Problem: Port already in use
**Solution:** Change PORT in `.env` file

### Problem: Module not found
**Solution:** Run `npm install`

### Problem: TypeScript errors
**Solution:** Run `npm run build` to check compilation

### Problem: API returns errors
**Solution:** Check MangaPill website is accessible

## 💡 Tips

1. **Use pagination** - Add `?page=2` to browse more results
2. **Check `/health`** - Verify server is running
3. **Read `/api/docs`** - Get detailed endpoint info
4. **Use examples.js** - See practical code examples
5. **Enable CORS** - Already configured for frontend use

## 🎯 Next Steps

1. ✅ Run the server
2. ✅ Test endpoints with curl or browser
3. ✅ Read the full README.md
4. ✅ Try the examples in examples.js
5. ✅ Build your manga application!

## 🔗 Useful Links

- Main README: `README.md`
- Code Examples: `examples.js`
- API Docs: http://localhost:3000/api/docs
- Source Code: `src/` directory

---

**Happy coding! 🚀**
