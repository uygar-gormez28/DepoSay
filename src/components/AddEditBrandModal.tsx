"use client";

import React, { useState, useEffect } from "react";
import { X, Tag, Check, AlertCircle } from "lucide-react";
import { Brand } from "@/types";

interface AddEditBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, initialCount: number, editId?: string) => void;
  editingBrand: Brand | null;
  existingBrands: Brand[];
}

/**
 * Normalizes brand name for strict Turkish-aware case-insensitive and whitespace comparison:
 * "  SULTAN   SU " -> "sultan su"
 * "İZMİR" -> "izmir"
 * "ILGAZ" -> "ılgaz"
 */
export function normalizeBrandName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("tr-TR");
}

export function AddEditBrandModal({
  isOpen,
  onClose,
  onSave,
  editingBrand,
  existingBrands,
}: AddEditBrandModalProps) {
  const [name, setName] = useState("");
  const [initialCount, setInitialCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingBrand) {
      setName(editingBrand.name);
      setInitialCount(editingBrand.count);
    } else {
      setName("");
      setInitialCount(0);
    }
    setError(null);
  }, [editingBrand, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim().replace(/\s+/g, " ");

    if (!cleanName) {
      setError("Lütfen bir marka adı girin.");
      return;
    }

    const normalizedInput = normalizeBrandName(cleanName);

    // Duplicate check using normalized Turkish comparison
    const isDuplicate = existingBrands.some((b) => {
      // Exclude self if editing
      if (editingBrand && b.id === editingBrand.id) return false;
      return normalizeBrandName(b.name) === normalizedInput;
    });

    if (isDuplicate) {
      setError("Bu marka zaten mevcut.");
      return;
    }

    const countNum = Math.max(0, Number(initialCount) || 0);
    onSave(cleanName, countNum, editingBrand?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-[#1E293B] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden p-6 relative animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-white rounded-lg hover:bg-[#172235] transition-colors"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#172235] border border-[#334155] flex items-center justify-center text-white">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {editingBrand ? "Markayı Düzenle" : "Yeni Marka Ekle"}
            </h3>
            <p className="text-xs text-[#94A3B8]">
              {editingBrand
                ? "Marka ismini ve stoğunu güncelleyin"
                : "Takip etmek istediğiniz şişe markasını girin"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
              Marka Adı <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Marka adını yazın..."
                autoFocus
                maxLength={40}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#172235] border border-[#334155] focus:border-white focus:outline-none text-white text-sm placeholder-[#94A3B8]"
              />
            </div>
            {error && (
              <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
              {editingBrand ? "Mevcut Şişe Adedi" : "Başlangıç Şişe Adedi (Opsiyonel)"}
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="1"
                value={initialCount === 0 ? "" : initialCount}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setInitialCount(isNaN(val) ? 0 : Math.max(0, val));
                }}
                placeholder="0"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#172235] border border-[#334155] focus:border-white focus:outline-none text-white text-sm placeholder-[#94A3B8]"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8]">
                adet
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#334155]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#172235] hover:bg-[#334155] text-[#94A3B8] hover:text-white text-sm font-medium transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#101827] font-semibold text-sm transition-colors shadow-md"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{editingBrand ? "Güncelle" : "Kaydet"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
