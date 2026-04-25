"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function Spotlight() {
  const spotlightRef = useRef<HTMLElement>(null);
  const realLayerRef = useRef<HTMLDivElement>(null);

  const state = useRef({ r: 0, x: 0, y: 0, time: 0 });

  useGSAP(() => {
    let tickId: any = null;

    const updateSpotlight = () => {
      if (!realLayerRef.current) return;
      const { r, x, y, time } = state.current;
      
      if (r <= 0.1) {
        realLayerRef.current.style.clipPath = `circle(0px at ${x}px ${y}px)`;
        (realLayerRef.current.style as any).webkitClipPath = `circle(0px at ${x}px ${y}px)`;
        return;
      }

      // Generate a 32-point blob polygon
      const numPoints = 32;
      const points = [];
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        // complex noise for blobbing
        const noise = Math.sin(time * 3 + i * 1.5) * 12 + Math.cos(time * 2 + i * 0.8) * 12;
        const radius = r + noise * (r / 220); // scale noise by current animated radius
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        points.push(`${px}px ${py}px`);
      }
      
      const clip = `polygon(${points.join(', ')})`;
      realLayerRef.current.style.clipPath = clip;
      (realLayerRef.current.style as any).webkitClipPath = clip;
    };

    const ticker = () => {
      state.current.time += 0.02;
      updateSpotlight();
    };

    let holdTimer: NodeJS.Timeout | null = null;

    const onEnter = () => {
      gsap.to(state.current, {
        r: 220,
        duration: 0.6,
        ease: 'power3.out'
      });
      window.dispatchEvent(new Event("brochure-reveal-start"));
      
      holdTimer = setTimeout(() => {
        gsap.to(state.current, {
          r: 2500,
          duration: 1.2,
          ease: 'power2.inOut'
        });
      }, 1000);
    };

    const onLeave = () => {
      if (holdTimer) clearTimeout(holdTimer);
      gsap.to(state.current, {
        r: 0,
        duration: 0.5,
        ease: 'power3.in'
      });
      window.dispatchEvent(new Event("brochure-reveal-end"));
    };

    const onMove = (e: MouseEvent) => {
      if (!spotlightRef.current) return;
      const rect = spotlightRef.current.getBoundingClientRect();
      state.current.x = e.clientX - rect.left;
      state.current.y = e.clientY - rect.top;
    };

    const el = spotlightRef.current;
    if (el) {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
      el.addEventListener('mousemove', onMove);
    }
    gsap.ticker.add(ticker);

    return () => {
      gsap.ticker.remove(ticker);
      if (el) {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        el.removeEventListener('mousemove', onMove);
      }
    };
  }, { scope: spotlightRef });

  return (
    <section className="spotlight" id="spotlight" ref={spotlightRef}>
      <div className="spotlight-label"><span style={{color: "var(--ink-3)", marginRight: "8px"}}>CH 02 //</span>Move your cursor</div>
      <div className="spotlight-layer spotlight-fake-layer">
        <h2 className="spotlight-fake">
          Every engineering college claims <em>98% placements,</em> world-class faculty, and industry partners waiting for you on day one.
        </h2>
      </div>
      <div className="spotlight-layer spotlight-real-layer" id="spotlightRealLayer" ref={realLayerRef}>
        <h2 className="spotlight-real">
          Behind the brochure: <em>61% actual placement,</em> 40% ghost faculty, and "partnerships" that are just logos in a PDF.
        </h2>
      </div>
    </section>
  );
}
