"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type GroupFeature = { id: string; name: string; type: "boolean" | "enum" | "metered" };

const catalog: GroupFeature[] = [
  { id: "feature-localizedaccess", name: "Support level", type: "enum" },
  { id: "feature-surgeprotection", name: "Surge protection", type: "boolean" },
  { id: "feature-bandwidth", name: "Bandwidth", type: "metered" },
  { id: "feature-dataencryption", name: "Data encryption", type: "boolean" },
  { id: "feature-userauthentication", name: "User authentication", type: "boolean" },
  { id: "feature-realtimemonitoring", name: "Real-time monitoring", type: "boolean" },
  { id: "feature-cms", name: "CMS", type: "metered" },
  { id: "feature-countries-access", name: "Countries access", type: "enum" },
];

const iconFor = (type: GroupFeature["type"]) => `/stigg/feature-groups/${type}.svg`;

function SelectChevron() {
  return <svg className="stiggSelectChevron featureGroupChevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>;
}

const planFeatures = [
  { id: "cms", name: "CMS", type: "boolean" as const, groupValue: "Access granted", planA: "Access granted", planB: "Access granted", interactive: false },
  { id: "bandwidth", name: "Bandwidth", type: "metered" as const, groupValue: "Show values", planA: "3 GB / month", planB: "5 GB / month", interactive: true },
  { id: "surgeprotection", name: "Surge protection", type: "boolean" as const, groupValue: "Access granted", planA: "Access granted", planB: "Access granted", interactive: false },
  { id: "cdn", name: "CDN Access", type: "enum" as const, groupValue: "Show values", planA: ["Seattle, USA", "Chicago, USA", "Montreal, Canada"], planB: ["Seattle, USA", "Chicago, USA", "Montreal, Canada", "London, United Kingdom", "Tokyo, Japan"], interactive: true },
  { id: "sso", name: "SSO Access", type: "boolean" as const, groupValue: "Access granted", planA: "Access granted", planB: "Access granted", interactive: false },
];

function FeatureGroupPlans() {
  const [activeId, setActiveId] = useState("cdn");
  const active = planFeatures.find((feature) => feature.id === activeId) ?? planFeatures[0];

  const renderPlan = (label: string, value: string | string[]) => <article aria-label={label}>
    <span className="featurePlanOverride">Plan-specific value</span>
    <header><img src={iconFor(active.type)} alt="" /><span><strong>{active.name}</strong><small>feature-{active.id}</small></span><em>{Array.isArray(value) ? `${value.length} Values` : value}</em></header>
    {Array.isArray(value) ? <div className="featurePlanValues">{value.map((item) => <div key={item}><span>{item}</span><small>{item.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}</small></div>)}</div> : <div className="featurePlanSingleValue"><span>Entitlement value</span><strong>{value}</strong></div>}
  </article>;

  return <div className="featureGroupPlans">
    <div className="featureGroupSource">
      <header><img src="/stigg/feature-groups/enum.svg" alt="" /><span><strong>Hosting</strong><small>feature-group-hosting</small></span><i>⌄</i></header>
      <div>{planFeatures.map((feature) => <button type="button" key={feature.id} className={`${active.id === feature.id ? "isActive " : ""}${feature.interactive ? "isInteractive" : ""}`} onClick={() => feature.interactive && setActiveId(feature.id)} disabled={!feature.interactive}>
        <img src={iconFor(feature.type)} alt="" /><span><strong>{feature.name}</strong><small>feature-{feature.id}</small></span><em>{feature.groupValue}</em><i>{feature.interactive ? "›" : ""}</i>
      </button>)}</div>
    </div>
    <div className="featureGroupPlanResults" key={activeId}>
      {renderPlan("Plan A", active.planA)}
      {renderPlan("Plan B", active.planB)}
    </div>
  </div>;
}

export function FeatureGroupCanvas() {
  const [step, setStep] = useState<1 | 2>(1);
  const [transition, setTransition] = useState<"idle" | "out" | "in">("idle");
  const transitionTimers = useRef<number[]>([]);
  const [name, setName] = useState("Hosting");
  const [descriptionOpen, setDescriptionOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<GroupFeature[]>(catalog.slice(0, 3));
  const id = `feature-group-${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "new-group"}`;
  const available = useMemo(() => catalog.filter((feature) => !selected.some((item) => item.id === feature.id) && `${feature.name} ${feature.id}`.toLowerCase().includes(query.toLowerCase())), [query, selected]);

  useEffect(() => () => transitionTimers.current.forEach(window.clearTimeout), []);

  const selectStep = (nextStep: 1 | 2) => {
    if (nextStep === step || transition !== "idle") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(nextStep);
      return;
    }
    setTransition("out");
    transitionTimers.current.push(window.setTimeout(() => {
      setStep(nextStep);
      setTransition("in");
      transitionTimers.current.push(window.setTimeout(() => setTransition("idle"), 220));
    }, 160));
  };

  const addFeature = (feature: GroupFeature) => {
    setSelected((items) => [...items, feature]);
    setQuery("");
    setSearchOpen(false);
  };

  return (
    <div className="featureGroupCanvas">
      <div className="createFeatureNote featureGroupNote">
        <small>Try the flow</small>
        <div className="featureGroupSteps">
          <button type="button" className={step === 1 ? "isActive" : ""} onClick={() => selectStep(1)}><i>1</i><span><strong>Create a Feature Group</strong><small>Add reusable features from the catalog.</small></span></button>
          <button type="button" className={step === 2 ? "isActive" : ""} onClick={() => selectStep(2)}><i>2</i><span><strong>Configure it per plan</strong><small>Compare entitlement values across plan tiers.</small></span></button>
        </div>
      </div>
      {step === 1 ? <div className={`featureGroupDrawer featureGroupStage is-${transition}`}>
        <header><h3>Create new feature group</h3><img src="/stigg/feature-groups/close.svg" alt="" /></header>
        <div className="featureGroupBody">
          <label className="createFeatureField"><span>Name</span><input value={name} onChange={(event) => setName(event.target.value)} /></label>
          <label className="createFeatureField"><span>ID</span><input value={id} readOnly /></label>
          {!descriptionOpen ? <button className="featureGroupAddDescription" type="button" onClick={() => setDescriptionOpen(true)}>＋ Add description</button> : <label className="createFeatureField"><span>Description <small>Optional</small></span><input defaultValue="Features shared across hosting plans" placeholder="Describe this feature group" /></label>}

          <div className="featureGroupSearch">
            <span>Features</span>
            <div className={searchOpen ? "featureGroupSearchControl isOpen" : "featureGroupSearchControl"}>
              <img src="/stigg/feature-groups/search.svg" alt="" />
              <input value={query} onChange={(event) => { setQuery(event.target.value); setSearchOpen(true); }} onFocus={() => setSearchOpen(true)} placeholder="Search by feature name or ID" aria-expanded={searchOpen} />
              <button className="featureGroupSearchToggle" type="button" onClick={() => setSearchOpen((open) => !open)} aria-label={searchOpen ? "Close feature dropdown" : "Open feature dropdown"} aria-expanded={searchOpen}><SelectChevron /></button>
            </div>
            {searchOpen && <div className="featureGroupMenu">
              {available.length ? available.slice(0, 5).map((feature) => <button type="button" key={feature.id} onClick={() => addFeature(feature)}>
                <img src={iconFor(feature.type)} alt="" /><span><strong>{feature.name}</strong><small>{feature.id}</small></span>
              </button>) : <p>No matching features</p>}
            </div>}
          </div>

          <div className="featureGroupSelected">
            {selected.map((feature) => <div className="featureGroupCard" key={feature.id}>
              <img src={iconFor(feature.type)} alt="" />
              <span><strong>{feature.name}</strong><small>{feature.id}</small></span>
              <button type="button" onClick={() => setSelected((items) => items.filter((item) => item.id !== feature.id))} aria-label={`Remove ${feature.name}`}><img src="/stigg/feature-groups/trash.svg" alt="" /></button>
            </div>)}
          </div>
        </div>
      </div> : <div className={`featureGroupStage is-${transition}`}><FeatureGroupPlans /></div>}
    </div>
  );
}
