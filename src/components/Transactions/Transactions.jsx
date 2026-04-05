import { useState, useMemo, useCallback } from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES, CATEGORY_COLORS } from "../../data/transactions";
import { fmt } from "../../utils/helpers";
import { exportToCSV } from "../../utils/exportUtils";
import Modal from "../shared/Modal";
import styles from "./Transactions.module.css";

export default function Transactions() {
  const { transactions, role, addTransaction, deleteTransaction } = useApp();

  const [search, setSearch]         = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterCat,  setFilterCat]  = useState("All");
  const [sortKey,    setSortKey]     = useState("date");
  const [sortDir,    setSortDir]     = useState("desc");
  const [showModal,  setShowModal]   = useState(false);

  const toggleSort = useCallback((key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  }, [sortKey]);

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (filterType !== "All") list = list.filter((t) => t.type === filterType.toLowerCase());
    if (filterCat  !== "All") list = list.filter((t) => t.category === filterCat);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((t) =>
        t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (sortKey === "amount") { va = +va; vb = +vb; }
      return sortDir === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    return list;
  }, [transactions, filterType, filterCat, search, sortKey, sortDir]);

  const SortIcon = ({ col }) =>
    sortKey === col ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  return (
    <div className={styles.page}>
      {/* Filters Bar */}
      <div className={`card ${styles.filterBar}`}>
        <input
          className={styles.search}
          placeholder="🔍  Search transactions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          {["All","Income","Expense"].map((o) => <option key={o}>{o}</option>)}
        </select>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
          {CATEGORIES.map((o) => <option key={o}>{o}</option>)}
        </select>

        <span className={styles.count}>{filtered.length} results</span>

        {/* Export Buttons */}
        <div className={styles.exportGroup}>
          <button
            className={styles.exportBtn}
            onClick={() => exportToCSV(filtered, "fintrack-transactions.csv")}
            title="Download filtered transactions as CSV"
            disabled={filtered.length === 0}
          >
            ⬇ CSV
          </button>
        </div>

        {role === "admin" && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Add
          </button>
        )}
      </div>

      {/* Export hint */}
      {filtered.length > 0 && (
        <div className={styles.exportHint}>
          💡 Export buttons download the <strong>currently filtered</strong> {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
        </div>
      )}

      {/* Table */}
      <div className={`card ${styles.tableWrap}`}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <p>No transactions found.</p>
            <small>Try adjusting your filters.</small>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th onClick={() => toggleSort("date")}>Date<SortIcon col="date" /></th>
                <th onClick={() => toggleSort("description")}>Description<SortIcon col="description" /></th>
                <th>Category</th>
                <th onClick={() => toggleSort("amount")}>Amount<SortIcon col="amount" /></th>
                <th>Type</th>
                {role === "admin" && <th></th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
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
                  <td
                    style={{
                      color: t.type === "income" ? "var(--green)" : "var(--red)",
                      fontWeight: 700,
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
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
                  {role === "admin" && (
                    <td>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => deleteTransaction(t.id)}
                        title="Delete"
                      >
                        ✕
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)} onSave={addTransaction} />
      )}
    </div>
  );
}