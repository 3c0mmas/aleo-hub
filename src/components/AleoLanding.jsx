import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
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
      ctx.save();

      if (trailRef.current.length > 1) {
        drawGlowTrail(trailRef.current);
      }

      for (let i = 0; i < trailRef.current.length; i++) {
        const p = trailRef.current[i];
        const t = i / MAX_POINTS;
        const size = 8 + (1 - t) * 10;
        drawPixelArrow(p.x, p.y, size, t);
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(draw);
    }

    draw();

    function pushPoint(x, y) {
      trailRef.current.unshift({ x, y, a: 1 });
      if (trailRef.current.length > MAX_POINTS) trailRef.current.pop();
    }

    function onMove(e) {
      const x = e.clientX ?? (e.touches && e.touches[0].clientX) ?? 0;
      const y = e.clientY ?? (e.touches && e.touches[0].clientY) ?? 0;
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

export default function AleoLanding() {
  const [showMore, setShowMore] = useState(false);

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
  ];

  const articles = [
    {
      date: "October 27, 2025",
      title: "Paxos Labs and ANF launch USAD Private Stablecoin",
      link: "https://aleo.org/post/paxos-labs-and-ANF-launch-USAD-Private-Stablecoin/",
    },
    {
      date: "October 25, 2025",
      title: "Aleo joins Binance Alpha",
      link: "https://aleo.org/post/aleo-joins-binance-alpha/",
    },
    {
      date: "October 22, 2025",
      title: "Aleo & Request Finance: Private Payments Partnership",
      link: "https://aleo.org/post/aleo-request-finance-private-payments-partnership/",
    },
    {
      date: "October 20, 2025",
      title: "Aleo joins Global Dollar Network: Private Stablecoin",
      link: "https://aleo.org/post/aleo-joins-global-dollar-network-private-stablecoin/",
    },
    {
      date: "October 18, 2025",
      title: "Aleo Token Revolut Listing",
      link: "https://aleo.org/post/aleo-token-revolut-listing/",
    },
  ];

  const events = [
    {
      time: "6:00 PM - 9:00 PM GMT+9, November 1 2025",
      location: "MIDORI.so SHIBUYA / CryptoBase, Shibuya, Tokyo",
      title: "Aleo: Tokyo Compliant Private Token Workshop",
      link: "https://luma.com/aleotokyo2025workshop",
    },
    {
      time: "1:00 PM - 4:00 PM EDT, November 1 2025",
      location: "Startuptive | Coworking and Team Office, Toronto, Ontario",
      title: "Aleo: Toronto Compliant Private Token Workshop",
      link: "https://luma.com/aleotorontooctober2025workshop",
    },
    {
      time: "2:30 PM OCTOBER 27 2025 - OCTOBER 29 2025 PDT",
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
      title: "揭秘下一代隐私网络！Aleo 上海 Dev Party 邀你面对面话 Web3 未来！",
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

  const visibleEvents = showMore ? events : events.slice(0, 6);

  return (
    <motion.div className="relative min-h-screen font-sans text-gray-100 bg-black overflow-x-hidden">
      <GlowingCursor />

      <header className="z-30 relative">
        <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-gradient-to-tr from-[#121216] to-[#1b1b20] border border-white/6 flex items-center justify-center shadow-sm">
              <span className="text-xs font-semibold tracking-wider">A</span>
            </div>
            <div className="text-sm text-gray-300">Aleo — Private by design</div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <a href="#about" className="hover:text-white">About</a>
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#events" className="hover:text-white">Events</a>
            <a href="#community" className="hover:text-white">Community</a>
          </div>
        </nav>
      </header>

      <main className="z-20 relative">
        <section id="about" className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-semibold text-white mb-4">About Aleo</h2>
          <p className="text-gray-300 max-w-3xl">Aleo enables developers to build private applications with zero-knowledge proofs executed off-chain and verified on-chain. Its mission is to make privacy-preserving computing accessible to everyone, empowering users to control their own data.</p>
        </section>

        <section id="features" className="max-w-6xl mx-auto px-6 py-20">
          <h3 className="text-2xl font-semibold text-white mb-8">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Private by Default</h4>
              <p className="text-gray-400 text-sm">All application logic can be executed privately using zk-proofs, ensuring total confidentiality for users and developers alike.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Developer-First</h4>
              <p className="text-gray-400 text-sm">Aleo provides powerful SDKs, local development tools, and documentation to help developers build privacy-preserving apps faster.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Composable & Secure</h4>
              <p className="text-gray-400 text-sm">Applications on Aleo can interoperate securely, enabling scalable private DeFi and beyond with modular, verifiable components.</p>
            </div>
          </div>
        </section>

        <section id="events" className="max-w-6xl mx-auto px-6 py-20">
          <h3 className="text-3xl font-semibold text-white mb-8">Aleo Global Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {visibleEvents.map((event, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => window.open(event.link, "_blank")}
                  className="group cursor-pointer bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-[#EEFFA8]/10 hover:scale-[1.03] hover:shadow-[0_0_25px_#EEFFA8aa]"
                >
                  <div className="text-sm text-gray-400">{event.time}</div>
                  <div className="text-xs text-gray-500">{event.location}</div>
                  <h4 className="mt-3 text-lg font-semibold text-white group-hover:text-[#EEFFA8] transition-colors">{event.title}</h4>
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

        <section id="community" className="max-w-6xl mx-auto px-6 py-20">
          <h3 className="text-3xl font-semibold text-white mb-8">Aleo Community Hub</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tweets.map((url, idx) => (
              <div
                key={idx}
                onClick={() => window.open(url, "_blank")}
                className="cursor-pointer bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-[#EEFFA8]/10 hover:shadow-[0_0_25px_#EEFFA8aa] hover:scale-[1.03]"
              >
                <div className="text-gray-300 text-sm">Tweet #{idx + 1}</div>
                <h4 className="mt-3 text-lg font-semibold text-white hover:text-[#EEFFA8] transition-colors">View post on X</h4>
              </div>
            ))}
          </div>
        </section>

        <section id="governance" className="max-w-6xl mx-auto px-6 py-20">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center">
            <h3 className="text-3xl font-semibold text-white mb-4">Aleo Governance</h3>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">Propose. Vote. Change. Shape the future of the Aleo Network.</p>
            <a
              href="https://vote.aleo.org/"
              target="_blank"
              rel="noreferrer"
              className="inline-block px-8 py-3 bg-[#EEFFA8]/10 border border-[#EEFFA8]/30 rounded-xl text-[#EEFFA8] hover:bg-[#EEFFA8]/20 transition"
            >
              Join Governance Platform
            </a>
          </div>
        </section>

        <section id="articles" className="max-w-6xl mx-auto px-6 py-20">
          <h3 className="text-3xl font-semibold text-white mb-8">Aleo Blog Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, idx) => (
              <div
                key={idx}
                onClick={() => window.open(article.link, "_blank")}
                className="cursor-pointer bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-[#EEFFA8]/10 hover:shadow-[0_0_25px_#EEFFA8aa] hover:scale-[1.03]"
              >
                <h4 className="text-lg font-semibold text-white hover:text-[#EEFFA8] transition-colors">{article.title}</h4>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href="https://aleo.org/blog/"
              target="_blank"
              rel="noreferrer"
              className="inline-block px-6 py-3 bg-[#EEFFA8]/10 border border-[#EEFFA8]/30 rounded-xl text-[#EEFFA8] hover:bg-[#EEFFA8]/20 transition"
            >
              View More Articles
            </a>
          </div>
        </section>

        <footer className="max-w-6xl mx-auto px-6 py-12 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Aleo — Community & Governance
        </footer>
      </main>
    </motion.div>
  );
}
