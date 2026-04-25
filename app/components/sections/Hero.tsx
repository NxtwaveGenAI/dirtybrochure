"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    gsap.to('.hero-canvas', { opacity: 1, duration: 1, delay: 0.2 });

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const sample = document.createElement('canvas');
    const sampleCtx = sample.getContext('2d', { willReadFrequently: true });
    if (!sampleCtx) return;

    let W = 0, H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const words = [
      { text: 'DIRTY',    sub: 'BROCHURE',     color: '#ff2d1f' },
      { text: 'READ',     sub: 'THE BACK',     color: '#f2f2f2' },
      { text: 'NO PAID',  sub: 'REVIEWS',      color: '#ffd60a' },
      { text: 'EXPOSED',  sub: '× 47',         color: '#c4ff3d' }
    ];
    let wordIndex = 0;
    interface Particle { x: number; y: number; homeX: number; homeY: number; vx: number; vy: number; size: number; color: string; alpha: number; drift: number; driftSpeed: number; }
    let particles: Particle[] = [];

    function sizeCanvas() {
      if (!section || !canvas) return;
      const r = section.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      sample.width = W;
      sample.height = H;
    }

    function sampleText(line1: string, line2: string) {
      sampleCtx!.clearRect(0, 0, W, H);
      sampleCtx!.fillStyle = '#fff';
      sampleCtx!.textAlign = 'center';
      sampleCtx!.textBaseline = 'middle';

      const fontSize1 = Math.min(W * 0.16, H * 0.30);
      const fontSize2 = fontSize1 * 0.55;

      sampleCtx!.font = `900 ${fontSize1}px "Anton", "Archivo Black", sans-serif`;
      sampleCtx!.fillText(line1, W / 2, H / 2 - fontSize1 * 0.30);

      sampleCtx!.font = `italic 400 ${fontSize2}px "Instrument Serif", serif`;
      sampleCtx!.fillText(line2, W / 2, H / 2 + fontSize1 * 0.40);

      const data = sampleCtx!.getImageData(0, 0, W, H).data;

      const step = Math.max(2, Math.floor(W / 480));
      const positions = [];
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          const idx = (y * W + x) * 4 + 3;
          if (data[idx] > 128) {
            positions.push({ x: x + (Math.random() - 0.5) * step, y: y + (Math.random() - 0.5) * step });
          }
        }
      }
      return positions;
    }

    function buildParticles() {
      const w = words[wordIndex];
      const positions = sampleText(w.text, w.sub);

      if (particles.length === 0) {
        positions.forEach(pos => {
          particles.push({
            x: W / 2 + (Math.random() - 0.5) * W,
            y: H / 2 + (Math.random() - 0.5) * H,
            homeX: pos.x,
            homeY: pos.y,
            vx: 0,
            vy: 0,
            size: 0.6 + Math.random() * 1.4,
            color: w.color,
            alpha: 0.5 + Math.random() * 0.5,
            drift: Math.random() * Math.PI * 2,
            driftSpeed: 0.001 + Math.random() * 0.002
          });
        });
      } else {
        for (let i = 0; i < particles.length; i++) {
          if (i < positions.length) {
            particles[i].homeX = positions[i].x;
            particles[i].homeY = positions[i].y;
            particles[i].color = w.color;
          } else {
            particles[i].homeX = W / 2 + (Math.random() - 0.5) * W * 1.4;
            particles[i].homeY = H / 2 + (Math.random() - 0.5) * H * 1.4;
            particles[i].color = w.color;
          }
        }
        for (let i = particles.length; i < positions.length; i++) {
          particles.push({
            x: W / 2 + (Math.random() - 0.5) * W,
            y: H / 2 + (Math.random() - 0.5) * H,
            homeX: positions[i].x,
            homeY: positions[i].y,
            vx: 0,
            vy: 0,
            size: 0.6 + Math.random() * 1.4,
            color: w.color,
            alpha: 0.5 + Math.random() * 0.5,
            drift: Math.random() * Math.PI * 2,
            driftSpeed: 0.001 + Math.random() * 0.002
          });
        }
        if (particles.length > positions.length * 1.5) {
          particles.length = positions.length;
        }
      }
    }

    sizeCanvas();
    buildParticles();

    let mx = -9999, my = -9999;
    let prevMx = mx, prevMy = my;
    let mouseVx = 0, mouseVy = 0;
    let isDragging = false;

    const onSectionMouseMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    
    const onSectionMouseLeave = () => {
      mx = -9999; my = -9999;
      isDragging = false;
    };

    section.addEventListener('mousemove', onSectionMouseMove);
    section.addEventListener('mouseleave', onSectionMouseLeave);

    let downX = 0, downY = 0;
    const onCanvasMouseDown = (e: MouseEvent) => {
      downX = e.clientX; downY = e.clientY;
      isDragging = true;
    };
    
    const onWindowMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        const dx = Math.abs(e.clientX - downX);
        const dy = Math.abs(e.clientY - downY);
        if (dx < 5 && dy < 5) {
          wordIndex = (wordIndex + 1) % words.length;
          buildParticles();
        }
      }
      isDragging = false;
    };

    canvas.addEventListener('mousedown', onCanvasMouseDown);
    window.addEventListener('mouseup', onWindowMouseUp);

    const onTouchStart = (e: TouchEvent) => {
      const r = section.getBoundingClientRect();
      mx = e.touches[0].clientX - r.left;
      my = e.touches[0].clientY - r.top;
      isDragging = true;
      downX = e.touches[0].clientX;
      downY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const r = section.getBoundingClientRect();
      mx = e.touches[0].clientX - r.left;
      my = e.touches[0].clientY - r.top;
    };
    const onTouchEnd = () => {
      isDragging = false;
      mx = -9999; my = -9999;
    };

    section.addEventListener('touchstart', onTouchStart, { passive: true });
    section.addEventListener('touchmove', onTouchMove, { passive: true });
    section.addEventListener('touchend', onTouchEnd);

    let animationFrameId: number;
    function tick() {
      if (!ctx) return;
      mouseVx = mx - prevMx;
      mouseVy = my - prevMy;
      prevMx = mx;
      prevMy = my;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.fillRect(0, 0, W, H);

      const radius = isDragging ? 200 : 130;
      const radiusSq = radius * radius;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (mx > -1000) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const distSq = dx * dx + dy * dy;
          if (distSq < radiusSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const influence = (1 - dist / radius);
            const pushForce = isDragging ? 1.6 : 0.6;
            p.vx += (dx / dist) * influence * pushForce;
            p.vy += (dy / dist) * influence * pushForce;
            if (isDragging) {
              p.vx += mouseVx * influence * 0.22;
              p.vy += mouseVy * influence * 0.22;
            }
          }
        }

        const homeDx = p.homeX - p.x;
        const homeDy = p.homeY - p.y;
        p.vx += homeDx * 0.018;
        p.vy += homeDy * 0.018;

        p.drift += p.driftSpeed;
        p.vx += Math.cos(p.drift) * 0.02;
        p.vy += Math.sin(p.drift * 1.3) * 0.02;

        p.vx *= 0.92;
        p.vy *= 0.92;

        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(tick);
    }
    
    tick();

    let resizeTimer: any = null;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        sizeCanvas();
        const w = words[wordIndex];
        const positions = sampleText(w.text, w.sub);
        for (let i = 0; i < particles.length; i++) {
          if (i < positions.length) {
            particles[i].homeX = positions[i].x;
            particles[i].homeY = positions[i].y;
          }
        }
      }, 200);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      section.removeEventListener('mousemove', onSectionMouseMove);
      section.removeEventListener('mouseleave', onSectionMouseLeave);
      canvas.removeEventListener('mousedown', onCanvasMouseDown);
      window.removeEventListener('mouseup', onWindowMouseUp);
      section.removeEventListener('touchstart', onTouchStart);
      section.removeEventListener('touchmove', onTouchMove);
      section.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section className="hero" id="hero" ref={sectionRef}>
      <canvas className="hero-canvas" id="heroCanvas" ref={canvasRef}></canvas>
    </section>
  );
}
