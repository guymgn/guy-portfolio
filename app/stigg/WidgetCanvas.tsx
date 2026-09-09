"use client";

import { useState } from "react";

const initialTheme = { name: "ACME green", accent: "#24A148", text: "#333333", background: "#FFFFFF", border: "#D9DDE9", soft: "#EDF8F0" };

function SelectChevron() {
  return <svg className="stiggSelectChevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>;
}

export function WidgetCanvas() {
  const [theme, setTheme] = useState(initialTheme);
  const [tab, setTab] = useState<"style" | "code">("style");
  const [openColors, setOpenColors] = useState(true);
  const [openTypography, setOpenTypography] = useState(true);

  return (
    <div className="widgetCanvas">
      <div className="widgetEditor">
        <aside className="widgetControls">
          <div className="widgetControlsTitle"><strong>ACME theme</strong><small>Widget theme editor</small></div>
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
                <label><span>Font family</span><b>DM Sans</b></label>
                <div><span>H1</span><b>B</b><em>32 <small>px</small></em></div>
                <div><span>H2</span><b>B</b><em>24 <small>px</small></em></div>
                <div><span>H3</span><b>B</b><em>16 <small>px</small></em></div>
              </div>}
            </section>
          </> : <section className="widgetCodePanel"><small>Embed</small><code>{`<PricingTable\n  productId="acme-app"\n  themeId="acme-theme"\n/>`}</code><p>The same product catalog and theme are available through an embeddable component.</p></section>}
        </aside>

        <div className="widgetPreviewArea">
          <div className="widgetPreviewBar"><span><strong>Pricing table preview</strong><button type="button">ACME workspace data <SelectChevron /></button></span><small>Desktop · 100%</small></div>
          <div className="widgetPreviewStage" style={{ "--widget-accent": theme.accent, "--widget-text": theme.text, "--widget-background": theme.background, "--widget-border": theme.border, "--widget-soft": theme.soft } as React.CSSProperties}>
            <article className="pricingWidget">
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
