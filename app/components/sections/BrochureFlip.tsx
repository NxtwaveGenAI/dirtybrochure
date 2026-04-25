"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function BrochureFlip() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  
  const [currentLeftIdx, setCurrentLeftIdx] = useState(0);
  const [flippedCount, setFlippedCount] = useState(0);

  const leftPageData = [
    {
      title: "VNR VJIET<br><em>Prospectus 2024</em>",
      meta: [
        ["Location", "Bachupally, Hyderabad"],
        ["Fees / Yr", "₹1.45 Lakh"],
        ["NIRF Rank", "101–150 Band"],
        ["Est.", "1995"],
        ["Status", "Investigated"],
        ["File Size", "23 MIN READ"]
      ]
    },
    {
      title: "Faculty Audit<br><em>Deep Dive</em>",
      meta: [
        ["Departments", "6 Audited"],
        ["Full-time", "78 Confirmed"],
        ["Guest", "14 Listed"],
        ["PhD Verified", "31 of 52"],
        ["Dept Heads", "6 Contacted"],
        ["Method", "RTI + Interview"]
      ]
    },
    {
      title: "Campus Reality<br><em>On-Site Visit</em>",
      meta: [
        ["Visit Date", "Apr 17, 2026"],
        ["Duration", "6 Hours"],
        ["Walked", "Unannounced"],
        ["Claimed Area", "45 Acres"],
        ["Actual Owned", "23 Acres"],
        ["Photos Taken", "247 Archived"]
      ]
    },
    {
      title: "Industry MoUs<br><em>Verification</em>",
      meta: [
        ["Logos Claimed", "500+"],
        ["MoUs Active", "7 Verified"],
        ["RTI Filed", "Feb 2026"],
        ["Response Days", "34"],
        ["Students Surveyed", "240"],
        ["Method", "Legal + Survey"]
      ]
    }
  ];

  useGSAP(() => {
    const brochurePages = gsap.utils.toArray(".brochure-page") as HTMLElement[];
    const totalPages = brochurePages.length;

    brochurePages.forEach((page, i) => {
      page.style.zIndex = (totalPages - i).toString();
    });

    gsap.set(stageRef.current, { scale: 0.4, opacity: 0, rotateX: 20 });
    gsap.set(railRef.current, { x: 0 });

    const brochureTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=550%",
        pin: pinRef.current,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;

          let flipped = 0;
          const flipStart = 0.22;
          const flipEnd = 0.82;
          const flipRange = flipEnd - flipStart;
          const perPage = flipRange / totalPages;

          for (let i = 0; i < totalPages; i++) {
            const pageStart = flipStart + i * perPage;
            if (p >= pageStart + perPage * 0.6) flipped++;
          }

          setFlippedCount(flipped);
          if (fillRef.current) fillRef.current.style.width = (flipped / totalPages * 100) + "%";
          setCurrentLeftIdx(Math.min(totalPages - 1, Math.max(0, flipped)));
        }
      }
    });

    brochureTl.to(introRef.current, {
      opacity: 0,
      scale: 0.92,
      y: -50,
      duration: 0.08,
      ease: "power3.in"
    }, 0);

    brochureTl.set(introRef.current, { visibility: "hidden", pointerEvents: "none" }, 0.085);
    brochureTl.set(introRef.current, { visibility: "visible", pointerEvents: "auto" }, 0.075);

    brochureTl.to(stageRef.current, {
      scale: 1,
      opacity: 1,
      rotateX: 0,
      duration: 0.10,
      ease: "power3.out"
    }, 0.10);

    const flipStart = 0.22;
    const flipEnd = 0.82;
    const flipRange = flipEnd - flipStart;
    const perPage = flipRange / totalPages;

    brochurePages.forEach((page, i) => {
      const pageStart = flipStart + i * perPage;
      brochureTl.to(page, {
        rotateY: -180,
        duration: perPage,
        ease: "power2.inOut",
        onStart: () => { page.style.zIndex = (totalPages + 10).toString(); },
        onComplete: () => { page.style.zIndex = i.toString(); },
        onReverseComplete: () => { page.style.zIndex = (totalPages - i).toString(); }
      }, pageStart);
    });

    brochureTl.to(railRef.current, {
      x: "-100vw",
      duration: 0.18,
      ease: "power3.inOut"
    }, 0.82);

    brochureTl.to([
      ".brochure-hud",
      ".brochure-counter-big",
      ".brochure-progress-top"
    ], {
      opacity: 0,
      duration: 0.10,
      ease: "power2.in"
    }, 0.86);
  }, { scope: sectionRef });

  const activeData = leftPageData[currentLeftIdx] || leftPageData[0];
  const flipStart2 = 0.22;
  const flipEnd2 = 0.82;
  // Approximation of progress purely driven by flippedCount for style changes doesn't quite work because classes rely on exact p. We'll rely on flippedCount.

  return (
    <section className="brochure-section" id="brochure" ref={sectionRef}>
      <div className="brochure-pin" id="brochurePin" ref={pinRef}>
        <div className="brochure-intro" id="brochureIntro" ref={introRef}>
          <div className="label"><span style={{color: "var(--ink-3)", marginRight: "8px"}}>CH 03 //</span>Scroll to flip</div>
          <h2>One brochure.<br/>Two <em>very different</em> stories.</h2>
          <p>Keep scrolling. Each page of the glossy prospectus flips to reveal what we actually found. Don't look away.</p>
        </div>

        <div className="brochure-hud" id="brochureHud">
          <div className="hud-label">▸ FLIPPING THROUGH</div>
          {["01 · PLACEMENTS", "02 · FACULTY", "03 · INFRA", "04 · PARTNERS"].map((label, i) => (
            <div key={i} className={`hud-row ${i < flippedCount ? "done" : ""} ${i === flippedCount ? "active" : ""}`}>
              <span className="hud-dot"></span><span>{label}</span>
            </div>
          ))}
        </div>

        <div className="brochure-counter-big">
          <span className="current" id="brochCurrent">{String(flippedCount).padStart(2, "0")}</span>
          <span className="total">/ 04</span>
          <span className="label">PAGES TURNED</span>
        </div>

        <div className="brochure-progress-top">
          <div className="labels">
            <span>▸ GLOSSY LIES</span>
            <span className="right">DIRTY TRUTH ►</span>
          </div>
          <div className="brochure-progress-top-fill" id="brochFill" ref={fillRef}></div>
        </div>

        <div className="brochure-rail" id="brochureRail" ref={railRef}>
          <div className="rail-panel">
            <div className="brochure-stage" id="brochureStage" ref={stageRef}>
              <div className="brochure-book" id="brochureBook">
                <div className="brochure-left-static" id="leftStatic">
                  <div className="left-static-label">▸ THE FILE // DB-014</div>
                  <div className="left-static-title" id="leftTitle" dangerouslySetInnerHTML={{ __html: activeData.title }} />
                  <div className="left-static-meta" id="leftMeta">
                    {activeData.meta.map(([k, v], idx) => (
                      <div key={idx}><span className="k">{k}</span><span>{v}</span></div>
                    ))}
                  </div>
                </div>

                <div className="brochure-spine"></div>

                <div className="brochure-right">
                  <div className="brochure-page" data-page="0">
                    <div className="page-face page-front">
                      <div className="broch-tag">▸ Placement Record // 2023–24</div>
                      <div className="broch-title">World-class placements<br/><em>for every graduate.</em></div>
                      <div className="broch-big-stat">98<span className="u">%</span></div>
                      <div className="broch-caption">
                        "Our students are placed at top-tier companies including Google, Microsoft, Amazon, Adobe, and more — with an average package of ₹14.5L per annum and a highest package reaching ₹45L."
                      </div>
                      <div className="broch-badges">
                        <span className="broch-badge gold">PREMIUM PLACEMENTS</span>
                        <span className="broch-badge">500+ RECRUITERS</span>
                        <span className="broch-badge">₹45L HIGHEST</span>
                      </div>
                    </div>
                    <div className="page-face page-back">
                      <div className="dirty-stamp">EXPOSED</div>
                      <div className="dirty-tag">ACTUAL DATA // NIRF + 47 INTERVIEWS</div>
                      <div className="dirty-title">Only <em>61% got a real offer.</em></div>
                      <div className="dirty-big-stat">61<span className="u">%</span></div>
                      <div className="dirty-caption">
                        Average calculated using 3 outliers at one tech firm. Median package: ₹4.8L. 38 students signed attendance sheets during placement drives without interviewing — and were counted as "placed." The ₹45L highest package was one student, pre-placement offer from family business.
                      </div>
                      <div className="dirty-receipts">
                        <span>NIRF 2024 ✓</span><span>LinkedIn cross-check ✓</span><span>On-record students ✓</span>
                      </div>
                    </div>
                  </div>

                  <div className="brochure-page" data-page="1">
                    <div className="page-face page-front">
                      <div className="broch-tag">▸ Faculty // World-Class Mentors</div>
                      <div className="broch-title">200+ expert faculty<br/><em>to guide your journey.</em></div>
                      <div className="broch-big-stat">200<span className="u">+</span></div>
                      <div className="broch-caption">
                        "Learn from India's finest — PhDs from IITs, IISc, and leading global universities. Our faculty-to-student ratio ensures personalised mentorship throughout your degree."
                      </div>
                      <div className="broch-badges">
                        <span className="broch-badge gold">IIT PHDs</span>
                        <span className="broch-badge">1:15 RATIO</span>
                        <span className="broch-badge">GLOBAL ALUMNI</span>
                      </div>
                    </div>
                    <div className="page-face page-back">
                      <div className="dirty-stamp">GHOSTS</div>
                      <div className="dirty-tag">FACULTY AUDIT // 6 DEPARTMENTS</div>
                      <div className="dirty-title">40% are <em>listed but never show up.</em></div>
                      <div className="dirty-big-stat">40<span className="u">%</span></div>
                      <div className="dirty-caption">
                        14 names on the website teach one "guest lecture" per year. Full-time core faculty: 78. Actual student-to-teacher ratio in CSE: 1:52. Three "PhD-from-IIT" claims traced to online diploma programs. Students reported entire subjects being self-study for full semesters.
                      </div>
                      <div className="dirty-receipts">
                        <span>Website vs timetable ✓</span><span>6 dept heads contacted ✓</span><span>Certificate verified ✓</span>
                      </div>
                    </div>
                  </div>

                  <div className="brochure-page" data-page="2">
                    <div className="page-face page-front">
                      <div className="broch-tag">▸ Infrastructure // State-of-the-Art</div>
                      <div className="broch-title">World-class labs<br/><em>on a sprawling campus.</em></div>
                      <div className="broch-big-stat">45<span className="u">AC</span></div>
                      <div className="broch-caption">
                        "45-acre green campus with cutting-edge labs, modern hostels, Olympic-sized pool, sports complex, 24/7 library, and the country's most advanced AI research centre."
                      </div>
                      <div className="broch-badges">
                        <span className="broch-badge gold">AI RESEARCH CENTRE</span>
                        <span className="broch-badge">24/7 LIBRARY</span>
                        <span className="broch-badge">OLYMPIC POOL</span>
                      </div>
                    </div>
                    <div className="page-face page-back">
                      <div className="dirty-stamp">FICTION</div>
                      <div className="dirty-tag">ON-SITE VISIT // APR 17, 2026</div>
                      <div className="dirty-title">We walked in. <em>Half of it doesn't exist.</em></div>
                      <div className="dirty-big-stat">½<span className="u">GONE</span></div>
                      <div className="dirty-caption">
                        "AI Research Centre" = one locked room with a server donated in 2019. Library closes at 8 PM. Swimming pool under construction since 2021. Hostel WiFi ₹500/month extra. The "45-acre" figure includes a forest preserve the college doesn't own. Photos in brochure taken at a different institution in 2018.
                      </div>
                      <div className="dirty-receipts">
                        <span>Campus visit ✓</span><span>Photo forensics ✓</span><span>Hostel receipts ✓</span>
                      </div>
                    </div>
                  </div>

                  <div className="brochure-page" data-page="3">
                    <div className="page-face page-front">
                      <div className="broch-tag">▸ Industry Partners // 500+ Brands</div>
                      <div className="broch-title">Backed by<br/><em>500+ industry giants.</em></div>
                      <div className="broch-big-stat">500<span className="u">+</span></div>
                      <div className="broch-caption">
                        "Active MoUs with Google, Microsoft, TCS, Infosys, Wipro, Accenture, and 500+ leading companies. Guaranteed internship opportunities and live industry projects every semester."
                      </div>
                      <div className="broch-badges">
                        <span className="broch-badge gold">GOOGLE MoU</span>
                        <span className="broch-badge">LIVE PROJECTS</span>
                        <span className="broch-badge">GUARANTEED INTERN</span>
                      </div>
                    </div>
                    <div className="page-face page-back">
                      <div className="dirty-stamp">LOGOS</div>
                      <div className="dirty-tag">MoU VERIFICATION // RTI FILED</div>
                      <div className="dirty-title">The "partners" are just <em>logos in a PDF.</em></div>
                      <div className="dirty-big-stat">7<span className="u">REAL</span></div>
                      <div className="dirty-caption">
                        Of 500+ logos, only 7 have active, signed MoUs verifiable via RTI. Google MoU expired 2019. "Live industry projects" = one intern project shared across six batches. 62% of students reported no industry contact during their degree. Most logos sourced from a public list of HR vendors who visited once in 2017.
                      </div>
                      <div className="dirty-receipts">
                        <span>RTI response ✓</span><span>MoU copies requested ✓</span><span>Student survey n=240 ✓</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div className="rail-panel outro">
            <div className="brochure-outro" id="brochureOutro">
              <div className="tag">▸ INVESTIGATION COMPLETE</div>
              <h3>Every brochure lies.<br/><em>We read the back.</em></h3>
              <div className="outro-meta">
                <span>4 LIES EXPOSED</span>
                <span>47 INTERVIEWS</span>
                <span>NIRF VERIFIED</span>
                <span>RTI FILED</span>
              </div>
              <button 
                className="outro-cta" 
                onClick={() => document.querySelector('#investigations')?.scrollIntoView({behavior:'smooth'})}
                data-magnetic="true"
              >
                READ THE FULL FILES →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
