import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { formatCurrency, getCategoryColor } from "../utils/addExpense";

/**
 * Custom tooltip for both chart types.
 * @param {Object} props - Injected by Recharts
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{name || payload[0].payload.category}</p>
        <p className="tooltip-value">{formatCurrency(value)}</p>
      </div>
    );
  }
  return null;
};

/**
 * ChartComponent
 * Renders a Pie (donut) chart or Bar chart of expenses by category.
 * Users can toggle between chart types.
 *
 * @param {Object} props
 * @param {Array}  props.data - Array of { category, total } from the summary API
 */
const ChartComponent = ({ data }) => {
  const [chartType, setChartType] = useState("pie"); // "pie" | "bar"

  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <p>No chart data available. Add expenses to visualize.</p>
      </div>
    );
  }

  // Recharts expects { name, value } for PieChart
  const chartData = data.map((item) => ({
    name: item.category,
    value: item.total,
    color: getCategoryColor(item.category),
  }));

  return (
    <div className="chart-container">
      {/* Chart Type Toggle */}
      <div className="chart-toggle">
        <button
          className={`toggle-btn ${chartType === "pie" ? "active" : ""}`}
          onClick={() => setChartType("pie")}
        >
          Donut
        </button>
        <button
          className={`toggle-btn ${chartType === "bar" ? "active" : ""}`}
          onClick={() => setChartType("bar")}
        >
          Bar
        </button>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        {chartType === "pie" ? (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={75}  
              outerRadius={120}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ color: "#cbd5e1", fontSize: "0.8rem" }}>{value}</span>
              )}
            />
          </PieChart>
        ) : (
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;
