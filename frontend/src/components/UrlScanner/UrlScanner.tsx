import { useState } from "react";
import axios from "axios";

export default function UrlScanner() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8000/url/scan",
        {
          url: url,
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "8rem 8%",
        color: "white",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Heading */}
        <div style={{ marginBottom: "3rem" }}>
          <span
            style={{
              color: "#00ff66",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            URL THREAT ANALYSIS
          </span>

          <h1
            style={{
              fontSize: "3.5rem",
              marginTop: "1rem",
              marginBottom: "1rem",
            }}
          >
            AI URL Scanner
          </h1>

          <p
            style={{
              color: "#9ca3af",
              maxWidth: "700px",
              lineHeight: 1.8,
            }}
          >
            Analyze suspicious URLs and domains for phishing,
            malware distribution, spoofing attempts, and
            malicious indicators.
          </p>
        </div>

        {/* Main Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 400px",
            gap: "2rem",
          }}
        >
          {/* Input Panel */}
          <div
            style={{
              border: "1px solid #222",
              borderRadius: "20px",
              padding: "2rem",
              background: "#0b0b0b",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>
              URL Input
            </h2>

            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              style={{
                width: "100%",
                padding: "1rem",
                background: "#050505",
                border: "1px solid #222",
                borderRadius: "12px",
                color: "white",
                outline: "none",
              }}
            />

            <button
              onClick={handleScan}
              disabled={loading}
              style={{
                marginTop: "1.5rem",
                padding: "14px 24px",
                border: "none",
                borderRadius: "12px",
                background: "#00ff66",
                color: "black",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {loading ? "Scanning..." : "Scan URL"}
            </button>
          </div>

          {/* Result Panel */}
          <div
            style={{
              border: "1px solid rgba(255,77,77,0.25)",
              borderRadius: "20px",
              padding: "2rem",
              background: "#0b0b0b",
            }}
          >
            <h2 style={{ marginBottom: "1.5rem" }}>
              Scan Result
            </h2>

            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ color: "#9ca3af" }}>
                Threat Level
              </p>

              <h3
                style={{
                  color:
                    result?.risk_level === "CRITICAL"
                      ? "#ff0000"
                      : result?.risk_level === "HIGH"
                        ? "#ff4d4d"
                        : result?.risk_level === "MEDIUM"
                          ? "#ffaa00"
                          : "#00ff66"
                }}
              >
                {result ? result.risk_level : "--"}
              </h3>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ color: "#9ca3af" }}>
                Confidence
              </p>

              <h3>{result ? `${result.confidence}%` : "--"}</h3>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ color: "#9ca3af" }}>
                Domain
              </p>

              <h3>{url || "--"}</h3>
            </div>

            <div>
              <p
                style={{
                  color: "#9ca3af",
                  marginBottom: "1rem",
                }}
              >
                Indicators
              </p>

              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.8rem",
                }}
              >
                {result?.reasons?.length ? (
                  result.reasons.map(
                    (reason: string, index: number) => (
                      <li key={index}>{reason}</li>
                    )
                  )
                ) : (
                  <li>No indicators detected</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}