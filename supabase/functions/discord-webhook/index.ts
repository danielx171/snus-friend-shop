import { corsHeaders } from "../_shared/cors.ts";

const JSON_HEADERS = { ...corsHeaders, "Content-Type": "application/json" };

const VALID_EVENT_TYPES = [
  "review",
  "quest_complete",
  "achievement",
  "new_drop",
  "leaderboard_change",
] as const;
type EventType = (typeof VALID_EVENT_TYPES)[number];

/** Map event types to their Discord webhook env var name. */
const EVENT_WEBHOOK_MAP: Record<EventType, string> = {
  review: "DISCORD_WEBHOOK_REVIEWS",
  quest_complete: "DISCORD_WEBHOOK_ACHIEVEMENTS",
  achievement: "DISCORD_WEBHOOK_ACHIEVEMENTS",
  new_drop: "DISCORD_WEBHOOK_REVIEWS",
  leaderboard_change: "DISCORD_WEBHOOK_ACHIEVEMENTS",
};

/** Build a Discord embed object based on the event type and data. */
function buildEmbed(
  eventType: EventType,
  data: Record<string, unknown>,
): Record<string, unknown> {
  switch (eventType) {
    case "review":
      return {
        title: "\u2b50 New Review!",
        description: `**${data.username ?? "A snuser"}** just reviewed **${data.product_name ?? "a product"}**! (${data.stars ?? "??"}/5 stars)${data.points ? ` \u2014 Earned ${data.points} SnusPoints` : ""}`,
        color: 0xffd700,
        ...(data.product_image
          ? { thumbnail: { url: data.product_image } }
          : {}),
        timestamp: new Date().toISOString(),
      };

    case "quest_complete":
      return {
        title: "\ud83c\udfc6 Quest Completed!",
        description: `**${data.username ?? "A snuser"}** completed the **${data.quest_name ?? "??"}** quest!${data.points ? ` Earned ${data.points} SnusPoints` : ""}`,
        color: 0x22c55e,
        timestamp: new Date().toISOString(),
      };

    case "achievement":
      return {
        title: "\ud83c\udfa8 Avatar Unlocked!",
        description: `**${data.username ?? "A snuser"}** unlocked the **${data.avatar_name ?? "??"}** avatar!`,
        color: 0xa855f7,
        timestamp: new Date().toISOString(),
      };

    case "new_drop":
      return {
        title: "\ud83d\udce6 New Product Drop!",
        description: `**${data.product_name ?? "A new product"}** is now available!${data.brand ? ` by ${data.brand}` : ""}`,
        color: 0xf97316,
        ...(data.product_image
          ? { thumbnail: { url: data.product_image } }
          : {}),
        timestamp: new Date().toISOString(),
      };

    case "leaderboard_change":
      return {
        title: "\ud83d\udcca Leaderboard Update!",
        description: `**${data.username ?? "A snuser"}** moved to **#${data.rank ?? "??"}** on the leaderboard!`,
        color: 0x3b82f6,
        timestamp: new Date().toISOString(),
      };

    default:
      return {
        title: "SnusFriends Activity",
        description: JSON.stringify(data),
        color: 0x6366f1,
        timestamp: new Date().toISOString(),
      };
  }
}

/**
 * Post a message to a Discord webhook URL.
 * Handles rate limiting with a single retry after the Retry-After header.
 */
async function postToDiscord(
  webhookUrl: string,
  embed: Record<string, unknown>,
): Promise<{ ok: boolean; status: number }> {
  const body = JSON.stringify({
    username: "SnusFriends",
    embeds: [embed],
  });

  const doPost = async () => {
    return await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
  };

  let res = await doPost();

  // Handle Discord rate limit (429) — wait and retry once
  if (res.status === 429) {
    const retryAfterSec = parseFloat(
      res.headers.get("Retry-After") ?? "2",
    );
    const waitMs = Math.min(retryAfterSec * 1000, 10_000); // cap at 10s
    console.warn(`Discord rate limited, retrying after ${waitMs}ms`);
    await new Promise((r) => setTimeout(r, waitMs));
    res = await doPost();
  }

  return { ok: res.ok, status: res.status };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "method_not_allowed", requestId }),
        { status: 405, headers: JSON_HEADERS },
      );
    }

    // --- Auth: internal function secret only ---
    const internalSecret = Deno.env.get("INTERNAL_FUNCTIONS_SECRET");
    const providedSecret = req.headers.get("x-internal-function-secret");

    if (!internalSecret || !providedSecret || providedSecret !== internalSecret) {
      return new Response(
        JSON.stringify({ error: "unauthorized", requestId }),
        { status: 401, headers: JSON_HEADERS },
      );
    }

    // --- Parse body ---
    const body = await req.json().catch(() => null);
    if (!body || typeof body.event_type !== "string" || !body.data) {
      return new Response(
        JSON.stringify({
          error: "invalid_input",
          message: "Body must contain { event_type: string, data: object }",
          requestId,
        }),
        { status: 400, headers: JSON_HEADERS },
      );
    }

    const eventType = body.event_type as EventType;
    if (!VALID_EVENT_TYPES.includes(eventType)) {
      return new Response(
        JSON.stringify({
          error: "invalid_event_type",
          message: `event_type must be one of: ${VALID_EVENT_TYPES.join(", ")}`,
          requestId,
        }),
        { status: 400, headers: JSON_HEADERS },
      );
    }

    // --- Resolve webhook URL ---
    const webhookEnvKey = EVENT_WEBHOOK_MAP[eventType];
    const webhookUrl = Deno.env.get(webhookEnvKey);

    if (!webhookUrl) {
      // No webhook configured — this is not an error, just skip silently
      console.log(
        `discord-webhook: No ${webhookEnvKey} configured, skipping`,
        { eventType, requestId },
      );
      return new Response(
        JSON.stringify({ ok: true, skipped: true, reason: "no_webhook_configured", requestId }),
        { status: 200, headers: JSON_HEADERS },
      );
    }

    // --- Build and send embed ---
    const embed = buildEmbed(eventType, body.data);
    const result = await postToDiscord(webhookUrl, embed);

    if (!result.ok) {
      console.error("Discord webhook post failed", {
        status: result.status,
        eventType,
        requestId,
      });
      return new Response(
        JSON.stringify({ ok: false, discord_status: result.status, requestId }),
        { status: 502, headers: JSON_HEADERS },
      );
    }

    console.log("discord-webhook sent", { eventType, requestId });

    return new Response(
      JSON.stringify({ ok: true, requestId }),
      { status: 200, headers: JSON_HEADERS },
    );
  } catch (err) {
    console.error("discord-webhook unexpected error", { err, requestId });
    return new Response(
      JSON.stringify({ error: "internal", requestId }),
      { status: 500, headers: JSON_HEADERS },
    );
  }
});
