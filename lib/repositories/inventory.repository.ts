import { prisma, withDatabaseFallback } from '@/lib/db/prisma';
import { InventoryTransactionType } from '@prisma/client';

export interface StockCheckResult {
  availableQuantity: number;
  totalQuantity: number;
  reservedQuantity: number;
  isLowStock: boolean;
  canFulfill: boolean;
}

const FALLBACK_STOCK: StockCheckResult = {
  availableQuantity: 10,
  totalQuantity: 10,
  reservedQuantity: 0,
  isLowStock: false,
  canFulfill: true,
};

export class InventoryRepository {
  static async getStock(productId: string, variantId?: string): Promise<StockCheckResult> {
    return withDatabaseFallback(async () => {
      const inventory = await prisma.inventory.findFirst({
        where: {
          productId,
          variantId: variantId || null,
        },
      });

      if (inventory) {
        const available = inventory.quantity - inventory.reservedQuantity;
        return {
          availableQuantity: Math.max(0, available),
          totalQuantity: inventory.quantity,
          reservedQuantity: inventory.reservedQuantity,
          isLowStock: available <= inventory.lowStockThreshold,
          canFulfill: available > 0 || inventory.allowBackorder,
        };
      }

      return FALLBACK_STOCK;
    }, () => FALLBACK_STOCK);
  }

  static async adjustStock(params: {
    productId: string;
    variantId?: string;
    quantityChange: number;
    type: InventoryTransactionType;
    reason: string;
    referenceType?: string;
    referenceId?: string;
    performedBy?: string;
  }): Promise<{ success: boolean; newBalance: number }> {
    try {
      return await prisma.$transaction(async (tx) => {
        const inv = await tx.inventory.findFirst({
          where: {
            productId: params.productId,
            variantId: params.variantId || null,
          },
        });

        if (!inv) {
          throw new Error('Inventory record not found');
        }

        const newBalance = inv.quantity + params.quantityChange;

        await tx.inventory.update({
          where: { id: inv.id },
          data: { quantity: newBalance },
        });

        await tx.inventoryTransaction.create({
          data: {
            productId: params.productId,
            variantId: params.variantId || null,
            type: params.type,
            quantityChange: params.quantityChange,
            resultingBalance: newBalance,
            reason: params.reason,
            referenceType: params.referenceType,
            referenceId: params.referenceId,
            performedBy: params.performedBy || 'SYSTEM',
          },
        });

        return { success: true, newBalance };
      });
    } catch {
      return { success: false, newBalance: 0 };
    }
  }

  static async reserveStock(params: {
    productId: string;
    variantId?: string;
    quantity: number;
    orderId: string;
  }): Promise<boolean> {
    try {
      return await prisma.$transaction(async (tx) => {
        const inv = await tx.inventory.findFirst({
          where: {
            productId: params.productId,
            variantId: params.variantId || null,
          },
        });

        if (!inv) return false;

        const available = inv.quantity - inv.reservedQuantity;
        if (available < params.quantity && !inv.allowBackorder) {
          return false;
        }

        await tx.inventory.update({
          where: { id: inv.id },
          data: {
            reservedQuantity: inv.reservedQuantity + params.quantity,
          },
        });

        await tx.inventoryTransaction.create({
          data: {
            productId: params.productId,
            variantId: params.variantId || null,
            type: InventoryTransactionType.RESERVATION,
            quantityChange: -params.quantity,
            resultingBalance: inv.quantity - (inv.reservedQuantity + params.quantity),
            reason: `Order ${params.orderId} reservation`,
            referenceType: 'ORDER',
            referenceId: params.orderId,
            performedBy: 'CHECKOUT_SYSTEM',
          },
        });

        return true;
      });
    } catch {
      return false;
    }
  }
}
