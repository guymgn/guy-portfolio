"use client";

import { useEffect, useRef } from "react";

export function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let frame = 0;
    let pointerX = -1000;
    let pointerY = -1000;

    function resize() {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function draw(time = 0) {
      context.clearRect(0, 0, width, height);
      const color = getComputedStyle(canvas).getPropertyValue("--dot-color").trim();
      context.fillStyle = color || "rgba(119,118,255,.42)";
      const spacing = width < 600 ? 20 : 22;
      const movement = reduceMotion.matches ? 0 : 1;
      const loopDuration = 9000;
      const phase = ((time % loopDuration) / loopDuration) * Math.PI * 2;

      for (let y = -spacing; y < height + spacing; y += spacing) {
        for (let x = -spacing; x < width + spacing; x += spacing) {
          const waveX = Math.sin(y * 0.025 + phase) * 4.5 * movement;
          const waveY = Math.cos(x * 0.022 - phase) * 4 * movement;
          const px = x + waveX;
          const py = y + waveY;
          const dx = px - pointerX;
          const dy = py - pointerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const influence = movement && distance < 105 ? (105 - distance) / 105 : 0;
          const offset = influence * 14;
          const finalX = px + (dx / (distance || 1)) * offset;
          const finalY = py + (dy / (distance || 1)) * offset;
          const radius = 1 + influence * 1.1;
          context.beginPath();
          context.arc(finalX, finalY, radius, 0, Math.PI * 2);
          context.fill();
        }
      }

      if (!reduceMotion.matches) frame = requestAnimationFrame(draw);
    }

    function onPointerMove(event: PointerEvent) {
      const bounds = canvas.getBoundingClientRect();
      pointerX = event.clientX - bounds.left;
      pointerY = event.clientY - bounds.top;
    }

    function onPointerLeave() {
      pointerX = -1000;
      pointerY = -1000;
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="dotField" aria-hidden="true" />;
}
