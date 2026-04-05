/**
 * North Star Human Rights - Social Media Agent
 * Version: 0.2.0 - Phase 1 Foundation + LinkedIn OAuth
 *
 * Principles: Free | Fair | Firm | Fun | True | Transparent | Accessible
 * INTEGRITY INTEGRITY INTEGRITY
 * Slow is smooth. Smooth is fast.
 */

async function log(env, level, action, result, detail = "") {
  const entry = { timestamp: new Date().toISOString(), level, action, result, detail };
  const key = `log:${entry.timestamp}:${Math.random().toString(36).slice(2, 7)}`;
  try {
    await env.KV.put(key, JSON.stringify(entry), { expirationTtl: 60 * 60 * 24 * 90 });
  } catch (e) { console.error("CRITICAL: KV logging failed", e.message); }
  console.log(`[${level.toUpperCase()}] ${action}: ${result}${detail ? " | " + detail : ""}`);
  return entry;
}

async function tier3Alert(env, action, detail) {
  await log(env, "error", action, "TIER3_ALERT", detail);
  console.error(`[TIER 3 ALERT] ${action}: ${detail}`);
}

// BLUESKY
async function blueskyAuth(env) {
  const handle = env.BLUESKY_HANDLE;
  const password = env.BLUESKY_APP_PASSWORD;
  if (!handle || !password) throw new Error("Bluesky credentials missing from environment");
  const res = await fetch("https://bsky.social/xrpc/com.atproto.server.createSession", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: handle, password }),
  });
  if (!res.ok) { const err = await res.text(); throw new Error(`Bluesky auth failed: ${res.status} - ${err}`); }
  const data = await res.json();
  return { did: data.did, accessJwt: data.accessJwt, handle: data.handle };
}

async function checkBlueskyAuth(env) {
  try {
    const session = await blueskyAuth(env);
    await log(env, "info", "bluesky_auth_check", "success", `Authenticated as ${session.handle}`);
    return { platform: "bluesky", status: "authenticated", handle: session.handle };
  } catch (e) {
    await tier3Alert(env, "bluesky_auth_check", e.message);
    return { platform: "bluesky", status: "failed", error: e.message };
  }
}

// LINKEDIN
const LINKEDIN_REDIRECT = "https://socialmedia-agent.northstarhr.workers.dev/linkedin/callback";

function linkedinAuthUrl(env) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: env.LINKEDIN_CLIENT_ID,
    redirect_uri: LINKEDIN_REDIRECT,
    scope: "openid profile email w_member_social",
    state: "northstar-linkedin-auth",
  });
  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}

async function linkedinExchangeCode(env, code) {
  const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: LINKEDIN_REDIRECT,
      client_id: env.LINKEDIN_CLIENT_ID,
      client_secret: env.LINKEDIN_CLIENT_SECRET,
    }),
  });
  if (!res.ok) { const err = await res.text(); throw new Error(`LinkedIn token exchange failed: ${res.status} - ${err}`); }
  return res.json();
}

async function checkLinkedInAuth(env) {
  try {
    const token = await env.KV.get("linkedin:access_token");
    if (!token) {
      return { platform: "linkedin", status: "not_authorized", auth_url: linkedinAuthUrl(env), message: "Visit auth_url to authorize" };
    }
    const res = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      await env.KV.delete("linkedin:access_token");
      return { platform: "linkedin", status: "token_expired", auth_url: linkedinAuthUrl(env) };
    }
    const profile = await res.json();
    await log(env, "info", "linkedin_auth_check", "success", `Authenticated as ${profile.name || profile.sub}`);
    return { platform: "linkedin", status: "authenticated", name: profile.name || profile.sub };
  } catch (e) {
    await tier3Alert(env, "linkedin_auth_check", e.message);
    return { platform: "linkedin", status: "failed", error: e.message };
  }
}

// STATUS PAGE
async function getRecentLogs(env, limit = 20) {
  try {
    const list = await env.KV.list({ prefix: "log:" });
    const keys = list.keys.slice(-limit);
    const entries = await Promise.all(keys.map(async (k) => { const val = await env.KV.get(k.name); return val ? JSON.parse(val) : null; }));
    return entries.filter(Boolean).reverse();
  } catch (e) { return []; }
}

async function buildStatusPage(env) {
  const logs = await getRecentLogs(env);
  const lastBluesky = logs.find((l) => l.action === "bluesky_auth_check");
  const linkedInToken = await env.KV.get("linkedin:access_token");
  const rows = logs.map((l) => `<tr class="${l.level}"><td>${l.timestamp}</td><td>${l.level.toUpperCase()}</td><td>${l.action}</td><td>${l.result}</td><td>${l.detail || ""}</td></tr>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>North Star Agent - Status</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #0f0f1a; color: #e8e4d9; padding: 2rem; }
    h1 { color: #c9a84c; font-size: 1.5rem; margin-bottom: 0.25rem; }
    h2 { color: #c9a84c; font-size: 1rem; margin: 1.5rem 0 0.75rem; }
    .subtitle { color: #888; font-size: 0.85rem; margin-bottom: 2rem; }
    .status-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .card { background: #1a1a2e; border: 1px solid #2d2d44; border-radius: 8px; padding: 1rem; }
    .card .label { font-size: 0.75rem; color: #888; margin-bottom: 0.35rem; }
    .card .value { font-size: 1rem; font-weight: 600; }
    .ok { color: #4caf82; } .warn { color: #c9a84c; } .error { color: #c94c4c; }
    table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
    th { background: #1a1a2e; color: #c9a84c; text-align: left; padding: 0.5rem 0.75rem; }
    td { padding: 0.45rem 0.75rem; border-bottom: 1px solid #1a1a2e; }
    tr.info td { background: #0f0f1a; } tr.warn td { background: #1a1500; } tr.error td { background: #1a0000; }
    .phase { background: #1a1a2e; border-radius: 8px; padding: 1rem; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; }
    .badge { font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 20px; background: #2d2d44; color: #888; }
    .badge.active { background: #1a3020; color: #4caf82; }
    .auth-link { display: inline-block; margin-top: 0.5rem; background: #c9a84c; color: #0f0f1a; padding: 0.4rem 1rem; border-radius: 4px; text-decoration: none; font-weight: 600; font-size: 0.8rem; }
    footer { margin-top: 2rem; color: #444; font-size: 0.75rem; }
  </style>
</head>
<body>
  <h1>North Star Human Rights</h1>
  <p class="subtitle">Social Media Agent - Status Dashboard | Phase 1: Foundation</p>
  <h2>Platform Auth Status</h2>
  <div class="status-grid">
    <div class="card">
      <div class="label">Bluesky</div>
      <div class="value ${lastBluesky?.result === "success" ? "ok" : "warn"}">${lastBluesky?.result === "success" ? "Authenticated" : "Pending"}</div>
    </div>
    <div class="card">
      <div class="label">LinkedIn</div>
      <div class="value ${linkedInToken ? "ok" : "warn"}">${linkedInToken ? "Authenticated" : "Not authorized"}</div>
      ${!linkedInToken ? '<a class="auth-link" href="/linkedin/authorize">Authorize LinkedIn</a>' : ""}
    </div>
    <div class="card"><div class="label">Facebook</div><div class="value warn">Pending</div></div>
    <div class="card"><div class="label">Instagram</div><div class="value warn">Pending</div></div>
    <div class="card"><div class="label">Threads</div><div class="value warn">Pending</div></div>
    <div class="card"><div class="label">YouTube</div><div class="value warn">Parked</div></div>
  </div>
  <h2>Build Phases</h2>
  <div class="phase"><span>Phase 1 - Foundation</span><span class="badge active">In Progress</span></div>
  <div class="phase"><span>Phase 2 - Content Engine</span><span class="badge">Not Started</span></div>
  <div class="phase"><span>Phase 3 - Posting</span><span class="badge">Not Started</span></div>
  <div class="phase"><span>Phase 4 - Monitoring</span><span class="badge">Not Started</span></div>
  <div class="phase"><span>Phase 5 - Review Dashboard</span><span class="badge">Not Started</span></div>
  <div class="phase"><span>Phase 6 - Growth Intelligence</span><span class="badge">Not Started</span></div>
  <h2>Recent Log (Last 20 Actions)</h2>
  <table>
    <thead><tr><th>Timestamp</th><th>Level</th><th>Action</th><th>Result</th><th>Detail</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="5" style="color:#888;padding:1rem">No logs yet</td></tr>'}</tbody>
  </table>
  <footer>North Star Human Rights - northstarhr.pages.dev | INTEGRITY INTEGRITY INTEGRITY | Last generated: ${new Date().toISOString()}</footer>
</body>
</html>`;
}

// MAIN HANDLER
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "/status") {
      await log(env, "info", "status_page_viewed", "served", request.headers.get("cf-connecting-ip") || "unknown");
      return new Response(await buildStatusPage(env), { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    if (url.pathname === "/check-auth") {
      const bluesky = await checkBlueskyAuth(env);
      const linkedin = await checkLinkedInAuth(env);
      return new Response(JSON.stringify({ checks: [bluesky, linkedin] }, null, 2), { headers: { "Content-Type": "application/json" } });
    }

    if (url.pathname === "/linkedin/authorize") {
      await log(env, "info", "linkedin_oauth_start", "redirecting", "");
      return Response.redirect(linkedinAuthUrl(env), 302);
    }

    if (url.pathname === "/linkedin/callback") {
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");
      if (error || !code) {
        await tier3Alert(env, "linkedin_callback", `OAuth error: ${error || "no code returned"}`);
        return new Response(`LinkedIn auth failed: ${error || "no code returned"}`, { status: 400 });
      }
      try {
        const tokens = await linkedinExchangeCode(env, code);
        await env.KV.put("linkedin:access_token", tokens.access_token, { expirationTtl: tokens.expires_in || 5184000 });
        await log(env, "info", "linkedin_oauth_complete", "success", "Access token stored in KV");
        return Response.redirect("https://socialmedia-agent.northstarhr.workers.dev/status", 302);
      } catch (e) {
        await tier3Alert(env, "linkedin_callback", e.message);
        return new Response(`LinkedIn auth failed: ${e.message}`, { status: 500 });
      }
    }

    return new Response("North Star Agent - Running", { status: 200 });
  },

  async scheduled(event, env, ctx) {
    await log(env, "info", "cron_triggered", "started", event.cron);
    await checkBlueskyAuth(env);
    await checkLinkedInAuth(env);
    await log(env, "info", "cron_triggered", "completed", "Phase 1 checks done");
  },
};
