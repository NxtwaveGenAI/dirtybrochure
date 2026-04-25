"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo('.footer-huge',
      { y: 100, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: footerRef.current, start: 'top 75%' }
      }
    );
  }, { scope: footerRef });

  return (
    <footer ref={footerRef}>
      <div className="footer-top">
        <h2 className="footer-huge">DON'T TAKE<br/>THEIR WORD<br/>FOR IT.</h2>
        <div className="footer-links">
          <div className="col">
            <span className="col-title">THE ARCHIVE</span>
            <a href="#">NIRF Discrepancies</a>
            <a href="#">Placement Lies</a>
            <a href="#">Deemed Univ List</a>
            <a href="#">Faculty Audits</a>
          </div>
          <div className="col">
            <span className="col-title">CONNECT</span>
            <a href="#">YouTube</a>
            <a href="#">X / Twitter</a>
            <a href="#">Instagram</a>
            <a href="#">Substack</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 DIRTY BROCHURE MEDIA</span>
        <span style={{textAlign: 'right'}}>INDEPENDENT. UNCENSORED. UNPAID.<br/><span style={{opacity: 0.5}}>BASED IN HYDERABAD, INDIA.</span></span>
      </div>
    </footer>
  );
}
