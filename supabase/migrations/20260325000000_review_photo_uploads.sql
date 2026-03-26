-- Add photo_urls column to product_reviews (max 3 photos)
ALTER TABLE public.product_reviews
  ADD COLUMN photo_urls TEXT[] NOT NULL DEFAULT '{}';

ALTER TABLE public.product_reviews
  ADD CONSTRAINT product_reviews_max_photos
  CHECK (array_length(photo_urls, 1) IS NULL OR array_length(photo_urls, 1) <= 3);

-- Create storage bucket for review photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('review-photos', 'review-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Authenticated users can upload to their own folder: review-photos/{user_id}/{file}
CREATE POLICY "Users upload own review photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'review-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Anyone can view review photos (public bucket)
CREATE POLICY "Public read review photos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'review-photos');

-- Users can delete their own photos
CREATE POLICY "Users delete own review photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'review-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
