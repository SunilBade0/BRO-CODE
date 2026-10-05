"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Simple client-side protection: If not authenticated, kick them back.
  // In a real secure app, this happens via HTTP-only cookies and middleware.
  useEffect(() => {
    const isAuth = sessionStorage.getItem("sees_auth_token");
    if (!isAuth) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-p3-blue text-2xl font-black uppercase tracking-widest animate-pulse">
          Decrypting PHI Data...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6 lg:p-12 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="fixed top-[-10%] right-[-5%] w-[400px] h-[400px] bg-p3-blue opacity-10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-600 opacity-5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <header className="flex justify-between items-center mb-12 p3-card px-8 py-4 z-10 relative">
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-white text-p3-blue font-black tracking-widest text-sm uppercase">
            SEES Secure
          </div>
          <h1 className="text-xl font-black uppercase tracking-widest text-white">
            Medical Central Command
          </h1>
        </div>
        <button 
          onClick={() => {
            sessionStorage.removeItem("sees_auth_token");
            router.push("/");
          }}
          className="text-slate-400 hover:text-white font-bold uppercase tracking-wider text-sm transition-colors"
        >
          [ Terminate Session ]
        </button>
      </header>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Left Column: Quick Stats */}
        <div className="space-y-8">
          <div className="p3-card p-6 border-l-4 border-p3-blue">
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-widest mb-4">Current Clearance</h3>
            <div className="text-3xl font-black text-white uppercase">Level 5 (Doctor)</div>
          </div>
          
          <div className="p3-card p-6 border-l-4 border-red-500">
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-widest mb-4">Active Threats</h3>
            <div className="text-3xl font-black text-white uppercase">0 Detected</div>
          </div>
        </div>

        {/* Middle/Right Column: Patient Roster */}
        <div className="lg:col-span-2 p3-card p-8">
          <h2 className="text-2xl font-black uppercase tracking-wider text-white mb-2">Encrypted Patient Roster</h2>
          <p className="text-sm text-p3-blue-light font-bold mb-8 uppercase tracking-widest">
            Data secured via AES-256
          </p>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-700 text-xs uppercase tracking-widest text-slate-400 font-bold">
                <th className="pb-4">Patient ID</th>
                <th className="pb-4">Alias</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-semibold">
              <tr className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                <td className="py-4 text-p3-blue-light">#P3-001</td>
                <td className="py-4">Makoto Y.</td>
                <td className="py-4"><span className="text-green-400">Stable</span></td>
                <td className="py-4"><button className="text-slate-400 hover:text-white uppercase text-xs">View File</button></td>
              </tr>
              <tr className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                <td className="py-4 text-p3-blue-light">#P3-002</td>
                <td className="py-4">Yukari T.</td>
                <td className="py-4"><span className="text-yellow-400">Under Observation</span></td>
                <td className="py-4"><button className="text-slate-400 hover:text-white uppercase text-xs">View File</button></td>
              </tr>
              <tr className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                <td className="py-4 text-p3-blue-light">#P3-003</td>
                <td className="py-4">Junpei I.</td>
                <td className="py-4"><span className="text-green-400">Cleared</span></td>
                <td className="py-4"><button className="text-slate-400 hover:text-white uppercase text-xs">View File</button></td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}
