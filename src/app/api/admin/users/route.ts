import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function GET() {
  try {
    const supabaseAdmin = getAdminClient();

    // 1. Fetch user list from auth
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    
    // If service role is missing or auth admin fails, fall back to profiles table
    if (userError || !userData?.users) {
      const { data: fallbackProfiles, error: profileErr } = await supabaseAdmin
        .from('profiles')
        .select('*');

      if (profileErr) {
        return NextResponse.json({ users: [] });
      }

      const formatted = (fallbackProfiles || []).map(p => ({
        id: p.id,
        email: p.email || 'contractor@bidpulse.local',
        displayName: p.full_name || 'Contractor User',
        companyName: p.company_name || '—',
        role: p.role || 'client',
        createdAt: p.created_at || new Date().toISOString()
      }));

      return NextResponse.json({ users: formatted });
    }

    // 2. Fetch profiles for role mapping
    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('id, role');

    const roleMap = new Map(profiles?.map(p => [p.id, p.role]) || []);

    const userList = userData.users.map(u => ({
      id: u.id,
      email: u.email,
      displayName: u.user_metadata?.full_name || u.user_metadata?.name || 'No Name Set',
      companyName: u.user_metadata?.company_name || '—',
      role: roleMap.get(u.id) || 'client',
      createdAt: u.created_at
    }));

    return NextResponse.json({ users: userList });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error', users: [] }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabaseAdmin = getAdminClient();

    if (body.action === 'invite') {
      const { email, role, displayName, companyName } = body;

      const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        data: { full_name: displayName, company_name: companyName }
      });

      if (inviteError) throw inviteError;

      if (inviteData?.user) {
        await supabaseAdmin.from('profiles').upsert({
          id: inviteData.user.id,
          email: inviteData.user.email,
          role: role || 'client'
        });
      }

      return NextResponse.json({ success: true, message: 'Invite sent' });
    }

    // Standard Profile/Role update
    const { userId, role, displayName, companyName } = body;

    await supabaseAdmin
      .from('profiles')
      .upsert({ id: userId, role });

    await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        full_name: displayName,
        company_name: companyName
      }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 400 });
  }
}
