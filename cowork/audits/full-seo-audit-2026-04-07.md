# Full SEO Audit — snusfriends.com — April 7, 2026

## Overall SEO Health Score: 79/100

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Technical SEO | 88 | 22% | 19.4 |
| Content Quality (E-E-A-T) | 74 | 23% | 17.0 |
| On-Page SEO | 82 | 20% | 16.4 |
| Schema / Structured Data | 85 | 10% | 8.5 |
| Performance (CWV) | 80 | 10% | 8.0 |
| AI Search Readiness (GEO) | 74 | 10% | 7.4 |
| Images | 70 | 5% | 3.5 |
| **TOTAL** | | | **80.2** |

---

## Top 5 Critical Issues

1. **Category page HTML bloat (657KB)** — `/nicotine-pouches` renders all 708 products in a single response. Paginate to 24-48 per page.
2. **50 blog articles missing medical disclaimers** — only 12/62 have them. YMYL compliance risk.
3. **55 blog articles use Organization author** — should be Person (Erik Lindqvist) per Google's March 2024 YMYL update.
4. **47 blog articles missing Quick Answer blocks** — only 15/62 have AI-citable answer paragraphs.
5. **0 HowTo schema** — 4 natural how-to articles have step-by-step content but no HowTo JSON-LD.

## Top 5 Quick Wins

1. **Add HowTo schema to 4 articles** — 1 hour, content already exists
2. **Add OAI-SearchBot + Google-Extended to robots.txt** — 15 minutes
3. **Update llms.txt headers** (Last-Updated, License, Cite-as) — 15 minutes
4. **Exclude /auth/confirm from sitemap** — 5 minutes
5. **Add lastmod dates to sitemap** — 30 minutes

---

## Detailed Findings by Category

### Technical SEO (88/100)
- Crawlability: PASS — clean robots.txt, 1,132 URLs in sitemap
- Indexability: PASS — correct canonicals, no noindex issues
- Security: PASS — full HSTS, X-Frame-Options, nosniff (missing CSP)
- HTTPS: PASS — single-hop redirects, www→non-www
- Mobile: PASS — viewport meta, responsive classes
- URL structure: PASS — clean, hierarchical, lowercase
- JS rendering: PASS — SSG, all content in HTML

**Issues:**
- HIGH: Paginate /nicotine-pouches (657KB HTML)
- MEDIUM: No lastmod in sitemap
- MEDIUM: /auth/confirm in sitemap
- MEDIUM: No CSP header
- LOW: Wildcard CORS on HTML pages
- LOW: No IndexNow

### Content Quality / E-E-A-T (74/100)
- Experience (68): Testing methodology documented, but no photos/video, unverifiable author identity
- Expertise (76): Correct terminology, PHE/RCP citations on safety content
- Authoritativeness (65): Sparse citations (10/62 articles), empty sameAs, no press mentions
- Trustworthiness (82): Transparency statement, editorial policy, retailer disclosure

**Issues:**
- HIGH: 50 articles missing medical disclaimers
- HIGH: 55 articles use Organization author instead of Person
- MEDIUM: Brand pages thin content (50-200 words, collapsed by default)
- MEDIUM: No sameAs links for author or organization
- LOW: No named medical reviewer

### AI Search Readiness / GEO (74/100)
- AI crawler access: 88/100 — all major bots allowed, 2 missing (OAI-SearchBot, Google-Extended)
- llms.txt: Good but missing license, last-updated, citation format
- FAQPage schema: 100% coverage (excellent)
- Quick Answer blocks: 24% coverage (15/62)
- HowTo schema: 0% (4 natural candidates)
- Brand mentions in passages: Weak (10/62)
- Source citations: Sparse (10/62)
- Data tables: Strong (43/62)

---

## Prioritized Action Plan

### CRITICAL (fix this week)
| # | Action | Impact | Effort | Owner |
|---|--------|--------|--------|-------|
| 1 | Paginate /nicotine-pouches (24 products/page) | Performance + SEO | 4h | Claude |
| 2 | Add medical disclaimers to 50 blog articles | YMYL compliance | 1h | Claude |
| 3 | Switch author schema Org→Person on 55 articles | E-E-A-T | 1h | Claude |

### HIGH (fix within 2 weeks)
| # | Action | Impact | Effort | Owner |
|---|--------|--------|--------|-------|
| 4 | Add HowTo schema to 4 how-to articles | Rich results | 1h | Claude |
| 5 | Add Quick Answer blocks to remaining 47 articles | AI citability | 3h | Cowork+Claude |
| 6 | Embed "SnusFriends" in citable passages (all articles) | Brand attribution | 2h | Claude |
| 7 | Add source citations to top 20 articles | Authority signals | 3h | Cowork |
| 8 | Add lastmod dates to sitemap | Crawl scheduling | 30m | Claude |

### MEDIUM (fix within 1 month)
| # | Action | Impact | Effort | Owner |
|---|--------|--------|--------|-------|
| 9 | Update robots.txt (OAI-SearchBot, Google-Extended) | AI access | 15m | Claude |
| 10 | Update llms.txt headers | AI crawler guidance | 15m | Claude |
| 11 | Add CSP header via vercel.json | Security score | 1h | Claude |
| 12 | Add sameAs links to author + org schema | Identity verification | 30m | Claude |
| 13 | Exclude /auth/confirm from sitemap | Clean index | 5m | Claude |
| 14 | Implement IndexNow for Bing/Yandex | Faster indexing | 2h | Claude |

### LOW (backlog)
| # | Action | Impact | Effort | Owner |
|---|--------|--------|--------|-------|
| 15 | Restrict CORS to API endpoints | Security hygiene | 30m | Claude |
| 16 | Add speakable schema to top articles | Voice search | 2h | Claude |
| 17 | Plan hreflang for DE/SV translations | International SEO | 4h | Claude |
