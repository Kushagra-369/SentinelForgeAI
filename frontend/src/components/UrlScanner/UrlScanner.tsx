import { useState } from "react";
import axios from "axios";
import API_URL from "../GlobalAPIURL";
// ========== Type Definitions ==========
interface ScanResult {
  risk_level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE";
  confidence: number;
  is_malicious: boolean;
  reasons: string[];
  url?: string;
  created_at?: string;
}

// ========== Component ==========
export default function UrlScanner() {
  const [url, setUrl] = useState<string>("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleScan = async () => {
    if (!url.trim()) {
      alert("Please enter a URL to analyze");
      return;
    }

    // Basic URL validation
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(url)) {
      alert("Please enter a valid URL");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post<ScanResult>(
        `${API_URL}/url/scan`,
        { url: url }
      );
      setResult(response.data);
    } catch (error) {
      console.error("Scan error:", error);
      alert("Failed to analyze URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUrl("");
    setResult(null);
  };

  const handleCopyResult = () => {
    if (result) {
      const textToCopy = `
SentinelForge AI URL Analysis
--------------------------------
URL: ${url}
Risk Level: ${result.risk_level}
Confidence: ${result.confidence}%
Classification: ${result.is_malicious ? "MALICIOUS" : "SAFE"}
Indicators: ${result.reasons.join(", ")}
      `.trim();

      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getRiskColor = (riskLevel?: string): string => {
    switch (riskLevel) {
      case "CRITICAL": return "#ff0000";
      case "HIGH": return "#ff4d4d";
      case "MEDIUM": return "#ffaa00";
      case "LOW": return "#00ff66";
      case "SAFE": return "#00cc44";
      default: return "#9ca3af";
    }
  };

  const getRiskIcon = (riskLevel?: string): string => {
    switch (riskLevel) {
      case "CRITICAL": return "🔴";
      case "HIGH": return "🟠";
      case "MEDIUM": return "🟡";
      case "LOW": return "🟢";
      case "SAFE": return "✅";
      default: return "⚪";
    }
  };

  const getConfidenceColor = (confidence?: number): string => {
    if (!confidence) return "#9ca3af";
    if (confidence >= 80) return "#ff0000";
    if (confidence >= 60) return "#ff4d4d";
    if (confidence >= 40) return "#ffaa00";
    return "#00ff66";
  };

  const extractDomain = (urlString: string): string => {
    try {
      const urlObj = new URL(urlString.startsWith("http") ? urlString : `https://${urlString}`);
      return urlObj.hostname;
    } catch {
      return urlString;
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "8rem 8%",
        color: "white",
        background: "linear-gradient(135deg, #0a0a0a 0%, #0f0f0f 100%)",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Header Section */}
        <div style={{ marginBottom: "4rem", textAlign: "center" }}>
          <span
            style={{
              color: "#00ff66",
              fontSize: "0.9rem",
              fontWeight: 600,
              letterSpacing: "2px",
              background: "rgba(0,255,102,0.1)",
              padding: "4px 12px",
              borderRadius: "20px",
              display: "inline-block",
            }}
          >
            🔗 URL THREAT ANALYSIS
          </span>

          <h1
            style={{
              fontSize: "4rem",
              marginTop: "1.5rem",
              marginBottom: "1rem",
              background: "linear-gradient(135deg, #fff 0%, #00ff66 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI URL Scanner
          </h1>

          <p
            style={{
              color: "#9ca3af",
              maxWidth: "700px",
              lineHeight: 1.8,
              margin: "0 auto",
            }}
          >
            Analyze suspicious URLs and domains for phishing, malware distribution,
            spoofing attempts, and malicious indicators.
          </p>
        </div>

        {/* Main Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 450px",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* Input Panel */}
          <div
            style={{
              border: "1px solid #222",
              borderRadius: "24px",
              padding: "2rem",
              background: "#0b0b0b",
              transition: "transform 0.2s, box-shadow 0.2s",
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
              <h2 style={{ fontSize: "1.5rem" }}>🌐 URL Input</h2>
              {url && (
                <button
                  onClick={handleClear}
                  style={{
                    background: "transparent",
                    border: "1px solid #333",
                    color: "#9ca3af",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com or suspicious-domain.xyz"
              style={{
                width: "100%",
                padding: "1rem",
                background: "#050505",
                border: "1px solid #222",
                borderRadius: "12px",
                color: "white",
                outline: "none",
                fontSize: "1rem",
                fontFamily: "monospace",
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleScan();
                }
              }}
            />

            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "1.5rem",
              }}
            >
              <button
                onClick={handleScan}
                disabled={loading || !url.trim()}
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  border: "none",
                  borderRadius: "12px",
                  background: loading || !url.trim() ? "#333" : "#00ff66",
                  color: loading || !url.trim() ? "#666" : "black",
                  fontWeight: 700,
                  cursor: loading || !url.trim() ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {loading ? (
                  <>
                    <span
                      style={{
                        display: "inline-block",
                        width: "16px",
                        height: "16px",
                        border: "2px solid #666",
                        borderTopColor: "#00ff66",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    Scanning...
                  </>
                ) : (
                  <>
                    🔍 Scan URL
                  </>
                )}
              </button>
            </div>

            {/* Tips Section */}
            <div
              style={{
                marginTop: "2rem",
                padding: "1rem",
                background: "rgba(0,255,102,0.05)",
                borderRadius: "12px",
                border: "1px solid rgba(0,255,102,0.1)",
              }}
            >
              <p style={{ color: "#00ff66", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                💡 Pro Tip
              </p>
              <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
                Our AI analyzes URL structure, domain age, SSL certificates, redirect chains,
                and checks against known threat databases.
              </p>
            </div>
          </div>

          {/* Result Panel */}
          <div
            style={{
              border: result
                ? result.is_malicious
                  ? "1px solid rgba(255,0,0,0.3)"
                  : "1px solid rgba(0,255,102,0.3)"
                : "1px solid #222",
              borderRadius: "24px",
              padding: "2rem",
              background: "#0b0b0b",
              position: "relative",
              transition: "all 0.3s",
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
              <h2 style={{ fontSize: "1.5rem" }}>📊 Scan Result</h2>
              {result && (
                <button
                  onClick={handleCopyResult}
                  style={{
                    background: "transparent",
                    border: "1px solid #333",
                    color: copied ? "#00ff66" : "#9ca3af",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    transition: "all 0.2s",
                  }}
                >
                  {copied ? "✅ Copied!" : "📋 Copy"}
                </button>
              )}
            </div>

            {!result && !loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem 1rem",
                  color: "#9ca3af",
                }}
              >
                <span style={{ fontSize: "4rem", display: "block", marginBottom: "1rem" }}>
                  🔒
                </span>
                <p>Enter a URL and click "Scan URL" to see results</p>
              </div>
            ) : loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem 1rem",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "50px",
                    height: "50px",
                    border: "3px solid #333",
                    borderTopColor: "#00ff66",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    marginBottom: "1rem",
                  }}
                />
                <p style={{ color: "#00ff66" }}>AI is scanning the URL...</p>
                <p style={{ color: "#9ca3af", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                  Checking domain reputation and analyzing threats
                </p>
              </div>
            ) : (
              result && (
                <div style={{ animation: "fadeIn 0.5s ease-in" }}>
                  {/* Threat Level Card */}
                  <div
                    style={{
                      marginBottom: "1.5rem",
                      padding: "1.5rem",
                      background: `linear-gradient(135deg, ${getRiskColor(result.risk_level)}10, transparent)`,
                      borderRadius: "16px",
                      border: `1px solid ${getRiskColor(result.risk_level)}30`,
                    }}
                  >
                    <p style={{ color: "#9ca3af", marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                      Threat Level {getRiskIcon(result.risk_level)}
                    </p>
                    <h3
                      style={{
                        color: getRiskColor(result.risk_level),
                        fontSize: "2rem",
                        fontWeight: "bold",
                      }}
                    >
                      {result.risk_level}
                    </h3>
                  </div>

                  {/* Confidence Meter */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <p style={{ color: "#9ca3af" }}>Confidence Score</p>
                      <p style={{ color: getConfidenceColor(result.confidence), fontWeight: "bold" }}>
                        {result.confidence}%
                      </p>
                    </div>
                    <div
                      style={{
                        background: "#1a1a1a",
                        borderRadius: "10px",
                        overflow: "hidden",
                        height: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: `${result.confidence}%`,
                          background: getConfidenceColor(result.confidence),
                          height: "100%",
                          transition: "width 1s ease-out",
                        }}
                      />
                    </div>
                  </div>

                  {/* Domain Information */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <p style={{ color: "#9ca3af", marginBottom: "0.5rem" }}>Domain</p>
                    <div
                      style={{
                        background: "#050505",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        fontFamily: "monospace",
                        fontSize: "0.875rem",
                        wordBreak: "break-all",
                      }}
                    >
                      {extractDomain(url)}
                    </div>
                  </div>

                  {/* Classification Badge */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <p style={{ color: "#9ca3af", marginBottom: "0.5rem" }}>Classification</p>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "6px 16px",
                        background: result.is_malicious ? "rgba(255,0,0,0.1)" : "rgba(0,255,102,0.1)",
                        border: `1px solid ${result.is_malicious ? "#ff0000" : "#00ff66"}`,
                        borderRadius: "20px",
                        color: result.is_malicious ? "#ff4d4d" : "#00ff66",
                        fontWeight: "bold",
                        fontSize: "0.875rem",
                      }}
                    >
                      {result.is_malicious ? "⚠️ MALICIOUS" : "✅ SAFE"}
                    </span>
                  </div>

                  {/* Indicators List */}
                  <div>
                    <p
                      style={{
                        color: "#9ca3af",
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span>🚨</span> Indicators & Reasons
                    </p>

                    <div
                      style={{
                        maxHeight: "200px",
                        overflowY: "auto",
                        paddingRight: "8px",
                      }}
                    >
                      {result.reasons && result.reasons.length > 0 ? (
                        <ul
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.75rem",
                            paddingLeft: "1.5rem",
                          }}
                        >
                          {result.reasons.map((reason: string, index: number) => (
                            <li
                              key={index}
                              style={{
                                color: "#d1d5db",
                                fontSize: "0.875rem",
                                lineHeight: 1.5,
                              }}
                            >
                              {reason}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ color: "#6b7280", fontStyle: "italic", padding: "1rem 0" }}>
                          No suspicious indicators detected
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Scan Timestamp */}
                  {result.created_at && (
                    <div
                      style={{
                        marginTop: "1.5rem",
                        paddingTop: "1rem",
                        borderTop: "1px solid #222",
                        color: "#6b7280",
                        fontSize: "0.75rem",
                        textAlign: "center",
                      }}
                    >
                      Scanned on {new Date(result.created_at).toLocaleString()}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Features Section */}
        <div
          style={{
            marginTop: "4rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {[
            { icon: "🎯", title: "Phishing Detection", desc: "Identifies fake login pages and credential theft URLs" },
            { icon: "🦠", title: "Malware Scan", desc: "Detects malicious software distribution links" },
            { icon: "🔒", title: "SSL Analysis", desc: "Checks certificate validity and encryption" },
            { icon: "📊", title: "Domain Reputation", desc: "Analyzes domain age and historical threats" },
          ].map((feature) => (
            <div
              key={feature.title}
              style={{
                padding: "1rem",
                background: "#0b0b0b",
                borderRadius: "12px",
                border: "1px solid #222",
              }}
            >
              <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }}>
                {feature.icon}
              </span>
              <h4 style={{ color: "#00ff66", marginBottom: "0.5rem" }}>{feature.title}</h4>
              <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}