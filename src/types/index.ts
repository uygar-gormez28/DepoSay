export interface Brand {
  id: string;
  name: string;
  count: number;
  deliveryCount?: number;
  createdAt: number;
}

export interface DeliveryDeductionItem {
  brandId: string;
  brandName: string;
  currentCount: number;
  deductAmount: number;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

