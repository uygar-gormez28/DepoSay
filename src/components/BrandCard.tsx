"use client";

import React from "react";
import { Plus, Minus, Edit3, Trash2 } from "lucide-react";
import { Brand } from "@/types";

interface BrandCardProps {
  brand: Brand;
  onUpdateCount: (id: string, delta: number) => void;
  onOpenEditModal: (brand: Brand) => void;
  onOpenDeleteModal: (brand: Brand) => void;
}

export function BrandCard({
  brand,
  onUpdateCount,
  onOpenEditModal,
  onOpenDeleteModal,
}: BrandCardProps) {
  const deliveryCount = brand.deliveryCount || 0;
  const overflow = Math.max(0, brand.count - deliveryCount);

  return (
    <div className="bg-[#1E293B] border border-[#334155] hover:border-[#475569] rounded-xl p-3 sm:p-3.5 flex flex-col justify-between shadow-md shadow-black/15 transition-all duration-150">
      {/* Top: Brand Name and Compact Big Count */}
      <div>
        <div className="flex items-center justify-between gap-1.5">
          <h3
            className="text-xs sm:text-sm font-bold text-white truncate tracking-tight"
            title={brand.name}
          >
            {brand.name}
          </h3>
        </div>

        {/* Big Bottle Count */}
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight">
            {brand.count}
          </span>
          <span className="text-[11px] text-[#94A3B8]">adet</span>
        </div>

        {/* Allocation Info: Teslimat and Fazla */}
        <div className="mt-2 pt-2 border-t border-[#334155]/60 space-y-1 text-[11px]">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span>Teslimat:</span>
            <span className="font-mono font-semibold text-white">
              {deliveryCount} adet
            </span>
          </div>

          {overflow > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[#94A3B8]">Fazla:</span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-[#172235] border border-[#334155] text-white font-mono font-bold text-[10px]">
                +{overflow}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom: Action Buttons (Compact & Symmetric) */}
      <div className="mt-3 pt-2.5 border-t border-[#334155]/60 flex items-center justify-between gap-1">
        {/* Quantity Controls [-1] [+1] */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onUpdateCount(brand.id, -1)}
            disabled={brand.count < 1}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all ${
              brand.count < 1
                ? "bg-[#172235]/40 text-[#94A3B8]/30 border border-[#334155]/40 cursor-not-allowed opacity-40"
                : "bg-[#172235] hover:bg-[#334155] active:bg-[#475569] text-white border border-[#334155] active:scale-95 cursor-pointer shadow-xs"
            }`}
            title="1 adet azalt"
            aria-label={`${brand.name} 1 azalt`}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onUpdateCount(brand.id, 1)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white hover:bg-slate-200 active:bg-slate-300 text-[#101827] font-bold flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer"
            title="1 adet artır"
            aria-label={`${brand.name} 1 artır`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Edit and Delete Action Icons */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onOpenEditModal(brand)}
            className="p-1 sm:p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#172235] transition-colors"
            title="Markayı Düzenle"
            aria-label={`${brand.name} düzenle`}
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onOpenDeleteModal(brand)}
            className="p-1 sm:p-1.5 rounded-lg text-[#94A3B8] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Markayı Sil"
            aria-label={`${brand.name} sil`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
