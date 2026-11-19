"use client";

import React, { useSyncExternalStore } from "react";
import { useApp } from "@/context/app-context";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

const emptySubscribe = () => () => {};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useApp();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return (
    <button
      type="button"
      onClick={toggleTheme}
      suppressHydrationWarning
      title={
        mounted
          ? theme === "light"
            ? "Ganti ke Tema Gelap"
            : "Ganti ke Tema Terang"
          : "Ganti Tema"
      }
      className={cn(
        "p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer",
        className
      )}
    >
      {!mounted ? (
        <span className="inline-block w-4 h-4" />
      ) : theme === "light" ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
    </button>
  );
}
