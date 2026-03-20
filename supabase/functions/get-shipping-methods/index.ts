declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

// @ts-ignore: Deno file import
import { corsHeaders } from "../_shared/cors.ts";

/** In-memory cache — avoids hitting Nyehandel on every page load */
let cachedMethods: string[] = [];
let cachedAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/* ------------------------------------------------------------------ */
/*  Main handler                                                       */
/* ------------------------------------------------------------------ */

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "GET") {
    return jsonResponse({ error: "method_not_allowed" }, 405);
  }

  /* ---------- env ---------- */
  const nyehandelToken = Deno.env.get("NYEHANDEL_API_TOKEN");
  const nyehandelXIdentifier = Deno.env.get("NYEHANDEL_X_IDENTIFIER") ?? "";
  const nyehandelBaseUrl =
    Deno.env.get("NYEHANDEL_API_URL") || "https://api.nyehandel.se/api/v2";

  if (!nyehandelToken) {
    return jsonResponse({ error: "missing_nyehandel_token" }, 500);
  }

  /* ---------- cache check ---------- */
  const now = Date.now();
  if (cachedMethods.length > 0 && now - cachedAt < CACHE_TTL_MS) {
    return jsonResponse({ methods: cachedMethods });
  }

  /* ---------- fetch from Nyehandel ---------- */
  try {
    const response = await fetch(`${nyehandelBaseUrl}/shipping-methods`, {
      headers: {
        Accept: "application/json",
        "X-identifier": nyehandelXIdentifier,
        Authorization: `Bearer ${nyehandelToken}`,
      },
    });

    if (!response.ok) {
      return jsonResponse(
        { error: "nyehandel_shipping_methods_failed", status: response.status },
        502,
      );
    }

    const json = (await response.json()) as { data?: Array<{ name?: string }> };
    const names = (json?.data ?? [])
      .map((m) => (typeof m.name === "string" ? m.name.trim() : ""))
      .filter((n) => n.length > 0);

    cachedMethods = names;
    cachedAt = Date.now();

    return jsonResponse({ methods: names });
  } catch (err) {
    return jsonResponse(
      { error: "nyehandel_network_error", details: String(err) },
      502,
    );
  }
});
