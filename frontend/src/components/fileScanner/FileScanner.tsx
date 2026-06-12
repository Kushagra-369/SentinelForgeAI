export default function FileScanner() {
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
              fontSize: "0.9rem",
            }}
          >
            FILE THREAT ANALYSIS
          </span>

          <h1
            style={{
              fontSize: "3.5rem",
              marginTop: "1rem",
              marginBottom: "1rem",
            }}
          >
            AI File Malware Scanner
          </h1>

          <p
            style={{
              color: "#9ca3af",
              maxWidth: "700px",
              lineHeight: 1.8,
            }}
          >
            Upload files to detect malware indicators,
            suspicious extensions, potentially dangerous
            executables, and other security risks.
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
          {/* Upload Panel */}
          <div
            style={{
              border: "1px solid #222",
              borderRadius: "20px",
              padding: "2rem",
              background: "#0b0b0b",
            }}
          >
            <h2
              style={{
                marginBottom: "1rem",
              }}
            >
              Upload File
            </h2>

            <div
              style={{
                border: "2px dashed #333",
                borderRadius: "16px",
                padding: "3rem",
                textAlign: "center",
                marginBottom: "1.5rem",
              }}
            >
              <p
                style={{
                  color: "#9ca3af",
                  marginBottom: "1rem",
                }}
              >
                Drag & Drop File Here
              </p>

              <input
                type="file"
                style={{
                  color: "white",
                }}
              />
            </div>

            <button
              style={{
                padding: "14px 24px",
                border: "none",
                borderRadius: "12px",
                background: "#00ff66",
                color: "black",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Scan File
            </button>
          </div>

          {/* Result Panel */}
          <div
            style={{
              border: "1px solid rgba(0,255,102,0.25)",
              borderRadius: "20px",
              padding: "2rem",
              background: "#0b0b0b",
            }}
          >
            <h2
              style={{
                marginBottom: "1.5rem",
              }}
            >
              Scan Result
            </h2>

            <div
              style={{
                marginBottom: "1.5rem",
              }}
            >
              <p
                style={{
                  color: "#9ca3af",
                }}
              >
                Threat Level
              </p>

              <h3
                style={{
                  fontSize: "2rem",
                  color: "#ff4d4d",
                }}
              >
                --
              </h3>
            </div>

            <div
              style={{
                marginBottom: "1.5rem",
              }}
            >
              <p
                style={{
                  color: "#9ca3af",
                }}
              >
                Confidence
              </p>

              <h3>--</h3>
            </div>

            <div
              style={{
                marginBottom: "1.5rem",
              }}
            >
              <p
                style={{
                  color: "#9ca3af",
                }}
              >
                File Name
              </p>

              <h3>--</h3>
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
                <li>No file scanned yet</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Supported Files */}
        <div
          style={{
            marginTop: "2rem",
            border: "1px solid #222",
            borderRadius: "20px",
            padding: "2rem",
            background: "#0b0b0b",
          }}
        >
          <h2>Supported File Types</h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            {[
              ".pdf",
              ".docx",
              ".exe",
              ".zip",
              ".js",
              ".py",
              ".bat",
              ".dll",
            ].map((type) => (
              <span
                key={type}
                style={{
                  padding: "8px 14px",
                  borderRadius: "999px",
                  border: "1px solid #333",
                  color: "#00ff66",
                }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}