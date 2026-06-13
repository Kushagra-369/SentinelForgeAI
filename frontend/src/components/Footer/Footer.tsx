import { useState } from "react";

interface SocialLink {
    name: string;
    icon: string;
    url: string;
}

interface NavLink {
    name: string;
    path: string;
    icon: string;
}

interface Feature {
    name: string;
    icon: string;
}

export default function Footer() {
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);
    const currentYear = new Date().getFullYear();

    const navLinks: NavLink[] = [
        { name: "Home", path: "/", icon: "🏠" },
        { name: "Email Scanner", path: "/email-scanner", icon: "📧" },
        { name: "URL Scanner", path: "/url-scanner", icon: "🔗" },
        { name: "File Scanner", path: "/file-scanner", icon: "📁" },
        { name: "Dashboard", path: "/dashboard", icon: "📊" },
        { name: "About", path: "/about", icon: "ℹ️" },
    ];

    const features: Feature[] = [
        { name: "Email Analysis", icon: "📧" },
        { name: "URL Detection", icon: "🔗" },
        { name: "File Malware Scan", icon: "📁" },
        { name: "Threat Reports", icon: "📊" },
        { name: "AI Insights", icon: "🤖" },
        { name: "Real-time Alerts", icon: "⚡" },
    ];

    const socialLinks: SocialLink[] = [
        { name: "Linkedin", icon: "🐙", url: "https://www.linkedin.com/in/kushagra-chhabra-83b215355/" },
        { name: "LeetCode", icon: "💻", url: "https://leetcode.com/u/Kushagra-369/" },
        { name: "Github", icon: "🔗", url: "https://github.com/Kushagra-369" },
        {
            name: "Email",
            icon: "✉️",
            url: "mailto:kushagra369chhabra@gmail.com?subject=Portfolio%20Inquiry"
        }];

    const linkStyle = (isHovered: boolean): React.CSSProperties => ({
        color: isHovered ? "#00ff66" : "#9ca3af",
        textDecoration: "none",
        transition: "all 0.3s ease",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        transform: isHovered ? "translateX(5px)" : "translateX(0)",
    });

    return (
        <footer
            style={{
                borderTop: "1px solid rgba(0,255,102,0.15)",
                padding: "4rem 8% 2rem",
                marginTop: "6rem",
                background: "linear-gradient(180deg, #0a0a0a 0%, #050505 100%)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Animated Background Glow */}
            <div
                style={{
                    position: "absolute",
                    top: "-50%",
                    left: "-50%",
                    width: "200%",
                    height: "200%",
                    background: "radial-gradient(circle, rgba(0,255,102,0.03) 0%, transparent 70%)",
                    animation: "rotate 20s linear infinite",
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    maxWidth: "1400px",
                    margin: "0 auto",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Main Footer Content */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "3rem",
                        marginBottom: "3rem",
                    }}
                >
                    {/* Brand Section */}
                    <div
                        style={{
                            animation: "fadeInUp 0.6s ease-out",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: "1rem",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "2rem",
                                    display: "inline-block",
                                    animation: "pulse 2s ease-in-out infinite",
                                }}
                            >
                                🛡️
                            </span>
                            <h2
                                style={{
                                    color: "#00ff66",
                                    fontSize: "1.8rem",
                                    margin: 0,
                                    background: "linear-gradient(135deg, #00ff66 0%, #00cc44 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                SentinelForge AI
                            </h2>
                        </div>

                        <p
                            style={{
                                maxWidth: "350px",
                                color: "#9ca3af",
                                lineHeight: 1.7,
                                marginBottom: "1.5rem",
                                fontSize: "0.95rem",
                            }}
                        >
                            AI-powered cyber threat intelligence platform for detecting phishing emails,
                            malicious URLs, files, and online security risks in real-time.
                        </p>

                        {/* Trust Badge */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "8px 12px",
                                background: "rgba(0,255,102,0.05)",
                                borderRadius: "12px",
                                border: "1px solid rgba(0,255,102,0.1)",
                                width: "fit-content",
                            }}
                        >
                            <span style={{ fontSize: "1.2rem" }}>⭐</span>
                            <span style={{ color: "#00ff66", fontSize: "0.875rem", fontWeight: 600 }}>
                                Trusted by Security Teams
                            </span>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div
                        style={{
                            animation: "fadeInUp 0.6s ease-out 0.1s both",
                        }}
                    >
                        <h3
                            style={{
                                marginBottom: "1.5rem",
                                color: "#fff",
                                fontSize: "1.2rem",
                                fontWeight: 600,
                            }}
                        >
                            Quick Navigation
                        </h3>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.8rem",
                            }}
                        >
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.path}
                                    style={linkStyle(hoveredLink === link.name)}
                                    onMouseEnter={() => setHoveredLink(link.name)}
                                    onMouseLeave={() => setHoveredLink(null)}
                                >
                                    <span style={{ fontSize: "1.1rem" }}>{link.icon}</span>
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Features */}
                    <div
                        style={{
                            animation: "fadeInUp 0.6s ease-out 0.2s both",
                        }}
                    >
                        <h3
                            style={{
                                marginBottom: "1.5rem",
                                color: "#fff",
                                fontSize: "1.2rem",
                                fontWeight: 600,
                            }}
                        >
                            Core Features
                        </h3>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: "0.8rem",
                            }}
                        >
                            {features.map((feature) => (
                                <div
                                    key={feature.name}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        color: "#9ca3af",
                                        fontSize: "0.9rem",
                                        transition: "all 0.3s",
                                        cursor: "pointer",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = "#00ff66";
                                        e.currentTarget.style.transform = "translateX(5px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = "#9ca3af";
                                        e.currentTarget.style.transform = "translateX(0)";
                                    }}
                                >
                                    <span>{feature.icon}</span>
                                    <span>{feature.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Connect With Us */}
                    <div
                        style={{
                            animation: "fadeInUp 0.6s ease-out 0.3s both",
                        }}
                    >
                        <h3
                            style={{
                                marginBottom: "1.5rem",
                                color: "#fff",
                                fontSize: "1.2rem",
                                fontWeight: 600,
                            }}
                        >
                            Connect With Us
                        </h3>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                                marginBottom: "1.5rem",
                            }}
                        >
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        color: "#9ca3af",
                                        textDecoration: "none",
                                        transition: "all 0.3s",
                                        padding: "8px",
                                        borderRadius: "8px",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = "#00ff66";
                                        e.currentTarget.style.background = "rgba(0,255,102,0.05)";
                                        e.currentTarget.style.transform = "translateX(5px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = "#9ca3af";
                                        e.currentTarget.style.background = "transparent";
                                        e.currentTarget.style.transform = "translateX(0)";
                                    }}
                                >
                                    <span style={{ fontSize: "1.2rem" }}>{social.icon}</span>
                                    <span>{social.name}</span>
                                </a>
                            ))}
                        </div>


                    </div>
                </div>

                {/* Bottom Bar */}
                <div
                    style={{
                        marginTop: "3rem",
                        paddingTop: "2rem",
                        borderTop: "1px solid rgba(255,255,255,0.08)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "1rem",
                    }}
                >
                    <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                        © {currentYear} SentinelForge AI. All rights reserved.
                    </div>

                    <div style={{ display: "flex", gap: "2rem" }}>
                        <a
                            href="/privacy"
                            style={{
                                color: "#6b7280",
                                textDecoration: "none",
                                fontSize: "0.875rem",
                                transition: "color 0.3s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = "#00ff66";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = "#6b7280";
                            }}
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="/terms"
                            style={{
                                color: "#6b7280",
                                textDecoration: "none",
                                fontSize: "0.875rem",
                                transition: "color 0.3s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = "#00ff66";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = "#6b7280";
                            }}
                        >
                            Terms of Service
                        </a>
                        <a
                            href="/contact"
                            style={{
                                color: "#6b7280",
                                textDecoration: "none",
                                fontSize: "0.875rem",
                                transition: "color 0.3s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = "#00ff66";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = "#6b7280";
                            }}
                        >
                            Contact
                        </a>
                    </div>

                    {/* Version Badge */}
                    <div
                        style={{
                            padding: "4px 10px",
                            background: "rgba(0,255,102,0.1)",
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            color: "#00ff66",
                            fontFamily: "monospace",
                        }}
                    >
                        v2.0.0 • AI-Powered
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
        </footer>
    );
}