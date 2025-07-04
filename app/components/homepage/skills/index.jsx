"use client";

// @flow strict

import { skillsData } from "@/utils/data/skills";
import { skillsImage } from "@/utils/skill-image";
import Image from "next/image";
import { motion } from "framer-motion";

const cardVariants = {
  offscreen: { opacity: 0, y: 40 },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      bounce: 0.2,
      duration: 0.7,
    },
  },
};

function Skills() {
  return (
    <div id="skills" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      {/* Background Glow */}
      {/* <div className="w-[180px] h-[180px] bg-violet-400 rounded-full absolute top-6 left-1/2 -translate-x-1/2 filter blur-3xl opacity-20 pointer-events-none"></div> */}

      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex  items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-xl rounded-md">
            Skill
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {skillsData.map((skill, id) => (
          <motion.div
            key={id}
            className="group bg-[#181c2e] border border-transparent rounded-xl p-5 flex flex-col items-center shadow-md cursor-pointer relative overflow-hidden animated-border"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariants}
            whileHover={{ scale: 1.08 }}
          >
            <div className="flex items-center justify-center mb-4 h-12 w-12 rounded-lg bg-[#23274a] group-hover:bg-violet-500/10 transition-all duration-300">
              {skillsImage(skill)?.src && (
                <Image
                  src={skillsImage(skill).src}
                  alt={typeof skill === 'string' ? skill : skill.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain rounded-lg"
                />
              )}
            </div>
            <p className="text-white text-base sm:text-lg font-medium text-center">
              {typeof skill === 'string' ? skill : skill.name}
            </p>
            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-gradient-animated pointer-events-none transition-all duration-300"></div>
          </motion.div>
        ))}
      </div>
      <style jsx global>{`
        .animated-border {
          position: relative;
        }
        .animated-border .border-gradient-animated {
          border-image: linear-gradient(270deg, #a78bfa, #7c3aed, #a78bfa) 1;
          animation: borderMove 2s linear infinite;
        }
        @keyframes borderMove {
          0% {
            border-image-source: linear-gradient(270deg, #a78bfa, #7c3aed, #a78bfa);
          }
          100% {
            border-image-source: linear-gradient(90deg, #a78bfa, #7c3aed, #a78bfa);
          }
        }
      `}</style>
    </div>
  );
}

export default Skills;