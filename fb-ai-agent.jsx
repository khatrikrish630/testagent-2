import { useState, useEffect, useCallback, useRef } from "react";

// ─── CONFIG & CONSTANTS ───────────────────────────────────────────────────────
const RUSSELL_BRUNSON_FRAMEWORKS = {
  hook_story_offer: {
    name: "Hook → Story → Offer",
    description: "Grab attention, tell a relatable story, present your offer",
    template: (niche, topic) =>
      `Write a Facebook post for a ${niche} expert using Russell Brunson's Hook-Story-Offer framework about "${topic}". 
      
HOOK: Start with a bold, pattern-interrupting first line that stops the scroll. Use a contrarian take, shocking stat, or curiosity gap.

STORY: Share a relatable mini-story (real or hypothetical) about a business owner struggling with this topic. Make it emotional and specific. Use short paragraphs and line breaks.

OFFER: Transition naturally into how you solve this. End with a soft CTA — comment a keyword, DM me, or drop an emoji. 

Style rules:
- Use short, punchy sentences
- Break up text with line breaks (each sentence its own line)
- Use "..." for dramatic pauses
- Include 2-3 relevant emojis (not excessive)
- Keep it under 200 words
- Sound like a real person, NOT a marketer
- NO hashtags`,
  },
  epiphany_bridge: {
    name: "Epiphany Bridge",
    description: "Share your 'aha moment' to create belief in your audience",
    template: (niche, topic) =>
      `Write a Facebook post for a ${niche} expert using Russell Brunson's Epiphany Bridge framework about "${topic}".

Structure:
1. THE BACKSTORY: Where were you before the epiphany? Paint the "before" picture. Struggling, frustrated, trying everything.
2. THE WALL: What was the specific moment you hit rock bottom or felt stuck?
3. THE EPIPHANY: What was the exact "aha!" moment? Be specific about what clicked.
4. THE TRANSFORMATION: What changed after? Show the "after" picture with specific results.
5. THE FRAMEWORK: Distill your lesson into 3 simple steps others can follow.
6. THE CTA: Invite engagement — "Has anyone else experienced this?" or "Comment X if you want me to share more"

Style: Conversational, vulnerable, specific numbers/details. Under 250 words. Short paragraphs. No hashtags.`,
  },
  attractive_character: {
    name: "Attractive Character",
    description: "Build your persona through backstory, parables, and character flaws",
    template: (niche, topic) =>
      `Write a Facebook post for a ${niche} expert using Russell Brunson's Attractive Character framework about "${topic}".

Pick ONE of these Attractive Character elements:
- BACKSTORY: Share an origin story moment that shaped your expertise
- PARABLE: Teach a lesson through a simple analogy or metaphor
- CHARACTER FLAWS: Admit a mistake or weakness that makes you relatable
- POLARITY: Take a strong stance that will attract your tribe and repel others

The post should:
- Make the reader feel like they KNOW you personally
- Include a specific detail that proves authenticity (date, name, place, number)
- End with a question that drives comments
- Feel like a conversation, not a lecture
- Be under 200 words
- Use line breaks between thoughts
- NO hashtags, minimal emojis (1-2 max)`,
  },
  soap_opera: {
    name: "Soap Opera Sequence",
    description: "Open loops and cliffhangers that keep people coming back",
    template: (niche, topic) =>
      `Write a Facebook post for a ${niche} expert using Russell Brunson's Soap Opera Sequence style about "${topic}".

Structure:
- Open with HIGH DRAMA or an unexpected moment (in medias res)
- Build tension — what was at stake?
- Introduce a turning point
- LEAVE AN OPEN LOOP — don't fully resolve it. Tease what happens next.
- End with: "Want to know what happened? Drop a 🔥 and I'll share Part 2"

This should feel like Episode 1 of a Netflix series. The reader MUST want to know what happens next.

Style: Dramatic short sentences. Lots of white space. Emotional language. Under 200 words. NO hashtags.`,
  },
  value_bomb: {
    name: "Pure Value Bomb",
    description: "Give away your best stuff for free to build authority",
    template: (niche, topic) =>
      `Write a Facebook post for a ${niche} expert that drops a massive value bomb about "${topic}".

Structure:
- Bold claim opening: "Most [audience] are doing [topic] completely wrong..."
- The WRONG way (2-3 common mistakes)
- The RIGHT way (your framework in 3-5 actionable steps)
- Quick proof/result: "When I implemented this for a client, they saw [specific result]"
- CTA: "Save this post. You'll thank me later. 🔖"

This should be SO good that people feel guilty getting it for free. Give away the WHAT and WHY, but leave the HOW (implementation) as the reason to work with you.

Under 250 words. Numbered steps. Short paragraphs. NO hashtags.`,
  },
};

const GHL_TOPICS = [
  "Why most businesses waste money on ads when their follow-up is broken",
  "The #1 automation that saved my client 20 hours/week",
  "Stop using 10 different tools — here's how I replaced them all with one platform",
  "How I built a $10K/month agency in 90 days with GoHighLevel",
  "The follow-up sequence that turns cold leads into booked calls",
  "Why your funnel isn't converting (it's not what you think)",
  "3 automations every local business needs yesterday",
  "The difference between agencies that scale and agencies that struggle",
  "How to close clients without being salesy — my exact script",
  "The pipeline that books 15+ calls per week on autopilot",
  "Why I quit my 9-5 to build GHL funnels full-time",
  "The mistake I made that cost my client $5,000 (and what I learned)",
  "How to get GHL clients without spending a dime on ads",
  "Reputation management: The goldmine most agencies ignore",
  "The 2-minute setup that gets more Google reviews than anything else",
  "Why missed calls are killing your client's business",
  "The snapshot strategy that lets me onboard clients in 24 hours",
  "How to charge $1,500/month and have clients THANK you for it",
  "The lead nurture sequence that has a 40% response rate",
  "Speed to lead: Why responding in 5 minutes 10x's your close rate",
];

const DREAM_CUSTOMER_KEYWORDS = [
  "looking for GHL expert",
  "need GoHighLevel help",
  "hiring funnel builder",
  "need automation expert",
  "looking for marketing automation",
  "GHL setup help",
  "need CRM expert",
  "hiring GHL freelancer",
  "funnel not converting",
  "need help with GoHighLevel",
  "looking for agency partner",
  "need white label GHL",
];

const POST_TIMES = ["09:00 AM", "09:00 PM"];

// ─── STYLES ───────────────────────────────────────────────────────────────────
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
`;

// ─── UTILITY COMPONENTS ───────────────────────────────────────────────────────

const Badge = ({ children, variant = "default" }) => {
  const colors = {
    default: { bg: "rgba(255,255,255,0.06)", color: "#9ca3af", border: "rgba(255,255,255,0.08)" },
    success: { bg: "rgba(52,211,153,0.1)", color: "#34d399", border: "rgba(52,211,153,0.2)" },
    warning: { bg: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "rgba(251,191,36,0.2)" },
    danger: { bg: "rgba(248,113,113,0.1)", color: "#f87171", border: "rgba(248,113,113,0.2)" },
    info: { bg: "rgba(96,165,250,0.1)", color: "#60a5fa", border: "rgba(96,165,250,0.2)" },
    live: { bg: "rgba(52,211,153,0.15)", color: "#34d399", border: "rgba(52,211,153,0.3)" },
  };
  const c = colors[variant] || colors.default;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: "0.02em", background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
      {variant === "live" && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", animation: "pulse 2s infinite" }} />}
      {children}
    </span>
  );
};

const Card = ({ children, style, onClick, hoverable }) => (
  <div
    onClick={onClick}
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 16,
      padding: 24,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: hoverable ? "pointer" : "default",
      ...(hoverable ? {} : {}),
      ...style,
    }}
    onMouseEnter={(e) => {
      if (hoverable) {
        e.currentTarget.style.borderColor = "rgba(96,165,250,0.3)";
        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }
    }}
    onMouseLeave={(e) => {
      if (hoverable) {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
        e.currentTarget.style.transform = "translateY(0)";
      }
    }}
  >
    {children}
  </div>
);

const Button = ({ children, variant = "primary", size = "md", onClick, disabled, style }) => {
  const variants = {
    primary: { bg: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff", border: "none", shadow: "0 4px 15px rgba(59,130,246,0.3)" },
    secondary: { bg: "rgba(255,255,255,0.06)", color: "#d1d5db", border: "1px solid rgba(255,255,255,0.1)", shadow: "none" },
    success: { bg: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", shadow: "0 4px 15px rgba(16,185,129,0.3)" },
    danger: { bg: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)", shadow: "none" },
    ghost: { bg: "transparent", color: "#9ca3af", border: "1px solid transparent", shadow: "none" },
  };
  const sizes = { sm: { px: 12, py: 6, fs: 12 }, md: { px: 20, py: 10, fs: 13 }, lg: { px: 28, py: 14, fs: 14 } };
  const v = variants[variant];
  const s = sizes[size];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: v.bg,
        color: v.color,
        border: v.border,
        boxShadow: v.shadow,
        padding: `${s.py}px ${s.px}px`,
        fontSize: s.fs,
        fontWeight: 600,
        borderRadius: 10,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: "0.01em",
        transition: "all 0.2s ease",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </button>
  );
};

const TabBar = ({ tabs, active, onChange }) => (
  <div style={{ display: "flex", gap: 2, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 4, border: "1px solid rgba(255,255,255,0.06)" }}>
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        style={{
          padding: "10px 20px",
          borderRadius: 10,
          border: "none",
          background: active === tab.id ? "rgba(59,130,246,0.15)" : "transparent",
          color: active === tab.id ? "#60a5fa" : "#6b7280",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          gap: 8,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontSize: 16 }}>{tab.icon}</span>
        {tab.label}
        {tab.count !== undefined && (
          <span style={{ background: active === tab.id ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 10, fontSize: 11 }}>
            {tab.count}
          </span>
        )}
      </button>
    ))}
  </div>
);

const TextArea = ({ value, onChange, placeholder, rows = 4, style }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    style={{
      width: "100%",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 12,
      padding: 16,
      color: "#e5e7eb",
      fontSize: 14,
      fontFamily: "'DM Sans', sans-serif",
      resize: "vertical",
      outline: "none",
      lineHeight: 1.7,
      boxSizing: "border-box",
      transition: "border-color 0.2s",
      ...style,
    }}
    onFocus={(e) => (e.target.style.borderColor = "rgba(96,165,250,0.4)")}
    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
  />
);

const Input = ({ value, onChange, placeholder, type = "text", style }) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      width: "100%",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 10,
      padding: "12px 16px",
      color: "#e5e7eb",
      fontSize: 14,
      fontFamily: "'DM Sans', sans-serif",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.2s",
      ...style,
    }}
    onFocus={(e) => (e.target.style.borderColor = "rgba(96,165,250,0.4)")}
    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
  />
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function FacebookAIAgent() {
  const [activeTab, setActiveTab] = useState("content");
  const [config, setConfig] = useState({
    fbAccessToken: "",
    fbPageId: "",
    anthropicKey: "",
    niche: "GoHighLevel (GHL) Expert",
    configured: false,
  });
  const [showConfig, setShowConfig] = useState(true);

  // Content state
  const [selectedFramework, setSelectedFramework] = useState("hook_story_offer");
  const [customTopic, setCustomTopic] = useState("");
  const [generatedPost, setGeneratedPost] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [postQueue, setPostQueue] = useState([]);
  const [postHistory, setPostHistory] = useState([]);

  // Schedule state
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [autoTopics, setAutoTopics] = useState(true);

  // Groups state
  const [monitoredGroups, setMonitoredGroups] = useState([]);
  const [groupUrl, setGroupUrl] = useState("");
  const [savedPosts, setSavedPosts] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  // Leads state
  const [dreamAvatar, setDreamAvatar] = useState({
    keywords: "GoHighLevel, GHL, funnel builder, marketing automation, CRM setup",
    location: "",
    industry: "Digital Marketing Agency",
  });
  const [scrapedLeads, setScrapedLeads] = useState([]);
  const [friendQueue, setFriendQueue] = useState([]);
  const [isScrapingLeads, setIsScrapingLeads] = useState(false);

  // Comment reply state
  const [unrepliedComments, setUnrepliedComments] = useState([]);

  // Per-post reply generation state: { [postId]: { loading, reply, error, copied } }
  const [postReplies, setPostReplies] = useState({});

  // Per-post publish state: { [postId]: { loading, error, success } }
  const [publishStates, setPublishStates] = useState({});

  // ─── API CALL HELPER ─────────────────────────────────────────────────────
  const callClaude = useCallback(async (prompt, systemPrompt) => {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt || "You are a world-class social media copywriter who specializes in Russell Brunson's marketing frameworks. You write posts that feel authentic, not salesy.",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      return data.content?.map((b) => b.text || "").join("\n") || "Error generating content";
    } catch (err) {
      console.error("Claude API error:", err);
      return "⚠️ API call failed. Check your configuration.";
    }
  }, []);

  // ─── CONTENT GENERATION ──────────────────────────────────────────────────
  const generatePost = useCallback(async () => {
    setIsGenerating(true);
    const framework = RUSSELL_BRUNSON_FRAMEWORKS[selectedFramework];
    const topic = customTopic || GHL_TOPICS[Math.floor(Math.random() * GHL_TOPICS.length)];
    const prompt = framework.template(config.niche, topic);
    const result = await callClaude(prompt);
    setGeneratedPost(result);
    setIsGenerating(false);
  }, [selectedFramework, customTopic, config.niche, callClaude]);

  const generateImagePrompt = useCallback(async () => {
    const imagePrompt = await callClaude(
      `Based on this Facebook post, create a simple, clean image description for an accompanying graphic. The image should be a branded quote card or visual that reinforces the post's message. Keep the description under 50 words. Post: "${generatedPost.substring(0, 500)}"`,
      "You describe social media graphics. Be specific about colors, text overlay, and layout."
    );
    setGeneratedImage({
      prompt: imagePrompt,
      status: "ready",
      placeholder: true,
    });
  }, [generatedPost, callClaude]);

  const addToQueue = useCallback(() => {
    if (!generatedPost) return;
    const nextSlot = getNextPostSlot();
    setPostQueue((prev) => [
      ...prev,
      {
        id: Date.now(),
        content: generatedPost,
        framework: selectedFramework,
        image: generatedImage,
        scheduledFor: nextSlot,
        status: "queued",
        createdAt: new Date().toISOString(),
      },
    ]);
    setGeneratedPost("");
    setGeneratedImage(null);
  }, [generatedPost, selectedFramework, generatedImage]);

  const getNextPostSlot = () => {
    const now = new Date();
    const slots = [];
    for (let d = 0; d < 7; d++) {
      for (const time of POST_TIMES) {
        const [h, period] = time.split(" ");
        const [hour] = h.split(":");
        const date = new Date(now);
        date.setDate(date.getDate() + d);
        date.setHours(period === "PM" ? parseInt(hour) + 12 : parseInt(hour), 0, 0, 0);
        if (date > now) slots.push(date);
      }
    }
    return slots[postQueue.length % slots.length]?.toISOString() || new Date().toISOString();
  };

  // ─── PUBLISH TO FACEBOOK ─────────────────────────────────────────────────
  const publishPost = useCallback(
    async (post) => {
      if (!config.fbAccessToken || !config.fbPageId) {
        setPublishStates((prev) => ({ ...prev, [post.id]: { loading: false, error: "Please configure your Facebook credentials in Settings first.", success: false } }));
        return;
      }
      setPublishStates((prev) => ({ ...prev, [post.id]: { loading: true, error: null, success: false } }));
      try {
        const response = await fetch(
          `https://graph.facebook.com/v19.0/${config.fbPageId}/feed`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: post.content,
              access_token: config.fbAccessToken,
            }),
          }
        );
        const data = await response.json();
        if (data.error) {
          setPublishStates((prev) => ({ ...prev, [post.id]: { loading: false, error: data.error.message || "Facebook API returned an error. Check your token and permissions.", success: false } }));
          return;
        }
        if (data.id) {
          setPublishStates((prev) => ({ ...prev, [post.id]: { loading: false, error: null, success: true } }));
          setTimeout(() => {
            setPostQueue((prev) => prev.filter((p) => p.id !== post.id));
            setPostHistory((prev) => [
              { ...post, fbPostId: data.id, publishedAt: new Date().toISOString(), status: "published" },
              ...prev,
            ]);
            setPublishStates((prev) => { const n = { ...prev }; delete n[post.id]; return n; });
          }, 1500);
        } else {
          setPublishStates((prev) => ({ ...prev, [post.id]: { loading: false, error: "Unexpected response from Facebook. No post ID returned.", success: false } }));
        }
      } catch (err) {
        console.error("Failed to publish:", err);
        setPublishStates((prev) => ({ ...prev, [post.id]: { loading: false, error: "Network error — check your connection and try again.", success: false } }));
      }
    },
    [config]
  );

  // ─── COMMENT REPLY SYSTEM ────────────────────────────────────────────────
  const generateReplyForPost = useCallback(
    async (post) => {
      setPostReplies((prev) => ({ ...prev, [post.id]: { loading: true, reply: null, error: null, copied: false } }));
      try {
        const reply = await callClaude(
          `You are a ${config.niche} who just saw this post in a Facebook group. This person is a potential client/lead.

Their post: "${post.content}"
Their name: ${post.authorName}
Group: ${post.groupName}

Write a helpful, genuine comment reply that:
- Addresses them by first name naturally
- Offers real value or insight related to their need
- Positions you as an expert WITHOUT being salesy
- Ends with a soft invitation to connect (DM, call, etc.)
- Keep it under 80 words
- Sound like a real human helping out, NOT a bot or marketer
- Do NOT use phrases like "I'd love to help" or "Let me know if you need help" — be more specific and authentic
- Reference something specific from their post to show you actually read it`,
          "You write authentic, helpful Facebook group comments that position the author as a knowledgeable expert. Never sound like a bot."
        );
        setPostReplies((prev) => ({ ...prev, [post.id]: { loading: false, reply, error: null, copied: false } }));
      } catch (err) {
        setPostReplies((prev) => ({ ...prev, [post.id]: { loading: false, reply: null, error: "Failed to generate reply. Check your connection.", copied: false } }));
      }
    },
    [config.niche, callClaude]
  );

  const regenerateReplyForPost = useCallback(
    async (post) => {
      setPostReplies((prev) => ({ ...prev, [post.id]: { ...prev[post.id], loading: true, error: null } }));
      try {
        const reply = await callClaude(
          `You are a ${config.niche}. Write a DIFFERENT reply to this Facebook group post than before. Be creative, use a new angle.

Their post: "${post.content}"
Their name: ${post.authorName}
Group: ${post.groupName}

Rules: Under 80 words, genuine, positions you as expert, ends with soft CTA. No bot phrases.`,
          "You write authentic Facebook group comments. Each generation should feel unique."
        );
        setPostReplies((prev) => ({ ...prev, [post.id]: { loading: false, reply, error: null, copied: false } }));
      } catch (err) {
        setPostReplies((prev) => ({ ...prev, [post.id]: { ...prev[post.id], loading: false, error: "Failed to regenerate." } }));
      }
    },
    [config.niche, callClaude]
  );

  const copyReply = useCallback((postId) => {
    const reply = postReplies[postId]?.reply;
    if (reply) {
      navigator.clipboard.writeText(reply);
      setPostReplies((prev) => ({ ...prev, [postId]: { ...prev[postId], copied: true } }));
      setTimeout(() => {
        setPostReplies((prev) => ({ ...prev, [postId]: { ...prev[postId], copied: false } }));
      }, 2000);
    }
  }, [postReplies]);

  // ─── GROUP MONITORING ────────────────────────────────────────────────────
  const scanGroups = useCallback(async () => {
    setIsScanning(true);
    // Simulated scan results for demo
    const mockResults = [
      {
        id: "gp_" + Date.now() + 1,
        groupName: "GoHighLevel Official Community",
        authorName: "Sarah Mitchell",
        content: "🚨 HIRING: Looking for an experienced GHL expert to set up our agency's automations, funnels, and reputation management. Budget: $2,000-5,000. Must have portfolio. DM me!",
        postedAt: new Date(Date.now() - 3600000).toISOString(),
        matchedKeywords: ["GHL expert", "hiring", "funnels", "automations"],
        priority: "high",
      },
      {
        id: "gp_" + Date.now() + 2,
        groupName: "Digital Marketing Agency Owners",
        authorName: "Mark Thompson",
        content: "Does anyone know a good funnel builder who also understands GoHighLevel? Need someone ASAP for a client project. Willing to pay premium for quality work.",
        postedAt: new Date(Date.now() - 7200000).toISOString(),
        matchedKeywords: ["funnel builder", "GoHighLevel"],
        priority: "high",
      },
      {
        id: "gp_" + Date.now() + 3,
        groupName: "GHL Automation Masters",
        authorName: "Jessica Lee",
        content: "Looking for recommendations: Who's the best GHL automation expert you've worked with? Need help with a complex workflow involving Twilio + GHL + Stripe integration.",
        postedAt: new Date(Date.now() - 14400000).toISOString(),
        matchedKeywords: ["GHL automation expert"],
        priority: "medium",
      },
    ];
    setTimeout(() => {
      setSavedPosts((prev) => [...mockResults, ...prev]);
      setIsScanning(false);
    }, 2000);
  }, []);

  // ─── LEAD SCRAPING ──────────────────────────────────────────────────────
  const scrapLeads = useCallback(async () => {
    setIsScrapingLeads(true);
    // Demo leads based on dream avatar
    const mockLeads = [
      { id: "l1_" + Date.now(), name: "David Park", title: "Agency Owner at GrowthSpark", mutualFriends: 12, matchScore: 95, keywords: ["GHL", "agency"], profile: "fb.com/davidpark", status: "new" },
      { id: "l2_" + Date.now(), name: "Amanda Foster", title: "Marketing Consultant", mutualFriends: 8, matchScore: 88, keywords: ["funnel builder", "CRM"], profile: "fb.com/amandaf", status: "new" },
      { id: "l3_" + Date.now(), name: "Ryan Nguyen", title: "Founder at DigitalFlow Agency", mutualFriends: 15, matchScore: 92, keywords: ["automation", "GHL"], profile: "fb.com/ryannguyen", status: "new" },
      { id: "l4_" + Date.now(), name: "Emily Carter", title: "Real Estate Marketing Expert", mutualFriends: 5, matchScore: 78, keywords: ["CRM", "lead gen"], profile: "fb.com/emilycarter", status: "new" },
      { id: "l5_" + Date.now(), name: "Jason Williams", title: "SaaS Agency Owner", mutualFriends: 20, matchScore: 97, keywords: ["GoHighLevel", "white label"], profile: "fb.com/jasonw", status: "new" },
    ];
    setTimeout(() => {
      setScrapedLeads((prev) => [...mockLeads, ...prev]);
      setIsScrapingLeads(false);
    }, 3000);
  }, []);

  const addToFriendQueue = useCallback((lead) => {
    setFriendQueue((prev) => [...prev, { ...lead, queuedAt: new Date().toISOString() }]);
    setScrapedLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: "queued" } : l)));
  }, []);

  // ─── CONFIGURATION PANEL ─────────────────────────────────────────────────
  const ConfigPanel = () => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#0f1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 40, maxWidth: 560, width: "100%", maxHeight: "90vh", overflow: "auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: "#f9fafb", margin: 0, marginBottom: 8 }}>Configure Your AI Agent</h2>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>Connect your Facebook & Anthropic APIs to get started</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ color: "#9ca3af", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Facebook Access Token</label>
            <Input value={config.fbAccessToken} onChange={(v) => setConfig((p) => ({ ...p, fbAccessToken: v }))} placeholder="EAAxxxxxxx..." />
            <p style={{ color: "#4b5563", fontSize: 11, marginTop: 6 }}>Get this from developers.facebook.com → your app → Graph API Explorer</p>
          </div>

          <div>
            <label style={{ color: "#9ca3af", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Facebook Page/Profile ID</label>
            <Input value={config.fbPageId} onChange={(v) => setConfig((p) => ({ ...p, fbPageId: v }))} placeholder="Your page or profile ID" />
          </div>

          <div style={{ padding: 16, background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.15)", borderRadius: 12 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <div>
                <p style={{ color: "#fbbf24", fontSize: 13, fontWeight: 600, margin: 0, marginBottom: 4 }}>Important Notes</p>
                <p style={{ color: "#9ca3af", fontSize: 12, margin: 0, lineHeight: 1.6 }}>
                  Auto friend-requesting and automated posting may violate Facebook's ToS. Use responsibly with human review. The AI generates content — YOU approve before posting.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <Button variant="primary" size="lg" onClick={() => { setConfig((p) => ({ ...p, configured: true })); setShowConfig(false); }} style={{ flex: 1 }}>
              🚀 Launch Agent
            </Button>
            {config.configured && (
              <Button variant="secondary" size="lg" onClick={() => setShowConfig(false)}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // ─── CONTENT TAB ─────────────────────────────────────────────────────────
  const ContentTab = () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      {/* Left: Generation Panel */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Card>
          <h3 style={{ color: "#f9fafb", fontSize: 16, fontWeight: 600, margin: 0, marginBottom: 16, fontFamily: "'Instrument Serif', serif" }}>
            📐 Russell Brunson Framework
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.entries(RUSSELL_BRUNSON_FRAMEWORKS).map(([key, fw]) => (
              <div
                key={key}
                onClick={() => setSelectedFramework(key)}
                style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: `1px solid ${selectedFramework === key ? "rgba(96,165,250,0.4)" : "rgba(255,255,255,0.06)"}`,
                  background: selectedFramework === key ? "rgba(96,165,250,0.08)" : "rgba(255,255,255,0.02)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ color: selectedFramework === key ? "#60a5fa" : "#d1d5db", fontSize: 13, fontWeight: 600 }}>{fw.name}</div>
                <div style={{ color: "#6b7280", fontSize: 11, marginTop: 2 }}>{fw.description}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 style={{ color: "#f9fafb", fontSize: 16, fontWeight: 600, margin: 0, marginBottom: 12, fontFamily: "'Instrument Serif', serif" }}>
            💡 Topic
          </h3>
          <Input value={customTopic} onChange={setCustomTopic} placeholder="Enter a topic or leave blank for AI-suggested..." />
          <button
            onClick={() => setCustomTopic(GHL_TOPICS[Math.floor(Math.random() * GHL_TOPICS.length)])}
            style={{ marginTop: 8, background: "none", border: "none", color: "#60a5fa", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", padding: 0 }}
          >
            🎲 Random GHL topic
          </button>
        </Card>

        <Button variant="primary" size="lg" onClick={generatePost} disabled={isGenerating} style={{ width: "100%" }}>
          {isGenerating ? (
            <>
              <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⚙️</span> Generating with {RUSSELL_BRUNSON_FRAMEWORKS[selectedFramework].name}...
            </>
          ) : (
            <>✨ Generate Post</>
          )}
        </Button>
      </div>

      {/* Right: Preview & Queue */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Card style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ color: "#f9fafb", fontSize: 16, fontWeight: 600, margin: 0, fontFamily: "'Instrument Serif', serif" }}>
              📱 Post Preview
            </h3>
            <Badge variant={generatedPost ? "success" : "default"}>
              {generatedPost ? "Ready" : "Empty"}
            </Badge>
          </div>

          {generatedPost ? (
            <div>
              {/* Facebook Post Mockup */}
              <div style={{ background: "#1c1e21", borderRadius: 12, padding: 16, border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16 }}>
                    Y
                  </div>
                  <div>
                    <div style={{ color: "#e4e6eb", fontSize: 14, fontWeight: 600 }}>Your Name</div>
                    <div style={{ color: "#b0b3b8", fontSize: 12 }}>Just now · 🌐</div>
                  </div>
                </div>
                <div style={{ color: "#e4e6eb", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap", maxHeight: 300, overflow: "auto" }}>
                  {generatedPost}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                <Button variant="success" size="sm" onClick={addToQueue}>
                  📅 Add to Queue
                </Button>
                <Button variant="secondary" size="sm" onClick={generateImagePrompt}>
                  🖼️ Generate Image
                </Button>
                <Button variant="secondary" size="sm" onClick={generatePost}>
                  🔄 Regenerate
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(generatedPost)}>
                  📋 Copy
                </Button>
              </div>

              {generatedImage && (
                <div style={{ marginTop: 16, padding: 16, background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 12 }}>
                  <div style={{ color: "#a78bfa", fontSize: 12, fontWeight: 600, marginBottom: 8 }}>🖼️ IMAGE PROMPT</div>
                  <div style={{ color: "#d1d5db", fontSize: 13, lineHeight: 1.6 }}>{generatedImage.prompt}</div>
                  <p style={{ color: "#6b7280", fontSize: 11, marginTop: 8, margin: 0 }}>
                    → Use this prompt in Midjourney/DALL-E/Canva AI to create the accompanying image
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: 40, color: "#4b5563" }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>✍️</div>
              <p style={{ fontSize: 14 }}>Select a framework and generate your first post</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );

  // ─── SCHEDULE TAB ────────────────────────────────────────────────────────
  const ScheduleTab = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ color: "#6b7280", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Queued Posts</div>
          <div style={{ color: "#f9fafb", fontSize: 32, fontWeight: 700, fontFamily: "'Instrument Serif', serif", marginTop: 4 }}>{postQueue.length}</div>
          <div style={{ color: "#4b5563", fontSize: 12, marginTop: 2 }}>{Math.ceil(postQueue.length / 2)} days of content</div>
        </Card>
        <Card>
          <div style={{ color: "#6b7280", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Published</div>
          <div style={{ color: "#34d399", fontSize: 32, fontWeight: 700, fontFamily: "'Instrument Serif', serif", marginTop: 4 }}>{postHistory.length}</div>
          <div style={{ color: "#4b5563", fontSize: 12, marginTop: 2 }}>Total posts sent</div>
        </Card>
        <Card>
          <div style={{ color: "#6b7280", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Schedule</div>
          <div style={{ color: "#60a5fa", fontSize: 32, fontWeight: 700, fontFamily: "'Instrument Serif', serif", marginTop: 4 }}>2x</div>
          <div style={{ color: "#4b5563", fontSize: 12, marginTop: 2 }}>Posts per day (9 AM / 9 PM)</div>
        </Card>
      </div>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: "#f9fafb", fontSize: 18, fontWeight: 600, margin: 0, fontFamily: "'Instrument Serif', serif" }}>📅 Post Queue</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="secondary" size="sm" onClick={() => setActiveTab("content")}>
              + Create Post
            </Button>
          </div>
        </div>

        {postQueue.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#4b5563" }}>
            <div style={{ fontSize: 48, opacity: 0.5, marginBottom: 12 }}>📭</div>
            <p>No posts queued. Generate content first!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {postQueue.map((post, i) => (
              <div
                key={post.id}
                style={{
                  display: "flex",
                  gap: 16,
                  padding: 16,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12,
                  alignItems: "flex-start",
                }}
              >
                <div style={{ minWidth: 36, height: 36, borderRadius: 10, background: "rgba(96,165,250,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa", fontWeight: 700, fontSize: 14 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#d1d5db", fontSize: 13, lineHeight: 1.6, maxHeight: 60, overflow: "hidden" }}>
                    {post.content.substring(0, 150)}...
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
                    <Badge>{RUSSELL_BRUNSON_FRAMEWORKS[post.framework]?.name}</Badge>
                    <Badge variant="info">
                      {new Date(post.scheduledFor).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}{" "}
                      {new Date(post.scheduledFor).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </Badge>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => publishPost(post)}
                      disabled={publishStates[post.id]?.loading || publishStates[post.id]?.success}
                    >
                      {publishStates[post.id]?.loading
                        ? "⏳ Publishing..."
                        : publishStates[post.id]?.success
                        ? "✅ Published!"
                        : "Publish Now"}
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setPostQueue((prev) => prev.filter((p) => p.id !== post.id))} disabled={publishStates[post.id]?.loading}>
                      ✕
                    </Button>
                  </div>
                  {publishStates[post.id]?.error && (
                    <div style={{ fontSize: 11, color: "#f87171", maxWidth: 220, textAlign: "right", lineHeight: 1.4 }}>
                      {publishStates[post.id].error}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {postHistory.length > 0 && (
        <Card>
          <h3 style={{ color: "#f9fafb", fontSize: 18, fontWeight: 600, margin: 0, marginBottom: 16, fontFamily: "'Instrument Serif', serif" }}>
            ✅ Published History
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {postHistory.map((post) => (
              <div key={post.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.1)", borderRadius: 10 }}>
                <div style={{ color: "#d1d5db", fontSize: 13 }}>{post.content.substring(0, 80)}...</div>
                <Badge variant="success">Published</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );

  // ─── GROUPS TAB ──────────────────────────────────────────────────────────
  const GroupsTab = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <h3 style={{ color: "#f9fafb", fontSize: 18, fontWeight: 600, margin: 0, marginBottom: 8, fontFamily: "'Instrument Serif', serif" }}>
          🔍 Group Monitor
        </h3>
        <p style={{ color: "#6b7280", fontSize: 13, margin: 0, marginBottom: 16 }}>
          Scans Facebook groups for posts mentioning: GHL expert, funnel builder, hiring automation expert, and more.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {DREAM_CUSTOMER_KEYWORDS.map((kw) => (
            <Badge key={kw} variant="info">{kw}</Badge>
          ))}
        </div>

        <Button variant="primary" onClick={scanGroups} disabled={isScanning}>
          {isScanning ? "⏳ Scanning Groups..." : "🔍 Scan Groups Now"}
        </Button>
      </Card>

      {savedPosts.length > 0 && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ color: "#f9fafb", fontSize: 18, fontWeight: 600, margin: 0, fontFamily: "'Instrument Serif', serif" }}>
              🎯 Matched Posts ({savedPosts.length})
            </h3>
            <Badge variant="live">Live Monitoring</Badge>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {savedPosts.map((post) => (
              <div
                key={post.id}
                style={{
                  padding: 20,
                  background: post.priority === "high" ? "rgba(52,211,153,0.04)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${post.priority === "high" ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 14,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ color: "#f9fafb", fontSize: 14, fontWeight: 600 }}>{post.authorName}</div>
                    <div style={{ color: "#6b7280", fontSize: 12 }}>{post.groupName} · {new Date(post.postedAt).toRelativeTimeString?.() || "Recently"}</div>
                  </div>
                  <Badge variant={post.priority === "high" ? "success" : "warning"}>
                    {post.priority === "high" ? "🔥 Hot Lead" : "Warm"}
                  </Badge>
                </div>
                <p style={{ color: "#d1d5db", fontSize: 13, lineHeight: 1.7, margin: "12px 0" }}>{post.content}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                  {post.matchedKeywords.map((kw) => (
                    <Badge key={kw} variant="info">{kw}</Badge>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => generateReplyForPost(post)}
                    disabled={postReplies[post.id]?.loading}
                  >
                    {postReplies[post.id]?.loading
                      ? "⏳ Generating..."
                      : postReplies[post.id]?.reply
                      ? "💬 Reply Ready"
                      : "💬 Generate Reply"}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => window.open(`https://facebook.com`, '_blank')}>👤 View Profile</Button>
                  <Button variant="ghost" size="sm" onClick={() => {
                    navigator.clipboard.writeText(post.content);
                  }}>📌 Save Post</Button>
                </div>

                {/* Generated Reply Display */}
                {postReplies[post.id]?.loading && (
                  <div style={{ marginTop: 12, padding: 16, background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.15)", borderRadius: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⚙️</span>
                      <span style={{ color: "#60a5fa", fontSize: 13 }}>AI is crafting a personalized reply for {post.authorName}...</span>
                    </div>
                  </div>
                )}

                {postReplies[post.id]?.reply && !postReplies[post.id]?.loading && (
                  <div style={{ marginTop: 12, padding: 16, background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ color: "#34d399", fontSize: 12, fontWeight: 600, letterSpacing: "0.03em" }}>YOUR AI-GENERATED REPLY</span>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Button variant="ghost" size="sm" onClick={() => copyReply(post.id)}>
                          {postReplies[post.id]?.copied ? "✅ Copied!" : "📋 Copy"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => regenerateReplyForPost(post)}>
                          🔄 New Version
                        </Button>
                      </div>
                    </div>
                    <div style={{ color: "#e5e7eb", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap", padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                      {postReplies[post.id].reply}
                    </div>
                    <p style={{ color: "#6b7280", fontSize: 11, marginTop: 8, marginBottom: 0 }}>
                      Copy this reply and paste it as a comment on their post in the Facebook group.
                    </p>
                  </div>
                )}

                {postReplies[post.id]?.error && !postReplies[post.id]?.loading && (
                  <div style={{ marginTop: 12, padding: 12, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 10 }}>
                    <span style={{ color: "#f87171", fontSize: 13 }}>{postReplies[post.id].error}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );

  // ─── LEADS TAB ───────────────────────────────────────────────────────────
  const LeadsTab = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card>
          <h3 style={{ color: "#f9fafb", fontSize: 18, fontWeight: 600, margin: 0, marginBottom: 16, fontFamily: "'Instrument Serif', serif" }}>
            🎯 Dream Customer Avatar
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ color: "#9ca3af", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Keywords / Interests</label>
              <TextArea value={dreamAvatar.keywords} onChange={(v) => setDreamAvatar((p) => ({ ...p, keywords: v }))} rows={3} placeholder="GoHighLevel, funnel builder, marketing automation..." />
            </div>
            <div>
              <label style={{ color: "#9ca3af", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Industry</label>
              <Input value={dreamAvatar.industry} onChange={(v) => setDreamAvatar((p) => ({ ...p, industry: v }))} placeholder="Digital Marketing Agency" />
            </div>
            <div>
              <label style={{ color: "#9ca3af", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Location (optional)</label>
              <Input value={dreamAvatar.location} onChange={(v) => setDreamAvatar((p) => ({ ...p, location: v }))} placeholder="USA, UK, etc." />
            </div>
            <Button variant="primary" onClick={scrapLeads} disabled={isScrapingLeads}>
              {isScrapingLeads ? "⏳ Scraping Leads..." : "🔎 Find Leads"}
            </Button>
          </div>
        </Card>

        <Card>
          <h3 style={{ color: "#f9fafb", fontSize: 18, fontWeight: 600, margin: 0, marginBottom: 12, fontFamily: "'Instrument Serif', serif" }}>
            👥 Friend Request Queue
          </h3>
          <p style={{ color: "#6b7280", fontSize: 13, margin: 0, marginBottom: 16 }}>
            Approved leads waiting to be added. Sends max 10-15/day to stay safe.
          </p>
          {friendQueue.length === 0 ? (
            <div style={{ textAlign: "center", padding: 24, color: "#4b5563" }}>
              <p style={{ fontSize: 13 }}>No leads in queue. Scrape leads first, then approve them.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {friendQueue.map((lead) => (
                <div key={lead.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 10, background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
                  <div>
                    <div style={{ color: "#d1d5db", fontSize: 13, fontWeight: 500 }}>{lead.name}</div>
                    <div style={{ color: "#6b7280", fontSize: 11 }}>{lead.title}</div>
                  </div>
                  <Badge variant="warning">Pending</Badge>
                </div>
              ))}
            </div>
          )}
          {friendQueue.length > 0 && (
            <Button variant="success" size="sm" style={{ marginTop: 12, width: "100%" }}>
              ▶️ Process Queue (sends with random delays)
            </Button>
          )}
        </Card>
      </div>

      {scrapedLeads.length > 0 && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ color: "#f9fafb", fontSize: 18, fontWeight: 600, margin: 0, fontFamily: "'Instrument Serif', serif" }}>
              📋 Scraped Leads ({scrapedLeads.length})
            </h3>
            <Button variant="secondary" size="sm" onClick={() => scrapedLeads.filter((l) => l.status === "new").forEach(addToFriendQueue)}>
              Add All to Queue
            </Button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
              <thead>
                <tr>
                  {["Name", "Title", "Match", "Mutual Friends", "Keywords", "Status", "Action"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: "#6b7280", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scrapedLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td style={{ padding: "12px", color: "#e5e7eb", fontSize: 13, fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{lead.name}</td>
                    <td style={{ padding: "12px", color: "#9ca3af", fontSize: 12, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{lead.title}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ color: lead.matchScore >= 90 ? "#34d399" : lead.matchScore >= 80 ? "#fbbf24" : "#9ca3af", fontWeight: 700, fontSize: 13 }}>
                        {lead.matchScore}%
                      </span>
                    </td>
                    <td style={{ padding: "12px", color: "#9ca3af", fontSize: 13, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{lead.mutualFriends}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        {lead.keywords.map((kw) => (
                          <Badge key={kw}>{kw}</Badge>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <Badge variant={lead.status === "queued" ? "warning" : lead.status === "sent" ? "success" : "default"}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      {lead.status === "new" && (
                        <Button variant="success" size="sm" onClick={() => addToFriendQueue(lead)}>
                          + Queue
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );

  // ─── RENDER ──────────────────────────────────────────────────────────────
  const tabs = [
    { id: "content", label: "Content Engine", icon: "✍️" },
    { id: "schedule", label: "Schedule", icon: "📅", count: postQueue.length },
    { id: "groups", label: "Group Monitor", icon: "🔍", count: savedPosts.length },
    { id: "leads", label: "Lead Scraper", icon: "🎯", count: scrapedLeads.length },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#08090c", minHeight: "100vh", color: "#e5e7eb" }}>
      <style>{FONTS}{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>

      {showConfig && <ConfigPanel />}

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
            ⚡
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, fontFamily: "'Instrument Serif', serif", color: "#f9fafb", letterSpacing: "-0.01em" }}>
              Facebook AI Agent
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>GHL Expert Edition · Russell Brunson Frameworks</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Badge variant="live">Agent Active</Badge>
          <Button variant="ghost" size="sm" onClick={() => setShowConfig(true)}>
            ⚙️ Settings
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "24px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <TabBar tabs={tabs} active={activeTab} onChange={setActiveTab} />
        </div>

        <div style={{ animation: "fadeIn 0.3s ease" }}>
          {activeTab === "content" && <ContentTab />}
          {activeTab === "schedule" && <ScheduleTab />}
          {activeTab === "groups" && <GroupsTab />}
          {activeTab === "leads" && <LeadsTab />}
        </div>
      </div>
    </div>
  );
}
