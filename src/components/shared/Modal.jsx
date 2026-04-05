import { useState } from "react";
import { CATEGORIES } from "../../data/transactions";
import styles from "./Modal.module.css";

const DEFAULT_FORM = {
  description: "",
  amount: "",
  category: "Food",
  type: "expense",
  date: new Date().toISOString().split("T")[0],
};

export default function Modal({ onClose, onSave }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = "Required";
    if (!form.amount || isNaN(+form.amount) || +form.amount <= 0) e.amount = "Enter a valid amount";
    if (!form.date) e.date = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ ...form, amount: parseFloat(form.amount) });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Add Transaction</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.fields}>
          <div className={styles.field}>
            <label>Description</label>
            <input
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="e.g. Coffee"
            />
            {errors.description && <span className={styles.error}>{errors.description}</span>}
          </div>

          <div className={styles.field}>
            <label>Amount (₹)</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => set("amount", e.target.value)}
              placeholder="0.00"
            />
            {errors.amount && <span className={styles.error}>{errors.amount}</span>}
          </div>

          <div className={styles.field}>
            <label>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
            {errors.date && <span className={styles.error}>{errors.date}</span>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Category</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.filter((c) => c !== "All").map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label>Type</label>
              <select value={form.type} onChange={(e) => set("type", e.target.value)}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Save Transaction</button>
        </div>
      </div>
    </div>
  );
}
