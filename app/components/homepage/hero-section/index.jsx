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

export default function HeroSection() {
  const lines = [
    "Hi, I'm",
    "Nguyen Anh Duyet",
    "Software Developer"
  ];
  const [line1, line2, line3] = useTypewriter(lines, 25, 200);
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[35vh] py-4 mt-8">
      <div className="w-full max-w-7xl px-8">
        <div className="bg-gradient-to-br from-[#232946] via-[#181c2b] to-[#25213b] rounded-xl p-6 md:p-12 shadow-2xl border border-[#232946] flex flex-col md:grid md:grid-cols-2 gap-8 items-center animate-fade-in">
          {/* Bên trái: Avatar + Info ngắn */}
          <div className="flex flex-col items-start gap-3">
            <div className="relative mb-2">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#16f2b3]/30 to-[#a78bfa]/20 animate-pulse-glow" />
              <Image
                src={personalData.profile || "/avatar.png"}
                alt={personalData.name}
                width={150}
                height={150}
                className="rounded-full border-2 border-[#232946] shadow-md object-cover z-10 relative bg-white"
                priority
              />
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
      `}</style>
    </section>
  );
}