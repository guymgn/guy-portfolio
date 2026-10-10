"use client";

import { useLayoutEffect, useRef, useState } from "react";

const nodes = [
  { label:"What the team investigates", title:"vgg16_light_a", detail:"One detected model", rotation:-1.1 },
  { label:"Where it appears", title:"Project → Repository → Artifact", detail:"The same model can exist across many branches", rotation:0 },
  { label:"What the system governs", title:"The containing artifact", detail:"A package, file or container image", rotation:.9 },
];

type Position = { x:number; y:number };
type Connector = { x1:number; y1:number; x2:number; y2:number };

export function GovernanceSystemCanvas() {
  const [positions,setPositions] = useState<Position[]>(nodes.map(() => ({x:0,y:0})));
  const [connectors,setConnectors] = useState<Connector[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Array<HTMLElement | null>>([]);
  const drag = useRef<{ index:number; pointerId:number; startX:number; startY:number; origin:Position } | null>(null);
  const clamp = (value:number,limit:number) => Math.max(-limit,Math.min(limit,value));
  const update = (index:number,next:Position) => setPositions(current => current.map((position,nodeIndex) => nodeIndex===index ? next : position));

  useLayoutEffect(() => {
    const measure = () => {
      const canvas=canvasRef.current;
      if (!canvas || nodeRefs.current.some(node=>!node)) return;
      const canvasRect=canvas.getBoundingClientRect();
      const rects=nodeRefs.current.map(node=>node!.getBoundingClientRect());
      setConnectors(rects.slice(0,-1).map((rect,index) => ({
        x1:rect.right-canvasRect.left,
        y1:rect.top+rect.height/2-canvasRect.top,
        x2:rects[index+1].left-canvasRect.left,
        y2:rects[index+1].top+rects[index+1].height/2-canvasRect.top,
      })));
    };
    measure();
    const observer=new ResizeObserver(measure);
    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => observer.disconnect();
  },[positions]);

  return <div ref={canvasRef} className="governanceSystemModel" aria-label="The relationship between the detected model and governed artifacts">
    <svg className="governanceSystemConnectors" aria-hidden="true">
      <defs><marker id="governance-node-endpoint" markerWidth="8" markerHeight="8" refX="4" refY="4"><circle cx="4" cy="4" r="2.5" /></marker></defs>
      {connectors.map((connector,index) => {
        const bend=Math.max(28,(connector.x2-connector.x1)*.48);
        return <path key={index} d={`M ${connector.x1} ${connector.y1} C ${connector.x1+bend} ${connector.y1}, ${connector.x2-bend} ${connector.y2}, ${connector.x2-5} ${connector.y2}`} markerEnd="url(#governance-node-endpoint)" />;
      })}
    </svg>
    {nodes.map((node,index) => <span className="governanceSystemNodeSlot" key={node.label}>
      <article
        ref={element => { nodeRefs.current[index]=element; }}
        className="governanceSystemNode"
        tabIndex={0}
        aria-label={`${node.label}: ${node.title}. Drag or use arrow keys to move this node.`}
        style={{transform:`translate(${positions[index].x}px, ${positions[index].y}px) rotate(${node.rotation}deg)`}}
        onPointerDown={event => {
          drag.current={index,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,origin:positions[index]};
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.classList.add("isDragging");
        }}
        onPointerMove={event => {
          const active=drag.current;
          if (!active || active.index!==index || active.pointerId!==event.pointerId) return;
          update(index,{x:clamp(active.origin.x+event.clientX-active.startX,48),y:clamp(active.origin.y+event.clientY-active.startY,34)});
        }}
        onPointerUp={event => {
          drag.current=null;
          event.currentTarget.releasePointerCapture(event.pointerId);
          event.currentTarget.classList.remove("isDragging");
        }}
        onPointerCancel={event => {
          drag.current=null;
          event.currentTarget.classList.remove("isDragging");
        }}
        onKeyDown={event => {
          const step=event.shiftKey ? 10 : 3;
          const position=positions[index];
          if (event.key==="ArrowLeft") update(index,{...position,x:clamp(position.x-step,48)});
          else if (event.key==="ArrowRight") update(index,{...position,x:clamp(position.x+step,48)});
          else if (event.key==="ArrowUp") update(index,{...position,y:clamp(position.y-step,34)});
          else if (event.key==="ArrowDown") update(index,{...position,y:clamp(position.y+step,34)});
          else return;
          event.preventDefault();
        }}
      >
        <small>{node.label}</small><strong>{node.title}</strong><span>{node.detail}</span>
      </article>
    </span>)}
    <p className="governanceSystemFootnote">This distinction shaped the experience: the model is the subject of the investigation, while its containing artifacts are the units affected by a governance action.</p>
  </div>;
}
