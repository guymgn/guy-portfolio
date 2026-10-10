"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowUp, LoaderCircle, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { trackEvent } from "./Analytics";
import { isTearaStatusQuestion, loadTearaStatus, tearaReleaseAnswer } from "../lib/teara-status";

const AGENT_ENDPOINT = "https://guy-portfolio-agent.weathered-flower-de49.workers.dev/chat";

const prompts = ["Show me Guy's strongest systems work", "What tools does Guy use?", "What's happening with Teara?"];

const toolsAnswer = `Guy’s toolkit spans a few areas:

- **Product design:** Figma and Sketch
- **AI & development:** ChatGPT + Codex, Claude, Xcode, and Super.Engineering
- **Content & code management:** Notion, GitHub, and Netlify

He chooses tools based on what helps move an idea from concept to a working product—not just a design artifact.`;

const tearaAppStoreLink: AgentLink = { label: "View Teara on the App Store", href: "https://apps.apple.com/us/app/teara/id6800005317" };

type Guide = "portfolio" | "jarvis";
type AgentLink = { label: string; href: string };
type AgentAnswer = { text: string; links: AgentLink[]; handoff?: "jarvis" };
type ConversationMessage = { role: "user" | "assistant"; content: string; guide: Guide; links?: AgentLink[]; handoff?: "jarvis" };

function isAgentAnswer(value: unknown): value is AgentAnswer {
  if (!value || typeof value !== "object") return false;
  const answer = value as Record<string, unknown>;
  return typeof answer.text === "string" && Array.isArray(answer.links);
}

export function PortfolioAgent() {
  const agentRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [activeGuide, setActiveGuide] = useState<Guide>("portfolio");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clear = () => {
    trackEvent("Agent Conversation Cleared", { questions_asked: messages.filter((message) => message.role === "user").length });
    setQuestion(""); setMessages([]); setError(""); setActiveGuide("portfolio");
  };

  useEffect(() => {
    const agent = agentRef.current;
    if (!agent) return;
    const handleOutsideClick = (event: PointerEvent) => {
      if (!agent.contains(event.target as Node)) setFocused(false);
    };
    const handlePageScroll = () => setFocused(false);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setFocused(false);
    }, { threshold: 0 });
    observer.observe(agent);
    document.addEventListener("pointerdown", handleOutsideClick);
    window.addEventListener("scroll", handlePageScroll, { passive: true });
    return () => {
      observer.disconnect();
      document.removeEventListener("pointerdown", handleOutsideClick);
      window.removeEventListener("scroll", handlePageScroll);
    };
  }, []);

  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const ask = async (nextQuestion: string, history: ConversationMessage[] = messages, guide: Guide = activeGuide) => {
    const clean = nextQuestion.trim();
    if (!clean || loading) return;

    const nextMessages: ConversationMessage[] = [...history, { role: "user", content: clean, guide }];
    trackEvent("Agent Question Asked", {
      guide,
      source: prompts.includes(clean) ? "suggested_prompt" : "typed_question",
      question_number: nextMessages.filter((message) => message.role === "user").length,
    });
    setQuestion("");
    setMessages(nextMessages);
    setError("");
    setLoading(true);

    if (guide === "portfolio" && clean.toLowerCase().replace(/[?.!]+$/, "") === "what tools does guy use") {
      trackEvent("Agent Response Received", { guide, has_links: false, offered_jarvis_handoff: false, source: "preset_answer" });
      setMessages([...nextMessages, { role: "assistant", content: toolsAnswer, guide, links: [] }]);
      setLoading(false);
      return;
    }

    if (isTearaStatusQuestion(clean, history, guide)) {
      let content: string;
      try {
        content = tearaReleaseAnswer(await loadTearaStatus());
      } catch {
        content = "I couldn’t load Teara’s current release status just now. Please check the App Store for the latest version.";
      }
      trackEvent("Agent Response Received", { guide, has_links: true, offered_jarvis_handoff: false, source: "preset_answer" });
      setMessages([...nextMessages, { role: "assistant", content, guide, links: [tearaAppStoreLink] }]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(AGENT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guide, messages: nextMessages.filter((message) => message.guide === guide).map(({ role, content }) => ({ role, content })) }),
      });
      const data: unknown = await response.json();
      if (!response.ok || !isAgentAnswer(data)) {
        const message = data && typeof data === "object" && typeof (data as Record<string, unknown>).error === "string"
          ? String((data as Record<string, unknown>).error)
          : "I couldn't answer that just now.";
        throw new Error(message);
      }
      trackEvent("Agent Response Received", { guide, has_links: data.links.length > 0, offered_jarvis_handoff: data.handoff === "jarvis" });
      setMessages([...nextMessages, { role: "assistant", content: data.text, guide, links: data.links, handoff: data.handoff }]);
    } catch (requestError) {
      trackEvent("Agent Response Failed", { guide });
      setError(requestError instanceof Error ? requestError.message : "I couldn't answer that just now.");
    } finally {
      setLoading(false);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); void ask(question); };
  const retry = () => {
    const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
    if (!lastUserMessage) return;
    trackEvent("Agent Response Retried", { guide: lastUserMessage.guide });
    const history = messages.slice(0, messages.lastIndexOf(lastUserMessage));
    void ask(lastUserMessage.content, history, lastUserMessage.guide);
  };

  const switchToJarvis = () => {
    trackEvent("Agent Guide Switched", { guide: "jarvis" });
    setActiveGuide("jarvis");
    setFocused(true);
    void ask("What is the current development progress?", messages, "jarvis");
  };

  const switchToPortfolio = () => {
    trackEvent("Agent Guide Switched", { guide: "portfolio" });
    setActiveGuide("portfolio");
    setFocused(true);
  };

  return <div className="portfolioAgentDock"><div ref={agentRef} className={`portfolioAgent ${messages.length ? "isOpen" : ""} ${focused ? "isFocused" : ""}`} onFocusCapture={() => {
    if (!focused) trackEvent("Agent Opened");
    setFocused(true);
  }}>
    <div className="portfolioAgentHeading">
      <span><Sparkles size={14} aria-hidden="true"/> {activeGuide === "jarvis" ? "Jarvis · Teara update" : "Ask about Guy"}</span>
      <div>{activeGuide === "jarvis" ? <button type="button" onClick={switchToPortfolio}>Back to portfolio guide</button> : null}{messages.length || error ? <button type="button" onClick={clear}>Clear</button> : null}</div>
    </div>
    {!messages.length ? <div className="portfolioAgentPrompts">
      <a className="cvButton agentCvButton" href="/Guy-Magen-CV.pdf" download onClick={() => trackEvent("CV Downloaded", { source: "agent" })}>Download my CV <span aria-hidden="true">↓</span></a>
      {prompts.map((prompt) => <button type="button" onClick={() => void ask(prompt)} key={prompt}>{prompt}</button>)}
    </div> : null}
    {messages.length || loading ? <div className="portfolioAgentTranscript" ref={transcriptRef} aria-live="polite">
      {messages.map((message, index) => <div className={`portfolioAgentMessage is${message.role === "user" ? "User" : "Assistant"}`} key={`${message.role}-${index}`}>
        <small>{message.role === "user" ? "You" : message.guide === "jarvis" ? "Jarvis · Teara" : "Portfolio guide"}</small>
        {message.role === "assistant" ? <div className="portfolioAgentMarkdown">
          <ReactMarkdown
            remarkPlugins={[remarkBreaks]}
            skipHtml
            components={{
              a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("Agent Link Clicked", { guide: message.guide, destination: href ?? "unknown", source: "response text" })}>{children}</a>,
            }}
          >{message.content}</ReactMarkdown>
        </div> : <p>{message.content}</p>}
        {message.links?.length ? <div className="portfolioAgentLinks">{message.links.map((link) => <a href={link.href} target="_blank" rel="noopener noreferrer" key={link.href} onClick={() => trackEvent("Agent Link Clicked", { guide: message.guide, destination: link.href, source: "response link" })}>{link.label} <span>↗</span></a>)}</div> : null}
        {message.role === "assistant" && message.handoff === "jarvis" && activeGuide === "portfolio" ? <button className="agentHandoff" type="button" onClick={switchToJarvis}>Ask Jarvis about Teara <span aria-hidden="true">→</span></button> : null}
      </div>)}
      {loading ? <div className="portfolioAgentThinking"><LoaderCircle size={14} aria-hidden="true"/> {activeGuide === "jarvis" ? "Checking Teara’s public update…" : "Looking through Guy’s work…"}</div> : null}
    </div> : null}
    {error ? <div className="portfolioAgentError" role="alert"><span>{error}</span><button type="button" onClick={retry}>Try again</button></div> : null}
    {messages.length ? <button className="portfolioAgentResume" type="button" onClick={() => { trackEvent("Agent Conversation Resumed", { guide: activeGuide }); setFocused(true); }}>
      <span>Continue conversation</span><small>{messages.filter((message) => message.role === "user").length} {messages.filter((message) => message.role === "user").length === 1 ? "question" : "questions"}</small>
    </button> : null}
    <form onSubmit={submit}>
      <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={activeGuide === "jarvis" ? "Ask Jarvis about Teara" : messages.length ? "Ask a follow-up" : "Ask about Guy's work, process, or experience"} aria-label={activeGuide === "jarvis" ? "Ask Jarvis about Teara" : "Ask about Guy's portfolio"} disabled={loading} maxLength={1500}/>
      <button className="agentSubmit" type="submit" aria-label="Ask question" disabled={loading || !question.trim()}><ArrowUp size={17}/></button>
    </form>
  </div></div>;
}
