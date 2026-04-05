import { useApp } from "../../context/AppContext";
import { fmt } from "../../utils/helpers";
import { CATEGORY_COLORS } from "../../data/transactions";
import SparkLine from "../shared/SparkLine";
import BarChart   from "../shared/BarChart";
import DonutChart from "../shared/DonutChart";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const {
    mar, feb,
    spendByCategory,
    balanceTrend,
    incDelta, expDelta, savingsRate,
  } = useApp();

  const summaryCards = [
    {
      label: "Total Balance",
      value: fmt(mar.balance),
      delta: null,
      accent: "#6366f1",
      icon: "◈",
    },
    {
      label: "Total Income",
      value: fmt(mar.income),
      delta: `${incDelta > 0 ? "+" : ""}${incDelta}% vs Feb`,
      positive: +incDelta >= 0,
      accent: "#22c55e",
      icon: "↑",
    },
    {
      label: "Total Expenses",
      value: fmt(mar.expense),
      delta: `${expDelta > 0 ? "+" : ""}${expDelta}% vs Feb`,
      positive: +expDelta <= 0,
      accent: "#f43f5e",
      icon: "↓",
    },
    {
      label: "Savings Rate",
      value: `${savingsRate}%`,
      delta: "of income saved",
      positive: +savingsRate >= 20,
      accent: "#f59e0b",
      icon: "%",
    },
  ];

  return (
    <div className={styles.page}>
      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        {summaryCards.map((c, i) => (
          <div key={i} className={`card ${styles.summaryCard}`}>
            <div className={styles.cardGlow} style={{ background: c.accent + "18" }} />
            <div className={styles.cardIcon} style={{ color: c.accent }}>{c.icon}</div>
            <p className={styles.cardLabel}>{c.label}</p>
            <p className={styles.cardValue}>{c.value}</p>
            {c.delta && (
              <p
                className={styles.cardDelta}
                style={{ color: c.positive ? "#22c55e" : "#f43f5e" }}
              >
                {c.delta}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className={styles.chartsRow}>
        <div className={`card ${styles.chartCard}`}>
          <p className={styles.chartTitle}>Balance Trend — March 2026</p>
          <SparkLine data={balanceTrend} color="#6366f1" height={80} />
          <div className={styles.chartFooter}>
            <span>Mar 1</span><span>Mar 30</span>
          </div>
        </div>

        <div className={`card ${styles.chartCard}`}>
          <p className={styles.chartTitle}>Monthly Comparison</p>
          <BarChart data={[
            { label: "Feb", income: feb.income, expense: feb.expense },
            { label: "Mar", income: mar.income, expense: mar.expense },
          ]} />
        </div>
      </div>

      {/* Donut */}
      <div className="card">
        <p className={styles.chartTitle}>Spending Breakdown — March 2026</p>
        <DonutChart data={spendByCategory} />
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <p className={styles.chartTitle}>Recent Transactions</p>
        {mar.transactions.length === 0 ? (
          <p className={styles.empty}>No transactions this month.</p>
        ) : (
          <table>
            <thead>
              <tr>
                {["Date","Description","Category","Amount","Type"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mar.transactions.slice(0, 6).map((t) => (
                <tr key={t.id}>
                  <td style={{ color: "var(--text-muted)" }}>{t.date}</td>
                  <td>{t.description}</td>
                  <td>
                    <span
                      className="tag"
                      style={{
                        background: (CATEGORY_COLORS[t.category] || "#6366f1") + "22",
                        color: CATEGORY_COLORS[t.category] || "#6366f1",
                      }}
                    >
                      {t.category}
                    </span>
                  </td>
                  <td style={{ color: t.type === "income" ? "var(--green)" : "var(--red)", fontWeight: 700 }}>
                    {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                  </td>
                  <td>
                    <span
                      className="tag"
                      style={{
                        background: (t.type === "income" ? "#22c55e" : "#f43f5e") + "22",
                        color: t.type === "income" ? "#22c55e" : "#f43f5e",
                      }}
                    >
                      {t.type}
                    </span>
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
