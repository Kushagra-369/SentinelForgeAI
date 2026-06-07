export default function About() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "8rem 8%",
        color: "white",
      }}
    >
      {/* Header */}
      <section
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          marginBottom: "5rem",
        }}
      >
        <span
          style={{
            color: "#00ff66",
            fontWeight: 600,
          }}
        >
          ABOUT SENTINELFORGE AI
        </span>

        <h1
          style={{
            fontSize: "3.5rem",
            marginTop: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          Building Smarter Cyber Threat Detection
        </h1>

        <p
          style={{
            color: "#9ca3af",
            lineHeight: 1.8,
            fontSize: "1.1rem",
          }}
        >
          SentinelForge AI is an AI-powered cybersecurity
          platform designed to identify phishing attempts,
          malicious URLs, suspicious content, and emerging
          online threats using machine learning and threat
          intelligence techniques.
        </p>
      </section>

      {/* Mission */}
      <section
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          marginBottom: "4rem",
        }}
      >
        <h2
          style={{
            marginBottom: "1rem",
          }}
        >
          Our Mission
        </h2>

        <p
          style={{
            color: "#9ca3af",
            lineHeight: 1.8,
          }}
        >
          Cyber attacks continue to evolve every day.
          SentinelForge AI aims to make threat detection
          accessible, understandable, and intelligent by
          combining machine learning with practical
          cybersecurity analysis.
        </p>
      </section>

      {/* Capabilities */}
      <section
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          marginBottom: "4rem",
        }}
      >
        <h2
          style={{
            marginBottom: "2rem",
          }}
        >
          Platform Capabilities
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: "1.5rem",
          }}
        >
          {[
            "Phishing Email Detection",
            "Spam Classification",
            "URL Risk Analysis",
            "Threat Scoring",
            "Security Insights",
            "Threat Dashboard",
          ].map((feature) => (
            <div
              key={feature}
              style={{
                padding: "1.5rem",
                borderRadius: "16px",
                border: "1px solid #222",
                background: "#0b0b0b",
              }}
            >
              {feature}
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          marginBottom: "4rem",
        }}
      >
        <h2
          style={{
            marginBottom: "2rem",
          }}
        >
          How It Works
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <div>
            1. User submits an email or URL.
          </div>

          <div>
            2. AI models analyze threat indicators.
          </div>

          <div>
            3. Risk scoring engine evaluates severity.
          </div>

          <div>
            4. SentinelForge generates explanations and
            recommendations.
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            marginBottom: "1rem",
          }}
        >
          Future Vision
        </h2>

        <p
          style={{
            color: "#9ca3af",
            lineHeight: 1.8,
          }}
        >
          Future versions of SentinelForge AI will include
          login anomaly detection, DNS threat analysis,
          malware intelligence, log monitoring, and advanced
          threat correlation capabilities to provide a more
          comprehensive cyber defense platform.
        </p>
      </section>
    </main>
  );
}