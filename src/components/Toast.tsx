"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { Toast as ToastType } from "@/types";

interface ToastProps {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastType;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-white shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-[#94A3B8] shrink-0" />,
  };

  return (
    <div className="pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-xl border border-[#334155] bg-[#1E293B] shadow-2xl backdrop-blur-md transition-all duration-200 text-xs animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center gap-2.5">
        {icons[toast.type]}
        <p className="font-medium text-[#F8FAFC]">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-[#94A3B8] hover:text-white transition-colors p-0.5 rounded hover:bg-[#172235]"
        aria-label="Kapat"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
