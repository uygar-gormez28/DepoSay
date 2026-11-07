"use client";

import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Brand } from "@/types";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: Brand | null;
  onConfirm: (brandId: string) => void;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  brand,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!isOpen || !brand) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-[#1E293B] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden p-6 relative animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-white rounded-lg hover:bg-[#172235] transition-colors"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Markayı Sil</h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Bu işlem geri alınamaz.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#172235] border border-[#334155] my-4 text-sm text-[#F8FAFC] space-y-2">
          <p>
            <strong className="font-semibold text-white">{brand.name}</strong> markasını ve sisteme kayıtlı olan{" "}
            <span className="font-bold text-rose-400">{brand.count} adet</span> şişesini silmek istediğinize emin misiniz?
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#334155]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#172235] hover:bg-[#334155] text-[#94A3B8] hover:text-white text-sm font-medium transition-colors"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(brand.id);
              onClose();
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>Evet, Sil</span>
          </button>
        </div>
      </div>
    </div>
  );
}
