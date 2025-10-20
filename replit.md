# Bingo 2025 - Personal Resolutions Tracker

## Overview

Bingo 2025 is a web application that allows users to create and track personal resolutions in a visual bingo card format. Users can create customizable grids (3x3, 3x4, 4x4, or 5x5) with their resolutions, shuffle them, and track their progress. The application features a static showcase page displaying a pre-filled bingo card with specific 2025 goals.

The application is built as a full-stack TypeScript application with a React frontend and Express backend, designed for deployment on Vercel.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework:** React 18 with TypeScript, built using Vite as the build tool.

**Routing:** Uses `wouter` for lightweight client-side routing with two main routes:
- `/` - Home page with resolution form and interactive bingo card creator
- `/bingo-2025` - Static showcase page with pre-filled bingo goals

**State Management:** 
- Local component state using React hooks (useState, useEffect)
- TanStack Query (React Query) for server state management
- LocalStorage for persisting user-created bingo cards between sessions

**UI Component Library:** Radix UI primitives with a custom component library built on shadcn/ui patterns. Uses Tailwind CSS for styling with a custom theme configuration supporting light mode with a vibrant color scheme (primary: yellow/gold hsl(45, 100%, 50%)).

**Animation:** Framer Motion for smooth UI transitions and interactions.

**Form Handling:** React Hook Form with Zod validation for type-safe form inputs.

**Key Design Decision:** The application transitioned from a database-backed solution to a fully client-side approach using localStorage. This simplifies deployment, eliminates backend complexity for user data, and provides instant persistence without server round-trips.

### Backend Architecture

**Framework:** Express.js with TypeScript, compiled using esbuild for production.

**Server Structure:** Minimal API server that primarily serves the static frontend. The backend does not currently implement any active API endpoints - the `/api` routes exist but are empty.

**Development vs Production:**
- Development: Uses Vite's middleware mode for hot module replacement
- Production: Serves pre-built static files from `dist/public`

**Key Design Decision:** The server has been intentionally simplified. Authentication and database features were removed in favor of a client-only architecture. The Express server now exists primarily to serve static files and could potentially be replaced with a pure static hosting solution.

### Data Storage Solutions

**Current Approach:** Browser LocalStorage for persisting user-created bingo cards.

**Storage Schema:**
```typescript
{
  resolutions: Array<{ id: string, text: string }>,
  gridSize: "3x3" | "3x4" | "4x4" | "5x5",
  showPreview: boolean
}
```

**Historical Context:** The application previously used Drizzle ORM with plans for PostgreSQL (references remain in package.json), but this was removed in favor of the simpler client-side storage approach.

**Trade-offs:**
- **Pros:** No server costs, instant persistence, no authentication needed, works offline
- **Cons:** Data is device-specific, no cross-device sync, limited storage capacity

### Authentication and Authorization

**Current State:** No authentication system. The application previously had admin authentication (`server/auth.ts`, `/api/admin4768932/` endpoints) which has been removed.

**Admin Page:** An admin page exists in the codebase (`client/src/pages/admin.tsx`) but is not accessible through the current routing configuration. The `useUser` hook returns null for all authentication checks.

**Key Design Decision:** Authentication was intentionally removed to simplify the application. The showcase page (`/bingo-2025`) displays static content that doesn't require user accounts.

### Build and Deployment

**Build Process:**
- Frontend: Vite builds React application to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js`

**Deployment Target:** Vercel with custom build configuration:
- Two build sources: server (Node.js) and client (static build)
- API routes (`/api/*`) handled by server
- All other routes serve the SPA with client-side routing fallback

**Environment:** Production mode uses `NODE_ENV=production`, no other environment variables are required for core functionality.

## External Dependencies

### Third-Party UI Libraries
- **Radix UI:** Comprehensive set of unstyled, accessible component primitives (accordion, dialog, dropdown, popover, etc.)
- **Tailwind CSS:** Utility-first CSS framework with PostCSS and Autoprefixer
- **Framer Motion:** Animation library for React components
- **cmdk:** Command menu component
- **Embla Carousel:** Carousel/slider component library
- **Lucide React:** Icon library

### Form and Validation
- **React Hook Form:** Form state management and validation
- **Zod:** TypeScript-first schema validation
- **@hookform/resolvers:** Resolvers for integrating Zod with React Hook Form

### Utilities
- **nanoid:** Unique ID generation for resolutions
- **date-fns:** Date manipulation and formatting
- **html2canvas:** Convert DOM elements to canvas for image export functionality
- **class-variance-authority:** Utility for managing component variants
- **clsx & tailwind-merge:** Utility for merging Tailwind CSS classes

### Development Tools
- **Vite:** Frontend build tool and dev server
- **@vitejs/plugin-react:** React support for Vite
- **@replit/vite-plugin-shadcn-theme-json:** Custom theme configuration plugin
- **@replit/vite-plugin-runtime-error-modal:** Development error overlay
- **TypeScript:** Type checking and compilation
- **tsx:** TypeScript execution for development server
- **esbuild:** Fast JavaScript bundler for production server build

### Analytics and Monitoring
- **@vercel/analytics:** Vercel's analytics integration for tracking page views and performance

### Legacy Dependencies
The following dependencies remain in package.json but are not actively used:
- **drizzle-orm & drizzle-zod:** Previously used for database interactions
- **drizzle-kit:** Database migration tool (script exists: `db:push`)

### Routing
- **wouter:** Lightweight routing library for React (alternative to react-router)

**Note:** The application does not currently use a database, but Drizzle ORM remains as a dependency. Future implementations may add PostgreSQL with Drizzle if server-side data persistence becomes necessary.