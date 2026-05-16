import React from "react";
import { formatCurrency, getCategoryColor } from "../utils/addExpense";

/**
 * ExpenseSummary Component
 * Shows total spending per category as stat cards, plus a grand total.
 *
 * @param {Object}  props
 * @param {Array}   props.summary  - Array of { category, total, count, avgAmount }
 * @param {number}  props.grandTotal - Sum of all expenses
 * @param {boolean} props.isLoading
 */
const ExpenseSummary = ({ summary, grandTotal, isLoading }) => {
  if (isLoading) {
    return <div className="loading-state">Loading summary...</div>;
  }

  if (!summary || summary.length === 0) {
    return (
      <div className="empty-state">
        <p>No data yet. Add some expenses to see a summary.</p>
      </div>
    );
  }

  return (
    <div className="summary-container">
      {/* Grand Total Banner */}
      <div className="grand-total-card">
        <span className="grand-total-label">Total Spent</span>
        <span className="grand-total-amount">{formatCurrency(grandTotal)}</span>
      </div>

      {/* Per-Category Cards */}
      <div className="summary-grid">
        {summary.map((item) => {
          const color = getCategoryColor(item.category);
          // Calculate percentage of grand total for the progress bar
          const percentage = grandTotal > 0
            ? Math.round((item.total / grandTotal) * 100)
            : 0;

          return (
            <div
              key={item.category}
              className="summary-card"
              style={{ borderLeftColor: color }}
            >
              <div className="summary-card-header">
                <span className="summary-category">{item.category}</span>
                <span className="summary-total" style={{ color }}>
                  {formatCurrency(item.total)}
                </span>
              </div>

              {/* Progress bar showing proportion of total */}
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${percentage}%`, backgroundColor: color }}
                />
              </div>

              <div className="summary-meta">
                <span>{item.count} transaction{item.count !== 1 ? "s" : ""}</span>
                <span>Avg {formatCurrency(item.avgAmount)}</span>
                <span className="percentage-badge">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpenseSummary;
