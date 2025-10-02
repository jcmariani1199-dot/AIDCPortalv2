# AI DC & Cloud Network Portal

## Overview

AI DC & Cloud Network Portal is a modern, visually stunning web application for managing and viewing spreadsheet data (706+ records). Built with React and Express, it provides an intuitive interface for uploading Excel files, advanced Excel-style multi-select column filters with keyword search, interactive visualizations with Top 40 drill-down features, editable 'First Contact Y/N' field, and a Neo Cloud Positioning survey form with Nokia branding. The application emphasizes clarity, performance, and data readability with a premium dark-mode aesthetic inspired by Linear and Notion.

## Recent Changes (October 2025)

### Neo Cloud Form Enhancement ✓ (Latest)
- **New Fields**: Added "Organisation Name" and "Contact Name" fields to the top of the Neo Cloud Positioning form
- **Email Integration**: Both fields are automatically included in the email submission
- **Layout**: Fields appear in a 2-column grid above the playbook tabs

### Authentication System ✓
- **Login Protection**: App now requires authentication before access
- **Credentials**: Username: Nokia / Password: qIdhed-hoccek-zukwe1
- **Session Management**: 24-hour session using express-session
- **Logout**: Logout button in top bar to end session
- **Secure**: Server-side session validation with cookie-based authentication

### Top 40 Report Enhancements ✓
- **Improved Tooltips**: Hover over bars shows company name and score
- **Cleaner Display**: Removed X-axis labels to reduce clutter
- **Hover-Only Info**: Information displayed only on rollover (like pie charts)

### Excel-Style Multi-Select Column Filters ✓
- **Keyword Search**: Each column filter has a search input to quickly find specific values within the filter
- **Select All Checkbox**: Select/deselect all filtered options with indeterminate state for partial selections
- **Multi-Value Selection**: Multiple values can be selected per column using checkboxes
- **Dynamic Counts**: Each option shows the count of matching records, updated based on other active filters
- **Filter Logic**: OR within column (match ANY selected value), AND across columns (match ALL column filters)
- **Performance**: Debounced search (300ms), optimized count computation using Map for O(m) complexity
- **Clear Actions**: Clear button inside popover and quick X button on trigger badge
- **Count Badge**: Shows number of selected values on the filter trigger button

### Other Recent Updates
- Renamed application from "Portal Data Console" to "AI DC & Cloud Network Portal"
- Removed download button from top bar per user request
- Fixed critical filter bugs: checkbox double-toggle issue and indeterminate state implementation
- All interactive elements have proper data-testid attributes for testing

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**UI Component System**: The application uses shadcn/ui components built on Radix UI primitives, providing accessible and customizable components. The design system follows a "New York" style variant with custom theming through CSS variables.

**State Management**: Client-side state is managed through React hooks (useState, useEffect). Server state and data fetching is handled by TanStack Query (React Query) for efficient caching and synchronization.

**Routing**: Wouter is used for lightweight client-side routing. The application currently has a single main dashboard route with a 404 fallback.

**Styling**: Tailwind CSS with a custom configuration supporting dark mode by default. The design system uses HSL color values with CSS custom properties for theming. Custom spacing units (2, 4, 6, 8, 12, 16) ensure visual consistency.

**Key Design Decisions**:
- Dark mode as the default theme with a deep navy-black background (220 15% 8%)
- Typography uses Inter for UI text and JetBrains Mono for data values
- All interactive elements have defined hover/active states with elevation effects
- Component isolation with example files for each major component

### Backend Architecture

**Framework**: Express.js running on Node.js with TypeScript.

**Server Structure**: The backend follows a modular architecture with separated concerns:
- `server/index.ts`: Main application entry point with middleware configuration
- `server/routes.ts`: API route registration (currently minimal, returns HTTP server)
- `server/storage.ts`: Data persistence layer with an interface-based design

**Storage Layer**: Implements an `IStorage` interface with an in-memory implementation (`MemStorage`). This abstraction allows easy swapping to database-backed storage without changing application logic. Currently includes basic user CRUD operations.

**Middleware Stack**:
- Express JSON and URL-encoded body parsing
- Static file serving for attached assets
- Request logging with timing information for API routes
- Development-specific Vite middleware for HMR and module resolution

**Development vs Production**: The application uses different build processes - `tsx` for development with hot reloading, and `esbuild` for production bundling with ESM output.

### Data Storage Solutions

**Current State**: The application uses in-memory storage (`MemStorage`) for user data and client-side state for Excel data.

**Database Setup (Configured but not actively used)**:
- Drizzle ORM configured with PostgreSQL dialect
- Schema defined in `shared/schema.ts` with a users table
- Neon Database serverless driver integrated
- Migration system in place via `drizzle-kit`

**Excel Data Handling**: Client-side parsing of Excel files using the XLSX library. Uploaded files are converted to JSON format with auto-generated row IDs. Data remains in browser memory and can be exported back to Excel format.

**Rationale**: The separation between configured database infrastructure and in-memory storage suggests the application is designed to scale from a simple demo to a production system. The storage interface pattern enables this transition without refactoring application logic.

### External Dependencies

**UI Framework & Components**:
- React 18 with TypeScript for type safety
- Radix UI primitives for accessible component foundations
- shadcn/ui component library (New York style variant)
- Tailwind CSS for utility-first styling with custom design tokens

**Data Visualization**:
- Recharts for interactive charts (bar charts, pie charts)
- Custom visualization components (ReportModal) for data insights

**Data Processing**:
- XLSX (SheetJS) for Excel file parsing and generation
- date-fns for date manipulation
- Zod for runtime schema validation

**Database & ORM** (configured):
- Drizzle ORM for type-safe database queries
- @neondatabase/serverless for PostgreSQL connectivity
- drizzle-zod for schema-to-Zod validation

**Development Tools**:
- Vite with React plugin for fast development
- Replit-specific plugins (cartographer, dev-banner, runtime-error-modal)
- TypeScript with strict mode enabled
- ESBuild for production builds

**Routing & State**:
- Wouter for lightweight client-side routing
- TanStack Query for server state management
- Nanoid for unique ID generation

**Form Handling**:
- React Hook Form with Hookform Resolvers for validation integration

**Rationale**: The dependency choices prioritize developer experience, type safety, and modern React patterns. The use of shadcn/ui provides flexibility since components are copied into the project rather than imported from a package, allowing full customization. The lightweight routing and build tools (Wouter, Vite) ensure fast development iteration.