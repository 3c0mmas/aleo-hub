import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// === GLOW CURSOR =============================================================
function GlowingCursor() {
  const canvasRef = useRef(null);
  const trailRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const MAX_POINTS = 20;
    const DECAY = 0.86;
    const mainColor = "#EEFFA8";
    const glowColor = "#C4FFC2";

    function resize() {
      w = (canvas.width = window.innerWidth);
      h = (canvas.height = window.innerHeight);
    }
    window.addEventListener("resize", resize);

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

// === BACKGROUND ==============================================================
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

// === BLOCK SNAKE =======================================
function BlockSnake() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const [running, setRunning] = useState(false);
  const restartRef = useRef(() => {});
  const statsRef = useRef({ score: 0, level: 1, slashed: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight * 0.7);
    const CELL = 24;
    let COLS = Math.floor(w / CELL);
    let ROWS = Math.floor(h / CELL);

    let snake = [
      { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) },
      { x: Math.floor(COLS / 2) - 1, y: Math.floor(ROWS / 2) },
    ];
    let dir = { x: 1, y: 0 };
    let nextDir = { x: 1, y: 0 };
    let tx = { x: 5, y: 5 };
    let tick = 0;
    let last = 0;
    let stepMs = 150;

    const COLORS = {
      bg: "#000",
      grid: "rgba(255,255,255,0.1)",
      main: "#EEFFA8",
      tx: "#C4FFC2",
    };

    const drawCell = (c, color) => {
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.fillStyle = color;
      ctx.fillRect(c.x * CELL + 3, c.y * CELL + 3, CELL - 6, CELL - 6);
      ctx.restore();
    };

    const inBounds = (c) => c.x >= 0 && c.y >= 0 && c.x < COLS && c.y < ROWS;

    const spawnFree = () => ({
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    });

    const step = () => {
      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (!inBounds(head)) {
        setRunning(false);
        return;
      }
      snake.unshift(head);
      if (head.x === tx.x && head.y === tx.y) {
        tx = spawnFree();
        statsRef.current.score += 10;
      } else {
        snake.pop();
      }
    };

    const render = () => {
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, w, h);
      for (let x = 0; x < COLS; x++) {
        for (let y = 0; y < ROWS; y++) {
          ctx.fillStyle = COLORS.grid;
          ctx.fillRect(x * CELL, y * CELL, 1, 1);
        }
      }
      drawCell(tx, COLORS.tx);
      snake.forEach((s) => drawCell(s, COLORS.main));
      ctx.fillStyle = "#C4FFC2";
      ctx.font = "14px monospace";
      ctx.fillText(`Score: ${statsRef.current.score}`, 10, h - 10);
    };

    const loop = (ts) => {
      if (!running) return;
      if (!last) last = ts;
      const dt = ts - last;
      tick += dt;
      if (tick > stepMs) {
        step();
        tick = 0;
      }
      render();
      last = ts;
      rafRef.current = requestAnimationFrame(loop);
    };

    const startGame = () => {
      snake = [
        { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) },
        { x: Math.floor(COLS / 2) - 1, y: Math.floor(ROWS / 2) },
      ];
      dir = { x: 1, y: 0 };
      nextDir = { x: 1, y: 0 };
      tx = spawnFree();
      statsRef.current.score = 0;
      setRunning(true);
      last = 0;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(loop);
    };

    restartRef.current = startGame;
    render();
    return () => cancelAnimationFrame(rafRef.current);
  }, [running]);

  return (
    <div className="relative w-full h-[70vh] bg-black border border-[#EEFFA8]/20 rounded-3xl overflow-hidden flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {!running && (
        <motion.button
          onClick={() => restartRef.current()}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.6, 1, 0.6],
            boxShadow: [
              "0 0 10px #EEFFA8",
              "0 0 25px #C4FFC2",
              "0 0 10px #EEFFA8",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="z-10 px-8 py-4 rounded-2xl border border-[#EEFFA8]/40 bg-[#EEFFA8]/10 text-[#EEFFA8] font-semibold text-lg tracking-wide backdrop-blur-sm hover:scale-105 transition-transform"
        >
          ▶ Start / Restart Game
        </motion.button>
      )}
    </div>
  );
}

// === GAME SECTION (описание + BlockSnake) ====================================
function GameSection() {
  return (
    <section id="game" className="max-w-6xl mx-auto px-6 py-20 text-center">
      <h3 className="text-3xl font-semibold text-white mb-6">Aleo Block Snake</h3>

      <motion.div
        className="text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.span
          className="block text-[#EEFFA8] font-semibold mb-2 text-lg"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Secure the Aleo Network, Evolve the Chain!
        </motion.span>

        <motion.p
          className="text-gray-300"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          Step into the neon world of Aleo — a blockchain built for privacy and performance.
          Guide your digital snake through the decentralized grid, collect encrypted transactions,
          and defend the Aleo network from hostile nodes.
          <br />
          <br />
          Each transaction accelerates your growth, every five levels bring new challenges,
          and red bombs can purge the field in a flash of cryptographic power.
          <br />
          <br />
          <motion.span
            className="italic text-[#C4FFC2]"
            animate={{
              opacity: [0.6, 1, 0.6],
              textShadow: ["0 0 5px #C4FFC2", "0 0 15px #EEFFA8", "0 0 5px #C4FFC2"],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Show your skill as a validator — protect privacy, sustain the chain,
            and keep Aleo secure... until Game Over.
          </motion.span>
        </motion.p>
      </motion.div>

      <BlockSnake />
    </section>
  );
}

// === MAIN PAGE ==============================================================

export default function AleoLanding() {
  const [showMore, setShowMore] = useState(false);

  const allEvents = [
    {
      time: "6:00 PM - 9:00 PM GMT+9, November 1 2025",
      location: "Tokyo, Japan",
      title: "Aleo: Tokyo Compliant Private Token Workshop",
      link: "https://luma.com/aleotokyo2025workshop",
    },
    {
      time: "1:00 PM - 4:00 PM EDT, November 1 2025",
      location: "Toronto, Canada",
      title: "Aleo: Toronto Compliant Private Token Workshop",
      link: "https://luma.com/aleotorontooctober2025workshop",
    },
    {
      time: "4:00 PM NOVEMBER 3 2025 GMT-3",
      location: "São Paulo, Brazil",
      title: "Aleo LATAM Developer Meetup",
      link: "https://luma.com/aleobrazil2025",
    },
    {
      time: "2:30 PM OCTOBER 27 2025 PDT",
      location: "Las Vegas, Nevada",
      title: "Aleo's Privacy Lounge @Money20/20",
      link: "https://luma.com/4s1lxlc9",
    },
    {
      time: "5:00 PM OCTOBER 22 2025 GMT+3",
      location: "Istanbul, Turkey",
      title: "Aleo x Yıldız Technical University Blockchain Club",
      link: "https://luma.com/pdjgokou",
    },
    {
      time: "12:00 PM OCTOBER 21 2025 GMT+1",
      location: "Uyo, Nigeria",
      title: "Aleo: Uyo Compliant Private Token Workshop",
      link: "https://luma.com/aleouyooctober2025workshop",
    },
    {
      time: "2:00 PM OCTOBER 19 2025 GMT+8",
      location: "Shanghai, China",
      title:
        "揭秘下一代隐私网络！Aleo 上海 Dev Party 邀你面对面话 Web3 未来！",
      link: "https://luma.com/xwjcv6xh",
    },
    {
      time: "9:00 AM OCTOBER 19 2025 GMT+7",
      location: "Ho Chi Minh, Vietnam",
      title: "Aleo: HCMC Compliant Private Token Workshop",
      link: "https://luma.com/aleohcmc2025workshop",
    },
    {
      time: "6:30 PM OCTOBER 13 2025 GMT+2",
      location: "Paris, France",
      title: "Aleo x Crypto Mondays x SheFi Paris",
      link: "https://luma.com/zw8oesrq",
    },
  ];

  const visibleEvents = showMore ? allEvents : allEvents.slice(0, 6);

  const tweets = [
    {
      date: "October 27, 2025",
      text: "Exploring the future of privacy at Money20/20 Las Vegas! Join us at Aleo’s Privacy Lounge.",
      link: "https://x.com/AleoHQ/status/1982800488736465064",
    },
    {
      date: "October 25, 2025",
      text: "Aleo joins Binance Alpha! Building bridges for privacy-first innovation.",
      link: "https://x.com/AleoHQ/status/1982452680875270299",
    },
    {
      date: "October 23, 2025",
      text: "Our Istanbul event brought together amazing builders from around the globe.",
      link: "https://x.com/AleoHQ/status/1981834085329694747",
    },
    {
      date: "October 21, 2025",
      text: "zk-proofs verified, privacy preserved. The Aleo mainnet continues to grow.",
      link: "https://x.com/AleoHQ/status/1981443533933367677",
    },
    {
      date: "October 20, 2025",
      text: "From Shanghai to Paris — Aleo’s global developer workshops keep expanding!",
      link: "https://x.com/AleoHQ/status/1981392940045091209",
    },
    {
      date: "October 18, 2025",
      text: "Aleo’s privacy ecosystem keeps growing — join the movement!",
      link: "https://x.com/AleoHQ/status/1981300000000000000",
    },
  ];

  const articles = [
    {
      date: "October 27, 2025",
      title: "Paxos Labs and ANF launch USAD Private Stablecoin",
      link: "https://aleo.org/post/paxos-labs-and-ANF-launch-USAD-Private-Stablecoin/",
      image:
        "https://images.ctfassets.net/qyo46trxl4dy/12c2mUaWTYvwVnlT9nL58S/de92f7ae9246f808aa9c85b088229439/Aleo-Social-with-PaxosLabs-1920x1080.png?w=1440&h=810&q=70&fm=webp",
    },
    {
      date: "October 25, 2025",
      title: "Aleo joins Binance Alpha",
      link: "https://aleo.org/post/aleo-joins-binance-alpha/",
      image:
        "https://images.ctfassets.net/qyo46trxl4dy/mcb9WhNZaX5bmwlkqCy3m/30a076c088575cc08831f9f902967de3/Aleo-Social-with-Binance-Alpha-1920x1080.png?w=1440&h=810&q=70&fm=webp",
    },
    {
      date: "October 22, 2025",
      title: "Aleo & Request Finance: Private Payments Partnership",
      link: "https://aleo.org/post/aleo-request-finance-private-payments-partnership/",
      image:
        "https://images.ctfassets.net/qyo46trxl4dy/7KKPNIIsjkTWJeL4euvrGc/7237b6e2e149a2bf10f64bd9bc91b4ef/Aleo-with-Request-Blog-header-dither-sphere-1920x1080.png?w=1440&h=810&q=70&fm=webp",
    },
    {
      date: "October 20, 2025",
      title: "Aleo joins Global Dollar Network: Private Stablecoin",
      link: "https://aleo.org/post/aleo-joins-global-dollar-network-private-stablecoin/",
      image:
        "https://images.ctfassets.net/qyo46trxl4dy/7feNonGbyiMPWr8KJ15qnq/6bca38c6b0e27ccc2b5f29bee6bf2dae/Aleo-Social-with-GDN-1920x1080.png?w=1440&h=810&q=70&fm=webp",
    },
    {
      date: "October 19, 2025",
      title: "Aleo Token Revolut Listing",
      link: "https://aleo.org/post/aleo-token-revolut-listing/",
      image:
        "https://images.ctfassets.net/qyo46trxl4dy/6iYoy5TBw7hfl8qzKIIcSb/dd0cb9804a06e9467c80d5f8dbb7c0a0/Aleo-with-Revolut-Gradient-bg-2000x1048__1_.png?w=1440&h=755&q=70&fm=webp",
    },
    {
      date: "October 18, 2025",
      title: "Aleo Ecosystem Growth Report",
      link: "https://aleo.org/post/aleo-ecosystem-growth-report/",
      image:
        "https://images.ctfassets.net/qyo46trxl4dy/2FCHIJzPePkfjjgUBWivIQ/22bad418b22eead7373f5a7645dbd17d/Aleo-blog-header-snarkOS4_1920x1080px__2_.png?w=1440&h=810&q=70&fm=png",
    },
  ];

  return (
    <motion.div className="relative min-h-screen font-sans text-gray-100 bg-black overflow-x-hidden">
      <PixelBackground />
      <GlowingCursor />

      {/* HEADER (одна) */}
      <header className="z-30 relative border-b border-white/5 backdrop-blur-sm bg-black/40 sticky top-0">
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
            {["About", "Features", "Events", "Community", "Governance", "Articles", "Game"].map(
              (i) => (
                <a
                    key={i}
                    href={`#${i.toLowerCase()}`}
                    className="hover:text-[#EEFFA8] transition-colors"
                >
                  {i}
                </a>
              )
            )}
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          initial={{ opacity: 0.4 }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            background: [
              "radial-gradient(circle at 30% 40%, rgba(238,255,168,0.25) 0%, transparent 60%)",
              "radial-gradient(circle at 70% 60%, rgba(196,255,194,0.25) 0%, transparent 60%)",
              "radial-gradient(circle at 50% 50%, rgba(238,255,168,0.3) 0%, transparent 65%)",
            ],
          }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "mirror" }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold mb-4 flex items-center gap-3 text-[#C4FFC2]">
            Welcome to
            <img
              src="https://vote.aleo.org/images/logo-wordmark-black.svg"
              alt="Aleo logo"
              className="h-10 filter invert brightness-[120%] saturate-[120%] sepia-[10%] hue-rotate-[75deg]"
            />
            Network
          </h1>

          <p className="text-gray-400 max-w-xl">
            Privacy-first blockchain empowering developers to build private,
            decentralized apps.
          </p>
          <button className="mt-6 px-6 py-3 bg-[#C4FFC2]/10 border border-[#C4FFC2]/30 rounded-xl text-[#C4FFC2] hover:bg-[#C4FFC2]/20 transition">
            Learn More
          </button>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-semibold text-white mb-4">About Aleo</h3>
        <p className="text-gray-300 max-w-3xl">
          Aleo is the world’s leading zero-knowledge platform enabling fully private applications with off-chain computation verified on-chain.
        </p>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-semibold text-white mb-8 text-center">
          Core Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-[#EEFFA8]/10 hover:shadow-[0_0_25px_#EEFFA8aa]">
            <h4 className="text-lg font-semibold text-white mb-2">Private by Default</h4>
            <p className="text-gray-400 text-sm">All app logic executes privately with zk-proofs, ensuring total confidentiality.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-[#EEFFA8]/10 hover:shadow-[0_0_25px_#EEFFA8aa]">
            <h4 className="text-lg font-semibold text-white mb-2">Developer-First</h4>
            <p className="text-gray-400 text-sm">Powerful SDKs and tooling for fast, privacy-focused app development.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-[#EEFFA8]/10 hover:shadow-[0_0_25px_#EEFFA8aa]">
            <h4 className="text-lg font-semibold text-white mb-2">Composable & Secure</h4>
            <p className="text-gray-400 text-sm">Aleo enables modular private DeFi and verifiable computation.</p>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section id="events" className="max-w-6xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-semibold text-white mb-8">Aleo Global Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {visibleEvents.map((event, idx) => (
              <motion.div
                key={idx}
                onClick={() => window.open(event.link, "_blank")}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="cursor-pointer bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-[#EEFFA8]/10 hover:scale-[1.03] hover:shadow-[0_0_25px_#EEFFA8aa]"
              >
                <div className="text-sm text-gray-400">{event.time}</div>
                <div className="text-xs text-gray-500">{event.location}</div>
                <h4 className="mt-3 text-lg font-semibold text-white hover:text-[#EEFFA8] transition-colors">
                  {event.title}
                </h4>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="text-center mt-10">
          <button
            onClick={() => setShowMore(!showMore)}
            className="px-6 py-3 bg-[#EEFFA8]/10 border border-[#EEFFA8]/30 rounded-xl text-[#EEFFA8] hover:bg-[#EEFFA8]/20 transition"
          >
            {showMore ? "Show Less Events" : "Show More Events"}
          </button>
        </div>
      </section>

      {/* COMMUNITY */}
      <section id="community" className="max-w-6xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-semibold text-white mb-8">Aleo Community Hub</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tweets.map((tweet, idx) => (
            <div
              key={idx}
              onClick={() => window.open(tweet.link, "_blank")}
              className="cursor-pointer bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-[#EEFFA8]/10 hover:shadow-[0_0_25px_#EEFFA8aa] hover:scale-[1.03] transition"
            >
              <div className="text-sm text-gray-400">{tweet.date}</div>
              <h4 className="mt-3 text-lg font-semibold text-white hover:text-[#EEFFA8] transition-colors">
                {tweet.text}
              </h4>
            </div>
          ))}
        </div>
      </section>

      {/* GOVERNANCE */}
      <section id="governance" className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h3 className="text-3xl font-semibold text-white mb-4">Aleo Governance</h3>
        <p className="text-gray-300 max-w-2xl mx-auto mb-6">
          Participate in Aleo’s on-chain governance — propose, vote, and shape the network’s evolution.
        </p>
        <a
          href="https://vote.aleo.org/"
          target="_blank"
          rel="noreferrer"
          className="inline-block px-8 py-3 bg-[#EEFFA8]/10 border border-[#EEFFA8]/30 rounded-xl text-[#EEFFA8] hover:bg-[#EEFFA8]/20 transition"
        >
          Join Governance Platform
        </a>
      </section>

      {/* ARTICLES */}
      <section id="articles" className="max-w-6xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-semibold text-white mb-8 text-center">
          Aleo Blog Highlights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, idx) => (
            <motion.div
              key={idx}
              onClick={() => window.open(article.link, "_blank")}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 25px #EEFFA8aa, 0 0 50px #C4FFC2aa",
                borderColor: "#EEFFA8",
              }}
              transition={{ type: "spring", stiffness: 120, damping: 10 }}
              className="cursor-pointer bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 group"
            >
              <div className="relative w-full h-40 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-70"></div>
              </div>
              <div className="p-6 text-left">
                <div className="text-sm text-gray-400 mb-2">{article.date}</div>
                <h4 className="text-lg font-semibold text-white group-hover:text-[#EEFFA8] transition-colors">
                  {article.title}
                </h4>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* GAME */}
      <GameSection />

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto px-6 py-12 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Julissa ♥ Aleo Community
      </footer>
    </motion.div>
  );
}
