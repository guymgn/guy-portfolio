"use client";

import { Box, ChevronDown, ChevronRight, Database, Folder, Globe, MoreHorizontal, Search, Share2, X } from "lucide-react";
import { useMemo, useState } from "react";

type Scope = "Project" | "Repository" | "Artifact";
type Status = "Mixed" | "Blocked" | "Pending" | "Approved";

type Row = {
  id: string;
  parent?: string;
  depth: 0 | 1 | 2;
  name: string;
  type: Scope | "Docker image" | "Pickle model";
  environment: "Production" | "Staging" | "Dev" | "Sandbox";
  status: Status;
  content?: string;
  count?: string;
};

const initialRows: Row[] = [
  { id:"mobile-prod", depth:0, name:"mobile-banking-prod", type:"Project", environment:"Production", status:"Mixed", count:"3 artifacts" },
  { id:"banking-services", parent:"mobile-prod", depth:1, name:"banking-services-repo", type:"Repository", environment:"Production", status:"Mixed", count:"2" },
  { id:"banking-api-241", parent:"banking-services", depth:2, name:"banking-api:v2.4.1", type:"Docker image", environment:"Production", status:"Blocked", content:"/app/models/vgg16_light_a.pt" },
  { id:"banking-api-242", parent:"banking-services", depth:2, name:"banking-api:v2.4.2", type:"Docker image", environment:"Staging", status:"Pending", content:"/app/models/vgg16_light_a.pt" },
  { id:"payments-infra", parent:"mobile-prod", depth:1, name:"payments-infra-repo", type:"Repository", environment:"Production", status:"Pending", count:"1" },
  { id:"payments-processor", parent:"payments-infra", depth:2, name:"payments-processor:v3.1.2", type:"Docker image", environment:"Production", status:"Pending", content:"/usr/local/lib/models/vgg16_light_a.pt" },
  { id:"mobile-dev", depth:0, name:"mobile-banking-dev", type:"Project", environment:"Dev", status:"Pending", count:"1 artifact" },
  { id:"research-cache", parent:"mobile-dev", depth:1, name:"research-cache-repo", type:"Repository", environment:"Sandbox", status:"Pending", count:"1" },
  { id:"experiment", parent:"research-cache", depth:2, name:"vgg16_exp_v2.pkl", type:"Pickle model", environment:"Sandbox", status:"Pending", content:"/downloads/vgg16_exp.pkl" },
  { id:"migration", depth:0, name:"cloud-migration-project", type:"Project", environment:"Staging", status:"Pending", count:"2 artifacts" },
  { id:"migration-repo", parent:"migration", depth:1, name:"migration-repo", type:"Repository", environment:"Staging", status:"Pending", count:"2" },
  { id:"service-proxy", parent:"migration-repo", depth:2, name:"service-proxy:v1.0.0", type:"Docker image", environment:"Staging", status:"Pending", content:"/opt/models/vgg16_light_a.pt" },
  { id:"data-processor", parent:"migration-repo", depth:2, name:"data-processor:v0.9.0", type:"Docker image", environment:"Staging", status:"Pending", content:"/opt/models/vgg16_light_a.pt" },
  { id:"legacy", depth:0, name:"legacy-systems-vault", type:"Project", environment:"Staging", status:"Blocked", count:"1 artifact" },
  { id:"primary-vault", parent:"legacy", depth:1, name:"primary-vault", type:"Repository", environment:"Staging", status:"Blocked", count:"1" },
  { id:"legacy-wrapper", parent:"primary-vault", depth:2, name:"legacy-model-wrapper", type:"Docker image", environment:"Staging", status:"Blocked", content:"/var/lib/models/vgg16_light_a.pt" },
];

const impactedArtifacts = [
  { risk:"High impact · Production", path:"mobile-banking-prod / banking-services-repo /", name:"banking-api:v2.4.1" },
  { risk:"High impact · Production", path:"mobile-banking-prod / payments-infra-repo /", name:"payments-processor:v3.1.2" },
  { risk:"Medium impact · Staging", path:"mobile-banking-prod / banking-services-repo /", name:"banking-api:v2.4.2" },
  { risk:"Medium impact · Staging", path:"cloud-migration-project / migration-repo /", name:"service-proxy:v1.0.0" },
  { risk:"Medium impact · Staging", path:"cloud-migration-project / migration-repo /", name:"data-processor:v0.9.0" },
  { risk:"Medium impact · Staging", path:"legacy-systems-vault / primary-vault /", name:"legacy-model-wrapper" },
  { risk:"Low impact · Experimental", path:"mobile-banking-dev / research-cache-repo /", name:"vgg16_exp_v2.pkl" },
];

export function GovernanceArtifact() {
  const [query,setQuery] = useState("");
  const [expanded,setExpanded] = useState(() => new Set(["mobile-prod","banking-services","payments-infra","mobile-dev","research-cache","migration","migration-repo","legacy","primary-vault"]));
  const [hovered,setHovered] = useState<string | null>(null);
  const [rowStatuses,setRowStatuses] = useState<Record<string,Status>>({});
  const [confirming,setConfirming] = useState(false);
  const [drawerClosing,setDrawerClosing] = useState(false);
  const [globallyBlocked,setGloballyBlocked] = useState(false);
  const [impactQuery,setImpactQuery] = useState("");
  const [blockReason,setBlockReason] = useState("");

  const rows = useMemo(() => {
    if (globallyBlocked) return initialRows.map(row => ({...row,status:"Blocked" as Status}));
    const childrenByParent = new Map<string,Row[]>();
    initialRows.forEach(row => {
      if (!row.parent) return;
      childrenByParent.set(row.parent,[...(childrenByParent.get(row.parent) ?? []),row]);
    });
    const resolved = new Map<string,Status>();
    const resolveStatus = (row:Row):Status => {
      const cached = resolved.get(row.id);
      if (cached) return cached;
      const children = childrenByParent.get(row.id) ?? [];
      const status = children.length
        ? (() => {
            const childStatuses = children.map(resolveStatus);
            return childStatuses.every(childStatus => childStatus===childStatuses[0]) ? childStatuses[0] : "Mixed";
          })()
        : rowStatuses[row.id] ?? row.status;
      resolved.set(row.id,status);
      return status;
    };
    return initialRows.map(row => ({...row,status:resolveStatus(row)}));
  }, [globallyBlocked,rowStatuses]);
  const visibleRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (normalized) return rows.filter(row => `${row.name} ${row.type} ${row.environment} ${row.content ?? ""}`.toLowerCase().includes(normalized));
    const byId = new Map(rows.map(row => [row.id,row]));
    return rows.filter(row => {
      let parent = row.parent;
      while (parent) {
        if (!expanded.has(parent)) return false;
        parent = byId.get(parent)?.parent;
      }
      return true;
    });
  },[expanded,query,rows]);
  const toggle = (id:string) => setExpanded(current => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const isDescendantOf = (row:Row,ancestorId:string) => {
    let parent = row.parent;
    while (parent) {
      if (parent===ancestorId) return true;
      parent = initialRows.find(item=>item.id===parent)?.parent;
    }
    return false;
  };
  const applyToBranch = (id:string,status:Status) => setRowStatuses(current => {
    const next = {...current};
    initialRows.forEach(row => { if (row.id===id || isDescendantOf(row,id)) next[row.id]=status; });
    return next;
  });
  const visibleImpacts = impactedArtifacts.filter(item => `${item.path} ${item.name} ${item.risk}`.toLowerCase().includes(impactQuery.trim().toLowerCase()));
  const openDrawer = () => { setDrawerClosing(false); setConfirming(true); };
  const closeDrawer = () => setDrawerClosing(true);
  const finishClosingDrawer = () => {
    if (!drawerClosing) return;
    setConfirming(false);
    setDrawerClosing(false);
    setImpactQuery("");
    setBlockReason("");
  };

  return (
    <div className="governanceInteractiveCanvas" aria-label="Interactive Shadow AI governance walkthrough">
      <div className="governanceArtifactNote"><div><small>Interactive walkthrough</small><strong>Shadow AI governance</strong></div></div>
      <div className="governanceCompactApp">
        <header className="governanceCompactOverview">
          <div><small>Detected model</small><h3>dbalencar / <strong>vgg16_light_a</strong></h3></div>
          <div className="governanceCompactActions">
            <button type="button" className="isPrimary" onClick={openDrawer}><Globe/>Block globally</button>
            <button type="button">Manage</button>
            <button type="button" className="isIcon" aria-label="More actions"><MoreHorizontal/></button>
            <button type="button" className="isIcon" aria-label="Share model"><Share2/></button>
          </div>
        </header>
        <div className="governanceCompactSummary">
          <div><span>Security risk</span><strong className="isRisk">High</strong></div><div><span>Total reach</span><strong>7 artifacts / 4 projects</strong></div><div><span>First detected</span><strong>June 2, 2026</strong></div><div><span>Origin</span><strong>Hugging Face</strong></div>
        </div>
        <div className="governanceCompactBody hasDetails">
          <section className="governanceCompactTriage">
            <div className="governanceTriageHead governanceCompactToolbar"><h4>Governance triage</h4><label><Search/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search within scope..." /></label></div>
            <div className="governanceTree">
              <div className="governanceTreeHead"><span aria-hidden="true" /><span>Scope / name</span><span>Type</span><span>Environment</span><span>Status</span><span>Content</span></div>
              {visibleRows.map(row => {
                const hasChildren = rows.some(item=>item.parent===row.id);
                const Icon = row.depth===0?Folder:row.depth===1?Database:Box;
                const inHoveredBranch = hovered ? isDescendantOf(row,hovered) : false;
                return <div role={hasChildren?"button":undefined} tabIndex={hasChildren?0:undefined} aria-expanded={hasChildren ? expanded.has(row.id) : undefined} className={`governanceTreeRow depth${row.depth} ${hovered===row.id?"isHovered":""} ${inHoveredBranch?"isInHoveredBranch":""}`} key={row.id} onMouseEnter={()=>setHovered(row.id)} onMouseLeave={()=>setHovered(null)} onClick={()=>{if(hasChildren)toggle(row.id);}} onKeyDown={event=>{if(hasChildren&&(event.key==="Enter"||event.key===" ")){event.preventDefault();toggle(row.id);}}}>
                  <b>{hasChildren?(expanded.has(row.id)?<ChevronDown/>:<ChevronRight/>):null}</b>
                  <strong><Icon/>{row.name}{row.count&&<small>{row.count}</small>}</strong><span className="governanceRowType">{row.type}</span><span className="governanceRowEnvironment" data-environment={row.environment}>{row.environment}</span><i className={`is${row.status}`}>{row.status}</i>
                  <div className="governanceContentCell"><code>{row.content}</code>{hovered===row.id?<div className="governanceRowActions"><button type="button" onClick={event=>{event.stopPropagation();applyToBranch(row.id,"Approved");}}>Approve</button><button type="button" onClick={event=>{event.stopPropagation();applyToBranch(row.id,"Blocked");}}>Block</button></div>:null}</div>
                </div>;
              })}
              {visibleRows.length===0&&<p className="governanceEmpty">No matching locations</p>}
            </div>
          </section>

          <aside className="governanceCompactDetails">
            <small>Model details</small><h4>dbalencar / vgg16_light_a</h4>
            <section><small>Model identity</small><dl><div><dt>Owner</dt><dd>dbalencar</dd></div><div><dt>Origin</dt><dd>Hugging Face</dd></div><div><dt>License</dt><dd>Unknown</dd></div><div><dt>Version</dt><dd>Unknown</dd></div></dl></section>
            <section><small>Security scan</small><dl><div><dt>Threat type</dt><dd>Pickle de-serialization attack</dd></div><div><dt>Detected in</dt><dd>Layer 4</dd></div><div><dt>Scanner</dt><dd>ML-Scan Engine</dd></div></dl></section>
            <section><small>Usage context</small><dl><div><dt>First discovery</dt><dd>June 2, 2026</dd></div><div><dt>Primary consumer</dt><dd>Mobile Banking Team</dd></div><div><dt>Instances</dt><dd>7 artifacts</dd></div></dl></section>
            <section><small>Technical specs</small><dl><div><dt>Architecture</dt><dd>VGG-16</dd></div><div><dt>Framework</dt><dd>PyTorch</dd></div><div><dt>Size</dt><dd>528MB</dd></div><div><dt>Checksum</dt><dd>sha256:a1b2c3d4...</dd></div></dl></section>
          </aside>
        </div>
        {confirming && <div className={`governanceDrawerLayer${drawerClosing ? " isClosing" : ""}`}>
          <button className="governanceDrawerScrim" type="button" aria-label="Close global block drawer" onClick={closeDrawer} />
          <aside className="governanceBlockDrawer" role="dialog" aria-modal="true" aria-labelledby="global-block-title" onAnimationEnd={finishClosingDrawer}>
            <header><div><h3 id="global-block-title">Confirm global block</h3><p>You are about to block <strong>vgg16_light_a</strong> across all projects. This may disrupt active production deployments.</p></div><button type="button" aria-label="Close drawer" onClick={closeDrawer}><X /></button></header>
            <div className="governanceImpactStats"><div><span>Projects</span><strong>4</strong><small>affected</small></div><div><span>Repositories</span><strong>5</strong><small>affected</small></div><div><span>Artifacts</span><strong>7</strong><small>affected</small></div><div><span>Downtime risk</span><strong>High</strong><small>production</small></div></div>
            <label className="governanceImpactSearch"><Search/><input value={impactQuery} onChange={event=>setImpactQuery(event.target.value)} placeholder="Search affected artifacts..." /></label>
            <div className="governanceImpactGroups">
              {["High impact · Production","Medium impact · Staging","Low impact · Experimental"].map(group => {
                const groupItems = visibleImpacts.filter(item=>item.risk===group);
                if (!groupItems.length) return null;
                const environment = group.includes("Production") ? "Production" : group.includes("Staging") ? "Staging" : "Sandbox";
                return <section key={group} data-environment={environment}><h4>{group}</h4>{groupItems.map(item=><article key={item.name}><small>{item.path}</small><strong>{item.name}</strong></article>)}</section>;
              })}
              {!visibleImpacts.length&&<p className="governanceImpactEmpty">No affected artifacts match your search.</p>}
            </div>
            <footer><label><span>Reason for action <b>*</b> <small>Required for audit log</small></span><textarea value={blockReason} onChange={event=>setBlockReason(event.target.value)} placeholder="e.g. Blocking an unapproved AI model under security policy" /></label><div><button type="button" onClick={closeDrawer}>Cancel</button><button type="button" className="isDanger" disabled={!blockReason.trim()} onClick={()=>{setGloballyBlocked(true);closeDrawer();}}>Block globally</button></div></footer>
          </aside>
        </div>}
      </div>
    </div>
  );
}
