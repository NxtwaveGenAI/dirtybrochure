"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function Navigation() {
  const navRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    let lastScroll = 0;
    const onScroll = () => {
      const current = window.pageYOffset;
      if (current > 200 && current > lastScroll) {
        gsap.to(navRef.current, { y: -100, duration: 0.4, ease: "power2.out" });
      } else {
        gsap.to(navRef.current, { y: 0, duration: 0.4, ease: "power2.out" });
      }
      lastScroll = current;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  });

  return (
    <>
      <div className="tape">
        <div className="tape-track">
          <span>⚠ CONFIDENTIAL INVESTIGATION</span><span className="dot">●</span>
          <span>COLLEGES DON'T WANT YOU READING THIS</span><span className="dot">●</span>
          <span>NEW EPISODE EVERY FRIDAY</span><span className="dot">●</span>
          <span>UNCENSORED · UNPAID · UNAFRAID</span><span className="dot">●</span>
          <span>TIP-OFFS WELCOME</span><span className="dot">●</span>
          <span>⚠ CONFIDENTIAL INVESTIGATION</span><span className="dot">●</span>
          <span>COLLEGES DON'T WANT YOU READING THIS</span><span className="dot">●</span>
          <span>NEW EPISODE EVERY FRIDAY</span><span className="dot">●</span>
        </div>
      </div>
      <nav ref={navRef}>
        <div className="logo">
          <span className="badge">DB</span>
          <span>DIRTY<br/>BROCHURE</span>
        </div>
        <ul className="nav-links">
          <li><a href="#investigations" data-hover="true"><span className="nav-counter">01</span>Investigations</a></li>
          <li><a href="#manifesto" data-hover="true"><span className="nav-counter">02</span>Manifesto</a></li>
          <li><a href="#submit" data-hover="true"><span className="nav-counter">03</span>Tip Us Off</a></li>
          <li><a href="#archive" data-hover="true"><span className="nav-counter">04</span>Archive</a></li>
        </ul>
        <button className="nav-cta" data-hover="true" data-magnetic="true">Watch Latest ►</button>
      </nav>
    </>
  );
}
