/**
 * Utility to format image URLs correctly for display.
 * Handles both full Supabase URLs and relative local paths.
 */
export const getImageUrl = (path) => {
  if (!path) return null;
  
  // If it's already a full URL (Supabase, Unsplash, etc.)
  if (path.startsWith('http')) {
    return path;
  }
  
  // If it's a relative path starting with /uploads
  // We point it to the API URL (which is handled by our Vercel functions for relative path support if needed)
  // Or handle it dynamically based on environment
  const apiBaseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  
  return `${apiBaseUrl}${path}`;
};
