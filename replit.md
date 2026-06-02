# Overview

This is a comprehensive AI-powered legal and insurance assistant application for the Iranian market, branded as "Arman Law Firm" (موسسه حقوقی آرمان). The platform provides intelligent legal drafting, lawyer/notary finding, contract analysis, insurance services, and job assistance features. Built with React 19 and TypeScript, it leverages Google's Gemini AI API for natural language processing and document generation. The application supports both Persian (Farsi) RTL and English languages with full theming capabilities.

The platform serves both legal professionals and individuals seeking legal/insurance assistance, offering features like:
- Legal document drafting (petitions, contracts, complaints)
- Lawyer and notary finder with map integration
- Contract and evidence analysis
- Court assistant with live courtroom simulation
- Insurance policy analysis and claims drafting
- Resume analysis and job application tracking
- News summarization with legal context
- Corporate services (company name generation, articles of association)
- Content creation hub for social media
- Donation and booking systems

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React 19.1.1 with TypeScript 5.8.2
- Single-page application with component-based architecture
- State management using React hooks (useState, useEffect, useCallback, useRef)
- Immutable state updates via Immer for complex nested state objects
- Context API for global state (Language, Appearance/Theme)

**Routing**: Page-based navigation without traditional routing library
- Managed via `currentPage` state in App.tsx
- PageKey type union controls available pages
- Scroll-to-top on page transitions

**UI/UX Patterns**:
- Dark/Light theme support with multiple color scheme presets (7 themes including AI Lawyer, Legal, Official, etc.)
- RTL (Right-to-Left) support for Farsi language
- Responsive design with mobile-first approach
- Custom modal system for AI Guide, Settings, Quota Errors, Login, Booking, Donations
- Toast notification system for user feedback
- Dropzone integration for file uploads (documents, images)
- Camera input support for mobile evidence/document capture
- AI-powered suggestion system with debouncing

**State Management Strategy**:
- Main application state (`AppState` interface) centralized in App.tsx
- Checkpoint system for saving/restoring application state
- LocalStorage for persistence of checkpoints, theme preferences, CV drafts
- Auto-save mechanism with debouncing (5-second delay)
- Session-based state for temporary data (chat history, form inputs)

**Build System**: Vite 6.2.0
- Fast HMR and optimized production builds
- Port 5000 configured for development server
- Environment variable injection for API keys
- Path aliases (@/*) for cleaner imports

## AI Integration Architecture

**Primary AI Provider**: Google Gemini AI
- Models used: gemini-2.0-flash-exp (main), gemini-1.5-pro, gemini-1.5-flash
- API key managed via environment variables (GEMINI_API_KEY)
- Grounding with Google Search for real-time information
- Thinking mode support for complex reasoning tasks
- Multimodal capabilities (text, images, documents)

**AI Service Patterns**:
- Centralized service layer (`geminiService.ts`) for all AI operations
- Streaming responses for real-time user feedback
- Error handling with quota exhaustion detection
- Content safety filters and response validation
- Caching layer (`FastCache`) for repeated queries

**Key AI Features**:
- Legal document generation with structured prompts
- Web search integration for lawyer/notary finding
- Vision API for document/evidence analysis
- Image generation (Imagen 3)
- Text extraction from images (OCR)
- Chat-based assistance with conversation history
- Strategic planning with task breakdown
- Content adaptation for multiple social platforms

## Data Persistence

**Database**: Supabase (PostgreSQL)
- Client version: 2.45.0
- Used for: User authentication, case data storage, job applications, saved lawyers
- Real-time subscriptions for live updates
- Row-level security for multi-tenant data isolation

**LocalStorage Strategy**:
- Checkpoints: Full application state snapshots
- Theme preferences: Dark/light mode, color scheme, custom logo
- CV drafts: Auto-saved resume content
- Chat history: Recent conversations
- FastCache: AI response caching with TTL

**File Handling**:
- Base64 encoding for file uploads
- Support for: PDF, DOCX, images (JPEG, PNG, WEBP, HEIC)
- Document conversion: DOCX to text via mammoth.js
- HTML to DOCX export via html-to-docx

## Authentication & Authorization

**Authentication Provider**: Supabase Auth
- Email/password authentication
- Session management with JWT
- Login modal for user access
- No role-based access control (RBAC) implemented yet

**Authorization Pattern**:
- Client-side state for current user
- Feature access controlled by login status
- Admin dashboard separate from user dashboard
- No backend authorization layer visible in codebase

## Map & Geolocation

**Map Implementation**: Custom Google Maps-like interface
- Hardcoded location markers for law offices, notaries, courts, registry offices
- Category-based filtering
- Search functionality
- User location detection via browser geolocation API
- Distance calculation for nearest locations

**Location Data**:
- Static array of locations in MapFinder.tsx
- No dynamic fetching from database
- Coordinates stored as latitude/longitude pairs

# External Dependencies

## Third-Party Services

**Google Gemini API**
- Purpose: AI-powered text generation, document analysis, image generation
- API endpoint: Managed by @google/genai SDK
- Authentication: API key via environment variable
- Rate limiting: Quota exhaustion handling with user notifications

**Supabase**
- Purpose: Backend-as-a-Service for authentication and database
- Services used: Auth, PostgreSQL database, Real-time subscriptions
- Configuration: Client initialized with URL and anon key from environment

**Google Search (via Gemini Grounding)**
- Purpose: Real-time web search for lawyer/notary finding, news summarization
- Integration: Built into Gemini API calls with `tools: [{ googleSearch: {} }]`

**Cloudflare R2 (via URLs)**
- Purpose: Static asset hosting (images, logos)
- Access: Direct HTTPS URLs embedded in code

## NPM Packages

**Core Dependencies**:
- `react` & `react-dom` (19.1.1): UI framework
- `@google/genai` (1.17.0): Gemini AI SDK
- `@supabase/supabase-js` (2.45.0): Supabase client
- `immer` (10.1.3): Immutable state updates
- `nanoid` (5.1.6): Unique ID generation
- `lucide-react` (0.554.0): Icon library

**Document Processing**:
- `marked` (14.0.0): Markdown to HTML conversion
- `html-to-docx` (1.8.0): HTML to Word document export
- `mammoth` (1.7.2): DOCX to text/HTML conversion

**File Handling**:
- `react-dropzone` (14.3.8): Drag-and-drop file uploads

**Development Dependencies**:
- `vite` (6.2.0): Build tool and dev server
- `@vitejs/plugin-react` (5.0.0): React plugin for Vite
- `typescript` (5.8.2): Type checking
- `@types/node` (22.14.0): Node.js type definitions

## External APIs (Inferred)

**Payment Gateway** (Not Implemented)
- Purpose: Donations, booking payments
- Current state: Mock implementation with setTimeout

**WordPress Integration** (Component exists)
- Purpose: WordPressDashboard component suggests potential integration
- Current state: No active API calls visible

**Social Media Platforms** (Content generation targets)
- LinkedIn, Twitter/X, Instagram, Facebook
- Purpose: Content adaptation and scheduling
- Current state: Content generation only, no API posting

# Recent Changes

## December 2025 - SEO & Psychology Analysis Update

### SEO Improvements Added
- **robots.txt**: Added for search engine crawling guidance
- **sitemap.xml**: Added with all major pages for Google indexing
- **Canonical URL**: Prevents duplicate content issues
- **Theme Color**: Mobile browser appearance enhancement
- **Full OG Image URLs**: Social sharing images now work correctly
- **Enhanced Meta Tags**: Added googlebot, language, revisit-after, rating

### Psychology Analysis Theme
Keywords added for Farsi SEO:
- روانشناسی قانونی (Forensic Psychology)
- تحلیل روانشناختی (Psychological Analysis)
- روانشناسی جنایی (Criminal Psychology)
- پروفایل روانشناختی (Psychological Profiling)
- تحلیل رفتار (Behavior Analysis)
- روانپزشکی قانونی (Legal Psychiatry)
- ارزیابی روانشناختی (Psychological Assessment)

### Structured Data (Schema.org)
- **LegalService Schema**: With 4 services including psychology analysis
- **FAQPage Schema**: 3 psychology-related questions for Google snippets
- **Organization Schema**: Company info for Knowledge Panel

# Deployment

## Recommended Setup

| Component | Service | Cost |
|-----------|---------|------|
| Frontend | Cloudflare Pages | Free |
| Backend | Render.com | Free tier |
| Database | Supabase | Free tier |

See `saved-hstory-of-armanlawfirmir-based-of-adl-pendar-based-of/README.md` for detailed deployment instructions.

## WordPress-Like Features

This app is **NOT a WordPress replacement**. It's an AI-powered legal assistant.

| Has | Does Not Have |
|-----|---------------|
| Content creation (AI) | Visual page editor |
| Theme system | Plugin system |
| User accounts | Multi-user roles |
| File uploads | Media library |
| Dark/Light mode | SEO dashboard |