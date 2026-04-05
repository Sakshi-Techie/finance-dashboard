export const fmt = (n) =>
  "₹" + Number(n).toLocaleString("en-IN");

export const fmtShort = (n) =>
  n >= 100000
    ? "₹" + (n / 100000).toFixed(1) + "L"
    : "₹" + (n / 1000).toFixed(1) + "K";

export const calcTotals = (transactions, monthPrefix) => {
  const filtered = transactions.filter((t) => t.date.startsWith(monthPrefix));
  const income  = filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  return { income, expense, balance: income - expense, transactions: filtered };
};

export const calcSpendByCategory = (transactions, CATEGORY_COLORS) => {
  const map = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount; });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value, color: CATEGORY_COLORS[label] || "#6366f1" }));
};

export const calcBalanceTrend = (transactions) => {
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
  let running = 0;
  const byDay = {};
  sorted.forEach((t) => {
    byDay[t.date] = (byDay[t.date] || 0) + (t.type === "income" ? t.amount : -t.amount);
  });
  return Object.entries(byDay)
    .sort()
    .map(([, v]) => { running += v; return running; });
};

export const deltaPercent = (curr, prev) => {
  if (!prev) return 0;
  return ((curr - prev) / prev * 100).toFixed(1);
};
