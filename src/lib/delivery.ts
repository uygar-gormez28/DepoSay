import { Brand } from '@/types';

export const TARGET_DELIVERY_COUNT = 200;

/**
 * Ensures delivery allocations and overflow quantities are consistent with:
 * 1. Sum of delivery counts <= 200 (exact 200 if total >= 200)
 * 2. For each brand: 0 <= deliveryCount <= count
 * 3. Existing allocations are preserved where possible
 * 4. Gaps are filled from brands that have overflow
 */
export function reconcileDeliveryAllocations(brands: Brand[]): Brand[] {
  const totalStock = brands.reduce((sum, b) => sum + (b.count || 0), 0);

  // Case 1: Total bottles are less than or equal to 200
  // All bottles belong to the delivery group, no overflow exists.
  if (totalStock <= TARGET_DELIVERY_COUNT) {
    return brands.map((b) => ({
      ...b,
      deliveryCount: b.count,
    }));
  }

  // Case 2: Total bottles exceed 200
  // Delivery group must sum to EXACTLY 200.
  // First, clamp existing delivery allocations to current counts
  let allocMap: { [id: string]: number } = {};
  let currentAllocSum = 0;

  brands.forEach((b) => {
    // If deliveryCount is already set, respect it clamped to b.count
    // If not set (e.g. legacy data or first time), default to 0
    const existing = typeof b.deliveryCount === 'number' ? b.deliveryCount : 0;
    const clamped = Math.max(0, Math.min(b.count, existing));
    allocMap[b.id] = clamped;
    currentAllocSum += clamped;
  });

  // If allocations sum to less than 200 (or were 0 initially),
  // fill the deficit from brands that have available unallocated bottles (overflow).
  if (currentAllocSum < TARGET_DELIVERY_COUNT) {
    let deficit = TARGET_DELIVERY_COUNT - currentAllocSum;

    // Prioritize brands with the largest available unallocated bottles
    const candidates = [...brands].sort((a, b) => {
      const availA = a.count - allocMap[a.id];
      const availB = b.count - allocMap[b.id];
      return availB - availA;
    });

    for (const b of candidates) {
      if (deficit <= 0) break;
      const available = b.count - allocMap[b.id];
      if (available > 0) {
        const take = Math.min(available, deficit);
        allocMap[b.id] += take;
        deficit -= take;
      }
    }
  }

  // If allocations somehow exceed 200 (e.g. after manual editing),
  // trim from the brands with highest allocations
  if (currentAllocSum > TARGET_DELIVERY_COUNT) {
    let surplus = currentAllocSum - TARGET_DELIVERY_COUNT;
    const candidates = [...brands].sort(
      (a, b) => allocMap[b.id] - allocMap[a.id]
    );

    for (const b of candidates) {
      if (surplus <= 0) break;
      const current = allocMap[b.id];
      if (current > 0) {
        const remove = Math.min(current, surplus);
        allocMap[b.id] -= remove;
        surplus -= remove;
      }
    }
  }

  return brands.map((b) => ({
    ...b,
    deliveryCount: allocMap[b.id] ?? 0,
  }));
}

/**
 * Handles +1 or -1 delta for a specific brand following delivery preservation rules:
 * - When incrementing (+1):
 *   - If total is below 200, it joins delivery.
 *   - If delivery is already 200, it stays in overflow (delivery unchanged).
 * - When decrementing (-1):
 *   - If the brand has overflow (count > deliveryCount), decrement from overflow.
 *   - If no overflow, decrement delivery. If total remains >= 200, refill the 1 slot from another brand's overflow.
 */
export function applyStockDelta(
  brands: Brand[],
  brandId: string,
  delta: number
): Brand[] {
  const brandIndex = brands.findIndex((b) => b.id === brandId);
  if (brandIndex === -1) return brands;

  const currentBrand = brands[brandIndex];
  const newCount = Math.max(0, currentBrand.count + delta);
  if (newCount === currentBrand.count) return brands; // No change if attempting negative

  // First create a shallow copy with updated count
  let updatedBrands = brands.map((b) => {
    if (b.id !== brandId) return { ...b };
    return {
      ...b,
      count: newCount,
    };
  });

  return reconcileDeliveryAllocations(updatedBrands);
}

