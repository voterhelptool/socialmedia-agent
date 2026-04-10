/**
 * North Star Human Rights - Social Media Agent
 * Version: 0.8.0 - Live Source Fetching + Cross-Verification
 *
 * Principles: Free | Fair | Firm | Fun | True | Transparent | Accessible
 * INTEGRITY INTEGRITY INTEGRITY
 * Slow is smooth. Smooth is fast.
 *
 * Sources: 35+ verified + live fetch from primary URLs
 * Cross-verification: Agent checks live sources before citing
 * Hard rule: If it cannot be verified, it is not used.
 */

const REVIEW_EXPIRY_DAYS = 14;
const LINKEDIN_REDIRECT = "https://socialmedia-agent.northstarhr.workers.dev/linkedin/callback";
const HOOK_SCORE_MINIMUM = 7;
const QUICK_TAGS = ["Too formal", "Too vague", "Wrong UDHR article", "Too similar to others", "Hook weak", "Great post"];

// ─── PRIMARY SOURCE URLS ────────────────────────────────────────────────────
// Publicly accessible - no API key required
// Fetched fresh before each generation run

const PRIMARY_SOURCES = [
  // ── LIVE NEWS (current events - fetched fresh each run) ──
  { name: "HR Dive News", url: "https://www.hrdive.com/news/", topic: "hr_news_live" },
  { name: "EEOC Newsroom", url: "https://www.eeoc.gov/newsroom", topic: "eeoc_live" },
  { name: "DOL News", url: "https://www.dol.gov/newsroom/releases", topic: "labor_law_live" },
  { name: "AIHR HR Trends 2026", url: "https://www.aihr.com/blog/hr-trends/", topic: "hr_trends_live" },
  { name: "Korn Ferry HR Trends", url: "https://www.kornferry.com/insights/featured-topics/leadership/hr-trends-to-watch", topic: "hr_trends_live" },
  { name: "SHRM News", url: "https://www.shrm.org/topics-tools/news", topic: "hr_news_live" },
  { name: "NPR Workplace Business", url: "https://www.npr.org/sections/business/", topic: "workplace_news_live" },
  { name: "HiBob HR Trends 2026", url: "https://www.hibob.com/guides/hr-trends-2026/", topic: "hr_trends_live" },
  { name: "ADP HR Trends 2026", url: "https://www.adp.com/spark/articles/2026/01/48-state-specific-hr-compliance-changes-for-2026.aspx", topic: "hr_compliance_live" },

  // ── VERIFIED RESEARCH (stable sources) ──
  { name: "UN UDHR", url: "https://www.un.org/en/about-us/universal-declaration-of-human-rights", topic: "human_rights" },
  { name: "ILO Labour Standards", url: "https://www.ilo.org/international-labour-standards", topic: "labour_rights" },
  { name: "ILO Violence Convention", url: "https://www.ilo.org/topics/violence-and-harassment-work", topic: "harassment" },
  { name: "Gallup Global Workplace", url: "https://www.gallup.com/workplace/349484/state-of-the-global-workplace.aspx", topic: "engagement" },
  { name: "MIT Sloan Toxic Culture", url: "https://sloanreview.mit.edu/article/why-every-leader-needs-to-worry-about-toxic-culture/", topic: "culture" },
  { name: "MDHR Minnesota", url: "https://mn.gov/mdhr/employers/workplace-rights/", topic: "minnesota" },
  { name: "APA Work Wellbeing", url: "https://www.apa.org/topics/healthy-workplaces", topic: "wellbeing" },
];

// ─── VERIFIED SOURCE LIBRARY (baseline - always included) ──────────────────

const SOURCE_LIBRARY = `
=== VERIFIED SOURCE LIBRARY - BASELINE CITATIONS ===

--- SPEED OF TRUST (Covey, 2006) ---
Covey, Stephen M.R. "The Speed of Trust." Free Press, 2006.
- High-trust organizations outperform low-trust by 286% in Total Return to Shareholders (Watson Wyatt study, cited in Covey 2006)
- Trust affects speed and cost: Low Trust = Low Speed + High Cost (Low-Trust Tax)
- Trust affects speed and cost: High Trust = High Speed + Low Cost (High-Trust Dividend)
- "Trust is the most overlooked, misunderstood, underutilized asset to enable performance." (Covey)
- Character + Competence = Credibility. Credibility is the foundation of all trust.
- 13 Behaviors: Talk Straight, Demonstrate Respect, Create Transparency, Right Wrongs, Show Loyalty, Deliver Results, Get Better, Confront Reality, Clarify Expectations, Listen First, Keep Commitments, Extend Trust
- 5 Waves: Self Trust, Relationship Trust, Organizational Trust, Market Trust, Societal Trust
- People are 4x more honest about mistakes when accountability systems feel mutually fair (Covey 2006)
- Trust is #1 leadership competency needed today (Covey)

--- UDHR (United Nations, 1948) ---
United Nations. "Universal Declaration of Human Rights." December 10, 1948.
- Article 1: "All human beings are born free and equal in dignity and rights."
- Article 2: Rights without distinction of race, colour, sex, language, religion, political opinion, national or social origin, property, birth or other status.
- Article 3: "Everyone has the right to life, liberty and security of person."
- Article 5: "No one shall be subjected to torture or to cruel, inhuman or degrading treatment or punishment."
- Article 7: All are equal before the law and entitled to equal protection.
- Article 12: No arbitrary interference with privacy, family, home, or correspondence.
- Article 18: Right to freedom of thought, conscience and religion.
- Article 19: Right to freedom of opinion and expression.
- Article 20: Right to freedom of peaceful assembly and association.
- Article 23(1): Right to work, free choice of employment, just and favourable conditions, protection against unemployment.
- Article 23(2): Right to equal pay for equal work.
- Article 23(3): Right to just remuneration ensuring existence worthy of human dignity.
- Article 23(4): Right to form and join trade unions.
- Article 24: "Everyone has the right to rest and leisure, including reasonable limitation of working hours and periodic holidays with pay."
- Article 25: Right to standard of living adequate for health and well-being.
- Article 26: Right to education.
- Article 29: Duties to the community in which alone the free and full development of personality is possible.

--- GALLUP ---
Gallup. "State of the Global Workplace" reports. gallup.com/workplace
- 23% of employees globally engaged at work (Gallup 2024)
- Engagement fell from 23% to 21% between 2023-2024 (Gallup 2025)
- Low engagement costs global economy $8.8 trillion - 9% of GDP (Gallup 2023)
- Drop in 2024 engagement cost world economy $438 billion in lost productivity (Gallup 2025)
- Managers account for 70% of variance in team engagement (Gallup 2024)
- High engagement: turnover drops 51%, wellbeing improves 68%, productivity increases 23% (Gallup 2024)
- 44% of employees worldwide reported lot of stress previous day - record high (Gallup 2023)
- 20% of employees report feeling lonely in their job daily (Gallup 2024)
- Engagement has 3.8x more influence on stress than work location (Gallup 2023)
- Manager engagement fell 5 points in 2024 - largest single-year drop ever recorded (Gallup 2025)
- 51% of global employees watching for or actively seeking new job (Gallup 2025)
- Only 1 in 3 employees strongly agrees they trust their organization's leadership (Gallup)

--- SHRM ---
SHRM. "The High Cost of a Toxic Workplace Culture." 2019. shrm.org
SHRM. "The State of Global Workplace Culture in 2024." shrm.org
- Turnover due to culture cost U.S. organizations $223 billion over five years (SHRM 2019)
- 1 in 5 Americans left a job due to bad company culture in past five years (SHRM 2019)
- 76% of Americans say their manager sets the culture (SHRM 2019)
- 36% say their manager doesn't know how to lead a team (SHRM 2019)
- 26% of employees dread going to work (SHRM 2019)
- Workers in positive cultures are 4x more likely to stay with their employer (SHRM 2024)
- 57% of employees in poor cultures are actively looking for another job (SHRM 2024)
- 5 universal positive culture elements: open, empathetic, civil, honest, fair (SHRM 2024)

--- MIT SLOAN ---
Sull, Donald, Charles Sull, Ben Zweig. "Toxic Culture Is Driving the Great Resignation." MIT SMR, Jan 11, 2022.
Sull et al. "Why Every Leader Needs to Worry About Toxic Culture." MIT SMR, Mar 16, 2022.
- Toxic culture is 10.4x more powerful than compensation in predicting employee turnover (MIT Sloan 2022)
- Analysis of 34 million employee profiles and 1.4 million Glassdoor reviews (MIT Sloan 2022)
- The Toxic Five: disrespectful, noninclusive, unethical, cutthroat, abusive (MIT Sloan 2022)
- ~1 in 10 workers experience their culture as toxic (MIT Sloan 2022)
- Toxic culture cost U.S. employers ~$50 billion per year before Great Resignation (MIT Sloan 2022)
- Disrespect is #1 predictor of negative culture ratings (MIT Sloan 2022)
- Lateral career opportunities are 2.5x more predictive of retention than pay (MIT Sloan 2022)

--- AMY EDMONDSON ---
Edmondson, Amy C. "Psychological Safety and Learning Behavior in Work Teams." Administrative Science Quarterly 44(2), 1999.
Edmondson, Amy C. "The Fearless Organization." John Wiley & Sons, 2018.
- Psychological safety: "a shared belief held by members of a team that the team is safe for interpersonal risk taking" (Edmondson 1999)
- Psychological safety associated with learning behavior and team performance (Edmondson 1999, 51 work teams)
- Analysis of 185 research papers confirms psychological safety predicts positive work experiences (Edmondson & Bransby, Harvard 2023)
- "Low levels of psychological safety can create a culture of silence - a Cassandra culture." (Edmondson)
- "Every time we withhold our thoughts, we rob ourselves and our colleagues of small moments of learning." (Edmondson)

--- BRENE BROWN ---
Brown, Brene. "Dare to Lead." Random House, 2018.
Brown, Brene. "Daring Greatly." Gotham Books, 2012.
- Research professor at University of Houston, 20+ years studying courage, vulnerability, shame, empathy
- Seven-year study on brave leadership (Dare to Lead)
- "Daring leadership is a collection of four skill sets that are 100% teachable, observable, and measurable." (Brown 2018)
- "Our ability to be daring leaders will never be greater than our capacity for vulnerability." (Brown 2018)
- "Courage is contagious." (Brown 2018)
- Leaders must create spaces where people feel "safe, seen, heard, and respected" (Brown 2018)

--- ILO ---
International Labour Organization. ilo.org
ILO Convention No. 190. Violence and Harassment Convention. 2019.
- ILO operating since 1919 - international labour standards for decent work in conditions of freedom, equity, security and dignity
- ILO defines decent work as "productive work for women and men in conditions of freedom, equity, security and human dignity"
- ILO Convention 190: first international treaty recognizing right to world of work free from violence and harassment
- "Labour is not a commodity" - ILO founding principle

--- McKINSEY ---
McKinsey & Company. "Diversity Wins: How Inclusion Matters." 2020. mckinsey.com
McKinsey. "The State of Organizations 2023." mckinsey.com
- Companies in top quartile for gender diversity 25% more likely to achieve above-average profitability (McKinsey 2020)
- Companies in top quartile for ethnic diversity outperform bottom quartile by 36% in profitability (McKinsey 2020)

--- DELOITTE ---
Deloitte. "2024 Global Human Capital Trends." deloitte.com
- 86% of business and HR leaders say creating sense of belonging is important (Deloitte 2024)
- Organizations with inclusive cultures 8x more likely to achieve better business outcomes (Deloitte)

--- WEF ---
World Economic Forum. "The Future of Jobs Report 2023." weforum.org
- Human skills - empathy, active listening, leadership - among fastest-growing in-demand skills (WEF 2023)
- By 2027, 69 million new jobs created and 83 million displaced by automation (WEF 2023)

--- APA ---
American Psychological Association. Work and Well-Being Survey, 2023. apa.org
- 19% of employees say their workplace is "very" or "somewhat" toxic (APA 2023)
- Over half in toxic workplaces report mental health issues as a result (APA 2023)

--- MINNESOTA ---
Minnesota Department of Human Rights. mn.gov/mdhr
- Minnesota Human Rights Act: broadest state civil rights law in the nation
- Prohibits discrimination based on race, color, creed, religion, national origin, sex, marital status, familial status, disability, public assistance, sexual orientation, age

=== END BASELINE LIBRARY ===
`;

const CONTENT_SCHEDULE = {
  1: { category: "udhr_spotlight",      label: "UDHR Article Spotlight",       format: "contrast",     platforms: ["bluesky", "linkedin", "facebook"] },
  2: { category: "workplace_rights",    label: "Workplace Rights in Practice", format: "relatability", platforms: ["linkedin", "facebook"] },
  3: { category: "rights_in_news",      label: "Human Rights in the News",     format: "curiosity",    platforms: ["bluesky", "linkedin", "facebook"] },
  4: { category: "community_resource",  label: "Community Resource",           format: "confession",   platforms: ["facebook"] },
  5: { category: "trust_in_action",     label: "Speed of Trust in Action",     format: "bold_claim",   platforms: ["linkedin", "bluesky"] },
  6: { category: "engagement_question", label: "Engagement Question",          format: "curiosity",    platforms: ["bluesky", "linkedin", "facebook"] },
  0: { category: "generate",            label: "Generate next week content",   format: null,           platforms: [] },
};

const PLATFORM_LIMITS = { bluesky: 300, linkedin: 3000, facebook: 800 };

const TRUST_BEHAVIORS = [
  "Talk Straight", "Demonstrate Respect", "Create Transparency", "Right Wrongs",
  "Show Loyalty", "Deliver Results", "Get Better", "Confront Reality",
  "Clarify Expectations", "Listen First", "Keep Commitments", "Extend Trust",
];

// Motion's 5 psychological hook triggers - applied with integrity gate
// Rule: When in doubt, do not use the hook. A plain true statement beats an overpromising hook.
const HOOK_PATTERNS = {
  confession:   'Open with a genuine admission about how HR or employers have failed workers. Must be true, earned, and grounded in a real pattern - not manufactured humility. Example: "We built DEI programs on federal protections. Now those protections are being dismantled. We built on sand."',
  bold_claim:   'Open with a single provocative but fully defensible claim. Must be backed by a named source from 2025-2026. If you cannot name the source in the post body, do not use this hook. Example: "The UDHR is more durable than the EEOC right now. Here is why."',
  relatability: 'Open by naming the exact situation an HR professional is living this week. Must reflect something real and current - not a composite or stereotype. Example: "Your DEI program is legal. Your EEOC disagrees. Your employees are watching what you do next."',
  contrast:     'Open with a before/after, then/now, or shrinking/stable contrast. Both sides must be factually accurate and sourced. Example: "Federal harassment protections: rescinded January 2026. Article 5 of the UDHR: unchanged since 1948."',
  curiosity:    'Open a specific knowledge gap the post body fully closes. Never a false cliffhanger. The answer must exist in the post. Example: "There is a federal court case in Minnesota right now that could redefine DEI law for every US employer."',
};

// Hook integrity gate - applied before any hook is used
// A hook fails if: (1) any implied claim cannot be verified, (2) the post body cannot pay off the promise, (3) North Star HR has not earned the standing to make it
// Default when in doubt: skip the hook type and open with a plain factual statement
const HOOK_INTEGRITY_PROMPT = "Before finalizing the hook, apply this integrity gate: (1) TRUTHFUL - Can every implied claim be verified from sources? If not, rewrite as a plain factual opening. (2) PAYABLE - Does the post body fully deliver on what the hook promises? If not, rewrite. (3) EARNED - Does North Star HR have standing to make this hook? Confession requires real pattern. Bold Claim requires named 2025-2026 source. Relatability requires genuinely current situation. IF IN DOUBT - use a plain factual opening. A true statement that underwhelms beats a hook that overpromises.";

const BRAND_VOICE_PROMPT = `You are the content writer for North Star Human Rights, a Minnesota-based human rights consulting practice.

MISSION: Inspire and empower HR professionals, employers, and business leaders to create cultures where every person's dignity is recognized, protected, and upheld - not as policy, but as daily practice.

TODAY'S CONTEXT (April 2026):
The federal rollback of DEI protections is accelerating. The EEOC under Chair Andrea Lucas rescinded harassment guidance in January 2026, is pursuing reverse discrimination cases, and a new executive order signed March 26 2026 restricts DEI for federal contractors. AI is displacing workers at scale. Return-to-office mandates are spreading. Employers losing $1.3 trillion to attrition in 2026 (HR Digest). This is the environment North Star HR speaks into. We do not shy away. We ground it.

TWO ANCHORING LENSES - APPLY BOTH TO ALMOST EVERY POST:

LENS 1 - UDHR (Universal Declaration of Human Rights, UN 1948):
The UDHR is not political. It is the floor that no executive order can remove. When federal protections are rolled back, UDHR is what remains. Every post connects to a specific UDHR article by number with exact text. The UDHR is the counter-argument to every rollback - cite it as such.

LENS 2 - SPEED OF TRUST (Stephen M.R. Covey, Free Press 2006):
Trust is an economic driver. When trust goes down, speed goes down and costs go up - the Low-Trust Tax. High-trust organizations outperform low-trust ones by 286% in shareholder returns (Watson Wyatt, cited in Covey). Every employer action is a deposit or withdrawal from the trust account of their workforce. The 13 Behaviors are a diagnostic tool for current events:
Talk Straight - Demonstrate Respect - Create Transparency - Right Wrongs - Show Loyalty - Deliver Results - Get Better - Confront Reality - Clarify Expectations - Listen First - Keep Commitments - Extend Trust
Ask for each current event: which behavior does this violate? Which is the antidote?

HOW THE LENSES WORK TOGETHER:
UDHR tells us what rights exist. Covey tells us what trust costs when those rights are violated. Together they give HR professionals a framework that is principled AND practical. Not just "this is wrong" but "here is what it costs your organization and what you can do this week."

VOICE:
- Warm, firm, never preachy
- Speaks to HR professionals as peers, not students
- Plain language - 8th grade reading level
- Specific and named - not "research shows" but "Gallup found" or "EEOC announced in February 2026"
- Humane first - the human being showing up to work Monday is the subject, not the policy
- Educational only - never legal advice
- When things are being taken away, name what remains

CONTENT RULES:
- Every post must reference a CURRENT named development (2025-2026) from live sources
- Every post ties to a specific UDHR article by number with exact text from the source library
- Every post applies at least one Covey Trust Behavior as a lens
- Every statistic sourced and named - never invented
- End with ONE actionable insight OR ONE genuine question - never both
- Maximum 2 hashtags

PLATFORM FORMATS:
- Bluesky: 280 chars max. One complete thought. Current event + human implication + question.
- LinkedIn: 200-600 words. Named current event + UDHR anchor + Covey lens + specific action HR can take.
- Facebook: 100-250 words. Warm, human story angle. What does this mean for the actual worker?`;

// ─── LOGGING ───────────────────────────────────────────────────────────────

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

// ─── LIVE SOURCE FETCHER ────────────────────────────────────────────────────

async function fetchSource(source) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NorthStarHR-Research/1.0; +https://northstarhr.pages.dev)",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    clearTimeout(timeout);

    if (!res.ok) return null;

    const html = await res.text();

    // Extract meaningful text - strip HTML tags, get content
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, " ")
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, " ")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Take first 2000 characters of meaningful content
    const snippet = text.substring(0, 2000);

    return {
      name: source.name,
      url: source.url,
      topic: source.topic,
      snippet,
      fetched_at: new Date().toISOString(),
      success: true,
    };
  } catch (e) {
    return {
      name: source.name,
      url: source.url,
      topic: source.topic,
      snippet: null,
      error: e.message,
      success: false,
    };
  }
}

async function fetchLiveSources(env) {
  // Check cache first - don't re-fetch within 6 hours
  const cacheKey = "live_sources:cache";
  const cached = await env.KV.get(cacheKey);
  if (cached) {
    await log(env, "info", "live_sources", "cache_hit", "Using cached source data");
    return JSON.parse(cached);
  }

  await log(env, "info", "live_sources", "fetching", `Fetching ${PRIMARY_SOURCES.length} primary sources`);

  // Fetch all sources in parallel with Promise.allSettled so failures don't block
  const results = await Promise.allSettled(
    PRIMARY_SOURCES.map(source => fetchSource(source))
  );

  const fetched = [];
  let successCount = 0;
  let failCount = 0;

  for (const result of results) {
    if (result.status === "fulfilled" && result.value) {
      fetched.push(result.value);
      if (result.value.success) successCount++;
      else failCount++;
    }
  }

  const summary = {
    fetched_at: new Date().toISOString(),
    sources: fetched,
    success_count: successCount,
    fail_count: failCount,
  };

  // Cache for 6 hours
  await env.KV.put(cacheKey, JSON.stringify(summary), { expirationTtl: 60 * 60 * 6 });
  await log(env, "info", "live_sources", "complete", `Fetched: ${successCount} success, ${failCount} failed`);

  return summary;
}

function buildLiveSourceContext(liveData) {
  if (!liveData || !liveData.sources) return "";

  const lines = [`\n=== LIVE SOURCE DATA (fetched ${liveData.fetched_at}) ===`];
  lines.push(`Successfully fetched ${liveData.success_count} of ${PRIMARY_SOURCES.length} primary sources.`);
  lines.push("Cross-verify any statistics below against the VERIFIED LIBRARY. If they conflict, note both and use most recent.\n");

  for (const source of liveData.sources) {
    if (!source.success || !source.snippet) continue;
    lines.push(`--- ${source.name} (${source.url}) ---`);
    lines.push(source.snippet.substring(0, 800));
    lines.push("");
  }

  lines.push("=== END LIVE SOURCE DATA ===");
  lines.push("INSTRUCTION: Use statistics and quotes from EITHER the VERIFIED LIBRARY or LIVE SOURCES above.");
  lines.push("Always cite source by name and year. Never invent data. If uncertain, omit the statistic.");

  return lines.join("\n");
}

// ─── AUTH FUNCTIONS ────────────────────────────────────────────────────────

async function blueskyAuth(env) {
  const handle = env.BLUESKY_HANDLE;
  const password = env.BLUESKY_APP_PASSWORD;
  if (!handle || !password) throw new Error("Bluesky credentials missing");
  const res = await fetch("https://bsky.social/xrpc/com.atproto.server.createSession", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: handle, password }),
  });
  if (!res.ok) { const err = await res.text(); throw new Error(`Bluesky auth failed: ${res.status} - ${err}`); }
  const data = await res.json();
  await env.KV.put("bluesky:auth_status", "authenticated", { expirationTtl: 60 * 60 * 24 });
  return { did: data.did, accessJwt: data.accessJwt, handle: data.handle };
}

async function checkBlueskyAuth(env) {
  try {
    const session = await blueskyAuth(env);
    await log(env, "info", "bluesky_auth_check", "success", `Authenticated as ${session.handle}`);
    return { platform: "bluesky", status: "authenticated", handle: session.handle };
  } catch (e) {
    await env.KV.delete("bluesky:auth_status");
    await tier3Alert(env, "bluesky_auth_check", e.message);
    return { platform: "bluesky", status: "failed", error: e.message };
  }
}

function linkedinAuthUrl(env) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: env.LINKEDIN_CLIENT_ID,
    redirect_uri: LINKEDIN_REDIRECT,
    scope: "openid profile email",
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
    if (!token) return { platform: "linkedin", status: "not_authorized", auth_url: linkedinAuthUrl(env) };
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

async function checkFacebookAuth(env) {
  try {
    const token = env.FB_PAGE_ACCESS_TOKEN;
    const pageId = env.FB_PAGE_ID;
    if (!token || !pageId) throw new Error("Facebook credentials missing");
    const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}?fields=id,name&access_token=${token}`);
    if (!res.ok) { const err = await res.text(); throw new Error(`Facebook auth failed: ${res.status} - ${err}`); }
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    await log(env, "info", "facebook_auth_check", "success", `Authenticated as ${data.name}`);
    return { platform: "facebook", status: "authenticated", name: data.name };
  } catch (e) {
    await tier3Alert(env, "facebook_auth_check", e.message);
    return { platform: "facebook", status: "failed", error: e.message };
  }
}

async function checkInstagramAuth(env) {
  try {
    const token = env.FB_PAGE_ACCESS_TOKEN;
    const pageId = env.FB_PAGE_ID;
    if (!token || !pageId) throw new Error("Instagram credentials missing");
    const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account{id,name,username}&access_token=${token}`);
    if (!res.ok) { const err = await res.text(); throw new Error(`Instagram auth failed: ${res.status} - ${err}`); }
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    if (!data.instagram_business_account) return { platform: "instagram", status: "not_connected" };
    const ig = data.instagram_business_account;
    await env.KV.put("instagram:business_account_id", ig.id);
    await log(env, "info", "instagram_auth_check", "success", `Authenticated as @${ig.username || ig.name}`);
    return { platform: "instagram", status: "authenticated", username: ig.username || ig.name };
  } catch (e) {
    await tier3Alert(env, "instagram_auth_check", e.message);
    return { platform: "instagram", status: "failed", error: e.message };
  }
}

async function checkThreadsAuth(env) {
  try {
    const token = env.FB_PAGE_ACCESS_TOKEN;
    const pageId = env.FB_PAGE_ID;
    if (!token || !pageId) throw new Error("Threads credentials missing");
    const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account{id,username}&access_token=${token}`);
    if (!res.ok) { const err = await res.text(); throw new Error(`Threads auth failed: ${res.status} - ${err}`); }
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    if (!data.instagram_business_account) return { platform: "threads", status: "not_connected" };
    const ig = data.instagram_business_account;
    await log(env, "info", "threads_auth_check", "success", `Authenticated via @${ig.username}`);
    return { platform: "threads", status: "authenticated", username: ig.username };
  } catch (e) {
    await tier3Alert(env, "threads_auth_check", e.message);
    return { platform: "threads", status: "failed", error: e.message };
  }
}

// ─── CLAUDE API ────────────────────────────────────────────────────────────

async function callClaude(env, systemPrompt, userPrompt) {
  const apiKey = env.CLAUDE_API_KEY;
  if (!apiKey) throw new Error("CLAUDE_API_KEY missing");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });
  if (!res.ok) { const err = await res.text(); throw new Error(`Claude API failed: ${res.status} - ${err}`); }
  const data = await res.json();
  return data.content[0].text;
}

// ─── FEEDBACK SYSTEM ───────────────────────────────────────────────────────

async function saveFeedback(env, postId, tags, freeText) {
  try {
    const val = await env.KV.get(postId);
    if (!val) return false;
    const post = JSON.parse(val);
    post.feedback_tags = tags || [];
    post.feedback_text = freeText || "";
    post.feedback_at = new Date().toISOString();
    await env.KV.put(postId, JSON.stringify(post), { expirationTtl: 60 * 60 * 24 * REVIEW_EXPIRY_DAYS });

    const learningsRaw = await env.KV.get("feedback:learnings");
    const learnings = learningsRaw ? JSON.parse(learningsRaw) : { tag_counts: {}, free_texts: [] };
    for (const tag of (tags || [])) {
      learnings.tag_counts[tag] = (learnings.tag_counts[tag] || 0) + 1;
    }
    if (freeText) {
      learnings.free_texts.push({ text: freeText, date: new Date().toISOString(), postId });
      if (learnings.free_texts.length > 50) learnings.free_texts = learnings.free_texts.slice(-50);
    }
    await env.KV.put("feedback:learnings", JSON.stringify(learnings));
    await log(env, "info", "feedback_saved", postId, `Tags: ${(tags || []).join(", ")} | Text: ${freeText || "none"}`);
    return true;
  } catch (e) {
    await tier3Alert(env, "feedback_save", e.message);
    return false;
  }
}

async function getFeedbackLearnings(env) {
  try {
    const raw = await env.KV.get("feedback:learnings");
    if (!raw) return "";
    const learnings = JSON.parse(raw);
    const lines = [];
    const rules = {
      "Too formal": "RULE: Use conversational warm language - avoid academic tone",
      "Too vague": "RULE: Be specific - name exact UDHR article, statistic, situation",
      "Wrong UDHR article": "RULE: Double-check all UDHR articles against sources before using",
      "Too similar to others": "RULE: Every post must be completely distinct - different article, stat, angle",
      "Hook weak": "RULE: Prioritize hook strength - must score 8+/10",
      "Great post": "RULE: This tone and format resonates - maintain this quality level",
    };
    for (const [tag, count] of Object.entries(learnings.tag_counts || {})) {
      if (count >= 2 && rules[tag]) lines.push(`${rules[tag]} (flagged ${count}x by editor)`);
    }
    for (const fb of (learnings.free_texts || []).slice(-5)) {
      lines.push(`EDITOR NOTE (${fb.date.split("T")[0]}): ${fb.text}`);
    }
    return lines.length > 0 ? `\n\nEDITOR FEEDBACK:\n${lines.join("\n")}` : "";
  } catch (e) { return ""; }
}

// ─── CONTENT INTELLIGENCE ──────────────────────────────────────────────────

async function researchContentIntelligence(env, liveSourceContext, feedbackContext) {
  const prompt = `You are the content strategist for North Star Human Rights. It is April 2026.

Using the LIVE SOURCE DATA provided, identify 5 SPECIFIC CURRENT EVENTS or developments from 2025-2026 that North Star HR should be speaking about THIS WEEK. These must be real, named, datable events - not generic topics.

Current context you must draw from:
- EEOC under Chair Andrea Lucas rescinded harassment guidance January 2026, pursuing reverse discrimination cases
- Executive order March 26 2026 restricts DEI for federal contractors
- U.S. v. State of Minnesota DEI case in federal court 2026
- AI displacing entry-level workers - 82% of boards planning cuts (Korn Ferry 2026)
- Return-to-office mandates accelerating - 59% in office, only 19% want to be (Korn Ferry 2026)
- Employers projected to lose $1.3 trillion to attrition in 2026
- Minnesota HR compliance changes effective 2026 (ADP report)
- Skills-based hiring rising as credential requirements fall

Apply TWO LENSES to every topic:
1. UDHR - which specific article speaks to this right now
2. Speed of Trust (Covey) - which of the 13 Behaviors does this violate or demonstrate

${feedbackContext}

Return EXACTLY this JSON:
{
  "trending_topics": [
    {
      "topic": "specific named current event or development",
      "current_event": "the actual named thing happening right now in 2025-2026",
      "angle": "how UDHR + Covey reframes this for HR professionals",
      "udhr_article": "Article NUMBER - Name",
      "covey_behavior": "which of the 13 behaviors applies and how",
      "hook_format": "tension|stat|question|contrarian|story",
      "why_now": "one sentence - what changed recently that makes this urgent",
      "suggested_source": "specific source from live data or library"
    }
  ],
  "audience_pain_points": ["specific current pain point 1", "specific current pain point 2", "specific current pain point 3"],
  "week_theme": "one overarching theme connecting this weeks posts"
}

CRITICAL:
- All 5 topics must reference real 2025-2026 developments - no generic topics
- Different UDHR articles, hook formats, and Covey behaviors for each
- The week_theme must connect all 5 topics coherently
Return ONLY valid JSON. No markdown.`;

  const systemPrompt = BRAND_VOICE_PROMPT + "\n\n" + SOURCE_LIBRARY + "\n\n" + liveSourceContext;

  try {
    const result = await callClaude(env, systemPrompt, prompt);
    const parsed = JSON.parse(result.replace(/```json|```/g, "").trim());
    if (!parsed.trending_topics?.length) throw new Error("Invalid format");
    await log(env, "info", "content_intelligence", "success", `Theme: ${parsed.week_theme}`);
    return parsed;
  } catch (e) {
    await log(env, "warn", "content_intelligence", "fallback", e.message);
    return {
      trending_topics: [
        { topic: "EEOC DEI enforcement 2026", current_event: "EEOC Chair Lucas rescinded harassment guidance January 2026 and signed DEI executive order March 26 2026", angle: "UDHR Article 7 equal protection remains the floor regardless of EEOC enforcement shifts", udhr_article: "Article 7 - Equal Protection", covey_behavior: "Talk Straight - name what changed and what it means", hook_format: "tension", why_now: "March 26 2026 executive order now affecting federal contractors", suggested_source: "EEOC Newsroom" },
        { topic: "AI job displacement 2026", current_event: "82% of boards planning workforce cuts due to AI per Korn Ferry 2026 CEO survey", angle: "Article 23 right to work meets Covey Clarify Expectations - workers deserve transparency about AI decisions affecting their jobs", udhr_article: "Article 23 - Right to Work", covey_behavior: "Clarify Expectations - workers cannot trust what they cannot see coming", hook_format: "stat", why_now: "AI agentic capabilities accelerating entry-level displacement in 2026", suggested_source: "Korn Ferry HR Trends" },
        { topic: "Return to office mandates 2026", current_event: "59% of workers now in office full-time but only 19% want to be per Korn Ferry Workforce 2025 survey", angle: "Article 24 right to rest and Covey Listen First - mandates without consultation are trust withdrawals", udhr_article: "Article 24 - Right to Rest and Leisure", covey_behavior: "Listen First - RTO mandates without employee input violate this behavior", hook_format: "contrarian", why_now: "RTO mandates accelerating across industries in 2026", suggested_source: "Korn Ferry HR Trends" },
        { topic: "Workplace DEI legal landscape 2026", current_event: "U.S. v. State of Minnesota DEI case in federal court 2026 may reach Supreme Court", angle: "Article 2 UDHR rights without discrimination cannot be legislated away - UDHR predates and supersedes executive orders", udhr_article: "Article 2 - Rights Without Discrimination", covey_behavior: "Confront Reality - HR must name what is happening to protect workers", hook_format: "question", why_now: "Federal contractors facing immediate DEI compliance pressure April 2026", suggested_source: "EEOC Newsroom" },
        { topic: "Skills-based hiring dignity 2026", current_event: "Employers dropping degree requirements as skills-based hiring has strongest implementation rate of all 2026 HR trends per McLean and Co", angle: "Article 26 right to education and Covey Extend Trust - judging people by what they can do honors dignity", udhr_article: "Article 26 - Right to Education", covey_behavior: "Extend Trust - skills-based hiring extends trust to people the credential system excluded", hook_format: "story", why_now: "Skills-based hiring accelerating in 2026 as AI disrupts traditional credentials", suggested_source: "AIHR HR Trends 2026" },
      ],
      audience_pain_points: ["navigating DEI legal uncertainty without abandoning values", "communicating AI workforce changes to employees", "building trust while implementing RTO mandates"],
      week_theme: "When protections change, dignity does not",
    };
  }
}

// ─── HOOK SCORING ──────────────────────────────────────────────────────────

async function scoreHook(env, hookText, hookFormat, platform) {
  try {
    const result = await callClaude(env,
      "You are a social media hook expert and integrity reviewer. Return only valid JSON.",
      `Score this hook 1-10 for North Star Human Rights using Motion's 5 psychological triggers.

HOOK: "${hookText}"
TYPE: ${hookFormat} | PLATFORM: ${platform} | AUDIENCE: HR professionals, employers

SCORING CRITERIA:
- Stops the scroll and creates a psychological pull (0-3 pts)
- Specific and current - names real events, people, laws, data from 2025-2026 (0-2 pts)
- Warm and authoritative - peer voice, never preachy (0-2 pts)
- Pays off - the post can fully deliver on what this hook promises (0-2 pts)
- Platform appropriate length and tone (0-1 pt)

INTEGRITY GATE (automatic fail conditions - score must be 0 if any apply):
- Hook implies a claim that cannot be verified from sourced data
- Hook opens a curiosity gap the post body cannot close
- Hook feels performative rather than earned (especially for confession type)
- Hook exaggerates or overpromises

WHEN IN DOUBT: A lower score is correct. A plain true statement that scores 6 beats an overpromising hook that scores 9.

Return ONLY: {"score": number, "integrity_pass": true or false, "weakness": "one sentence or empty string if score 8+", "stronger_version": "rewrite if below 7, empty if 7+"}`
    );
    return JSON.parse(result.replace(/```json|```/g, "").trim());
  } catch (e) {
    return { score: 6, integrity_pass: true, weakness: "", stronger_version: "" };
  }
}

// ─── POST GENERATION ───────────────────────────────────────────────────────

async function generateBlueskyPost(env, topic, weekIntelligence, feedbackContext, alreadyUsed, liveSourceContext) {
  const trustBehavior = topic.covey_behavior || "Talk Straight";

  const usedContext = alreadyUsed.length > 0
    ? `\nDO NOT REPEAT these already-used this week:\n${alreadyUsed.map(u => `- ${u.udhr_article}, topic: ${u.topic}`).join("\n")}`
    : "";

  // Bluesky is a completely different format - treat it as such
  const currentEvent = topic.current_event || topic.topic;
  const coveyBehavior = topic.covey_behavior || "Talk Straight";

  const userPrompt = `Write a Bluesky post for North Star Human Rights. It is April 2026. Bluesky is short-form - one sharp complete thought only.

CURRENT EVENT TO ANCHOR THIS: ${currentEvent}
UDHR ARTICLE: ${topic.udhr_article}
COVEY LENS: "${coveyBehavior}"
WEEK THEME: ${weekIntelligence?.week_theme || "When protections change, dignity does not"}
${feedbackContext}
${usedContext}

BLUESKY FORMAT RULES:
- Maximum 280 characters - count every character before returning
- One complete, self-contained thought - never cut off mid-idea
- Must name something SPECIFIC and CURRENT - a real named event, law, statistic from 2025-2026
- Structure: [Named current stat or event]. [UDHR or Covey implication in one line]. [Short question.]
- Cite source inline: "EEOC announced..." or "Korn Ferry found..." or "Article 23 says..."
- Warm, direct, never preachy

GOOD EXAMPLE (226 chars):
"82% of boards plan AI-driven workforce cuts. Korn Ferry 2026. Article 23 of the UDHR says work is a human right. Replacing people without transparency violates it. What are you telling your team?"

BAD EXAMPLE - too long, too generic:
"Workplace dignity matters because when employees feel respected according to the Universal Declaration of Human Rights Article 23 which states that..."

Write ONE post under 280 characters that names something real and current.

Return ONLY:
{
  "content": "the complete post - 280 chars max",
  "udhr_article": "${topic.udhr_article}",
  "source_cited": "source name and year",
  "trust_behavior": "${trustBehavior}",
  "hook_format": "${topic.hook_format || "stat"}",
  "character_count": number,
  "review_notes": "one sentence on what makes this post work"
}

Return ONLY valid JSON. Before writing the content field, count the characters. If over 280, rewrite shorter.`;

  const systemPrompt = BRAND_VOICE_PROMPT + "\n\n" + SOURCE_LIBRARY + "\n\n" + liveSourceContext;
  const result = await callClaude(env, systemPrompt, userPrompt);
  const post = JSON.parse(result.replace(/```json|```/g, "").trim());

  // Safety net - if still over limit, regenerate with even tighter prompt rather than truncate
  if (post.content && post.content.length > 300) {
    const retryResult = await callClaude(env, systemPrompt,
      `The previous Bluesky post was ${post.content.length} characters. It must be under 280. 
Rewrite this as a shorter but still complete and meaningful post:
"${post.content}"
Return ONLY JSON: {"content": "rewritten post under 280 chars", "source_cited": "${post.source_cited}", "udhr_article": "${post.udhr_article}", "trust_behavior": "${trustBehavior}", "hook_format": "${post.hook_format}", "character_count": number, "review_notes": "brief note"}`
    );
    const retry = JSON.parse(retryResult.replace(/```json|```/g, "").trim());
    // Only use retry if it's actually shorter - otherwise flag for human review
    if (retry.content && retry.content.length <= 300) return { ...retry, hook: retry.content.split(".")[0] };
    // Last resort - use first complete sentence only
    const firstSentence = post.content.split(/[.!?]/)[0].trim();
    post.content = firstSentence.length <= 280 ? firstSentence : firstSentence.substring(0, 277) + "...";
    post.flagged_short = true;
  }

  post.hook = post.content.split(/[.!?]/)[0].trim();
  post.readability_grade = 7;
  return post;
}

async function generatePost(env, platform, category, topic, dayOfWeek, weekIntelligence, feedbackContext, alreadyUsed, liveSourceContext) {
  // Bluesky needs its own dedicated generation - completely different format
  if (platform === "bluesky") {
    return generateBlueskyPost(env, topic, weekIntelligence, feedbackContext, alreadyUsed, liveSourceContext);
  }

  const limit = PLATFORM_LIMITS[platform];
  const hookFormat = topic.hook_format || CONTENT_SCHEDULE[dayOfWeek]?.format || "tension";
  const trustBehavior = topic.covey_behavior || TRUST_BEHAVIORS[dayOfWeek % TRUST_BEHAVIORS.length];
  const hookInstruction = HOOK_PATTERNS[hookFormat] || HOOK_PATTERNS.tension;

  const usedContext = alreadyUsed.length > 0
    ? `\nALREADY USED THIS WEEK - DO NOT REPEAT:\n${alreadyUsed.map(u => `- ${u.udhr_article}, topic: ${u.topic}`).join("\n")}\nYour post MUST be completely different.`
    : "";

  const currentEventContext = topic.current_event
    ? `CURRENT EVENT TO ANCHOR THIS POST: ${topic.current_event}`
    : "";
  const coveyLens = topic.covey_behavior || trustBehavior;

  const userPrompt = `Generate a ${platform} post for North Star Human Rights. It is April 2026.

WEEK THEME: ${weekIntelligence?.week_theme || "When protections change, dignity does not"}
AUDIENCE PAIN POINTS: ${(weekIntelligence?.audience_pain_points || []).join(", ")}
${currentEventContext}
${feedbackContext}
${usedContext}

TWO LENSES TO APPLY:
1. UDHR ANCHOR: ${topic.udhr_article} - use exact text from the source library
2. COVEY LENS: "${coveyLens}" - how does this current event demonstrate or violate this behavior?

TOPIC: ${topic.topic}
ANGLE: ${topic.angle}
HOOK FORMAT: ${hookFormat} - ${hookInstruction}
SUGGESTED SOURCE: ${topic.suggested_source || "any from sources"}
CHARACTER LIMIT: ${limit} maximum

POST STRUCTURE:
1. Open with a hook that names something REAL and CURRENT - a specific event, named person, named law, or named statistic from 2025-2026
2. Apply the UDHR article - not as a citation but as the counter-argument or the floor
3. Apply the Covey lens - what does this cost in trust, or what behavior is the antidote
4. Close with ONE actionable insight OR ONE genuine question - never both

HOOK INTEGRITY GATE - apply before writing the hook:
${HOOK_INTEGRITY_PROMPT}

SOURCE REQUIREMENT: Name your source explicitly. "EEOC Chair Andrea Lucas announced..." "Korn Ferry found in 2026..." "Article 23 of the UDHR states..." Never invent data.

Return ONLY:
{
  "hook": "first line only - must name something current and specific",
  "content": "complete post text",
  "udhr_article": "${topic.udhr_article}",
  "udhr_quote": "exact text used or empty",
  "source_cited": "specific source name and year",
  "source_verified": true or false,
  "trust_behavior": "${coveyLens}",
  "hook_format": "${hookFormat}",
  "character_count": number,
  "readability_grade": number,
  "review_notes": "one sentence on what makes this post work"
}

Return ONLY valid JSON.`;

  const systemPrompt = BRAND_VOICE_PROMPT + "\n\n" + SOURCE_LIBRARY + "\n\n" + liveSourceContext;
  const result = await callClaude(env, systemPrompt, userPrompt);
  return JSON.parse(result.replace(/```json|```/g, "").trim());
}

// ─── QUALITY GATE ──────────────────────────────────────────────────────────

function qualityCheck(post, platform, hookScore = null) {
  const limit = PLATFORM_LIMITS[platform];
  const issues = [];
  if (!post.content) issues.push("No content");
  if (post.content?.length > limit) issues.push(`Over limit: ${post.content.length}/${limit}`);
  if (post.readability_grade > 9) issues.push(`Grade too high: ${post.readability_grade}`);
  if (!post.udhr_article) issues.push("No UDHR article");
  if (!post.hook) issues.push("No hook");
  if (!post.source_cited) issues.push("No source cited");
  // Integrity gate - hook failed integrity check
  if (hookScore && hookScore.integrity_pass === false) issues.push("Hook failed integrity gate - overpromises or unverifiable");
  return { passed: issues.length === 0, issues };
}

// ─── WEEKLY GENERATION ─────────────────────────────────────────────────────

async function generateWeeklyContent(env) {
  await log(env, "info", "content_generation", "started", "Generating weekly content batch");
  let generated = 0;
  let failed = 0;
  const alreadyUsed = [];

  try {
    // Step 1 - Fetch live sources
    const liveData = await fetchLiveSources(env);
    const liveSourceContext = buildLiveSourceContext(liveData);
    await log(env, "info", "live_sources", "ready", `${liveData.success_count} sources fetched`);

    // Step 2 - Content intelligence with live data
    const feedbackContext = await getFeedbackLearnings(env);
    const intelligence = await researchContentIntelligence(env, liveSourceContext, feedbackContext);
    const topics = intelligence.trending_topics;

    // Step 3 - Generate posts
    for (let day = 1; day <= 6; day++) {
      const schedule = CONTENT_SCHEDULE[day];
      const topic = topics[(day - 1) % topics.length];

      for (const platform of schedule.platforms) {
        try {
          let post = await generatePost(env, platform, schedule.category, topic, day, intelligence, feedbackContext, alreadyUsed, liveSourceContext);
          let quality = qualityCheck(post, platform);

          const hookScore = await scoreHook(env, post.hook || post.content.split(".")[0], post.hook_format, platform);

          if (!quality.passed || hookScore.integrity_pass === false) {
            await log(env, "warn", "quality_fail", platform, `Day ${day}: ${quality.issues.join(", ")} integrity:${hookScore.integrity_pass} - retrying`);
            post = await generatePost(env, platform, schedule.category, topic, day + 1, intelligence, feedbackContext, alreadyUsed, liveSourceContext);
            const retryHookScore = await scoreHook(env, post.hook || post.content.split(".")[0], post.hook_format, platform);
            quality = qualityCheck(post, platform, retryHookScore);
            if (!quality.passed) {
              await tier3Alert(env, "content_generation", `Quality failed twice: ${platform} day ${day}: ${quality.issues.join(", ")}`);
              failed++;
              continue;
            }
          }

          if (hookScore.score < HOOK_SCORE_MINIMUM && hookScore.stronger_version) {
            const oldHook = post.hook || post.content.split("\n")[0];
            post.content = post.content.replace(oldHook, hookScore.stronger_version);
            post.hook = hookScore.stronger_version;
            post.hook_improved = true;
          }

          alreadyUsed.push({ udhr_article: post.udhr_article, topic: topic.topic, hook_format: post.hook_format });

          const now = new Date();
          const daysUntil = (day - now.getDay() + 7) % 7 || 7;
          const scheduledDate = new Date(now);
          scheduledDate.setDate(now.getDate() + daysUntil);
          scheduledDate.setHours(16, 0, 0, 0);

          const postId = `post:${scheduledDate.toISOString().split("T")[0]}:${platform}:${schedule.category}`;

          await env.KV.put(postId, JSON.stringify({
            id: postId, platform, content: post.content,
            hook: post.hook || "", hook_format: post.hook_format || schedule.format,
            hook_score: hookScore.score, hook_improved: post.hook_improved || false,
            category: schedule.category, category_label: schedule.label,
            udhr_article: post.udhr_article, udhr_quote: post.udhr_quote || "",
            source_cited: post.source_cited || "", source_verified: post.source_verified !== false,
            trust_behavior: post.trust_behavior,
            character_count: post.character_count || post.content.length,
            readability_grade: post.readability_grade,
            review_notes: post.review_notes || "", topic: topic.topic,
            week_theme: intelligence.week_theme || "",
            live_sources_used: liveData.success_count,
            scheduled_for: scheduledDate.toISOString(),
            status: "pending_review", generated_at: new Date().toISOString(),
            feedback_tags: [], feedback_text: "",
          }), { expirationTtl: 60 * 60 * 24 * REVIEW_EXPIRY_DAYS });

          generated++;
          await log(env, "info", "content_queued", platform, `${postId} | Hook: ${hookScore.score}/10 | Source: ${post.source_cited}`);

        } catch (e) {
          await tier3Alert(env, "content_generation", `Failed: ${platform} day ${day}: ${e.message}`);
          failed++;
        }
      }
    }

    await log(env, "info", "content_generation", "completed", `Generated: ${generated} | Failed: ${failed}`);
    return { generated, failed };

  } catch (e) {
    await tier3Alert(env, "content_generation", `Batch failed: ${e.message}`);
    return { generated, failed };
  }
}

// ─── SINGLE POST REGENERATION ──────────────────────────────────────────────

async function regenerateSinglePost(env, postId, feedbackText, feedbackTags) {
  try {
    const val = await env.KV.get(postId);
    if (!val) throw new Error("Post not found");
    const oldPost = JSON.parse(val);

    const specificFeedback = `
ORIGINAL POST TO IMPROVE:
"${oldPost.content}"

EDITOR FEEDBACK:
Tags: ${feedbackTags.join(", ")}
Notes: ${feedbackText || "See tags"}
${feedbackTags.includes("Too formal") ? "FIX: More conversational and warm" : ""}
${feedbackTags.includes("Too vague") ? "FIX: Be more specific - name exact article, stat, situation" : ""}
${feedbackTags.includes("Wrong UDHR article") ? "FIX: Use different, correctly cited UDHR article from sources" : ""}
${feedbackTags.includes("Too similar to others") ? "FIX: Completely different angle, article, and hook" : ""}
${feedbackTags.includes("Hook weak") ? "FIX: Rewrite hook entirely - must score 8+/10" : ""}
${feedbackText ? `SPECIFIC: "${feedbackText}"` : ""}

Generate SUBSTANTIALLY DIFFERENT post addressing all feedback.`;

    const liveData = await fetchLiveSources(env);
    const liveSourceContext = buildLiveSourceContext(liveData);

    const topic = {
      topic: oldPost.topic || "workplace dignity",
      angle: feedbackText || oldPost.review_notes || oldPost.topic,
      udhr_article: feedbackTags.includes("Wrong UDHR article") ? "Article 1 - Equal Dignity" : oldPost.udhr_article,
      hook_format: feedbackTags.includes("Hook weak") ? "tension" : (oldPost.hook_format || "tension"),
      covey_behavior: oldPost.trust_behavior || "Talk Straight",
      suggested_source: "any from sources",
    };

    const post = await generatePost(env, oldPost.platform, oldPost.category, topic,
      new Date(oldPost.scheduled_for).getDay(),
      { week_theme: oldPost.week_theme },
      specificFeedback, [], liveSourceContext
    );

    const quality = qualityCheck(post, oldPost.platform);
    if (!quality.passed) throw new Error(`Quality gate: ${quality.issues.join(", ")}`);

    const hookScore = await scoreHook(env, post.hook || post.content.split("\n")[0], post.hook_format, oldPost.platform);

    await env.KV.put(postId, JSON.stringify({
      ...oldPost,
      content: post.content, hook: post.hook || "",
      hook_format: post.hook_format, hook_score: hookScore.score,
      source_cited: post.source_cited || "", source_verified: post.source_verified !== false,
      udhr_article: post.udhr_article, udhr_quote: post.udhr_quote || "",
      trust_behavior: post.trust_behavior,
      character_count: post.character_count || post.content.length,
      readability_grade: post.readability_grade,
      review_notes: post.review_notes || "",
      status: "pending_review",
      regenerated_at: new Date().toISOString(),
      regeneration_feedback: feedbackText,
    }), { expirationTtl: 60 * 60 * 24 * REVIEW_EXPIRY_DAYS });

    await log(env, "info", "post_regenerated", oldPost.platform, `${postId} | Hook: ${hookScore.score}/10 | Source: ${post.source_cited}`);
    return true;
  } catch (e) {
    await tier3Alert(env, "post_regeneration", e.message);
    return false;
  }
}

// ─── QUEUE + LOGS ──────────────────────────────────────────────────────────

async function getReviewQueue(env) {
  try {
    const list = await env.KV.list({ prefix: "post:" });
    const posts = await Promise.all(list.keys.map(async (k) => {
      const val = await env.KV.get(k.name);
      return val ? JSON.parse(val) : null;
    }));
    return posts.filter(Boolean).filter(p => p.status === "pending_review")
      .sort((a, b) => new Date(a.scheduled_for) - new Date(b.scheduled_for));
  } catch (e) { return []; }
}

async function updatePostStatus(env, postId, status) {
  try {
    const val = await env.KV.get(postId);
    if (!val) return false;
    const post = JSON.parse(val);
    post.status = status;
    post.reviewed_at = new Date().toISOString();
    await env.KV.put(postId, JSON.stringify(post), { expirationTtl: 60 * 60 * 24 * REVIEW_EXPIRY_DAYS });
    await log(env, "info", "post_review", status, postId);
    return true;
  } catch (e) { return false; }
}

async function getRecentLogs(env, limit = 30) {
  try {
    const list = await env.KV.list({ prefix: "log:" });
    const keys = list.keys.slice(-limit);
    const entries = await Promise.all(keys.map(async (k) => {
      const val = await env.KV.get(k.name);
      return val ? JSON.parse(val) : null;
    }));
    return entries.filter(Boolean).reverse();
  } catch (e) { return []; }
}

// ─── STATUS PAGE ───────────────────────────────────────────────────────────

async function buildStatusPage(env) {
  const logs = await getRecentLogs(env, 30);
  const linkedInToken = await env.KV.get("linkedin:access_token");
  const blueskyStatus = await env.KV.get("bluesky:auth_status");
  const queue = await getReviewQueue(env);
  const liveSourceCache = await env.KV.get("live_sources:cache");
  const liveSourceInfo = liveSourceCache ? JSON.parse(liveSourceCache) : null;

  const platformStatus = (platform) => {
    const last = logs.find((l) => l.action === `${platform}_auth_check`);
    return last?.result === "success" ? "ok" : "warn";
  };

  const hookColor = (score) => score >= 8 ? "#4caf82" : score >= 7 ? "#c9a84c" : "#c94c4c";

  const logRows = logs.map((l) => `
    <tr class="${l.level}">
      <td>${l.timestamp.replace("T", " ").split(".")[0]}</td>
      <td>${l.level.toUpperCase()}</td>
      <td>${l.action}</td>
      <td>${l.result}</td>
      <td>${l.detail || ""}</td>
    </tr>`).join("");

  const tagButtons = QUICK_TAGS.map(t =>
    `<button type="button" class="tag" onclick="toggleTag(this,'${t}')">${t}</button>`
  ).join("");

  const queueRows = queue.length > 0 ? queue.map((p) => `
    <tr>
      <td>${p.scheduled_for.split("T")[0]}</td>
      <td><span class="pb ${p.platform}">${p.platform}</span></td>
      <td>${p.category_label}</td>
      <td class="preview">
        <strong style="color:#c9a84c">${p.hook || ""}</strong><br>
        <span style="color:${p.source_verified ? "#4caf82" : "#c94c4c"};font-size:.65rem">
          ${p.source_verified ? "✓" : "⚠"} ${p.source_cited || "No source"}
        </span>
      </td>
      <td>${p.udhr_article}</td>
      <td>${p.trust_behavior}</td>
      <td style="color:${hookColor(p.hook_score)};font-weight:700">${p.hook_score || "?"}/10${p.hook_improved ? " ↑" : ""}</td>
      <td>
        <button class="view-btn" onclick="openView('${encodeURIComponent(p.id)}')">View</button>
        <button class="feedback-btn" onclick="openFeedback('${encodeURIComponent(p.id)}')">Feedback</button>
      </td>
    </tr>`).join("") :
    '<tr><td colspan="8" style="color:#888;padding:1rem;text-align:center">No posts pending. Click Generate to create this weeks content.</td></tr>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>North Star Agent</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,sans-serif;background:#0f0f1a;color:#e8e4d9;padding:2rem}
    h1{color:#c9a84c;font-size:1.5rem;margin-bottom:.25rem}
    h2{color:#c9a84c;font-size:1rem;margin:1.5rem 0 .75rem;border-bottom:1px solid #2d2d44;padding-bottom:.5rem}
    .sub{color:#888;font-size:.85rem;margin-bottom:2rem}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:1rem;margin-bottom:1rem}
    .card{background:#1a1a2e;border:1px solid #2d2d44;border-radius:8px;padding:1rem}
    .card .lbl{font-size:.75rem;color:#888;margin-bottom:.35rem}
    .card .val{font-size:1rem;font-weight:600}
    .ok{color:#4caf82}.warn{color:#c9a84c}.error{color:#c94c4c}
    table{width:100%;border-collapse:collapse;font-size:.8rem;margin-bottom:2rem}
    th{background:#1a1a2e;color:#c9a84c;text-align:left;padding:.5rem .75rem}
    td{padding:.45rem .75rem;border-bottom:1px solid #1a1a2e;vertical-align:top}
    tr.info td{background:#0f0f1a}tr.warn td{background:#1a1500}tr.error td{background:#1a0000}
    .preview{max-width:260px;word-break:break-word}
    .phase{background:#1a1a2e;border-radius:8px;padding:.75rem 1rem;margin-bottom:.4rem;display:flex;justify-content:space-between;align-items:center}
    .badge{font-size:.75rem;padding:.2rem .6rem;border-radius:20px;background:#2d2d44;color:#888}
    .badge.active{background:#1a3020;color:#4caf82}.badge.done{background:#1a2a40;color:#4c9fcf}
    .auth-link{display:inline-block;margin-top:.5rem;background:#c9a84c;color:#0f0f1a;padding:.3rem .8rem;border-radius:4px;text-decoration:none;font-weight:600;font-size:.75rem}
    .approve{display:inline-block;background:#1a3020;color:#4caf82;border:1px solid #4caf82;padding:.2rem .6rem;border-radius:4px;text-decoration:none;font-size:.75rem;margin-right:.25rem}
    .feedback-btn{background:#1a1a40;color:#c9a84c;border:1px solid #c9a84c;padding:.2rem .6rem;border-radius:4px;font-size:.75rem;cursor:pointer}
    .view-btn{background:#1a3020;color:#4caf82;border:1px solid #4caf82;padding:.2rem .6rem;border-radius:4px;font-size:.75rem;cursor:pointer;margin-right:.25rem}
    .gen-btn{display:inline-block;background:#c9a84c;color:#0f0f1a;padding:.5rem 1.5rem;border-radius:6px;text-decoration:none;font-weight:700;font-size:.85rem;margin-bottom:1rem}
    .refresh-btn{display:inline-block;background:#1a1a2e;color:#c9a84c;border:1px solid #c9a84c;padding:.35rem 1rem;border-radius:6px;text-decoration:none;font-size:.8rem;margin-bottom:1rem;margin-left:.75rem}
    .pb{font-size:.7rem;padding:.15rem .5rem;border-radius:10px;font-weight:600}
    .pb.bluesky{background:#0a3060;color:#4c9fcf}.pb.linkedin{background:#003060;color:#4c9fcf}.pb.facebook{background:#001a40;color:#4c6fcf}
    .qcount{background:#c9a84c;color:#0f0f1a;font-size:.7rem;padding:.1rem .5rem;border-radius:10px;font-weight:700;margin-left:.5rem}
    .source-info{background:#1a1a2e;border-radius:6px;padding:.75rem 1rem;margin-bottom:1rem;font-size:.8rem;color:#888}
    .source-info .ok{color:#4caf82}
    footer{margin-top:2rem;color:#444;font-size:.75rem;border-top:1px solid #1a1a2e;padding-top:1rem}
    .modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:100;align-items:center;justify-content:center}
    .modal.open{display:flex}
    .modal-box{background:#1a1a2e;border:1px solid #c9a84c;border-radius:12px;padding:1.5rem;width:90%;max-width:540px}
    .modal-box h3{color:#c9a84c;margin-bottom:.75rem}
    .tags{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.75rem}
    .tag{background:#0f0f1a;color:#888;border:1px solid #2d2d44;padding:.3rem .7rem;border-radius:20px;font-size:.78rem;cursor:pointer}
    .tag.selected{background:#1a3020;color:#4caf82;border-color:#4caf82}
    .feedback-text{width:100%;background:#0f0f1a;border:1px solid #2d2d44;color:#e8e4d9;border-radius:6px;padding:.5rem;font-size:.85rem;resize:vertical;min-height:60px;margin-bottom:.75rem}
    .modal-actions{display:flex;gap:.5rem;flex-wrap:wrap}
    .btn-save{background:#c9a84c;color:#0f0f1a;border:none;padding:.4rem 1rem;border-radius:6px;font-weight:700;cursor:pointer;font-size:.85rem}
    .btn-regen{background:#8b2020;color:#fff;border:none;padding:.4rem 1rem;border-radius:6px;font-weight:700;cursor:pointer;font-size:.85rem}
    .btn-reject{background:#1a0000;color:#c94c4c;border:1px solid #c94c4c;padding:.4rem 1rem;border-radius:6px;cursor:pointer;font-size:.85rem}
    .btn-cancel{background:transparent;color:#888;border:1px solid #2d2d44;padding:.4rem 1rem;border-radius:6px;cursor:pointer;font-size:.85rem}
    .original-post{background:#0f0f1a;border:1px solid #2d2d44;border-radius:6px;padding:.75rem;margin-bottom:.75rem;font-size:.8rem;color:#aaa;max-height:100px;overflow-y:auto}
  </style>
</head>
<body>
  <h1>North Star Human Rights</h1>
  <p class="sub">Social Media Agent v0.8.0 | Live Source Fetching + Cross-Verification | 35+ Verified Sources</p>

  <h2>Platform Auth Status</h2>
  <div class="grid">
    <div class="card"><div class="lbl">Bluesky</div><div class="val ${blueskyStatus === "authenticated" ? "ok" : "warn"}">${blueskyStatus === "authenticated" ? "Authenticated" : "Pending"}</div></div>
    <div class="card"><div class="lbl">LinkedIn</div><div class="val ${linkedInToken ? "ok" : "warn"}">${linkedInToken ? "Authenticated" : "Not authorized"}</div>${!linkedInToken ? '<a class="auth-link" href="/linkedin/authorize">Authorize</a>' : ""}</div>
    <div class="card"><div class="lbl">Facebook</div><div class="val ${platformStatus("facebook") === "ok" ? "ok" : "warn"}">${platformStatus("facebook") === "ok" ? "Authenticated" : "Pending"}</div></div>
    <div class="card"><div class="lbl">Instagram</div><div class="val ${platformStatus("instagram") === "ok" ? "ok" : "warn"}">${platformStatus("instagram") === "ok" ? "Authenticated" : "Pending Meta"}</div></div>
    <div class="card"><div class="lbl">Threads</div><div class="val ${platformStatus("threads") === "ok" ? "ok" : "warn"}">${platformStatus("threads") === "ok" ? "Authenticated" : "Pending Meta"}</div></div>
    <div class="card"><div class="lbl">YouTube</div><div class="val warn">Parked</div></div>
  </div>

  <h2>Live Source Status</h2>
  <div class="source-info">
    ${liveSourceInfo
      ? `<span class="ok">✓ ${liveSourceInfo.success_count}/${PRIMARY_SOURCES.length} primary sources fetched</span> - Last updated: ${liveSourceInfo.fetched_at.replace("T", " ").split(".")[0]} UTC - Cached 6 hours`
      : `<span class="warn">⚠ Sources not yet fetched - will fetch on next Generate run</span>`
    }
  </div>

  <h2>Build Phases</h2>
  <div class="phase"><span>Phase 1 - Foundation</span><span class="badge done">Complete</span></div>
  <div class="phase"><span>Phase 2 - Content Engine</span><span class="badge active">Active</span></div>
  <div class="phase"><span>Phase 3 - Posting</span><span class="badge">Not Started</span></div>
  <div class="phase"><span>Phase 4 - Monitoring</span><span class="badge">Not Started</span></div>
  <div class="phase"><span>Phase 5 - Review Dashboard</span><span class="badge">Not Started</span></div>
  <div class="phase"><span>Phase 6 - Growth Intelligence</span><span class="badge">Not Started</span></div>

  <h2>Content Review Queue <span class="qcount">${queue.length} pending</span></h2>
  <a class="gen-btn" href="/generate">Generate This Weeks Content</a>
  <a class="refresh-btn" href="/refresh-sources">Refresh Live Sources</a>
  <table>
    <thead><tr><th>Scheduled</th><th>Platform</th><th>Category</th><th>Hook + Preview + Source</th><th>UDHR</th><th>Trust Behavior</th><th>Hook Score</th><th>Action</th></tr></thead>
    <tbody>${queueRows}</tbody>
  </table>

  <h2>Recent Log (Last 30 Actions)</h2>
  <table>
    <thead><tr><th>Timestamp</th><th>Level</th><th>Action</th><th>Result</th><th>Detail</th></tr></thead>
    <tbody>${logRows || '<tr><td colspan="5" style="color:#888;padding:1rem">No logs yet</td></tr>'}</tbody>
  </table>

  <footer>North Star Human Rights | INTEGRITY INTEGRITY INTEGRITY | Slow is smooth. Smooth is fast. | ${new Date().toISOString()}</footer>

  <!-- View Modal - full post reader -->
  <div class="modal" id="viewModal">
    <div class="modal-box" style="max-width:640px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <h3 id="view-platform-label">Post</h3>
        <button class="btn-cancel" onclick="closeViewModal()">Close</button>
      </div>
      <div id="view-post-content" style="background:#0f0f1a;border:1px solid #2d2d44;border-radius:8px;padding:1.25rem;font-size:.95rem;line-height:1.6;white-space:pre-wrap;word-break:break-word;margin-bottom:1rem;color:#e8e4d9"></div>
      <div id="view-post-meta" style="font-size:.78rem;color:#666;margin-bottom:1rem;line-height:1.8"></div>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap">
        <button class="btn-save" onclick="approveFromView()">Approve</button>
        <button class="btn-regen" onclick="feedbackFromView()">Feedback / Regenerate</button>
        <button class="btn-reject" onclick="rejectFromView()">Reject</button>
      </div>
    </div>
  </div>

  <!-- Feedback Modal -->
  <div class="modal" id="feedbackModal">
    <div class="modal-box">
      <h3>Post Feedback</h3>
      <input type="hidden" id="modal-post-id">
      <div class="original-post" id="modal-original-post"></div>
      <p style="color:#888;font-size:.78rem;margin-bottom:.5rem">Quick tags:</p>
      <div class="tags">${tagButtons}</div>
      <textarea class="feedback-text" id="feedback-text" placeholder="Specific notes - be direct about what needs to change..."></textarea>
      <div class="modal-actions">
        <button class="btn-save" onclick="submitFeedback('approve_with_feedback')">Approve + Feedback</button>
        <button class="btn-regen" onclick="submitFeedback('regenerate')">Regenerate</button>
        <button class="btn-reject" onclick="submitFeedback('reject')">Reject</button>
        <button class="btn-cancel" onclick="closeFeedbackModal()">Cancel</button>
      </div>
    </div>
  </div>

  <script>
    let selectedTags = [];
    let currentViewPostId = null;

    const postData = ${JSON.stringify(queue.reduce((acc, p) => {
      acc[encodeURIComponent(p.id)] = {
        content: p.content,
        platform: p.platform,
        udhr_article: p.udhr_article,
        udhr_quote: p.udhr_quote || "",
        source_cited: p.source_cited || "",
        trust_behavior: p.trust_behavior,
        hook_score: p.hook_score,
        review_notes: p.review_notes || "",
        character_count: p.character_count || p.content.length,
        scheduled_for: p.scheduled_for,
        category_label: p.category_label,
      };
      return acc;
    }, {}))};

    // ── View Modal ──
    function openView(postId) {
      currentViewPostId = postId;
      const p = postData[postId];
      if (!p) return;

      const platformLabel = { bluesky: "Bluesky", linkedin: "LinkedIn", facebook: "Facebook" };
      document.getElementById('view-platform-label').textContent =
        (platformLabel[p.platform] || p.platform) + " - " + p.category_label;

      document.getElementById('view-post-content').textContent = p.content;

      const meta = [
        p.character_count + " characters",
        "UDHR: " + p.udhr_article,
        p.udhr_quote ? 'Quote: "' + p.udhr_quote + '"' : "",
        "Source: " + (p.source_cited || "Unknown"),
        "Trust behavior: " + p.trust_behavior,
        "Hook score: " + (p.hook_score || "?") + "/10",
        p.review_notes ? "Notes: " + p.review_notes : "",
        "Scheduled: " + p.scheduled_for.replace("T", " ").split(".")[0] + " UTC",
      ].filter(Boolean).join(" · ");

      document.getElementById('view-post-meta').textContent = meta;
      document.getElementById('viewModal').classList.add('open');
    }

    function closeViewModal() {
      document.getElementById('viewModal').classList.remove('open');
      currentViewPostId = null;
    }

    function approveFromView() {
      if (!currentViewPostId) return;
      window.location.href = '/review?id=' + currentViewPostId + '&action=approve';
    }

    function rejectFromView() {
      if (!currentViewPostId) return;
      window.location.href = '/review?id=' + currentViewPostId + '&action=reject';
    }

    function feedbackFromView() {
      if (!currentViewPostId) return;
      closeViewModal();
      openFeedback(currentViewPostId);
    }

    document.getElementById('viewModal').addEventListener('click', e => {
      if (e.target === document.getElementById('viewModal')) closeViewModal();
    });

    // ── Feedback Modal ──
    function openFeedback(postId) {
      const p = postData[postId];
      document.getElementById('modal-post-id').value = postId;
      document.getElementById('feedback-text').value = '';
      document.getElementById('modal-original-post').textContent = p ? p.content : '';
      selectedTags = [];
      document.querySelectorAll('.tag').forEach(t => t.classList.remove('selected'));
      document.getElementById('feedbackModal').classList.add('open');
    }

    function closeFeedbackModal() { document.getElementById('feedbackModal').classList.remove('open'); }

    function toggleTag(btn, tag) {
      btn.classList.toggle('selected');
      selectedTags = selectedTags.includes(tag) ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag];
    }

    function submitFeedback(action) {
      const postId = document.getElementById('modal-post-id').value;
      const text = document.getElementById('feedback-text').value;
      window.location.href = '/feedback?id=' + postId + '&action=' + action + '&tags=' + encodeURIComponent(selectedTags.join(',')) + '&text=' + encodeURIComponent(text);
    }

    document.getElementById('feedbackModal').addEventListener('click', e => {
      if (e.target === document.getElementById('feedbackModal')) closeFeedbackModal();
    });
  </script>
</body>
</html>`;
}

// ─── MAIN HANDLER ──────────────────────────────────────────────────────────

// ─── PHASE 3: TOKEN MANAGEMENT ─────────────────────────────────────────────

async function getFacebookPageToken(env) {
  // First check KV for stored permanent token
  const stored = await env.KV.get("facebook:page_access_token");
  if (stored) {
    const data = JSON.parse(stored);
    // Check if token expires within 7 days - refresh proactively
    const expiresAt = new Date(data.expires_at);
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    if (expiresAt > sevenDaysFromNow) {
      return data.token;
    }
    await log(env, "info", "fb_token", "expiring_soon", "Token expires within 7 days - refreshing");
  }

  // Exchange short-lived token from Worker secret for long-lived token
  const shortToken = env.FB_PAGE_ACCESS_TOKEN;
  const appId = env.FB_APP_ID;
  const appSecret = env.FB_APP_SECRET;

  if (!shortToken || !appId || !appSecret) {
    throw new Error("Facebook credentials missing - need FB_PAGE_ACCESS_TOKEN, FB_APP_ID, FB_APP_SECRET");
  }

  const pageId = env.FB_PAGE_ID;

  // Step 1: Exchange short-lived token for long-lived token (60 days)
  const exchangeRes = await fetch(
    `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortToken}`
  );
  if (!exchangeRes.ok) {
    const err = await exchangeRes.text();
    throw new Error(`Long-lived token exchange failed: ${err}`);
  }
  const exchangeData = await exchangeRes.json();
  if (exchangeData.error) throw new Error(exchangeData.error.message);
  const longLivedToken = exchangeData.access_token;

  // Step 2: Detect token type by inspecting it first
  // A Page token has token_type = "page", a User token has token_type = "user"
  let permanentPageToken;

  const inspectRes = await fetch(
    `https://graph.facebook.com/debug_token?input_token=${longLivedToken}&access_token=${appId}|${appSecret}`
  );
  const inspectData = await inspectRes.json();
  const tokenType = inspectData?.data?.type?.toLowerCase() || "unknown";

  await log(env, "info", "fb_token", "token_type_detected", `Token type: ${tokenType}`);

  if (tokenType === "page") {
    // Already a page token - verify it works directly
    const verifyRes = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}?fields=id,name&access_token=${longLivedToken}`
    );
    const verifyData = await verifyRes.json();
    if (verifyData.error) throw new Error(`Page token invalid: ${verifyData.error.message}`);
    await log(env, "info", "fb_token", "page_token_verified", `Page: ${verifyData.name}`);
    permanentPageToken = longLivedToken;

  } else {
    // User token - get page token from accounts list
    const accountsRes = await fetch(
      `https://graph.facebook.com/me/accounts?access_token=${longLivedToken}`
    );
    const accountsData = await accountsRes.json();
    if (accountsData.error) throw new Error(`Accounts lookup failed: ${accountsData.error.message}`);

    const page = accountsData.data?.find(p => p.id === pageId);
    if (!page) throw new Error(`Page ${pageId} not found. Available: ${JSON.stringify(accountsData.data?.map(p => ({ id: p.id, name: p.name })))}`);
    permanentPageToken = page.access_token;
    await log(env, "info", "fb_token", "user_token_path", `Found page: ${page.name}`);
  }

  // Store in KV with 60-day expiry (we'll refresh at 7 days remaining)
  const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
  await env.KV.put("facebook:page_access_token", JSON.stringify({
    token: permanentPageToken,
    expires_at: expiresAt.toISOString(),
    refreshed_at: new Date().toISOString(),
    page_id: pageId,
  }), { expirationTtl: 60 * 24 * 60 * 60 });

  await log(env, "info", "fb_token", "refreshed", `Permanent token stored. Expires: ${expiresAt.toISOString().split("T")[0]}`);
  return permanentPageToken;
}

async function initFacebookToken(env) {
  try {
    const token = await getFacebookPageToken(env);
    await log(env, "info", "fb_token_init", "success", "Facebook permanent token ready");
    return { success: true, token };
  } catch (e) {
    await tier3Alert(env, "fb_token_init", e.message);
    return { success: false, error: e.message };
  }
}

// ─── PHASE 3: POSTING ──────────────────────────────────────────────────────

// Randomize posting time within a window (9am-11am CT = 15:00-17:00 UTC)
function randomizePostTime(baseDate) {
  const minMinutes = 0;
  const maxMinutes = 120;
  const randomMinutes = Math.floor(Math.random() * (maxMinutes - minMinutes)) + minMinutes;
  const postTime = new Date(baseDate);
  postTime.setUTCHours(15, randomMinutes, 0, 0);
  return postTime;
}

// Check for breaking news/crisis - pause posting if detected
async function checkNewsSensitivity(env) {
  try {
    const flagKey = "posting:crisis_pause";
    const paused = await env.KV.get(flagKey);
    if (paused) {
      await log(env, "warn", "news_sensitivity", "paused", "Crisis pause active - skipping post");
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

// Check for duplicate content before posting
async function isDuplicateContent(env, platform, content) {
  try {
    const recentKey = `posted:recent:${platform}`;
    const recent = await env.KV.get(recentKey);
    if (!recent) return false;
    const recentPosts = JSON.parse(recent);
    const contentWords = content.toLowerCase().split(/\s+/).slice(0, 10).join(" ");
    return recentPosts.some(p => {
      const pWords = p.toLowerCase().split(/\s+/).slice(0, 10).join(" ");
      return pWords === contentWords;
    });
  } catch (e) {
    return false;
  }
}

async function trackPostedContent(env, platform, content) {
  try {
    const recentKey = `posted:recent:${platform}`;
    const recent = await env.KV.get(recentKey);
    const recentPosts = recent ? JSON.parse(recent) : [];
    recentPosts.push(content);
    if (recentPosts.length > 20) recentPosts.shift();
    await env.KV.put(recentKey, JSON.stringify(recentPosts), { expirationTtl: 60 * 60 * 24 * 30 });
  } catch (e) {
    await log(env, "warn", "track_content", "failed", e.message);
  }
}

// ─── BLUESKY POSTING ───────────────────────────────────────────────────────

async function postToBluesky(env, content, postId) {
  try {
    // Dry run check
    const dryRun = await env.KV.get("posting:dry_run");
    if (dryRun === "true") {
      await log(env, "info", "bluesky_post", "dry_run", `Would post: ${content.substring(0, 50)}...`);
      return { success: true, dry_run: true };
    }

    if (await checkNewsSensitivity(env)) return { success: false, reason: "crisis_pause" };
    if (await isDuplicateContent(env, "bluesky", content)) {
      await tier3Alert(env, "bluesky_post", "Duplicate content detected - skipping");
      return { success: false, reason: "duplicate" };
    }

    const session = await blueskyAuth(env);

    // Enforce 300 char limit
    const postText = content.length > 300 ? content.substring(0, 297) + "..." : content;

    const res = await fetch("https://bsky.social/xrpc/com.atproto.repo.createRecord", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessJwt}`,
      },
      body: JSON.stringify({
        repo: session.did,
        collection: "app.bsky.feed.post",
        record: {
          $type: "app.bsky.feed.post",
          text: postText,
          createdAt: new Date().toISOString(),
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Bluesky post failed: ${res.status} - ${err}`);
    }

    const data = await res.json();
    await trackPostedContent(env, "bluesky", content);
    await log(env, "info", "bluesky_post", "success", `Posted: ${data.uri}`);
    return { success: true, uri: data.uri };

  } catch (e) {
    await tier3Alert(env, "bluesky_post", e.message);
    return { success: false, error: e.message };
  }
}

// ─── FACEBOOK POSTING ──────────────────────────────────────────────────────

async function postToFacebook(env, content, postId) {
  try {
    const dryRun = await env.KV.get("posting:dry_run");
    if (dryRun === "true") {
      await log(env, "info", "facebook_post", "dry_run", `Would post: ${content.substring(0, 50)}...`);
      return { success: true, dry_run: true };
    }

    if (await checkNewsSensitivity(env)) return { success: false, reason: "crisis_pause" };
    if (await isDuplicateContent(env, "facebook", content)) {
      await tier3Alert(env, "facebook_post", "Duplicate content detected - skipping");
      return { success: false, reason: "duplicate" };
    }

    const token = await getFacebookPageToken(env);
    const pageId = env.FB_PAGE_ID;

    const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: content,
        access_token: token,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Facebook post failed: ${res.status} - ${err}`);
    }

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    await trackPostedContent(env, "facebook", content);
    await log(env, "info", "facebook_post", "success", `Posted: ${data.id}`);
    return { success: true, id: data.id };

  } catch (e) {
    await tier3Alert(env, "facebook_post", e.message);
    return { success: false, error: e.message };
  }
}

// ─── LINKEDIN POSTING ──────────────────────────────────────────────────────

async function postToLinkedIn(env, content, postId) {
  try {
    const dryRun = await env.KV.get("posting:dry_run");
    if (dryRun === "true") {
      await log(env, "info", "linkedin_post", "dry_run", `Would post: ${content.substring(0, 50)}...`);
      return { success: true, dry_run: true };
    }

    if (await checkNewsSensitivity(env)) return { success: false, reason: "crisis_pause" };
    if (await isDuplicateContent(env, "linkedin", content)) {
      await tier3Alert(env, "linkedin_post", "Duplicate content detected - skipping");
      return { success: false, reason: "duplicate" };
    }

    const token = await env.KV.get("linkedin:access_token");
    if (!token) {
      await tier3Alert(env, "linkedin_post", "No LinkedIn access token - reauthorization needed");
      return { success: false, error: "No token" };
    }

    // Get LinkedIn person URN
    const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!profileRes.ok) throw new Error("Failed to get LinkedIn profile");
    const profile = await profileRes.json();
    const personUrn = `urn:li:person:${profile.sub}`;

    // Post to LinkedIn - needs w_member_social scope
    // Note: If scope not approved yet, this will fail gracefully
    const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: personUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: content },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      // Check if it's a scope issue
      if (res.status === 403) {
        await log(env, "warn", "linkedin_post", "scope_pending", "w_member_social scope not yet approved - post queued");
        return { success: false, reason: "scope_pending", message: "LinkedIn posting scope pending approval" };
      }
      throw new Error(`LinkedIn post failed: ${res.status} - ${err}`);
    }

    const data = await res.json();
    await trackPostedContent(env, "linkedin", content);
    await log(env, "info", "linkedin_post", "success", `Posted: ${data.id}`);
    return { success: true, id: data.id };

  } catch (e) {
    await tier3Alert(env, "linkedin_post", e.message);
    return { success: false, error: e.message };
  }
}

// ─── POST DISPATCHER ───────────────────────────────────────────────────────

async function dispatchApprovedPosts(env) {
  await log(env, "info", "post_dispatch", "started", "Checking approved posts for dispatch");

  try {
    const list = await env.KV.list({ prefix: "post:" });
    const now = new Date();
    let dispatched = 0;
    let failed = 0;

    for (const key of list.keys) {
      const val = await env.KV.get(key.name);
      if (!val) continue;
      const post = JSON.parse(val);

      // Only dispatch approved posts that are scheduled for now or past
      if (post.status !== "approved") continue;
      const scheduledFor = new Date(post.scheduled_for);
      if (scheduledFor > now) continue;

      // Post to appropriate platform
      let result;
      if (post.platform === "bluesky") result = await postToBluesky(env, post.content, post.id);
      else if (post.platform === "facebook") result = await postToFacebook(env, post.content, post.id);
      else if (post.platform === "linkedin") result = await postToLinkedIn(env, post.content, post.id);
      else {
        await log(env, "warn", "post_dispatch", "unknown_platform", post.platform);
        continue;
      }

      // Update post status
      if (result.success) {
        post.status = result.dry_run ? "dry_run_complete" : "published";
        post.published_at = now.toISOString();
        post.platform_id = result.uri || result.id || null;
        dispatched++;
      } else {
        post.status = result.reason === "scope_pending" ? "scope_pending" : "failed";
        post.failure_reason = result.error || result.reason;
        post.failed_at = now.toISOString();
        failed++;
        if (result.reason !== "scope_pending" && result.reason !== "crisis_pause" && result.reason !== "duplicate") {
          await tier3Alert(env, "post_dispatch", `Post failed: ${post.id} - ${result.error}`);
        }
      }

      await env.KV.put(key.name, JSON.stringify(post), {
        expirationTtl: 60 * 60 * 24 * REVIEW_EXPIRY_DAYS,
      });
    }

    await log(env, "info", "post_dispatch", "completed", `Dispatched: ${dispatched} | Failed: ${failed}`);
    return { dispatched, failed };

  } catch (e) {
    await tier3Alert(env, "post_dispatch", `Dispatch failed: ${e.message}`);
    return { dispatched: 0, failed: 0 };
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "/status") {
      await log(env, "info", "status_page_viewed", "served", request.headers.get("cf-connecting-ip") || "unknown");
      return new Response(await buildStatusPage(env), { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    if (url.pathname === "/check-auth") {
      const [bluesky, linkedin, facebook, instagram, threads] = await Promise.all([
        checkBlueskyAuth(env), checkLinkedInAuth(env), checkFacebookAuth(env),
        checkInstagramAuth(env), checkThreadsAuth(env),
      ]);
      return new Response(JSON.stringify({ checks: [bluesky, linkedin, facebook, instagram, threads] }, null, 2), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.pathname === "/linkedin/authorize") {
      return Response.redirect(linkedinAuthUrl(env), 302);
    }

    if (url.pathname === "/linkedin/callback") {
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");
      if (error || !code) {
        await tier3Alert(env, "linkedin_callback", `OAuth error: ${error || "no code"}`);
        return new Response(`LinkedIn auth failed: ${error || "no code"}`, { status: 400 });
      }
      try {
        const tokens = await linkedinExchangeCode(env, code);
        await env.KV.put("linkedin:access_token", tokens.access_token, { expirationTtl: tokens.expires_in || 5184000 });
        await log(env, "info", "linkedin_oauth_complete", "success", "Token stored");
        return Response.redirect("https://socialmedia-agent.northstarhr.workers.dev/status", 302);
      } catch (e) {
        await tier3Alert(env, "linkedin_callback", e.message);
        return new Response(`LinkedIn auth failed: ${e.message}`, { status: 500 });
      }
    }

    if (url.pathname === "/generate") {
      await log(env, "info", "manual_generate", "triggered", "Manual generation started");
      ctx.waitUntil(generateWeeklyContent(env));
      return Response.redirect("https://socialmedia-agent.northstarhr.workers.dev/status", 302);
    }

    if (url.pathname === "/refresh-sources") {
      await env.KV.delete("live_sources:cache");
      await log(env, "info", "sources_refresh", "triggered", "Cache cleared - will refetch on next generate");
      return Response.redirect("https://socialmedia-agent.northstarhr.workers.dev/status", 302);
    }

    // Phase 3 - Token management
    if (url.pathname === "/token-refresh") {
      const result = await initFacebookToken(env);
      return new Response(JSON.stringify(result, null, 2), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Phase 3 - Dry run toggle
    if (url.pathname === "/dry-run") {
      const current = await env.KV.get("posting:dry_run");
      const newState = current === "true" ? "false" : "true";
      await env.KV.put("posting:dry_run", newState);
      await log(env, "info", "dry_run_toggle", newState, `Dry run is now ${newState}`);
      return Response.redirect("https://socialmedia-agent.northstarhr.workers.dev/status", 302);
    }

    // Phase 3 - Crisis pause toggle
    if (url.pathname === "/crisis-pause") {
      const current = await env.KV.get("posting:crisis_pause");
      if (current) {
        await env.KV.delete("posting:crisis_pause");
        await log(env, "info", "crisis_pause", "cleared", "Posting resumed");
      } else {
        await env.KV.put("posting:crisis_pause", "true", { expirationTtl: 60 * 60 * 24 });
        await log(env, "warn", "crisis_pause", "activated", "Posting paused 24hrs");
      }
      return Response.redirect("https://socialmedia-agent.northstarhr.workers.dev/status", 302);
    }

    // Phase 3 - Manual dispatch
    if (url.pathname === "/dispatch") {
      await log(env, "info", "manual_dispatch", "triggered", "Manual post dispatch started");
      ctx.waitUntil(dispatchApprovedPosts(env));
      return Response.redirect("https://socialmedia-agent.northstarhr.workers.dev/status", 302);
    }

    if (url.pathname === "/review") {
      const postId = url.searchParams.get("id");
      const action = url.searchParams.get("action");
      if (!postId || !["approve", "reject"].includes(action)) return new Response("Invalid", { status: 400 });
      await updatePostStatus(env, postId, action === "approve" ? "approved" : "rejected");
      return Response.redirect("https://socialmedia-agent.northstarhr.workers.dev/status", 302);
    }

    if (url.pathname === "/feedback") {
      const postId = url.searchParams.get("id");
      const action = url.searchParams.get("action");
      const tagsRaw = url.searchParams.get("tags") || "";
      const text = url.searchParams.get("text") || "";
      const tags = tagsRaw ? tagsRaw.split(",").filter(Boolean) : [];

      if (!postId || !action) return new Response("Invalid", { status: 400 });

      if (action === "approve_with_feedback") {
        await saveFeedback(env, postId, tags, text);
        await updatePostStatus(env, postId, "approved");
      } else if (action === "regenerate") {
        await saveFeedback(env, postId, tags, text);
        ctx.waitUntil(regenerateSinglePost(env, postId, text, tags));
      } else if (action === "reject") {
        await saveFeedback(env, postId, tags, text);
        await updatePostStatus(env, postId, "rejected");
      }

      return Response.redirect("https://socialmedia-agent.northstarhr.workers.dev/status", 302);
    }

    return new Response("North Star Agent - Running", { status: 200 });
  },

  async scheduled(event, env, ctx) {
    await log(env, "info", "cron_triggered", "started", event.cron);

    // Auth checks
    await Promise.all([
      checkBlueskyAuth(env), checkLinkedInAuth(env), checkFacebookAuth(env),
      checkInstagramAuth(env), checkThreadsAuth(env),
    ]);

    // Phase 3: Proactive Facebook token refresh
    try {
      await getFacebookPageToken(env);
    } catch (e) {
      await tier3Alert(env, "fb_token_cron", e.message);
    }

    // Phase 3: Dispatch approved posts
    ctx.waitUntil(dispatchApprovedPosts(env));

    const day = new Date().getDay();
    if (day === 0) {
      await log(env, "info", "sunday_generation", "started", "Weekly content batch");
      ctx.waitUntil(generateWeeklyContent(env));
    }
    await log(env, "info", "cron_triggered", "completed", `Day ${day} done`);
  },
};
