"use client";

import { useEffect, useState } from "react";

export type FeatureTypeIconName = "boolean" | "metered-calculated" | "enum" | "integer" | "metered-events";

type Feature = {
  id: string;
  name: string;
  type: string;
  valueLabel: string;
  value: string;
  explanation: string;
  placement: string;
  icon: FeatureTypeIconName;
};

const features: Feature[] = [
  { id: "analytics", name: "Analytics", type: "Boolean", valueLabel: "Access", value: "True", explanation: "A simple on or off entitlement. Adding it to a plan grants access to the capability.", placement: "modelCardAnalytics", icon: "boolean" },
  { id: "api-calls", name: "API Calls", type: "Metered · calculated usage", valueLabel: "Limit", value: "10,000 / month", explanation: "Usage is reported by the application and checked against a monthly entitlement limit.", placement: "modelCardApi", icon: "metered-calculated" },
  { id: "countries", name: "Countries", type: "Configuration · enum", valueLabel: "Values", value: "🇺🇸 🇬🇧 🇩🇪 🇧🇪 🇯🇵", explanation: "A predefined list controls which configured options are available to the customer.", placement: "modelCardCountries", icon: "enum" },
  { id: "support", name: "Support level", type: "Configuration · enum", valueLabel: "Values", value: "Standard, Premium, Pro", explanation: "An enum expresses one or more allowed values, such as the support tier included in a plan.", placement: "modelCardSupport", icon: "enum" },
  { id: "storage", name: "Storage", type: "Configuration · number", valueLabel: "Value", value: "10 GB", explanation: "A numeric configuration entitlement sets a fixed value that changes product behavior.", placement: "modelCardStorage", icon: "integer" },
  { id: "seats", name: "Seats", type: "Configuration · number", valueLabel: "Value", value: "25 seats", explanation: "The plan grants a numeric allowance that the product can read and enforce.", placement: "modelCardSeats", icon: "integer" },
  { id: "emails", name: "Emails sent", type: "Metered · raw events", valueLabel: "Limit", value: "50,000 / month", explanation: "Raw usage events are aggregated into a metered feature and evaluated against its recurring limit.", placement: "modelCardEmails", icon: "metered-events" },
];

export function FeatureTypeIcon({ type }: { type: FeatureTypeIconName }) {
  const paths = {
    boolean: [
      "M11.9862 13.7775H6.01569C3.37774 13.7775 1.23926 11.639 1.23926 9.00104C1.23926 6.36309 3.37774 4.22461 6.01569 4.22461H11.9862C14.6241 4.22461 16.7627 6.36309 16.7627 9.00104C16.7627 11.639 14.6241 13.7775 11.9862 13.7775Z",
      "M9.59766 9.00125C9.59766 9.31488 9.65943 9.62543 9.77945 9.91518C9.89947 10.2049 10.0754 10.4682 10.2971 10.69C10.5189 10.9117 10.7822 11.0877 11.0719 11.2077C11.3617 11.3277 11.6722 11.3895 11.9859 11.3895C12.6193 11.3895 13.2267 11.1379 13.6746 10.69C14.1225 10.2421 14.3741 9.63464 14.3741 9.00125C14.3741 8.36786 14.1225 7.76041 13.6746 7.31253C13.2267 6.86465 12.6193 6.61304 11.9859 6.61304C11.3525 6.61304 10.745 6.86465 10.2971 7.31253C9.84927 7.76041 9.59766 8.36786 9.59766 9.00125Z",
    ],
    "metered-calculated": ["M1.47949 9.09238H4.01364C4.12034 9.09115 4.22479 9.06157 4.3163 9.00667C4.40779 8.95177 4.48305 8.87353 4.53435 8.77995L6.61721 4.61423C6.66854 4.51052 6.75038 4.42499 6.85174 4.36915C6.95309 4.3133 7.06911 4.28979 7.18421 4.30181C7.29884 4.30956 7.40826 4.35266 7.49738 4.4252C7.5865 4.49773 7.65092 4.59612 7.68178 4.70681L10.2622 13.2928C10.2961 13.4093 10.3657 13.5122 10.4612 13.5869C10.5567 13.6617 10.6733 13.7045 10.7945 13.7094C10.9081 13.7056 11.018 13.6685 11.1106 13.6027C11.2032 13.5367 11.2744 13.4451 11.3152 13.3391L12.9005 9.46266M10.6131 3.23065H16.613M10.6131 5.77069H16.613M15.5735 1.50031L14.4196 7.50036M13.0369 1.50031L11.8831 7.50036"],
    enum: ["M7.83779 3C7.63526 3.0006 7.43765 3.06235 7.27081 3.17716C7.10398 3.29197 6.9757 3.45449 6.90279 3.64344L6.47048 4.7594L4.98253 5.60391L3.7962 5.42294C3.59866 5.39613 3.39761 5.42864 3.21859 5.51636C3.03958 5.60408 2.89069 5.74303 2.79083 5.91557L2.38868 6.61933C2.28563 6.79462 2.23815 6.99703 2.25251 7.19986C2.26687 7.40268 2.34239 7.59638 2.46911 7.7554L3.22314 8.6904V10.3794L2.48921 11.3144C2.3625 11.4734 2.28697 11.6671 2.27262 11.87C2.25826 12.0728 2.30573 12.2752 2.40878 12.4505L2.81093 13.1542C2.9108 13.3268 3.05969 13.4657 3.2387 13.5535C3.41771 13.6411 3.61877 13.6737 3.8163 13.6469L5.00264 13.4659L6.47048 14.3104L6.90279 15.4264C6.9757 15.6153 7.10398 15.7779 7.27081 15.8927C7.43765 16.0075 7.63526 16.0692 7.83779 16.0698H8.6823C8.88482 16.0692 9.08244 16.0075 9.24928 15.8927C9.41612 15.7779 9.54438 15.6153 9.61729 15.4264L10.0496 14.3104L11.5174 13.4659L12.7037 13.6469C12.9013 13.6737 13.1024 13.6411 13.2814 13.5535C13.4604 13.4657 13.6093 13.3268 13.7091 13.1542L14.1113 12.4505C14.2143 12.2752 14.2619 12.0728 14.2475 11.87C14.2331 11.6671 14.1576 11.4734 14.0308 11.3144L13.2768 10.3794V9.53491M10.2221 9.92718C10.1445 10.3172 9.95301 10.6755 9.6718 10.9567C9.39059 11.2379 9.03231 11.4294 8.64226 11.507C8.25222 11.5846 7.84793 11.5448 7.48051 11.3926C7.11309 11.2404 6.79907 10.9827 6.57812 10.652C6.35718 10.3214 6.23925 9.93259 6.23925 9.53491C6.23925 9.00163 6.4511 8.49019 6.82818 8.1131C7.20527 7.73601 7.71671 7.52417 8.24999 7.52417M14.8594 1.5H10.6406M14.8594 4.12409H10.6406M15 6.75H10.5"],
    integer: ["M7.83779 3C7.63526 3.0006 7.43765 3.06235 7.27081 3.17716C7.10398 3.29197 6.9757 3.45449 6.90279 3.64344L6.47048 4.7594L4.98253 5.60391L3.7962 5.42294C3.59866 5.39613 3.39761 5.42864 3.21859 5.51636C3.03958 5.60408 2.89069 5.74303 2.79083 5.91557L2.38868 6.61933C2.28563 6.79462 2.23815 6.99703 2.25251 7.19986C2.26687 7.40268 2.34239 7.59638 2.46911 7.7554L3.22314 8.6904V10.3794L2.48921 11.3144C2.3625 11.4734 2.28697 11.6671 2.27262 11.87C2.25826 12.0728 2.30573 12.2752 2.40878 12.4505L2.81093 13.1542C2.9108 13.3268 3.05969 13.4657 3.2387 13.5535C3.41771 13.6411 3.61877 13.6737 3.8163 13.6469L5.00264 13.4659L6.47048 14.3104L6.90279 15.4264C6.9757 15.6153 7.10398 15.7779 7.27081 15.8927C7.43765 16.0075 7.63526 16.0692 7.83779 16.0698H8.6823C8.88482 16.0692 9.08244 16.0075 9.24928 15.8927C9.41612 15.7779 9.54438 15.6153 9.61729 15.4264L10.0496 14.3104L11.5174 13.4659L12.7037 13.6469C12.9013 13.6737 13.1024 13.6411 13.2814 13.5535C13.4604 13.4657 13.6093 13.3268 13.7091 13.1542L14.1113 12.4505C14.2143 12.2752 14.2619 12.0728 14.2475 11.87C14.2331 11.6671 14.1576 11.4734 14.0308 11.3144L13.2768 10.3794V9.53491M10.2221 9.92718C10.1445 10.3172 9.95301 10.6755 9.6718 10.9567C9.39059 11.2379 9.03231 11.4294 8.64226 11.507C8.25222 11.5846 7.84793 11.5448 7.48051 11.3926C7.11309 11.2404 6.79907 10.9827 6.57812 10.652C6.35718 10.3214 6.23925 9.93259 6.23925 9.53491C6.23925 9.00163 6.4511 8.49019 6.82818 8.1131C7.20527 7.73601 7.71671 7.52417 8.24999 7.52417M9.75 3.23035H15.7499M9.75 5.77039H15.7499M14.7104 1.5L13.5565 7.50005M12.1738 1.5L11.02 7.50005"],
    "metered-events": ["M1.47949 9.09241H4.01364C4.12034 9.09119 4.22479 9.06161 4.3163 9.0067C4.40779 8.95181 4.48305 8.87356 4.53435 8.77998L6.61721 4.61427C6.66854 4.51056 6.75038 4.42503 6.85174 4.36919C6.95309 4.31333 7.06911 4.28983 7.18421 4.30184C7.29884 4.30959 7.40826 4.3527 7.49738 4.42524C7.5865 4.49777 7.65092 4.59616 7.68178 4.70684L10.2622 13.2928C10.2961 13.4094 10.3657 13.5122 10.4612 13.587C10.5567 13.6617 10.6733 13.7046 10.7945 13.7094C10.9081 13.7056 11.018 13.6686 11.1106 13.6027C11.2032 13.5368 11.2744 13.4451 11.3152 13.3391L12.9005 9.4627M17.1003 1.80005H13.466M15.8878 4.348H12.2535M14.6769 6.89771H10.8003"],
  };

  return <svg className="featureTypeIcon" viewBox="0 0 18 18" fill="none" aria-hidden="true">{paths[type].map((path) => <path key={path} d={path} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />)}</svg>;
}

export function ModelingAccessCanvas() {
  const [selectedId, setSelectedId] = useState(features[0].id);
  const [isPaused, setIsPaused] = useState(false);
  const selected = features.find((feature) => feature.id === selectedId) ?? features[0];

  useEffect(() => {
    if (isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setSelectedId((currentId) => {
        const currentIndex = features.findIndex((feature) => feature.id === currentId);
        return features[(currentIndex + 1) % features.length].id;
      });
    }, 3200);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  return (
    <div
      className="modelingCanvas"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
    >
      <div className="modelingCanvasIntro">
        <p>Here are a few examples of how features are modeled in Stigg</p>
      </div>

      <div className="modelingCards" aria-label="Feature modeling examples">
        {features.map((feature) => (
          <button
            className={`modelingCard ${feature.placement}${selectedId === feature.id ? " isSelected" : ""}`}
            type="button"
            key={feature.id}
            onClick={() => setSelectedId(feature.id)}
            aria-pressed={selectedId === feature.id}
          >
            <span><small>Feature</small><strong>{feature.name}</strong></span>
            <span><small>Type</small><span className="modelingType"><FeatureTypeIcon type={feature.icon} /><b>{feature.type}</b></span></span>
            <span><small>{feature.valueLabel}</small><code>{feature.value}</code></span>
          </button>
        ))}
      </div>

      <div className="modelingExplanation" aria-live="polite">
        <div className="modelingExplanationLabel"><span>{selected.name}</span></div>
        <p>{selected.explanation}</p>
      </div>
    </div>
  );
}
