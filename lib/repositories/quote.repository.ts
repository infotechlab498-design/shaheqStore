import { prisma, withDatabaseFallback } from '@/lib/db/prisma';
import { DEMO_ADMIN_QUOTES } from '@/lib/data/demo-admin-data';
import { QuoteRequest, QuoteStatus, EngineeringServiceType } from '@/types/quote';
import { decimalToNumber, dateToISO } from '@/lib/db/serializers';

function mapPrismaQuoteToDomain(q: any): QuoteRequest {
  const statusMap: Record<string, QuoteStatus> = {
    QUOTE_REQUESTED: 'NEW_REQUEST',
    PENDING_ADMIN_REVIEW: 'NEW_REQUEST',
    UNDER_REVIEW: 'UNDER_REVIEW',
    QUOTE_SENT: 'QUOTED',
    PAYMENT_PENDING: 'ACCEPTED',
    PAID: 'CONVERTED_TO_ORDER',
    IN_PRODUCTION: 'CONVERTED_TO_ORDER',
    COMPLETED: 'CONVERTED_TO_ORDER',
    CANCELLED: 'REJECTED',
  };

  return {
    id: q.id,
    quoteNumber: q.quoteNumber,
    customerName: q.customerName,
    customerEmail: q.customerEmail,
    customerPhone: q.customerPhone,
    customerWhatsApp: q.customerWhatsApp,
    companyName: q.companyName || undefined,
    serviceType: (q.serviceType as EngineeringServiceType) || 'THREE_D_PRINTING',
    projectDescription: q.projectDescription,
    parameters: {
      material: q.material || 'PLA',
      layerHeightMm: q.layerHeight ? parseFloat(q.layerHeight) : undefined,
      infillPercentage: q.infill ? parseInt(q.infill, 10) : undefined,
      surfaceFinish: q.surfaceFinish || undefined,
      toleranceRequirement: q.tolerance || undefined,
      loadRequirement: q.loadRequirements || undefined,
      thermalRequirement: q.thermalRequirements || undefined,
      dimensions: q.dimensions || undefined,
      quantity: q.quantity || 1,
      deadline: q.requestedDeadline || undefined,
      applicationDescription: q.application || '',
    },
    files: (q.files || []).map((f: any) => ({
      id: f.id,
      quoteId: f.quoteRequestId || q.id,
      originalFileName: f.originalFileName,
      fileSizeBytes: Number(f.fileSizeBytes || 0),
      format: f.format,
      storageKey: f.storageKey,
      uploadedAt: dateToISO(f.createdAt),
    })),
    requiresNda: q.ndaRequested || false,
    ndaStatus: (q.ndaStatus as any) || 'NOT_REQUIRED',
    status: statusMap[q.status] || 'NEW_REQUEST',
    assignedEngineer: q.assignedEngineer || undefined,
    estimatedMaterialCost: q.estimatedMaterialCost ? decimalToNumber(q.estimatedMaterialCost) : undefined,
    estimatedMachineRuntimeHours: q.estimatedMachineRuntimeHours ? decimalToNumber(q.estimatedMachineRuntimeHours) : undefined,
    estimatedLaborHours: q.estimatedLaborHours ? decimalToNumber(q.estimatedLaborHours) : undefined,
    quotedPrice: q.quotedPrice ? decimalToNumber(q.quotedPrice) : undefined,
    currency: q.currency || 'PKR',
    validUntil: q.validUntil ? dateToISO(q.validUntil) : undefined,
    internalNotes: q.internalNotes || undefined,
    history: (q.history || []).map((h: any) => ({
      id: h.id,
      quoteId: h.quoteRequestId || q.id,
      status: statusMap[h.newStatus] || 'NEW_REQUEST',
      note: h.note || undefined,
      actorRole: h.changedBy || undefined,
      createdAt: dateToISO(h.createdAt),
    })),
    createdAt: dateToISO(q.createdAt),
    updatedAt: dateToISO(q.updatedAt),
  };
}

export class QuoteRepository {
  static async getAll(limit = 50): Promise<QuoteRequest[]> {
    return withDatabaseFallback(async () => {
      const quotes = await prisma.quoteRequest.findMany({
        include: {
          files: true,
          history: { orderBy: { createdAt: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      if (quotes && quotes.length > 0) {
        return quotes.map(mapPrismaQuoteToDomain);
      }

      return DEMO_ADMIN_QUOTES;
    }, () => DEMO_ADMIN_QUOTES);
  }

  static async getById(id: string): Promise<QuoteRequest | null> {
    return withDatabaseFallback(async () => {
      const quote = await prisma.quoteRequest.findUnique({
        where: { id },
        include: {
          files: true,
          history: { orderBy: { createdAt: 'asc' } },
        },
      });

      if (quote) {
        return mapPrismaQuoteToDomain(quote);
      }

      return DEMO_ADMIN_QUOTES.find((q) => q.id === id || q.quoteNumber === id) || null;
    }, () => DEMO_ADMIN_QUOTES.find((q) => q.id === id || q.quoteNumber === id) || null);
  }

  static async create(data: {
    quoteNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerWhatsApp: string;
    companyName?: string;
    serviceType: string;
    projectDescription: string;
    quantity: number;
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
  }): Promise<QuoteRequest> {
    try {
      const created = await prisma.quoteRequest.create({
        data: {
          quoteNumber: data.quoteNumber,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          customerWhatsApp: data.customerWhatsApp,
          companyName: data.companyName,
          serviceType: data.serviceType,
          projectDescription: data.projectDescription,
          quantity: data.quantity,
          requestedDeadline: data.requestedDeadline,
          application: data.application,
          material: data.material,
          layerHeight: data.layerHeight,
          infill: data.infill,
          surfaceFinish: data.surfaceFinish,
          tolerance: data.tolerance,
          dimensions: data.dimensions,
          additionalRequirements: data.additionalRequirements,
          ndaRequested: data.ndaRequested || false,
          ndaStatus: data.ndaRequested ? 'PENDING' : 'NOT_REQUIRED',
          status: 'QUOTE_REQUESTED',
          files: {
            create: data.files.map(f => ({
              originalFileName: f.originalFileName,
              fileSizeBytes: BigInt(f.fileSizeBytes),
              format: f.format,
              storageKey: f.storageKey,
            })),
          },
          history: {
            create: {
              newStatus: 'QUOTE_REQUESTED',
              note: 'Initial request submitted via engineering portal',
              changedBy: 'CUSTOMER',
            },
          },
        },
        include: {
          files: true,
          history: true,
        },
      });

      return mapPrismaQuoteToDomain(created);
    } catch {
      // Fallback
      return {
        id: `q-${Date.now()}`,
        quoteNumber: data.quoteNumber,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        customerWhatsApp: data.customerWhatsApp,
        companyName: data.companyName,
        serviceType: data.serviceType as EngineeringServiceType,
        projectDescription: data.projectDescription,
        parameters: {
          material: data.material || 'PLA',
          quantity: data.quantity,
          applicationDescription: data.application || '',
        },
        files: data.files.map((f, i) => ({
          id: `file-${i + 1}`,
          quoteId: `q-${Date.now()}`,
          originalFileName: f.originalFileName,
          fileSizeBytes: f.fileSizeBytes,
          format: f.format,
          storageKey: f.storageKey,
          uploadedAt: new Date().toISOString(),
        })),
        requiresNda: data.ndaRequested || false,
        status: 'NEW_REQUEST',
        currency: 'PKR',
        history: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }
}
