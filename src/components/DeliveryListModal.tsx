"use client";

import React, { useState, useMemo } from "react";
import { X, FileText, Copy, Check, Printer } from "lucide-react";
import { Brand } from "@/types";

interface DeliveryListModalProps {
  isOpen: boolean;
  onClose: () => void;
  brands: Brand[];
  onToast?: (type: "success" | "error" | "info", message: string) => void;
}

export function DeliveryListModal({
  isOpen,
  onClose,
  brands,
  onToast,
}: DeliveryListModalProps) {
  const [copied, setCopied] = useState(false);

  // Delivery group brands sorted descending by deliveryCount
  const deliveryBrands = useMemo(() => {
    return brands
      .filter((b) => (b.deliveryCount || 0) > 0)
      .sort((a, b) => {
        const diff = (b.deliveryCount || 0) - (a.deliveryCount || 0);
        if (diff !== 0) return diff;
        return a.name.localeCompare(b.name, "tr-TR");
      });
  }, [brands]);

  const totalDeliveryCount = useMemo(() => {
    return deliveryBrands.reduce(
      (sum, b) => sum + (b.deliveryCount || 0),
      0
    );
  }, [deliveryBrands]);

  // Exact text format for clipboard copy requested by user:
  // Brand — X adet
  // ...
  // TOPLAM: 200 ŞİŞE
  const clipboardText = useMemo(() => {
    const lines = deliveryBrands.map(
      (b) => `${b.name} — ${b.deliveryCount || 0} adet`
    );
    return `${lines.join("\n")}\n\nTOPLAM: ${totalDeliveryCount} ŞİŞE`;
  }, [deliveryBrands, totalDeliveryCount]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    let success = false;
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(clipboardText);
        success = true;
      } catch {
        success = false;
      }
    }

    if (!success && typeof document !== "undefined") {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = clipboardText;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        success = document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {
        success = false;
      }
    }

    if (success) {
      setCopied(true);
      onToast?.("success", "Teslimat listesi panoya kopyalandı.");
      setTimeout(() => setCopied(false), 2500);
    } else {
      onToast?.("error", "Liste panoya kopyalanamadı.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 print:static print:p-0 print:bg-white print:backdrop-blur-none"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="printable-delivery-modal"
        className="w-full max-w-lg bg-[#1E293B] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden p-5 sm:p-6 relative animate-in zoom-in-95 duration-150 print:border-none print:shadow-none print:bg-white print:p-4 print:max-w-none print:w-full"
      >
        {/* Print-Only Official Document Header */}
        <div className="hidden print:block mb-6 border-b-2 border-black pb-4 text-center">
          <h1 className="text-2xl font-bold uppercase tracking-wider text-black">
            ŞİŞE TAKİP &bull; TESLİMAT LİSTESİ
          </h1>
          <p className="text-xs text-gray-700 mt-1">
            DOA Depozito İade Sistemi &bull; Tarih:{" "}
            {new Date().toLocaleDateString("tr-TR")}{" "}
            {new Date().toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Screen Close Button */}
        <button
          onClick={onClose}
          className="print:hidden absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-white rounded-lg hover:bg-[#172235] transition-colors"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Screen Modal Header */}
        <div className="print:hidden flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#172235] border border-[#334155] flex items-center justify-center text-white">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Teslimat Listesi
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Yalnızca mevcut teslimat grubuna ayrılan şişe adetleri
            </p>
          </div>
        </div>

        {/* List Content */}
        <div className="space-y-2.5 my-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] print:text-black flex items-center justify-between pb-1">
            <span>Teslim Edilecek Markalar</span>
            <span className="font-mono font-bold text-white print:text-black">
              {deliveryBrands.length} Marka
            </span>
          </div>

          {deliveryBrands.length === 0 ? (
            <div className="text-center py-8 rounded-xl bg-[#172235] border border-[#334155] text-xs text-[#94A3B8] print:bg-white print:text-black print:border-gray-300">
              Mevcut teslimat grubuna ayrılmış şişe bulunmuyor.
            </div>
          ) : (
            <div className="max-h-64 sm:max-h-72 overflow-y-auto space-y-2 pr-1 print:max-h-none print:overflow-visible">
              {deliveryBrands.map((brand, index) => (
                <div
                  key={brand.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#172235] border border-[#334155] text-xs sm:text-sm print:bg-white print:border-gray-300 print:text-black"
                >
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    <span className="w-5 h-5 rounded-md bg-[#1E293B] border border-[#334155] text-[10px] font-mono font-bold text-[#94A3B8] flex items-center justify-center shrink-0 print:bg-gray-100 print:border-gray-400 print:text-black">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-white print:text-black truncate">
                      {brand.name}
                    </span>
                  </div>

                  <span className="font-mono font-bold text-white print:text-black shrink-0">
                    {brand.deliveryCount} adet
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Grand Total Box */}
          <div className="p-3.5 rounded-xl bg-[#172235] border border-[#334155] flex items-center justify-between print:bg-white print:border-t-2 print:border-b-2 print:border-black print:rounded-none">
            <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] print:text-black">
              TOPLAM
            </span>
            <span className="text-base sm:text-lg font-extrabold font-mono text-white print:text-black tracking-tight">
              {totalDeliveryCount} ŞİŞE
            </span>
          </div>
        </div>

        {/* Screen Action Buttons */}
        <div className="print:hidden flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#334155]">
          <div className="flex items-center gap-2">
            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              disabled={deliveryBrands.length === 0}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                copied
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-[#172235] hover:bg-[#334155] text-white border-[#334155] active:scale-95 cursor-pointer shadow-xs"
              }`}
              title="Listeyi metin olarak panoya kopyala"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#94A3B8]" />
                  <span>Panoya Kopyala</span>
                </>
              )}
            </button>

            {/* Print / Save as PDF Button */}
            <button
              type="button"
              onClick={handlePrint}
              disabled={deliveryBrands.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#172235] hover:bg-[#334155] text-white border border-[#334155] text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer shadow-xs"
              title="Yazdır veya PDF olarak kaydet"
            >
              <Printer className="w-4 h-4 text-[#94A3B8]" />
              <span>Yazdır / PDF</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#172235] hover:bg-[#334155] text-[#94A3B8] hover:text-white text-xs sm:text-sm font-medium transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}

