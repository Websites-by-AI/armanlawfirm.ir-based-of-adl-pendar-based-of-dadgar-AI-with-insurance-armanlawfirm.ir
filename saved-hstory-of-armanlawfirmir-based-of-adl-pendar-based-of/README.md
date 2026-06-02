# موسسه حقوقی آرمان — Arman Law Firm
### هوش مصنوعی حقوقی، بیمه و روانشناسی | AI Legal, Insurance & Psychology Platform

<div align="center">

[![Deploy to Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?style=for-the-badge&logo=cloudflare)](https://pages.cloudflare.com)
[![Run on Replit](https://img.shields.io/badge/Run%20on-Replit-667881?style=for-the-badge&logo=replit)](https://replit.com/github/Heroku-elasa/armanlawfirm.ir-based-of-adl-pendar-based-of-dadgar-AI-with-insurance-armanlawfirm.ir)
[![GitHub](https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/Heroku-elasa/armanlawfirm.ir-based-of-adl-pendar-based-of-dadgar-AI-with-insurance-armanlawfirm.ir)

**Live:** https://armanlawfirm.ir

</div>

---

## ✨ Features / ویژگی‌ها

| Feature | Persian | Description |
|---------|---------|-------------|
| 🤖 AI Legal Drafter | تنظیم دادخواست | Generate petitions, contracts & complaints with AI |
| 🔍 Lawyer Finder | وکیل‌یاب | Find verified lawyers by specialty & location |
| 🗺️ Map Finder | نقشه‌یاب | Interactive map of law offices, courts & notaries |
| 📋 Contract Analyzer | تحلیلگر قرارداد | AI analysis of contracts for risk & issues |
| 🔬 Evidence Analyzer | تحلیلگر مدارک | Analyze documents, images & evidence with AI |
| ⚖️ Court Assistant | دستیار دادگاه | Live courtroom AI assistant with real-time rebuttals |
| 📰 News Summarizer | خلاصه اخبار | Legal news summarized with AI |
| 🏢 Corporate Services | خدمات شرکتی | Company registration, name generation, articles of association |
| 🛡️ Insurance Services | خدمات بیمه | Policy analysis, claims drafting, Diyeh calculation |
| 📄 Resume Analyzer | تحلیلگر رزومه | AI-powered resume scoring & improvement |
| 💼 Job Assistant | دستیار شغلی | Tailored resume & cover letter per job posting |
| 📱 Content Hub | تولید محتوا | Social media content for LinkedIn, Instagram, X |
| 🧠 Psychology Analysis | تحلیل روانشناختی | Forensic psychology profiling & behavioral analysis |
| 🌐 Notary Finder | دفترخانه‌یاب | Find notaries with live web search |
| 📊 Case Strategist | استراتژی پرونده | AI case strategy with task breakdown |
| 🎁 Faryadresi | فریادرسی | Legal aid donation system |
| 📅 Booking | رزرو مشاوره | Appointment booking (in-person, Meet, WhatsApp) |
| 🌙 Themes | تم | 7 color schemes, dark/light, full RTL Persian |
| 🔐 Auth | احراز هویت | Supabase email/password authentication |

---

## 🚀 Run on Replit — from GitHub (One Click)

### Method 1: Import Button
Click this link to instantly clone and run on Replit:

**https://replit.com/github/Heroku-elasa/armanlawfirm.ir-based-of-adl-pendar-based-of-dadgar-AI-with-insurance-armanlawfirm.ir**

### Method 2: Manual Import on Replit
1. Go to [replit.com](https://replit.com) → **Create Repl** → **Import from GitHub**
2. Paste the GitHub URL:
   ```
   https://github.com/Heroku-elasa/armanlawfirm.ir-based-of-adl-pendar-based-of-dadgar-AI-with-insurance-armanlawfirm.ir
   ```
3. Replit auto-detects Node.js. After import, open the **Shell** tab and run:
   ```bash
   cd saved-hstory-of-armanlawfirmir-based-of-adl-pendar-based-of
   bash setup.sh
   ```
4. Add **Secrets** (left sidebar → 🔒 Secrets):

   | Secret Key | Value |
   |------------|-------|
   | `GEMINI_API_KEY` | your Google AI key from [ai.google.dev](https://ai.google.dev) |
   | `SUPABASE_URL` | your Supabase project URL |
   | `SUPABASE_ANON_KEY` | your Supabase anon key |

5. Click **Run ▶️** — app opens at port **5000**

> The `.replit` file at root is pre-configured: it runs `npm run dev` inside the correct subfolder automatically.

---

## 💻 Run Locally

```bash
# 1. Clone
git clone https://github.com/Heroku-elasa/armanlawfirm.ir-based-of-adl-pendar-based-of-dadgar-AI-with-insurance-armanlawfirm.ir.git
cd armanlawfirm.ir-based-of-adl-pendar-based-of-dadgar-AI-with-insurance-armanlawfirm.ir

# 2. Enter project
cd saved-hstory-of-armanlawfirmir-based-of-adl-pendar-based-of

# 3. Install
npm install

# 4. Configure environment
cp .env.example .env
# Open .env and fill in your API keys

# 5. Start
npm run dev
```

**Frontend:** http://localhost:5000  
**Backend API:** http://localhost:3001

---

## ☁️ Deploy to Cloudflare Pages (Free, Production-Ready)

### Architecture on Cloudflare
```
GitHub ──► Cloudflare Pages
                │
                ├── /dist           → Static React app (Global CDN)
                └── /functions/api  → Serverless Edge Functions
                                      (no separate server needed!)
```

### Step 1: Connect GitHub
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. **Create a project** → **Connect to Git** → select this repository

### Step 2: Build Configuration

> ✅ `wrangler.toml` at the repo root auto-configures the build — just fill in the table below exactly as shown.

| Setting | Value |
|---------|-------|
| **Project name** | `armanlawfirm` |
| **Production branch** | `main` |
| **Framework preset** | `None` |
| **Root directory** | *(leave blank — use repo root)* |
| **Build command** | `npm run build` |
| **Build output directory** | `saved-hstory-of-armanlawfirmir-based-of-adl-pendar-based-of/dist` |

### Step 3: Environment Variables
Go to **Settings → Environment Variables → Add variable**:

| Variable | Value | Type |
|----------|-------|------|
| `GEMINI_API_KEY` | your Google Gemini key | **Secret** |
| `SUPABASE_URL` | your Supabase URL | Plain |
| `SUPABASE_ANON_KEY` | your Supabase anon key | **Secret** |
| `NODE_VERSION` | `20` | Plain |

### Step 4: Custom Domain (Optional)
**Settings → Custom domains → Add domain** → enter `armanlawfirm.ir`

### Step 5: Deploy
Click **Save and Deploy** — done! ✅

Your URLs:
- Default: `https://armanlawfirm.pages.dev`
- Custom: `https://armanlawfirm.ir`

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
# ─── Required ────────────────────────────────────────────────
# Google Gemini AI (get free key at https://ai.google.dev)
GEMINI_API_KEY=AIza...your_key_here

# Supabase — database & auth (https://supabase.com → Settings → API)
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...your_anon_key_here

# ─── Optional ────────────────────────────────────────────────
NODE_ENV=development
PORT=3001
```

---

## 🏗️ Project Structure

```
saved-hstory-of-armanlawfirmir-based-of-adl-pendar-based-of/
│
├── 📄 index.html                   # HTML entry (RTL, Persian SEO meta tags)
├── 📄 index.tsx                    # React app bootstrap
├── 📄 App.tsx                      # Root: routing, global state, all modals
├── 📄 types.ts                     # TypeScript types + Language/Theme context
├── 📄 constants.ts                 # ALL text (FA + EN), configs, static data
├── 📄 vite.config.ts               # Vite: port 5000, proxy /api → 3001
├── 📄 wrangler.toml                # Cloudflare Pages config
├── 📄 setup.sh                     # Quick setup script (Replit / new clone)
├── 📄 .env.example                 # Environment variable template
├── 📄 tsconfig.json                # TypeScript config
│
├── 📁 components/                  # All React UI pages & components
│   ├── Hero.tsx                    # Home: hero, stats, services, map, FAQ
│   ├── Header.tsx                  # Top navigation bar
│   ├── Footer.tsx                  # Footer links & info
│   ├── LegalDrafter.tsx            # ✍️  AI petition/contract generator
│   ├── LawyerFinder.tsx            # 🔍 Lawyer search (AI + Google Search)
│   ├── NotaryFinder.tsx            # 🔍 Notary office search
│   ├── MapFinder.tsx               # 🗺️  Interactive map (law offices, courts)
│   ├── LeafletMapComponent.tsx     # Leaflet map wrapper
│   ├── ContractAnalyzer.tsx        # 📋 Contract risk analysis
│   ├── EvidenceAnalyzer.tsx        # 🔬 Evidence/document AI analysis
│   ├── CourtAssistant.tsx          # ⚖️  Live courtroom AI assistant
│   ├── NewsSummarizer.tsx          # 📰 Legal news summarizer
│   ├── CaseStrategist.tsx          # 📊 Case strategy planner
│   ├── InsuranceServices.tsx       # 🛡️  Insurance tools (Diyeh, claims)
│   ├── CorporateServices.tsx       # 🏢 Company registration tools
│   ├── ContentHubPage.tsx          # 📱 Social media content generator
│   ├── ResumeAnalyzer.tsx          # 📄 Resume scoring & improvement
│   ├── JobAssistant.tsx            # 💼 Job application & CV builder
│   ├── FaryadresiPage.tsx          # 🎁 Legal aid / donation page
│   ├── PricingPage.tsx             # 💰 Pricing & service plans
│   ├── Blog.tsx                    # 📝 Legal articles & blog
│   ├── Dashboard.tsx               # 👤 User dashboard
│   ├── AdminDashboard.tsx          # 🔧 Admin control panel
│   ├── GeneralQuestions.tsx        # ❓ FAQ page
│   ├── AIGuideModal.tsx            # 🤖 AI smart guide modal
│   ├── BookingModal.tsx            # 📅 Appointment booking modal
│   ├── DonationModal.tsx           # 💝 Donation modal
│   ├── LoginModal.tsx              # 🔐 Login / register modal
│   ├── SettingsModal.tsx           # ⚙️  Theme & settings modal
│   ├── Toast.tsx                   # 🔔 Toast notification system
│   ├── ImageGenerator.tsx          # 🖼️  AI image generation (Imagen 3)
│   ├── VideoGenerator.tsx          # 🎬 AI video generation
│   ├── WebAnalyzer.tsx             # 🌐 Website analyzer
│   ├── SiteArchitect.tsx           # 🏛️  Site architecture analyzer
│   ├── SeoChecker.tsx              # 🔍 SEO audit tool
│   ├── WordPressDashboard.tsx      # 📰 WordPress CMS panel
│   ├── CameraInput.tsx             # 📷 Camera capture (mobile)
│   ├── AISuggestions.tsx           # 💡 AI autocomplete suggestions
│   ├── CaseStudies.tsx             # 📁 Case studies showcase
│   └── ReportDisplay.tsx           # 📊 Report viewer
│
├── 📁 services/                    # External service integrations
│   └── geminiService.ts            # Google Gemini AI (text, vision, image)
│
├── 📁 server/                      # Express.js backend (Node.js hosting)
│   ├── index.ts                    # Server: port 3001, CORS, static files
│   ├── routes.ts                   # API route handlers
│   ├── db.ts                       # PostgreSQL / Supabase connection
│   ├── storage.ts                  # Data access layer (CRUD)
│   └── replitAuth.ts               # Replit Auth middleware
│
├── 📁 functions/                   # ☁️  Cloudflare Pages Functions
│   └── api/                        # Serverless edge API endpoints
│
├── 📁 lib/                         # Shared helper utilities
├── 📁 hooks/                       # Custom React hooks
├── 📁 public/                      # Static: logo.png, favicon, robots.txt
└── 📁 dist/                        # Build output (auto-generated by Vite)
```

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **UI Framework** | React | 19.1 |
| **Language** | TypeScript | 5.8 |
| **Build Tool** | Vite | 6.2 |
| **Styling** | Tailwind CSS | 3.x |
| **AI Provider** | Google Gemini | 2.0 Flash |
| **Maps** | Leaflet + React-Leaflet | 1.9 / 5.0 |
| **Database** | Supabase (PostgreSQL) | 2.45 |
| **Auth** | Supabase Auth | — |
| **Backend** | Express.js | 5.x |
| **Serverless** | Cloudflare Pages Functions | — |
| **Icons** | Lucide React | 0.554 |
| **State Mgmt** | React Hooks + Immer | 10.x |
| **Docs Export** | html-to-docx, mammoth | — |
| **Markdown** | marked | 14.x |

---

## 📋 Scripts

```bash
npm run dev        # Dev server: frontend (5000) + backend (3001)
npm run build      # Production build → /dist
npm run start      # Production server (Node.js)
npm run preview    # Preview production build locally
npm run server     # Backend API only (port 3001)
```

---

## 🌍 Full Production Deployment (Optional)

For maximum reliability, use a separate backend:

```
Cloudflare Pages          Render.com              Supabase
(Frontend CDN)     ───►  (Node.js API)    ───►   (PostgreSQL DB)
armanlawfirm.ir          armanlawfirm-api         your-project
                         .onrender.com            .supabase.co
FREE                     FREE (sleep 15min)       FREE (500MB)
```

See `DEPLOYMENT.md` for full Render.com setup guide.

---

## 📞 Contact

**موسسه حقوقی آرمان**  
📍 تهران، جردن، خیابان طاهری، پلاک ۱۸  
🌐 https://armanlawfirm.ir  
⏰ شنبه تا پنجشنبه — ۹:۰۰ تا ۱۸:۰۰

---

© Arman Law Firm — All rights reserved
