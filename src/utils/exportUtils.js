/**
 * exportToCSV — converts transactions array to a downloadable CSV file
 */
export function exportToCSV(transactions, filename = "transactions.csv") {
  if (!transactions.length) return;
  const headers = ["ID", "Date", "Description", "Category", "Type", "Amount (₹)"];
  const rows = transactions.map((t) => [
    t.id,
    t.date,
    `"${t.description}"`,
    t.category,
    t.type,
    t.amount,
  ]);
  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  downloadFile(csvContent, filename, "text/csv");
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}