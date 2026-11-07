"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { SummaryCard } from "@/components/SummaryCard";
import { BrandList } from "@/components/BrandList";
import { AddEditBrandModal, normalizeBrandName } from "@/components/AddEditBrandModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { DeliveryModal } from "@/components/DeliveryModal";
import { ToastContainer } from "@/components/Toast";
import { Brand, Toast } from "@/types";
import { getStoredBrands, saveStoredBrands } from "@/lib/storage";
import {
  applyStockDelta,
  reconcileDeliveryAllocations,
  TARGET_DELIVERY_COUNT,
} from "@/lib/delivery";

export default function Home() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null);

  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);

  // Load from localStorage on mount (prevents hydration mismatch)
  useEffect(() => {
    const loaded = getStoredBrands();
    setBrands(loaded);
    setIsMounted(true);
  }, []);

  // Save to localStorage when brands change (only after initial mount)
  const updateBrands = useCallback((newBrands: Brand[]) => {
    setBrands(newBrands);
    saveStoredBrands(newBrands);
  }, []);

  const addToast = useCallback(
    (type: "success" | "error" | "info", message: string) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
      setToasts((prev) => [...prev, { id, type, message }]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Total bottle count (All brands total, unlimited)
  const totalCount = useMemo(() => {
    return brands.reduce((sum, b) => sum + (b.count || 0), 0);
  }, [brands]);

  // Handlers for Brand CRUD
  const handleSaveBrand = (name: string, initialCount: number, editId?: string) => {
    const cleanName = name.trim().replace(/\s+/g, " ");
    const normalized = normalizeBrandName(cleanName);

    // Prevent duplicate brand names (Turkish aware)
    const isDuplicate = brands.some(
      (b) => (!editId || b.id !== editId) && normalizeBrandName(b.name) === normalized
    );

    if (isDuplicate) {
      addToast("error", "Bu marka zaten mevcut.");
      return;
    }

    if (editId) {
      const updatedRaw = brands.map((b) =>
        b.id === editId ? { ...b, name: cleanName, count: Math.max(0, initialCount) } : b
      );
      const reconciled = reconcileDeliveryAllocations(updatedRaw);
      updateBrands(reconciled);
      addToast("success", `"${cleanName}" markası güncellendi.`);
    } else {
      const newBrand: Brand = {
        id: "brand-" + Date.now().toString(),
        name: cleanName,
        count: Math.max(0, initialCount),
        deliveryCount: 0,
        createdAt: Date.now(),
      };
      const reconciled = reconcileDeliveryAllocations([...brands, newBrand]);
      updateBrands(reconciled);
      addToast("success", `"${cleanName}" markası eklendi.`);
    }
  };

  const handleDeleteBrand = (brandId: string) => {
    const target = brands.find((b) => b.id === brandId);
    const updatedRaw = brands.filter((b) => b.id !== brandId);
    const reconciled = reconcileDeliveryAllocations(updatedRaw);
    updateBrands(reconciled);
    addToast(
      "info",
      target ? `"${target.name}" markası silindi.` : "Marka silindi."
    );
  };

  // Quick Count Update (+1, -1) with consistent delivery group allocation
  const handleUpdateCount = (brandId: string, delta: number) => {
    const updated = applyStockDelta(brands, brandId, delta);
    updateBrands(updated);
  };

  // Confirm 200 bottle delivery
  const handleConfirmDelivery = () => {
    if (totalCount < TARGET_DELIVERY_COUNT) return;

    const remainingTotal = Math.max(0, totalCount - TARGET_DELIVERY_COUNT);

    const afterDelivery = brands.map((b) => {
      const delivered = b.deliveryCount || 0;
      const nextCount = Math.max(0, b.count - delivered);
      return {
        ...b,
        count: nextCount,
        deliveryCount: nextCount,
      };
    });

    const reconciled = reconcileDeliveryAllocations(afterDelivery);
    updateBrands(reconciled);

    addToast(
      "success",
      `200 şişe teslim edildi. Kalan stok: ${remainingTotal} adet.`
    );
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#101827] flex items-center justify-center text-[#94A3B8]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#F8FAFC] flex flex-col selection:bg-white selection:text-[#101827]">
      {/* Main Container - Extended width: ~1100-1150px on desktop */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 space-y-6 sm:space-y-7">
        {/* Centered Modern Page Title */}
        <div className="text-center pt-2 pb-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Şişe Takip
          </h1>
        </div>

        {/* Top Section: Wide Delivery & Total Stock Panel */}
        <SummaryCard
          brands={brands}
          totalCount={totalCount}
          onOpenDeliveryModal={() => setIsDeliveryOpen(true)}
        />

        {/* Bottom Section: 4-Column Grid Brand Cards */}
        <BrandList
          brands={brands}
          onUpdateCount={handleUpdateCount}
          onOpenEditModal={(b) => {
            setEditingBrand(b);
            setIsAddEditOpen(true);
          }}
          onOpenDeleteModal={(b) => {
            setDeletingBrand(b);
            setIsDeleteOpen(true);
          }}
          onOpenAddModal={() => {
            setEditingBrand(null);
            setIsAddEditOpen(true);
          }}
        />
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#94A3B8] border-t border-[#334155]/60 bg-[#101827]/40 backdrop-blur-xs">
        <p>DOA Depozito Şişe Takip &bull; Veriler tarayıcınızda (localStorage) saklanır</p>
      </footer>

      {/* Modals */}
      <AddEditBrandModal
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setEditingBrand(null);
        }}
        onSave={handleSaveBrand}
        editingBrand={editingBrand}
        existingBrands={brands}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingBrand(null);
        }}
        brand={deletingBrand}
        onConfirm={handleDeleteBrand}
      />

      <DeliveryModal
        isOpen={isDeliveryOpen}
        onClose={() => setIsDeliveryOpen(false)}
        brands={brands}
        onConfirmDelivery={handleConfirmDelivery}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
