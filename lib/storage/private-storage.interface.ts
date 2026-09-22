/**
 * Private Object Storage Provider Abstraction
 *
 * CRITICAL ARCHITECTURAL MANDATE:
 * Engineering CAD files (.STL, .STEP, .SLDPRT, etc.) contain proprietary client IP
 * and defense/industrial geometry. They MUST NEVER be stored in public static directories
 * or served via public CDN URLs.
 *
 * All uploads must go through secure signed private storage (e.g. Google Cloud Storage
 * private bucket or AWS S3 private bucket) with short-lived, authenticated presigned URLs.
 */

export interface StoredPrivateFile {
  storageKey: string;
  bucketName: string;
  originalFileName: string;
  fileSizeBytes: number;
  mimeType: string;
  checksumSha256: string;
  uploadedAt: string;
}

export interface IPrivateStorageProvider {
  /**
   * Generates a pre-signed secure upload URL allowing the client to push directly
   * to a private bucket without exposing bucket credentials.
   */
  generatePresignedUploadUrl(options: {
    quoteId: string;
    fileName: string;
    fileSizeBytes: number;
    mimeType: string;
  }): Promise<{
    uploadUrl: string;
    storageKey: string;
    expiresInSeconds: number;
  }>;

  /**
   * Generates a temporary, strictly authenticated download URL for verified engineers.
   * Never valid for more than 15 minutes.
   */
  generateSecureDownloadUrl(storageKey: string, authenticatedUserId: string): Promise<string>;

  /**
   * Securely purges a CAD file from private storage.
   */
  deletePrivateFile(storageKey: string): Promise<boolean>;
}
