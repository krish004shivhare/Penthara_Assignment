/**
 * Formats a number as a currency string (INR by default).
 * @param {number} amount - The numeric amount to format
 * @param {string} currency - ISO 4217 currency code (default: "INR")
 * @returns {string} Formatted currency string, e.g. "₹1,250.00"
 */
export const formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats a Date object or ISO string to a human-readable date.
 * @param {string|Date} dateInput - The date to format
 * @returns {string} Formatted date, e.g. "15 Jan 2025"
 */
export const formatDate = (dateInput) => {
  const date = new Date(dateInput);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/**
 * Converts a Date to YYYY-MM-DD string for HTML date input values.
 * @param {Date} date
 * @returns {string}
 */
export const toInputDateString = (date = new Date()) => {
  return date.toISOString().split("T")[0];
};

/**
 * All supported expense categories with associated display colors.
 * Used by form dropdowns, filter chips, chart legends, etc.
 */
export const CATEGORIES = [
  { label: "Food & Dining",  color: "#f59e0b" },
  { label: "Transport",      color: "#3b82f6" },
  { label: "Housing",        color: "#8b5cf6" },
  { label: "Healthcare",     color: "#ef4444" },
  { label: "Entertainment",  color: "#ec4899" },
  { label: "Shopping",       color: "#14b8a6" },
  { label: "Education",      color: "#6366f1" },
  { label: "Travel",         color: "#f97316" },
  { label: "Utilities",      color: "#64748b" },
  { label: "Other",          color: "#a3a3a3" },
];

/**
 * Returns the color associated with a given category label.
 * Falls back to a neutral gray if the category is unknown.
 * @param {string} categoryLabel
 * @returns {string} Hex color string
 */
export const getCategoryColor = (categoryLabel) => {
  const match = CATEGORIES.find((c) => c.label === categoryLabel);
  return match ? match.color : "#a3a3a3";
};
