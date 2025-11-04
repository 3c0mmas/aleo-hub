import React, { useEffect, useRef } from "react";

export default function FloatingSpheres() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const w = () => canvas.clientWidth;
    const h = () => canvas.clientHeight;

    const trianglePositions = [
      { x: w() * 0.3, y: h() * 0.7 },
      { x: w() * 0.7, y: h() * 0.7 },
      { x: w() * 0.5, y: h() * 0.3 },
    ];

    const radii = [400, 340, 300];
    const spheres = radii.map((r, i) => ({
      x: trianglePositions[i].x,
      y: trianglePositions[i].y,
      baseX: trianglePositions[i].x,
      baseY: trianglePositions[i].y,
      z: 200 + Math.random() * 100,
      ax: Math.random() * Math.PI * 2,
      ay: Math.random() * Math.PI * 2,
      az: Math.random() * Math.PI * 2,
      sx: (Math.random() - 0.5) * 0.001,
      sy: (Math.random() - 0.5) * 0.001,
      sz: (Math.random() - 0.5) * 0.001,
      driftAngle: Math.random() * Math.PI * 2,
      driftRadius: Math.random() * 40 + 20,
      driftSpeed:
        (Math.random() * 0.002 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
      r,
      dots: Array.from({ length: 1200 }, () => ({
        t: Math.random() * Math.PI * 2,
        p: Math.acos(2 * Math.random() - 1),
      })),
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w(), h());
      ctx.fillStyle = "rgba(238,255,168,0.5)";

      for (const s of spheres) {
        s.ax += s.sx;
        s.ay += s.sy;
        s.az += s.sz;
        s.driftAngle += s.driftSpeed;
        s.x = s.baseX + Math.cos(s.driftAngle) * s.driftRadius;
        s.y = s.baseY + Math.sin(s.driftAngle) * s.driftRadius * 0.6;

        for (const d of s.dots) {
          const x = s.r * Math.sin(d.p) * Math.cos(d.t);
          const y = s.r * Math.sin(d.p) * Math.sin(d.t);
          const z = s.r * Math.cos(d.p);

          const x1 = x * Math.cos(s.ay) - z * Math.sin(s.ay);
          const z1 = x * Math.sin(s.ay) + z * Math.cos(s.ay);
          const y1 = y * Math.cos(s.ax) - z1 * Math.sin(s.ax);
          const z2 = y * Math.sin(s.ax) + z1 * Math.cos(s.ax);
          const x2 = x1 * Math.cos(s.az) - y1 * Math.sin(s.az);
          const y2 = x1 * Math.sin(s.az) + y1 * Math.cos(s.az);

          const k = 600 / (600 + z2 + s.z);
          const px = s.x + x2 * k;
          const py = s.y + y2 * k;

          ctx.globalAlpha = Math.max(0.1, Math.min(1, k)) * 0.7;
          ctx.beginPath();
          ctx.arc(px, py, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      requestAnimationFrame(draw);
    };

    draw();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-[1300px] z-0 pointer-events-none"
    />
  );
}
