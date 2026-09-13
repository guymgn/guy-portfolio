"use client";

import { useState } from "react";
import { FeatureTypeIcon, type FeatureTypeIconName } from "./ModelingAccessCanvas";

type MainType = "boolean" | "configuration" | "metered";
type DetailType = "integer" | "enum" | "metered-calculated" | "metered-events";

const mainTypes: Array<{ id: MainType; label: string; description: string; icon: FeatureTypeIconName }> = [
  { id: "boolean", label: "Boolean", description: "Functionality that customers can either have access to or not", icon: "boolean" },
  { id: "configuration", label: "Configuration", description: "Functionality that can be configured", icon: "integer" },
  { id: "metered", label: "Meter", description: "Functionality with varying usage that needs to be tracked", icon: "metered-calculated" },
];

const subTypes = {
  configuration: [
    { id: "integer" as const, label: "Integer", description: "", icon: "integer" as const },
    { id: "enum" as const, label: "Enum", description: "", icon: "enum" as const },
  ],
  metered: [
    { id: "metered-calculated" as const, label: "Calculated usage", description: "Usage is calculated by the reporting app", icon: "metered-calculated" as const },
    { id: "metered-events" as const, label: "Raw events", description: "Usage is calculated by Stigg based on aggregation of raw events", icon: "metered-events" as const },
  ],
};

function SelectChevron() {
  return <svg className="stiggSelectChevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>;
}

export function CreateFeatureCanvas() {
  const [featureName, setFeatureName] = useState("API Calls");
  const [description, setDescription] = useState("A single, countable request made by a client application");
  const [mainType, setMainType] = useState<MainType>("metered");
  const [detailType, setDetailType] = useState<DetailType>("metered-calculated");
  const [openMenu, setOpenMenu] = useState<"type" | "subtype" | null>(null);
  const activeMain = mainTypes.find((type) => type.id === mainType)!;
  const activeSub = mainType === "configuration"
    ? subTypes.configuration.find((type) => type.id === detailType) ?? subTypes.configuration[0]
    : mainType === "metered"
      ? subTypes.metered.find((type) => type.id === detailType) ?? subTypes.metered[0]
      : null;
  const featureId = `feature-${featureName.trim().replace(/[^a-z0-9]+/gi, "") || "newFeature"}`;

  const selectMainType = (type: MainType) => {
    setMainType(type);
    if (type === "configuration") setDetailType("integer");
    if (type === "metered") setDetailType("metered-calculated");
    setOpenMenu(null);
  };

  return (
    <div className="createFeatureCanvas">
      <div className="createFeatureNote">
        <small>Interactive walkthrough</small>
        <p>Choose a feature type and see how the setup reveals only the settings it needs.</p>
      </div>

      <div className="createFeaturePanel">
        <div className="createFeatureTitle"><h3>Create new feature</h3><span aria-hidden="true">×</span></div>
        <label className="createFeatureField">
          <span>Feature name</span>
          <input value={featureName} onChange={(event) => setFeatureName(event.target.value)} aria-label="Feature name" />
        </label>
        <label className="createFeatureField">
          <span>Description</span>
          <input value={description} onChange={(event) => setDescription(event.target.value)} aria-label="Description" />
        </label>
        <div className="createFeatureId"><span>ID</span><i>?</i><code>{featureId}</code><button type="button">Edit</button></div>

        <div className="stiggSelectField">
          <span>Type</span>
          <button className={openMenu === "type" ? "stiggSelectTrigger isOpen" : "stiggSelectTrigger"} type="button" onClick={() => setOpenMenu(openMenu === "type" ? null : "type")} aria-expanded={openMenu === "type"}>
            <FeatureTypeIcon type={activeMain.icon} /><strong>{activeMain.label}</strong><SelectChevron />
          </button>
          {openMenu === "type" && <div className="stiggSelectMenu">
            {mainTypes.map((type) => <button type="button" key={type.id} onClick={() => selectMainType(type.id)}>
              <FeatureTypeIcon type={type.icon} /><span><strong>{type.label}</strong><small>{type.description}</small></span>
            </button>)}
          </div>}
        </div>

        {activeSub && <div className="stiggSelectField stiggSubtypeField">
          <span>{mainType === "configuration" ? "Value type" : "Meter type"}</span>
          <button className={openMenu === "subtype" ? "stiggSelectTrigger isOpen" : "stiggSelectTrigger"} type="button" onClick={() => setOpenMenu(openMenu === "subtype" ? null : "subtype")} aria-expanded={openMenu === "subtype"}>
            <FeatureTypeIcon type={activeSub.icon} /><strong>{activeSub.label}</strong><SelectChevron />
          </button>
          {openMenu === "subtype" && <div className="stiggSelectMenu">
            {(mainType === "configuration" ? subTypes.configuration : subTypes.metered).map((type) => <button type="button" key={type.id} className={detailType === type.id ? "isSelected" : ""} onClick={() => { setDetailType(type.id); setOpenMenu(null); }}>
              <FeatureTypeIcon type={type.icon} /><span><strong>{type.label}</strong>{type.description && <small>{type.description}</small>}</span>
            </button>)}
          </div>}
        </div>}
      </div>
    </div>
  );
}
