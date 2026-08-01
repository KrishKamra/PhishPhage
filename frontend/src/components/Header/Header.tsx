import React, { useEffect, useState } from 'react';
import { ShieldAlert, Activity, Terminal, Code2 } from 'lucide-react';
import type { ApiStatus } from '../../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const Header: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [isPinging, setIsPinging] = useState<boolean>(true);

  useEffect(() => {
    const checkHealth = async () => {
      setIsPinging(true);
      try {
        const res = await fetch(`${API_BASE_URL}/`, { cache: 'no-store' });
        if (res.ok) {
          const data: ApiStatus = await res.json();
          setApiStatus(data);
          setIsOnline(data.model_loaded);
        } else {
          setIsOnline(false);
        }
      } catch {
        setIsOnline(false);
      } finally {
        setIsPinging(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Poll health every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Identity */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-100 font-mono">
                PHISH<span className="text-emerald-400">PHAGE</span>
              </h1>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                v1.1.0 SOC
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              AI-Powered Forensic Phishing Detection & Threat Intelligence
            </p>
          </div>
        </div>

        {/* Health Indicator & System Telemetry */}
        <div className="flex items-center space-x-4">
          
          {/* API Health Pill */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono">
            <Activity className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-slate-500' : isOnline ? 'text-emerald-400' : 'text-rose-400'}`} />
            <span className="text-slate-400 hidden md:inline">API Status:</span>
            <span className={`font-semibold flex items-center space-x-1.5 ${isOnline ? 'text-emerald-400' : 'text-rose-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400 shadow-[0_0_8px_#10B981]' : 'bg-rose-400 shadow-[0_0_8px_#F43F5E]'}`} />
              <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </span>
          </div>

          {/* Model Artifact Badge */}
          {apiStatus && (
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono">
              <Terminal className="w-3 h-3 text-cyan-400" />
              <span>Engine: RF-TFIDF</span>
            </div>
          )}

          {/* Repository Link */}
          <a
            href="https://github.com/KrishKamra/PhishPhage"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-lg border border-slate-800 transition-colors flex items-center space-x-1 text-xs font-mono"
            title="View Source Repository"
          >
            <Code2 className="w-4 h-4" />
            <span className="hidden sm:inline">Repo</span>
          </a>
        </div>

      </div>
    </header>
  );
};