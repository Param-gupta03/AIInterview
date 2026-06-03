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
    <main className="flex min-h-screen items-center justify-center bg-surface-900 p-4 font-sans text-text-primary">
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-accent to-primary opacity-50" />
      
      <section className="card w-full max-w-md p-8 shadow-2xl animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
            💎
          </div>
          <h1 className="text-3xl font-black tracking-tight text-text-primary">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-text-secondary font-medium">
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
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
              <span className="mr-2">⚠️</span>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="btn-primary w-full mt-4 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
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

        <p className="mt-8 text-center text-xs text-text-secondary leading-relaxed">
          Secure, encrypted session. <br />
          By continuing, you adhere to our professional conduct guidelines.
        </p>
      </section>
    </main>
  );
}
