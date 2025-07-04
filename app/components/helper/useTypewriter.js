import { useState, useEffect } from "react";

export function useTypewriter(lines, speed = 50, delayBetweenLines = 700) {
  const [displayed, setDisplayed] = useState(["", "", ""]);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Cursor blinking effect
  useEffect(() => {
    if (lineIdx >= lines.length) return;
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 400);
    return () => clearInterval(cursorInterval);
  }, [lineIdx, lines.length]);

  useEffect(() => {
    if (lineIdx >= lines.length) return;

    if (charIdx < lines[lineIdx].length) {
      const timeout = setTimeout(() => {
        setDisplayed((prev) => {
          const newLines = [...prev];
          newLines[lineIdx] += lines[lineIdx][charIdx];
          return newLines;
        });
        setCharIdx((c) => c + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (lineIdx < lines.length - 1) {
      const timeout = setTimeout(() => {
        setLineIdx((l) => l + 1);
        setCharIdx(0);
      }, delayBetweenLines);
      return () => clearTimeout(timeout);
    }
  }, [charIdx, lineIdx, lines, speed, delayBetweenLines]);

  // Add cursor to the current line
  const result = displayed.map((line, idx) => {
    if (idx === lineIdx && lineIdx < lines.length) {
      return line + (showCursor ? "|" : "");
    }
    return line;
  });

  return result;
}