"use client";

import { useState } from "react";
import { Check, Copy, Eye, KeyRound, Plus, RotateCcw, RotateCw } from "lucide-react";

const windows = ["1 hour", "24 hours", "3 days", "7 days"] as const;
const accessLevels = ["None", "Read", "Manage"] as const;
const resources = [
  ["Detected models", "Model records, provenance and scan status"],
  ["Artifacts", "Model locations and deployment context"],
  ["Governance decisions", "Approval and blocking actions"],
  ["Projects", "Project and repository hierarchy"],
] as const;
type AccessLevel = (typeof accessLevels)[number];

export function ApiKeyRotationCanvas() {
  const [mode, setMode] = useState<"create"|"rotate">("create");
  const [windowValue, setWindowValue] = useState<(typeof windows)[number]>("24 hours");
  const [rotated, setRotated] = useState(false);
  const [created, setCreated] = useState(false);
  const [permissions, setPermissions] = useState<Record<string,AccessLevel>>({"Detected models":"Read",Artifacts:"Read","Governance decisions":"Manage",Projects:"Read"});

  const selectMode = (next:"create"|"rotate") => { setMode(next); setCreated(false); setRotated(false); };
  const resetCreate = () => setPermissions({"Detected models":"Read",Artifacts:"Read","Governance decisions":"Manage",Projects:"Read"});

  return (
    <div className="governanceInteractiveCanvas apiKeyCanvas" aria-label="Interactive API key creation and rotation walkthrough">
      <header className="governanceArtifactNote">
        <div><small>Interactive walkthrough</small><strong>API key lifecycle</strong></div>
        <div className="apiKeyTabs" role="tablist" aria-label="API key workflow">
          <button type="button" role="tab" aria-selected={mode==="create"} onClick={()=>selectMode("create")}>Create a key</button>
          <button type="button" role="tab" aria-selected={mode==="rotate"} onClick={()=>selectMode("rotate")}>Rotate safely</button>
        </div>
      </header>

      <div className="apiKeyStage">
        <div className="apiKeyApp">
          <header>
            <div><KeyRound aria-hidden="true"/><span>{mode==="create"?"Create a new key":"Production API key"}</span></div>
            {mode==="rotate"&&rotated?<button type="button" onClick={()=>setRotated(false)}><RotateCcw size={14}/> Reset</button>:null}
          </header>

          {mode==="create" ? (!created ? <section className="apiKeyCreatePanel">
            <div className="apiKeyCreateFields">
              <label><span>Name</span><input defaultValue="Production server key" /></label>
              <label><span>Type</span><select defaultValue="Server"><option>Server</option><option>Personal</option></select></label>
            </div>
            <fieldset className="apiKeyPermissions">
              <legend><span>Key permissions</span><small>Choose the minimum access this integration needs.</small></legend>
              <div className="apiKeyPermissionHeader"><span>Resource</span><span>Access</span></div>
              {resources.map(([resource,description])=><div className="apiKeyPermissionRow" key={resource}>
                <div><strong>{resource}</strong><small>{description}</small></div>
                <div>{accessLevels.map(level=><button type="button" key={level} aria-pressed={permissions[resource]===level} onClick={()=>setPermissions(current=>({...current,[resource]:level}))}>{level}</button>)}</div>
              </div>)}
            </fieldset>
            <div className="apiKeyActions"><button className="apiKeySecondary" type="button" onClick={resetCreate}>Cancel</button><button className="apiKeyPrimary" type="button" onClick={()=>setCreated(true)}><Plus size={15}/> Create key</button></div>
          </section> : <section className="apiKeySuccess apiKeyCreated" aria-live="polite">
            <div className="apiKeySuccessTitle"><span><Check size={18}/></span><div><small>Key created</small><h3>Save this credential now</h3></div></div>
            <p>This is the only time the full key will be visible.</p>
            <label><span>New credential</span><div><code>rk_live_C8v2KpL7Xa41••••P9QF</code><button type="button" aria-label="Copy new key"><Copy size={15}/></button></div></label>
            <button className="apiKeyPrimary" type="button" onClick={()=>setCreated(false)}>Done</button>
          </section>) : (!rotated ? <>
            <div className="apiKeyCurrent">
              <div><small>Current credential</small><code>rk_live_••••••••••••7K2P</code></div>
              <div className="apiKeyUtilities"><button type="button" aria-label="Copy key"><Copy size={15}/></button><button type="button" aria-label="Reveal key"><Eye size={15}/></button></div>
              <span>Active</span>
            </div>

            <section className="apiKeyRotationPanel">
              <div><small>Rotation strategy</small><h3>Keep the current key active temporarily</h3><p>The overlap gives teams time to update environment variables, deploy and verify the new credential before the old key stops working.</p></div>
              <fieldset>
                <legend>Grace period</legend>
                <div>{windows.map((window)=><button type="button" key={window} aria-pressed={windowValue===window} onClick={()=>setWindowValue(window)}>{window}</button>)}</div>
              </fieldset>
              <div className="apiKeyImpact"><strong>What happens next</strong><span>A new key is generated immediately.</span><span>The current key remains valid for {windowValue}, then revokes automatically.</span></div>
              <div className="apiKeyActions"><button className="apiKeySecondary" type="button" onClick={()=>setWindowValue("24 hours")}>Cancel</button><button className="apiKeyPrimary" type="button" onClick={()=>setRotated(true)}><RotateCw size={15}/> Rotate key</button></div>
            </section>
          </> : <section className="apiKeySuccess" aria-live="polite">
            <div className="apiKeySuccessTitle"><span><Check size={18}/></span><div><small>Rotation complete</small><h3>New API key generated</h3></div></div>
            <label><span>New credential</span><div><code>rk_live_N8x4CiA1XBcy••••MhrF</code><button type="button" aria-label="Copy new key"><Copy size={15}/></button></div></label>
            <div className="apiKeyNextSteps"><strong>Next steps</strong><ol><li>Add the new key to secure environment storage.</li><li>Deploy and test the updated integration.</li><li>The previous key stays valid for <b>{windowValue}</b>, then revokes automatically.</li></ol></div>
            <button className="apiKeyPrimary" type="button" onClick={()=>setRotated(false)}>Done</button>
          </section>)}
        </div>
      </div>
    </div>
  );
}
