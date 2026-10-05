"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldAlert, Activity, Cpu, HardDrive, Lock, AlertTriangle, TerminalSquare } from 'lucide-react';

const INITIAL_DATA_LENGTH = 20;

export default function ThreatIntelDashboard() {
  const [data, setData] = useState(Array.from({ length: INITIAL_DATA_LENGTH }, (_, i) => ({
    time: i,
    cpu: Math.random() * 20 + 10, // Normal CPU 10-30%
    memory: Math.random() * 15 + 40, // Normal Mem 40-55%
    io: Math.random() * 5 + 1, // Normal I/O 1-6 MB/s
  })));
  
  const [isUnderAttack, setIsUnderAttack] = useState(false);
  const [isLockedDown, setIsLockedDown] = useState(false);
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] Ring-0 Telemetry Agent initialized...', '[SYSTEM] ML Anomaly Detection: ACTIVE']);

  // Simulate incoming telemetry data
  useEffect(() => {
    if (isLockedDown) return;

    const interval = setInterval(() => {
      setData(prevData => {
        const lastTime = prevData[prevData.length - 1].time;
        const newData = [...prevData.slice(1), {
          time: lastTime + 1,
          cpu: isUnderAttack ? Math.random() * 20 + 80 : Math.random() * 20 + 10, // Spikes to 80-100% during attack
          memory: isUnderAttack ? Math.random() * 30 + 70 : Math.random() * 15 + 40, // Spikes to 70-100%
          io: isUnderAttack ? Math.random() * 50 + 150 : Math.random() * 5 + 1, // Massive I/O spike
        }];
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isUnderAttack, isLockedDown]);

  // Handle ML detection and lockdown
  useEffect(() => {
    if (isUnderAttack && !isLockedDown) {
      const detectTimeout = setTimeout(() => {
        setLogs(prev => [...prev, '[ML-GUARD] 🚨 ANOMALY DETECTED: Ransomware Encryption Signature (Confidence: 99.8%)']);
        
        const killTimeout = setTimeout(() => {
          setIsLockedDown(true);
          setLogs(prev => [...prev, '[KILL-SWITCH] 🛑 Hardware Network Interface Isolated.', '[KILL-SWITCH] 🛑 Process PID 4992 Terminated.', '[SYSTEM] Threat neutralized. Dashboard locked.']);
        }, 1500);

        return () => clearTimeout(killTimeout);
      }, 3000); // Takes 3 seconds for the ML to "detect" the attack

      return () => clearTimeout(detectTimeout);
    }
  }, [isUnderAttack, isLockedDown]);

  const triggerAttack = () => {
    setIsUnderAttack(true);
    setLogs(prev => [...prev, '[EXTERNAL] ⚠️ Suspicious payload execution detected in memory.', '[TELEMETRY] I/O Write Speeds exceeding normal thresholds.']);
  };

  return (
    <div className={`min-h-screen p-6 font-mono transition-colors duration-1000 ${isLockedDown ? 'bg-red-950/20' : 'bg-[#030712]'}`}>
      
      {/* Header */}
      <header className="flex justify-between items-center border-b border-cyan-900/50 pb-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center gap-3">
            <Activity className="w-8 h-8 text-cyan-400" />
            RING-0 TELEMETRY
          </h1>
          <p className="text-cyan-600/70 text-sm mt-1">Real-time OS Kernel Monitoring & ML Threat Interception</p>
        </div>
        
        <div className={`px-4 py-2 rounded border flex items-center gap-2 ${isLockedDown ? 'bg-red-900/40 border-red-500 text-red-400' : isUnderAttack ? 'bg-amber-900/40 border-amber-500 text-amber-400 animate-pulse' : 'bg-cyan-900/20 border-cyan-500/50 text-cyan-400'}`}>
          {isLockedDown ? <Lock size={16} /> : isUnderAttack ? <AlertTriangle size={16} /> : <ShieldAlert size={16} />}
          <span className="text-sm font-bold tracking-widest">
            {isLockedDown ? 'SYSTEM ISOLATED' : isUnderAttack ? 'THREAT DETECTED' : 'SYSTEM SECURE'}
          </span>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Charts Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* CPU Chart */}
          <div className="bg-[#0a0f1c] border border-cyan-900/30 p-4 rounded-xl">
            <h2 className="text-cyan-500 text-sm mb-4 flex items-center gap-2">
              <Cpu size={16} />
              CPU Utilization (%)
            </h2>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={[0, 100]} stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                  <Line type="monotone" dataKey="cpu" stroke={isUnderAttack ? '#ef4444' : '#22d3ee'} strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* I/O Chart */}
          <div className="bg-[#0a0f1c] border border-cyan-900/30 p-4 rounded-xl">
            <h2 className="text-cyan-500 text-sm mb-4 flex items-center gap-2">
              <HardDrive size={16} />
              Disk I/O Write Speed (MB/s)
            </h2>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={[0, 200]} stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                  <Line type="monotone" dataKey="io" stroke={isUnderAttack ? '#ef4444' : '#a855f7'} strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          
          {/* Controls */}
          <div className="bg-[#0a0f1c] border border-cyan-900/30 p-6 rounded-xl flex flex-col items-center justify-center text-center">
            <h3 className="text-slate-400 text-sm mb-4">ML Kill-Switch Demonstration</h3>
            {!isUnderAttack && !isLockedDown ? (
              <button 
                onClick={triggerAttack}
                className="w-full py-3 bg-red-950/50 hover:bg-red-900/80 text-red-400 border border-red-500/50 rounded uppercase tracking-widest text-xs font-bold transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]"
              >
                Inject Ransomware Payload
              </button>
            ) : isLockedDown ? (
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-cyan-950/50 hover:bg-cyan-900/80 text-cyan-400 border border-cyan-500/50 rounded uppercase tracking-widest text-xs font-bold transition-all"
              >
                Reset Environment
              </button>
            ) : (
              <div className="w-full py-3 bg-amber-950/50 text-amber-500 border border-amber-500/50 rounded uppercase tracking-widest text-xs font-bold animate-pulse">
                Attack in progress...
              </div>
            )}
            <p className="text-[10px] text-slate-600 mt-4">
              Clicking this will simulate a highly aggressive ransomware encryption process attempting to lock local disk files.
            </p>
          </div>

          {/* Terminal Logs */}
          <div className="bg-black border border-[#222] p-4 rounded-xl h-[335px] overflow-hidden flex flex-col relative">
            <div className="flex items-center gap-2 text-[#444] text-xs mb-3 pb-2 border-b border-[#222]">
              <TerminalSquare size={14} />
              SYSTEM.LOG
            </div>
            <div className="flex-1 overflow-y-auto font-mono text-[11px] space-y-2">
              {logs.map((log, i) => (
                <div key={i} className={`${
                  log.includes('ANOMALY') ? 'text-amber-400 font-bold' : 
                  log.includes('KILL-SWITCH') ? 'text-red-500 font-bold' : 
                  'text-slate-400'
                }`}>
                  {log}
                </div>
              ))}
            </div>
            {isLockedDown && (
              <div className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center text-center p-4 backdrop-blur-sm z-10">
                <Lock className="w-12 h-12 text-red-500 mb-3" />
                <h2 className="text-red-500 font-bold tracking-widest text-lg mb-1">HARDWARE ISOLATED</h2>
                <p className="text-red-400/80 text-xs">The machine learning model successfully intercepted the malicious payload and severed network interfaces before encryption could complete.</p>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
