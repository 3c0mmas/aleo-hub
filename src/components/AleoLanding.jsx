import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// === LIMON CURSOR ============================================================
function GlowingCursor() {
  const canvasRef = useRef(null);
  const trailRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    function resize() {
      w = (canvas.width = window.innerWidth);
      h = (canvas.height = window.innerHeight);
    }
    window.addEventListener("resize", resize);

    const MAX_POINTS = 20;
    const DECAY = 0.86;
    const mainColor = "#EEFFA8";
    const glowColor = "#C4FFC2";

    function drawPixelArrow(x, y, size, t) {
      const pixelSize = Math.max(2, size / 5);
      const baseAlpha = 0.2 + (1 - t) * 0.5;
      ctx.fillStyle = mainColor;
      ctx.globalAlpha = baseAlpha;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 20 * (1 - t);
      const shape = [
        [0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0],
        [1, 0, 0, 0, 1],
      ];
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((-30 * Math.PI) / 180);
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col] === 1) {
            const px = (col - shape[row].length / 2) * pixelSize;
            const py = (row - shape.length / 2) * pixelSize;
            ctx.fillRect(px, py, pixelSize, pixelSize);
          }
        }
      }
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    function drawGlowTrail(points) {
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < points.length - 1; i++) {
        const p = points[i];
        const next = points[i + 1];
        const alpha = 0.12 * (1 - i / points.length);
        ctx.strokeStyle = glowColor;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 8 * (1 - i / points.length);
        ctx.shadowBlur = 25 * (1 - i / points.length);
        ctx.shadowColor = glowColor;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(next.x, next.y);
      }
      ctx.stroke();
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      if (trailRef.current.length > 1) drawGlowTrail(trailRef.current);
      for (let i = 0; i < trailRef.current.length; i++) {
        const p = trailRef.current[i];
        const t = i / MAX_POINTS;
        const size = 8 + (1 - t) * 10;
        drawPixelArrow(p.x, p.y, size, t);
      }
      rafRef.current = requestAnimationFrame(draw);
    }
    draw();

    function pushPoint(x, y) {
      trailRef.current.unshift({ x, y, a: 1 });
      if (trailRef.current.length > MAX_POINTS) trailRef.current.pop();
    }

    function onMove(e) {
      const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      const y = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
      pushPoint(x, y);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });

    const decayInterval = setInterval(() => {
      for (let i = 0; i < trailRef.current.length; i++) {
        const p = trailRef.current[i];
        const next = trailRef.current[i - 1];
        if (next) {
          p.x += (next.x - p.x) * 0.14;
          p.y += (next.y - p.y) * 0.14;
        }
        p.a *= DECAY;
      }
      trailRef.current = trailRef.current.filter((p) => p.a > 0.03);
    }, 30);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      clearInterval(decayInterval);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-40"
    />
  );
}

// === Glow squares ============================================================
function PixelBackground() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const pixelsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const COUNT = 120;
    const COLORS = ["#EEFFA8", "#C4FFC2", "#ffffff"];
    const pixels = Array.from({ length: COUNT }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 1 + Math.random() * 3,
      speed: 0.05 + Math.random() * 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.2 + Math.random() * 0.5,
      dir: Math.random() * Math.PI * 2,
    }));
    pixelsRef.current = pixels;

    function resize() {
      w = (canvas.width = window.innerWidth);
      h = (canvas.height = window.innerHeight);
    }
    window.addEventListener("resize", resize);

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of pixelsRef.current) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.shadowBlur = 0;

        p.x += Math.cos(p.dir) * p.speed;
        p.y += Math.sin(p.dir) * p.speed;

        p.alpha += (Math.random() - 0.5) * 0.01;
        if (p.alpha < 0.1) p.alpha = 0.1;
        if (p.alpha > 0.7) p.alpha = 0.7;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      }
      rafRef.current = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
}

// === MAIN SITE ===============================================================
export default function AleoLanding() {
  const [showMore, setShowMore] = useState(false);

  return (
    <motion.div className="relative min-h-screen font-sans text-gray-100 bg-black overflow-x-hidden">
      <PixelBackground />
      <GlowingCursor />

      {/* SINGLE HEADER (оставляем только один) */}
      <header className="z-30 relative border-b border-white/5">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEFFA8]/10 flex items-center justify-center border border-[#EEFFA8]/30">
              <img
                src="https://developer.aleo.org/img/logo-128x128.png"
                alt="Aleo Logo"
                className="w-7 h-7"
              />
            </div>
            <span className="text-xl font-semibold text-[#EEFFA8]">
              Aleo Network
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            {[
              "About",
              "Features",
              "Events",
              "Community",
              "Governance",
              "Articles",
              "Game",
            ].map((i) => (
              <a
                key={i}
                href={`#${i.toLowerCase()}`}
                className="hover:text-[#EEFFA8] transition-colors"
              >
                {i}
              </a>
            ))}
          </div>
        </nav>
      </header>

      {/* HERO */}
      {/* ... остальная структура без изменений ... */}
    </motion.div>
  );
}
