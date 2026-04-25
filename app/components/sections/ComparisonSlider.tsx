"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ComparisonSlider() {
  const compRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const realityRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  
  const compPosRef = useRef({ p: 50 });
  const [compDragging, setCompDragging] = useState(false);

  const setComp = (pct: number) => {
    const p = Math.max(0, Math.min(100, pct));
    compPosRef.current.p = p;
    if (realityRef.current) realityRef.current.style.clipPath = `inset(0 0 0 ${p}%)`;
    if (handleRef.current) handleRef.current.style.left = `${p}%`;
  };

  const compMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setComp(pct);
  };

  useGSAP(() => {
    let _dragging = false;

    const onMouseDown = (e: MouseEvent) => {
      _dragging = true;
      setCompDragging(true);
      window.dispatchEvent(new Event("brochure-comp-start"));
      compMove(e.clientX);
    };

    const onMouseEnter = () => {
      if (!_dragging) window.dispatchEvent(new Event("brochure-comp-hover"));
    };

    const onMouseLeave = () => {
      if (!_dragging) window.dispatchEvent(new Event("mouseout"));
    };

    const onMouseMove = (e: MouseEvent) => {
      if (_dragging) compMove(e.clientX);
    };

    const onMouseUp = () => {
      if (_dragging) {
        _dragging = false;
        setCompDragging(false);
        window.dispatchEvent(new Event("mouseout"));
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      _dragging = true;
      setCompDragging(true);
      compMove(e.touches[0].clientX);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (_dragging) compMove(e.touches[0].clientX);
    };

    const onTouchEnd = () => {
      _dragging = false;
      setCompDragging(false);
    };

    const target = sliderRef.current;
    if (target) {
      target.addEventListener('mousedown', onMouseDown);
      target.addEventListener('mouseenter', onMouseEnter);
      target.addEventListener('mouseleave', onMouseLeave);
      target.addEventListener('touchstart', onTouchStart);
    }
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    setComp(50);

    ScrollTrigger.create({
      trigger: sliderRef.current,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        gsap.fromTo(compPosRef.current, { p: 50 }, {
          p: 75,
          duration: 1.5,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: 1,
          onUpdate: () => {
            if (!_dragging) setComp(compPosRef.current.p);
          }
        });
      }
    });

    return () => {
      if (target) {
        target.removeEventListener('mousedown', onMouseDown);
        target.removeEventListener('mouseenter', onMouseEnter);
        target.removeEventListener('mouseleave', onMouseLeave);
        target.removeEventListener('touchstart', onTouchStart);
      }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, { scope: compRef });

  return (
    <section className="comparison" id="compSection" ref={compRef}>
      <div className="label"><span style={{color: "var(--warning)", marginRight: "8px"}}>CH 06 //</span>The Contrast</div>
      <div className="comparison-slider" id="compSlider" ref={sliderRef}>
        <div className="comparison-side reality" ref={realityRef}>
          <div className="comparison-img img-reality"></div>
          <div className="comparison-label">THE REALITY // NO EQUIPMENT, RUSTING LAB</div>
        </div>
        <div className="comparison-side brochure">
          <div className="comparison-img img-brochure"></div>
          <div className="comparison-label">THE BROCHURE // "STATE OF THE ART FACILITIES"</div>
        </div>
        <div className="comparison-handle" ref={handleRef}>
          <div className="handle-line"></div>
          <div className="handle-dot"></div>
          <div className="handle-line"></div>
        </div>
      </div>
    </section>
  );
}
