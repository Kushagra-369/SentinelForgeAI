
export default function BuyPlan() {
const plans = [
{
name: "Pro",
monthly: "₹99/mo",
yearly: "₹999/year",
color: "#00ff66",
badge: "",
button: "Join Waitlist",
features: [
"20 Scans Per Day",
"Email Scanner",
"URL Scanner",
"File Scanner",
"Scan History",
"Threat Dashboard",
"AI Insights",
],
},
{
name: "Unlimited",
monthly: "₹299/mo",
yearly: "₹2999/year",
color: "#ffaa00",
badge: "⭐ MOST POPULAR",
button: "Coming Soon",
features: [
"Unlimited Scans",
"Advanced Threat Analytics",
"Priority Processing",
"Threat Intelligence",
"Everything in Pro",
],
},
{
name: "Lifetime",
monthly: "₹4999",
yearly: "One-Time Payment",
color: "#ff4d4d",
badge: "🔥 BEST VALUE",
button: "Early Access",
features: [
"Unlimited Forever",
"All Future Features",
"Lifetime Updates",
"Priority Support",
"Everything in Unlimited",
],
},
];

return (
<main
style={{
minHeight: "100vh",
padding: "8rem 8%",
color: "white",
}}
>
{/* Banner */}
<div
style={{
background: "#111",
border: "1px solid #222",
borderRadius: "16px",
padding: "1rem",
textAlign: "center",
marginBottom: "3rem",
}}
>
🚀 Premium Plans Launching Soon — Payments are
currently unavailable while we prepare our public
release. </div>

  {/* Header */}
  <div
    style={{
      textAlign: "center",
      marginBottom: "4rem",
    }}
  >
    <span
      style={{
        color: "#00ff66",
        fontWeight: 600,
      }}
    >
      SENTINELFORGE AI PREMIUM
    </span>

    <h1
      style={{
        fontSize: "3.5rem",
        marginTop: "1rem",
      }}
    >
      Choose Your Security Plan
    </h1>

    <p
      style={{
        color: "#9ca3af",
        maxWidth: "700px",
        margin: "1rem auto",
        lineHeight: 1.8,
      }}
    >
      SentinelForge AI Premium is launching soon.
      Join the waitlist to get early access and
      exclusive launch pricing.
    </p>
  </div>

  {/* Pricing Cards */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(320px,1fr))",
      gap: "2rem",
    }}
  >
    {plans.map((plan) => (
      <div
        key={plan.name}
        style={{
          background: "#0b0b0b",
          border: `1px solid ${plan.color}`,
          borderRadius: "24px",
          padding: "2rem",
          position: "relative",
        }}
      >
        {plan.badge && (
          <div
            style={{
              color: plan.color,
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            {plan.badge}
          </div>
        )}

        <h2
          style={{
            color: plan.color,
            fontSize: "2rem",
          }}
        >
          {plan.name}
        </h2>

        <h1
          style={{
            marginTop: "1rem",
            marginBottom: "0.5rem",
          }}
        >
          {plan.monthly}
        </h1>

        <p
          style={{
            color: "#9ca3af",
            marginBottom: "2rem",
          }}
        >
          {plan.yearly}
        </p>

        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginBottom: "2rem",
            paddingLeft: "1rem",
          }}
        >
          {plan.features.map((feature) => (
            <li key={feature}>
              ✓ {feature}
            </li>
          ))}
        </ul>

        <button
          onClick={() =>
            alert(
              "Premium plans are launching soon. Stay tuned!"
            )
          }
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            background: plan.color,
            color: "black",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {plan.button}
        </button>
      </div>
    ))}
  </div>

  {/* Why Upgrade */}
  <div
    style={{
      marginTop: "4rem",
      background: "#0b0b0b",
      border: "1px solid #222",
      borderRadius: "24px",
      padding: "2rem",
    }}
  >
    <h2
      style={{
        marginBottom: "1.5rem",
      }}
    >
      Why Upgrade?
    </h2>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(250px,1fr))",
        gap: "1rem",
      }}
    >
      <div>✓ More Daily Scans</div>
      <div>✓ Full Scan History</div>
      <div>✓ AI Threat Intelligence</div>
      <div>✓ Advanced Analytics</div>
      <div>✓ Priority Support</div>
      <div>✓ Future Premium Features</div>
    </div>
  </div>
</main>


);
}
