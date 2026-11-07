import { Brand } from '@/types';
import { reconcileDeliveryAllocations } from './delivery';

export const STORAGE_KEY = 'sise_takip_app_brands';

export function getStoredBrands(): Brand[] {
  if (typeof window === 'undefined') return [];
  try {
    // Eski sahte/mock verileri içeren tüm geçmiş anahtarları temizle
    ['sise_takip_data_v1', 'sise_takip_data_v2'].forEach((oldKey) => {
      if (localStorage.getItem(oldKey)) {
        localStorage.removeItem(oldKey);
      }
    });

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return reconcileDeliveryAllocations(parsed);
    }

    return [];
  } catch (error) {
    console.error('LocalStorage okuma hatası:', error);
    return [];
  }
}

export function saveStoredBrands(brands: Brand[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(brands));
  } catch (error) {
    console.error('LocalStorage yazma hatası:', error);
  }
}
