import React from 'react';
import Link from 'next/link';

export const AdminNavLinks = () => {
  return (
    <div className="flex items-center gap-4 text-xs font-medium">
      <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
        Admin
      </span>
      <Link href="/admin/opportunities" className="text-slate-300 hover:text-white transition">
        Manage RFPs
      </Link>
      <Link href="/admin/users" className="text-slate-300 hover:text-white transition">
        Manage Users
      </Link>
      <Link href="/admin/fulfillment" className="text-slate-300 hover:text-white transition">
        Fulfillment
      </Link>
    </div>
  );
};
