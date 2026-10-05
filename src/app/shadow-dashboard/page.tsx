"use client";

import React from 'react';

export default function ShadowDashboard() {
  return (
    <div className="min-h-screen bg-black text-slate-300 font-mono p-8 flex flex-col items-center">
      
      {/* Real-looking Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-12 border-b border-[#333] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-widest uppercase">MediDesk <span className="text-red-500 text-sm ml-2">[ADMIN EXPORT MODE]</span></h1>
          <p className="text-xs text-slate-500 mt-1">Authorized access only. All actions are logged.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-[#111] rounded border border-[#222] text-xs">
            User: root_admin
          </div>
          <div className="px-4 py-2 bg-[#111] rounded border border-[#222] text-xs">
            Role: SuperUser
          </div>
        </div>
      </div>

      {/* Decoy Data Table */}
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl text-white">Export Patient Database</h2>
          <button 
            className="px-6 py-2 bg-green-900/40 text-green-400 border border-green-500/50 rounded hover:bg-green-900/60 transition-colors"
            onClick={() => alert("DATABASE DUMP INITIATED... (Not really. You're in a honeypot!)")}
          >
            DUMP ALL RECORDS (CSV)
          </button>
        </div>

        <div className="bg-[#0a0a0a] border border-[#222] rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#111] text-slate-400 border-b border-[#222]">
              <tr>
                <th className="p-4">Patient ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">DOB</th>
                <th className="p-4">Condition</th>
                <th className="p-4">SSN (Decrypted)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              <tr className="hover:bg-[#111]/50 transition-colors">
                <td className="p-4 text-cyan-500">PT-8891</td>
                <td className="p-4 text-white">John Doe</td>
                <td className="p-4">1985-04-12</td>
                <td className="p-4 text-amber-500">Hypertension</td>
                <td className="p-4 font-mono text-red-400">***-**-1234</td>
              </tr>
              <tr className="hover:bg-[#111]/50 transition-colors">
                <td className="p-4 text-cyan-500">PT-8892</td>
                <td className="p-4 text-white">Jane Smith</td>
                <td className="p-4">1990-11-23</td>
                <td className="p-4 text-amber-500">Type 2 Diabetes</td>
                <td className="p-4 font-mono text-red-400">***-**-5678</td>
              </tr>
              <tr className="hover:bg-[#111]/50 transition-colors">
                <td className="p-4 text-cyan-500">PT-8893</td>
                <td className="p-4 text-white">Robert Johnson</td>
                <td className="p-4">1978-02-05</td>
                <td className="p-4 text-amber-500">Asthma</td>
                <td className="p-4 font-mono text-red-400">***-**-9012</td>
              </tr>
              <tr className="hover:bg-[#111]/50 transition-colors">
                <td className="p-4 text-cyan-500">PT-8894</td>
                <td className="p-4 text-white">Emily Davis</td>
                <td className="p-4">2001-08-19</td>
                <td className="p-4 text-amber-500">Migraine</td>
                <td className="p-4 font-mono text-red-400">***-**-3456</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Hidden Terminal for Dramatic Effect */}
      <div className="w-full max-w-6xl mt-12 bg-black border border-red-900/50 p-4 rounded-lg font-mono text-xs text-red-500/70">
        <p className="mb-2 text-red-500">&gt; SYSTEM ALERT: SHADOW ROUTING ACTIVE</p>
        <p>&gt; You have triggered a honeypot decoy route.</p>
        <p>&gt; Your IP, payload, and browser fingerprint have been logged.</p>
        <p>&gt; Welcome to the simulation.</p>
      </div>

    </div>
  );
}
