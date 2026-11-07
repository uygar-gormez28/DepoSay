"use client";

import React, { useState } from "react";
import { Plus, Search, Layers, X } from "lucide-react";
import { Brand } from "@/types";
import { BrandCard } from "./BrandCard";

interface BrandListProps {
  brands: Brand[];
  onUpdateCount: (id: string, delta: number) => void;
  onOpenEditModal: (brand: Brand) => void;
  onOpenDeleteModal: (brand: Brand) => void;
  onOpenAddModal: () => void;
}

export function BrandList({
  brands,
  onUpdateCount,
  onOpenEditModal,
  onOpenDeleteModal,
  onOpenAddModal,
}: BrandListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header of Brands Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Title and Badge */}
        <div className="flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-[#94A3B8]" />
          <h2 className="text-lg font-bold text-white tracking-tight">
            Markalar
          </h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#1E293B] text-[#F8FAFC] border border-[#334155] font-mono shadow-xs">
            {brands.length} Marka
          </span>
        </div>

        {/* Right Controls: Search and Add Button */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search */}
          {brands.length > 2 && (
            <div className="relative w-full sm:w-56">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Marka ara..."
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-[#1E293B] border border-[#334155] focus:border-white focus:outline-none text-[#F8FAFC] placeholder-[#94A3B8] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Add Brand Button (White button, dark text) */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#101827] font-semibold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Marka Ekle</span>
          </button>
        </div>
      </div>

      {/* Brands Grid (4 cards on desktop, 2-3 on tablet, 1-2 on mobile) */}
      {brands.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-[#334155] bg-[#1E293B]/40">
          <p className="text-base font-medium text-[#F8FAFC]">Henüz kayıtlı marka yok.</p>
          <p className="text-xs text-[#94A3B8] mt-1">Takip etmek istediğiniz şişe markalarını ekleyerek sayıma başlayın.</p>
          <button
            onClick={onOpenAddModal}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#101827] font-semibold text-xs shadow-md hover:bg-slate-100 transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>İlk Markayı Ekle</span>
          </button>
        </div>
      ) : filteredBrands.length === 0 ? (
        <div className="text-center py-8 rounded-xl border border-[#334155] bg-[#1E293B]/40 text-[#94A3B8] text-xs">
          &quot;{searchQuery}&quot; ile eşleşen marka bulunamadı.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 items-stretch">
          {filteredBrands.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              onUpdateCount={onUpdateCount}
              onOpenEditModal={onOpenEditModal}
              onOpenDeleteModal={onOpenDeleteModal}
            />
          ))}
        </div>
      )}
    </div>
  );
}
