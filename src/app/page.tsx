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
        setError("Invalid Evoker ID or Passcode. Access Denied.");
        setIsAuthenticating(false);
      }
    }, 800);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 lg:p-24 relative overflow-hidden">
      
      {/* Background Animated Gradient Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] animate-blob mix-blend-screen" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[150px] animate-blob animation-delay-2000 mix-blend-screen" />
      <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[150px] animate-blob animation-delay-4000 mix-blend-screen" />

      <div className="z-10 w-full max-w-5xl flex flex-col lg:flex-row gap-16 items-center justify-between">
        
        {/* Left Side: Branding */}
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/80 font-medium text-sm tracking-wide shadow-lg">
            <span className="w-2 h-2 rounded-full bg-green-400 mr-2 shadow-[0_0_8px_#4ade80]"></span>
            System Operational
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              SEES Secure.
            </span>
            Modern Medical Management.
          </h1>
          
          <p className="text-white/60 text-lg max-w-md font-normal leading-relaxed">
            Zero-Trust architecture designed for healthcare. Protect your sensitive patient data with military-grade client validation.
          </p>
        </div>

        {/* Right Side: Auth / Entry Card */}
        <div className="w-full max-w-md glass-card p-10 relative">
          
          <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-sm text-white/50 font-normal mb-8">Enter your credentials to access the secure portal.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wide">Work Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input p-4"
                placeholder="doctor@sees.med"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wide">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input p-4"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="text-pink-400 text-sm font-medium p-3 rounded-lg bg-pink-500/10 border border-pink-500/20">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isAuthenticating}
              className={`w-full gradient-btn py-4 mt-2 text-base shadow-lg ${isAuthenticating ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isAuthenticating ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-white/40 font-medium">
              Protected by advanced client validation.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
