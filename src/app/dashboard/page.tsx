"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const INITIAL_PATIENTS = [
  { id: "#P3-001", name: "Makoto Yuki", status: "Stable", condition: "Routine checkup complete.", bloodType: "O" },
  { id: "#P3-002", name: "Yukari Takeba", status: "Observation", condition: "Minor fatigue, resting.", bloodType: "A" },
  { id: "#P3-003", name: "Junpei Iori", status: "Cleared", condition: "Fully recovered.", bloodType: "B" },
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
    const newId = `#P3-00${patients.length + 1}`;
    
    setPatients([...patients, { 
      id: newId, 
      name: sanitizedName, 
      status: newPatient.status, 
      condition: newPatient.condition, 
      bloodType: newPatient.bloodType 
    }]);
    
    addLog(`Created secure record: ${newId}`);
    setShowAddModal(false);
    setNewPatient({ name: "", status: "Stable", condition: "", bloodType: "" });
  };

  if (loading) return null;

  return (
    <main className="min-h-screen p-6 lg:p-12 relative overflow-hidden flex flex-col">
      
      {/* Background Animated Gradient Orbs */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-blob mix-blend-screen pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[150px] animate-blob animation-delay-2000 mix-blend-screen pointer-events-none" />

      {/* Header */}
      <header className="flex justify-between items-center mb-10 z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/30">
            S
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">SEES Secure</h1>
            <p className="text-xs text-white/50 font-medium">Medical Central Command</p>
          </div>
        </div>
        <button 
          onClick={() => {
            sessionStorage.removeItem("sees_auth_token");
            router.push("/");
          }}
          className="text-white/60 hover:text-white font-medium text-sm transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
        >
          Sign Out
        </button>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10 flex-1">
        
        {/* Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-card p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-1">Clearance</p>
              <h3 className="text-2xl font-bold text-white">Level 5</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
              <span className="text-green-400 font-bold">OK</span>
            </div>
          </div>
          
          <div className="glass-card p-6 flex-1 flex flex-col min-h-[300px]">
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-4">Activity Log</h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className="text-indigo-400 font-mono text-xs pt-0.5">{log.time}</div>
                  <div>
                    <div className="text-white/90 font-medium">{log.action}</div>
                    <div className="text-white/40 text-xs">{log.user}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 glass-card p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Patient Database</h2>
              <p className="text-sm text-white/50 font-medium">Data secured via client-side validation</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="gradient-btn px-6 py-2.5 text-sm rounded-lg"
            >
              Add Record
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs font-semibold text-white/50 uppercase tracking-wider">
                  <th className="pb-4 pl-4">ID</th>
                  <th className="pb-4">Name</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {patients.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="py-4 pl-4 text-white/70 font-mono">{p.id}</td>
                    <td className="py-4 font-medium text-white/90">
                      {decrypted && selectedPatient?.id === p.id ? p.name : "••••••••••"}
                    </td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${p.status === 'Stable' || p.status === 'Cleared' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-4">
                      <button 
                        onClick={() => setSelectedPatient(p)}
                        className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Decrypt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-md p-8 border border-white/10 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-2">Decrypt Record</h2>
            <p className="text-sm text-white/50 mb-6">Patient {selectedPatient.id}</p>
            
            {!decrypted ? (
              <form onSubmit={handleDecrypt} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wide">Decryption PIN</label>
                  <input 
                    type="password" 
                    value={decryptKey}
                    onChange={(e) => setDecryptKey(e.target.value)}
                    className="w-full glass-input p-3 text-center tracking-[1em] text-lg"
                    placeholder="****"
                    maxLength={4}
                    autoFocus
                  />
                  <p className="text-xs text-white/30 text-center mt-2">(Hint: 0000)</p>
                </div>
                {decryptError && <div className="text-pink-400 text-sm font-medium text-center">{decryptError}</div>}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={closePatientModal} className="flex-1 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium py-2.5 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 gradient-btn py-2.5 rounded-lg">Verify</button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <div className="space-y-3 text-sm text-white/90">
                    <div className="flex justify-between"><span className="text-white/50">Full Name</span> <span className="font-medium">{selectedPatient.name}</span></div>
                    <div className="flex justify-between"><span className="text-white/50">Blood Type</span> <span className="font-medium">{selectedPatient.bloodType}</span></div>
                    <div className="pt-3 border-t border-white/10">
                      <span className="block text-white/50 mb-1">Notes</span>
                      <p>{selectedPatient.condition}</p>
                    </div>
                  </div>
                </div>
                <button onClick={closePatientModal} className="w-full rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium py-3 transition-colors">Close Record</button>
              </div>
            )}
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-lg p-8 border border-white/10 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">New Secure Record</h2>
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/70 uppercase tracking-wide">Full Name (Auto-Sanitizes)</label>
                <input required type="text" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} className="w-full glass-input p-3" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wide">Status</label>
                  <select value={newPatient.status} onChange={e => setNewPatient({...newPatient, status: e.target.value})} className="w-full glass-input p-3 [&>option]:bg-[#09090b]">
                    <option>Stable</option>
                    <option>Observation</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wide">Blood Group</label>
                  <input required type="text" maxLength={3} value={newPatient.bloodType} onChange={e => setNewPatient({...newPatient, bloodType: e.target.value})} className="w-full glass-input p-3" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/70 uppercase tracking-wide">Condition Notes</label>
                <textarea required value={newPatient.condition} onChange={e => setNewPatient({...newPatient, condition: e.target.value})} className="w-full glass-input p-3 min-h-[100px] resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium py-2.5 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 gradient-btn py-2.5 rounded-lg">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
