# SnusFriend Plugin, Skill & MCP Marketplace Guide

*Generated 2026-04-07 — Based on audit of claudemarketplaces.com + current Cowork setup*

---

## What You Already Have

Before adding anything, here's your current tooling inventory:

### Connected MCPs (12)
| MCP | What It Does |
|-----|-------------|
| **Supabase** | DB queries, migrations, edge functions, types |
| **Vercel** | Deployments, env vars, build logs, domains |
| **Sentry** | Error monitoring, issue triage |
| **Notion** | Pages, databases, search, comments |
| **Gmail** | Read/search emails, create drafts |
| **Google Calendar** | Events, scheduling, free time |
| **Google Drive** | Search and fetch documents |
| **Klaviyo** | Profiles, lists, segments, campaigns, templates, events |
| **Cloudflare** | DNS, Workers, R2, D1 |
| **HubSpot** | CRM objects, properties, search |
| **Computer Use** | Desktop control, screenshots, automation |
| **Chrome Extension** | Browser automation, page reading, navigation |

### Connected Plugins/Skills (8 plugin bundles)
| Plugin | Skills It Provides |
|--------|-------------------|
| **Anthropic Core** | pdf, docx, pptx, xlsx, skill-creator, mcp-builder, algorithmic-art, web-artifacts-builder |
| **Design** | design-critique, design-handoff, design-system, ux-copy, accessibility-review, research-synthesis, user-research |
| **Brand Voice** | brand-voice-enforcement, guideline-generation, discover-brand |
| **Sales** | account-research, call-prep, call-summary, competitive-intelligence, create-an-asset, daily-briefing, draft-outreach, forecast, pipeline-review |
| **Marketing** | content-creation, draft-content, email-sequence, campaign-plan, competitive-brief, brand-review, performance-report, seo-audit |
| **Data** | analyze, build-dashboard, create-viz, explore-data, sql-queries, statistical-analysis, validate-data, write-query, data-context-extractor |
| **Engineering** | architecture, code-review, debug, deploy-checklist, documentation, incident-response, standup, system-design, tech-debt, testing-strategy |
| **Product Management** | competitive-brief, metrics-review, product-brainstorming, roadmap-update, sprint-planning, stakeholder-update, synthesize-research, write-spec |
| **Customer Support** | draft-response, ticket-triage, customer-research, kb-article, customer-escalation |
| **Productivity** | memory-management, task-management, start, update |
| **Cowork Plugin Mgmt** | create-cowork-plugin, cowork-plugin-customizer |

### Also Connected (Travel/Misc)
- Trivago accommodation search
- Kiwi flight search
- Apple Notes, iMessages
- Context7 (library docs)

---

## Recommended Additions

Prioritized by impact on your actual workstreams (SEO content, conversions, Nyehandel ops, email marketing, growth).

### TIER 1 — High Impact, Add Now

#### 1. Corey Haines Marketing Skills (25 skills)
**Why:** Your #1 priority is SEO content and conversions. This collection is purpose-built for exactly that — CRO, SEO, copywriting, email sequences, schema markup, and programmatic SEO. It fills gaps your current Marketing plugin doesn't cover (like page-level CRO, popup optimization, A/B test setup, and AI-SEO for LLM visibility).

**Key skills for you:**
- `seo-audit` — Technical + on-page SEO reviews (complements your existing marketing:seo-audit with page-level detail)
- `programmatic-seo` — Generate SEO pages at scale (you have 708 products — this could auto-generate optimized category/comparison pages)
- `ai-seo` — Optimize for AI search engines and LLM citations (you already have llms.txt — this takes it further)
- `schema-markup` — Add/optimize structured data (you have schemas but this skill specializes in it)
- `page-cro` — Optimize any marketing page for conversions
- `signup-flow-cro` — Improve registration flows
- `copywriting` — Marketing copy for homepage/landing pages
- `analytics-tracking` — Event tracking setup (complements your PostHog instrumentation)
- `ab-test-setup` — Design and implement experiments
- `competitor-alternatives` — Create comparison/alternative pages (huge for SEO in nicotine pouch space)
- `email-sequence` — Automated email flows (directly useful for your Klaviyo work)
- `referral-program` — Build referral programs (fits your gamification/community strategy)
- `content-strategy` — Plan content topics
- `product-marketing-context` — Foundation document all other skills reference

**Install:**
```bash
npx skills add coreyhaines31/marketingskills
```

**Relevance score: 10/10** — Almost every skill maps directly to your active workstreams.

---

#### 2. Supabase Postgres Best Practices Skill
**Why:** You have 47 tables, 44 migrations, and 22 edge functions all on Supabase. This skill gives Claude deep knowledge of Supabase-specific SQL patterns, RLS policies, performance tuning, and edge function conventions.

**Install:**
```bash
npx skills add supabase/supabase-skill --skill supabase-postgres-best-practices
```

**Relevance score: 9/10** — You're heavily invested in Supabase. Every DB task benefits.

---

#### 3. shadcn/ui Skill
**Why:** Your entire frontend uses shadcn/ui components. This skill gives Claude component-specific knowledge — correct imports, variant patterns, accessibility patterns, and composition recipes.

**Install:**
```bash
npx skills add nicholasgriffintn/shadcn-ui-skill --skill shadcn
```

**Relevance score: 8/10** — Every UI task you do touches shadcn.

---

### TIER 2 — Medium Impact, Add When Needed

#### 4. Vercel React Best Practices + Web Design Guidelines
**Why:** You're on Vercel with React islands. These Vercel-official skills encode deployment best practices, ISR patterns, and responsive design guidelines.

**Install:**
```bash
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices
npx skills add vercel-labs/agent-skills --skill web-design-guidelines
```

**Relevance score: 7/10** — Useful for frontend work and deployments.

---

#### 5. Impeccable Design Polish Suite (pbakaus)
**Why:** You're in active redesign mode. This 17-skill collection specializes in UI refinement — polish, critique, animate, colorize, optimize, harden. Each skill focuses on one dimension of design quality.

**Key skills for you:**
- `polish` — Final visual refinement pass
- `critique` — Structured design feedback
- `audit` — Accessibility + usability audit
- `colorize` — Color palette optimization
- `optimize` — Performance optimization
- `harden` — Error states + edge cases

**Install:**
```bash
npx skills add pbakaus/impeccable
```

**Relevance score: 7/10** — Very useful during your design redesign phase.

---

#### 6. Obra Superpowers (Development Methodology)
**Why:** Your codebase is complex (94+ pages, 22 edge functions). These skills improve how Claude approaches development tasks — systematic debugging, test-driven development, parallel agents, code review, and plan-based execution.

**Key skills:**
- `systematic-debugging` — Structured debug methodology
- `test-driven-development` — TDD approach
- `writing-plans` + `executing-plans` — Plan-based development
- `verification-before-completion` — Quality gates
- `dispatching-parallel-agents` — Multi-agent task splitting

**Install:**
```bash
npx skills add obra/superpowers
```

**Relevance score: 7/10** — Improves quality of every coding session.

---

#### 7. Website Audit Skill (squirrelscan)
**Why:** Quick website audits covering performance, SEO, accessibility, and security. Good for periodic health checks of snusfriends.com.

**Install:**
```bash
npx skills add squirrelscan/audit-website-skill --skill audit-website
```

**Relevance score: 6/10** — Useful for periodic site audits.

---

### TIER 3 — Nice to Have / Situational

#### 8. AI Image Generation (Inferen)
**Why:** You could use this for product images, blog hero banners, social media content, and OG images (which are on your nice-to-have list).

**Install:**
```bash
npx skills add inferen-sh/skills --skill ai-image-generation
```

**Relevance score: 5/10** — Only when you need generated images.

---

#### 9. ElevenLabs TTS
**Why:** Could add audio versions of blog posts or product descriptions for accessibility and engagement. Niche but differentiating for an e-commerce site.

**Install:**
```bash
npx skills add inferen-sh/skills --skill elevenlabs-tts
```

**Relevance score: 3/10** — Future consideration.

---

#### 10. Tailwind Design System Skill
**Why:** You're on Tailwind v4. This skill helps maintain consistent design tokens, spacing, and component patterns.

**Install:**
```bash
npx skills add wshobson/agents --skill tailwind-design-system
```

**Relevance score: 6/10** — Helpful for design consistency.

---

## MCPs Worth Adding

### High Value

| MCP | Why You Need It | Stars |
|-----|----------------|-------|
| **GitHub MCP** | Your code is on GitHub. Direct PR creation, issue management, code review from within Cowork. | 28k |
| **Figma Context MCP** | You use Stitch (built on Figma). This lets Claude read Figma layouts directly for design-to-code. | 14k |
| **N8n MCP** | Workflow automation — connect Klaviyo flows, Supabase webhooks, Nyehandel callbacks without custom code. | 16k |
| **Exa MCP** | Better web search for competitor research, SEO analysis, and content sourcing. | 4k |
| **Slack MCP** | If you use Slack for team communication — enables reading/sending messages directly. | 1.5k |

### Medium Value

| MCP | Why | Stars |
|-----|-----|-------|
| **Repomix** | Pack your entire repo into one AI-friendly file for audits and context sharing. | 23k |
| **Sequential Thinking** | Structured reasoning for complex multi-step problems. | 82k |
| **Perplexity MCP** | Research-grade web search with citations — great for SEO content research. | 2k |
| **Google Analytics MCP** | Direct GA access for traffic analysis (if you use GA alongside PostHog). | 1.5k |
| **Apify MCP** | Scrape competitor product catalogs, pricing, and content at scale. | 945 |

---

## Plugin Marketplaces Worth Browsing

| Marketplace | Plugins | Best For |
|-------------|---------|----------|
| **anthropics/claude-code** | 13 | Official Anthropic plugins — always check first |
| **anthropics/knowledge-work-plugins** | 40 | Cowork-specific plugins (you likely have most already) |
| **ComposioHQ/awesome-claude-skills** | 107 | Huge curated collection — e-commerce, CRM, social media automation |
| **coreyhaines31/marketingskills** | 40+ | **Your #1 pickup** — specialized marketing skills |
| **wshobson/agents** | 75 | Multi-category (dev, security, design, data) |
| **obra/superpowers** | 14 | Development methodology skills |
| **huggingface/skills** | 12 | ML/AI model tools (if you want to add AI features) |

---

## What You DON'T Need

Saving you time — these are popular but not relevant to your setup:

- **Azure/Microsoft skills** — You're on Vercel + Supabase + Cloudflare, not Azure
- **Unity/Godot/Blender MCPs** — Game engines, not e-commerce
- **Xcode/iOS Simulator** — No mobile app
- **Kubernetes/Terraform** — You're serverless on Vercel
- **Shopify skills** — You removed Shopify entirely
- **WhatsApp MCP** — Explicitly excluded in your CLAUDE.md boundaries
- **MongoDB/MySQL MCPs** — You're on Supabase PostgreSQL

---

## Suggested Install Order

Based on your current priorities (SEO content → Conversions → Email → Ops):

1. **Now:** `coreyhaines31/marketingskills` (immediate SEO + CRO impact)
2. **Now:** `supabase-postgres-best-practices` (every session benefits)
3. **Now:** `shadcn` skill (every UI task benefits)
4. **This week:** `pbakaus/impeccable` (for design redesign work)
5. **This week:** `obra/superpowers` (improves dev session quality)
6. **When needed:** Vercel best practices, audit-website, Figma MCP
7. **Later:** Image generation, n8n automation, Exa search

---

## How to Install Skills

All skills use the same pattern:
```bash
# Install entire collection
npx skills add <github-org>/<repo>

# Install specific skill from a collection
npx skills add <github-org>/<repo> --skill <skill-name>
```

Skills are stored in `~/.config/claude-code/skills/` and are automatically available in future sessions.

---

*Sources: claudemarketplaces.com/marketplaces, claudemarketplaces.com/skills, claudemarketplaces.com/mcp, github.com/coreyhaines31/marketingskills, github.com/ComposioHQ/awesome-claude-skills*
