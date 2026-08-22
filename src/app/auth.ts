import { supabase } from "./supabase";
import { User } from "@supabase/supabase-js";

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch (err) {
    return null;
  }
}

export async function signInWithEmail(email: string, password: string):Promise<{ user: User | null; error: string | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { user: null, error: error.message };
    return { user: data.user, error: null };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Authentication failed.";
    return { user: null, error: errorMessage };
  }
}

export async function signUpWithEmail(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) return { user: null, error: error.message };
    return { user: data.user, error: null };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Registration failed.";
    return { user: null, error: errorMessage };
  }
}

export async function signOutUser(): Promise<void> {
  await supabase.auth.signOut();
}

export async function sendPasswordResetEmail(email: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login?reset=true`,
    });
    if (error) return { error: error.message };
    return { error: null };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Password reset request failed.";
    return { error: errorMessage };
  }
}

export async function updateUserPassword(newPassword: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: error.message };
    return { error: null };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Password update failed.";
    return { error: errorMessage };
  }
}
