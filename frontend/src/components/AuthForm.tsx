"use client";

import { FormEvent, useState } from "react";
import { API_BASE_URL } from "../lib/api";
import type { AuthMode, AuthSession } from "../types/auth";
import AuthInput from "./AuthInput";
import AuthModeTabs from "./AuthModeTabs";

type AuthFormProps = {
  onAuthenticated: (session: AuthSession) => void;
};

export default function AuthForm({ onAuthenticated }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, ...(mode === "signup" ? { full_name: fullName } : {}) }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.detail ?? "Authentication failed.");
      onAuthenticated(payload as AuthSession);
      setPassword("");
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 font-sans text-zinc-950 select-none">
      <div className="absolute top-0 left-0 h-1.5 w-full bg-zinc-950" />
      
      <section className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm relative overflow-hidden animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-200 text-2xl shadow-sm">
            💎
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-zinc-400 font-semibold">
            Professional AI Interview Platform
          </p>
        </div>

        <div className="mb-8">
          <AuthModeTabs authMode={mode} onChange={setMode} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "signup" && (
            <div className="animate-fade-in">
              <AuthInput label="Full Name" value={fullName} onChange={setFullName} maxLength={80} />
            </div>
          )}
          <AuthInput label="Corporate Email" type="email" value={email} onChange={setEmail} />
          <AuthInput label="Secure Password" type="password" value={password} onChange={setPassword} minLength={mode === "signup" ? 6 : 1} maxLength={128} />
          
          {error && (
            <div className="w-full p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 text-sm font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="flex items-center justify-center gap-2 w-full mt-4 py-4 px-6 rounded-2xl bg-zinc-950 text-white font-bold tracking-wide transition-all duration-300 border border-zinc-950 hover:bg-emerald-600 hover:border-emerald-600 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Authenticating...</span>
              </>
            ) : (
              mode === "login" ? "Sign In to Dashboard" : "Create Professional Account"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-zinc-400 leading-relaxed font-semibold">
          Secure, encrypted session. <br />
          By continuing, you adhere to our professional conduct guidelines.
        </p>
      </section>
    </main>
  );
}
