"use client";
import { useState } from "react";
import InterviewSettingsPanel from "./InterviewSettingsPanel";
import type { InterviewSettings } from "../types/interview";

type SetupPanelProps = {
  disabled: boolean;
  settings: InterviewSettings;
  onSettingsChange: (settings: InterviewSettings) => void;
  onStart: () => void;
};

export default function SetupPanel({ disabled, settings, onSettingsChange, onStart }: SetupPanelProps) {
  const [micAllowed, setMicAllowed] = useState(false);
  const requestMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicAllowed(true);
    } catch (err) {
      console.error("Mic access denied", err);
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-in select-none">
      <div className="rounded-2xl bg-zinc-50 p-5 border border-zinc-200">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Permissions</h3>
        <button
          type="button"
          onClick={requestMic}
          className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 transition-all duration-300 font-bold active:scale-[0.99] ${
            micAllowed 
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 cursor-default" 
              : "border-zinc-200 bg-white text-zinc-900 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 shadow-sm"
          }`}
        >
          <span className="text-sm font-semibold">{micAllowed ? "Microphone Access Granted" : "Enable Microphone"}</span>
          <span className="text-base">{micAllowed ? "✓" : "🎙️"}</span>
        </button>
      </div>

      <div className="rounded-2xl bg-zinc-50 p-5 border border-zinc-200">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Configuration</h3>
        <InterviewSettingsPanel disabled={disabled} settings={settings} onChange={onSettingsChange} />
      </div>

      <button
        type="button"
        disabled={!micAllowed || disabled}
        onClick={onStart}
        className="w-full py-4 px-6 rounded-2xl bg-zinc-950 text-white font-bold tracking-wide transition-all duration-300 border border-zinc-950 hover:bg-emerald-600 hover:border-emerald-600 active:scale-[0.98] disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-zinc-950 disabled:hover:border-zinc-950"
      >
        {disabled ? "Initializing..." : "Begin Professional Interview"}
      </button>
      
      <p className="text-center text-[11px] font-semibold text-zinc-400 leading-normal">
        By starting, you agree to the automated monitoring for quality and integrity.
      </p>
    </div>
  );
}
