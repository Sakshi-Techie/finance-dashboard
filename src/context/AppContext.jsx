import { createContext, useContext, useState, useMemo } from "react";
import { INITIAL_TRANSACTIONS, CATEGORY_COLORS } from "../data/transactions";
import {
  calcTotals,
  calcSpendByCategory,
  calcBalanceTrend,
  deltaPercent,
} from "../utils/helpers";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [role, setRole] = useState("admin"); // "admin" | "viewer"
  const [activeTab, setActiveTab] = useState("dashboard");

  // ── Derived data ──────────────────────────────────────────────────────────
  const mar = useMemo(() => calcTotals(transactions, "2026-03"), [transactions]);
  const feb = useMemo(() => calcTotals(transactions, "2026-02"), [transactions]);

  const spendByCategory = useMemo(
    () => calcSpendByCategory(mar.transactions, CATEGORY_COLORS),
    [mar.transactions]
  );

  const balanceTrend = useMemo(
    () => calcBalanceTrend(mar.transactions),
    [mar.transactions]
  );

  const incDelta  = deltaPercent(mar.income,  feb.income);
  const expDelta  = deltaPercent(mar.expense, feb.expense);
  const savingsRate = mar.income > 0
    ? ((mar.balance / mar.income) * 100).toFixed(1)
    : "0.0";

  // ── Actions ───────────────────────────────────────────────────────────────
  const addTransaction = (txn) =>
    setTransactions((prev) => [...prev, { ...txn, id: Date.now() }]);

  const deleteTransaction = (id) =>
    setTransactions((prev) => prev.filter((t) => t.id !== id));

  return (
    <AppContext.Provider
      value={{
        // state
        transactions,
        role,
        activeTab,
        // derived
        mar,
        feb,
        spendByCategory,
        balanceTrend,
        incDelta,
        expDelta,
        savingsRate,
        // actions
        setRole,
        setActiveTab,
        addTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
