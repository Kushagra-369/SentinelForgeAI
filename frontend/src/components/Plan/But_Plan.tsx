import axios from "axios";
import { useState, useEffect } from "react";

export default function BuyPlan() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    // Load user from localStorage on component mount
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
  }, []);

  const plans = [
    {
      name: "Pro",
      monthly: "₹99/mo",
      yearly: "₹999/year",
      color: "#00ff66",
      badge: "",
      button: "Buy Now",
      features: [
        "20 Scans Per Day",
        "Email Scanner",
        "URL Scanner",
        "File Scanner",
        "Scan History",
        "Threat Dashboard",
        "AI Insights",
      ],
      planType: "pro_monthly",
      yearlyPlanType: "pro_yearly",
    },
    {
      name: "Unlimited",
      monthly: "₹299/mo",
      yearly: "₹2999/year",
      color: "#ffaa00",
      badge: "⭐ MOST POPULAR",
      button: "Buy Now",
      features: [
        "Unlimited Scans",
        "Advanced Threat Analytics",
        "Priority Processing",
        "Threat Intelligence",
        "Everything in Pro",
      ],
      planType: "unlimited_monthly",
      yearlyPlanType: "unlimited_yearly",
    },
    {
      name: "Lifetime",
      monthly: "₹4999",
      yearly: "One-Time Payment",
      color: "#ff4d4d",
      badge: "🔥 BEST VALUE",
      button: "Buy Now",
      features: [
        "Unlimited Forever",
        "All Future Features",
        "Lifetime Updates",
        "Priority Support",
        "Everything in Unlimited",
      ],
      planType: "lifetime",
      yearlyPlanType: "lifetime",
    },
  ];

  const handlePayment = async (planType: string, planName: string) => {
    if (!user?.email) {
      alert("Please Sign In First");
      // Redirect to login page
      window.location.href = "/login";
      return;
    }

    setLoading(planName);

    try {
      // Create order on backend
      const { data } = await axios.post(
        "https://sentinelforgeai.onrender.com/payment/create-order",
        {
          plan: planType,
          email: user.email,
        }
      );

      // Check if Razorpay script is loaded
      if (!(window as any).Razorpay) {
        alert("Payment system is loading. Please try again.");
        setLoading(null);
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount * 100, // Amount in paise
        currency: "INR",
        name: "SentinelForge AI",
        description: `${planName} Plan`,
        order_id: data.order_id,
        prefill: {
          name: user.name || "",
          email: user.email,
          contact: user.phone || "",
        },
        theme: {
          color: "#00ff66",
        },
        modal: {
          ondismiss: function() {
            setLoading(null);
          }
        },
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verifyResponse = await axios.post(
              "https://sentinelforgeai.onrender.com/payment/verify",
              {
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                email: user.email,
                plan: planType,
              }
            );

            if (verifyResponse.data.success) {
              // Update user's plan in localStorage
              const updatedUser = {
                ...user,
                plan: planType.includes("pro") ? "pro" : 
                      planType.includes("unlimited") ? "unlimited" : 
                      "lifetime",
                isPremium: true,
                subscriptionDate: new Date().toISOString(),
              };

              localStorage.setItem("user", JSON.stringify(updatedUser));
              setUser(updatedUser);
              
              alert("Payment Successful! Your plan has been upgraded.");
              
              // Redirect to dashboard or refresh
              window.location.href = "/dashboard";
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Payment verification failed. Please contact support.");
          }
          setLoading(null);
        },
      };

      const razor = new (window as any).Razorpay(options);
      razor.open();
    } catch (err: any) {
      console.error("Payment error:", err);
      
      if (err.response?.status === 401) {
        alert("Please sign in to make a purchase.");
        window.location.href = "/login";
      } else if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Payment Failed. Please try again.");
      }
      setLoading(null);
    }
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
        🚀 Secure payments powered by Razorpay
      </div>

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

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button
                onClick={() => {
                  if (plan.name === "Lifetime") {
                    handlePayment(plan.planType, plan.name);
                  } else {
                    handlePayment(plan.planType, `${plan.name} Monthly`);
                  }
                }}
                disabled={loading === plan.name}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: plan.color,
                  color: "#000",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: loading === plan.name ? "not-allowed" : "pointer",
                  opacity: loading === plan.name ? 0.6 : 1,
                }}
              >
                {loading === plan.name ? "Processing..." : plan.button}
              </button>
              
              {plan.name !== "Lifetime" && (
                <button
                  onClick={() => handlePayment(plan.yearlyPlanType, `${plan.name} Yearly`)}
                  disabled={loading === plan.name}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    background: "transparent",
                    color: plan.color,
                    border: `1px solid ${plan.color}`,
                    borderRadius: "8px",
                    fontWeight: 500,
                    cursor: loading === plan.name ? "not-allowed" : "pointer",
                    opacity: loading === plan.name ? 0.6 : 1,
                    fontSize: "0.9rem",
                  }}
                >
                  {loading === plan.name ? "Processing..." : "Buy Yearly"}
                </button>
              )}
            </div>
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