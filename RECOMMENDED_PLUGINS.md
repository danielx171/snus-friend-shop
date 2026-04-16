# Recommended Plugins, Skills & Connectors for SnusFriends

Based on analysis of the actual codebase, ROADMAP.md, CURRENT_PRIORITIES.md, and the SEO plan.

---

## Your Workflow Profile

- **Solo founder**, new to vibecoding, running overnight autonomous sessions
- **Stack:** Astro 6 + React islands + Supabase + Vercel + Tailwind v4
- **Revenue model:** 100% organic SEO (Google Ads bans nicotine)
- **Active workstreams:** SEO content, accessibility fixes, design redesign (Stitch), gamification
- **Pain points:** Content fact-checking, design quality, accessibility gaps (Lighthouse 83→95+), staying current on EU regulations

---

## TIER 1 — Install Now (directly solves active problems)

### 1. Addy Osmani's Web Quality Skills
**Why:** Your #1 gap is accessibility (Lighthouse 83 on homepage). This has 150+ Lighthouse audits and dedicated skills for Performance, Core Web Vitals, Accessibility (WCAG 2.2), and SEO — all the things in your SEO maximization plan.
**What it does:** Runs automated audits, identifies exact issues, and fixes them in a loop until scores stop improving.
```bash
# In Claude Code terminal:
npx add-skill addyosmani/web-quality-skills
```
**Source:** [addyosmani/web-quality-skills](https://github.com/addyosmani/web-quality-skills)

### 2. SEO + GEO Skills (20 skills)
**Why:** Your entire revenue depends on organic search AND AI search citations. This covers keyword research, content writing, technical audits, rank tracking, schema markup generation, and GEO (Generative Engine Optimization) for AI search engines like Perplexity and Google AI Overviews.
**What it does:** 20 skills including schema-markup-generator (you already use FAQPage, Product, Organization schemas — this keeps them optimized), keyword clustering, content gap analysis, and AI citability scoring.
```bash
npx skills add aaron-he-zhu/seo-geo-claude-skills
```
**Source:** [aaron-he-zhu/seo-geo-claude-skills](https://github.com/aaron-he-zhu/seo-geo-claude-skills)

### 3. Astro Website Skill
**Why:** You're on Astro 6 — the only framework-specific skill that exists for Astro. Covers SSG, Content Collections, Markdown/MDX, i18n, and Vercel deployment. Prevents Claude Code from suggesting Next.js patterns (which your CLAUDE.md already warns about).
```bash
cd ~/.claude/skills && git clone https://github.com/SpillwaveSolutions/publishing-astro-websites-agentic-skill.git
```
**Source:** [SpillwaveSolutions/publishing-astro-websites-agentic-skill](https://github.com/spillwavesolutions/publishing-astro-websites-agentic-skill)

### 4. Superpowers
**Why:** Enforces disciplined development — TDD, systematic debugging, brainstorming before coding. Prevents the "just write code and hope it works" pattern that causes bugs in overnight sessions.
```bash
/plugin install superpowers@claude-plugins-official
```
**Source:** [obra/superpowers](https://github.com/obra/superpowers) — 42k+ GitHub stars, Anthropic marketplace official

### 5. Frontend Design (Anthropic Official)
**Why:** You're actively redesigning the store using Stitch. This skill prevents generic "AI slop" design and forces bold, distinctive aesthetic choices. Works perfectly with React + Tailwind.
```bash
/plugin install anthropic/frontend-design
```
**Source:** [anthropics/claude-code — frontend-design](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design)

---

## TIER 2 — Install Soon (supports active workstreams)

### 6. Accessibility Audit Skill (axe-core + Lighthouse)
**Why:** Complements the Web Quality Skills with deeper WCAG 2.1 AA mapping, manual follow-up guidance, and configurable output. Your accessibility plan (Phase 2 in SEO plan) has 6 specific fixes — this automates finding more.
```bash
# Copy skill into project:
cd .claude/skills && git clone https://github.com/snapsynapse/skill-a11y-audit.git
```
**Source:** [snapsynapse/skill-a11y-audit](https://github.com/snapsynapse/skill-a11y-audit)

### 7. SEO-GEO Consultant Plugin
**Why:** Acts as a senior SEO consultant that audits AND implements fixes. Has schema templates for Organization, WebSite, FAQPage, Product, BreadcrumbList — all schemas you already use. Keeps structured data optimized as you add pages.
```bash
# Clone into skills:
cd ~/.claude/skills && git clone https://github.com/AndreasH96/seo-geo-consultant.git
```
**Source:** [AndreasH96/seo-geo-consultant](https://github.com/AndreasH96/seo-geo-consultant)

### 8. Superpowers Marketplace
**Why:** 72+ additional skills on top of core Superpowers. Browse and install as needed — deployment helpers, testing patterns, code review tools.
```bash
/plugin marketplace add obra/superpowers-marketplace
```
**Source:** [obra/superpowers-marketplace](https://github.com/obra/superpowers-marketplace)

---

## CONNECTORS — Add in Cowork or Claude Code

### 9. Ahrefs
**Why:** You have DataForSEO + GSC but lack backlink analysis. Ahrefs also has Brand Radar — tracks how AI search engines (ChatGPT, Perplexity, Gemini) cite snusfriends.com. Critical for GEO strategy.
**How:** Connect via Cowork settings or Claude Code MCP registry.

### 10. Figma
**Why:** Active Stitch design redesign. Pull design context, screenshots, and generate code directly from Figma instead of working from computer-use screenshots.
**How:** Connect via Cowork settings or Claude Code MCP registry.

---

## ALREADY CONNECTED — Make Sure You're Using

| Tool | Active Use Case |
|------|----------------|
| **Supabase MCP** | Query orders, manage migrations, deploy edge functions, generate types |
| **Vercel MCP** | Deploy, check build logs, manage env vars |
| **Sentry** | Catch production errors before customers report them |
| **DataForSEO** | Keyword research, SERP analysis, competitor gaps |
| **GSC** | Track impressions, clicks, index coverage, verify SEO changes |
| **Firecrawl** | Scrape competitor pages (SnusDirect, Northerner, Haypp) |
| **Playwright** | Visual regression testing after deploys |
| **Context7** | Up-to-date docs for Astro, Tailwind, shadcn/ui |
| **Cloudflare** | DNS management |
| **Gmail** | Support inbox monitoring |

**Weekly SEO workflow:** GSC (current rankings) → DataForSEO (keyword gaps) → Firecrawl (competitor content) → implement → GSC (verify)

**Error workflow:** Sentry (find issues) → fix → Vercel (deploy) → Sentry (verify)

---

## SKIP — Not relevant for your setup

- Sales plugins (Common Room, etc.) — solo operation, no sales team
- HR, Finance, Legal plugins — no team to manage
- WordPress/WooCommerce plugins — you're on Astro
- Stripe plugin — you use Nyehandel for payments
- Linear/Jira plugins — no issue tracker (you use ROADMAP.md)

---

## Quick Install Script (paste all at once in Claude Code terminal)

```bash
# Skills (run from your project root):
npx add-skill addyosmani/web-quality-skills
npx skills add aaron-he-zhu/seo-geo-claude-skills

# Git-based skills:
mkdir -p ~/.claude/skills
cd ~/.claude/skills
git clone https://github.com/SpillwaveSolutions/publishing-astro-websites-agentic-skill.git
git clone https://github.com/snapsynapse/skill-a11y-audit.git
git clone https://github.com/AndreasH96/seo-geo-consultant.git

# Plugins (run inside Claude Code):
/plugin install superpowers@claude-plugins-official
/plugin install anthropic/frontend-design
/plugin marketplace add obra/superpowers-marketplace
```
