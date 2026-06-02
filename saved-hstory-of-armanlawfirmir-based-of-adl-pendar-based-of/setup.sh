#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  Arman Law Firm — Quick Setup Script
#  Run this after cloning from GitHub (on Replit or any server)
#  Usage: bash setup.sh
# ─────────────────────────────────────────────────────────────

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════╗"
echo "║    موسسه حقوقی آرمان — Arman Law Firm        ║"
echo "║    AI Legal Platform — Setup Script          ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${YELLOW}▶ Step 1: Installing dependencies...${NC}"
npm install

echo -e "${YELLOW}▶ Step 2: Setting up environment file...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env from .env.example${NC}"
    echo -e "${YELLOW}  ⚠️  Edit .env and add your API keys before running!${NC}"
else
    echo -e "${GREEN}✓ .env already exists — skipping${NC}"
fi

echo -e "${YELLOW}▶ Step 3: Checking environment variables...${NC}"

check_env() {
    if [ -n "${!1}" ]; then
        echo -e "${GREEN}  ✓ $1 is set${NC}"
    else
        echo -e "${YELLOW}  ⚠️  $1 is NOT set (add to .env or Replit Secrets)${NC}"
    fi
}

check_env "GEMINI_API_KEY"
check_env "SUPABASE_URL"
check_env "SUPABASE_ANON_KEY"

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗"
echo "║  ✅  Setup Complete!                          ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Make sure your API keys are set (Replit Secrets or .env)"
echo "  2. Run: npm run dev"
echo "  3. Open: http://localhost:5000"
echo ""
echo -e "${YELLOW}Needed keys:${NC}"
echo "  • GEMINI_API_KEY  → https://ai.google.dev"
echo "  • SUPABASE_URL    → https://supabase.com (Settings → API)"
echo "  • SUPABASE_ANON_KEY → same place"
echo ""
