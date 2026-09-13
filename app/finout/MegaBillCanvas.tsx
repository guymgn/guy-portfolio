"use client";

import { useMemo, useState } from "react";

type Group = "Service, sub-service, resource type" | "Account, service" | "Cost center, service";
type CostRow = { name: string; total: number; previous: number };

const rootGroups: Record<Group, CostRow[]> = {
  "Service, sub-service, resource type": [
    { name: "AWS Services", total: 72800, previous: 70200 },
    { name: "Google Cloud Services", total: 14600, previous: 15100 },
    { name: "Kubernetes", total: 4700, previous: 4300 },
    { name: "Snowflake", total: 2700, previous: 2500 },
  ],
  "Account, service": [
    { name: "Production", total: 49800, previous: 46100 },
    { name: "Data platform", total: 27300, previous: 28100 },
    { name: "Development", total: 14100, previous: 13500 },
    { name: "Shared services", total: 3600, previous: 4100 },
  ],
  "Cost center, service": [
    { name: "Core product", total: 42100, previous: 39800 },
    { name: "Data", total: 28600, previous: 29100 },
    { name: "Customer environments", total: 18400, previous: 17300 },
    { name: "Internal", total: 5700, previous: 5600 },
  ],
};

const drillLayers: Record<string, CostRow[]> = {
  "AWS Services": [
    { name: "AmazonEC2", total: 48100, previous: 45400 },
    { name: "AmazonRDS", total: 11700, previous: 12100 },
    { name: "AmazonS3", total: 8200, previous: 7900 },
    { name: "AWS Lambda", total: 4800, previous: 4800 },
  ],
  AmazonEC2: [
    { name: "EC2 - Compute", total: 36600, previous: 34200 },
    { name: "EBS - Storage", total: 6500, previous: 6800 },
    { name: "EC2 - NAT Gateway transfer", total: 3200, previous: 2900 },
    { name: "EC2 - Other", total: 1800, previous: 1500 },
  ],
  "EC2 - Compute": [
    { name: "r6g.16xlarge", total: 16700, previous: 14900 },
    { name: "m6i.8xlarge", total: 9300, previous: 8800 },
    { name: "c6i.4xlarge", total: 6100, previous: 6500 },
    { name: "Other resource types", total: 4500, previous: 4000 },
  ],
};

const fallbackLayers: Record<number, CostRow[]> = {
  1: [
    { name: "Compute", total: 36100, previous: 34200 },
    { name: "Storage", total: 24700, previous: 25100 },
    { name: "Data services", total: 19300, previous: 18100 },
    { name: "Networking", total: 14700, previous: 15100 },
  ],
  2: [
    { name: "Core usage", total: 33700, previous: 31800 },
    { name: "Reserved capacity", total: 26400, previous: 26900 },
    { name: "Data transfer", total: 18900, previous: 17700 },
    { name: "Other usage", total: 15800, previous: 16100 },
  ],
  3: [
    { name: "Large resources", total: 31200, previous: 29400 },
    { name: "Medium resources", total: 27300, previous: 28100 },
    { name: "Small resources", total: 20900, previous: 19600 },
    { name: "Other resources", total: 15400, previous: 15400 },
  ],
};

const resources = [
  { id: "data-streamer-xyz", accountId: "F5G6H7I8J", account: "Production", type: "r6g.16xlarge", savings: 120789, cost: 92500 },
  { id: "workflow-engine-v3", accountId: "P3Q4R5S6T", account: "Production", type: "r6g.16xlarge", savings: 110245, cost: 110000 },
  { id: "analytics-db-prod-01", accountId: "E5F6G7H8I", account: "Data platform", type: "r6g.16xlarge", savings: 88901, cost: 102400 },
  { id: "reporting-db-v2", accountId: "J9K0L1M2N", account: "Data platform", type: "r6g.16xlarge", savings: 130000, cost: 76500 },
  { id: "cloudflow-processor-01", accountId: "A1B2C3D4E", account: "Production", type: "r6g.16xlarge", savings: 85432, cost: 85500 },
];

const money = (value: number) => `$${value.toLocaleString("en-US")}`;

function ChevronRight() {
  return <svg className="megaChevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>;
}

export function MegaBillCanvas() {
  const [groupBy, setGroupBy] = useState<Group>("Service, sub-service, resource type");
  const [provider, setProvider] = useState("All providers");
  const [range, setRange] = useState("Last 30 days");
  const [path, setPath] = useState<string[]>([]);
  const [chartExpanded, setChartExpanded] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const current = path[path.length - 1];
  const atResources = path.length >= 4;
  const rows = current ? (drillLayers[current] || fallbackLayers[path.length] || []) : rootGroups[groupBy];
  const total = rows.reduce((sum, row) => sum + row.total, 0);
  const queryTotal = rootGroups[groupBy].reduce((sum, row) => sum + row.total, 0);
  const rootColumnLabel = groupBy.split(",")[0];
  const bars = useMemo(() => [62,44,55,45,78,43,66,52,53,57,50,77,53,57,51,78,52,47,63,46,54,61,47,61,63,49,68,48,55,59], []);
  const hoveredTotal = hoveredBar === null ? 0 : Math.round(9000 + bars[hoveredBar] * 210);
  const resetPath = () => { setPath([]); setChartExpanded(false); };
  const openRow = (name: string) => { if (path.length < 4) { setChartExpanded(true); setPath((value) => [...value, name]); } };

  return (
    <div className="megaCanvas" aria-label="Interactive Finout MegaBill walkthrough">
      <div className="megaNote"><div><small>Interactive walkthrough</small><strong>MegaBill investigation</strong></div><p>Group cloud spend and drill from the total cost to the resources behind it.</p></div>
      <div className="megaApp">
        <div className="megaToolbar">
          <div className="megaControls">
            <label>Provider<select value={provider} onChange={(event) => { setProvider(event.target.value); resetPath(); }}><option>All providers</option><option>AWS</option><option>Google Cloud</option><option>Snowflake</option></select></label>
            <label>Group by<select value={groupBy} onChange={(event) => { setGroupBy(event.target.value as Group); resetPath(); }}><option>Service, sub-service, resource type</option><option>Account, service</option><option>Cost center, service</option></select></label>
            <label>Period<select value={range} onChange={(event) => setRange(event.target.value)}><option>Last 30 days</option><option>Last 7 days</option><option>Current month</option></select></label>
          </div>
          <button type="button" className="megaClear" onClick={() => { setProvider("All providers"); setGroupBy("Service, sub-service, resource type"); setRange("Last 30 days"); resetPath(); }}>Clear</button>
        </div>
        <div className="megaSurface">
          <div className="megaMetrics">
            <div><small>Query total cost</small><strong>{money(queryTotal)}</strong></div><div><small>Share of total cost</small><strong>100%</strong></div><div><small>Avg. daily cost</small><strong>{money(Math.round(queryTotal / (range === "Last 7 days" ? 7 : 30)))}</strong></div><div><small>Potential savings</small><strong>$10,309</strong></div>
          </div>
          <div className="megaCrumbs" role="navigation" aria-label="MegaBill drill-down path">
            <button type="button" onClick={resetPath}>MegaBill</button>
            {path.map((item,index) => <span className="megaCrumbStep" key={`${item}-${index}`}><ChevronRight/><button type="button" className={index===path.length-1?"isCurrent":""} onClick={() => setPath(path.slice(0,index+1))}>{index===3?<>Resources for <b>{item}</b></>:item}</button></span>)}
          </div>
          {atResources ? (
            <div className="megaResources"><div className="megaTableWrap"><table className="megaResourceTable"><colgroup><col/><col/><col/><col/><col/><col/></colgroup><thead><tr><th>Resource ID</th><th>Account ID</th><th>Account Name</th><th>Resource Type</th><th>Potential Savings</th><th>Cost</th></tr></thead><tbody>{resources.map((row)=><tr key={row.id}><td><b>{row.id}</b></td><td>{row.accountId}</td><td>{row.account}</td><td>{row.type}</td><td className="costDown">{money(row.savings)}</td><td>{money(row.cost)}</td></tr>)}</tbody></table></div></div>
          ) : <>
            <div className="megaChart" aria-label={`Cost chart at ${current||groupBy} level`}>
              <div className="megaYAxis"><span>$30k</span><span>$20k</span><span>$10k</span><span>$0</span></div>
              <div className={`megaBars ${hoveredBar!==null?"hasHover":""}`}>
                {bars.map((height,index)=><div key={index} className={`megaBar ${hoveredBar===index?"isHovered":""}`} onMouseEnter={()=>setHoveredBar(index)} onMouseLeave={()=>setHoveredBar(null)}>{chartExpanded||path.length>0?rows.slice(0,3).map((row,segmentIndex)=>{const portions=[.48,.2,.32];return <button key={row.name} type="button" className={`megaSegment segment${segmentIndex+1}`} style={{height:`${height*portions[segmentIndex]}%`}} aria-label={`${row.name}, ${[35,18,47][segmentIndex]}%. Open next level`} onFocus={()=>setHoveredBar(index)} onBlur={()=>setHoveredBar(null)} onClick={()=>openRow(row.name)}/>}):<button type="button" className="megaSegment megaTotalSegment" style={{height:`${height}%`}} aria-label={`Day ${index+1}, ${money(hoveredTotal || Math.round(9000+height*210))}. Show grouped breakdown`} onFocus={()=>setHoveredBar(index)} onBlur={()=>setHoveredBar(null)} onClick={()=>setChartExpanded(true)}/>}</div>)}
                {hoveredBar!==null?<div className="megaTooltip" style={{left:`${Math.min(82,Math.max(18,((hoveredBar+.5)/bars.length)*100))}%`}} role="tooltip">
                  {chartExpanded||path.length>0?rows.slice(0,3).map((row,index)=><span key={row.name}><i className={`tooltipTone tone${index+1}`}/><b>{row.name}</b><em>{money(Math.round(hoveredTotal*[.35,.18,.47][index]))} ({[35,18,47][index]}%)</em></span>):null}
                  <span className={chartExpanded||path.length>0?"tooltipTotal":""}><i className="tooltipTone"/><b>Total</b><em>{money(hoveredTotal)}</em></span>
                </div>:null}
              </div>
            </div>
            <div className="megaLegend">{chartExpanded||path.length>0?rows.slice(0,3).map((row,index)=><span key={row.name}><i className={`legendTone tone${index+1}`}/>{row.name}</span>):<span><i className="legendTone total"/>Total</span>}</div>
            <p className="megaDrillHint">Select a highlighted row to open the next configured dimension.</p>
            <div className="megaTableWrap"><table className="megaGroupTable"><colgroup><col/><col/><col/><col/><col/></colgroup><thead><tr><th>{current?"Name":rootColumnLabel}</th><th>Total</th><th>Previous period</th><th>Change</th><th>Percentage</th></tr></thead><tbody>{rows.map((row)=>{const change=((row.total-row.previous)/row.previous)*100;return <tr key={row.name} className="isDrillable" tabIndex={0} onClick={()=>openRow(row.name)} onKeyDown={(event)=>{if(event.key==="Enter"||event.key===" ")openRow(row.name);}}><td><b>{row.name}</b></td><td>{money(row.total)}</td><td>{money(row.previous)}</td><td className={change>=0?"costUp":"costDown"}>{change>=0?"▲":"▼"} {Math.abs(change).toFixed(1)}%</td><td>{Math.round((row.total/total)*100)}%</td></tr>})}</tbody></table></div>
          </>}
        </div>
      </div>
    </div>
  );
}
