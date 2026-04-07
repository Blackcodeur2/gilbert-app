import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Helper to get the public URL of an image from a Supabase bucket.
 * @param bucket The name of the bucket
 * @param path The path to the image in the bucket
 * @returns The full public URL or null if path is empty
 */
export const getPublicUrl = (bucket: string, path: string | null | undefined): string => {
  if (!path) return '';
  // If the path is already a full URL, return it
  if (path.startsWith('http')) return path;
  
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

/**
 * Helper to upload an image from a local URI to a Supabase bucket.
 * @param bucket The name of the bucket
 * @param path The destination path in the bucket
 * @param uri The local URI of the image
 * @returns The path of the uploaded file or null if failed
 */
export const uploadImage = async (bucket: string, path: string, uri: string): Promise<string | null> => {
  try {
    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, arrayBuffer, {
        cacheControl: '3600',
        upsert: true,
        contentType,
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    return data.path;
  } catch (error) {
    console.error('Error in uploadImage helper:', error);
    return null;
  }
};
