import React, { useState, useEffect } from "react";
import axios from "axios";
// 1. FIXED IMPORTS: Make sure these paths are correct for your project structure
import UrlTable from "../../component/UrlTable/UrlTable";
import Chart from "../../component/Chart/Chart";
import "./Dashboard.scss";

export default function Dashboard() {
  const [urlData, setUrlData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [activeAlias, setActiveAlias] = useState(null);
  const [isChartLoading, setIsChartLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/dashboard");
        setUrlData(response.data);
      } catch (err) {
        setError("Could not retrieve URL data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const fetchAnalytics = async (alias) => {
    setIsChartLoading(true);
    setActiveAlias(alias);
    try {
      const res = await axios.get(
        `http://localhost:8000/api/analytics/${alias}`,
      );
      setChartData(res.data);
    } catch (err) {
      console.error("Error fetching analytics", err);
    } finally {
      setIsChartLoading(false);
    }
  };

  const handleManualIncrement = (id) => {
    setUrlData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, click_count: item.click_count + 1 } : item,
      ),
    );
  };

  return (
    <div className="Dashboard">
      <div className="dashboard-header">
        <h1>Performance Analytics</h1>
        <p>Real-time tracking of your short link network engagement.</p>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div className="content-container">
        <section className="table-section">
          {isLoading ? (
            <p>Loading URL data...</p>
          ) : (
            <UrlTable
              urls={urlData}
              onAliasClick={handleManualIncrement}
              onAnalyticsClick={fetchAnalytics}
            />
          )}
        </section>

        {activeAlias && (
          <section className="analytics-section">
            <div className="chart-card">
              <div className="chart-header">
                <h3>Clicks for: {activeAlias}</h3>
                <button
                  className="refresh-btn"
                  onClick={() => fetchAnalytics(activeAlias)}
                  disabled={isChartLoading}
                >
                  {isChartLoading ? "Refreshing..." : "Refresh Chart"}
                </button>
              </div>

              {chartData ? (
                <Chart key={activeAlias} chartData={chartData} />
              ) : (
                <p>Loading chart...</p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
