// Initialize Supabase client and make it available globally
import { supabase } from '../lib/supabase';

// Make Supabase client available globally
window.supabase = supabase;

// Log initialization for debugging
console.log('Supabase client initialized');
