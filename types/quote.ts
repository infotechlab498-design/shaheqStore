export const QuoteStatus = {
  NEW_REQUEST: 'NEW_REQUEST',
  UNDER_REVIEW: 'UNDER_REVIEW',
  AWAITING_DESIGN_CLARIFICATION: 'AWAITING_DESIGN_CLARIFICATION',
  QUOTED: 'QUOTED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  CONVERTED_TO_ORDER: 'CONVERTED_TO_ORDER',
} as const;

export type QuoteStatus = (typeof QuoteStatus)[keyof typeof QuoteStatus];

export type EngineeringServiceType =
  | 'THREE_D_PRINTING'
  | 'MECHANICAL_DESIGN'
  | 'CAD_MODELING'
  | 'CUSTOM_ENCLOSURES'
  | 'REVERSE_ENGINEERING'
  | 'SHEET_METAL_DESIGN'
  | 'JIGS_AND_FIXTURES'
  | 'RAPID_PROTOTYPING'
  | 'LOW_VOLUME_MANUFACTURING';

export type PrintingMaterial = 'PLA' | 'PETG' | 'ABS' | 'RESIN' | 'NYLON_CF' | 'OTHER';

export interface QuoteFile {
  id: string;
  quoteId: string;
  originalFileName: string;
  fileSizeBytes: number;
  format: string; // e.g. .STL, .OBJ, .STEP, .SLDPRT, .DXF
  storageKey: string; // Stored in private bucket, never publicly exposed
  storagePath?: string;
  uploadedAt: string;
}

export interface QuoteParameters {
  material: PrintingMaterial | string;
  layerHeightMm?: number; // e.g., 0.12, 0.20, 0.28
  infillPercentage?: number; // e.g., 20%, 50%, 100%
  surfaceFinish?: string; // Standard, Sanded, Vapor smoothed, Anodized
  toleranceRequirement?: string; // Standard +/- 0.2mm, Precision +/- 0.05mm
  loadRequirement?: string; // Structural load description
  thermalRequirement?: string; // Heat resistance specs
  dimensions?: string; // Length x Width x Height in mm
  quantity: number;
  deadline?: string;
  applicationDescription: string;
}

export interface QuoteStatusHistory {
  id: string;
  quoteId: string;
  status: QuoteStatus;
  note?: string;
  actorRole?: string;
  createdAt: string;
}

export interface QuoteRequest {
  id: string;
  quoteNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerWhatsApp: string;
  companyName?: string;
  serviceType: EngineeringServiceType;
  projectDescription: string;
  parameters: QuoteParameters;
  files: QuoteFile[];
  requiresNda: boolean;
  ndaStatus?: 'PENDING' | 'SIGNED' | 'NOT_REQUIRED';
  status: QuoteStatus;
  assignedEngineer?: string;
  estimatedMaterialCost?: number;
  estimatedMachineRuntimeHours?: number;
  estimatedRuntimeHours?: number;
  estimatedMaterialGrams?: number;
  estimatedLaborHours?: number;
  quotedPrice?: number;
  turnaroundDays?: number;
  currency: string;
  validUntil?: string;
  engineerNotes?: string;
  internalNotes?: string;
  history: QuoteStatusHistory[];
  createdAt: string;
  updatedAt: string;
}
