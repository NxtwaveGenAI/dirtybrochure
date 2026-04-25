"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable, ScrollTrigger);
}

export function DragGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [caseIndex, setCaseIndex] = useState(1);
  const TOTAL_CASES = 7;

  useGSAP(() => {
    if (!trackRef.current || !wrapRef.current) return;

    function getMaxDrag() {
      if (!trackRef.current) return 0;
      return Math.max(0, trackRef.current.scrollWidth - window.innerWidth + 40);
    }

    function updateDragProgress(x: number) {
      const maxDrag = getMaxDrag();
      const progress = maxDrag > 0 ? Math.abs(x) / maxDrag : 0;
      if (fillRef.current) fillRef.current.style.width = (progress * 100) + "%";
      const idx = Math.min(TOTAL_CASES, Math.floor(progress * TOTAL_CASES) + 1);
      setCaseIndex(idx);
    }

    const draggableArr = Draggable.create(trackRef.current, {
      type: "x",
      inertia: false,
      bounds: { minX: -getMaxDrag(), maxX: 0 },
      edgeResistance: 0.85,
      dragResistance: 0,
      onPress() {
        document.body.classList.add("dragging");
        window.dispatchEvent(new Event("brochure-drag-start"));
      },
      onRelease() {
        document.body.classList.remove("dragging");
        window.dispatchEvent(new Event("brochure-drag-end"));
      },
      onDrag() {
        updateDragProgress(this.x);
      },
      onThrowUpdate() {
        updateDragProgress(this.x);
      }
    });

    const draggable = draggableArr[0];

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) return;
      e.preventDefault();
      const newX = Math.max(-getMaxDrag(), Math.min(0, draggable.x - e.deltaX));
      gsap.to(trackRef.current, {
        x: newX,
        duration: 0.4,
        ease: "power2.out",
        onUpdate: () => {
          draggable.update();
          updateDragProgress(gsap.getProperty(trackRef.current, "x") as number);
        }
      });
    };

    const wrapEl = wrapRef.current;
    wrapEl.addEventListener("wheel", handleWheel, { passive: false });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const rect = wrapEl.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!isInView) return;
        e.preventDefault();
        
        let targetIdx = caseIndex - 1;
        targetIdx += e.key === "ArrowRight" ? 1 : -1;
        targetIdx = Math.max(0, Math.min(TOTAL_CASES - 1, targetIdx));
        
        const cases = trackRef.current!.querySelectorAll(".case") as NodeListOf<HTMLElement>;
        const targetCase = cases[targetIdx];
        if (targetCase) {
          const targetX = Math.max(-getMaxDrag(), -(targetCase.offsetLeft - 40));
          gsap.to(trackRef.current, {
            x: targetX,
            duration: 0.8,
            ease: "power3.out",
            onUpdate: () => {
              draggable.update();
              updateDragProgress(gsap.getProperty(trackRef.current, "x") as number);
            }
          });
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const onResize = () => {
      draggable.applyBounds({ minX: -getMaxDrag(), maxX: 0 });
    };
    window.addEventListener("resize", onResize);

    return () => {
      wrapEl.removeEventListener("wheel", handleWheel);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, { scope: sectionRef });

  return (
    <>
      <div className="marquee">
        <div className="marquee-track">
          {[1,2].map((i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '60px' }}>
              <span className="marquee-item">NO PAID REVIEWS <span className="sep">✦</span></span>
              <span className="marquee-item stroke">ONLY RECEIPTS <span className="sep">✦</span></span>
              <span className="marquee-item">NAMES NAMED <span className="sep">✦</span></span>
              <span className="marquee-item stroke">LIES EXPOSED <span className="sep">✦</span></span>
            </span>
          ))}
        </div>
      </div>

      <section className="drag-section" id="investigations" ref={sectionRef}>
        <div className="drag-header">
          <div className="drag-header-left">
            <div className="label"><span style={{color: "var(--ink-3)", marginRight: "8px"}}>CH 04 //</span>Case files / Published</div>
            <h2>What the glossy<br/>brochure <em>left out.</em></h2>
          </div>
          <p>Seven investigations. Forty-seven interviews. Five years of NIRF data. Drag sideways or scroll to flip through the files. →</p>
        </div>

        <div className="drag-track-wrap" ref={wrapRef}>
          <div className="drag-track" id="dragTrack" ref={trackRef}>
            <article className="case featured" data-hover="true">
              <div className="case-no">CASE FILE № DB-014 // TELANGANA</div>
              <span className="watermark">TOP READ</span>
              <h3>VNR VJIET: The "Tier 1.5" nobody explains</h3>
              <p>Placement numbers averaged a little too conveniently. We pulled five years of NIRF data, cross-checked with 47 recent graduates on LinkedIn, and walked the campus unannounced on a Wednesday afternoon.</p>
              <div className="tags">
                <span className="tag flag">NIRF VERIFIED</span>
                <span className="tag">47 INTERVIEWS</span>
                <span className="tag">ON-SITE</span>
              </div>
              <div className="bottom"><span>23 min · 2.1M views</span><span className="open">OPEN FILE ►</span></div>
            </article>

            <article className="case" data-hover="true">
              <div className="case-no">CASE FILE № DB-013</div>
              <h3>CBIT: Actually worth the tag?</h3>
              <p>Autonomous. Government-affiliated. Cutoffs that make parents cry. But is the classroom experience matching the rank it demands? We audited six departments.</p>
              <div className="tags">
                <span className="tag">6 DEPTS AUDITED</span>
                <span className="tag">CUTOFFS</span>
              </div>
              <div className="bottom"><span>19 min · 880K</span><span className="open">OPEN ►</span></div>
            </article>

            <article className="case" data-hover="true">
              <div className="case-no">№ DB-012</div>
              <h3>The "deemed" trap</h3>
              <p>A growing class of private universities selling dreams at ₹22L+. What "deemed-to-be" actually means — and doesn't.</p>
              <div className="tags"><span className="tag flag">RED FLAG</span></div>
              <div className="bottom"><span>27 min · 1.4M</span><span className="open">OPEN ►</span></div>
            </article>

            <article className="case" data-hover="true">
              <div className="case-no">№ DB-011</div>
              <h3>CVR: The mixed bag</h3>
              <p>Placements are real. The hostel food isn't. We break down what's worth the fee and what's absolutely not.</p>
              <div className="tags"><span className="tag">STUDENT VOICES</span></div>
              <div className="bottom"><span>15 min · 620K</span><span className="open">OPEN ►</span></div>
            </article>

            <article className="case" data-hover="true">
              <div className="case-no">№ DB-010</div>
              <h3>Fake placement posters</h3>
              <p>Six colleges. Same stock photo of "our student at Google." We tracked down who that actually is.</p>
              <div className="tags"><span className="tag flag">INVESTIGATION</span></div>
              <div className="bottom"><span>21 min · 3.2M</span><span className="open">OPEN ►</span></div>
            </article>

            <article className="case" data-hover="true">
              <div className="case-no">CASE FILE № DB-009</div>
              <h3>EAMCET: The college you should've picked</h3>
              <p>We ranked 34 Hyderabad colleges by what actually matters — not by who paid a counselling platform to feature them first.</p>
              <div className="tags">
                <span className="tag">34 COLLEGES</span>
                <span className="tag">EAMCET</span>
              </div>
              <div className="bottom"><span>38 min · 4.3M</span><span className="open">OPEN ►</span></div>
            </article>

            <article className="case" data-hover="true">
              <div className="case-no">№ DB-008</div>
              <h3>"NAAC A++" means nothing</h3>
              <p>How the accreditation became a marketing sticker — and the three things parents should actually ask instead.</p>
              <div className="tags"><span className="tag flag">EXPOSÉ</span></div>
              <div className="bottom"><span>17 min · 1.2M</span><span className="open">OPEN ►</span></div>
            </article>
          </div>
        </div>

        <div className="drag-progress">
          <div className="drag-progress-fill" ref={fillRef}></div>
          <div className="drag-progress-meta">
            <span>FILE <span id="caseIndex">{String(caseIndex).padStart(2, "0")}</span> / {String(TOTAL_CASES).padStart(2, "0")}</span>
            <span className="right">DRAG / SCROLL / ARROWS ↔</span>
          </div>
        </div>
      </section>
    </>
  );
}
