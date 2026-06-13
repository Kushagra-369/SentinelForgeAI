import { useEffect, useState } from "react";

interface Feature {
  name: string;
  icon: string;
  description: string;
}

interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
}

export default function About() {
  const [, setIsVisible] = useState<boolean[]>([]);

  useEffect(() => {
    // Trigger animations on mount
    const timeouts = [0, 100, 200, 300, 400].map((delay, index) => {
      return setTimeout(() => {
        setIsVisible(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, delay);
    });

    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }, []);

  const features: Feature[] = [
    { name: "Phishing Email Detection", icon: "🎣", description: "Identifies sophisticated phishing attempts and social engineering attacks" },
    { name: "Spam Classification", icon: "📧", description: "Filters unwanted emails with high accuracy using ML models" },
    { name: "URL Risk Analysis", icon: "🔗", description: "Analyzes suspicious links for malicious redirects and fake domains" },
    { name: "Threat Scoring", icon: "🎯", description: "Provides risk scores from 0-100% with detailed explanations" },
    { name: "Security Insights", icon: "💡", description: "Offers actionable recommendations to mitigate identified threats" },
    { name: "Threat Dashboard", icon: "📊", description: "Real-time visualization of security metrics and threat trends" }
  ];

  const steps: Step[] = [
    { number: 1, title: "Submit Content", description: "User submits an email, URL, or file for analysis", icon: "📝" },
    { number: 2, title: "AI Analysis", description: "Machine learning models analyze threat indicators and patterns", icon: "🤖" },
    { number: 3, title: "Risk Scoring", description: "Risk scoring engine evaluates severity and confidence levels", icon: "⚡" },
    { number: 4, title: "Generate Report", description: "SentinelForge provides detailed explanations and recommendations", icon: "📋" }
  ];

  const stats = [
    { value: "98.7%", label: "Detection Accuracy", icon: "🎯" },
    { value: "< 1s", label: "Avg Response Time", icon: "⚡" },
    { value: "24/7", label: "Threat Monitoring", icon: "🛡️" },
    { value: "1000+", label: "Threat Patterns", icon: "📊" }
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "8rem 8%",
        color: "white",
        background: "linear-gradient(135deg, #0a0a0a 0%, #0f0f0f 100%)",
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          marginBottom: "6rem",
          textAlign: "center",
          animation: "fadeInUp 0.8s ease-out",
        }}
      >
        <span
          style={{
            color: "#00ff66",
            fontWeight: 600,
            letterSpacing: "2px",
            background: "rgba(0,255,102,0.1)",
            padding: "4px 12px",
            borderRadius: "20px",
            display: "inline-block",
            marginBottom: "1rem",
          }}
        >
          ABOUT SENTINELFORGE AI
        </span>

        <h1
          style={{
            fontSize: "4rem",
            marginTop: "1rem",
            marginBottom: "1.5rem",
            background: "linear-gradient(135deg, #fff 0%, #00ff66 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Building Smarter Cyber Threat Detection
        </h1>

        <p
          style={{
            color: "#9ca3af",
            lineHeight: 1.8,
            fontSize: "1.2rem",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          SentinelForge AI is an AI-powered cybersecurity platform designed to identify phishing attempts,
          malicious URLs, suspicious content, and emerging online threats using machine learning and
          threat intelligence techniques.
        </p>
      </section>

      {/* Stats Section */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          marginBottom: "6rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              style={{
                padding: "2rem",
                borderRadius: "20px",
                border: "1px solid #222",
                background: "#0b0b0b",
                textAlign: "center",
                transition: "transform 0.3s, box-shadow 0.3s",
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,255,102,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "0.5rem" }}>
                {stat.icon}
              </span>
              <h2 style={{ color: "#00ff66", fontSize: "2rem", marginBottom: "0.5rem" }}>
                {stat.value}
              </h2>
              <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          marginBottom: "6rem",
          animation: "fadeInUp 0.8s ease-out 0.2s both",
        }}
      >
        <div
          style={{
            padding: "3rem",
            borderRadius: "24px",
            border: "1px solid rgba(0,255,102,0.2)",
            background: "linear-gradient(135deg, #0b0b0b 0%, #0f0f0f 100%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <span style={{ fontSize: "2rem" }}>🎯</span>
            <h2 style={{ fontSize: "2rem" }}>Our Mission</h2>
          </div>
          <p
            style={{
              color: "#d1d5db",
              lineHeight: 1.8,
              fontSize: "1.1rem",
            }}
          >
            Cyber attacks continue to evolve every day. SentinelForge AI aims to make threat detection
            accessible, understandable, and intelligent by combining machine learning with practical
            cybersecurity analysis. We believe that everyone deserves protection from cyber threats,
            regardless of their technical expertise.
          </p>
        </div>
      </section>

      {/* Capabilities Section */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          marginBottom: "6rem",
        }}
      >
        <h2
          style={{
            marginBottom: "3rem",
            fontSize: "2rem",
            textAlign: "center",
            animation: "fadeInUp 0.6s ease-out",
          }}
        >
          🚀 Platform Capabilities
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {features.map((feature, index) => (
            <div
              key={feature.name}
              style={{
                padding: "1.5rem",
                borderRadius: "20px",
                border: "1px solid #222",
                background: "#0b0b0b",
                transition: "all 0.3s",
                animation: `fadeInUp 0.6s ease-out ${index * 0.05}s both`,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.borderColor = "#00ff66";
                e.currentTarget.style.boxShadow = "0 5px 20px rgba(0,255,102,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#222";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.5rem" }}>{feature.icon}</span>
                <h3 style={{ color: "#00ff66", fontSize: "1.1rem" }}>{feature.name}</h3>
              </div>
              <p style={{ color: "#9ca3af", fontSize: "0.875rem", lineHeight: 1.6 }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          marginBottom: "6rem",
        }}
      >
        <h2
          style={{
            marginBottom: "3rem",
            fontSize: "2rem",
            textAlign: "center",
            animation: "fadeInUp 0.6s ease-out",
          }}
        >
          🔄 How It Works
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {steps.map((step, index) => (
            <div
              key={step.number}
              style={{
                padding: "2rem",
                borderRadius: "20px",
                border: "1px solid #222",
                background: "#0b0b0b",
                textAlign: "center",
                position: "relative",
                transition: "all 0.3s",
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.borderColor = "#00ff66";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.borderColor = "#222";
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "#00ff66",
                  color: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem auto",
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                }}
              >
                {step.number}
              </div>
              <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }}>
                {step.icon}
              </span>
              <h3 style={{ color: "#00ff66", marginBottom: "0.5rem" }}>{step.title}</h3>
              <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>{step.description}</p>
              {index < steps.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    right: "-1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "2rem",
                    color: "#00ff66",
                    display: "none",
                  }}
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          marginBottom: "6rem",
        }}
      >
        <h2
          style={{
            marginBottom: "3rem",
            fontSize: "2rem",
            textAlign: "center",
            animation: "fadeInUp 0.6s ease-out",
          }}
        >
          🛠️ Technology Stack
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          {[
            { name: "React", icon: "⚛️" },
            { name: "TypeScript", icon: "📘" },
            { name: "FastAPI", icon: "🚀" },
            { name: "MongoDB", icon: "🍃" },
            { name: "Machine Learning", icon: "🧠" },
            { name: "TensorFlow", icon: "🔷" },
            { name: "Scikit-learn", icon: "📊" },
            { name: "NLP", icon: "💬" }
          ].map((tech, index) => (
            <div
              key={tech.name}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "40px",
                border: "1px solid #222",
                background: "#0b0b0b",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.3s",
                animation: `fadeInUp 0.4s ease-out ${index * 0.03}s both`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#00ff66";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#222";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <span>{tech.icon}</span>
              <span style={{ color: "#00ff66" }}>{tech.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Future Vision Section */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            padding: "3rem",
            borderRadius: "24px",
            border: "1px solid rgba(0,255,102,0.2)",
            background: "linear-gradient(135deg, rgba(0,255,102,0.05) 0%, rgba(0,255,102,0) 100%)",
            animation: "fadeInUp 0.8s ease-out",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <span style={{ fontSize: "2rem" }}>🔮</span>
            <h2 style={{ fontSize: "2rem" }}>Future Vision</h2>
          </div>
          <p
            style={{
              color: "#d1d5db",
              lineHeight: 1.8,
              fontSize: "1.1rem",
              marginBottom: "1.5rem",
            }}
          >
            Future versions of SentinelForge AI will include login anomaly detection, DNS threat analysis,
            malware intelligence, log monitoring, and advanced threat correlation capabilities to provide
            a more comprehensive cyber defense platform.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            {[
              "Login Anomaly Detection",
              "DNS Threat Analysis",
              "Malware Intelligence",
              "Log Monitoring",
              "Threat Correlation"
            ].map((feature) => (
              <span
                key={feature}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  background: "rgba(0,255,102,0.1)",
                  border: "1px solid rgba(0,255,102,0.2)",
                  color: "#00ff66",
                  fontSize: "0.875rem",
                }}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </main>
  );
}