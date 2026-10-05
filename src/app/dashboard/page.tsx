"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Mock Data
const INITIAL_PATIENTS = [
  { id: "#P3-001", name: "Makoto Yuki", status: "Stable", condition: "Apathy Syndrome exposure. Resolved.", bloodType: "O" },
  { id: "#P3-002", name: "Yukari Takeba", status: "Under Observation", condition: "Elevated stress levels. Minor fatigue.", bloodType: "A" },
  { id: "#P3-003", name: "Junpei Iori", status: "Cleared", condition: "Physical trauma. Fully healed.", bloodType: "B" },
];

const INITIAL_LOGS = [
  { time: "00:00:12", action: "System Initialized", user: "SYSTEM" },
  { time: "00:02:45", action: "Failed Access Attempt", user: "UNKNOWN" },
  { time: "00:05:30", action: "Doctor Logged In", user: "doctor@sees.med" },
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
      setDecryptError("INVALID DECRYPTION KEY.");
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
    // Simulate secure input validation (Sanitizing names)
    const sanitizedName = newPatient.name.replace(/[^a-zA-Z\s]/g, "");
    const newId = `#P3-00${patients.length + 1}`;
    
    setPatients([...patients, { 
      id: newId, 
      name: sanitizedName, 
      status: newPatient.status, 
      condition: newPatient.condition, 
      bloodType: newPatient.bloodType 
    }]);
    
    addLog(`Added new secure record: ${newId}`);
    setShowAddModal(false);
    setNewPatient({ name: "", status: "Stable", condition: "", bloodType: "" });
  };

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
        
        {/* Left Column: Stats & Logs */}
        <div className="space-y-8 flex flex-col h-full">
          <div className="p3-card p-6 border-l-4 border-p3-blue">
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-widest mb-4">Current Clearance</h3>
            <div className="text-3xl font-black text-white uppercase">Level 5 (Doctor)</div>
          </div>
          
          <div className="p3-card p-6 border-l-4 border-red-500">
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-widest mb-4">Active Threats</h3>
            <div className="text-3xl font-black text-white uppercase">0 Detected</div>
          </div>

          <div className="p3-card p-6 flex-1 border-l-4 border-slate-600 overflow-hidden flex flex-col">
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-widest mb-4">Security Audit Log</h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 max-h-[300px]">
              {logs.map((log, i) => (
                <div key={i} className="text-xs font-mono border-b border-slate-800 pb-2">
                  <span className="text-p3-blue-light">[{log.time}]</span> 
                  <span className="text-white ml-2">{log.action}</span>
                  <div className="text-slate-500 mt-1">USER: {log.user}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle/Right Column: Patient Roster */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p3-card p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-wider text-white mb-2">Encrypted Patient Roster</h2>
                <p className="text-sm text-p3-blue-light font-bold uppercase tracking-widest">
                  Data secured via AES-256
                </p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="p3-button px-6 py-2 text-sm"
              >
                + Secure Add
              </button>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-700 text-xs uppercase tracking-widest text-slate-400 font-bold">
                  <th className="pb-4 pl-2">Patient ID</th>
                  <th className="pb-4">Alias</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-semibold">
                {patients.map((p) => (
                  <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 pl-2 text-p3-blue-light">{p.id}</td>
                    <td className="py-4">{decrypted && selectedPatient?.id === p.id ? p.name : "ENCRYPTED"}</td>
                    <td className="py-4">
                      <span className={p.status === "Stable" || p.status === "Cleared" ? "text-green-400" : "text-yellow-400"}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button 
                        onClick={() => setSelectedPatient(p)}
                        className="text-slate-400 hover:text-white uppercase text-xs border border-slate-700 px-3 py-1 hover:border-white transition-colors"
                      >
                        View File
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Patient Decryption Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="p3-card w-full max-w-lg p-8 border-l-4 border-p3-blue">
            <h2 className="text-xl font-black uppercase tracking-wider text-white mb-6">Classified File: {selectedPatient.id}</h2>
            
            {!decrypted ? (
              <form onSubmit={handleDecrypt} className="space-y-4">
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">
                  Enter 2FA Decryption Key to view Protected Health Information (PHI). (Hint: 0000)
                </p>
                <input 
                  type="password" 
                  value={decryptKey}
                  onChange={(e) => setDecryptKey(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-p3-blue p-3 text-white outline-none tracking-widest text-center text-xl"
                  placeholder="****"
                  maxLength={4}
                  autoFocus
                />
                {decryptError && <div className="text-red-500 font-bold text-xs uppercase">{decryptError}</div>}
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={closePatientModal} className="flex-1 bg-slate-800 text-white font-bold uppercase py-3 hover:bg-slate-700">Cancel</button>
                  <button type="submit" className="flex-1 p3-button py-3">Decrypt</button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="bg-green-500/10 border border-green-500/30 p-4">
                  <h3 className="text-green-400 text-xs font-bold uppercase tracking-widest mb-2">Decryption Successful</h3>
                  <div className="space-y-2 text-sm text-white">
                    <p><span className="text-slate-400">Name:</span> {selectedPatient.name}</p>
                    <p><span className="text-slate-400">Blood Type:</span> {selectedPatient.bloodType}</p>
                    <p><span className="text-slate-400">Condition:</span> {selectedPatient.condition}</p>
                  </div>
                </div>
                <button onClick={closePatientModal} className="w-full p3-button py-3">Close & Re-Encrypt</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="p3-card w-full max-w-lg p-8 border-l-4 border-p3-blue">
            <h2 className="text-xl font-black uppercase tracking-wider text-white mb-6">Create Secure Record</h2>
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Patient Name (Auto-Sanitized)</label>
                <input required type="text" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-3 text-white outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Status</label>
                  <select value={newPatient.status} onChange={e => setNewPatient({...newPatient, status: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-3 text-white outline-none">
                    <option>Stable</option>
                    <option>Under Observation</option>
                    <option>Critical</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Blood Type</label>
                  <input required type="text" maxLength={3} value={newPatient.bloodType} onChange={e => setNewPatient({...newPatient, bloodType: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-3 text-white outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Medical Notes</label>
                <textarea required value={newPatient.condition} onChange={e => setNewPatient({...newPatient, condition: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-3 text-white outline-none min-h-[100px]" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-slate-800 text-white font-bold uppercase py-3 hover:bg-slate-700">Cancel</button>
                <button type="submit" className="flex-1 p3-button py-3">Encrypt & Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
