import { useApp } from "../../context/AppContext";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { id: "dashboard",    label: "Dashboard",    icon: "▦" },
  { id: "transactions", label: "Transactions", icon: "⇄" },
  { id: "insights",     label: "Insights",     icon: "⚡" },
];

export default function Sidebar() {
  const { role, setRole, activeTab, setActiveTab } = useApp();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>◈</span>
        Fintrack
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((n) => (
          <button
            key={n.id}
            className={`${styles.navItem} ${activeTab === n.id ? styles.active : ""}`}
            onClick={() => setActiveTab(n.id)}
          >
            <span className={styles.navIcon}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>

      <div className={styles.spacer} />

      {/* Role Switcher */}
      <div className={`card ${styles.roleCard}`}>
        <p className={styles.roleLabel}>Role</p>
        <div className={styles.roleToggle}>
          {["admin", "viewer"].map((r) => (
            <button
              key={r}
              className={`${styles.roleBtn} ${role === r ? styles.roleActive : ""}`}
              onClick={() => setRole(r)}
            >
              {r}
            </button>
          ))}
        </div>
        <p className={styles.roleHint}>
          {role === "admin" ? "✏️ Can add / delete transactions" : "👁 View only mode"}
        </p>
      </div>
    </aside>
  );
}
