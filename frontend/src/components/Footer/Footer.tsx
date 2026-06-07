export default function Footer() {
    return (
        <footer
            style={{
                borderTop: "1px solid rgba(0,255,0,0.15)",
                padding: "4rem 8%",
                marginTop: "6rem",
                background: "#050505",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "3rem",
                }}
            >
                {/* Brand */}
                <div>
                    <h2
                        style={{
                            color: "#00ff66",
                            marginBottom: "1rem",
                        }}
                    >
                        SentinelForge AI
                    </h2>

                    <p
                        style={{
                            maxWidth: "350px",
                            color: "#9ca3af",
                            lineHeight: 1.7,
                        }}
                    >
                        AI-powered cyber threat intelligence platform
                        for detecting phishing emails, malicious URLs,
                        and online security risks.
                    </p>
                </div>

                {/* Navigation */}
                <div>
                    <h3 style={{ marginBottom: "1rem" }}>
                        Navigation
                    </h3>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.7rem",
                        }}
                    >
                        <a href="/" style={linkStyle}>
                            Home
                        </a>

                        <a href="/email-scanner" style={linkStyle}>
                            Email Scanner
                        </a>

                        <a href="/url-scanner" style={linkStyle}>
                            URL Scanner
                        </a>

                        <a href="/dashboard" style={linkStyle}>
                            Dashboard
                        </a>

                        <a href="/about" style={linkStyle}>
                            About
                        </a>
                    </div>
                </div>

                {/* Features */}
                <div>
                    <h3 style={{ marginBottom: "1rem" }}>
                        Features
                    </h3>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.7rem",
                            color: "#9ca3af",
                        }}
                    >
                        <span>Email Analysis</span>
                        <span>URL Detection</span>
                        <span>Threat Reports</span>
                        <span>AI Insights</span>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div
                style={{
                    marginTop: "3rem",
                    paddingTop: "1.5rem",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    textAlign: "center",
                    color: "#6b7280",
                }}
            >
                © {new Date().getFullYear()} SentinelForge AI.
                All rights reserved.
            </div>
        </footer>
    );
}

const linkStyle = {
    color: "#9ca3af",
    textDecoration: "none",
};