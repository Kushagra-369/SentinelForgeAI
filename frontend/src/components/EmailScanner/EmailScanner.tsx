import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../GlobalAPIURL";

// ========== Type Definitions ==========
interface ScanResult {
  risk_level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE";
  confidence: number;
  is_spam: boolean;
  reasons: string[];
  input?: string;
  created_at?: string;
}

// ========== Component ==========
export default function EmailScanner() {
  const [email, setEmail] = useState<string>("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScan = async () => {
    if (!email.trim()) {
      alert("Please paste an email to analyze");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post<ScanResult>(
        `${API_URL}/email/scan`,
        { text: email }
      );
      setResult(response.data);
    } catch (error) {
      console.error("Scan error:", error);
      alert("Failed to analyze email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setEmail("");
    setResult(null);
  };

  const handleCopyResult = () => {
    if (result) {
      const textToCopy = `
SentinelForge AI Email Analysis
--------------------------------
Risk Level: ${result.risk_level}
Confidence: ${result.confidence}%
Classification: ${result.is_spam ? "SPAM" : "SAFE"}
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

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: isMobile ? "6rem 5% 3rem" : isTablet ? "7rem 6% 4rem" : "8rem 8% 5rem",
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
        <div style={{ marginBottom: isMobile ? "2rem" : "4rem", textAlign: "center" }}>
          <span
            style={{
              color: "#00ff66",
              fontSize: isMobile ? "0.75rem" : "0.9rem",
              fontWeight: 600,
              letterSpacing: "2px",
              background: "rgba(0,255,102,0.1)",
              padding: "4px 12px",
              borderRadius: "20px",
              display: "inline-block",
            }}
          >
            📧 EMAIL THREAT ANALYSIS
          </span>

          <h1
            style={{
              fontSize: isMobile ? "2rem" : isTablet ? "3rem" : "4rem",
              marginTop: "1.5rem",
              marginBottom: "1rem",
              background: "linear-gradient(135deg, #fff 0%, #00ff66 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI Email Scanner
          </h1>

          <p
            style={{
              color: "#9ca3af",
              maxWidth: "700px",
              lineHeight: 1.8,
              margin: "0 auto",
              fontSize: isMobile ? "0.9rem" : "1rem",
              padding: isMobile ? "0 1rem" : "0",
            }}
          >
            Paste any suspicious email and let SentinelForge AI analyze phishing indicators,
            malicious intent, spam patterns, and threat severity.
          </p>
        </div>

        {/* Main Layout */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          {/* Input Panel */}
          <div
            style={{
              flex: isMobile ? "1" : isTablet ? "1.2" : "1",
              border: "1px solid #222",
              borderRadius: "24px",
              padding: isMobile ? "1.5rem" : "2rem",
              background: "#0b0b0b",
              transition: "transform 0.2s, box-shadow 0.2s",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <h2 style={{ fontSize: isMobile ? "1.3rem" : "1.5rem" }}>📝 Email Content</h2>
              {email && (
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

            <textarea
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Paste suspicious email here...&#10;&#10;Example:&#10;URGENT! Your account has been compromised. Click here to verify your details immediately."
              style={{
                width: "100%",
                height: isMobile ? "250px" : "350px",
                background: "#050505",
                border: "1px solid #222",
                borderRadius: "16px",
                color: "white",
                padding: "1rem",
                resize: "none",
                outline: "none",
                fontFamily: "monospace",
                fontSize: "14px",
                lineHeight: 1.6,
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
                disabled={loading || !email.trim()}
                style={{
                  flex: 1,
                  padding: isMobile ? "12px 20px" : "14px 24px",
                  border: "none",
                  borderRadius: "12px",
                  background: loading || !email.trim() ? "#333" : "#00ff66",
                  color: loading || !email.trim() ? "#666" : "black",
                  fontWeight: 700,
                  cursor: loading || !email.trim() ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontSize: isMobile ? "0.9rem" : "1rem",
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
                    Analyzing...
                  </>
                ) : (
                  <>
                    🔍 Analyze Email
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
                Our AI analyzes email headers, suspicious links, urgent language,
                sender patterns, and common phishing indicators.
              </p>
            </div>
          </div>

          {/* Result Panel */}
          <div
            style={{
              flex: isMobile ? "1" : isTablet ? "0.9" : "0.8",
              minWidth: isMobile ? "100%" : isTablet ? "350px" : "450px",
              border: result ? "1px solid rgba(0,255,102,0.3)" : "1px solid #222",
              borderRadius: "24px",
              padding: isMobile ? "1.5rem" : "2rem",
              background: "#0b0b0b",
              position: "relative",
              transition: "all 0.3s",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <h2 style={{ fontSize: isMobile ? "1.3rem" : "1.5rem" }}>📊 Analysis Result</h2>
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
                  padding: isMobile ? "2rem 1rem" : "3rem 1rem",
                  color: "#9ca3af",
                }}
              >
                <span style={{ fontSize: "4rem", display: "block", marginBottom: "1rem" }}>
                  🤖
                </span>
                <p style={{ fontSize: isMobile ? "0.9rem" : "1rem" }}>
                  Paste an email and click "Analyze" to see results
                </p>
              </div>
            ) : loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: isMobile ? "2rem 1rem" : "3rem 1rem",
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
                <p style={{ color: "#00ff66" }}>AI is analyzing the email...</p>
                <p style={{ color: "#9ca3af", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                  Checking for phishing patterns and threats
                </p>
              </div>
            ) : (
              result && (
                <div style={{ animation: "fadeIn 0.5s ease-in" }}>
                  {/* Threat Level Card */}
                  <div
                    style={{
                      marginBottom: "1.5rem",
                      padding: isMobile ? "1rem" : "1.5rem",
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
                        fontSize: isMobile ? "1.5rem" : "2rem",
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
                        flexWrap: "wrap",
                      }}
                    >
                      <p style={{ color: "#9ca3af", fontSize: isMobile ? "0.85rem" : "1rem" }}>
                        Confidence Score
                      </p>
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

                  {/* Classification Badge */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <p style={{ color: "#9ca3af", marginBottom: "0.5rem", fontSize: isMobile ? "0.85rem" : "1rem" }}>
                      Classification
                    </p>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "6px 16px",
                        background: result.is_spam ? "rgba(255,0,0,0.1)" : "rgba(0,255,102,0.1)",
                        border: `1px solid ${result.is_spam ? "#ff0000" : "#00ff66"}`,
                        borderRadius: "20px",
                        color: result.is_spam ? "#ff4d4d" : "#00ff66",
                        fontWeight: "bold",
                        fontSize: "0.875rem",
                      }}
                    >
                      {result.is_spam ? "⚠️ SPAM DETECTED" : "✅ SAFE"}
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
                        fontSize: isMobile ? "0.85rem" : "1rem",
                      }}
                    >
                      <span>🚨</span> Indicators & Reasons
                    </p>

                    <div
                      style={{
                        maxHeight: isMobile ? "150px" : "200px",
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
                            paddingLeft: isMobile ? "1rem" : "1.5rem",
                          }}
                        >
                          {result.reasons.map((reason: string, index: number) => (
                            <li
                              key={index}
                              style={{
                                color: "#d1d5db",
                                fontSize: isMobile ? "0.8rem" : "0.875rem",
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
            gridTemplateColumns: isMobile 
              ? "1fr" 
              : isTablet 
                ? "repeat(2, 1fr)" 
                : "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {[
            { icon: "🎯", title: "Phishing Detection", desc: "Identifies fake login pages and credential theft attempts" },
            { icon: "📊", title: "Spam Analysis", desc: "Detects spam patterns and unwanted content" },
            { icon: "⚠️", title: "Urgency Detection", desc: "Flags pressure tactics and time-sensitive scams" },
            { icon: "🔗", title: "Link Analysis", desc: "Analyzes embedded URLs for malicious destinations" },
          ].map((feature) => (
            <div
              key={feature.title}
              style={{
                padding: "1rem",
                background: "#0b0b0b",
                borderRadius: "12px",
                border: "1px solid #222",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.borderColor = "#00ff66";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#222";
              }}
            >
              <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }}>
                {feature.icon}
              </span>
              <h4 style={{ color: "#00ff66", marginBottom: "0.5rem", fontSize: isMobile ? "1rem" : "1.1rem" }}>
                {feature.title}
              </h4>
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