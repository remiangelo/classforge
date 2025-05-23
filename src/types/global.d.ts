// Type definitions for global objects

// Supabase client types
declare namespace SupabaseClient {
  interface QueryBuilder {
    from(table: string): {
      select(columns?: string): {
        order(column: string, options?: { ascending: boolean }): Promise<{ data: any; error: Error | null }>;
      };
      // Add other methods as needed
    };
  }
}

declare global {
  interface Window {
    supabase: {
      from: SupabaseClient.QueryBuilder['from'];
      // Add other Supabase client methods as needed
    };
  }
}

// Export something to make this a module
export {};
