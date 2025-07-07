# Academic Portfolio Application

## Overview

This is a full-stack academic portfolio application built for machine learning engineer and AI researcher Laeeq Aslam. The application showcases research publications, citations, and professional work in a clean, academic-style interface.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom academic theme
- **Component Library**: Radix UI components with shadcn/ui
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless database
- **API Design**: RESTful endpoints for publications and citations
- **Session Management**: In-memory storage for development

### Project Structure
```
├── client/          # React frontend application
├── server/          # Express backend API
├── shared/          # Shared types and database schema
├── migrations/      # Database migration files
└── attached_assets/ # Static assets and HTML templates
```

## Key Components

### Database Schema
- **Users**: Basic user authentication (id, username, password)
- **Publications**: Research papers with metadata (title, authors, journal, year, citations, etc.)
- **Citations**: Aggregate citation tracking with timestamps

### API Endpoints
- `GET /api/publications` - Retrieve all publications
- `GET /api/publications/:type` - Filter publications by type (journal/conference)
- `GET /api/citations` - Get current citation count
- `POST /api/citations` - Update citation count (for Google Scholar integration)

### Frontend Pages
- **Home**: Hero section, about, research areas, packages, and contact
- **Publications**: Detailed publication listing with filtering and statistics
- **Navigation**: Responsive navigation with smooth scrolling

## Data Flow

1. **Publications Display**: Frontend fetches publication data from API endpoints
2. **Citation Tracking**: Real-time citation counts displayed across the application
3. **Research Showcase**: Static content with dynamic data integration
4. **Contact Form**: Client-side form handling with toast notifications

## External Dependencies

### Core Libraries
- **UI Components**: Radix UI primitives for accessibility
- **Styling**: Tailwind CSS for utility-first styling
- **Database**: Drizzle ORM for type-safe database operations
- **Validation**: Zod for schema validation
- **Date Handling**: date-fns for date manipulation

### Development Tools
- **TypeScript**: Full type safety across the stack
- **Vite**: Fast development server and build tool
- **ESBuild**: Production bundling for the server
- **PostCSS**: CSS processing with autoprefixer

## Deployment Strategy

### Development
- Vite dev server for frontend hot reloading
- tsx for running TypeScript server files
- Replit-specific plugins for cloud development

### Production
- Frontend builds to `dist/public` directory
- Backend bundles to `dist/index.js`
- Database migrations handled via Drizzle Kit
- Static file serving integrated with Express

### Database Management
- PostgreSQL dialect with Neon serverless provider
- Migration files generated in `./migrations` directory
- Schema definitions in `shared/schema.ts`

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 07, 2025. Initial setup
- July 07, 2025. Enhanced portfolio with:
  • Updated publication statistics (11 total: 8 journal + 3 conference)
  • Added PDF download functionality for all papers
  • Renamed Projects section to "Packages"
  • Added custom SVG images for Keras Swin UNet, Time Mesh, and Physics Informed AI
  • Enhanced package descriptions with detailed project information
  • Integrated real-time Google Scholar citation tracking
  • Added citation refresh functionality with 5-minute auto-refresh
  • Improved Publications page with better organization and statistics