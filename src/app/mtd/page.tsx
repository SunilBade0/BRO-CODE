"use client";

import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Shuffle, Database, Activity } from 'lucide-react';

export default function MTD_FHEDemo() {
  const [currentEndpoint, setCurrentEndpoint] = useState("/api/v1/patient_records");
  const [attackLogs, setAttackLogs] = useState<string[]>([]);
  const [fheLogs, setFheLogs] = useState<string[]>([]);

  // Polymorphic Endpoint Generator
  useEffect(() => {
    const generateEndpoint = () => {
      const chars = 'abcdef0123456789';
      let hash = '';
      for (let i = 0; i < 8; i++) hash += chars[Math.floor(Math.random() * chars.length)];
      return `/api/dynamic_${hash}/records`;
    };

    const interval = setInterval(() => {
      setCurrentEndpoint(generateEndpoint());
    }, 4000); // Shifts every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Attacker Script Simulation
  useEffect(() => {
    const attackInterval = setInterval(() => {
      const attempts = [
        "/api/v1/patient_records",
        "/api/admin",
        "/api/v2/users",
        "/graphql",
        "/api/patients/export"
      ];
      
      const randomAttempt = attempts[Math.floor(Math.random() * attempts.length)];
      
      setAttackLogs(prev => {
        const newLogs = [...prev, `[DIRBUSTER] GET ${randomAttempt} -> 404 NOT FOUND`];
        if (newLogs.length > 15) newLogs.shift();
        return newLogs;
      });
    }, 800);

    return () => clearInterval(attackInterval);
  }, [currentEndpoint]);

  // FHE Server Simulation
  useEffect(() => {
    const fheInterval = setInterval(() => {
      const mockCipher1 = "0x" + Math.random().toString(16).substring(2, 10).toUpperCase();
      const mockCipher2 = "0x" + Math.random().toString(16).substring(2, 10).toUpperCase();
      
      setFheLogs(prev => {
        const newLogs = [
          ...prev, 
          `[WASM-SEAL] Received Encrypted Payload: ${mockCipher1}`,
          `[NODE-SERVER] Computing Risk Score...`,
          `[NODE-SERVER] Operation: ADD(Ciphertext(${mockCipher1}), Ciphertext(${mockCipher2}))`,
          `[NODE-SERVER] Success! Returning computed Ciphertext. Plaintext remained hidden.`
        ];
        if (newLogs.length > 12) newLogs.splice(0, 4);
        return newLogs;
      });
    }, 3000);

    return () => clearInterval(fheInterval);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-mono p-4 lg:p-8">
      
      {/* Header */}
      <header className="mb-8 border-b border-indigo-900/50 pb-6">
        <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600 flex items-center gap-3">
          <Shield className="w-8 h-8 text-indigo-500" />
          ADVANCED ARCHITECTURE DEMO
        </h1>
        <p className="text-indigo-400/70 text-sm mt-2">Pillar 1: Polymorphic Moving Target Defense (MTD) | Pillar 2: Fully Homomorphic Encryption (FHE)</p>
      </header>

      {/* Control Banner */}
      <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-4 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
          <span className="text-sm font-bold text-emerald-400">POLYMORPHIC ENGINE ACTIVE</span>
        </div>
        <div className="text-xs md:text-sm bg-black/50 px-4 py-2 rounded-lg border border-indigo-500/20 text-indigo-300 flex items-center gap-2">
          <Shuffle size={14} />
          Current Valid Endpoint: <span className="font-bold text-white bg-indigo-600/40 px-2 py-0.5 rounded">{currentEndpoint}</span>
        </div>
      </div>

      {/* Split Screen Demo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
        
        {/* Left Screen: Attacker View */}
        <div className="bg-black border border-red-900/50 rounded-xl flex flex-col overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.1)]">
          <div className="bg-red-950/40 border-b border-red-900/50 p-3 flex items-center gap-2">
            <Terminal size={16} className="text-red-500" />
            <span className="text-xs font-bold text-red-500 tracking-widest uppercase">Automated Reconnaissance Script (Attacker)</span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto font-mono text-[11px] md:text-xs leading-relaxed space-y-1">
            <div className="text-slate-500 mb-4">
              $ ./dirbuster -u https://medidesk.app/ -w common_apis.txt<br/>
              Starting scan...
            </div>
            {attackLogs.map((log, i) => (
              <div key={i} className="text-red-400/80">
                {log}
              </div>
            ))}
          </div>
          <div className="p-3 bg-red-950/20 text-red-500/70 text-[10px] text-center border-t border-red-900/50">
            Attacker is infinitely chasing 404 errors as the endpoints mutate.
          </div>
        </div>

        {/* Right Screen: FHE Server View */}
        <div className="bg-black border border-indigo-900/50 rounded-xl flex flex-col overflow-hidden shadow-[0_0_30px_rgba(99,102,241,0.1)]">
          <div className="bg-indigo-950/40 border-b border-indigo-900/50 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database size={16} className="text-indigo-400" />
              <span className="text-xs font-bold text-indigo-400 tracking-widest uppercase">Homomorphic Server Logic (Backend)</span>
            </div>
            <Activity size={14} className="text-indigo-400 animate-pulse" />
          </div>
          <div className="p-4 flex-1 overflow-y-auto font-mono text-[11px] md:text-xs leading-relaxed space-y-3">
            <div className="text-slate-500 mb-2">
              [SYSTEM] FHE Wasm Instance Initialized.<br/>
              [SYSTEM] Waiting for encrypted client payload...
            </div>
            {fheLogs.map((log, i) => (
              <div key={i} className={`
                ${log.includes('Encrypted Payload') ? 'text-indigo-300' : ''}
                ${log.includes('Computing') ? 'text-amber-300' : ''}
                ${log.includes('Operation: ADD') ? 'text-fuchsia-400 font-bold' : ''}
                ${log.includes('Success') ? 'text-emerald-400' : ''}
              `}>
                {log}
              </div>
            ))}
          </div>
          <div className="p-3 bg-indigo-950/20 text-indigo-400/70 text-[10px] text-center border-t border-indigo-900/50">
            Server calculates complex logic without holding decryption keys.
          </div>
        </div>

      </div>

    </div>
  );
}
