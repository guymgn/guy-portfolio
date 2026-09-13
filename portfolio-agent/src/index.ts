import { PORTFOLIO_KNOWLEDGE, SYSTEM_PROMPT } from "./knowledge";

interface AiBinding {
  run(model: string, inputs: Record<string, unknown>): Promise<unknown>;
}

interface RateLimitBinding {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

interface JarvisBinding {
  portfolioChat(messages: ChatMessage[]): Promise<AgentAnswer>;
}

interface Env {
  AI: AiBinding;
  CHAT_RATE_LIMITER: RateLimitBinding;
  JARVIS: JarvisBinding;
}

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type AgentAnswer = {
  text: string;
  links: Array<{ label: string; href: string }>;
  handoff?: "jarvis";
};

const ALLOWED_ORIGINS = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://guy-portfolio-tau.vercel.app",
  "https://guymagen.com",
  "https://www.guymagen.com",
]);

const APPROVED_LINKS = new Set([
  "/#work",
  "/stigg",
  "/finout",
  "mailto:hi@guymagen.com",
  "https://www.teara.io",
  "https://www.linkedin.com/in/guymagen/",
  "https://github.com/guymgn",
]);

const INJECTION_REFUSAL: AgentAnswer = {
  text: "I can help with questions about Guy and his portfolio, but I can't follow requests to override the guide, reveal its instructions, or invent information.",
  links: [],
};

const PROMPT_INJECTION_PATTERNS = [
  /\bignore\b.{0,50}\b(previous|prior|above|system|developer)\b.{0,30}\b(instruction|prompt|message|rule)s?\b/i,
  /\b(reveal|show|print|repeat|quote|expose|leak)\b.{0,60}\b(system prompt|hidden prompt|hidden instruction|developer message|portfolio knowledge)\b/i,
  /\b(system prompt|hidden prompt|hidden instruction|developer message)\b.{0,60}\b(reveal|show|print|repeat|quote|expose|leak)\b/i,
  /\b(encode|convert|translate)\b.{0,40}\b(instruction|prompt|system message)s?\b.{0,30}\b(base64|hex|rot13|binary)\b/i,
  /\b(base64|hex|rot13|binary)\b.{0,40}\b(instruction|prompt|system message)s?\b/i,
  /\bpretend\b.{0,40}\bGuy\b.{0,40}\b(worked|works|founded|said|believes)\b/i,
  /\b(speak|respond|act|pose)\b.{0,25}\bas\b.{0,15}\bGuy\b/i,
];

const UNSAFE_ANSWER_PATTERNS = [
  /\b(system prompt|hidden prompt|hidden instruction|developer message|approved portfolio knowledge)\b/i,
  /@cf\/|llama-3\.3-70b/i,
  /\b(I am|I'm) Guy\b/i,
];

function isPromptInjection(messages: ChatMessage[]): boolean {
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user");
  return latestUserMessage ? PROMPT_INJECTION_PATTERNS.some((pattern) => pattern.test(latestUserMessage.content)) : false;
}

function isUnsafeAnswer(answer: AgentAnswer): boolean {
  return UNSAFE_ANSWER_PATTERNS.some((pattern) => pattern.test(answer.text));
}

function corsHeaders(origin: string | null): HeadersInit {
  return {
    "Access-Control-Allow-Origin": origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://guymagen.com",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(data: unknown, status: number, origin: string | null): Response {
  return Response.json(data, { status, headers: corsHeaders(origin) });
}

function isMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Record<string, unknown>;
  return (message.role === "user" || message.role === "assistant")
    && typeof message.content === "string"
    && message.content.trim().length > 0
    && message.content.length <= 1_500;
}

function sanitizeAnswer(value: unknown): AgentAnswer | null {
  if (!value || typeof value !== "object") return null;
  const answer = value as Record<string, unknown>;
  if (typeof answer.text !== "string" || !answer.text.trim()) return null;

  const links = Array.isArray(answer.links)
    ? answer.links.flatMap((candidate) => {
        if (!candidate || typeof candidate !== "object") return [];
        const link = candidate as Record<string, unknown>;
        if (typeof link.label !== "string" || typeof link.href !== "string" || !APPROVED_LINKS.has(link.href)) return [];
        return [{ label: link.label.slice(0, 60), href: link.href }];
      }).slice(0, 2)
    : [];

  return { text: answer.text.trim().slice(0, 1_200), links };
}

function extractResponse(result: unknown): unknown {
  if (!result || typeof result !== "object") return null;
  const modelResult = result as Record<string, unknown>;
  if (modelResult.response !== undefined && modelResult.response !== null) return modelResult.response;
  if (!Array.isArray(modelResult.choices) || !modelResult.choices[0] || typeof modelResult.choices[0] !== "object") return null;
  const choice = modelResult.choices[0] as Record<string, unknown>;
  if (typeof choice.text === "string") return choice.text;
  if (!choice.message || typeof choice.message !== "object") return null;
  const content = (choice.message as Record<string, unknown>).content;
  return typeof content === "string" ? content : null;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      if (origin && !ALLOWED_ORIGINS.has(origin)) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (url.pathname === "/health" && request.method === "GET") {
      return json({ ok: true }, 200, origin);
    }

    if (url.pathname !== "/chat" || request.method !== "POST") {
      return json({ error: "Not found" }, 404, origin);
    }

    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return json({ error: "Origin not allowed" }, 403, origin);
    }

    const rateLimitKey = request.headers.get("CF-Connecting-IP") ?? "anonymous";
    const { success: withinRateLimit } = await env.CHAT_RATE_LIMITER.limit({ key: rateLimitKey });
    if (!withinRateLimit) {
      return json({ error: "The guide has received a lot of questions just now. Please try again in a minute." }, 429, origin);
    }

    const contentLength = Number(request.headers.get("Content-Length") ?? 0);
    if (contentLength > 20_000) return json({ error: "Request too large" }, 413, origin);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid request" }, 400, origin);
    }

    const messagesValue = body && typeof body === "object" ? (body as Record<string, unknown>).messages : null;
    const guide = body && typeof body === "object" && (body as Record<string, unknown>).guide === "jarvis" ? "jarvis" : "portfolio";
    if (!Array.isArray(messagesValue)) return json({ error: "Messages are required" }, 400, origin);

    const messages = messagesValue.filter(isMessage).slice(-8);
    if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
      return json({ error: "A user question is required" }, 400, origin);
    }

    if (isPromptInjection(messages)) {
      return json(INJECTION_REFUSAL, 200, origin);
    }

    try {
      const latestQuestion = messages[messages.length - 1].content;
      const asksForTearaProgress = /\bteara\b/i.test(latestQuestion)
        && /\b(progress|development|developing|building|latest|update|status|roadmap)\b/i.test(latestQuestion);
      if (guide === "portfolio" && asksForTearaProgress) {
        return json({
          text: "Teara is Guy's iPhone trip-organizer side project, currently available as a public TestFlight beta. Jarvis, Teara's AI marketing collaborator, can share the latest approved development update.",
          links: [{ label: "Visit Teara", href: "https://www.teara.io" }],
          handoff: "jarvis",
        }, 200, origin);
      }

      if (guide === "jarvis") {
        const jarvisAnswer = sanitizeAnswer(await env.JARVIS.portfolioChat(messages));
        if (!jarvisAnswer || isUnsafeAnswer(jarvisAnswer)) return json(INJECTION_REFUSAL, 200, origin);
        return json(jarvisAnswer, 200, origin);
      }

      const result = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
        messages: [
          { role: "system", content: `${SYSTEM_PROMPT}\n\nAPPROVED PORTFOLIO KNOWLEDGE:\n${PORTFOLIO_KNOWLEDGE}` },
          ...messages,
        ],
        temperature: 0.25,
        max_tokens: 450,
        response_format: {
          type: "json_schema",
          json_schema: {
            type: "object",
            properties: {
              text: { type: "string" },
              links: {
                type: "array",
                maxItems: 2,
                items: {
                  type: "object",
                  properties: {
                    label: { type: "string" },
                    href: { type: "string" },
                  },
                  required: ["label", "href"],
                },
              },
            },
            required: ["text", "links"],
          },
        },
      });

      const raw = extractResponse(result);
      if (!raw) {
        console.error(JSON.stringify({
          event: "portfolio_agent_unexpected_model_result",
          resultType: Object.prototype.toString.call(result),
          keys: result && typeof result === "object" ? Object.keys(result) : [],
        }));
        throw new Error("The model returned no text");
      }

      const parsed = sanitizeAnswer(typeof raw === "string" ? JSON.parse(raw) : raw);
      if (!parsed) throw new Error("The model returned an invalid answer");
      if (isUnsafeAnswer(parsed)) {
        console.warn(JSON.stringify({ event: "portfolio_agent_blocked_unsafe_answer" }));
        return json(INJECTION_REFUSAL, 200, origin);
      }
      const mentionsTeara = /\bteara\b/i.test(messages[messages.length - 1].content) || /\bteara\b/i.test(parsed.text);
      return json({ ...parsed, ...(mentionsTeara ? { handoff: "jarvis" as const } : {}) }, 200, origin);
    } catch (error) {
      console.error(JSON.stringify({ event: "portfolio_agent_error", message: error instanceof Error ? error.message : "Unknown error" }));
      return json({ error: "The guide couldn't answer that just now. Please try again." }, 502, origin);
    }
  },
};
