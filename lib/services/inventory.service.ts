import { InventoryRepository, StockCheckResult } from '@/lib/repositories/inventory.repository';
import { InventoryTransactionType } from '@prisma/client';

export class InventoryService {
  static async checkAvailability(
    productId: string,
    variantId?: string,
    requestedQuantity = 1
  ): Promise<{
    available: boolean;
    stock: StockCheckResult;
    message?: string;
  }> {
    const stock = await InventoryRepository.getStock(productId, variantId);

    if (stock.availableQuantity >= requestedQuantity) {
      return { available: true, stock };
    }

    if (stock.canFulfill) {
      return {
        available: true,
        stock,
        message: 'Item will be fulfilled via supplier backorder (3-5 days lead time).',
      };
    }

    return {
      available: false,
      stock,
      message: `Only ${stock.availableQuantity} units currently available in stock.`,
    };
  }

  static async recordRestock(params: {
    productId: string;
    variantId?: string;
    quantity: number;
    reason: string;
    performedBy: string;
  }) {
    return await InventoryRepository.adjustStock({
      productId: params.productId,
      variantId: params.variantId,
      quantityChange: params.quantity,
      type: InventoryTransactionType.STOCK_IN,
      reason: params.reason,
      performedBy: params.performedBy,
    });
  }

  static async reserveForCheckout(
    productId: string,
    quantity: number,
    orderId: string,
    variantId?: string
  ): Promise<boolean> {
    return await InventoryRepository.reserveStock({
      productId,
      variantId,
      quantity,
      orderId,
    });
  }
}
