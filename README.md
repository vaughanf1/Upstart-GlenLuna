# Idea Browser MVP

A full-stack web application that helps users discover and score startup ideas using data-driven insights. Built with Next.js 14, TypeScript, and PostgreSQL.

## Features

- 🎯 **Data-Driven Scoring**: AI-powered scoring system using multiple market signals
- 📊 **Comprehensive Analytics**: Score breakdowns with trend, search, community, news, competition, and quality metrics
- 🎨 **Clean UI**: Modern, responsive design inspired by Apple's aesthetic
- 🔐 **Authentication**: Secure user accounts with role-based access
- 👑 **Admin Panel**: Full CRUD operations for managing ideas and users
- 🔍 **Advanced Search**: Filter and search ideas by tags, difficulty, type, and score
- 📱 **Mobile-First**: Responsive design that works on all devices
- 🧪 **Full Test Coverage**: Unit tests with Vitest and E2E tests with Playwright

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend**: Next.js API routes, Zod validation
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Scoring**: Mock signal adapters + optional n8n integration
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Styling**: TailwindCSS with custom design system

## Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Git

### Installation

1. **Clone and install**:
   ```bash
   git clone <repository-url>
   cd idea-browser
   pnpm install
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database URL and secrets
   ```

3. **Database setup**:
   ```bash
   pnpm db:push      # Create database schema
   pnpm db:seed      # Seed with sample data
   ```

4. **Start development server**:
   ```bash
   pnpm dev
   ```

Visit `http://localhost:3000` to see the application.

## Default Accounts

After seeding, you can use these accounts:

- **Admin**: `admin@ideabrowser.com` / `admin123`
- **User**: `user@example.com` / `user123`

## Available Scripts

### Development
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Database
- `pnpm db:push` - Push schema changes to database
- `pnpm db:seed` - Seed database with sample data
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:generate` - Generate Prisma client

### Testing
- `pnpm test` - Run unit tests with Vitest
- `pnpm test:ui` - Run tests with UI
- `pnpm test:coverage` - Run tests with coverage
- `pnpm e2e` - Run E2E tests with Playwright

## Project Structure

```
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── admin/             # Admin panel
│   │   ├── api/               # API routes
│   │   ├── ideas/             # Ideas catalog & detail pages
│   │   └── idea-of-the-day/   # Daily idea feature
│   ├── components/            # Reusable UI components
│   ├── lib/                   # Core utilities
│   │   ├── auth/              # Authentication logic
│   │   ├── scoring/           # Scoring algorithms
│   │   ├── signals/           # Mock data adapters
│   │   └── validations/       # Zod schemas
│   └── types/                 # TypeScript type definitions
├── prisma/                    # Database schema & migrations
├── e2e/                       # Playwright E2E tests
└── public/                    # Static assets
```

## Scoring System

The application uses a deterministic scoring algorithm that combines 6 metrics:

- **Trend (28%)**: 12-month growth trends and volatility
- **Search (22%)**: Monthly search volume and growth rates
- **Community (18%)**: Reddit/HN mentions and engagement
- **News (14%)**: Article volume with recency decay
- **Competition (10%)**: Number of competitors (inverted)
- **Quality (8%)**: Metadata completeness

### Local vs n8n Mode

The app supports two scoring modes:

1. **Local Mode** (default): Uses deterministic mock data generators
2. **n8n Mode**: Integrates with n8n workflows for real data collection

Set `SCORING_MODE=n8n` in your environment to enable n8n integration.

## API Endpoints

### Public
- `GET /api/ideas` - List ideas with filtering
- `GET /api/ideas/[slug]` - Get idea details

### Authenticated
- `POST /api/bookmarks` - Toggle bookmark

### Admin Only
- `POST /api/admin/ideas` - Create idea
- `POST /api/ideas/[slug]/refresh` - Refresh idea score

### Webhooks
- `POST /api/hooks/score-update` - Receive score updates from n8n

## Database Schema

The application uses PostgreSQL with the following key models:

- **User**: Authentication and profile data
- **Role**: User roles (admin, member)
- **Idea**: Core startup idea data with scoring
- **Bookmark**: User bookmarks
- **DailyIdea**: Featured daily ideas
- **Log**: System activity logs

## Deployment

### Environment Variables

Required for production:

```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="secure-random-string"
NEXTAUTH_URL="https://yourdomain.com"
SCORING_MODE="local"  # or "n8n"
```

### Build & Deploy

```bash
pnpm build
pnpm start
```

The app is ready for deployment on Vercel, Railway, or any Node.js hosting platform.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run tests: `pnpm test && pnpm e2e`
5. Commit and push: `git commit -m "Add feature" && git push`
6. Create a Pull Request

## License

MIT License - see LICENSE file for details.

## Support

For questions or issues:
- Create an issue in this repository
- Check the documentation in the `/docs` folder
- Review the test files for usage examples

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.