"use client";

import Image from "next/image";
import { type CSSProperties, type MouseEvent, type PointerEvent, useRef, useState } from "react";

export function TearaVideoPromo() {
  const promoRef = useRef<HTMLAnchorElement>(null);
  const dragStart = useRef({ pointerX: 0, offset: 0 });
  const dragged = useRef(false);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const parked = offset > 0;

  const hiddenOffset = () => {
    const card = promoRef.current;
    const right = card ? parseFloat(getComputedStyle(card).right) || 0 : -60;
    return Math.max(0, (card?.offsetWidth ?? 228) + right - 42);
  };

  const handlePointerDown = (event: PointerEvent<HTMLAnchorElement>) => {
    dragStart.current = { pointerX: event.clientX, offset };
    dragged.current = false;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (!dragging) return;
    const delta = event.clientX - dragStart.current.pointerX;
    if (Math.abs(delta) > 5) dragged.current = true;
    setOffset(Math.min(hiddenOffset(), Math.max(0, dragStart.current.offset + delta)));
  };

  const finishDrag = (event: PointerEvent<HTMLAnchorElement>) => {
    if (!dragging) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
    const finalOffset = Math.min(hiddenOffset(), Math.max(0, dragStart.current.offset + event.clientX - dragStart.current.pointerX));
    setOffset(finalOffset > hiddenOffset() * .3 ? hiddenOffset() : 0);
  };

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!dragged.current && !parked) return;
    event.preventDefault();
    if (parked && !dragged.current) setOffset(0);
    dragged.current = false;
  };

  return (
    <a
      ref={promoRef}
      className="tearaVideoPromo"
      href="https://apps.apple.com/il/app/teara/id6800005317"
      target="_blank"
      rel="noreferrer"
      aria-label={parked ? "Show Teara App Store card" : "Visit Teara on the App Store"}
      data-analytics-event="Teara Video Promo Opened"
      data-dragging={dragging || undefined}
      data-parked={parked || undefined}
      style={{ "--promo-offset": `${offset}px` } as CSSProperties}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onClick={handleClick}
    >
      <span className="tearaVideoPromoHint" aria-hidden="true">‹</span>
      <span className="tearaVideoPromoTitle">
        <b>Teara is live</b>
        <Image src="/app-store-badge.svg" width={84} height={28} alt="Download on the App Store" />
      </span>
      <video autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
        <source src="/teara-new-ios-app.mp4" type="video/mp4" />
      </video>
    </a>
  );
}
