"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function TipForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const [encrypting, setEncrypting] = useState(false);
  const [btnText, setBtnText] = useState("ENCRYPT AND SEND LEAK");

  useGSAP(() => {
    const docs = gsap.utils.toArray('[data-parallax]') as HTMLElement[];
    docs.forEach(el => {
      const speed = parseFloat(el.dataset.parallax || "0.2");
      gsap.to(el, {
        y: () => -window.innerHeight * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('.submit'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });
  }, { scope: sectionRef });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (encrypting) return;
    setEncrypting(true);
    let iter = 0;
    const original = "ENCRYPTING PAYLOAD";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    
    // Quick encryption animation ported from JS inline
    const interval = setInterval(() => {
      setBtnText(original.split("").map((char, index) => {
        if(index < iter) {
          return original[index];
        }
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      
      if(iter >= original.length) { 
        clearInterval(interval);
        setTimeout(() => {
          setBtnText("SECURELY SUBMITTED VIA PGP");
          setEncrypting(false);
        }, 800);
      }
      iter += 1/3;
    }, 30);
  };

  return (
    <section className="submit" id="submit" ref={sectionRef}>
      <div className="doc-bg doc-1" data-parallax="0.2"></div>
      <div className="doc-bg doc-2" data-parallax="0.4"></div>
      <div className="doc-bg doc-3" data-parallax="0.15"></div>

      <div className="submit-form">
        <div className="top-bar">
          <span>SECURE UPLOAD PORTAL</span>
          <span className="dot active"></span>
        </div>
        <div className="pad">
          <h3>Leak a prospectus.<br/>Or an internal memo.</h3>
          <p style={{ marginTop: '10px', color: 'var(--ink-2)', fontSize: '0.9rem', marginBottom: '30px', maxWidth: '400px' }}>
            Got evidence of fabricated placements? Hidden fee structures? Upload it here. We don't log IPs. Use Tor if you're ultra-paranoid: <span style={{color: 'var(--toxic)'}}>dbrochure7zj...onion</span>
          </p>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>COLLEGE NAME // REQUIRED</label>
              <input type="text" placeholder="e.g. SRM Institute..." required />
            </div>
            <div className="form-group">
              <label>WHAT ARE THEY HIDING? // REQUIRED</label>
              <textarea placeholder="Tell us what the brochure didn't..." required></textarea>
            </div>
            <div className="form-group">
              <label>ATTACH EVIDENCE (PDF/JPG) // OPTIONAL</label>
              <div className="file-drop">
                [ DRAG FILES HERE OR CLICK TO BROWSE ]
                <input type="file" style={{opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer'}} />
              </div>
            </div>
            <div style={{ marginTop: '20px' }}></div>
            <button type="submit" className="btn btn-primary" style={{width: '100%'}} data-hover="true" data-magnetic="true" disabled={encrypting}>
              {btnText}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
