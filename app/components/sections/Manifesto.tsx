"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo('.manifesto-title',
      { opacity: 0, y: 60 },
      {
        opacity: 1, y: 0,
        duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.manifesto-title', start: 'top 80%' }
      }
    );

    const items = gsap.utils.toArray('.m-item') as HTMLElement[];
    items.forEach(item => {
      const onMouseMove = (e: MouseEvent) => {
        const rect = item.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(item, {
          rotateY: x * 6,
          rotateX: -y * 6,
          duration: 0.5,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      };
      
      const onMouseLeave = () => {
        gsap.to(item, {
          rotateY: 0, rotateX: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.5)'
        });
      };

      item.addEventListener('mousemove', onMouseMove);
      item.addEventListener('mouseleave', onMouseLeave);
      
      return () => {
        item.removeEventListener('mousemove', onMouseMove);
        item.removeEventListener('mouseleave', onMouseLeave);
      };
    });
  }, { scope: sectionRef });

  return (
    <section className="manifesto" id="manifesto" ref={sectionRef}>
      <h2 className="manifesto-title">THIS IS A <span className="red">WARNING</span><br/>NOT A BROCHURE.</h2>
      <div className="manifesto-grid">
        <div className="m-item" data-hover="true">
          <div className="m-no">01</div>
          <h3>NO SPONSORED CONTENT</h3>
          <p>We do not take a single rupee from any educational institution. Period. The moment they pay us, we work for them. We work for you.</p>
        </div>
        <div className="m-item" data-hover="true">
          <div className="m-no">02</div>
          <h3>ONLY RECEIPTS</h3>
          <p>If we claim a placement number is fake, we link the NIRF data, the PF accounts, and the LinkedIn alumni counts. Proof over promises.</p>
        </div>
        <div className="m-item" data-hover="true">
          <div className="m-no">03</div>
          <h3>NAMING NAMES</h3>
          <p>No "Tier 3 college in Hyderabad" vague posts. If they lied on the prospectus, their logo and name go on the front page of the report.</p>
        </div>
        <div className="m-item" data-hover="true">
          <div className="m-no">04</div>
          <h3>PROTECTING SOURCES</h3>
          <p>Students who leak faculty attendance records or fee hiking internal circulars remain 100% anonymous. We take the legal letters. Not you.</p>
        </div>
      </div>
    </section>
  );
}
