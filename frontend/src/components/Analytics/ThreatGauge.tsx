import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

interface ThreatGaugeProps {
  confidence: string; // e.g., "98.45%"
  isPhishing: boolean;
}

export const ThreatGauge: React.FC<ThreatGaugeProps> = ({ confidence, isPhishing }) => {
  // Parse numeric percentage from "98.45%"
  const numericValue = Math.min(100, Math.max(0, parseFloat(confidence.replace('%', '')) || 0));
  
  // Calculate SVG arc parameters for a semi-circle gauge
  const radius = 80;
  const circumference = Math.PI * radius; // Half perimeter
  const strokeDashoffset = circumference - (numericValue / 100) * circumference;

  // Color dynamics based on verdict
  const gaugeColor = isPhishing ? '#F43F5E' : '#10B981'; // Rose vs Emerald
  const glowShadow = isPhishing
    ? 'drop-shadow([0_0_12px_rgba(244,63,94,0.5)])'
    : 'drop-shadow([0_0_12px_rgba(16,185,129,0.5)])';

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-2xl flex flex-col items-center justify-between space-y-4">
      
      {/* Section Label */}
      <div className="w-full flex items-center justify-between border-b border-slate-800/60 pb-3">
        <span className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">
          AI Confidence Score
        </span>
        <span
          className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${
            isPhishing
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}
        >
          {isPhishing ? 'HIGH THREAT' : 'SAFE VERDICT'}
        </span>
      </div>

      {/* SVG Arc Gauge */}
      <div className="relative flex items-center justify-center pt-2">
        <svg className="w-56 h-32 overflow-visible" viewBox="0 0 200 110">
          
          {/* Background Arc Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#1E293B"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Animated Value Arc */}
          <motion.path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={gaugeColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className={glowShadow}
          />
        </svg>

        {/* Center Numerical Overlay */}
        <div className="absolute top-12 flex flex-col items-center justify-center text-center">
          {isPhishing ? (
            <ShieldAlert className="w-6 h-6 text-rose-400 mb-1 animate-bounce" />
          ) : (
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-1" />
          )}
          <span className="text-3xl font-bold font-mono text-slate-100 tracking-tight">
            {numericValue.toFixed(1)}%
          </span>
          <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">
            Probability
          </span>
        </div>
      </div>

      {/* Verdict Footer Banner */}
      <div
        className={`w-full text-center py-2 px-4 rounded-xl font-mono text-xs font-semibold border ${
          isPhishing
            ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
        }`}
      >
        {isPhishing ? '🚨 PHISHING ATTACK DETECTED' : '✅ COMMUNICATIONS AUDITED SAFE'}
      </div>

    </div>
  );
};