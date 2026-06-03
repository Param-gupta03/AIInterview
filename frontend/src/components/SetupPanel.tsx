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
    <div className="space-y-6 text-left animate-fade-in">
      <div className="rounded-xl bg-surface-700/30 p-4 border border-surface-600">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Permissions</h3>
        <button
          type="button"
          onClick={requestMic}
          className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 transition-all ${
            micAllowed 
              ? "border-accent/50 bg-accent/10 text-accent" 
              : "border-primary/50 bg-primary/10 text-primary hover:bg-primary/20"
          }`}
        >
          <span className="font-medium">{micAllowed ? "Microphone Access Granted" : "Enable Microphone"}</span>
          <span className="text-xl">{micAllowed ? "✓" : "🎙️"}</span>
        </button>
      </div>

      <div className="rounded-xl bg-surface-700/30 p-4 border border-surface-600">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Configuration</h3>
        <InterviewSettingsPanel disabled={disabled} settings={settings} onChange={onSettingsChange} />
      </div>

      <button
        type="button"
        disabled={!micAllowed || disabled}
        onClick={onStart}
        className="btn-primary w-full shadow-lg shadow-primary/20 disabled:shadow-none"
      >
        {disabled ? "Initializing..." : "Begin Professional Interview"}
      </button>
      
      <p className="text-center text-xs text-text-secondary">
        By starting, you agree to the automated monitoring for quality and integrity.
      </p>
    </div>
  );
}
