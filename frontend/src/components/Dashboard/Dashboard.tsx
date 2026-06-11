import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ========== Type Definitions ==========
interface Scan {
  type: "email" | "url";
  input: string;
  risk_level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  confidence?: number;
  is_spam?: boolean;
  is_malicious?: boolean;
  created_at?: string;
  reasons?: string[];
}

interface DashboardStats {
  total_scans: number;
  email_scans: number;
  url_scans: number;
  threats_detected: number;
  detection_rate: number;
  recent_scans: Scan[];
  daily_scan_trend: Array<{
    date: string;
    count: number;
    threats: number;
  }>;
  risk_distribution: Array<{
    level: string;
    count: number;
    color: string;
  }>;
  type_distribution: Array<{
    type: string;
    count: number;
  }>;
  avg_confidence_by_risk: Array<{
    risk_level: string;
    avg_confidence: number;
  }>;
}

// Colors for different risk levels
const RISK_COLORS = {
  CRITICAL: "#ff0000",
  HIGH: "#ff4d4d",
  MEDIUM: "#ffaa00",
  LOW: "#00ff66",
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<7 | 14 | 30>(7);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null);
        const response = await axios.get<DashboardStats>(
          `http://127.0.0.1:8000/dashboard/stats?days=${timeRange}`
        );
        setStats(response.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  const getRiskColor = (riskLevel: string): string => {
    return RISK_COLORS[riskLevel as keyof typeof RISK_COLORS] || "#9ca3af";
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          color: "white",
          background: "#0a0a0a",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid #00ff66",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: "1rem",
            }}
          />
          <p>Loading SentinelForge Dashboard...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          color: "white",
          background: "#0a0a0a",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            border: "1px solid #ff0000",
            borderRadius: "12px",
            background: "#1a1a1a",
          }}
        >
          <span style={{ fontSize: "3rem" }}>⚠️</span>
          <h2 style={{ color: "#ff0000", marginTop: "1rem" }}>Error</h2>
          <p style={{ color: "#9ca3af" }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1.5rem",
              background: "#00ff66",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "4rem 8%",
        color: "white",
        background: "linear-gradient(135deg, #0a0a0a 0%, #0f0f0f 100%)",
      }}
    >
      {/* Header with Time Range Selector */}
      <div
        style={{
          marginBottom: "3rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <span
            style={{
              color: "#00ff66",
              fontWeight: 600,
              letterSpacing: "2px",
            }}
          >
            SENTINELFORGE AI
          </span>
          <h1
            style={{
              fontSize: "3rem",
              marginTop: "0.5rem",
              background: "linear-gradient(135deg, #fff 0%, #00ff66 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Threat Dashboard
          </h1>
          <p style={{ color: "#9ca3af", maxWidth: "700px" }}>
            Real-time security intelligence & threat detection powered by
            advanced AI
          </p>
        </div>

        {/* Time Range Buttons */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            background: "#1a1a1a",
            padding: "0.5rem",
            borderRadius: "12px",
          }}
        >
          {[7, 14, 30].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days as 7 | 14 | 30)}
              style={{
                padding: "0.5rem 1.5rem",
                background: timeRange === days ? "#00ff66" : "transparent",
                color: timeRange === days ? "#000" : "#9ca3af",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "all 0.3s",
              }}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem",
        }}
      >
        {[
          {
            title: "Total Scans",
            value: stats.total_scans,
            color: "#00ff66",
            icon: "🔍",
          },
          {
            title: "Emails Scanned",
            value: stats.email_scans,
            color: "#00ff66",
            icon: "📧",
          },
          {
            title: "URLs Scanned",
            value: stats.url_scans,
            color: "#00ff66",
            icon: "🔗",
          },
          {
            title: "Threats Detected",
            value: stats.threats_detected,
            color: "#ff4d4d",
            icon: "⚠️",
          },
          {
            title: "Detection Rate",
            value: `${stats.detection_rate}%`,
            color: "#ffaa00",
            icon: "🎯",
          },
        ].map((item) => (
          <div
            key={item.title}
            style={{
              padding: "1.5rem",
              borderRadius: "20px",
              background: "#0b0b0b",
              border: `1px solid ${item.color}20`,
              transition: "transform 0.2s",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p style={{ color: "#9ca3af" }}>{item.title}</p>
              <span style={{ fontSize: "1.5rem" }}>{item.icon}</span>
            </div>
            <h2
              style={{
                color: item.color,
                marginTop: "1rem",
                fontSize: "2rem",
              }}
            >
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* GRAPHS SECTION */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
          gap: "2rem",
          marginBottom: "3rem",
        }}
      >
        {/* LINE CHART - Daily Scan Trend */}
        <div
          style={{
            border: "1px solid #222",
            borderRadius: "20px",
            padding: "1.5rem",
            background: "#0b0b0b",
          }}
        >
          <h3 style={{ marginBottom: "1rem", color: "#00ff66" }}>
            📈 Daily Scan Activity
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.daily_scan_trend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ background: "#1a1a1a", border: "1px solid #333" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#00ff66"
                strokeWidth={2}
                name="Total Scans"
                dot={{ fill: "#00ff66" }}
              />
              <Line
                type="monotone"
                dataKey="threats"
                stroke="#ff4d4d"
                strokeWidth={2}
                name="Threats"
                dot={{ fill: "#ff4d4d" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART - Risk Distribution */}
        <div
          style={{
            border: "1px solid #222",
            borderRadius: "20px",
            padding: "1.5rem",
            background: "#0b0b0b",
          }}
        >
          <h3 style={{ marginBottom: "1rem", color: "#00ff66" }}>
            🥧 Threat Risk Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.risk_distribution || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                outerRadius={100}
                dataKey="count"
                nameKey="level"
              >
                {(stats.risk_distribution || []).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getRiskColor(entry.level)}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#1a1a1a", border: "1px solid #333" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART - Type Distribution */}
        <div
          style={{
            border: "1px solid #222",
            borderRadius: "20px",
            padding: "1.5rem",
            background: "#0b0b0b",
          }}
        >
          <h3 style={{ marginBottom: "1rem", color: "#00ff66" }}>
            📊 Scan Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.type_distribution || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="type" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ background: "#1a1a1a", border: "1px solid #333" }}
              />
              <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                {(stats.type_distribution || []).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.type === "email" ? "#00ff66" : "#ffaa00"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART - Confidence by Risk Level */}
        <div
          style={{
            border: "1px solid #222",
            borderRadius: "20px",
            padding: "1.5rem",
            background: "#0b0b0b",
          }}
        >
          <h3 style={{ marginBottom: "1rem", color: "#00ff66" }}>
            🎯 AI Confidence by Risk Level
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={stats.avg_confidence_by_risk || []}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" domain={[0, 100]} stroke="#9ca3af" />
              <YAxis type="category" dataKey="risk_level" stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ background: "#1a1a1a", border: "1px solid #333" }}
                formatter={(value) => [
                  `${Number(value ?? 0).toFixed(1)}%`,
                  "Confidence",
                ]}
              />
              <Bar dataKey="avg_confidence" radius={[0, 10, 10, 0]}>
                {(stats.avg_confidence_by_risk || []).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getRiskColor(entry.risk_level)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Scans Table */}
      <div
        style={{
          border: "1px solid #222",
          borderRadius: "20px",
          padding: "2rem",
          background: "#0b0b0b",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2>🛡️ Recent Scans</h2>
          <span style={{ color: "#00ff66", fontSize: "0.875rem" }}>
            Last 10 scans
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid #222", color: "#9ca3af" }}>
                <th align="left" style={{ padding: "12px 0" }}>Type</th>
                <th align="left" style={{ padding: "12px 0" }}>Input</th>
                <th align="left" style={{ padding: "12px 0" }}>Risk Level</th>
                <th align="left" style={{ padding: "12px 0" }}>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_scans?.map((scan, index) => (
                <tr
                  key={index}
                  style={{ borderBottom: "1px solid #222" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#1a1a1a";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <td style={{ padding: "12px 0" }}>
                    <span
                      style={{
                        background: scan.type === "email" ? "rgba(0,255,102,0.1)" : "rgba(255,170,0,0.1)",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      }}
                    >
                      {scan.type.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ maxWidth: "400px", wordBreak: "break-word" }}>
                    {scan.input.length > 60 ? scan.input.slice(0, 60) + "..." : scan.input}
                  </td>
                  <td style={{ color: getRiskColor(scan.risk_level), fontWeight: "bold" }}>
                    {scan.risk_level || "UNKNOWN"}
                  </td>
                  <td>
                    <div
                      style={{
                        background: "#1a1a1a",
                        borderRadius: "10px",
                        overflow: "hidden",
                        width: "80px",
                      }}
                    >
                      <div
                        style={{
                          width: `${scan.confidence || 0}%`,
                          background: getRiskColor(scan.risk_level),
                          padding: "4px 0",
                          textAlign: "center",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                        }}
                      >
                        {scan.confidence || 0}%
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insights */}
      <div
        style={{
          border: "1px solid rgba(0,255,102,0.3)",
          borderRadius: "20px",
          padding: "2rem",
          background: "#0b0b0b",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <span style={{ fontSize: "1.5rem" }}>🤖</span>
          <h2 style={{ color: "#00ff66" }}>AI Intelligence Report</h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          <div style={{ padding: "1rem", background: "#1a1a1a", borderRadius: "12px" }}>
            <strong>Scan Efficiency</strong>
            <p style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>
              {stats.detection_rate}%
            </p>
            <small>Detection accuracy</small>
          </div>
          <div style={{ padding: "1rem", background: "#1a1a1a", borderRadius: "12px" }}>
            <strong>Total Threats</strong>
            <p style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>
              {stats.threats_detected}
            </p>
            <small>Security incidents</small>
          </div>
          <div style={{ padding: "1rem", background: "#1a1a1a", borderRadius: "12px" }}>
            <strong>Risk Score</strong>
            <p style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>
              {(stats.threats_detected / stats.total_scans * 100).toFixed(1)}%
            </p>
            <small>Threat ratio</small>
          </div>
        </div>
      </div>
    </main>
  );
}