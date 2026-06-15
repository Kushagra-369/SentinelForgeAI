import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "white",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          minHeight: "calc(100vh - 120px)",
          padding: isMobile ? "100px 5% 50px" : isTablet ? "120px 6% 0" : "120px 8% 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: isMobile ? "2rem" : isTablet ? "3rem" : "4rem",
          flexDirection: isMobile || isTablet ? "column" : "row",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left Content */}
        <div 
          style={{ 
            maxWidth: isMobile || isTablet ? "100%" : "700px",
            textAlign: isMobile || isTablet ? "center" : "left",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: isMobile ? "6px 12px" : "8px 16px",
              border: "1px solid #00ff66",
              borderRadius: "999px",
              color: "#00ff66",
              marginBottom: "1.5rem",
              fontSize: isMobile ? "0.75rem" : "0.85rem",
              background: "rgba(0,255,102,0.05)",
            }}
          >
            AI Threat Intelligence Platform
          </div>

          <h1
            style={{
              fontSize: isMobile ? "2rem" : isTablet ? "3rem" : "4rem",
              lineHeight: 1.2,
              marginBottom: "1.5rem",
              fontWeight: "bold",
            }}
          >
            Detect Cyber Threats
            <br />
            <span style={{ color: "#00ff66", display: "inline-block" }}>
              Before They Strike
            </span>
          </h1>

          <p
            style={{
              color: "#a0a0a0",
              fontSize: isMobile ? "0.95rem" : isTablet ? "1rem" : "1.15rem",
              lineHeight: 1.7,
              marginBottom: "2rem",
              maxWidth: isMobile || isTablet ? "100%" : "600px",
              marginLeft: isMobile || isTablet ? "auto" : "0",
              marginRight: isMobile || isTablet ? "auto" : "0",
            }}
          >
            Analyze phishing emails, suspicious URLs and
            security threats using machine learning powered
            intelligence.
          </p>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: isMobile || isTablet ? "center" : "flex-start",
              width: "100%",
            }}
          >
            <button
              onClick={() => navigate("/email-scanner")}
              style={{
                background: "linear-gradient(135deg, #00ff66, #00cc52)",
                color: "#000",
                border: "none",
                padding: isMobile ? "12px 20px" : "14px 28px",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: isMobile ? "0.9rem" : "1rem",
                transition: "all 0.3s ease",
                flex: isMobile ? "1" : "auto",
                minWidth: isMobile ? "auto" : "160px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 5px 20px rgba(0,255,102,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              🔒 Analyze Email
            </button>

            <button
              onClick={() => navigate("/url-scanner")}
              style={{
                background: "transparent",
                color: "white",
                border: "1px solid #00ff66",
                padding: isMobile ? "12px 20px" : "14px 28px",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: isMobile ? "0.9rem" : "1rem",
                transition: "all 0.3s ease",
                flex: isMobile ? "1" : "auto",
                minWidth: isMobile ? "auto" : "160px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0,255,102,0.1)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              🔍 Scan URL
            </button>
          </div>

          {/* Stats Section for Mobile/Tablet */}
          {(isMobile || isTablet) && (
            <div
              style={{
                marginTop: "3rem",
                display: "grid",
                gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
                gap: "1rem",
                borderTop: "1px solid rgba(0,255,102,0.2)",
                paddingTop: "2rem",
              }}
            >
              <div>
                <div style={{ fontSize: isMobile ? "1.3rem" : "1.5rem", fontWeight: "bold", color: "#00ff66" }}>
                  97%
                </div>
                <div style={{ fontSize: "0.75rem", color: "#a0a0a0" }}>Accuracy</div>
              </div>
              <div>
                <div style={{ fontSize: isMobile ? "1.3rem" : "1.5rem", fontWeight: "bold", color: "#00ff66" }}>
                  10K+
                </div>
                <div style={{ fontSize: "0.75rem", color: "#a0a0a0" }}>Threats Blocked</div>
              </div>
              <div>
                <div style={{ fontSize: isMobile ? "1.3rem" : "1.5rem", fontWeight: "bold", color: "#00ff66" }}>
                  &lt;1s
                </div>
                <div style={{ fontSize: "0.75rem", color: "#a0a0a0" }}>Response</div>
              </div>
              <div>
                <div style={{ fontSize: isMobile ? "1.3rem" : "1.5rem", fontWeight: "bold", color: "#00ff66" }}>
                  24/7
                </div>
                <div style={{ fontSize: "0.75rem", color: "#a0a0a0" }}>Monitoring</div>
              </div>
            </div>
          )}
        </div>

        {/* Right Content - Threat Analysis Card */}
        <div
          style={{
            width: isMobile ? "100%" : isTablet ? "80%" : "400px",
            maxWidth: "450px",
            border: "1px solid rgba(0,255,102,0.3)",
            borderRadius: "20px",
            padding: isMobile ? "1.5rem" : "2rem",
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 0 40px rgba(0,255,102,0.15)",
            transition: "all 0.3s ease",
            margin: isMobile || isTablet ? "0 auto" : "0",
          }}
        >
          <h3
            style={{
              color: "#00ff66",
              marginBottom: "1.5rem",
              fontSize: isMobile ? "1.2rem" : "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span>🛡️</span>
            Threat Analysis
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {/* Status */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#a0a0a0", fontSize: isMobile ? "0.9rem" : "1rem" }}>Status:</span>
              <span style={{ color: "#00ff66", fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ 
                  display: "inline-block", 
                  width: "8px", 
                  height: "8px", 
                  background: "#00ff66", 
                  borderRadius: "50%",
                  animation: "pulse 2s infinite"
                }}></span>
                SAFE
              </span>
            </div>
            
            {/* Confidence with Progress Bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ color: "#a0a0a0", fontSize: isMobile ? "0.9rem" : "1rem" }}>Confidence:</span>
                <span style={{ color: "#fff", fontWeight: "bold" }}>97%</span>
              </div>
              <div style={{ 
                width: "100%", 
                height: "6px", 
                background: "rgba(255,255,255,0.1)", 
                borderRadius: "3px",
                overflow: "hidden"
              }}>
                <div style={{ 
                  width: "97%", 
                  height: "100%", 
                  background: "linear-gradient(90deg, #00ff66, #00cc52)", 
                  borderRadius: "3px",
                  transition: "width 1s ease"
                }}></div>
              </div>
            </div>
            
            {/* Risk Level */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#a0a0a0", fontSize: isMobile ? "0.9rem" : "1rem" }}>Risk Level:</span>
              <span style={{ 
                color: "#ffaa00", 
                fontWeight: "bold",
                padding: "4px 12px",
                background: "rgba(255,170,0,0.1)",
                borderRadius: "20px",
                fontSize: isMobile ? "0.75rem" : "0.85rem"
              }}>
                LOW
              </span>
            </div>
            
            {/* Engine */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#a0a0a0", fontSize: isMobile ? "0.9rem" : "1rem" }}>Engine:</span>
              <span style={{ color: "#00ff66", fontWeight: "bold", fontSize: isMobile ? "0.9rem" : "1rem" }}>SentinelForge AI</span>
            </div>
          </div>

          {/* Additional Info for Desktop/Tablet */}
          {!isMobile && (
            <div style={{ 
              marginTop: "1.5rem", 
              paddingTop: "1rem", 
              borderTop: "1px solid rgba(0,255,102,0.2)" 
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
                <span style={{ color: "#a0a0a0" }}>Last Scan:</span>
                <span style={{ color: "#fff" }}>Just now</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                <span style={{ color: "#a0a0a0" }}>Threats Detected:</span>
                <span style={{ color: "#fff" }}>0</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Add animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }
      `}</style>
    </main>
  );
};

export default Home;