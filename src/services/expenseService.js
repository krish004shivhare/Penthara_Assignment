import axios from "axios";

// Base URL for all expense API endpoints 
const BASE_URL = "/api/expenses";

/**
 * Fetches all expenses with optional filters.
 * @param {Object} filters - { category, startDate, endDate, sortBy, order }
 * @returns {Promise<Array>} Array of expense objects
 */

export const fetchExpenses = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.category && filters.category !== "All") params.append("category", filters.category);
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.order) params.append("order", filters.order);

  const { data } = await axios.get(`${BASE_URL}?${params.toString()}`);
  return data.data; // Unwrap the { success, count, data } envelope
};

/**
 * Fetches a single expense by its MongoDB ObjectId.
 * @param {string} id - The expense document ID
 * @returns {Promise<Object>} The expense object
 */
export const fetchExpenseById = async (id) => {
  const { data } = await axios.get(`${BASE_URL}/${id}`);
  return data.data;
};

/**
 * Creates a new expense record.
 * @param {Object} expenseData - { amount, category, description, date }
 * @returns {Promise<Object>} The newly created expense object
 */
export const createExpense = async (expenseData) => {
  const { data } = await axios.post(BASE_URL, expenseData);
  return data.data;
};

/**
 * Updates an existing expense by ID.
 * @param {string} id - The expense document ID
 * @param {Object} updatedData - Fields to update
 * @returns {Promise<Object>} The updated expense object
 */
export const updateExpense = async (id, updatedData) => {
  const { data } = await axios.put(`${BASE_URL}/${id}`, updatedData);
  return data.data;
};

/**
 * Deletes an expense by ID.
 * @param {string} id - The expense document ID
 * @returns {Promise<void>}
 */
export const deleteExpense = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};

/**
 * Fetches category-wise spending summary and grand total.
 * @param {Object} filters - { startDate, endDate }
 * @returns {Promise<Object>} { categories: [...], grandTotal: number }
 */
export const fetchExpenseSummary = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);

  const { data } = await axios.get(`${BASE_URL}/summary?${params.toString()}`);
  return data.data;
};
