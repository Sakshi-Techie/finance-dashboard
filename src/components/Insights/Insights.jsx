import { useApp } from "../../context/AppContext";
import { fmt } from "../../utils/helpers";
import styles from "./Insights.module.css";

export default function Insights() {
  const { mar, feb, spendByCategory, incDelta, expDelta, savingsRate } = useApp();

  const topCat = spendByCategory[0];

  const kpiCards = [
    {
      icon: "🔥",
      title: "Top Spending Category",
      value: topCat?.label || "—",
      sub: topCat ? `${fmt(topCat.value)} this month` : "No data",
      accent: "#f59e0b",
    },
    {
      icon: "📊",
      title: "Month-over-Month Expenses",
      value: `${expDelta > 0 ? "+" : ""}${expDelta}%`,
      sub: +expDelta > 0 ? "Higher than February" : "Lower than February",
      accent: +expDelta > 0 ? "#f43f5e" : "#22c55e",
    },
    {
      icon: "💰",
      title: "Net Savings (March)",
      value: fmt(Math.max(0, mar.balance)),
      sub: mar.balance >= 0 ? "Positive cash flow 🎉" : "Deficit this month ⚠️",
      accent: mar.balance >= 0 ? "#22c55e" : "#f43f5e",
    },
    {
      icon: "📈",
      title: "Income Change",
      value: `${incDelta > 0 ? "+" : ""}${incDelta}%`,
      sub: "vs February 2026",
      accent: "#6366f1",
    },
    {
      icon: "🎯",
      title: "Savings Rate",
      value: `${savingsRate}%`,
      sub: +savingsRate >= 20 ? "Above 20% target ✓" : "Below 20% target",
      accent: +savingsRate >= 20 ? "#22c55e" : "#f59e0b",
    },
    {
      icon: "🗓",
      title: "Transactions (March)",
      value: mar.transactions.length,
      sub: `${mar.transactions.filter(t=>t.type==="expense").length} expenses, ${mar.transactions.filter(t=>t.type==="income").length} income`,
      accent: "#14b8a6",
    },
  ];

  const observations = [
    `Housing accounts for ${topCat ? ((spendByCategory.find(c=>c.label==="Housing")?.value||0)/mar.expense*100).toFixed(0) : 0}% of total March expenses — your largest fixed cost.`,
    `You spent ${fmt(mar.expense)} in March vs ${fmt(feb.expense)} in February — a ${Math.abs(expDelta)}% ${+expDelta > 0 ? "increase" : "decrease"}.`,
    `Your savings rate is ${savingsRate}% — ${+savingsRate >= 20 ? "above the recommended 20%! Great job." : "below the recommended 20%. Consider reviewing discretionary spending."}`,
    `Food & dining combined: ${fmt((spendByCategory.find(c=>c.label==="Food")?.value||0))} this month.`,
    `Income ${+incDelta >= 0 ? "grew" : "fell"} by ${Math.abs(incDelta)}% compared to February.`,
  ];

  return (
    <div className={styles.page}>
      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        {kpiCards.map((c, i) => (
          <div key={i} className={`card ${styles.kpiCard}`}>
            <span className={styles.kpiIcon}>{c.icon}</span>
            <p className={styles.kpiTitle}>{c.title}</p>
            <p className={styles.kpiValue} style={{ color: c.accent }}>{c.value}</p>
            <p className={styles.kpiSub}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Category Progress Bars */}
      <div className="card">
        <p className={styles.sectionTitle}>Category Breakdown — March 2026</p>
        <div className={styles.bars}>
          {spendByCategory.length === 0 ? (
            <p className={styles.empty}>No expense data available.</p>
          ) : (
            spendByCategory.map((c, i) => (
              <div key={i} className={styles.barRow}>
                <div className={styles.barMeta}>
                  <span>{c.label}</span>
                  <span style={{ fontWeight: 700 }}>{fmt(c.value)}</span>
                </div>
                <div className={styles.track}>
                  <div
                    className={styles.fill}
                    style={{
                      width: `${(c.value / spendByCategory[0].value) * 100}%`,
                      background: c.color,
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Observations */}
      <div className="card">
        <p className={styles.sectionTitle}>💡 Key Observations</p>
        <div className={styles.observations}>
          {observations.map((obs, i) => (
            <div key={i} className={styles.obs}>{obs}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
