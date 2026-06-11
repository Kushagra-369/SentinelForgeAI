import { useEffect, useState } from "react";
import axios from "axios";

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
  // Optional fields for enhanced version
  daily_scan_trend?: Array<{
    date: string;
    count: number;
    threats: number;
  }>;
  risk_distribution?: Array<{
    level: string;
    count: number;
    color: string;
  }>;
  type_distribution?: Array<{
    type: string;
    count: number;
  }>;
  avg_confidence_by_risk?: Array<{
    risk_level: string;
    avg_confidence: number;
  }>;
}

// ========== Component ==========
export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null);
        const response = await axios.get<DashboardStats>(
          "http://127.0.0.1:8000/dashboard/stats"
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
  }, []);

  // Helper function to get risk level color
  const getRiskColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case "CRITICAL":
        return "#ff0000";
      case "HIGH":
        return "#ff4d4d";
      case "MEDIUM":
        return "#ffaa00";
      case "LOW":
        return "#00ff66";
      default:
        return "#9ca3af";
    }
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
        padding: "8rem 8%",
        color: "white",
        background: "linear-gradient(135deg, #0a0a0a 0%, #0f0f0f 100%)",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: "3rem",
        }}
      >
        <span
          style={{
            color: "#00ff66",
            fontWeight: 600,
            letterSpacing: "2px",
          }}
        >
          SECURITY OVERVIEW
        </span>

        <h1
          style={{
            fontSize: "3.5rem",
            marginTop: "1rem",
            background: "linear-gradient(135deg, #fff 0%, #00ff66 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Threat Dashboard
        </h1>

        <p
          style={{
            color: "#9ca3af",
            maxWidth: "700px",
          }}
        >
          Monitor scans, threat levels, and security intelligence generated by
          SentinelForge AI.
        </p>
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
            title: "Emails Scanned",
            value: stats.email_scans ?? 0,
            color: "#00ff66",
            icon: "📧",
          },
          {
            title: "URLs Scanned",
            value: stats.url_scans ?? 0,
            color: "#00ff66",
            icon: "🔗",
          },
          {
            title: "Threats Detected",
            value: stats.threats_detected ?? 0,
            color: "#ff4d4d",
            icon: "⚠️",
          },
          {
            title: "Detection Rate",
            value: `${stats.detection_rate ?? 0}%`,
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
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  color: "#9ca3af",
                }}
              >
                {item.title}
              </p>
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
          <h2>Recent Scans</h2>
          <span style={{ color: "#00ff66", fontSize: "0.875rem" }}>
            Last 10 scans
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              marginTop: "0.5rem",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "2px solid #222",
                  color: "#9ca3af",
                }}
              >
                <th align="left" style={{ padding: "12px 0" }}>
                  Type
                </th>
                <th align="left" style={{ padding: "12px 0" }}>
                  Input
                </th>
                <th align="left" style={{ padding: "12px 0" }}>
                  Risk Level
                </th>
                {stats.recent_scans?.[0]?.confidence && (
                  <th align="left" style={{ padding: "12px 0" }}>
                    Confidence
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {stats.recent_scans && stats.recent_scans.length > 0 ? (
                stats.recent_scans.map((scan: Scan, index: number) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: "1px solid #222",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#1a1a1a";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 0",
                      }}
                    >
                      <span
                        style={{
                          background:
                            scan.type === "email"
                              ? "rgba(0,255,102,0.1)"
                              : "rgba(255,170,0,0.1)",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                        }}
                      >
                        {scan.type.toUpperCase()}
                      </span>
                    </td>

                    <td
                      style={{
                        maxWidth: "400px",
                        overflow: "hidden",
                        wordBreak: "break-word",
                      }}
                    >
                      {scan.input.length > 60
                        ? scan.input.slice(0, 60) + "..."
                        : scan.input}
                    </td>

                    <td
                      style={{
                        color: getRiskColor(scan.risk_level),
                        fontWeight: "bold",
                      }}
                    >
                      {scan.risk_level || "UNKNOWN"}
                    </td>

                    {scan.confidence && (
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
                              width: `${scan.confidence}%`,
                              background: getRiskColor(scan.risk_level),
                              padding: "4px 0",
                              textAlign: "center",
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                              color: "#fff",
                            }}
                          >
                            {scan.confidence}%
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "2rem" }}>
                    No scans found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insights */}
      <div
        style={{
          border: "1px solid rgba(0,255,102,0.2)",
          borderRadius: "20px",
          padding: "2rem",
          background: "#0b0b0b",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>🤖</span>
          <h2
            style={{
              color: "#00ff66",
            }}
          >
            AI Insights
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <div
            style={{
              padding: "1rem",
              background: "#1a1a1a",
              borderRadius: "12px",
            }}
          >
            <strong style={{ color: "#00ff66" }}>Total Scans</strong>
            <p style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>
              {stats.total_scans ?? 0}
            </p>
          </div>

          <div
            style={{
              padding: "1rem",
              background: "#1a1a1a",
              borderRadius: "12px",
            }}
          >
            <strong style={{ color: "#ff4d4d" }}>Threats Detected</strong>
            <p style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>
              {stats.threats_detected ?? 0}
            </p>
          </div>

          <div
            style={{
              padding: "1rem",
              background: "#1a1a1a",
              borderRadius: "12px",
            }}
          >
            <strong style={{ color: "#ffaa00" }}>Detection Rate</strong>
            <p style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>
              {stats.detection_rate ?? 0}%
            </p>
          </div>
        </div>

        {/* Alert if high threat level */}
        {stats.threats_detected > 0 && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              background: "rgba(255,0,0,0.1)",
              borderRadius: "12px",
              border: "1px solid rgba(255,0,0,0.3)",
            }}
          >
            <p style={{ color: "#ff4d4d", fontSize: "0.875rem" }}>
              ⚠️ {stats.threats_detected} threat(s) detected. Please review
              recent scans for suspicious activity.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}