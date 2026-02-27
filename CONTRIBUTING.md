# Contributing to MangaPill API Scraper

First off, thank you for considering contributing to MangaPill API Scraper! 🎉

## Code of Conduct

This project and everyone participating in it is governed by respect and professionalism. Please be kind and courteous to others.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if applicable**
- **Mention your environment** (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternative solutions or features you've considered**

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Follow the coding style** of the project
3. **Add tests** if applicable
4. **Update documentation** if needed
5. **Ensure tests pass**
6. **Write a good commit message**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/mangapill-scraper.git

# Install dependencies
npm install

# Create a branch
git checkout -b feature/my-new-feature

# Make your changes and test
npm run dev

# Build and test
npm run build
```

## Coding Style

- Use TypeScript
- Follow existing code structure
- Use meaningful variable names
- Add comments for complex logic
- Keep functions focused and small
- Use async/await over promises

## Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests after the first line

Example:
```
Add support for bookmarks feature

- Implement bookmark storage
- Add API endpoint for bookmarks
- Update documentation

Closes #123
```

## Project Structure

Please maintain the modular architecture:

```
src/
├── config/       # Configuration
├── controllers/  # Request handlers
├── extractors/   # Data extraction
├── middleware/   # Express middleware
├── routes/       # Route definitions
├── services/     # Business logic
└── utils/        # Utilities
```

## Testing

- Write tests for new features
- Ensure existing tests pass
- Test manually before submitting PR

## Documentation

- Update README.md if needed
- Add JSDoc comments to functions
- Update API documentation
- Include examples for new features

## Questions?

Feel free to open an issue with your question!

Thank you for contributing! 🙏
