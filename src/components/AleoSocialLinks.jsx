import React from 'react';
import { motion } from 'framer-motion';
import { FaXTwitter, FaDiscord } from 'react-icons/fa6';

export default function AleoSocialLinks() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center gap-6 bg-black text-white py-20 px-6">
      {/* X (Twitter) */}
      <motion.a
        href="https://twitter.com/aleohq"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        className="flex flex-col md:flex-row justify-between items-center bg-[#121216] border border-white/10 rounded-[2rem] px-10 py-8 w-full max-w-md cursor-pointer hover:bg-[#EEFFA8]/10 transition"
      >
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Find Aleo on X</p>
          <h3 className="text-5xl font-bold text-[#EEFFA8]">270K+</h3>
          <p className="text-sm text-gray-500 mt-1">Followers</p>
        </div>
        <div className="flex flex-col items-center justify-center mt-6 md:mt-0">
          <FaXTwitter className="text-4xl mb-2" />
          <p className="text-white font-semibold flex items-center gap-1">
            X.com <span>↗</span>
          </p>
        </div>
      </motion.a>

      {/* Discord */}
      <motion.a
        href="https://discord.gg/aleo"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        className="flex flex-col md:flex-row justify-between items-center bg-[#121216] border border-white/10 rounded-[2rem] px-10 py-8 w-full max-w-md cursor-pointer hover:bg-[#EEFFA8]/10 transition"
      >
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Join the Aleo Community</p>
          <h3 className="text-5xl font-bold text-[#EEFFA8]">490K+</h3>
          <p className="text-sm text-gray-500 mt-1">Members</p>
        </div>
        <div className="flex flex-col items-center justify-center mt-6 md:mt-0">
          <FaDiscord className="text-4xl mb-2" />
          <p className="text-white font-semibold flex items-center gap-1">
            Discord <span>↗</span>
          </p>
        </div>
      </motion.a>
    </section>
  );
}
