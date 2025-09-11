# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Testing
No specific test commands are configured in this project.

## Architecture Overview

This is a Next.js 14 application using the App Router architecture for a "Mysterria Archive" - a collaborative forum for cataloging Lord of The Mysteries items.

### Key Technologies
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system and dark mode
- **State Management**: Zustand for client state, TanStack Query for server state
- **UI Components**: Radix UI primitives with custom component library
- **Forms**: React Hook Form with Zod validation

### Project Structure

- `app/` - Next.js App Router pages and layouts
  - Route structure: items, researchers, pathways, types
  - Uses dynamic routes for item details and editing
- `components/` - Reusable UI components
  - `ui/` - Base UI components (buttons, cards, forms, etc.)
  - `layout/` - Header and Footer components
  - `items/`, `comments/`, `researcher/` - Feature-specific components
- `lib/` - Shared utilities and business logic
  - `api/` - API client functions for each entity
  - `hooks/` - Custom React Query hooks for data fetching
  - `store/` - Zustand stores for client state
  - `types/` - TypeScript type definitions
  - `utils.ts` - Utility functions including Tailwind class merging

### Data Model
The application manages several interconnected entities:
- **Items**: Main entities with name, description, purpose, rarity levels
- **Researchers**: Users who create and comment on items
- **Pathways**: Categorization system with sequence numbers
- **Types**: Item classification with optional icons
- **Comments**: User discussions on items

### API Integration
- Uses a custom `fetcher` utility in `lib/api/client.ts`
- API proxied through Next.js rewrite rules to `localhost:8080`
- All API calls wrapped in TanStack Query hooks for caching and state management

### Styling System
- Custom Tailwind configuration with CSS variables for theming
- Custom rarity color system (common, uncommon, rare, epic, legendary, mythical)
- Dark mode enabled by default
- Radix UI components for accessibility

### State Management Patterns
- Server state: TanStack Query with 60s stale time
- Client state: Zustand stores (filter state, researcher selection)
- Form state: React Hook Form with Zod validation

### Notable Configurations
- TypeScript with strict mode and Next.js plugin
- Path aliases: `@/*` maps to root directory
- Image domains configured for localhost
- SWC minification enabled