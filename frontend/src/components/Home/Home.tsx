import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "white",
      }}
    >
      {/* Hero */}
      <section
        style={{
          minHeight: "calc(100vh - 120px)",
          padding: "120px 8% 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "4rem",
        }}
      >
        {/* Left */}
        <div style={{ maxWidth: "700px" }}>
          <div
            style={{
              display: "inline-block",
              padding: "8px 16px",
              border: "1px solid #00ff66",
              borderRadius: "999px",
              color: "#00ff66",
              marginBottom: "1.5rem",
            }}
          >
            AI Threat Intelligence Platform
          </div>

          <h1
            style={{
              fontSize: "4rem",
              lineHeight: 1.1,
              marginBottom: "1.5rem",
            }}
          >
            Detect Cyber Threats
            <br />
            <span style={{ color: "#00ff66" }}>
              Before They Strike
            </span>
          </h1>

          <p
            style={{
              color: "#a0a0a0",
              fontSize: "1.15rem",
              lineHeight: 1.8,
              marginBottom: "2rem",
            }}
          >
            Analyze phishing emails, suspicious URLs and
            security threats using machine learning powered
            intelligence.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
            }}
          >
            <button
              onClick={() => navigate("/email-scanner")}
              style={{
                background: "#00ff66",
                color: "#000",
                border: "none",
                padding: "14px 24px",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Analyze Email
            </button>

            <button
              onClick={() => navigate("/url-scanner")}
              style={{
                background: "transparent",
                color: "white",
                border: "1px solid #00ff66",
                padding: "14px 24px",
                borderRadius: "12px",
                cursor: "pointer",
              }}
            >
              Scan URL
            </button>
          </div>
        </div>

        {/* Right */}
        <div
          style={{
            width: "400px",
            border: "1px solid rgba(0,255,102,0.3)",
            borderRadius: "20px",
            padding: "2rem",
            background: "rgba(255,255,255,0.03)",
            boxShadow:
              "0 0 40px rgba(0,255,102,0.15)",
          }}
        >
          <h3
            style={{
              color: "#00ff66",
              marginBottom: "1.5rem",
            }}
          >
            Threat Analysis
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <p>Status: SAFE</p>
            <p>Confidence: 97%</p>
            <p>Risk Level: LOW</p>
            <p>Engine: SentinelForge AI</p>
          </div>
        </div>
      </section>


    </main>
  );
};

export default Home;