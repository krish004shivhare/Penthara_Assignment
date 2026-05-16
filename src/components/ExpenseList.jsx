import React, { useState } from "react";
import { formatCurrency, formatDate, CATEGORIES } from "../utils/addExpense";

/**
 * ExpenseList Component
 * Displays all expenses in a table with category filter and delete/edit actions.
 *
 * @param {Object}   props
 * @param {Array}    props.expenses   - Array of expense objects from the API
 * @param {Function} props.onDelete   - Callback with expense ID to delete
 * @param {Function} props.onEdit     - Callback with expense object to edit
 * @param {boolean}  props.isLoading  - Shows a loading state
 */
const ExpenseList = ({ expenses, onDelete, onEdit, isLoading }) => {
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortField, setSortField]           = useState("date");
  const [sortOrder, setSortOrder]           = useState("desc");

  /**
   * Toggles sort direction or changes sort field.
   * @param {string} field - "date" | "amount" | "category"
   */
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Client-side filter by category
  const filtered = filterCategory === "All"
    ? expenses
    : expenses.filter((e) => e.category === filterCategory);

  // Client-side sort
  const sorted = [...filtered].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === "date") {
      valA = new Date(valA);
      valB = new Date(valB);
    }
    if (sortField === "amount") {
      valA = Number(valA);
      valB = Number(valB);
    }
    if (sortField === "category") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  /** Renders a sort indicator arrow next to column headers */
  const SortIndicator = ({ field }) => {
    if (sortField !== field) return <span className="sort-icon inactive">↕</span>;
    return <span className="sort-icon active">{sortOrder === "asc" ? "↑" : "↓"}</span>;
  };

  if (isLoading) {
    return <div className="loading-state">Loading expenses...</div>;
  }

  return (
    <div className="expense-list-container">
      {/* Filter Bar */}
      <div className="filter-bar">
        <button
          className={`filter-chip ${filterCategory === "All" ? "active" : ""}`}
          onClick={() => setFilterCategory("All")}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            className={`filter-chip ${filterCategory === cat.label ? "active" : ""}`}
            style={filterCategory === cat.label ? { borderColor: cat.color, color: cat.color } : {}}
            onClick={() => setFilterCategory(cat.label)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Expense Count */}
      <p className="result-count">
        Showing <strong>{sorted.length}</strong> expense{sorted.length !== 1 ? "s" : ""}
      </p>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <p>No expenses found. Add your first one!</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="expense-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("date")} className="sortable">
                  Date <SortIndicator field="date" />
                </th>
                <th onClick={() => handleSort("category")} className="sortable">
                  Category <SortIndicator field="category" />
                </th>
                <th>Description</th>
                <th onClick={() => handleSort("amount")} className="sortable text-right">
                  Amount <SortIndicator field="amount" />
                </th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((expense) => (
                <tr key={expense._id} className="expense-row">
                  <td className="date-cell">{formatDate(expense.date)}</td>
                  <td>
                    <span
                      className="category-badge"
                      style={{
                        backgroundColor: CATEGORIES.find((c) => c.label === expense.category)?.color + "22",
                        color: CATEGORIES.find((c) => c.label === expense.category)?.color,
                        borderColor: CATEGORIES.find((c) => c.label === expense.category)?.color + "55",
                      }}
                    >
                      {expense.category}
                    </span>
                  </td>
                  <td className="description-cell">
                    {expense.description || <span className="muted">—</span>}
                  </td>
                  <td className="amount-cell">{formatCurrency(expense.amount)}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-edit"
                      onClick={() => onEdit(expense)}
                      title="Edit expense"
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => onDelete(expense._id)}
                      title="Delete expense"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
