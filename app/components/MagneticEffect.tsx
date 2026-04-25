"use client";

import { useEffect } from "react";
import gsap from "gsap";

export function MagneticEffect() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || typeof target.closest !== "function") return;
      const btn = target.closest("[data-magnetic]") as HTMLElement;
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.5, ease: 'power3.out' });
      }
    };
    
    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || typeof target.closest !== "function") return;
      const btn = target.closest("[data-magnetic]") as HTMLElement;
      if (btn) {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
    };
  }, []);

  return null;
}
