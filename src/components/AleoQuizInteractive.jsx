import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// === Background floating symbols ===
function FloatingSymbols() {
  const symbols = ["?", "%", "★", "▲", "●", "■", "◆", "∞"];
  const items = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    symbol: symbols[Math.floor(Math.random() * symbols.length)],
    size: Math.random() * 16 + 8,
    left: Math.random() * 100,
    duration: Math.random() * 12 + 8,
    delay: Math.random() * 6,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {items.map((item) => (
        <motion.span
          key={item.id}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{ y: ["110vh", "-10vh"], opacity: [0.2, 0.8, 0.2] }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `${item.left}%`,
            fontSize: `${item.size}px`,
            color: "rgba(238,255,168,0.3)",
            filter: "blur(1px)",
          }}
        >
          {item.symbol}
        </motion.span>
      ))}
    </div>
  );
}

// === 50-question pool (imported from your previous code) ===
const questions = [
  // === Aleo Mainnet ===
  {
    question: "What is the launch date of Aleo Mainnet?",
    options: ["September 17, 2023", "September 17, 2024", "October 1, 2024", "August 1, 2024"],
    correct: 1,
    explanation: "Aleo Mainnet launched on September 17, 2024, making cryptographic innovations from ZeXe a reality."
  },
  {
    question: "What is the minimum number of Aleo Tokens required to become a validator on the Aleo Network?",
    options: ["1 million", "5 million", "10 million", "50 million"],
    correct: 2,
    explanation: "Validators require a minimum of 10M Aleo Tokens and must use snarkOS software to run a node."
  },
  {
    question: "What consensus algorithm does the Aleo Network use?",
    options: ["Proof of Work", "AleoBFT", "Proof of Authority", "Delegated Proof of Stake"],
    correct: 1,
    explanation: "AleoBFT is a custom consensus algorithm based on Bullshark and Narwhal with Proof-of-Succinct Work."
  },
  {
    question: "What is the purpose of Aleo Tokens?",
    options: ["Store of value only", "Access computation, rewards, staking, governance", "Developer funding", "Hardware fees only"],
    correct: 1,
    explanation: "Aleo Tokens provide access to network resources, reward provers/validators, enable staking, and governance participation."
  },
  {
    question: "Is KYC mandatory to claim Aleo Tokens from incentives programs?",
    options: ["No", "Yes, via institutional partner", "Only ambassadors", "Only validators"],
    correct: 1,
    explanation: "KYC via an institutional partner is mandatory to claim tokens, with support on Discord for pending verifications."
  },
  {
    question: "What is the lock-up period for all Aleo Token claims?",
    options: ["6 months", "1 year", "2 years", "None"],
    correct: 1,
    explanation: "All Aleo Token claims have a 1-year lock-up period; foundation employees have more restrictive provisions."
  },
  {
    question: "Who can currently propose ARCs on the Aleo governance platform?",
    options: ["Any community member", "Foundation employees, Governors, and Grantees", "Only validators", "Ambassadors"],
    correct: 1,
    explanation: "Only Aleo Foundation employees, Governors, and Grantees can propose ARCs; community votes via Governors."
  },
  {
    question: "What is the minimum transaction fee on the Aleo Network?",
    options: ["0.001 Aleo Tokens", "0.005 Aleo Tokens", "1 Aleo Token", "10 millicredits"],
    correct: 1,
    explanation: "Transaction fees are a minimum of 0.005 Aleo Tokens, depending on program size."
  },
  {
    question: "What are Aleo Credits?",
    options: ["Separate token", "Another name for Aleo Tokens", "Rewards only for ambassadors", "Points earned in testnets only"],
    correct: 1,
    explanation: "Aleo Credits are another name for Aleo Tokens used to pay for computational services."
  },
  {
    question: "Does Aleo have an official wallet?",
    options: ["Yes", "No, but third-party wallets exist", "Yes, only for mobile", "No wallets at all"],
    correct: 1,
    explanation: "Aleo doesn’t have an official wallet; third-party options like Leo Wallet, Puzzle, and Avail are available."
  },

  // === Google Cloud Collaboration ===
  {
    question: "When was the Aleo x Google Cloud partnership announced?",
    options: ["February 27, 2024", "February 27, 2025", "March 1, 2025", "January 27, 2025"],
    correct: 1,
    explanation: "The announcement was made on February 27, 2025."
  },
  {
    question: "What kind of network partnership is it?",
    options: ["First Layer 1 ZK network", "Layer 2 rollup", "Non-blockchain computing", "Storage integration"],
    correct: 0,
    explanation: "It’s the first Layer 1 zero-knowledge network partnership in Google Cloud’s ecosystem."
  },
  {
    question: "How does Google Cloud participate in the Aleo Network?",
    options: ["As a validator", "As a data analyst", "As a funding sponsor", "As a developer tool provider"],
    correct: 0,
    explanation: "Google Cloud participates as a validator to extend scalability."
  },
  {
    question: "What does BigQuery integration provide?",
    options: ["Insights into transactions and on-chain records", "Access to social data", "AI code generation", "Storage monitoring"],
    correct: 0,
    explanation: "BigQuery provides insights into Aleo network operations."
  },
  {
    question: "What advantage do Axion VMs offer?",
    options: ["10% performance boost over AWS Graviton", "20% boost", "No difference", "5% boost"],
    correct: 0,
    explanation: "Google Cloud’s Axion VMs deliver 10% performance boost for snarkVM workloads."
  },
  {
    question: "Which services enhance ZK developer productivity?",
    options: ["BigQuery, GKE, Cloud SQL", "AWS S3, Lambda", "Azure, Functions", "Oracle Cloud"],
    correct: 0,
    explanation: "BigQuery, GKE, and Cloud SQL help Aleo developers boost productivity."
  },
  {
    question: "How does the collaboration enhance reliability?",
    options: ["Automated failover and redundancy", "Manual backups", "Single-region setup", "On-prem only"],
    correct: 0,
    explanation: "It adds automated failover and geo-redundancy for reliability."
  },
  {
    question: "What feature controls transaction data visibility?",
    options: ["Account view key", "Public-by-default state", "Third-party audits", "Manual encryption"],
    correct: 0,
    explanation: "Account view keys let users control visibility with private-by-default state."
  },

  // === PNDO Token ===
  {
    question: "What is Pondo Protocol in Aleo ecosystem?",
    options: ["Largest liquid staking protocol", "ZK wallet", "Game project", "Bridge"],
    correct: 0,
    explanation: "Pondo is Aleo’s largest liquid staking protocol."
  },
  {
    question: "When was $PNDO listed on Gate.io?",
    options: ["February 10, 2025", "January 10, 2025", "March 10, 2025", "February 10, 2024"],
    correct: 0,
    explanation: "$PNDO listed on February 10, 2025."
  },
  {
    question: "What makes $PNDO unique?",
    options: ["First Aleo token on Gate.io", "First DeFi-only token", "First inflationary token", "Non-tradable token"],
    correct: 0,
    explanation: "$PNDO is the first Aleo-based token listed on Gate.io."
  },
  {
    question: "How does Pondo Protocol process transactions?",
    options: ["Aleo’s ZK infrastructure", "Ethereum", "Solana", "Bitcoin"],
    correct: 0,
    explanation: "Pondo runs on Aleo’s ZK infrastructure for private staking."
  },
  {
    question: "What % of rewards go to Rewards Pool?",
    options: ["10%", "5%", "15%", "20%"],
    correct: 0,
    explanation: "10% of staking rewards flow to the Rewards Pool as a fee."
  },
  {
    question: "How do $PNDO holders claim rewards?",
    options: ["By burning $PNDO", "By restaking", "By trading", "By joining Discord"],
    correct: 0,
    explanation: "$PNDO holders claim rewards by burning their tokens."
  },
  {
    question: "What’s the benefit for $ALEO stakers?",
    options: ["Maintain liquidity and auto-rebalance", "Permanent lock", "Convert to fiat", "No rewards"],
    correct: 0,
    explanation: "Users earn rewards while keeping liquidity via auto-rebalancing."
  },

  // === Binance Alpha ===
  {
    question: "What is Binance Alpha?",
    options: ["Pre-listing discovery program", "Full token listing", "Payment gateway", "Governance system"],
    correct: 0,
    explanation: "Binance Alpha is a pre-listing discovery program."
  },
  {
    question: "How many users does Binance have?",
    options: ["280M+ users", "100M", "500M", "150M"],
    correct: 0,
    explanation: "Binance has over 280 million users worldwide."
  },
  {
    question: "What does Aleo’s inclusion in Binance Alpha represent?",
    options: ["Industry endorsement of privacy-first blockchain", "Focus on transparency", "Decline in privacy tech", "Reduced market demand"],
    correct: 0,
    explanation: "It represents major industry endorsement for privacy-first blockchain."
  },
  {
    question: "What technology does Aleo use for privacy?",
    options: ["Zero-knowledge cryptography", "Public blockchain", "Bank encryption", "None"],
    correct: 0,
    explanation: "Aleo uses ZK cryptography for off-chain execution verified on-chain."
  },

  // === zPass ===
  {
    question: "What is the purpose of zPass integrations?",
    options: ["Privacy-preserving identity verification", "Gaming only", "Data storage", "Hardware testing"],
    correct: 0,
    explanation: "zPass enables privacy-preserving identity verification."
  },
  {
    question: "Which project uses zPass to protect young gamers?",
    options: ["Playside", "Humine", "GeniiDAO", "World3"],
    correct: 0,
    explanation: "Playside uses zPass to verify age and access in games."
  },
  {
    question: "How does Humine use zPass?",
    options: ["Prove clinical eligibility without exposing medical data", "Gaming AI", "NFT verification", "Token transfers"],
    correct: 0,
    explanation: "Humine’s zClinical platform uses zPass for medical privacy proofs."
  },
  {
    question: "What SDK supports zPass integration?",
    options: ["zPass SDK", "Aleo SDK", "Play3 SDK", "zClinical SDK"],
    correct: 0,
    explanation: "Projects use zPass SDK to integrate zero-knowledge verification."
  }
,
  // === Binance Alpha (rest) ===
  {
    question: "What are the typical drawbacks of traditional international transfers via SWIFT mentioned?",
    options: [
      "Instant and cheap",
      "3–5 business days and ~$50 per tx",
      "No fees, full privacy",
      "Borderless but non-compliant"
    ],
    correct: 1,
    explanation: "SWIFT transfers often take 3–5 days and cost $50+."
  },
  {
    question: "Who is quoted in the announcement regarding Binance Alpha's benefits?",
    options: [
      "A Binance executive",
      "BJ Mahal, VP, Head of Partnerships at the Aleo Network Foundation",
      "A Revolut representative",
      "A GDN official"
    ],
    correct: 1,
    explanation: "BJ Mahal is the quoted person in the announcement."
  },
  {
    question: "What business use cases does Aleo's architecture support for enterprises?",
    options: [
      "Only retail payments",
      "Payroll, vendor payments, intercompany transfers with confidentiality",
      "Public data sharing",
      "Slow cross-border loans"
    ],
    correct: 1,
    explanation: "Aleo supports payroll, vendor, and intercompany payments with privacy and auditability."
  },
  {
    question: "What recent partnerships are mentioned as building momentum for Aleo?",
    options: [
      "With SWIFT",
      "With Revolut and as first privacy L1 in GDN",
      "With MakerDAO only",
      "No partnerships mentioned"
    ],
    correct: 1,
    explanation: "The announcement cites partnerships with Revolut and joining the Global Dollar Network."
  },
  {
    question: "When did Aleo join Binance Alpha?",
    options: [
      "September 14, 2024",
      "September 14, 2025",
      "October 1, 2025",
      "August 14, 2025"
    ],
    correct: 1,
    explanation: "Aleo was added to Binance Alpha on Sept 14, 2025."
  },
  {
    question: "What core challenge does Aleo address in enterprise blockchain adoption?",
    options: [
      "Lack of users",
      "Exposing sensitive financial info while trying to use faster/cheaper rails",
      "Too much privacy",
      "Hardware shortages"
    ],
    correct: 1,
    explanation: "Aleo enables enterprises to keep financial data private while getting the speed/cost benefits."
  },
  // === zPass (10) ===
  {
    question: "What is the primary purpose of the zPass integrations highlighted?",
    options: [
      "To enable privacy-preserving identity verification",
      "To build NFT marketplaces",
      "To run L2 rollups",
      "To do on-chain gaming only"
    ],
    correct: 0,
    explanation: "zPass shows that users can prove attributes without revealing the underlying data."
  },
  {
    question: "Which project uses zPass to protect young gamers?",
    options: ["World3", "Humine", "Playside", "GeniiDAO"],
    correct: 2,
    explanation: "Playside (Play3) uses zPass for moderated, age-gated experiences."
  },
  {
    question: "What is the main application of zPass in the World3 project?",
    options: [
      "Keeping game states hidden to ensure fairness",
      "Tokenizing real estate",
      "DEX routing",
      "File storage"
    ],
    correct: 0,
    explanation: "World3 keeps game states hidden, proving the zkGaming thesis."
  },
  {
    question: "How does Humine utilize zPass in zClinical?",
    options: [
      "To let patients prove study eligibility without exposing full medical history",
      "To stream video",
      "To mine Aleo",
      "To verify NFTs"
    ],
    correct: 0,
    explanation: "Humine uses zPass so medical data stays private but verifiable."
  },
  {
    question: "What target does GeniiDAO aim for?",
    options: ["1,000 daily active users", "100 DAU", "10,000 DAU", "500 validators"],
    correct: 0,
    explanation: "GeniiDAO targets 1,000 DAU in its learning network."
  },
  {
    question: "Which project uses zPass to bridge online and real-world trust?",
    options: ["Three of Cups (3oC)", "Humine", "World3", "Playside"],
    correct: 0,
    explanation: "3oC uses zPass to verify identity for IRL/online encounters."
  },
  {
    question: "What SDK do these projects use for zPass integration?",
    options: ["zPass SDK", "Aleo Core SDK", "Google ZK SDK", "Play3 SDK"],
    correct: 0,
    explanation: "They use the newly launched zPass SDK."
  },
  {
    question: "Which of the following is NOT a zPass feature?",
    options: ["Selective disclosure", "Cryptographic verification", "Public data broadcasting", "User-controlled access"],
    correct: 2,
    explanation: "zPass does not broadcast data publicly."
  },
  {
    question: "How can teams get support for zPass from Aleo Foundation?",
    options: ["By contacting via Discord", "By on-chain airdrop", "By KYC on Gate", "By running a miner"],
    correct: 0,
    explanation: "Teams can request funding/support via the Aleo Discord."
  },
  {
    question: "Which sectors do the zPass examples cover?",
    options: [
      "Gaming, healthcare, education, social",
      "Logistics, supply chain, energy",
      "Farming, insurance, shipping",
      "Only DeFi"
    ],
    correct: 0,
    explanation: "They span gaming, healthcare, education, and social trust use cases."
  }
];
export default function AleoQuizInteractive() {
  const [quiz, setQuiz] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // === фиксированные размеры карточки ===
  const cardHeight = 640;
  const cardWidth = 560;

  function initializeQuiz() {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setQuiz(shuffled.slice(0, 5));
    setCurrent(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setFinished(false);
  }

  useEffect(() => {
    initializeQuiz();
  }, []);

  function handleAnswer(index) {
    if (showExplanation) return;
    setSelected(index);
    setShowExplanation(true);
    const correct = quiz[current].correct === index;
    if (correct) setScore((s) => s + 1);
  }

  function nextQuestion() {
    if (current + 1 < quiz.length) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  }

  return (
    <section
  id="quiz-zone"
  className="relative min-h-screen flex flex-col items-center justify-center text-gray-100 px-6 py-32 overflow-hidden"
>
  {/* оставляем только частицы и свечение */}
  <FloatingSymbols />

  {/* убрали блуждающий блик, оставили лёгкое фоновое свечение */}
<div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />

  <div className="relative z-10 w-full text-center flex flex-col items-center">
    <motion.h3
      className="text-4xl font-semibold text-[#EEFFA8] mb-4 drop-shadow-[0_0_8px_rgba(238,255,168,0.6)]"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      Aleo Quiz Zone
    </motion.h3>
    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
      Test how well you know Aleo and its ecosystem!
    </p>

    <AnimatePresence mode="wait">
      {!finished ? (
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="relative border border-[#EEFFA8]/15 rounded-3xl backdrop-blur-[6px] bg-black/20 shadow-[0_0_60px_rgba(238,255,168,0.08)] overflow-hidden flex flex-col justify-center"
          style={{
            width: "760px",
            height: "480px",
            margin: "0 auto",
          }}
        >
          <div className="absolute inset-0 rounded-3xl shadow-[0_0_70px_15px_rgba(238,255,168,0.12)] pointer-events-none" />

          <div className="relative z-10 p-10 text-center">
            <h4 className="text-xl text-white font-medium mb-6">
              {quiz[current]?.question}
            </h4>

            <div className="grid grid-cols-1 gap-3 mb-6">
              {quiz[current]?.options.map((opt, i) => {
                const isCorrect = i === quiz[current].correct;
                const isSelected = i === selected;
                let bg = "bg-white/10 hover:bg-[#EEFFA8]/10";
                if (showExplanation && isSelected) {
                  bg = isCorrect
                    ? "bg-green-500/30 border-green-400/40"
                    : "bg-red-500/30 border-red-400/40";
                }
                if (showExplanation && !isSelected && isCorrect) {
                  bg = "bg-green-500/20 border-green-400/30";
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={showExplanation}
                    className={`${bg} border border-white/10 text-gray-200 py-3 rounded-xl transition`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-gray-300 text-sm mb-6"
              >
                {quiz[current].explanation}
              </motion.div>
            )}

            {showExplanation && (
              <button
                onClick={nextQuestion}
                className="px-6 py-3 bg-[#EEFFA8]/10 border border-[#EEFFA8]/30 rounded-xl text-[#EEFFA8] hover:bg-[#EEFFA8]/20 transition"
              >
                {current + 1 < quiz.length ? "Next Question" : "Show Results"}
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="results"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative border border-[#EEFFA8]/15 rounded-3xl backdrop-blur-[6px] bg-black/20 shadow-[0_0_60px_rgba(238,255,168,0.08)] overflow-hidden flex flex-col justify-center items-center"
          style={{
            width: "760px",
            height: "480px",
            margin: "0 auto",
          }}
        >
          <div className="absolute inset-0 rounded-3xl shadow-[0_0_70px_15px_rgba(238,255,168,0.12)] pointer-events-none" />

          <div className="relative z-10 text-center">
            <h4 className="text-2xl text-[#EEFFA8] font-bold mb-4">
              Quiz Complete!
            </h4>
            <p className="text-gray-300 mb-6">
              You scored <span className="text-[#EEFFA8]">{score}</span> out of{" "}
              {quiz.length}.
            </p>
            <button
              onClick={initializeQuiz}
              className="px-6 py-3 bg-[#EEFFA8]/10 border border-[#EEFFA8]/30 rounded-xl text-[#EEFFA8] hover:bg-[#EEFFA8]/20 transition"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</section>
  );
}

