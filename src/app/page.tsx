"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsAuthenticating(true);

    // Simulate secure backend verification delay
    setTimeout(() => {
      // Dummy Secure Authentication (Hackathon Prototype)
      // Accept doctor@sees.med with password123
      if (email === "doctor@sees.med" && password === "password123") {
        // Issue dummy token (stored in session storage for simple prototype auth)
        sessionStorage.setItem("sees_auth_token", "dummy_secure_token_abc123");
        router.push("/dashboard");
      } else {
        setError("Invalid Evoker ID or Passcode. Access Denied.");
        setIsAuthenticating(false);
      }
    }, 800);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 lg:p-24 relative overflow-hidden">
      
      {/* Dynamic Scanline */}
      <div className="scanline"></div>

      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-p3-blue opacity-20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-600 opacity-10 rounded-full blur-[150px]" />

      <div className="z-10 w-full max-w-5xl flex flex-col lg:flex-row gap-12 items-center justify-between">
        
        {/* Left Side: Branding */}
        <div className="flex-1 space-y-8">
          <div className="inline-block px-4 py-1 p3-card border-l-4 border-white text-white font-black tracking-widest text-sm uppercase mb-4 glitch-hover">
            Operation: Midnight
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-black text-white leading-tight uppercase glitch-hover transition-transform hover:scale-105 duration-300">
            <span className="block text-p3-blue drop-shadow-[0_0_15px_rgba(0,136,204,0.8)]">S.E.E.S.</span>
            Secure
            <span className="block text-3xl lg:text-5xl mt-2 text-slate-300">Electronic Examination System</span>
          </h1>
          
          <p className="text-slate-400 text-lg max-w-md font-semibold leading-relaxed border-l-2 border-slate-700 pl-4 py-2">
            Zero-Trust Medical Records & Patient Management. Protect your PHI from the shadows.
          </p>
        </div>

        {/* Right Side: Auth / Entry Card */}
        <div className="w-full max-w-md p3-card p-10 relative">
          
          {/* Decorative Corner accent */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-p3-blue to-transparent opacity-50" />

          <h2 className="text-2xl font-black uppercase tracking-wider text-white mb-2">System Access</h2>
          <p className="text-sm text-p3-blue-light font-bold mb-8 uppercase tracking-widest">Authentication Required</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Evoker ID (Email)</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 focus:border-p3-blue p-4 text-white outline-none transition-colors"
                placeholder="doctor@sees.med"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Passcode</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 focus:border-p3-blue p-4 text-white outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="text-red-400 text-xs font-bold uppercase tracking-wider border-l-2 border-red-500 pl-2">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isAuthenticating}
              className={`w-full p3-button py-4 mt-4 text-lg hover:shadow-[0_0_20px_rgba(0,136,204,0.6)] ${isAuthenticating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isAuthenticating ? "Verifying..." : "Initiate Access"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Protected by AES-256 Encryption
            </p>
          </div>
        </div>

      </div>

      {/* Footer / Team Details */}
      <footer className="absolute bottom-6 left-0 w-full text-center z-10 pointer-events-none">
        <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">
          Developed by Team BRO CODE (53) // Build Secure Hackathon 2026
        </p>
      </footer>

    </main>
  );
}
