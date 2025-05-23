/// <reference types="@astrojs/image/client" />

// Global type declarations for the application
declare namespace App {
  interface Locals {
    user: import('@supabase/supabase-js').User | null;
  }
}

// Add Supabase client to the window object
declare global {
  interface Window {
    supabase: import('@supabase/supabase-js').SupabaseClient;
  }
}

// Make this file a module
export {};
