"use client";

import { useEffect, useState } from "react";

export default function CursorTracker() {
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {/* Massive ambient background orb that physically tracks the mouse.
          Only uses 2 colors: intense indigo and deep pink. */}
      <div 
        className="fixed top-0 left-0 w-[800px] h-[800px] bg-gradient-to-r from-indigo-600/40 to-pink-600/40 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${position.x - 400}px, ${position.y - 400}px)`,
        }}
      />
    </>
  );
}
