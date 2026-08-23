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

export interface NewSolicitationInput {
  title: string;
  agency: string;
  solicitation_number: string;
  trade: string;
  estimated_value?: string;
  submission_deadline: string;
  pre_bid_date?: string;
  portal_url?: string;
}

export async function createSolicitation(input: NewSolicitationInput) {
  const supabaseAdmin = getAdminClient();

  const { error } = await supabaseAdmin.from('solicitations').insert({
    title: input.title,
    agency: input.agency,
    solicitation_number: input.solicitation_number,
    trade: input.trade,
    estimated_value: input.estimated_value || null,
    submission_deadline: new Date(input.submission_deadline).toISOString(),
    pre_bid_date: input.pre_bid_date ? new Date(input.pre_bid_date).toISOString() : null,
    portal_url: input.portal_url || null,
    status: 'open',
  });

  if (error) throw new Error(error.message);
  revalidatePath('/admin/opportunities');
  revalidatePath('/opportunities');
}

export async function deleteSolicitation(id: string) {
  const supabaseAdmin = getAdminClient();
  const { error } = await supabaseAdmin.from('solicitations').delete().eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/opportunities');
  revalidatePath('/opportunities');
}
