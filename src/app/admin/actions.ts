'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function toggleAdminStatus(userId: string, currentStatus: boolean) {
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ is_admin: !currentStatus })
    .eq('id', userId);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/users');
}

export async function updateCompanyName(userId: string, companyName: string) {
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ company_name: companyName })
    .eq('id', userId);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/users');
}

export async function deleteUserAccount(userId: string) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/users');
}
