"use client";

import { useEffect, useState } from "react";

export default function CursorTracker() {
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Use requestAnimationFrame for smoother updates if desired, but this is fine
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {/* Soft Ambient Glow following the cursor */}
      <div 
        className="fixed top-0 left-0 w-[400px] h-[400px] bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-[80px] pointer-events-none z-[9999] transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${position.x - 200}px, ${position.y - 200}px)`,
        }}
      />
    </>
  );
}
