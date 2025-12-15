import { supabaseAdmin } from './auth.tsx';

const BUCKET_NAME = 'make-8db4ea83-medal-images';

// Initialize storage bucket
export async function initializeStorage() {
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      const { error } = await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
      });
      
      if (error) {
        console.error('Error creating storage bucket:', error);
      } else {
        console.log('Storage bucket created successfully');
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}

export async function uploadImage(
  userId: string,
  imageData: string,
  fileName: string
): Promise<string | null> {
  try {
    // Convert base64 to blob
    const base64Data = imageData.split(',')[1];
    const mimeType = imageData.split(';')[0].split(':')[1];
    const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    const filePath = `${userId}/${Date.now()}-${fileName}`;
    
    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: mimeType,
        upsert: false
      });
    
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }
    
    return filePath;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    return null;
  }
}

export async function getSignedUrl(filePath: string): Promise<string | null> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 3600); // 1 hour expiry
    
    if (error) {
      // Don't log 404 errors - these are expected when files have been deleted
      if (error.message?.includes('not found') || error.statusCode === '404') {
        return null;
      }
      console.error(`Error creating signed URL for ${filePath}:`, error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    return data.signedUrl;
  } catch (error) {
    // Only log unexpected errors, not missing file errors (404/400)
    const isNotFoundError = 
      error?.statusCode === '404' || 
      error?.status === 400 || 
      error?.message?.includes('not found') ||
      error?.message?.includes('Object not found');
    
    if (!isNotFoundError) {
      console.error('Unexpected error in getSignedUrl:', error);
    }
    return null;
  }
}

export async function deleteImage(filePath: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove([filePath]);
    
    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteImage:', error);
    return false;
  }
}