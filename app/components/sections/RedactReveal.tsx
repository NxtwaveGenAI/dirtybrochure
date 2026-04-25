"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function RedactReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const totalRedactCount = 5;
  const [revealedCount, setRevealedCount] = useState(0);
  const countRef = useRef({ v: 0 });
  
  useGSAP(() => {
    const blocks = gsap.utils.toArray('.redact-block') as HTMLElement[];
    let rCount = 0;

    blocks.forEach((block) => {
      ScrollTrigger.create({
        trigger: block,
        start: 'top 65%',
        onEnter: () => {
          block.classList.add('revealed');
          rCount++;
          gsap.to(countRef.current, {
            v: rCount,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: () => setRevealedCount(Math.round(countRef.current.v))
          });
        },
        onLeaveBack: () => {
          block.classList.remove('revealed');
          rCount--;
          gsap.to(countRef.current, {
            v: rCount,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: () => setRevealedCount(Math.round(countRef.current.v))
          });
        }
      });
    });
  }, { scope: sectionRef });

  return (
    <section className="redact-section" id="archive" ref={sectionRef}>
      <div className="redact-inner">
        <div className="redact-label"><span style={{color: "var(--ink-3)", marginRight: "8px"}}>CH 05 //</span>Scroll to declassify</div>
        
        <div className="redact-doc">
          The placement report for the academic year 
          <span className="redact-block">2023–24</span> 
          shows an average package of 
          <span className="redact-block">₹6.2L</span> 
          — not the 
          <span className="redact-block">₹14.5L</span> 
          advertised in the prospectus. Only 
          <span className="redact-block">61%</span> 
          of eligible students received an offer. Three companies — 
          <span className="redact-block">named in the full report</span> 
          — contributed to more than half of all "placements." 
          The "world-class faculty" section counts 
          <span className="redact-block">14 guest lecturers</span> 
          who teach one session a year.
          
          <div className="redact-counter">
            <span className="n" id="declassN">{revealedCount}</span>/6 DECLASSIFIED
          </div>
        </div>
      </div>
    </section>
  );
}
