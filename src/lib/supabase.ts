import { createClient, type SupabaseClient, type User, type AuthError, type Session } from '@supabase/supabase-js';
import type { Profile, UserRole } from '../types/models';

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

interface UserWithRole extends User {
  role?: UserRole;
  profile?: Profile;
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
 * Sign up with email and password
 * @param email User's email
 * @param password User's password
 * @param userData Additional user data including first name, last name, and role
 * @returns Authentication response with data and error
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  userData: { firstName: string; lastName: string; role: UserRole }
): Promise<AuthResponse> => {
  try {
    // Sign up the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role,
        },
      },
    });

    if (error) throw error;

    // If successful and we have a user, update their profile
    if (data?.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role,
        })
        .eq('id', data.user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
      }
    }

    return { data, error };
  } catch (e) {
    console.error('Error during sign up:', e);
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

/**
 * Get the current user's profile including role
 * @returns The current user with profile data or null if not authenticated
 */
export const getCurrentUserWithProfile = async (): Promise<UserWithRole | null> => {
  try {
    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    // Fetch the user's profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      // Return user as UserWithRole but without profile data
      return { ...user } as UserWithRole;
    }
    
    // Return user with role information
    return {
      ...user,
      role: profile.role,
      profile: profile as Profile
    } as UserWithRole;
  } catch (e) {
    console.error('Error getting current user with profile:', e);
    return null;
  }
};

/**
 * Check if the current user has a specific role
 * @param role The role to check
 * @returns True if the user has the specified role, false otherwise
 */
export const hasRole = async (role: UserRole): Promise<boolean> => {
  try {
    const userWithProfile = await getCurrentUserWithProfile();
    return userWithProfile?.role === role;
  } catch (e) {
    console.error('Error checking user role:', e);
    return false;
  }
};

/**
 * Update a user's profile
 * @param profile The profile data to update
 * @returns Error if any
 */
export const updateProfile = async (profile: Partial<Profile>): Promise<{ error: Error | null }> => {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: new Error('No authenticated user') };
    
    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id);
      
    return { error };
  } catch (e) {
    console.error('Error updating profile:', e);
    return { error: e as Error };
  }
};

/**
 * Send password reset email to the user
 * @param email User's email
 * @returns Error if any
 */
export const resetPassword = async (email: string): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  } catch (e) {
    console.error('Error during password reset:', e);
    return { error: e as AuthError };
  }
};

/**
 * Update user's password
 * @param newPassword New password
 * @returns Error if any
 */
export const updatePassword = async (newPassword: string): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    return { error };
  } catch (e) {
    console.error('Error updating password:', e);
    return { error: e as AuthError };
  }
};
