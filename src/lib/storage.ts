import { supabase } from './supabase';

export type GetoraStorageBucket =
  | 'customer-images'
  | 'retailer-images'
  | 'shop-images'
  | 'product-images'
  | 'delivery-partner-images'
  | 'delivery-documents';

export interface StorageUploadResult {
  bucket: GetoraStorageBucket;
  storagePath: string;
  publicUrl: string | null;
  fileSizeBytes: number;
}

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Validates file type and file size
 */
export function validateImageFile(file: File, maxSizeBytes = MAX_IMAGE_SIZE_BYTES): string | null {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return `Invalid format '${file.type}'. Allowed: JPG, JPEG, PNG, WEBP`;
  }
  if (file.size > maxSizeBytes) {
    const maxMb = maxSizeBytes / (1024 * 1024);
    const fileMb = (file.size / (1024 * 1024)).toFixed(2);
    return `File too large (${fileMb} MB). Maximum allowed size is ${maxMb} MB.`;
  }
  return null;
}

/**
 * Upload an image file to Supabase Storage
 */
export async function uploadImage(
  file: File,
  bucket: GetoraStorageBucket,
  userId: string,
  customFilename?: string
): Promise<StorageUploadResult> {
  const error = validateImageFile(file);
  if (error) throw new Error(error);

  const extension = file.name.split('.').pop() || 'jpg';
  const fileName = customFilename || `${crypto.randomUUID()}.${extension}`;
  const storagePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  let publicUrl: string | null = null;
  if (bucket !== 'delivery-documents') {
    const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
    publicUrl = data.publicUrl;
  }

  return {
    bucket,
    storagePath,
    publicUrl,
    fileSizeBytes: file.size,
  };
}

/**
 * Delete an image file from Supabase Storage
 */
export async function deleteImage(bucket: GetoraStorageBucket, storagePath: string): Promise<boolean> {
  const { error } = await supabase.storage.from(bucket).remove([storagePath]);
  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
  return true;
}

/**
 * Replace an existing image with a new one
 */
export async function replaceImage(
  newFile: File,
  bucket: GetoraStorageBucket,
  oldStoragePath: string | null,
  userId: string
): Promise<StorageUploadResult> {
  const uploadResult = await uploadImage(newFile, bucket, userId);

  if (oldStoragePath && oldStoragePath !== uploadResult.storagePath) {
    try {
      await supabase.storage.from(bucket).remove([oldStoragePath]);
    } catch {
      // Non-blocking cleanup
    }
  }

  return uploadResult;
}

/**
 * Get public URL for an image path
 */
export function getImageUrl(bucket: GetoraStorageBucket, storagePath: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  return data.publicUrl;
}

/**
 * Get signed URL for private bucket (e.g. delivery-documents)
 */
export async function getSignedUrl(
  bucket: GetoraStorageBucket,
  storagePath: string,
  expiresInSeconds = 3600
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(storagePath, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new Error(`Failed to generate signed URL: ${error?.message}`);
  }
  return data.signedUrl;
}
