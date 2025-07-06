"use client";
// @flow strict

import { personalData } from "@/utils/data/personal-data";
import Image from "next/image";
import Link from "next/link";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { FaFacebook, FaTwitterSquare } from "react-icons/fa";
import { MdDownload } from "react-icons/md";
import { RiContactsFill } from "react-icons/ri";
import { SiLeetcode } from "react-icons/si";
import { useTypewriter } from "../../helper/useTypewriter";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const lines = [
    "Hi, I'm",
    "Nguyen Anh Duyet",
    "Software Developer"
  ];
  const [line1, line2, line3] = useTypewriter(lines, 25, 200);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [isKong, setIsKong] = useState(false);
  const [rotate, setRotate] = useState(false);

  const handleAvatarClick = () => {
    setRotate(false);
    setTimeout(() => setRotate(true), 0);
    setTimeout(() => setIsKong(prev => !prev), 350);
  };

  const handleAnimationEnd = () => {
    setRotate(false);
  };

  return (
    <section className="relative z-20 flex flex-col items-center justify-center min-h-[35vh] py-4 mt-8">
      <div className="w-full max-w-7xl px-8">
        <div className="bg-gradient-to-br from-[#232946] via-[#181c2b] to-[#25213b] rounded-xl p-6 md:p-12 shadow-2xl border border-[#232946] flex flex-col md:grid md:grid-cols-2 gap-8 items-center animate-fade-in">
          {/* Bên trái: Avatar + Info ngắn */}
          <div className="flex flex-col items-start gap-3">
            <div className="relative mb-2 self-center -ml-10" style={{ perspective: '800px', width: 230, height: 230 }}>
              <div className="absolute -inset-3 rounded-full pointer-events-none glow-purple avatar-glow-effect"></div>
              <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#16f2b3]/30 to-[#a78bfa]/20 animate-pulse-glow" />
              <div
                className={`avatar-wrapper rounded-full border-2 border-[#232946] shadow-md z-10 relative bg-white avatar-glow${rotate ? ' rotate-once' : ''}`}
                onClick={handleAvatarClick}
                onAnimationEnd={handleAnimationEnd}
                style={{ cursor: 'pointer', display: 'inline-block' }}
              >
                <Image
                  src={isKong ? "/kong.gif" : (personalData.profile || "/avatar.png")}
                  alt={personalData.name}
                  width={230}
                  height={230}
                  className="rounded-full object-cover"
                  priority
                />
              </div>
            </div>
            <span className="mb-0 text-lg md:text-xl font-bold text-[#16f2b3] tracking-wide">{line1}</span>
            <span className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight">{line2}</span>
            <span className="text-lg md:text-xl font-bold text-[#a78bfa]">{line3}</span>
          </div>
          {/* Bên phải: Mô tả, social, nút */}
          <div className="flex flex-col items-start gap-4">
            <span className="text-[#16f2b3] text-lg font-extrabold uppercase tracking-widest mb-1">About</span>
            <p className="text-gray-300 text-base md:text-lg max-w-xl">
              {personalData.description}
            </p>
            <div className="flex items-center gap-4 mt-1">
              {personalData.github && (
                <Link href={personalData.github} target="_blank" className="transition-all hover:bg-[#16f2b3]/20 p-2 rounded-full bg-[#232946]">
                  <BsGithub size={24} className="text-white" />
                </Link>
              )}
              {personalData.linkedIn && (
                <Link href={personalData.linkedIn} target="_blank" className="transition-all hover:bg-[#16f2b3]/20 p-2 rounded-full bg-[#232946]">
                  <BsLinkedin size={24} className="text-white" />
                </Link>
              )}
              {personalData.facebook && (
                <Link href={personalData.facebook} target="_blank" className="transition-all hover:bg-[#16f2b3]/20 p-2 rounded-full bg-[#232946]">
                  <FaFacebook size={24} className="text-white" />
                </Link>
              )}
              {personalData.leetcode && (
                <Link href={personalData.leetcode} target="_blank" className="transition-all hover:bg-[#16f2b3]/20 p-2 rounded-full bg-[#232946]">
                  <SiLeetcode size={24} className="text-white" />
                </Link>
              )}
              {personalData.twitter && (
                <Link href={personalData.twitter} target="_blank" className="transition-all hover:bg-[#16f2b3]/20 p-2 rounded-full bg-[#232946]">
                  <FaTwitterSquare size={24} className="text-white" />
                </Link>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <Link href="#contact" className="bg-[#16f2b3] hover:bg-[#0d1224] border-2 border-[#16f2b3] px-5 py-2 rounded-full text-[#0d1224] hover:text-[#16f2b3] font-semibold transition-all duration-200 flex items-center gap-2">
                <span>Contact me</span>
                <RiContactsFill size={18} />
              </Link>
              {personalData.resume && (
                <Link className="flex items-center gap-2 rounded-full bg-[#a78bfa] hover:bg-[#16f2b3] px-5 py-2 text-[#0d1224] font-semibold transition-all duration-200" role="button" target="_blank" href={personalData.resume}>
                  <span>Get Resume</span>
                  <MdDownload size={18} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .animate-fade-in {
          opacity: 0;
          animation: fadeInBox 1.2s cubic-bezier(0.4,0,0.2,1) 0.1s forwards;
        }
        @keyframes fadeInBox {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: none; }
        }
        .animate-pulse-glow {
          animation: pulseGlow 2.5s ease-in-out infinite;
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.7; filter: blur(16px); }
          50% { opacity: 1; filter: blur(24px); }
        }
        .glow-purple {
          background: radial-gradient(circle, #a259ec 60%, transparent 80%);
          filter: blur(18px);
          opacity: 1;
          z-index: 1;
          animation: pulseGlowPurple 2.5s ease-in-out infinite;
        }
        @keyframes pulseGlowPurple {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 1; }
        }
        .relative.mb-2:hover .avatar-glow {
          transform: scale(1.08) rotate(-3deg);
          filter: brightness(1.1) drop-shadow(0 0 36px #a259ec);
        }
        .relative.mb-2:hover .avatar-glow-effect {
          filter: blur(24px);
          opacity: 1;
        }
        .rotate-once {
          animation: avatar-flip 0.7s cubic-bezier(.4,0,.2,1);
          backface-visibility: hidden;
        }
        @keyframes avatar-flip {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
      `}</style>
    </section>
  );
}