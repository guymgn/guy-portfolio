"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChartNoAxesCombined, MessageSquare, Trash } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts";

function Hotspot({ title, children, className = "" }: { title: string; children: string; className?: string }) {
  return <button type="button" className={`anomalyHotspot ${className}`} aria-label={`${title}: ${children}`}><span><strong>{title}</strong>{children}</span></button>;
}

function TrendChart({ compact = false, direction = "up" }: { compact?: boolean; direction?: "up" | "down" }) {
  const upwardData = [
    { date: "19.12", cost: 0.62 },
    { date: "22.12", cost: 0.78 },
    { date: "28.12", cost: 1.18 },
    { date: "30.12", cost: 0.77 },
    { date: "04.01", cost: 1.12 },
    { date: "09.01", cost: 0.78 },
    { date: "12.01", cost: 2.05 },
  ];
  const data = direction === "down" ? upwardData.map((point, index) => index === upwardData.length - 1 ? { ...point, cost: .68 } : point) : upwardData;
  const gradientId = `anomaly-area-${useId().replace(/:/g, "")}`;
  const chartRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(data.length - 1);
  const [dragging, setDragging] = useState(false);
  const [showTrendTip, setShowTrendTip] = useState(false);
  const activePoint = data[activeIndex];
  const endpointColor = direction === "down" ? "var(--anomaly-chart-green)" : "var(--anomaly-chart-alert)";
  const selectPoint = (clientX: number) => {
    const bounds = chartRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const plotLeft = 34;
    const plotRight = 10;
    const ratio = Math.max(0, Math.min(1, (clientX - bounds.left - plotLeft) / (bounds.width - plotLeft - plotRight)));
    setActiveIndex(Math.round(ratio * (data.length - 1)));
  };
  return (
    <div ref={chartRef} className={`${compact ? "anomalyMiniChart" : "anomalyChart"} anomalyInteractiveChart`} aria-label={`Cost trend on ${activePoint.date}: $${activePoint.cost.toFixed(2)}k`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 8, bottom: 4, left: -18 }}>
          <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="8%" stopColor="var(--anomaly-chart-green)" stopOpacity={0.34}/><stop offset="92%" stopColor="var(--anomaly-chart-green)" stopOpacity={0.04}/></linearGradient></defs>
          <CartesianGrid vertical={false} stroke="var(--anomaly-chart-grid)" />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "var(--anomaly-chart-muted)", fontSize: 9 }} interval={2} />
          <YAxis domain={[0, 3]} ticks={[0, 1, 2, 3]} axisLine={false} tickLine={false} tickFormatter={(value) => value === 0 ? "$0" : `$${value}`} tick={{ fill: "var(--anomaly-chart-muted)", fontSize: 9 }} />
          <ReferenceLine x={activePoint.date} stroke={endpointColor} strokeDasharray="4 4" />
          <Area type="linear" dataKey="cost" stroke="var(--anomaly-chart-green)" strokeWidth={1.7} fill={`url(#${gradientId})`} isAnimationActive={false} dot={(props) => props.index === activeIndex ? <circle cx={props.cx} cy={props.cy} r={5} fill={endpointColor} stroke="var(--anomaly-panel)" strokeWidth={2} /> : <></>} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="anomalyDragLayer" onPointerEnter={() => setShowTrendTip(true)} onPointerLeave={() => { if (!dragging) setShowTrendTip(false); }} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDragging(true); setShowTrendTip(true); selectPoint(event.clientX); }} onPointerMove={(event) => { if (dragging) selectPoint(event.clientX); }} onPointerUp={(event) => { event.currentTarget.releasePointerCapture(event.pointerId); setDragging(false); }} />
      <div className={`anomalyTrendTooltip ${showTrendTip ? "isVisible" : ""}`} style={{ left: `${9 + (activeIndex / (data.length - 1)) * 87}%` }}><strong>{activePoint.date}</strong><span>Cost <b>${activePoint.cost.toFixed(2)}k</b></span><small>Drag to inspect the trend</small></div>
    </div>
  );
}

type CardData = { date: string; amount: string; change: string; expected: string; actual: string; provider: string; service: string; direction: "up" | "down" };
const defaultCard: CardData = { date: "Jan 12, 2023", amount: "$2,700", change: "5.9%", expected: "$45,400", actual: "$48,100", provider: "AWS", service: "Service: AmazonEC2", direction: "up" };

function AnomalyCard({ mode = "anatomy", data = defaultCard, resetSignal = "" }: { mode?: "anatomy" | "compact" | "comment" | "context"; data?: CardData; resetSignal?: string }) {
  const compact = mode !== "anatomy";
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [postedComment, setPostedComment] = useState("");
  useEffect(() => {
    setComposerOpen(false);
    setDraft("");
  }, [resetSignal]);
  const submitComment = () => {
    const value = draft.trim();
    if (!value) return;
    setPostedComment(value);
    setDraft("");
    setComposerOpen(false);
  };
  return (
    <article className={`anomalyCard anomalyCard--${mode}`}>
      <small>{data.date}</small>
      <div className="anomalyCardMain">
        <div className="anomalySummary">
          <div className={`anomalySignal is${data.direction === "down" ? "Down" : "Up"}`}><span>Cost anomaly</span><h4>{data.amount} <em>{data.direction === "down" ? "▼" : "▲"} {data.change}</em></h4>{!compact && <Hotspot title="Signal" className="signalHotspot">Amount and deviation make severity scannable.</Hotspot>}</div>
          <dl><div><dt>Expected cost</dt><dd>{data.expected}</dd></div><div><dt>Actual cost</dt><dd>{data.actual}</dd></div></dl>
          {!compact && <Hotspot title="Baseline" className="baselineHotspot">Expected versus actual explains why it surfaced.</Hotspot>}
          <p><b>Cost center</b><span className="anomalyProvider">{data.provider}</span></p>
          <mark>{data.service}</mark>
          {!compact && <Hotspot title="Scope" className="scopeHotspot">Cost center and service locate the change.</Hotspot>}
        </div>
        <div className="anomalyEvidence"><TrendChart compact={compact} direction={data.direction} /></div>
      </div>
      <footer><button type="button" className="isPrimary"><ChartNoAxesCombined aria-hidden="true" />Investigate</button><button type="button"><Trash aria-hidden="true" />Delete</button><button type="button" onClick={() => setComposerOpen((open) => !open)}><MessageSquare aria-hidden="true" />{postedComment ? "1 Comment" : "Add comment"}</button>{!compact && <Hotspot title="Next action" className="actionHotspot">Investigate carries this context into MegaBill.</Hotspot>}</footer>
      <div className={`anomalyCommentReveal ${composerOpen && !postedComment ? "isOpen" : ""}`} aria-hidden={!composerOpen || Boolean(postedComment)}><div><form className="anomalyCommentComposer" onSubmit={(event) => { event.preventDefault(); submitComment(); }}><input value={draft} onChange={(event) => setDraft(event.target.value)} aria-label="Comment" placeholder="Add context for the team…" disabled={!composerOpen || Boolean(postedComment)} autoFocus={composerOpen}/><button type="submit" disabled={!composerOpen || !draft.trim()}>Post</button></form></div></div>
      {postedComment ? <div className="anomalyPostedComment"><p>{postedComment}</p><div><span>Added just now by <b>Guy Magen</b></span><button type="button" onClick={() => setPostedComment("")}>Remove</button></div></div> : null}
      {mode === "context" && <div className="anomalyContext"><b>Investigate in MegaBill</b><span>AWS · AmazonEC2 · Jan 12 carried forward</span></div>}
    </article>
  );
}

export function AnomalyDetectionCanvas() {
  const [view, setView] = useState<"anatomy" | "feed">("anatomy");
  return (
    <div className="anomalyCanvas" aria-label="Anomaly card design anatomy and explorations">
      <div className="anomalyNote">
        <div><small>Design exploration</small><strong>Anatomy of an anomaly</strong></div>
        <div className="anomalyTabs" role="tablist" aria-label="Anomaly card views">
          <button type="button" role="tab" aria-selected={view === "anatomy"} className={view === "anatomy" ? "isActive" : ""} onClick={() => setView("anatomy")}>Card anatomy</button>
          <button type="button" role="tab" aria-selected={view === "feed"} className={view === "feed" ? "isActive" : ""} onClick={() => setView("feed")}>Anomalies feed</button>
        </div>
      </div>
      <div className="anomalyViews">
        <div className={`anomalyAnatomy anomalyPane ${view === "anatomy" ? "isActive" : ""}`} role="tabpanel" aria-hidden={view !== "anatomy"}>
          <p className="anomalyHoverHint">Hover over the highlighted areas to unpack the design decisions.</p>
          <div className="anomalyAnatomyCard"><AnomalyCard resetSignal={view} /></div>
        </div>
        <div className={`anomalyFeedView anomalyPane ${view === "feed" ? "isActive" : ""}`} role="tabpanel" aria-hidden={view !== "feed"}>
          <p className="anomalyFeedHint">A chronological feed keeps new cost signals scannable while preserving the context needed to act.</p>
          <div className="anomalyFeedStack">
            <AnomalyCard mode="compact" resetSignal={view} data={{ date:"Jan 13, 2023", amount:"$400", change:"3.3%", expected:"$12,100", actual:"$11,700", provider:"AWS", service:"Service: AmazonRDS", direction:"down" }} />
            <AnomalyCard mode="compact" resetSignal={view} />
            <AnomalyCard mode="compact" resetSignal={view} data={{ date:"Jan 11, 2023", amount:"$300", change:"3.8%", expected:"$7,900", actual:"$8,200", provider:"AWS", service:"Service: AmazonS3", direction:"up" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
