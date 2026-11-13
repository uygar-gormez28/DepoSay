"use client";

import React from "react";
import { CheckCircle2, Clock, PackageCheck, Layers, ArrowRight, FileText } from "lucide-react";
import { Brand } from "@/types";
import { TARGET_DELIVERY_COUNT } from "@/lib/delivery";

interface SummaryCardProps {
  brands: Brand[];
  totalCount: number;
  onOpenDeliveryModal: () => void;
  onOpenDeliveryListModal: () => void;
}

export function SummaryCard({
  brands,
  totalCount,
  onOpenDeliveryModal,
  onOpenDeliveryListModal,
}: SummaryCardProps) {
  const remaining = Math.max(0, TARGET_DELIVERY_COUNT - totalCount);
  const isReady = totalCount >= TARGET_DELIVERY_COUNT;
  const overflow = Math.max(0, totalCount - TARGET_DELIVERY_COUNT);

  const deliveryBrands = brands
    .filter((b) => (b.deliveryCount || 0) > 0)
    .sort((a, b) => (b.deliveryCount || 0) - (a.deliveryCount || 0));

  const totalInDelivery = deliveryBrands.reduce(
    (sum, b) => sum + (b.deliveryCount || 0),
    0
  );

  const percentage = Math.min(100, Math.round((totalInDelivery / TARGET_DELIVERY_COUNT) * 100));

  return (
    <div className="rounded-2xl border border-[#334155] bg-[#1E293B]/90 backdrop-blur-md p-5 sm:p-6 shadow-xl shadow-black/25 transition-all">
      {/* Top Header Row: Metrics on Left, Action on Right */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left: Comprehensive Stock & Delivery Overview */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* 1. Toplam Stok (Sınırsız Bütün Markalar Toplamı) */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] block">
              Toplam Stok
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
                {totalCount}
              </span>
              <span className="text-xs text-[#94A3B8]">adet</span>
            </div>
          </div>

          <div className="h-10 w-px bg-[#334155] hidden sm:block" />

          {/* 2. 200'lük Teslimat Grubu Kotası */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] block">
              Teslimat Grubu
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] font-mono">
                {totalInDelivery}
              </span>
              <span className="text-xs text-[#94A3B8] font-medium">
                / {TARGET_DELIVERY_COUNT}
              </span>
            </div>
          </div>

          <div className="h-10 w-px bg-[#334155] hidden sm:block" />

          {/* 3. Sonraki Teslimatlar İçin Stok VEYA Kalan Miktar */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] block">
              {isReady ? "Sonraki Teslimatlar İçin" : "200'e Kalan"}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              {isReady ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-bold text-white font-mono">
                    +{overflow}
                  </span>
                  <span className="text-xs text-[#94A3B8]">adet hazır</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                  <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
                  <span>
                    <strong className="text-white font-mono">{remaining}</strong> adet gerekiyor
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Status Pill & Delivery Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 self-start lg:self-center shrink-0">
          {isReady && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#172235] text-[#F8FAFC] border border-[#334155]">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              <span>Kotaya Ulaşıldı</span>
            </div>
          )}

          {/* Liste Al Button */}
          <button
            type="button"
            onClick={onOpenDeliveryListModal}
            disabled={totalInDelivery === 0}
            className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all border ${
              totalInDelivery > 0
                ? "bg-[#172235] hover:bg-[#334155] text-white border-[#334155] active:scale-95 cursor-pointer shadow-xs"
                : "bg-[#172235]/40 text-[#94A3B8]/40 border-[#334155]/40 cursor-not-allowed opacity-50"
            }`}
            title="Teslimat listesini görüntüle, yazdır veya kopyala"
          >
            <FileText className="w-4 h-4 text-[#94A3B8]" />
            <span>Liste Al</span>
          </button>

          {/* 200 Şişe Teslim Et Button */}
          <button
            type="button"
            onClick={onOpenDeliveryModal}
            disabled={!isReady}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              isReady
                ? "bg-white hover:bg-slate-100 text-[#101827] shadow-lg shadow-black/20 active:scale-95 cursor-pointer"
                : "bg-[#172235] text-[#94A3B8]/60 border border-[#334155]/60 cursor-not-allowed opacity-50"
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>200 Şişe Teslim Et</span>
          </button>
        </div>
      </div>

      {/* Slim Modern Progress Bar */}
      <div className="mt-4 w-full h-2 bg-[#172235] rounded-full overflow-hidden border border-[#334155]">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out bg-white"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Bottom Section: Delivery Group Allocation Breakdown */}
      {deliveryBrands.length > 0 && (
        <div className="mt-4 pt-3.5 border-t border-[#334155] text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#94A3B8]" />
              Teslimat Grubuna Ayrılan Markalar ({totalInDelivery} / {TARGET_DELIVERY_COUNT})
            </span>
            {isReady && overflow > 0 && (
              <span className="text-[11px] text-[#94A3B8]">
                Kalan {overflow} şişe sonraki teslimatlar için korunuyor
              </span>
            )}
          </div>

          {/* Delivery Brand Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {deliveryBrands.map((b) => (
              <div
                key={b.id}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#172235] border border-[#334155] text-xs"
              >
                <span className="text-[#94A3B8] font-medium">{b.name}:</span>
                <span className="font-mono font-bold text-white">
                  {b.deliveryCount} adet
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
