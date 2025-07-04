"use client";
// @flow strict

import * as React from 'react';
import { useState } from 'react';
import { FaGithub, FaExternalLinkAlt, FaUserTie } from 'react-icons/fa';
import Image from 'next/image';
import placeholder from '/public/png/placeholder.png';

const tagColors = [
  'bg-pink-500/20 text-pink-300 border-pink-400/30',
  'bg-violet-500/20 text-violet-300 border-violet-400/30',
  'bg-blue-500/20 text-blue-300 border-blue-400/30',
  'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
  'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
  'bg-orange-500/20 text-orange-300 border-orange-400/30',
  'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
  'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/30',
];

function ProjectCard({ project }) {
  const [showFull, setShowFull] = useState(false);
  const maxLength = 180;
  const isLong = project.description.length > maxLength;
  const displayDesc = showFull || !isLong ? project.description : project.description.slice(0, maxLength) + '...';

  return (
    <div className="relative rounded-2xl border border-violet-900 bg-[#18192b] shadow-lg p-6 flex flex-col gap-4 transition-transform hover:-translate-y-1 hover:shadow-2xl duration-300">
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-[#f3f4fa]">{project.name}</h2>
            <span className="flex items-center gap-1 bg-violet-900/60 text-violet-200 px-3 py-1 rounded text-xs font-semibold">
              <FaUserTie className="text-pink-400" /> {project.role}
            </span>
          </div>
          <p className="text-violet-100 text-sm mb-2 leading-relaxed">
            {displayDesc}
            {isLong && (
              <button
                className="ml-2 text-violet-400 underline hover:text-pink-400 transition text-xs font-semibold"
                onClick={() => setShowFull(v => !v)}
              >
                {showFull ? 'Thu gọn' : 'Xem thêm'}
              </button>
            )}
          </p>
          {/* Tools */}
          <div className="flex flex-wrap gap-2 mb-2">
            {project.tools.map((tool, i) => (
              <span
                key={i}
                className={`px-2 py-1 rounded text-xs font-mono border ${tagColors[i % tagColors.length]}`}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
        {/* Links */}
        <div className="flex gap-4 mt-2">
          {project.code && (
            <a
              href={project.code}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-semibold px-3 py-1 rounded transition bg-gradient-to-r from-violet-500 to-pink-500 hover:from-blue-500 hover:to-violet-600 text-white border-none shadow-md"
            >
              <FaGithub /> Code
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-semibold px-3 py-1 rounded transition bg-gradient-to-r from-violet-500 to-pink-500 hover:from-blue-500 hover:to-violet-600 text-white border-none shadow-md"
            >
              <FaExternalLinkAlt /> Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;