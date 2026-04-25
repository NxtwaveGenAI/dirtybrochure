"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function Loader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const textCharsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const loadTl = gsap.timeline();
    loadTl
      .to(Array.from(textCharsRef.current!.children), {
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power4.out'
      })
      .to(fillRef.current, {
        scaleX: 1,
        duration: 1.6,
        ease: 'power2.inOut',
        onUpdate: function() {
          if (percentRef.current) {
            percentRef.current.textContent = Math.round(this.progress() * 100) + '%';
          }
        }
      }, '-=0.5')
      .to(".loader-text span, .loader-meta, .loader-bar", {
        yPercent: -120,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power4.in'
      }, '+=0.2')
      .to(loaderRef.current, {
        yPercent: -100,
        duration: 1,
        ease: 'power4.inOut'
      }, '-=0.3')
      .set(loaderRef.current, { display: 'none' })
      .call(() => {
        document.body.classList.remove('loading');
        window.dispatchEvent(new Event("loader-done"));
      });
  }, { scope: loaderRef });

  return (
    <div className="loader" ref={loaderRef}>
      <div className="loader-text" ref={textCharsRef}>
        <span>DIRTY</span>
        <span className="red">BROCHURE</span>
      </div>
      <div className="loader-bar"><div className="loader-bar-fill" ref={fillRef}></div></div>
      <div className="loader-meta">
        <span>DECLASSIFYING</span>
        <span className="percent" ref={percentRef}>0%</span>
        <span>STAND BY</span>
      </div>
    </div>
  );
}
