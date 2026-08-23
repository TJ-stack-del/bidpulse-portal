export interface DeadlineUrgency {
  label: string;
  badgeClass: string;
  daysRemaining: number;
}

export function getDeadlineUrgency(dueDateString?: string): DeadlineUrgency {
  if (!dueDateString) {
    return {
      label: "No Date Set",
      badgeClass: "bg-slate-100 dark:bg-slate-800 text-slate-500",
      daysRemaining: 999,
    };
  }

  const target = new Date(dueDateString);
  const now = new Date();
  
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return {
      label: `Expired (${Math.abs(daysRemaining)}d ago)`,
      badgeClass: "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-800",
      daysRemaining,
    };
  }

  if (daysRemaining === 0) {
    return {
      label: "⚠️ Due Today",
      badgeClass: "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 font-bold animate-pulse border border-red-200 dark:border-red-800",
      daysRemaining,
    };
  }

  if (daysRemaining === 1) {
    return {
      label: "⚡ 1 Day Left",
      badgeClass: "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800",
      daysRemaining,
    };
  }

  if (daysRemaining <= 5) {
    return {
      label: `⏳ ${daysRemaining} Days Left`,
      badgeClass: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-semibold border border-amber-200 dark:border-amber-800",
      daysRemaining,
    };
  }

  return {
    label: `📅 ${daysRemaining} Days Left`,
    badgeClass: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium",
    daysRemaining,
  };
}
