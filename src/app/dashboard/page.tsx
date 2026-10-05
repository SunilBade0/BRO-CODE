"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const INITIAL_PATIENTS = [
  { id: "PAT-8812", name: "Makoto Yuki", status: "Stable", condition: "Routine checkup complete.", bloodType: "O" },
  { id: "PAT-9034", name: "Yukari Takeba", status: "Observation", condition: "Minor fatigue, resting.", bloodType: "A" },
  { id: "PAT-4122", name: "Junpei Iori", status: "Cleared", condition: "Fully recovered.", bloodType: "B" },
];

const INITIAL_LOGS = [
  { time: "00:00:12", action: "System Authenticated", user: "SYSTEM" },
  { time: "00:05:30", action: "Active Session Started", user: "doctor@sees.med" },
];

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [decryptKey, setDecryptKey] = useState("");
  const [decryptError, setDecryptError] = useState("");
  const [decrypted, setDecrypted] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: "", status: "Stable", condition: "", bloodType: "" });

  useEffect(() => {
    const isAuth = sessionStorage.getItem("sees_auth_token");
    if (!isAuth) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [router]);

  const addLog = (action: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setLogs(prev => [{ time: timeStr, action, user: "doctor@sees.med" }, ...prev]);
  };

  const handleDecrypt = (e: React.FormEvent) => {
    e.preventDefault();
    if (decryptKey === "0000") {
      setDecrypted(true);
      setDecryptError("");
      addLog(`Decrypted PHI for ${selectedPatient.id}`);
    } else {
      setDecryptError("Invalid Decryption Key");
      addLog(`Failed decryption attempt for ${selectedPatient.id}`);
    }
  };

  const closePatientModal = () => {
    setSelectedPatient(null);
    setDecrypted(false);
    setDecryptKey("");
    setDecryptError("");
  };

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedName = newPatient.name.replace(/[^a-zA-Z\s]/g, "");
    const newId = `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
    
    setPatients([...patients, { 
      id: newId, 
      name: sanitizedName, 
      status: newPatient.status, 
      condition: newPatient.condition, 
      bloodType: newPatient.bloodType.toUpperCase()
    }]);
    
    addLog(`Created secure record: ${newId}`);
    setShowAddModal(false);
    setNewPatient({ name: "", status: "Stable", condition: "", bloodType: "" });
  };

  if (loading) return null;

  return (
    <main className="min-h-screen p-6 lg:p-12 relative bg-[#09090b] text-white overflow-hidden flex flex-col">
      


      {/* Header */}
      <header className="flex justify-between items-center mb-10 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20 border border-white/10">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Secure Workspace</h1>
            <p className="text-xs text-white/50 font-medium">End-to-End Encrypted Portal</p>
          </div>
        </div>
        <button 
          onClick={() => {
            sessionStorage.removeItem("sees_auth_token");
            router.push("/");
          }}
          className="text-white/60 hover:text-white font-medium text-sm transition-colors px-4 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
        >
          Sign Out
        </button>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 relative z-10 flex-1">
        
        {/* Sidebar */}
        <div className="xl:col-span-1 flex flex-col gap-8">
          
          {/* User Profile Card */}
          <div className="glass-card p-6 border border-white/10 bg-black shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 p-[2px]">
                <div className="w-full h-full bg-[#09090b] rounded-full flex items-center justify-center">
                  <span className="font-bold text-sm">DR</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white">doctor@sees.med</h3>
                <p className="text-xs text-green-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  Active Session
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">Clearance</span>
              <span className="text-sm font-bold bg-white/10 px-3 py-1 rounded-lg">Level 5</span>
            </div>
          </div>
          
          {/* Security Controls */}
          <div className="glass-card p-6 border border-white/10 bg-black shadow-2xl space-y-4">
             <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Defense Systems</h3>
             <button 
                onClick={() => router.push("/threat-intel")}
                className="w-full text-left px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl transition-colors group flex items-center justify-between"
             >
                <div>
                   <div className="text-red-400 font-bold text-sm">Ring-0 Telemetry</div>
                   <div className="text-red-500/60 text-[10px] uppercase tracking-widest mt-0.5">ML Kill-Switch Active</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]"></div>
             </button>

             <button 
                onClick={() => router.push("/mtd")}
                className="w-full text-left px-4 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl transition-colors group flex items-center justify-between"
             >
                <div>
                   <div className="text-indigo-400 font-bold text-sm">Advanced Cryptography</div>
                   <div className="text-indigo-500/60 text-[10px] uppercase tracking-widest mt-0.5">Polymorphic MTD & FHE Wasm</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_#6366f1]"></div>
             </button>

             <button 
                onClick={() => window.open("/api/admin/export", "_blank")}
                className="w-full text-left px-4 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl transition-colors group flex items-center justify-between"
             >
                <div>
                   <div className="text-cyan-400 font-bold text-sm">Decoy Honeypot</div>
                   <div className="text-cyan-500/60 text-[10px] uppercase tracking-widest mt-0.5">Shadow Routing Ready</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></div>
             </button>
          </div>

          {/* Activity Log */}
          <div className="glass-card p-6 flex-1 flex flex-col min-h-[300px] border border-white/10 bg-black shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest">Audit Log</h3>
              <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]"></div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-5 pr-2">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-4 text-sm relative before:absolute before:left-[3.5px] before:top-5 before:bottom-[-20px] before:w-[1px] before:bg-white/10 last:before:hidden">
                  <div className="w-2 h-2 rounded-full bg-white/20 mt-1.5 shrink-0 z-10"></div>
                  <div>
                    <div className="text-white/90 font-medium mb-0.5">{log.action}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-400 font-mono text-[10px]">{log.time}</span>
                      <span className="text-white/30 text-[10px]">&bull;</span>
                      <span className="text-white/40 text-[10px]">{log.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="xl:col-span-3 glass-card p-8 flex flex-col border border-white/10 bg-black shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">Patient Directory</h2>
              <p className="text-sm text-white/50 font-medium">All records are encrypted at rest.</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="gradient-btn px-5 py-2.5 text-sm rounded-xl font-semibold shadow-lg flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Record
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/5 text-[11px] font-bold text-white/40 uppercase tracking-widest">
                  <th className="py-4 pl-6 font-semibold">Identifier</th>
                  <th className="py-4 font-semibold">Patient Name</th>
                  <th className="py-4 font-semibold">Status</th>
                  <th className="py-4 text-right pr-6 font-semibold">Clearance</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {patients.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="py-5 pl-6">
                      <span className="text-indigo-300 font-mono text-xs bg-indigo-500/10 px-2 py-1 rounded-md">{p.id}</span>
                    </td>
                    <td className="py-5 font-medium text-white/90 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/50">
                        {decrypted && selectedPatient?.id === p.id ? p.name.charAt(0) : "?"}
                      </div>
                      {decrypted && selectedPatient?.id === p.id ? p.name : <span className="tracking-[0.2em] text-white/30">••••••••</span>}
                    </td>
                    <td className="py-5">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                        p.status === 'Stable' || p.status === 'Cleared' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-5 text-right pr-6">
                      <button 
                        onClick={() => setSelectedPatient(p)}
                        className="text-sm font-semibold text-white/50 hover:text-white transition-colors border border-white/10 hover:border-white/30 hover:bg-white/5 px-4 py-1.5 rounded-lg opacity-0 group-hover:opacity-100"
                      >
                        Decrypt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {patients.length === 0 && (
              <div className="py-12 text-center text-white/40 text-sm">
                No patient records found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl p-4 animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-md p-8 border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.2)] bg-black relative overflow-hidden rounded-[24px]">
            
            {/* Modal decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Access Terminal</h2>
                <p className="text-xs text-white/50 font-medium">Record: <span className="font-mono text-indigo-300">{selectedPatient.id}</span></p>
              </div>
              <button onClick={closePatientModal} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                ✕
              </button>
            </div>
            
            {!decrypted ? (
              <form onSubmit={handleDecrypt} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest pl-1">2FA Authorization PIN</label>
                  <input 
                    type="password" 
                    value={decryptKey}
                    onChange={(e) => setDecryptKey(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-center tracking-[1em] text-xl focus:border-purple-500/50 outline-none text-white transition-all"
                    placeholder="••••"
                    maxLength={4}
                    autoFocus
                  />
                  <p className="text-xs text-white/30 text-center pt-2 font-medium">Hint: Passcode is 0000</p>
                </div>
                {decryptError && <div className="text-pink-400 text-sm font-medium text-center p-2 bg-pink-500/10 rounded-lg">{decryptError}</div>}
                
                <button type="submit" className="w-full gradient-btn py-3.5 rounded-xl font-bold">Decrypt File</button>
              </form>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                  
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Full Legal Name</p>
                    <p className="text-lg font-semibold text-white">{selectedPatient.name}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Blood Type</p>
                        <p className="text-sm font-semibold text-white">{selectedPatient.bloodType}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Current Status</p>
                        <p className="text-sm font-semibold text-emerald-400">{selectedPatient.status}</p>
                     </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Physician Notes</p>
                    <p className="text-sm text-white/80 leading-relaxed bg-[#09090b]/50 p-4 rounded-xl border border-white/5">{selectedPatient.condition}</p>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl p-4 animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-lg p-8 border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.2)] bg-black relative overflow-hidden rounded-[24px]">
            
            {/* Modal decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>

            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">New Patient Record</h2>
                <p className="text-xs text-white/50 font-medium">Input will be sanitized automatically.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPatient} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest pl-1">Full Name</label>
                <input required type="text" placeholder="John Doe" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl p-3.5 focus:border-purple-500/50 outline-none text-white transition-all text-sm" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest pl-1">Status</label>
                  <select value={newPatient.status} onChange={e => setNewPatient({...newPatient, status: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl p-3.5 focus:border-purple-500/50 outline-none text-white transition-all text-sm [&>option]:bg-black">
                    <option>Stable</option>
                    <option>Observation</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest pl-1">Blood Group</label>
                  <input required type="text" placeholder="A+" maxLength={3} value={newPatient.bloodType} onChange={e => setNewPatient({...newPatient, bloodType: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl p-3.5 focus:border-purple-500/50 outline-none text-white transition-all text-sm uppercase" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest pl-1">Condition Notes</label>
                <textarea required placeholder="Patient is exhibiting..." value={newPatient.condition} onChange={e => setNewPatient({...newPatient, condition: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl p-3.5 min-h-[100px] resize-none focus:border-purple-500/50 outline-none text-white transition-all text-sm" />
              </div>
              
              <div className="pt-2">
                <button type="submit" className="w-full gradient-btn py-3.5 rounded-xl font-bold shadow-lg">Save Secure Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
