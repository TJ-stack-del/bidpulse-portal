'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

function getAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseSecret =
    process.env.SUPABASE_SECRET_KEY || 'placeholder-service-key';

  return createClient(supabaseUrl, supabaseSecret);
}

export async function toggleAdminStatus(userId: string, currentStatus: boolean) {
  const supabaseAdmin = getAdminClient();
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ is_admin: !currentStatus })
    .eq('id', userId);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/users');
}

export async function updateCompanyName(userId: string, companyName: string) {
  const supabaseAdmin = getAdminClient();
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ company_name: companyName })
    .eq('id', userId);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/users');
}

export async function deleteUserAccount(userId: string) {
  const supabaseAdmin = getAdminClient();
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/users');
}
