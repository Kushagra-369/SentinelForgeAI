import { useState, useRef } from "react";
import type { DragEvent } from "react";
import axios from "axios";

// ========== Type Definitions ==========
interface ScanResult {
  risk_level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE";
  confidence: number;
  is_malicious: boolean;
  reasons: string[];
  filename: string;
  file_size?: number;
  file_type?: string;
  created_at?: string;
}

// ========== Component ==========
export default function FileScanner() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = async () => {
    if (!file) {
      alert("Please select a file to scan");
      return;
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size exceeds 50MB limit. Please select a smaller file.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post<ScanResult>(
        "http://127.0.0.1:8000/file/scan",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error("Scan error:", error);
      alert("Failed to scan file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCopyResult = () => {
    if (result) {
      const textToCopy = `
SentinelForge AI File Analysis
--------------------------------
File Name: ${result.filename}
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

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setResult(null);
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

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "Unknown";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
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
            📁 FILE THREAT ANALYSIS
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
            AI File Malware Scanner
          </h1>

          <p
            style={{
              color: "#9ca3af",
              maxWidth: "700px",
              lineHeight: 1.8,
              margin: "0 auto",
            }}
          >
            Upload files to detect malware indicators, suspicious extensions, 
            potentially dangerous executables, and other security risks.
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
          {/* Upload Panel */}
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
              <h2 style={{ fontSize: "1.5rem" }}>📤 Upload File</h2>
              {file && (
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

            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              style={{
                border: dragActive ? "2px solid #00ff66" : "2px dashed #333",
                borderRadius: "16px",
                padding: "2rem",
                textAlign: "center",
                marginBottom: "1.5rem",
                transition: "all 0.3s",
                background: dragActive ? "rgba(0,255,102,0.05)" : "transparent",
              }}
            >
              {file ? (
                <div>
                  <span style={{ fontSize: "3rem", display: "block", marginBottom: "0.5rem" }}>
                    📄
                  </span>
                  <p style={{ color: "#00ff66", fontWeight: "bold", marginBottom: "0.5rem" }}>
                    {file.name}
                  </p>
                  <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
                    {formatFileSize(file.size)} • {file.type || "Unknown type"}
                  </p>
                  <button
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    style={{
                      marginTop: "1rem",
                      padding: "4px 12px",
                      background: "rgba(255,0,0,0.2)",
                      border: "1px solid #ff0000",
                      borderRadius: "8px",
                      color: "#ff4d4d",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                    }}
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <div>
                  <span style={{ fontSize: "4rem", display: "block", marginBottom: "1rem" }}>
                    📁
                  </span>
                  <p style={{ color: "#9ca3af", marginBottom: "0.5rem" }}>
                    Drag & Drop File Here
                  </p>
                  <p style={{ color: "#6b7280", fontSize: "0.875rem", marginBottom: "1rem" }}>
                    or
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    style={{
                      color: "white",
                      cursor: "pointer",
                    }}
                    accept=".pdf,.docx,.doc,.exe,.zip,.rar,.js,.py,.bat,.dll,.txt,.jpg,.png,.xlsx,.pptx"
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleScan}
              disabled={loading || !file}
              style={{
                width: "100%",
                padding: "14px 24px",
                border: "none",
                borderRadius: "12px",
                background: loading || !file ? "#333" : "#00ff66",
                color: loading || !file ? "#666" : "black",
                fontWeight: 700,
                cursor: loading || !file ? "not-allowed" : "pointer",
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
                  🔍 Scan File
                </>
              )}
            </button>

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
                Our AI analyzes file signatures, embedded macros, suspicious patterns, 
                and checks against known malware databases.
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

            {!result && !loading && !file ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem 1rem",
                  color: "#9ca3af",
                }}
              >
                <span style={{ fontSize: "4rem", display: "block", marginBottom: "1rem" }}>
                  🛡️
                </span>
                <p>Upload a file and click "Scan File" to see results</p>
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
                <p style={{ color: "#00ff66" }}>AI is scanning the file...</p>
                <p style={{ color: "#9ca3af", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                  Analyzing file signatures and checking for malware
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

                  {/* File Information */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <p style={{ color: "#9ca3af", marginBottom: "0.5rem" }}>File Name</p>
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
                      {result.filename}
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

        {/* Supported Files Section */}
        <div
          style={{
            marginTop: "3rem",
            border: "1px solid #222",
            borderRadius: "20px",
            padding: "2rem",
            background: "#0b0b0b",
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>📋 Supported File Types</h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            {[
              ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
              ".exe", ".dll", ".msi", ".bat", ".cmd", ".sh", ".ps1",
              ".zip", ".rar", ".7z", ".tar", ".gz",
              ".js", ".py", ".java", ".cpp", ".c",
              ".txt", ".rtf", ".html", ".xml", ".json"
            ].map((type) => (
              <span
                key={type}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  background: "rgba(0,255,102,0.1)",
                  border: "1px solid rgba(0,255,102,0.2)",
                  color: "#00ff66",
                  fontSize: "0.875rem",
                  fontFamily: "monospace",
                }}
              >
                {type}
              </span>
            ))}
          </div>
          <p style={{ color: "#6b7280", fontSize: "0.75rem", marginTop: "1rem" }}>
            Maximum file size: 50MB
          </p>
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