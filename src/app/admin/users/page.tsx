'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toggleAdminStatus, updateCompanyName, deleteUserAccount } from '../actions';

interface Profile {
  id: string;
  email: string;
  company_name: string | null;
  is_admin: boolean;
  created_at?: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempCompany, setTempCompany] = useState('');

  async function loadUsers() {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('is_admin', { ascending: false });

    if (!error && data) {
      setUsers(data as Profile[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleAdmin = async (user: Profile) => {
    await toggleAdminStatus(user.id, user.is_admin);
    loadUsers();
  };

  const handleSaveCompany = async (userId: string) => {
    await updateCompanyName(userId, tempCompany);
    setEditingId(null);
    loadUsers();
  };

  const handleDelete = async (userId: string, email: string) => {
    if (confirm(`Are you sure you want to permanently delete ${email}?`)) {
      await deleteUserAccount(userId);
      loadUsers();
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-500">Loading user records...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500">
            View accounts, adjust permissions, and manage client organizations.
          </p>
        </div>
        <button
          onClick={loadUsers}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-sm"
        >
          Refresh List
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 font-semibold text-slate-700">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Company Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/60 transition">
                <td className="px-4 py-3 font-medium text-slate-900">{u.email}</td>

                <td className="px-4 py-3">
                  {editingId === u.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tempCompany}
                        onChange={(e) => setTempCompany(e.target.value)}
                        className="rounded border border-slate-300 px-2 py-1 text-xs"
                      />
                      <button
                        onClick={() => handleSaveCompany(u.id)}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs text-slate-400 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>{u.company_name || '—'}</span>
                      <button
                        onClick={() => {
                          setEditingId(u.id);
                          setTempCompany(u.company_name || '');
                        }}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        ✎
                      </button>
                    </div>
                  )}
                </td>

                <td className="px-4 py-3">
                  {u.is_admin ? (
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                      Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      Standard User
                    </span>
                  )}
                </td>

                <td className="px-4 py-3 text-right space-x-3">
                  <button
                    onClick={() => handleToggleAdmin(u)}
                    className="text-xs font-medium text-slate-700 hover:text-blue-600 transition"
                  >
                    {u.is_admin ? 'Demote to User' : 'Make Admin'}
                  </button>
                  <button
                    onClick={() => handleDelete(u.id, u.email)}
                    className="text-xs font-medium text-red-600 hover:text-red-800 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
