import { fmtShort } from "../../utils/helpers";
import styles from "./DonutChart.module.css";

export default function DonutChart({ data = [] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return <p className={styles.empty}>No expense data</p>;

  const R = 60, CX = 80, CY = 80, STROKE = 22;
  let cumAngle = -90;

  const slices = data.map((d) => {
    const angle = (d.value / total) * 360;
    const a1 = (cumAngle * Math.PI) / 180;
    cumAngle += angle;
    const a2 = (cumAngle * Math.PI) / 180;
    const x1 = CX + R * Math.cos(a1), y1 = CY + R * Math.sin(a1);
    const x2 = CX + R * Math.cos(a2), y2 = CY + R * Math.sin(a2);
    const large = angle > 180 ? 1 : 0;
    return {
      ...d,
      path: `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`,
      pct: ((d.value / total) * 100).toFixed(1),
    };
  });

  return (
    <div className={styles.wrap}>
      <svg viewBox="0 0 160 160" className={styles.svg}>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#1e293b" strokeWidth={STROKE} />
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill="none" stroke={s.color} strokeWidth={STROKE} strokeLinecap="butt">
            <title>{s.label}: ₹{s.value.toLocaleString("en-IN")}</title>
          </path>
        ))}
        <text x={CX} y={CY - 4}  textAnchor="middle" fill="#f1f5f9" fontSize="11" fontWeight="700">{fmtShort(total)}</text>
        <text x={CX} y={CY + 13} textAnchor="middle" fill="#64748b" fontSize="9">expenses</text>
      </svg>

      <div className={styles.legend}>
        {slices.map((s, i) => (
          <div key={i} className={styles.legendItem}>
            <span className={styles.dot} style={{ background: s.color }} />
            <span className={styles.legendLabel}>{s.label}</span>
            <span className={styles.legendPct}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
