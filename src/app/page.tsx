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

    setTimeout(() => {
      if (email === "doctor@sees.med" && password === "password123") {
        sessionStorage.setItem("sees_auth_token", "dummy_secure_token_abc123");
        router.push("/dashboard");
      } else {
        setError("Invalid Credentials. Access Denied.");
        setIsAuthenticating(false);
      }
    }, 1200); // slightly longer for the cool button state
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#09090b]">
      
      {/* 
        PREMIUM BACKGROUND ANIMATIONS 
        A wildly blurred rotating conic gradient mimicking a digital aurora.
      */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none mix-blend-screen">
        <div 
          className="w-[100vw] h-[100vw] max-w-[1000px] max-h-[1000px] animate-spin-slow opacity-80"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0%, #6366f1 20%, #a855f7 40%, #ec4899 60%, #3b82f6 80%, transparent 100%)',
            filter: 'blur(120px)',
            borderRadius: '50%'
          }}
        />
      </div>

      {/* Floating ambient orbs for extra depth */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-[100px] animate-blob z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-[100px] animate-blob animation-delay-2000 z-0" />

      {/* Centerpiece: The Login Card */}
      <div className="z-10 w-full max-w-[420px] mx-4 relative group">
        
        {/* Glowing border effect behind the card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-indigo-500 to-purple-500 rounded-[28px] opacity-30 group-hover:opacity-60 transition duration-1000 blur-xl"></div>
        
        <div className="p-10 relative bg-black border border-white/5 rounded-[24px] shadow-2xl">
          
          <div className="flex justify-center mb-6">
             <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
             </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Welcome back</h2>
            <p className="text-sm text-white/50 font-medium">Log in to your secure workspace.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest pl-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-purple-500/50 focus:bg-[#151515] focus:shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                placeholder="doctor@sees.med"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest pl-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 tracking-widest outline-none transition-all focus:border-purple-500/50 focus:bg-[#151515] focus:shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="text-pink-400 text-sm font-medium p-3 rounded-xl bg-pink-950 border border-pink-500/30 text-center animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isAuthenticating}
              className={`w-full gradient-btn py-4 mt-4 text-sm font-bold tracking-wide shadow-lg flex items-center justify-center gap-2 ${isAuthenticating ? 'opacity-80 cursor-wait' : ''}`}
            >
              {isAuthenticating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </>
              ) : "Continue"}
            </button>
          </form>

        </div>
      </div>
    </main>
  );
}
