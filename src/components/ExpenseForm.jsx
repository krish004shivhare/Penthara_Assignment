import React, { useState, useEffect } from "react";
import { CATEGORIES, toInputDateString } from "../utils/addExpense";

/**
 * ExpenseForm Component
 * Renders a form to add a new expense or edit an existing one.
 *
 * @param {Object}   props
 * @param {Function} props.onSubmit     - Callback with form data when submitted
 * @param {Object}   [props.editData]   - Expense data to pre-populate when editing
 * @param {Function} props.onCancel     - Callback to cancel edit mode
 * @param {boolean}  props.isSubmitting - Disables the button while awaiting API response
 */
const ExpenseForm = ({ onSubmit, editData = null, onCancel, isSubmitting }) => {
  const initialState = {
    amount: "",
    category: "",
    description: "",
    date: toInputDateString(),
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  // Pre-populate form fields when entering edit mode
  useEffect(() => {
    if (editData) {
      setFormData({
        amount: editData.amount,
        category: editData.category,
        description: editData.description || "",
        date: toInputDateString(new Date(editData.date)),
      });
    } else {
      setFormData(initialState);
    }
  }, [editData]);

  /**
   * Validates required fields and amount constraints.
   * @returns {boolean} True if all fields are valid
   */
  const validate = () => {
    const newErrors = {};
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = "Enter a valid amount greater than 0";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    if (!formData.date) {
      newErrors.date = "Please select a date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles input change events, clearing field-specific errors on change.
   * @param {React.ChangeEvent} e
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /**
   * Handles form submission after validation.
   * @param {React.FormEvent} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
    });

    if (!editData) setFormData(initialState); // Reset only on "Add" mode
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit} noValidate>
      <h2 className="form-title">{editData ? "Edit Expense" : "Add Expense"}</h2>

      <div className="form-group">
        <label htmlFor="amount">Amount (₹)</label>
        <input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          value={formData.amount}
          onChange={handleChange}
          className={errors.amount ? "input-error" : ""}
        />
        {errors.amount && <span className="error-msg">{errors.amount}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={errors.category ? "input-error" : ""}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.label} value={cat.label}>
              {cat.label}
            </option>
          ))}
        </select>
        {errors.category && <span className="error-msg">{errors.category}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          className={errors.date ? "input-error" : ""}
        />
        {errors.date && <span className="error-msg">{errors.date}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description (optional)</label>
        <input
          id="description"
          name="description"
          type="text"
          placeholder="What was this for?"
          maxLength={200}
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : editData ? "Update Expense" : "Add Expense"}
        </button>
        {editData && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ExpenseForm;
