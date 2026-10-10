"use client";

import { useState } from "react";

const initialTheme = { name: "ACME green", accent: "#24A148", text: "#333333", background: "#FFFFFF", border: "#D9DDE9", soft: "#EDF8F0" };
const initialTypography = { font: "DM Sans", h1: 32, h2: 24, h3: 16, h1Bold: true, h2Bold: true, h3Bold: true };

function SelectChevron() {
  return <svg className="stiggSelectChevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>;
}

export function WidgetCanvas() {
  const [theme, setTheme] = useState(initialTheme);
  const [tab, setTab] = useState<"style" | "code">("style");
  const [openColors, setOpenColors] = useState(true);
  const [openTypography, setOpenTypography] = useState(true);
  const [typography, setTypography] = useState(initialTypography);

  const updateTypeSize = (key: "h1" | "h2" | "h3", value: string) => {
    const size = Number(value);
    if (Number.isFinite(size)) setTypography((current) => ({ ...current, [key]: Math.min(72, Math.max(8, size)) }));
  };

  return (
    <div className="widgetCanvas">
      <div className="widgetEditor">
        <aside className="widgetControls">
          <div className="widgetControlsTitle"><strong>Widget designer</strong></div>
          <div className="widgetTabs" role="tablist">
            <button className={tab === "style" ? "isActive" : ""} type="button" onClick={() => setTab("style")}>Style</button>
            <button className={tab === "code" ? "isActive" : ""} type="button" onClick={() => setTab("code")}>Code</button>
          </div>

          {tab === "style" ? <>
            <section className="widgetControlSection widgetCollapsible">
              <button className={openColors ? "widgetSectionToggle isOpen" : "widgetSectionToggle"} type="button" onClick={() => setOpenColors((open) => !open)} aria-expanded={openColors}><strong>Colors</strong><SelectChevron /></button>
              {openColors && <div className="widgetColorFields">
                <label><span>Primary color</span><b><input type="color" value={theme.accent} onChange={(event) => setTheme((current) => ({ ...current, name: "Custom", accent: event.target.value }))} /><em>{theme.accent.toUpperCase()}</em></b></label>
                <label><span>Text color</span><b><input type="color" value={theme.text} onChange={(event) => setTheme((current) => ({ ...current, name: "Custom", text: event.target.value }))} /><em>{theme.text.toUpperCase()}</em></b></label>
                <label><span>Background color</span><b><input type="color" value={theme.background} onChange={(event) => setTheme((current) => ({ ...current, name: "Custom", background: event.target.value }))} /><em>{theme.background.toUpperCase()}</em></b></label>
                <label><span>Border color</span><b><input type="color" value={theme.border} onChange={(event) => setTheme((current) => ({ ...current, name: "Custom", border: event.target.value }))} /><em>{theme.border.toUpperCase()}</em></b></label>
                <label><span>Current plan background</span><b><input type="color" value={theme.soft} onChange={(event) => setTheme((current) => ({ ...current, name: "Custom", soft: event.target.value }))} /><em>{theme.soft.toUpperCase()}</em></b></label>
              </div>}
            </section>
            <section className="widgetControlSection widgetCollapsible">
              <button className={openTypography ? "widgetSectionToggle isOpen" : "widgetSectionToggle"} type="button" onClick={() => setOpenTypography((open) => !open)} aria-expanded={openTypography}><strong>Typography</strong><SelectChevron /></button>
              {openTypography && <div className="widgetTypographyFields">
                <label className="widgetFontInput"><span>Font family</span><span className="widgetFontSelect"><select value={typography.font} onChange={(event) => setTypography((current) => ({ ...current, font: event.target.value }))}><option value="DM Sans">DM Sans</option><option value="Space Grotesk">Space Grotesk</option><option value="Arial">Arial</option><option value="Georgia">Georgia</option><option value="Courier New">Courier New</option></select><SelectChevron /></span></label>
                {(["h1", "h2", "h3"] as const).map((level) => <div key={level}>
                  <span>{level.toUpperCase()}</span>
                  <label className="widgetBoldInput"><input style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} type="checkbox" checked={typography[`${level}Bold`]} onChange={(event) => setTypography((current) => ({ ...current, [`${level}Bold`]: event.target.checked }))} aria-label={`Toggle ${level.toUpperCase()} bold`} /><b>B</b></label>
                  <label className="widgetSizeInput"><input type="number" min="8" max="72" value={typography[level]} onChange={(event) => updateTypeSize(level, event.target.value)} /><small>px</small></label>
                </div>)}
              </div>}
            </section>
          </> : <section className="widgetCodePanel"><small>Embed</small><code>{`<PricingTable\n  productId="acme-app"\n  themeId="acme-theme"\n/>`}</code><p>The same Product Catalog and theme are available through an embeddable component.</p></section>}
        </aside>

        <div className="widgetPreviewArea">
          <div className="widgetPreviewBar"><span><strong>Pricing table preview</strong><button type="button">ACME workspace data <SelectChevron /></button></span></div>
          <div className="widgetPreviewStage" style={{ "--widget-accent": theme.accent, "--widget-text": theme.text, "--widget-background": theme.background, "--widget-border": theme.border, "--widget-soft": theme.soft, "--widget-font": typography.font, "--widget-h1": `${typography.h1}px`, "--widget-h2": `${typography.h2}px`, "--widget-h3": `${typography.h3}px`, "--widget-h1-weight": typography.h1Bold ? 700 : 400, "--widget-h2-weight": typography.h2Bold ? 700 : 400, "--widget-h3-weight": typography.h3Bold ? 700 : 400 } as React.CSSProperties}>
            <article className="pricingWidget" style={{ fontFamily: `${typography.font || "DM Sans"}, Arial, sans-serif` }}>
              <div className="pricingPlans">
                <section>
                  <span className="pricingPlanName">Essentials</span><h4>$49<small>/ month</small></h4><button type="button">Get started</button><hr /><strong className="pricingIncludes">Includes:</strong>
                  <ul><li>10,000 API calls</li><li>3 templates</li><li>5 seats</li></ul>
                </section>
                <section className="isFeatured">
                  <span className="pricingPlanName">Growth</span><h4>$149<small>/ month</small></h4><button type="button">Get started</button><hr /><strong className="pricingIncludes">Includes:</strong>
                  <ul><li>100,000 API calls</li><li>Unlimited templates</li><li>20 seats</li></ul>
                </section>
                <section>
                  <span className="pricingPlanName">Scale</span><h4>Custom<small>annual</small></h4><button type="button">Contact sales</button><hr /><strong className="pricingIncludes">Includes:</strong>
                  <ul><li>Custom API calls</li><li>Unlimited templates</li><li>Custom seats</li></ul>
                </section>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
