/**
 * Initialize Supabase client and make it available globally
 * This script is imported by Astro components that need Supabase on the client side
 */
import { supabase } from '../lib/supabase';

try {
  // Make Supabase client available globally for components that need it
  window.supabase = supabase;
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

// Export for direct imports
export { supabase };

