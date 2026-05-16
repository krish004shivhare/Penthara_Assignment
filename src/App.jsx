import React, { useState, useEffect, useCallback } from "react";
import ExpenseForm    from "./components/ExpenseForm";
import ExpenseList    from "./components/ExpenseList";
import ExpenseSummary from "./components/ExpenseSummary";
import ChartComponent from "./components/ChartComponent";
import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  fetchExpenseSummary,
} from "./services/expenseService";
import "./assets/styles.css";

/*
 * App — Root component
 * Manages global state: expenses list, summary data, edit mode, active tab.
 * All API calls are orchestrated here and passed down as props.
 */
const App = () => {
  // State
  const [expenses,     setExpenses]     = useState([]);
  const [summary,      setSummary]      = useState({ categories: [], grandTotal: 0 });
  const [editTarget,   setEditTarget]   = useState(null);   // Expense being edited, or null
  const [activeTab,    setActiveTab]    = useState("list"); // "list" | "summary" | "chart"
  const [isLoading,    setIsLoading]    = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error,        setError]        = useState("");
  const [successMsg,   setSuccessMsg]   = useState("");

  // Data Fetching 

  /*
   * Loads expenses and summary data from the API in parallel.
   */
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [expenseData, summaryData] = await Promise.all([
        fetchExpenses({ sortBy: "date", order: "desc" }),
        fetchExpenseSummary(),
      ]);
      setExpenses(expenseData);
      setSummary(summaryData);
    } catch (err) {
      setError("Failed to load data. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data on initial mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Toast Helpers 

  /*
   * Shows a temporary success toast message for 3 seconds.
   * @param {string} msg
   */
  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Event Handlers 
  /*
   * Handles form submission for both create and update.
   * @param {Object} formData - Validated expense data from ExpenseForm
   */
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setError("");
    try {
      if (editTarget) {
        await updateExpense(editTarget._id, formData);
        showSuccess("Expense updated successfully!");
        setEditTarget(null);
      } else {
        await createExpense(formData);
        showSuccess("Expense added successfully!");
      }
      await loadData(); // Refresh list and summary
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save expense.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Deletes an expense after a confirmation prompt.
   * @param {string} id - MongoDB ObjectId of the expense to delete
   */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense? This cannot be undone.")) return;
    setError("");
    try {
      await deleteExpense(id);
      showSuccess("Expense deleted.");
      await loadData();
    } catch (err) {
      setError("Failed to delete expense.");
    }
  };

  /**
   * Enters edit mode for the given expense.
   * @param {Object} expense - The expense to edit
   */
  const handleEdit = (expense) => {
    setEditTarget(expense);
    // Scroll to the form for better UX on mobile
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /** Cancels edit mode without saving. */
  const handleCancelEdit = () => setEditTarget(null);

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="brand-name">Expense Tracker</span>
          </div>
          <p className="brand-tagline">Your personal spending ledger</p>
        </div>
      </header>

      <main className="app-main">
        {error      && <div className="toast toast-error">{error}</div>}
        {successMsg && <div className="toast toast-success">{successMsg}</div>}

        <div className="layout-grid">
          <aside className="form-column">
            <ExpenseForm
              onSubmit={handleFormSubmit}
              editData={editTarget}
              onCancel={handleCancelEdit}
              isSubmitting={isSubmitting}
            />
          </aside>

          <section className="content-column">
            {/* Tab Navigation */}
            <nav className="tab-nav">
              {["list", "summary", "chart"].map((tab) => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "list"    && "Expenses"}
                  {tab === "summary" && "Summary"}
                  {tab === "chart"   && "Chart"}
                </button>
              ))}
            </nav>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === "list" && (
                <ExpenseList
                  expenses={expenses}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  isLoading={isLoading}
                />
              )}
              {activeTab === "summary" && (
                <ExpenseSummary
                  summary={summary.categories}
                  grandTotal={summary.grandTotal}
                  isLoading={isLoading}
                />
              )}
              {activeTab === "chart" && (
                <ChartComponent data={summary.categories} />
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
