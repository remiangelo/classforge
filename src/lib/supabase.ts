import { createClient, type SupabaseClient, type User, type AuthError, type Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Authentication will not work.');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

interface AuthResponse {
  data: {
    user: User | null;
    session: Session | null; 
  } | null;
  error: AuthError | null;
}

/**
 * Sign in with email and password
 * @param email User's email
 * @param password User's password
 * @returns Authentication response with data and error
 */
export const signInWithEmail = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  } catch (e) {
    console.error('Error during sign in:', e);
    return { data: null, error: e as AuthError };
  }
};

/**
 * Sign out the current user
 * @returns Error if any
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (e) {
    console.error('Error during sign out:', e);
    return { error: e as AuthError };
  }
};

/**
 * Get the current authenticated user
 * @returns The current user or null if not authenticated
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (e) {
    console.error('Error getting current user:', e);
    return null;
  }
};
