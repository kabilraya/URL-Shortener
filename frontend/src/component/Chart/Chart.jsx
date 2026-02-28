import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler, // 1. Add Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
);

export default function Chart({ chartData }) {
  if (!chartData || !chartData.labels || !chartData.values) {
    return (
      <p style={{ color: "white" }}>
        No data points available for this period.
      </p>
    );
  }

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Clicks",
        data: chartData.values,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#3b82f6",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grace: "10%",
        ticks: { color: "#94a3b8", precision: 0, stepSize: 1 },
        grid: { color: "rgba(255, 255, 255, 0.05)" },
      },
      x: {
        ticks: { color: "#94a3b8" },
        grid: { display: false },
      },
    },
  };

  return (
    <div
      className="chart-container"
      style={{
        padding: "20px",
        background: "#0f172a",
        borderRadius: "12px",
        height: "350px", // 4. Set a fixed height
        width: "100%",
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
}
