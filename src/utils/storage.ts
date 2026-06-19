import { supabase } from "../lib/supabase-browser";

const BUCKET = "cafe-images";

/**
 * Public base URL segment for the storage bucket.
 */
const PUBLIC_BASE = "/storage/v1/object/public/";
const BUCKET_PUBLIC_BASE = `${PUBLIC_BASE}${BUCKET}/`;

/**
 * Build a public URL for a newly uploaded file in the cafe-images bucket.
 */
export function publicStorageUrl(fileName: string): string {
  return supabase.storage.from(BUCKET).getPublicUrl(fileName).data.publicUrl;
}

/**
 * Upload a file to the cafe-images bucket, returning its public URL.
 * Throws on upload error (caller decides how to surface).
 */
export async function uploadImage(
  file: File,
  onConflict?: (existing: string) => Promise<void>
): Promise<string> {
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, { upsert: true });
  if (error) throw error;
  return publicStorageUrl(fileName);
}

/**
 * Remove an image by its public URL. No-op if the URL doesn't belong to the bucket.
 */
export async function removeImageByUrl(url: string | null | undefined): Promise<void> {
  if (!url) return;
  const path = url.split(BUCKET_PUBLIC_BASE)[1];
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}

export { BUCKET };
