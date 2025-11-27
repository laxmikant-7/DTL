# Citizen Grievance Portal

## Overview

The Citizen Grievance Portal is a civic application designed for citizens to submit, track, and manage complaints related to public services. The system supports multiple complaint categories (electricity, water, roads, waste management, and other) and provides a dual-interface architecture for both citizens and government officers. The application emphasizes accessibility, clarity, and trust with multilingual support (English, Kannada, Hindi, Tamil) and follows Material Design principles adapted for government services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server.

**UI Component System**: Shadcn UI (New York style variant) built on Radix UI primitives with Tailwind CSS for styling. The component library provides a comprehensive set of accessible, customizable components including forms, dialogs, tables, navigation, and data display elements.

**Design System**: Material Design adapted for government services, prioritizing clarity over aesthetics. Uses Roboto font family for excellent multilingual support. Implements a responsive layout system with mobile-first approach using Tailwind spacing units.

**State Management**: 
- TanStack Query (React Query) for server state management and caching
- React Context API for cross-cutting concerns (authentication, language selection)
- React Hook Form with Zod validation for form state

**Routing**: Wouter for lightweight client-side routing with protected route patterns for role-based access control.

**Key Architectural Decisions**:
- **Two-tier user system**: Citizens and officers with separate authentication flows and dashboards
- **Protected routes**: Implements route guards for authenticated-only pages and role-specific pages (officer dashboard)
- **Internationalization**: Context-based translation system supporting 4 languages without external i18n library
- **Accessibility-first**: WCAG 2.1 AA compliance target with semantic HTML and ARIA patterns

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js.

**Authentication**: Passport.js with local strategy using session-based authentication. Passwords are hashed using scrypt with salt. Sessions are managed with express-session.

**Session Storage**: Configurable session store using either in-memory storage (MemoryStore for development) or connect-pg-simple for PostgreSQL-backed sessions in production.

**API Design**: RESTful API endpoints following resource-based patterns:
- `/api/user` - Current user information
- `/api/login` - Authentication
- `/api/register` - User registration (citizens and officers)
- `/api/complaints` - CRUD operations for complaints
- `/api/complaints/track/:complaintId` - Public complaint tracking

**Data Layer**: In-memory storage implementation (MemStorage) with interface design (IStorage) that allows for easy migration to database-backed storage. The abstraction separates storage concerns from business logic.

**Key Architectural Decisions**:
- **Session-based auth over JWT**: Better suited for server-rendered or hybrid applications with automatic CSRF protection
- **Storage abstraction**: IStorage interface pattern enables switching between in-memory and database storage without code changes
- **Role-based access**: User roles (citizen/officer) with department assignments for officers
- **Human-readable IDs**: Complaint IDs use format "GRP-2024-001" for better user communication

### Data Storage Solutions

**ORM**: Drizzle ORM configured for PostgreSQL, providing type-safe database queries and schema management.

**Database**: PostgreSQL (Neon serverless) with schema defined in `shared/schema.ts`:
- **users table**: Stores user credentials, profile info, role, and department (for officers)
- **complaints table**: Stores complaint details with status tracking (submitted → in_progress → resolved)
- **complaint_notes table**: Stores officer notes and updates on complaints

**Schema Design Decisions**:
- UUID primary keys for all tables using `gen_random_uuid()`
- Separate complaint ID field for human-readable tracking numbers
- Text-based enums for categories and statuses (validated by Zod schemas)
- Timestamps for created/updated tracking
- Foreign key relationships maintained through ORM

**Migration Strategy**: Drizzle Kit for schema migrations with push-based deployment (`db:push` script).

**Current Implementation**: Dual storage system - in-memory MemStorage class for development/testing alongside database schema definitions for production deployment.

### External Dependencies

**UI Component Libraries**:
- Radix UI primitives (accordion, alert-dialog, avatar, checkbox, dialog, dropdown-menu, etc.)
- Embla Carousel for carousel components
- Lucide React for iconography

**Form Management**:
- React Hook Form for form state management
- @hookform/resolvers for Zod schema integration
- Zod for runtime validation and type generation

**Database & ORM**:
- Drizzle ORM for type-safe database operations
- @neondatabase/serverless for PostgreSQL connection
- drizzle-zod for generating Zod schemas from Drizzle schemas

**Authentication**:
- Passport.js with passport-local strategy
- express-session for session management
- connect-pg-simple for PostgreSQL session store
- Node.js crypto module for password hashing (scrypt)

**Styling**:
- Tailwind CSS for utility-first styling
- class-variance-authority for component variant management
- clsx and tailwind-merge for conditional class composition

**Date Handling**: date-fns for date formatting and manipulation

**Development Tools**:
- Vite for development server and build tooling
- TypeScript for type safety
- TSX for running TypeScript in Node.js
- ESBuild for server-side bundling

**Font Loading**: Google Fonts CDN for Roboto font family (multiple weights and styles)

**Design Considerations**:
- All dependencies chosen for accessibility support
- Minimal bundle size considerations (wouter over react-router, cmdk for command palette)
- Server-side bundling with allowlist to reduce cold start times in production