import { useApp } from "./context/AppContext";
import Sidebar      from "./components/shared/Sidebar";
import Dashboard    from "./components/Dashboard/Dashboard";
import Transactions from "./components/Transactions/Transactions";
import Insights     from "./components/Insights/Insights";
import "./styles/global.css";
import styles from "./App.module.css";

const PAGE_TITLES = {
  dashboard:    "Dashboard",
  transactions: "Transactions",
  insights:     "Insights",
};

export default function App() {
  const { activeTab, role } = useApp();

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.main}>
        {/* Page Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>{PAGE_TITLES[activeTab]}</h1>
            <p className={styles.pageSub}>
              March 2026 &middot; {role === "admin" ? "Admin" : "Viewer"} View
            </p>
          </div>
        </div>

        {/* Page Content */}
        {activeTab === "dashboard"    && <Dashboard />}
        {activeTab === "transactions" && <Transactions />}
        {activeTab === "insights"     && <Insights />}
      </main>
    </div>
  );
}
