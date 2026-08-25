'use server'

import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !authData.user) {
    return { error: error?.message || 'Authentication failed' };
  }

  // Fetch the role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single();

  // Diagnostic logs
  console.log("LOGIN DIAGNOSTIC -> Auth User ID:", authData.user.id);
  console.log("LOGIN DIAGNOSTIC -> Profile Data:", profile);

  // Force Next.js to destroy the layout cache so the Header updates
  revalidatePath('/', 'layout');

  // Route intelligently based on database roles
  if (profile?.role === 'admin') {
    redirect('/portal/admin');
  } else if (profile?.role === 'specialist') {
    redirect('/portal/coordinator');
  } else {
    redirect('/portal/intake'); 
  }
}

export async function signUpAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error: signUpError } = await supabase.auth.signUp({ email, password });
  if (signUpError) return { error: signUpError.message };

  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) return { error: signInError.message };

  revalidatePath('/', 'layout');
  redirect('/portal/intake');
}