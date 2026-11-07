"use client";

import React from "react";
import { X, PackageCheck, Sparkles } from "lucide-react";
import { Brand } from "@/types";
import { TARGET_DELIVERY_COUNT } from "@/lib/delivery";

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  brands: Brand[];
  onConfirmDelivery: () => void;
}

export function DeliveryModal({
  isOpen,
  onClose,
  brands,
  onConfirmDelivery,
}: DeliveryModalProps) {
  if (!isOpen) return null;

  const totalStock = brands.reduce((sum, b) => sum + b.count, 0);
  const remainingTotalAfter = Math.max(0, totalStock - TARGET_DELIVERY_COUNT);

  // Filter brands that have bottles in delivery group
  const deliveryItems = brands.filter((b) => (b.deliveryCount || 0) > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-[#1E293B] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden p-5 sm:p-6 relative animate-in zoom-in-95 duration-150"
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
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#172235] border border-[#334155] flex items-center justify-center text-white">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              200 Şişe Teslimat Onayı
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Teslimat grubuna ayrılan 200 şişe stoktan düşülecektir.
            </p>
          </div>
        </div>

        {/* Breakdown List */}
        <div className="space-y-3 my-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] flex items-center justify-between">
            <span>Teslim Edilecek Markalar</span>
            <span className="text-white font-mono font-bold">
              Toplam: {TARGET_DELIVERY_COUNT} Adet
            </span>
          </div>

          <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
            {deliveryItems.map((brand) => {
              const delivery = brand.deliveryCount || 0;
              const remaining = brand.count - delivery;

              return (
                <div
                  key={brand.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#172235] border border-[#334155] text-xs"
                >
                  <span className="font-semibold text-white truncate mr-2">
                    {brand.name}
                  </span>

                  <div className="flex items-center gap-2 shrink-0 font-mono">
                    <span className="font-bold text-white">
                      -{delivery} adet
                    </span>
                    <span className="text-[#334155]">|</span>
                    <span className="text-[#94A3B8]">
                      Kalan: <strong className="text-white">{remaining}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Projection Summary Box */}
          <div className="p-3.5 rounded-xl bg-[#172235] border border-[#334155] text-xs text-[#94A3B8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white shrink-0" />
              <span>Teslimat Sonrası Kalan Stok:</span>
            </div>
            <span className="font-bold font-mono text-white text-sm">
              {remainingTotalAfter} adet
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#334155]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#172235] hover:bg-[#334155] text-[#94A3B8] hover:text-white text-xs sm:text-sm font-medium transition-colors"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmDelivery();
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#101827] font-semibold text-xs sm:text-sm transition-all shadow-md cursor-pointer active:scale-95"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Teslimatı Onayla</span>
          </button>
        </div>
      </div>
    </div>
  );
}
