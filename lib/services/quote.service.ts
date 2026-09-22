import { QuoteRepository } from '@/lib/repositories/quote.repository';
import { QuoteRequest } from '@/types/quote';

export class QuoteService {
  static ALLOWED_FORMATS = ['.STL', '.STEP', '.STP', '.SLDPRT', '.DXF', '.OBJ', '.IGES', '.IGS'];
  static MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

  static validateFile(fileName: string, sizeBytes: number): { valid: boolean; error?: string } {
    const ext = fileName.slice(fileName.lastIndexOf('.')).toUpperCase();
    if (!this.ALLOWED_FORMATS.includes(ext)) {
      return {
        valid: false,
        error: `Unsupported format ${ext}. Allowed formats: ${this.ALLOWED_FORMATS.join(', ')}`,
      };
    }

    if (sizeBytes > this.MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        error: `File size exceeds the 50MB limit (${(sizeBytes / (1024 * 1024)).toFixed(1)}MB).`,
      };
    }

    return { valid: true };
  }

  static async submitQuoteRequest(data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerWhatsApp: string;
    companyName?: string;
    serviceType: string;
    projectDescription: string;
    quantity?: number;
    requestedDeadline?: string;
    application?: string;
    material?: string;
    layerHeight?: string;
    infill?: string;
    surfaceFinish?: string;
    tolerance?: string;
    dimensions?: string;
    additionalRequirements?: string;
    ndaRequested?: boolean;
    files: {
      originalFileName: string;
      fileSizeBytes: number;
      format: string;
      storageKey: string;
    }[];
  }): Promise<{ success: boolean; quote?: QuoteRequest; error?: string }> {
    const quoteNumber = `QR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const quote = await QuoteRepository.create({
      ...data,
      quoteNumber,
      quantity: data.quantity || 1,
    });

    return { success: true, quote };
  }

  static async getQuote(idOrNumber: string): Promise<QuoteRequest | null> {
    return await QuoteRepository.getById(idOrNumber);
  }

  static async getAllQuotes(): Promise<QuoteRequest[]> {
    return await QuoteRepository.getAll();
  }
}
