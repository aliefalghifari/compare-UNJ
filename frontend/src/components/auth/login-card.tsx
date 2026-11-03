"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { UserRole } from "@/types";
import { MessageSquare, Sun, Moon } from "lucide-react";

interface LoginCardProps {
  onSuccess?: () => void;
}

export function LoginCard({ onSuccess }: LoginCardProps) {
  const router = useRouter();
  const { login, theme, toggleTheme } = useApp();

  const [email, setEmail] = useState("cs.ahmad@husinherbal.com");
  const [password, setPassword] = useState("••••••••");
  const [role, setRole] = useState<UserRole>("cs");
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === "cs") {
      setEmail("cs.ahmad@husinherbal.com");
    } else if (selectedRole === "customer") {
      setEmail("siti.nurhaliza@gmail.com");
    } else if (selectedRole === "owner") {
      setEmail("husin.owner@husinherbal.com");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setTimeout(() => {
      login(role, email);
      setIsLoading(false);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/chat");
      }
    }, 350);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Top Bar with Theme Toggle */}
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          title={theme === "light" ? "Ganti ke Tema Gelap" : "Ganti ke Tema Terang"}
        >
          {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-[#202c33] border border-[#e9edef] dark:border-[#2a3942] rounded-xl p-6 shadow-xs">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#00a884] flex items-center justify-center text-white shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
              Toko Husin
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Platform CS & Layanan Toko
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email / Username */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Email atau Username
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-lg text-sm bg-[#f0f2f5] dark:bg-[#111b21] border border-transparent focus:border-[#00a884] focus:bg-white dark:focus:bg-[#111b21] text-slate-900 dark:text-slate-100 outline-none transition-all placeholder:text-slate-400"
              placeholder="nama@email.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Kata Sandi
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-lg text-sm bg-[#f0f2f5] dark:bg-[#111b21] border border-transparent focus:border-[#00a884] focus:bg-white dark:focus:bg-[#111b21] text-slate-900 dark:text-slate-100 outline-none transition-all placeholder:text-slate-400"
              placeholder="••••••••"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Masuk Sebagai
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleRoleSelect("cs")}
                className={`py-2 px-2 rounded-lg text-xs font-medium text-center transition-all ${
                  role === "cs"
                    ? "bg-[#00a884] text-white"
                    : "bg-[#f0f2f5] dark:bg-[#111b21] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Staf CS
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("customer")}
                className={`py-2 px-2 rounded-lg text-xs font-medium text-center transition-all ${
                  role === "customer"
                    ? "bg-[#00a884] text-white"
                    : "bg-[#f0f2f5] dark:bg-[#111b21] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Pelanggan
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("owner")}
                className={`py-2 px-2 rounded-lg text-xs font-medium text-center transition-all ${
                  role === "owner"
                    ? "bg-[#00a884] text-white"
                    : "bg-[#f0f2f5] dark:bg-[#111b21] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Pemilik
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 mt-2 bg-[#00a884] hover:bg-[#008f6f] text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center cursor-pointer shadow-xs"
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="text-[11px] text-slate-400 text-center mt-5">
          Sistem Terintegrasi Toko Husin • 2026
        </p>
      </div>
    </div>
  );
}
