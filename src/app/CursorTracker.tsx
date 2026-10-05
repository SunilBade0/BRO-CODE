"use client";

import { useEffect, useState } from "react";

export default function CursorTracker() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === "pointer" || 
        target.tagName === "BUTTON" || 
        target.tagName === "A" ||
        target.tagName === "INPUT"
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {/* Outer Tracking Ring */}
      <div 
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-p3-blue pointer-events-none z-[9999] transition-all duration-150 ease-out mix-blend-screen"
        style={{
          transform: `translate(${position.x - 20}px, ${position.y - 20}px) scale(${isPointer ? 1.5 : 1})`,
          backgroundColor: isPointer ? 'rgba(0, 136, 204, 0.1)' : 'transparent',
          boxShadow: isPointer ? '0 0 15px rgba(0, 136, 204, 0.5)' : 'none'
        }}
      />
      {/* Inner Dot */}
      <div 
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[10000] shadow-[0_0_10px_#fff]"
        style={{
          transform: `translate(${position.x - 4}px, ${position.y - 4}px)`,
        }}
      />
      {/* Ambient Mouse Glow */}
      <div 
        className="fixed top-0 left-0 w-[600px] h-[600px] bg-p3-blue opacity-15 rounded-full blur-[120px] pointer-events-none z-[-1] transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${position.x - 300}px, ${position.y - 300}px)`,
        }}
      />
    </>
  );
}
