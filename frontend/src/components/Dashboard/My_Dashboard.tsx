import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../GlobalAPIURL";
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
    type: "email" | "url" | "file";
    input?: string;
    filename?: string;
    risk_level: string;
    confidence?: number;
    created_at?: string;
    reasons?: string[];
}

interface DashboardStats {
    success: boolean;
    email_scans: number;
    url_scans: number;
    file_scans: number;
    threats_detected: number;
    history: Scan[];
    // Computed fields for charts
    total_scans: number;
    detection_rate: number;
    daily_scan_trend: { date: string; count: number; threats: number }[];
    risk_distribution: { level: string; count: number }[];
    type_distribution: { type: string; count: number }[];
    avg_confidence_by_risk: { risk_level: string; avg_confidence: number }[];
    recent_scans: Scan[];
}

// Colors
const RISK_COLORS: Record<string, string> = {
    CRITICAL: "#ff0000",
    HIGH: "#ff4d4d",
    MEDIUM: "#ffaa00",
    LOW: "#00ff66",
    SAFE: "#00cc44",
    UNKNOWN: "#9ca3af",
};

const TYPE_COLORS: Record<string, string> = {
    email: "#00ff66",
    url: "#ffaa00",
    file: "#4a90e2",
};

export default function My_Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState<7 | 14 | 30>(7);

    // Process raw data from backend
    const processDashboardData = (rawData: any): DashboardStats => {
        const history = rawData.history || [];

        // Calculate total scans
        const total_scans = history.length;

        // Calculate detection rate (threats / total scans * 100)
        const detection_rate = total_scans > 0
            ? Math.round((rawData.threats_detected / total_scans) * 100)
            : 0;

        // Calculate daily scan trend (last 7, 14, or 30 days)
        const dailyData = new Map<string, { count: number; threats: number }>();
        const now = new Date();
        const daysToShow = timeRange;

        // Initialize all days with 0
        for (let i = daysToShow - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            dailyData.set(dateStr, { count: 0, threats: 0 });
        }

        // Fill with actual data
        history.forEach((scan: Scan) => {
            if (scan.created_at) {
                const dateStr = new Date(scan.created_at).toISOString().split('T')[0];
                if (dailyData.has(dateStr)) {
                    const data = dailyData.get(dateStr)!;
                    data.count += 1;
                    if (scan.risk_level === "HIGH" || scan.risk_level === "CRITICAL") {
                        data.threats += 1;
                    }
                }
            }
        });

        const daily_scan_trend = Array.from(dailyData.entries())
            .map(([date, data]) => ({
                date,
                count: data.count,
                threats: data.threats,
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // Calculate risk distribution
        const riskMap = new Map<string, number>();
        history.forEach((scan: Scan) => {
            const risk = scan.risk_level || "UNKNOWN";
            riskMap.set(risk, (riskMap.get(risk) || 0) + 1);
        });
        const risk_distribution = Array.from(riskMap.entries())
            .map(([level, count]) => ({ level, count }))
            .sort((a, b) => b.count - a.count);

        // Calculate type distribution
        const typeMap = new Map<string, number>();
        history.forEach((scan: Scan) => {
            const type = scan.type || "unknown";
            typeMap.set(type, (typeMap.get(type) || 0) + 1);
        });
        const type_distribution = Array.from(typeMap.entries())
            .map(([type, count]) => ({ type, count }));

        // Calculate average confidence by risk level
        const confidenceMap = new Map<string, { total: number; count: number }>();
        history.forEach((scan: Scan) => {
            if (scan.confidence !== undefined && scan.confidence !== null) {
                const risk = scan.risk_level || "UNKNOWN";
                if (!confidenceMap.has(risk)) {
                    confidenceMap.set(risk, { total: 0, count: 0 });
                }
                const data = confidenceMap.get(risk)!;
                data.total += scan.confidence;
                data.count += 1;
            }
        });
        const avg_confidence_by_risk = Array.from(confidenceMap.entries())
            .map(([risk_level, data]) => ({
                risk_level,
                avg_confidence: Math.round((data.total / data.count) * 100) / 100,
            }))
            .sort((a, b) => b.avg_confidence - a.avg_confidence);

        // Get recent scans (last 10)
        const recent_scans = history.slice(0, 10);

        return {
            ...rawData,
            total_scans,
            detection_rate,
            daily_scan_trend,
            risk_distribution,
            type_distribution,
            avg_confidence_by_risk,
            recent_scans,
        };
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setError(null);
                const user = JSON.parse(
                    localStorage.getItem("user") || "null"
                );

                if (!user) {
                    setLoading(false);
                    return;
                }

                const response = await axios.get<DashboardStats>(
                    `${API_URL}/dashboard/user-history/${user.email}`
                );

                // Process the data to add computed fields
                const processedData = processDashboardData(response.data);
                setStats(processedData);
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
        return RISK_COLORS[riskLevel] || RISK_COLORS.UNKNOWN;
    };

    const getTypeColor = (type: string): string => {
        return TYPE_COLORS[type] || "#9ca3af";
    };

    const getDisplayText = (scan: Scan): string => {
        if (scan.type === "file") {
            return scan.filename || "Unknown file";
        }
        return scan.input || "N/A";
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
                    <p>Loading Your Dashboard...</p>
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
            {/* Header */}
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
                        Your Security Dashboard
                    </h1>
                    <p style={{ color: "#9ca3af", maxWidth: "700px" }}>
                        Your personal security intelligence & threat detection overview
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
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1.5rem",
                    marginBottom: "3rem",
                }}
            >
                {[
                    { title: "Total Scans", value: stats.total_scans, color: "#00ff66", icon: "🔍" },
                    { title: "Emails", value: stats.email_scans, color: "#00ff66", icon: "📧" },
                    { title: "URLs", value: stats.url_scans, color: "#ffaa00", icon: "🔗" },
                    { title: "Files", value: stats.file_scans, color: "#4a90e2", icon: "📄" },
                    { title: "Threats Found", value: stats.threats_detected, color: "#ff4d4d", icon: "⚠️" },
                    { title: "Detection Rate", value: `${stats.detection_rate}%`, color: "#ffaa00", icon: "🎯" },
                ].map((item) => (
                    <div
                        key={item.title}
                        style={{
                            padding: "1.5rem",
                            borderRadius: "20px",
                            background: "#0b0b0b",
                            border: `1px solid ${item.color}20`,
                            transition: "transform 0.2s",
                            cursor: "default",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <p style={{ color: "#9ca3af", margin: 0 }}>{item.title}</p>
                            <span style={{ fontSize: "1.5rem" }}>{item.icon}</span>
                        </div>
                        <h2 style={{ color: item.color, marginTop: "1rem", fontSize: "2rem" }}>
                            {item.value}
                        </h2>
                    </div>
                ))}
            </div>

            {/* GRAPHS SECTION */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
                    gap: "2rem",
                    marginBottom: "3rem",
                }}
            >
                {/* Line Chart - Daily Activity */}
                <div style={{ border: "1px solid #222", borderRadius: "20px", padding: "1.5rem", background: "#0b0b0b" }}>
                    <h3 style={{ marginBottom: "1rem", color: "#00ff66" }}>📈 Daily Scan Activity</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={stats.daily_scan_trend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="date" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #333" }} />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#00ff66" strokeWidth={2} name="Total Scans" />
                            <Line type="monotone" dataKey="threats" stroke="#ff4d4d" strokeWidth={2} name="Threats" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart - Risk Distribution */}
                <div style={{ border: "1px solid #222", borderRadius: "20px", padding: "1.5rem", background: "#0b0b0b" }}>
                    <h3 style={{ marginBottom: "1rem", color: "#00ff66" }}>🥧 Threat Risk Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={stats.risk_distribution}
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
                                {stats.risk_distribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getRiskColor(entry.level)} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #333" }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart - Type Distribution */}
                <div style={{ border: "1px solid #222", borderRadius: "20px", padding: "1.5rem", background: "#0b0b0b" }}>
                    <h3 style={{ marginBottom: "1rem", color: "#00ff66" }}>📊 Scan Type Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.type_distribution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="type" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #333" }} />
                            <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                                {stats.type_distribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getTypeColor(entry.type)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Confidence by Risk Level */}
                <div style={{ border: "1px solid #222", borderRadius: "20px", padding: "1.5rem", background: "#0b0b0b" }}>
                    <h3 style={{ marginBottom: "1rem", color: "#00ff66" }}>🎯 AI Confidence by Risk Level</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.avg_confidence_by_risk} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis type="number" domain={[0, 100]} stroke="#9ca3af" />
                            <YAxis type="category" dataKey="risk_level" stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{ background: "#1a1a1a", border: "1px solid #333" }}
                                formatter={(value) => [`${Number(value ?? 0).toFixed(1)}%`, "Confidence"]}
                            />
                            <Bar dataKey="avg_confidence" radius={[0, 10, 10, 0]}>
                                {stats.avg_confidence_by_risk.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getRiskColor(entry.risk_level)} />
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h2>🛡️ Recent Scans</h2>
                    <span style={{ color: "#00ff66", fontSize: "0.875rem" }}>Last {Math.min(10, stats.recent_scans.length)} scans</span>
                </div>

                {stats.recent_scans.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "3rem", color: "#9ca3af" }}>
                        <span style={{ fontSize: "3rem" }}>🔍</span>
                        <p style={{ marginTop: "1rem" }}>No scans found yet. Start scanning to see your history!</p>
                    </div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "2px solid #222", color: "#9ca3af" }}>
                                    <th align="left" style={{ padding: "12px 0" }}>Type</th>
                                    <th align="left" style={{ padding: "12px 0" }}>Input / File</th>
                                    <th align="left" style={{ padding: "12px 0" }}>Risk Level</th>
                                    <th align="left" style={{ padding: "12px 0" }}>Confidence</th>
                                    <th align="left" style={{ padding: "12px 0" }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recent_scans.map((scan, index) => (
                                    <tr
                                        key={index}
                                        style={{ borderBottom: "1px solid #222", cursor: "pointer" }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = "#1a1a1a"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                                    >
                                        <td style={{ padding: "12px 0" }}>
                                            <span
                                                style={{
                                                    background: scan.type === "email" ? "rgba(0,255,102,0.1)" :
                                                        scan.type === "file" ? "rgba(74,144,226,0.1)" :
                                                            "rgba(255,170,0,0.1)",
                                                    padding: "4px 8px",
                                                    borderRadius: "6px",
                                                    fontSize: "0.75rem",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {scan.type.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ maxWidth: "300px", wordBreak: "break-word" }}>
                                            {getDisplayText(scan)}
                                        </td>
                                        <td style={{ color: getRiskColor(scan.risk_level), fontWeight: "bold" }}>
                                            {scan.risk_level || "UNKNOWN"}
                                        </td>
                                        <td>
                                            <div style={{ background: "#1a1a1a", borderRadius: "10px", overflow: "hidden", width: "80px" }}>
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
                                        <td style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
                                            {scan.created_at ? new Date(scan.created_at).toLocaleDateString() : "N/A"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* AI Insights */}
            {stats.total_scans > 0 && (
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
                        <h2 style={{ color: "#00ff66" }}>Your AI Intelligence Report</h2>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                        <div style={{ padding: "1rem", background: "#1a1a1a", borderRadius: "12px" }}>
                            <strong>Scan Efficiency</strong>
                            <p style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>{stats.detection_rate}%</p>
                            <small>Detection accuracy</small>
                        </div>
                        <div style={{ padding: "1rem", background: "#1a1a1a", borderRadius: "12px" }}>
                            <strong>Total Threats</strong>
                            <p style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>{stats.threats_detected}</p>
                            <small>Security incidents found</small>
                        </div>
                        <div style={{ padding: "1rem", background: "#1a1a1a", borderRadius: "12px" }}>
                            <strong>Files Scanned</strong>
                            <p style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>{stats.file_scans}</p>
                            <small>Documents analyzed</small>
                        </div>
                        <div style={{ padding: "1rem", background: "#1a1a1a", borderRadius: "12px" }}>
                            <strong>Risk Score</strong>
                            <p style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>
                                {stats.total_scans > 0 ? ((stats.threats_detected / stats.total_scans) * 100).toFixed(1) : 0}%
                            </p>
                            <small>Threat ratio</small>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}