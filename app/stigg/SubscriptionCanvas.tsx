"use client";

import { useMemo, useState } from "react";

function SelectChevron() {
  return <svg className="stiggSelectChevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>;
}

export function SubscriptionCanvas() {
  const [period, setPeriod] = useState<"monthly" | "annually">("monthly");
  const [openSelect, setOpenSelect] = useState<"product" | "plan" | "currency" | "date" | null>(null);
  const [quantities, setQuantities] = useState({ seats: 2, api: 10000, templates: 3 });
  const multiplier = period === "monthly" ? 1 : 10;
  const charges = [
    { id: "base", name: "Base charge", feature: "Recurring platform fee", quantity: 1, unit: "", price: 20 * multiplier, editable: false },
    { id: "seats", name: "Seats", feature: "feature-seat", quantity: quantities.seats, unit: "seats", price: 39 * multiplier, editable: true },
    { id: "api", name: "API Calls", feature: "feature-api-calls", quantity: quantities.api, unit: "calls", price: .01 * multiplier, editable: true },
    { id: "templates", name: "Templates", feature: "feature-templates", quantity: quantities.templates, unit: "templates", price: 12 * multiplier, editable: true },
  ];
  const total = useMemo(() => charges.reduce((sum, charge) => sum + charge.quantity * charge.price, 0), [charges]);
  const updateQuantity = (id: "seats" | "api" | "templates", delta: number) => setQuantities((current) => ({ ...current, [id]: Math.max(1, current[id] + delta) }));

  return <div className="subscriptionCanvas">
    <div className="subscriptionFlow">
      <div className="subscriptionBreadcrumb">Customers <i>/</i> Jared Dunn <i>/</i> Create subscription</div>
      <header><span><strong>Jared Dunn</strong><small>jared@piedpiper.com · customer-abc1234</small></span></header>

      <section>
        <h3>Subscription content</h3>
        <label><span>Product</span><button className={openSelect === "product" ? "subscriptionSelect isOpen" : "subscriptionSelect"} type="button" onClick={() => setOpenSelect(openSelect === "product" ? null : "product")} aria-expanded={openSelect === "product"}>ACME app <SelectChevron /></button></label>
        <label><span>Plan</span><button className={openSelect === "plan" ? "subscriptionSelect isOpen" : "subscriptionSelect"} type="button" onClick={() => setOpenSelect(openSelect === "plan" ? null : "plan")} aria-expanded={openSelect === "plan"}>Essentials <SelectChevron /></button></label>
        <div className="subscriptionPair">
          <label><span>Billing period</span><span className="subscriptionSegmented"><button className={period === "monthly" ? "isActive" : ""} type="button" onClick={() => setPeriod("monthly")}>Monthly</button><button className={period === "annually" ? "isActive" : ""} type="button" onClick={() => setPeriod("annually")}>Annually</button></span></label>
          <label><span>Price localization</span><button className={openSelect === "currency" ? "subscriptionSelect isOpen" : "subscriptionSelect"} type="button" onClick={() => setOpenSelect(openSelect === "currency" ? null : "currency")} aria-expanded={openSelect === "currency"}>USD (United States dollar) <SelectChevron /></button></label>
        </div>
      </section>

      <section>
        <h3>Plan configuration</h3>
        <div className="subscriptionCharges">
          <header><span>Charge</span><span>Quantity</span><span>Price</span></header>
          {charges.map((charge) => <div className="subscriptionChargeRow" key={charge.id}>
            <div><strong>{charge.name}</strong><em>{charge.feature}</em></div>
            <div>{charge.editable ? <span className="quantityControl"><button type="button" onClick={() => updateQuantity(charge.id as "seats" | "api" | "templates", charge.id === "api" ? -1000 : -1)}>−</button><b>{charge.quantity.toLocaleString()}</b><button type="button" onClick={() => updateQuantity(charge.id as "seats" | "api" | "templates", charge.id === "api" ? 1000 : 1)}>+</button></span> : <span>1</span>}<em>{charge.unit}</em></div>
            <div><strong>${charge.price < 1 ? charge.price.toFixed(2) : charge.price.toFixed(2)}</strong><em>{charge.id === "base" ? `/${period === "monthly" ? "month" : "year"}` : `${charge.unit.slice(0,-1) || charge.unit} / ${period === "monthly" ? "month" : "year"}`}</em></div>
          </div>)}
        </div>
      </section>

      <section className="subscriptionSchedule">
        <h3>Subscription schedule</h3>
        <div><span>Effective date</span><button className={openSelect === "date" ? "subscriptionSelect isOpen" : "subscriptionSelect"} type="button" onClick={() => setOpenSelect(openSelect === "date" ? null : "date")} aria-expanded={openSelect === "date"}>Immediately <SelectChevron /></button></div>
        <div><span>Ends at</span><button className="subscriptionAdd" type="button">＋ Add</button></div>
        <h3>Free trial</h3>
        <div><span>Trial period</span><label><input defaultValue="30" aria-label="Trial period in days" /><small>days</small></label><i>⇄</i><button type="button">08/10/2026</button></div>
        <h3>Discount</h3>
        <div><span>Coupon</span><button className="subscriptionAdd" type="button">＋ Add</button></div>
      </section>
      <section className="subscriptionCompact"><h3>Billing</h3><span>Payment method on file · •••• 4242</span></section>
    </div>

    <aside className="subscriptionPreview" aria-live="polite">
      <small>Updates as you configure</small>
      <h3>Subscription preview</h3>
      <div><strong>ACME app / Essentials</strong><span>{period === "monthly" ? "Monthly" : "Annual"}</span></div>
      {charges.map((charge) => <div key={charge.id}><span>{charge.quantity.toLocaleString()} × {charge.name}</span><span>${(charge.quantity * charge.price).toFixed(2)}</span></div>)}
      <hr />
      <div className="subscriptionTotal"><strong>Total</strong><strong>${total.toFixed(2)} USD</strong></div>
      <p>Starts immediately · payment method on file</p>
      <button type="button">Create subscription</button>
    </aside>
  </div>;
}
