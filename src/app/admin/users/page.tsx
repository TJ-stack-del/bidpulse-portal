'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toggleAdminStatus, updateCompanyName, deleteUserAccount } from '../actions';

interface Profile {
  id: string;
  email: string;
  is_admin: boolean;
  company_name: string | null;
  trade: string | null;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyInputs, setCompanyInputs] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  async function loadUsers() {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUsers(data as Profile[]);
      const inputs: Record<string, string> = {};
      data.forEach((u) => {
        inputs[u.id] = u.company_name || '';
      });
      setCompanyInputs(inputs);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    try {
      await toggleAdminStatus(userId, !currentStatus);
      showToast(!currentStatus ? 'User granted Admin access.' : 'User demoted to Contractor.');
      loadUsers();
    } catch {
      showToast('Unable to update permissions.');
    }
  };

  const handleSaveCompany = async (userId: string) => {
    const name = companyInputs[userId] || '';
    try {
      await updateCompanyName(userId, name);
      showToast('Company name updated.');
      loadUsers();
    } catch {
      showToast('Unable to save company name.');
    }
  };

  const handleDelete = async (userId: string) => {
    if (confirm('Delete this user account?')) {
      try {
        await deleteUserAccount(userId);
        showToast('User account deleted.');
        loadUsers();
      } catch {
        showToast('Unable to delete account.');
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl transition-all">
          {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">User & Role Management</h1>
          <p className="text-base text-slate-600 mt-1">
            Manage contractor accounts, update company profiles, and assign administrative permissions.
          </p>
        </div>
        <button
          onClick={loadUsers}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
        >
          Refresh Users
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-16 text-center text-base text-slate-500 font-medium">Loading user profiles...</div>
        ) : users.length === 0 ? (
          <div className="p-16 text-center text-base text-slate-500">No registered users found.</div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 font-bold text-slate-700">
              <tr>
                <th className="px-5 py-3.5">User Email</th>
                <th className="px-5 py-3.5">Company Name</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900 text-base">{u.email}</p>
                    <p className="text-xs text-slate-500 mt-0.5">ID: {u.id.substring(0, 8)}...</p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Assign Company LLC"
                        value={companyInputs[u.id] || ''}
                        onChange={(e) =>
                          setCompanyInputs({ ...companyInputs, [u.id]: e.target.value })
                        }
                        className="w-56 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal"
                      />
                      <button
                        onClick={() => handleSaveCompany(u.id)}
                        className="rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-bold text-white hover:bg-slate-800 shadow-sm"
                      >
                        Save
                      </button>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    {u.is_admin ? (
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                        Contractor
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-right space-x-3">
                    <button
                      onClick={() => handleToggleAdmin(u.id, u.is_admin)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
                    >
                      {u.is_admin ? 'Demote to Contractor' : 'Promote to Admin'}
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-xs font-bold text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
