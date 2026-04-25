"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const stats = gsap.utils.toArray('.stat-item') as HTMLElement[];
    stats.forEach(stat => {
      const targetEl = stat.querySelector('[data-count]') as HTMLElement;
      if (!targetEl) return;
      
      const target = parseInt(targetEl.dataset.count || "0");
      const counter = stat.querySelector('.count') as HTMLElement;
      
      ScrollTrigger.create({
        trigger: stat,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to({ v: 0 }, {
            v: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function() {
              const val = Math.round(this.targets()[0].v);
              counter.textContent = val.toLocaleString();
            }
          });
        }
      });
    });
  }, { scope: sectionRef });

  return (
    <section className="stats" ref={sectionRef}>
      <div className="stat-item">
        <div className="count-wrap"><span className="count" data-count="342">0</span></div>
        <div className="stat-label">COLLEGES AUDITED</div>
      </div>
      <div className="stat-item">
        <div className="count-wrap"><span className="count" data-count="1480">0</span></div>
        <div className="stat-label">STUDENTS INTERVIEWED</div>
      </div>
      <div className="stat-item">
        <div className="count-wrap">₹<span className="count" data-count="240">0</span>CR+</div>
        <div className="stat-label">IN UNJUSTIFIED FEES EXPOSED</div>
      </div>
    </section>
  );
}
