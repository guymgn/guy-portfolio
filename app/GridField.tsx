"use client";

import { useEffect, useRef } from "react";

type Runner = {
  axis: "x" | "y";
  line: number;
  position: number;
  length: number;
  speed: number;
  direction: 1 | -1;
  delay: number;
  opacity: number;
};

export function GridField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const runners: Runner[] = [];
    const spacing = 80;
    let width = 0;
    let height = 0;
    let frame = 0;
    let previousTime = 0;

    const makeRunner = (): Runner => {
      const axis = Math.random() > 0.5 ? "x" : "y";
      const limit = axis === "x" ? width : height;
      const lines = Math.max(1, Math.floor((axis === "x" ? height : width) / spacing));
      const direction = Math.random() > 0.5 ? 1 : -1;
      return {
        axis,
        line: Math.floor(Math.random() * (lines + 1)),
        position: direction === 1 ? -120 : limit + 120,
        length: 34 + Math.random() * 88,
        speed: 24 + Math.random() * 34,
        direction,
        delay: Math.random() * 5,
        opacity: 0.25 + Math.random() * 0.45,
      };
    };

    function resize() {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      runners.splice(0, runners.length, ...Array.from({ length: 7 }, makeRunner));
    }

    function draw(time = 0) {
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      const styles = getComputedStyle(canvas);
      const gridColor = styles.getPropertyValue("--grid-line").trim();
      const nodeColor = styles.getPropertyValue("--grid-node").trim();
      const runnerColor = styles.getPropertyValue("--grid-runner").trim();

      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;
      context.strokeStyle = gridColor;
      context.beginPath();
      for (let x = 0.5; x <= width; x += spacing) {
        context.moveTo(x, 0);
        context.lineTo(x, height);
      }
      for (let y = 0.5; y <= height; y += spacing) {
        context.moveTo(0, y);
        context.lineTo(width, y);
      }
      context.stroke();

      context.fillStyle = nodeColor;
      for (let x = 0; x <= width; x += spacing) {
        for (let y = 0; y <= height; y += spacing) {
          context.beginPath();
          context.arc(x, y, 1.5, 0, Math.PI * 2);
          context.fill();
        }
      }

      if (!reducedMotion.matches) {
        context.strokeStyle = runnerColor;
        context.lineCap = "round";
        context.lineWidth = 1;
        runners.forEach((runner, index) => {
          if (runner.delay > 0) {
            runner.delay -= delta;
            return;
          }
          runner.position += runner.speed * runner.direction * delta;
          context.globalAlpha = runner.opacity;
          context.beginPath();
          if (runner.axis === "x") {
            const y = runner.line * spacing + 0.5;
            context.moveTo(runner.position, y);
            context.lineTo(runner.position - runner.length * runner.direction, y);
          } else {
            const x = runner.line * spacing + 0.5;
            context.moveTo(x, runner.position);
            context.lineTo(x, runner.position - runner.length * runner.direction);
          }
          context.stroke();
          context.globalAlpha = 1;

          const limit = runner.axis === "x" ? width : height;
          if (runner.position < -runner.length - 130 || runner.position > limit + runner.length + 130) {
            runners[index] = makeRunner();
          }
        });
      }

      frame = requestAnimationFrame(draw);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="gridField" aria-hidden="true" />;
}
