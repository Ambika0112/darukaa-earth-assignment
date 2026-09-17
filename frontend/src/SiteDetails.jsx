import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function SiteDetails({ site, onBack }) {
  const analytics = [
    { year: "2023", carbon: 80, biodiversity: 45 },
    { year: "2024", carbon: 110, biodiversity: 55 },
    { year: "2025", carbon: 145, biodiversity: 68 },
    { year: "2026", carbon: 180, biodiversity: 76 },
  ];

  const chartData = useMemo(
    () => ({
      labels: analytics.map((item) => item.year),

      datasets: [
        {
          label: "Carbon Sequestration (tCO₂e)",
          data: analytics.map((item) => item.carbon),
          tension: 0.3,
        },
        {
          label: "Biodiversity Index (%)",
          data: analytics.map((item) => item.biodiversity),
          tension: 0.3,
        },
      ],
    }),
    []
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: false,

      plugins: {
        legend: {
          display: true,
        },
      },

      scales: {
        y: {
          beginAtZero: true,
        },
      },
    }),
    []
  );

  return (
    <div className="site-details">

      <button onClick={onBack}>
        ← Back to Project
      </button>

      <h2>{site.name}</h2>

      <p>{site.description}</p>

      <div className="analytics-cards">

        <div className="analytics-card">
          <span>Site Area</span>
          <strong>{site.area_hectares} ha</strong>
        </div>

        <div className="analytics-card">
          <span>Carbon Sequestered</span>
          <strong>180 tCO₂e</strong>
        </div>

        <div className="analytics-card">
          <span>Biodiversity Index</span>
          <strong>76%</strong>
        </div>

      </div>

      <div className="chart-container">

        <h3>Environmental Performance</h3>

        <div className="chart-wrapper">
          <Line
            data={chartData}
            options={chartOptions}
          />
        </div>

      </div>

    </div>
  );
}

export default SiteDetails;