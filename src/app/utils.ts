export function getDeadlineUrgency(dueDateStr: string): {
  label: string;
  badgeClass: string;
  daysRemaining: number;
} {
  const target = new Date(dueDateStr);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (isNaN(diffDays)) {
    return {
      label: dueDateStr,
      badgeClass: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
      daysRemaining: 999
    };
  }

  if (diffDays < 0) {
    return {
      label: "Expired",
      badgeClass: "bg-slate-200 dark:bg-slate-800 text-slate-500 line-through",
      daysRemaining: diffDays
    };
  } else if (diffDays <= 2) {
    return {
      label: `🚨 ${diffDays === 0 ? "Due Today" : diffDays === 1 ? "Due Tomorrow" : "2 Days Left"}`,
      badgeClass: "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-black animate-pulse",
      daysRemaining: diffDays
    };
  } else if (diffDays <= 7) {
    return {
      label: `⏰ ${diffDays} Days Left`,
      badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold",
      daysRemaining: diffDays
    };
  } else {
    return {
      label: `📅 ${diffDays} Days Left (${dueDateStr})`,
      badgeClass: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 font-medium",
      daysRemaining: diffDays
    };
  }
}
