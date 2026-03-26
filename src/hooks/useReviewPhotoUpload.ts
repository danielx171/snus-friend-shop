import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const MAX_PHOTOS = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const EXT_FROM_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export interface PhotoPreview {
  file: File;
  previewUrl: string;
}

export function useReviewPhotoUpload() {
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const [uploading, setUploading] = useState(false);

  const addPhotos = useCallback((files: FileList | File[]) => {
    const fileArr = Array.from(files);
    const errors: string[] = [];

    setPhotos((prev) => {
      const remaining = MAX_PHOTOS - prev.length;
      if (remaining <= 0) {
        errors.push(`Maximum ${MAX_PHOTOS} photos allowed.`);
        return prev;
      }

      const valid: PhotoPreview[] = [];
      let added = 0;
      for (const file of fileArr) {
        if (!ALLOWED_TYPES.has(file.type)) {
          errors.push(`${file.name}: only JPEG, PNG, and WebP are allowed.`);
          continue;
        }
        if (file.size > MAX_FILE_SIZE) {
          errors.push(`${file.name}: must be under 5 MB.`);
          continue;
        }
        if (added >= remaining) {
          errors.push(`${file.name}: maximum ${MAX_PHOTOS} photos allowed.`);
          continue;
        }
        valid.push({ file, previewUrl: URL.createObjectURL(file) });
        added++;
      }
      return [...prev, ...valid];
    });

    return errors;
  }, []);

  const removePhoto = useCallback((index: number) => {
    setPhotos((prev) => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const clearPhotos = useCallback(() => {
    setPhotos((prev) => {
      for (const p of prev) URL.revokeObjectURL(p.previewUrl);
      return [];
    });
  }, []);

  /** Upload all photos to Supabase Storage. Returns public URLs. */
  const uploadAll = useCallback(async (userId: string): Promise<string[]> => {
    if (photos.length === 0) return [];
    setUploading(true);

    try {
      const urls: string[] = [];
      for (const { file } of photos) {
        const ext = EXT_FROM_TYPE[file.type] ?? 'jpg';
        const path = `${userId}/${crypto.randomUUID()}.${ext}`;

        const { error } = await supabase.storage
          .from('review-photos')
          .upload(path, file, { contentType: file.type, upsert: false });

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('review-photos')
          .getPublicUrl(path);

        urls.push(urlData.publicUrl);
      }
      return urls;
    } finally {
      setUploading(false);
    }
  }, [photos]);

  return {
    photos,
    uploading,
    addPhotos,
    removePhoto,
    clearPhotos,
    uploadAll,
    canAddMore: photos.length < MAX_PHOTOS,
  };
}
