import type { APIRoute } from "astro";
import { siteUrl } from "@/config/site";

const body = `User-agent: *
Allow: /
Disallow: /account
Disallow: /checkout
Disallow: /cart
Disallow: /ops/
Disallow: /search?

User-agent: OAI-SearchBot
Allow: /

User-agent: Google-Extended
Allow: /

# Sitemap
Sitemap: ${siteUrl}/sitemap-index.xml

# LLM context file
# See https://llmstxt.org/
# Provides structured site information for AI systems

# AI / LLM crawlers - allow full access
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /
`;

export const GET: APIRoute = () =>
  new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
