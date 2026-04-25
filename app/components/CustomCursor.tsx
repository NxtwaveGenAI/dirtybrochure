"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const [ringProps, setRingProps] = useState({ className: "cursor-ring" });
  const [cursorProps, setCursorProps] = useState({ className: "cursor" });
  const [labelProps, setLabelProps] = useState({ className: "cursor-label", text: "" });

  useGSAP(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX, ringY = mouseY;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(cursorRef.current, { x: mouseX, y: mouseY, duration: 0.08, ease: "none" });
      gsap.to(labelRef.current, { x: mouseX, y: mouseY, duration: 0.15, ease: "none" });
    };

    window.addEventListener("mousemove", onMouseMove);
    
    gsap.ticker.add(() => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      gsap.set(ringRef.current, { x: ringX, y: ringY });
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      gsap.ticker.remove(() => {});
    };
  });

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || typeof target.closest !== "function") return;
      const el = target.closest("[data-hover]") as HTMLElement;
      if (el) {
        let text: string | null = null;
        if (el.matches(".case")) text = "OPEN FILE";
        else if (el.matches(".m-item")) text = null;
        else if (el.matches("button, .btn, .nav-cta")) text = "CLICK";
        
        setCursorProps({ className: "cursor active" });
        if (text) {
          setRingProps({ className: "cursor-ring active" });
          setLabelProps({ className: "cursor-label active", text });
        } else {
          setRingProps({ className: "cursor-ring active" });
          setLabelProps({ className: "cursor-label", text: "" });
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || typeof target.closest !== "function") return;
      const el = target.closest("[data-hover]");
      if (el) {
        setCursorProps({ className: "cursor" });
        setRingProps({ className: "cursor-ring" });
        setLabelProps({ className: "cursor-label", text: "" });
      }
    };

    const onDragStart = () => {
      setCursorProps({ className: "cursor active" });
      setRingProps({ className: "cursor-ring drag" });
      setLabelProps({ className: "cursor-label active", text: "DRAGGING" });
    };

    const onDragEnd = () => {
      setCursorProps({ className: "cursor" });
      setRingProps({ className: "cursor-ring" });
      setLabelProps({ className: "cursor-label", text: "" });
    };
    
    const onRevealStart = () => {
      setCursorProps({ className: "cursor active" });
      setRingProps({ className: "cursor-ring reveal" });
    };

    const onRevealEnd = () => {
      setCursorProps({ className: "cursor" });
      setRingProps({ className: "cursor-ring" });
    };

    const onComparisonStart = () => {
      setCursorProps({ className: "cursor active" });
      setRingProps({ className: "cursor-ring drag" });
      setLabelProps({ className: "cursor-label active", text: "DRAG" });
    };
    
    const onComparisonHover = () => {
      setCursorProps({ className: "cursor active" });
      setRingProps({ className: "cursor-ring active" });
      setLabelProps({ className: "cursor-label active", text: "DRAG ↔" });
    };

    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("brochure-drag-start", onDragStart);
    window.addEventListener("brochure-drag-end", onDragEnd);
    window.addEventListener("brochure-reveal-start", onRevealStart);
    window.addEventListener("brochure-reveal-end", onRevealEnd);
    window.addEventListener("brochure-comp-start", onComparisonStart);
    window.addEventListener("brochure-comp-hover", onComparisonHover);

    return () => {
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("brochure-drag-start", onDragStart);
      window.removeEventListener("brochure-drag-end", onDragEnd);
      window.removeEventListener("brochure-reveal-start", onRevealStart);
      window.removeEventListener("brochure-reveal-end", onRevealEnd);
      window.removeEventListener("brochure-comp-start", onComparisonStart);
      window.removeEventListener("brochure-comp-hover", onComparisonHover);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className={cursorProps.className}></div>
      <div ref={ringRef} className={ringProps.className}></div>
      <div ref={labelRef} className={labelProps.className}>{labelProps.text}</div>
    </>
  );
}
