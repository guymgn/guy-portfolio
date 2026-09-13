"use client";

import { useState, type ReactNode, type SelectHTMLAttributes } from "react";
import { Check, ChevronDown, Copy, GripVertical, Minus, Plus, Trash2, X } from "lucide-react";

type RuleId = "application" | "staging" | "production";
type SplitAllocation = { id:number; value:string; percentage:number };
const rules: Record<RuleId, { label:string; costCenter:string; key:string; operator:string; value:string; result:string }> = {
  application:{ label:"Rule 1", costCenter:"", key:"", operator:"", value:"", result:"" },
  staging:{ label:"Rule 2", costCenter:"", key:"", operator:"", value:"", result:"" },
  production:{ label:"Rule 3", costCenter:"", key:"", operator:"", value:"", result:"" },
};
const order:RuleId[] = ["application","staging","production"];
function SelectField({children,...props}:{children:ReactNode}&SelectHTMLAttributes<HTMLSelectElement>){return <div className="virtualSelect"><select {...props}>{children}</select><ChevronDown size={16} strokeWidth={1.75} aria-hidden="true"/></div>}

const availableValues=["application","Backup","Cyera","dig","databricks-e2","it","production","staging","us-east-1"];
function MultiValueField({value,onChange,label}:{value:string;onChange:(value:string)=>void;label:string}){
  const selected=value.split(",").map((item)=>item.trim()).filter(Boolean);
  const [open,setOpen]=useState(false);
  const [draft,setDraft]=useState<string[]>(selected);
  const options=Array.from(new Set([...selected,...availableValues]));
  const toggle=(item:string)=>setDraft((current)=>current.includes(item)?current.filter((candidate)=>candidate!==item):[...current,item]);
  return <div className="multiValueField">
    <button type="button" className="multiValueTrigger" aria-label={label} aria-expanded={open} onClick={()=>{setDraft(selected);setOpen((current)=>!current)}}>
      <span className={selected.length?"valueChips":"valuePlaceholder"}>{selected.length?selected.map((item)=><span className="valueChip" key={item}>{item}<X size={12} aria-hidden="true"/></span>):"Value(s)"}</span>
      <ChevronDown size={16} strokeWidth={1.75} aria-hidden="true"/>
    </button>
    {open?<div className="multiValueMenu">
      <div className="multiValueDraft">{draft.length?draft.map((item)=><button type="button" key={item} onClick={()=>toggle(item)}>{item}<X size={12}/></button>):<span>Select one or more values</span>}</div>
      <div className="multiValueOptions">{options.map((item)=><label key={item}><input type="checkbox" checked={draft.includes(item)} onChange={()=>toggle(item)}/><span><Check size={12}/></span>{item}</label>)}</div>
      <div className="multiValueActions"><button type="button" onClick={()=>setOpen(false)}>Cancel</button><button type="button" onClick={()=>{onChange(draft.join(", "));setOpen(false)}}>Apply</button></div>
    </div>:null}
  </div>;
}

export function VirtualTagsCanvas(){
  const [activeRules,setActiveRules] = useState<RuleId[]>(["application"]);
  const [tagKey,setTagKey] = useState("Project");
  const [category,setCategory] = useState("Feature");
  const [defaultMode,setDefaultMode] = useState<"text"|"list">("text");
  const [defaultText,setDefaultText] = useState("Unmapped");
  const [defaultList,setDefaultList] = useState("Environment");
  const [ruleValues,setRuleValues] = useState<Record<RuleId,(typeof rules)[RuleId]>>({...rules});
  const [extraConditions,setExtraConditions] = useState<Partial<Record<RuleId,boolean>>>({});
  const [extraValues,setExtraValues] = useState<Partial<Record<RuleId,string>>>({});
  const [allocationMode,setAllocationMode] = useState<"standard"|"split">("standard");
  const [splitAllocations,setSplitAllocations] = useState<Record<RuleId,SplitAllocation[]>>({
    application:[{id:1,value:"R&D Production",percentage:60},{id:2,value:"R&D Staging",percentage:40}],
    staging:[{id:1,value:"Application staging",percentage:70},{id:2,value:"Shared platform",percentage:30}],
    production:[{id:1,value:"Application production",percentage:80},{id:2,value:"Shared platform",percentage:20}],
  });
  const [draggedRule,setDraggedRule] = useState<RuleId|null>(null);
  const addRule=()=>{ const next=order.find((id)=>!activeRules.includes(id)); if(next)setActiveRules((current)=>[...current,next]); };
  const removeRule=(id:RuleId)=>setActiveRules((current)=>current.filter((rule)=>rule!==id));
  const updateRule=(id:RuleId,field:keyof (typeof rules)[RuleId],value:string)=>setRuleValues((current)=>({...current,[id]:{...current[id],[field]:value}}));
  const duplicateRule=(id:RuleId)=>{const next=order.find((candidate)=>!activeRules.includes(candidate));if(!next)return;setRuleValues((current)=>({...current,[next]:{...current[id],label:rules[next].label}}));setActiveRules((current)=>{const index=current.indexOf(id);return [...current.slice(0,index+1),next,...current.slice(index+1)]})};
  const dropRule=(target:RuleId)=>{if(!draggedRule||draggedRule===target)return;setActiveRules((current)=>{const next=current.filter((id)=>id!==draggedRule);next.splice(next.indexOf(target),0,draggedRule);return next});setDraggedRule(null)};
  const updateAllocation=(ruleId:RuleId,allocationId:number,field:"value"|"percentage",value:string|number)=>setSplitAllocations((current)=>({...current,[ruleId]:current[ruleId].map((allocation)=>allocation.id===allocationId?{...allocation,[field]:value}:allocation)}));
  const addAllocation=(ruleId:RuleId)=>setSplitAllocations((current)=>{const rows=current[ruleId];const nextId=Math.max(...rows.map((row)=>row.id))+1;return {...current,[ruleId]:[...rows,{id:nextId,value:"Shared platform",percentage:0}]}});
  const removeAllocation=(ruleId:RuleId,allocationId:number)=>setSplitAllocations((current)=>({...current,[ruleId]:current[ruleId].filter((allocation)=>allocation.id!==allocationId)}));
  const hasInvalidSplit=allocationMode==="split"&&activeRules.some((id)=>splitAllocations[id].reduce((sum,row)=>sum+row.percentage,0)!==100);

  return <div className="virtualTagsCanvas" aria-label="Interactive Virtual Tags rule builder">
    <div className="virtualTagsNote"><div><small>Interactive walkthrough</small><strong>Virtual Tags rule builder</strong></div><div className="virtualModeControl"><span>Allocation mode</span><div role="group" aria-label="Allocation mode"><button type="button" aria-pressed={allocationMode==="standard"} onClick={()=>setAllocationMode("standard")}>Standard</button><button type="button" aria-pressed={allocationMode==="split"} onClick={()=>setAllocationMode("split")}>Split cost</button></div></div></div>
    <div className="virtualBuilder">
      <header><h3>Create virtual tag</h3></header>
      <div className="virtualBuilderBody">
        <section className="virtualKeySection">
          <label><span>Virtual tag key</span><input value={tagKey} onChange={(event)=>setTagKey(event.target.value)}/></label>
          <div className="virtualKeyControl"><span>Category</span><SelectField aria-label="Category" value={category} onChange={(event)=>setCategory(event.target.value)}><option>Feature</option><option>Business unit</option><option>Environment</option><option>Team</option></SelectField></div>
        </section>
        <section className="virtualRulesSection">
          <div className="virtualSectionTitle"><div><h4>Set tag rules</h4><p>Rules are evaluated from top to bottom.</p></div></div>
          <div className="virtualBuilderRules">{activeRules.map((id,index)=>{const rule=ruleValues[id];return <article key={id} draggable className={draggedRule===id?"isDragging":""} onDragStart={()=>setDraggedRule(id)} onDragEnd={()=>setDraggedRule(null)} onDragOver={(event)=>event.preventDefault()} onDrop={()=>dropRule(id)}>
            <span className="ruleDrag" aria-hidden="true"><GripVertical size={16}/></span>
            <div className="ruleCardMain"><header><span>Rule {index+1}</span></header>
            <div className="builderRuleRow"><span>Where</span>
              <SelectField aria-label={`Rule ${index+1} cost center`} value={rule.costCenter} onChange={(event)=>updateRule(id,"costCenter",event.target.value)}><option value="" disabled>Cost center</option><option>AWS</option><option>Kubernetes</option><option>Google Cloud</option><option>Snowflake</option></SelectField>
              <SelectField aria-label={`Rule ${index+1} filter key`} value={rule.key} onChange={(event)=>updateRule(id,"key",event.target.value)}><option value="" disabled>Key</option><option>Tag: project</option><option>Label: environment</option><option>Resource name</option><option>Account name</option><option>Region</option></SelectField>
              <SelectField aria-label={`Rule ${index+1} operator`} value={rule.operator} onChange={(event)=>updateRule(id,"operator",event.target.value)}><option value="" disabled>Operator</option><option>Contains</option><option>Is</option><option>Is not</option><option>Exists</option></SelectField>
              <MultiValueField label={`Rule ${index+1} values`} value={rule.value} onChange={(value)=>updateRule(id,"value",value)}/>
              <button type="button" className="addCondition" onClick={()=>setExtraConditions((current)=>({...current,[id]:!current[id]}))} aria-label={`${extraConditions[id]?"Remove":"Add"} another condition`}><Plus size={17}/></button>
            </div>
            {extraConditions[id]?<div className="builderRuleRow extraCondition"><span>And</span><SelectField aria-label={`Rule ${index+1} additional cost center`} defaultValue="AWS"><option value="" disabled>Cost center</option><option>AWS</option><option>Kubernetes</option><option>Google Cloud</option><option>Snowflake</option></SelectField><SelectField aria-label={`Rule ${index+1} additional key`} defaultValue="Region"><option value="" disabled>Key</option><option>Region</option><option>Account name</option><option>Service</option></SelectField><SelectField aria-label={`Rule ${index+1} additional operator`} defaultValue="Is"><option value="" disabled>Operator</option><option>Is</option><option>Is not</option><option>Contains</option></SelectField><MultiValueField label={`Rule ${index+1} additional values`} value={extraValues[id]??"us-east-1"} onChange={(value)=>setExtraValues((current)=>({...current,[id]:value}))}/><button type="button" className="removeCondition" onClick={()=>setExtraConditions((current)=>({...current,[id]:false}))} aria-label={`Remove Rule ${index+1} additional condition`}><X size={17}/></button></div>:null}
            {allocationMode==="standard"?<div className="builderRuleRow builderThenRow"><span>Then</span><input aria-label={`Rule ${index+1} result`} placeholder="Result" value={rule.result} onChange={(event)=>updateRule(id,"result",event.target.value)}/></div>:<div className="splitAllocationGroup">
              {splitAllocations[id].map((allocation,allocationIndex)=><div className="builderRuleRow builderSplitRow" key={allocation.id}><span>Then</span><SelectField aria-label={`Rule ${index+1} split destination ${allocationIndex+1}`} value={allocation.value} onChange={(event)=>updateAllocation(id,allocation.id,"value",event.target.value)}><option>R&amp;D Production</option><option>R&amp;D Staging</option><option>Shared platform</option><option>Application</option></SelectField><label><input type="number" min="0" max="100" aria-label={`Rule ${index+1} split percentage ${allocationIndex+1}`} value={allocation.percentage} onChange={(event)=>updateAllocation(id,allocation.id,"percentage",Number(event.target.value))}/><span>%</span></label>{allocationIndex===0?<button type="button" onClick={()=>addAllocation(id)} aria-label={`Add Rule ${index+1} split destination`}><Plus size={17}/></button>:<button type="button" onClick={()=>removeAllocation(id,allocation.id)} aria-label={`Remove Rule ${index+1} split destination ${allocationIndex+1}`}><Minus size={17}/></button>}</div>)}
              {(()=>{const total=splitAllocations[id].reduce((sum,row)=>sum+row.percentage,0);return <div className={`splitAllocationStatus ${total===100?"isComplete":total>100?"isInvalid":""}`}>{total>100?<span>Allocation exceeds 100% by {total-100}%.</span>:total===100?<span><Check size={14}/> 100% allocated</span>:<><span>{total}% allocated · {100-total}% remaining</span><SelectField aria-label={`Rule ${index+1} remainder allocation`} defaultValue="Ratio split"><option>Ratio split</option><option>Even split</option><option>Leave untagged</option></SelectField></>}</div>})()}
            </div>}
            </div>
            <div className="ruleTools"><button type="button" onClick={()=>duplicateRule(id)} disabled={activeRules.length===order.length} aria-label={`Duplicate Rule ${index+1}`}><Copy size={15}/></button><button type="button" onClick={()=>removeRule(id)} disabled={activeRules.length===1} aria-label={`Delete Rule ${index+1}`}><Trash2 size={15}/></button></div>
          </article>})}</div>
          <div className="virtualRuleActions"><button type="button" onClick={addRule} disabled={activeRules.length===order.length}>+ Add rule</button></div>
        </section>
        <section className="virtualDefaultSection"><div><h4>Set default value</h4><p>Write down free text or choose from a list.</p></div><div className="virtualDefaultChoices">
          <label><input type="radio" name="default-value" checked={defaultMode==="text"} onChange={()=>setDefaultMode("text")}/><input aria-label="Default free-text value" value={defaultText} disabled={defaultMode!=="text"} onChange={(event)=>setDefaultText(event.target.value)}/></label>
          <label><input type="radio" name="default-value" checked={defaultMode==="list"} onChange={()=>setDefaultMode("list")}/><SelectField aria-label="Default value list" value={defaultList} disabled={defaultMode!=="list"} onChange={(event)=>setDefaultList(event.target.value)}><option>Environment</option><option>Account name</option><option>Service</option></SelectField></label>
        </div></section>
      </div>
      <footer><button type="button">Cancel</button><button type="button" disabled={hasInvalidSplit}>Apply virtual tag</button></footer>
    </div>
  </div>;
}
