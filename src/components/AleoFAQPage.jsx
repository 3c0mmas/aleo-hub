import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

function FloatingSpheres() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const trianglePositions = [
      { x: w * 0.3, y: h * 0.7 },
      { x: w * 0.7, y: h * 0.7 },
      { x: w * 0.5, y: h * 0.3 },
    ];

    const radii = [360, 300, 260];
    const spheres = radii.map((r, i) => ({
      x: trianglePositions[i].x,
      y: trianglePositions[i].y,
      z: 200 + Math.random() * 100,
      ax: Math.random() * Math.PI * 2,
      ay: Math.random() * Math.PI * 2,
      az: Math.random() * Math.PI * 2,
      sx: (Math.random() - 0.5) * 0.001,
      sy: (Math.random() - 0.5) * 0.001,
      sz: (Math.random() - 0.5) * 0.001,
      r,
      dots: Array.from({ length: 1200 }, () => ({
        t: Math.random() * Math.PI * 2,
        p: Math.acos(2 * Math.random() - 1),
      })),
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(238,255,168,0.5)";
      for (const s of spheres) {
        s.ax += s.sx; s.ay += s.sy; s.az += s.sz;
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
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />;
}

function QA({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative border rounded-2xl overflow-hidden transition-colors duration-300 group ${
        open
          ? "bg-[#EEFFA8]/10 border-[#EEFFA8]/30 shadow-[0_0_20px_rgba(238,255,168,0.15)]"
          : "bg-white/5 border-white/10"
      }`}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300">
        <div className="absolute inset-0 backdrop-blur-[6px] rounded-2xl"></div>
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-full flex items-center justify-between gap-4 px-5 py-4 text-left z-10"
      >
        <span className="text-white font-medium">{q}</span>
        <ChevronDown className={`size-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative px-5 pb-5 text-gray-300 z-10"
          >
            {a}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const RAW_FAQ = [
  { cat: "Mainnet", q: "When did Aleo Mainnet launch?", a: "Aleo Mainnet officially launched on September 17, 2024, making the cryptographic innovations from the ZeXe paper a live reality." },
  { cat: "Tokens", q: "What are Aleo Credits (Aleo Tokens) used for?", a: "Aleo Tokens serve as the primary utility token to access computational resources, pay for blockspace, reward provers and validators, enable staking, and participate in on-chain governance." },
  { cat: "Validators", q: "How many tokens are required to be a validator?", a: "Validators must hold a minimum of 10 million Aleo Tokens and operate using snarkOS software to secure the network." },
  { cat: "Consensus", q: "What consensus does Aleo use?", a: "Aleo uses AleoBFT — a custom consensus mechanism combining Bullshark and Narwhal protocols with Proof-of-Succinct Work (PoSW), ensuring high throughput and decentralization." },
  { cat: "Developers", q: "How can developers build on Aleo?", a: "Developers use the Leo language and SnarkVM to create private-by-default decentralized applications. Full documentation and SDKs are available on developer.aleo.org." },
  { cat: "KYC", q: "Is KYC required to claim tokens?", a: "Yes. Participants in incentive programs must complete KYC verification via institutional partners before claiming Aleo Tokens." },
  { cat: "Staking", q: "How can users participate in staking?", a: "Token holders can delegate Aleo Tokens to validators and earn rewards proportionally. A minimum of 10,000 Aleo Tokens is required to begin staking." },
  { cat: "Lockups", q: "Is there a lock-up on Aleo Token claims?", a: "Yes. All claims, including those for contributors and incentive participants, are subject to a one-year lock-up period." },
  { cat: "Governance", q: "Who can propose ARCs (Aleo Requests for Comments)?", a: "Currently, proposals can be submitted by Aleo Foundation members, elected Governors, and Aleo Grantees. Community members can participate in discussions and voting via Governors." },
  { cat: "Privacy", q: "How does Aleo ensure privacy?", a: "Aleo leverages zero-knowledge proofs to execute transactions and smart contracts off-chain, verifying them on-chain — maintaining confidentiality while ensuring integrity." },
  { cat: "Provers", q: "Who are Provers and what do they do?", a: "Provers generate zk-SNARK proofs that power the Aleo blockchain. They contribute to network scalability and receive rewards for validated proofs." },
  { cat: "Validators", q: "What is Proof-of-Succinct Work?", a: "Proof-of-Succinct Work (PoSW) is Aleo’s hybrid consensus model combining zk-SNARK computation and verifiable effort to secure the network without energy-intensive mining." },
  { cat: "Fees", q: "What is the minimum transaction fee?", a: "The minimum fee is 0.005 Aleo Tokens, with the actual cost depending on program complexity and data size (typically 3–10 millicredits)." },
  { cat: "Wallets", q: "What wallets support Aleo?", a: "While Aleo has no official wallet, users can generate addresses via the SDK or use third-party wallets such as Leo Wallet, Puzzle, and Avail." },
  { cat: "Ecosystem", q: "How does Aleo collaborate with Google Cloud?", a: "Google Cloud acts as a validator in Aleo Network, offering BigQuery data analytics and up to $350,000 in cloud credits to Aleo developers through the Google for Startups Cloud Program." },
];

export default function AleoFAQPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");

  const cats = useMemo(() => ["All", ...Array.from(new Set(RAW_FAQ.map((i) => i.cat)))], []);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RAW_FAQ.filter((i) =>
      (cat === "All" || i.cat === cat) && (!q || i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q))
    );
  }, [query, cat]);

  return (
    <section className="relative min-h-screen bg-black text-gray-100 overflow-hidden">
      <FloatingSpheres />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#EEFFA8] mb-3">Aleo FAQ</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover how Aleo brings zero-knowledge privacy, scalability, and decentralization together. Explore frequently asked questions from the official Aleo documentation — simplified and styled to match your site.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between mb-6">
          <div className="flex gap-2 flex-wrap">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full border text-sm ${cat === c ? "bg-[#EEFFA8]/15 border-[#EEFFA8]/40 text-[#EEFFA8]" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"}`}
              >
                {c}
              </button>
            ))}
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in FAQ…"
            className="w-full md:w-72 h-11 px-4 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#EEFFA8]/40 text-sm"
          />
        </div>

        <div className="space-y-3">
          {items.map((it, idx) => (
            <QA key={idx} q={it.q} a={it.a} defaultOpen={idx === 0} />
          ))}
          {items.length === 0 && (
            <div className="text-gray-400 text-sm py-8 text-center border border-white/10 rounded-2xl">No results found.</div>
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            href="https://aleo.org/faq/"
            target="_blank"
            rel="noreferrer"
            className="w-full md:w-[744px] h-[64px] rounded-[1.5rem] bg-gradient-to-r from-[#EEFFA8]/20 to-[#C4FFC2]/20 border border-[#EEFFA8]/30 text-[#EEFFA8] font-semibold tracking-wide flex items-center justify-center shadow-[0_0_30px_rgba(238,255,168,0.15)] hover:shadow-[0_0_40px_rgba(238,255,168,0.25)] backdrop-blur-sm"
          >
            Open full FAQ ↗
          </motion.a>
        </div>
      </div>
    </section>
  );
}
