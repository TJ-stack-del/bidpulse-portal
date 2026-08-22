"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmail, signUpWithEmail, sendPasswordResetEmail, updateUserPassword } from "../auth";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isResetMode = searchParams.get("reset") === "true";

  const [mode, setMode] = useState<"signin" | "signup" | "forgot" | "update-password">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isResetMode) {
      setMode("update-password");
    }
  }, [isResetMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);
    setLoading(true);

    if (mode === "signin") {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setErrorMessage(error);
        setLoading(false);
      } else {
        router.push("/portal");
      }
    } else if (mode === "signup") {
      const { error } = await signUpWithEmail(email, password);
      if (error) {
        setErrorMessage(error);
        setLoading(false);
      } else {
        setStatusMessage("Account registered. Check your email inbox to confirm your address.");
        setLoading(false);
      }
    } else if (mode === "forgot") {
      const { error } = await sendPasswordResetEmail(email);
      if (error) {
        setErrorMessage(error);
      } else {
        setStatusMessage("Password reset email dispatched. Check your inbox for the recovery link.");
      }
      setLoading(false);
    } else if (mode === "update-password") {
      const { error } = await updateUserPassword(password);
      if (error) {
        setErrorMessage(error);
      } else {
        setStatusMessage("Password updated successfully! Redirecting to workspace...");
        setTimeout(() => router.push("/portal"), 2000);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md">
            B
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
            BidPulse
          </span>
        </Link>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {mode === "signin" && "Sign in to contractor workspace"}
          {mode === "signup" && "Create your operations account"}
          {mode === "forgot" && "Reset your account password"}
          {mode === "update-password" && "Enter your new password"}
        </h2>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
          Securing proprietary estimates, rubric matrices, and municipal bid data.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-sm border border-slate-200 dark:border-slate-800 rounded-2xl sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode !== "update-password" && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contractor@firm.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            )}

            {mode !== "forgot" && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {mode === "update-password" ? "New Password" : "Password"}
                  </label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage(null);
                        setStatusMessage(null);
                        setMode("forgot");
                      }}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {statusMessage && (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                ✓ {statusMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : mode === "signin"
                ? "Sign In &rarr;"
                : mode === "signup"
                ? "Register Account"
                : mode === "forgot"
                ? "Send Reset Email"
                : "Update Password"}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2">
            {mode === "signin" && (
              <button
                onClick={() => {
                  setErrorMessage(null);
                  setStatusMessage(null);
                  setMode("signup");
                }}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline block w-full cursor-pointer"
              >
                Need an account? Register here
              </button>
            )}

            {mode !== "signin" && (
              <button
                onClick={() => {
                  setErrorMessage(null);
                  setStatusMessage(null);
                  setMode("signin");
                }}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:underline block w-full cursor-pointer"
              >
                &larr; Back to Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500 text-sm">Loading security gate...</div>}>
      <AuthForm />
    </Suspense>
  );
}
