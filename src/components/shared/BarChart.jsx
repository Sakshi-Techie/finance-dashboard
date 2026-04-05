import { fmt } from "../../utils/helpers";
import styles from "./BarChart.module.css";

export default function BarChart({ data = [] }) {
  const max = Math.max(...data.flatMap((d) => [d.income, d.expense])) || 1;

  return (
    <div className={styles.wrap}>
      <div className={styles.bars}>
        {data.map((d, i) => (
          <div key={i} className={styles.group}>
            <div className={styles.barPair}>
              <div
                className={`${styles.bar} ${styles.income}`}
                style={{ height: `${(d.income / max) * 80}px` }}
                title={fmt(d.income)}
              />
              <div
                className={`${styles.bar} ${styles.expense}`}
                style={{ height: `${(d.expense / max) * 80}px` }}
                title={fmt(d.expense)}
              />
            </div>
            <span className={styles.label}>{d.label}</span>
          </div>
        ))}
      </div>
      <div className={styles.legend}>
        <span className={`${styles.dot} ${styles.dotIncome}`} /> Income
        <span className={`${styles.dot} ${styles.dotExpense}`} /> Expense
      </div>
    </div>
  );
}
