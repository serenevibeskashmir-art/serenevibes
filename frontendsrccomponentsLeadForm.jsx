import { useState } from "react";
import { EmailButton } from './frontendsrcApp.jsx';
export default function LeadForm({ onGenerated }) {
  const [destination, setDestination] = useState("Kashmir");
  const [days, setDays] = useState(5);
  const [clientName, setClientName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [clientEmail, setClientEmail] = useState("");
  const [kids,setKids]= useState(0);
  const [tripPace, setTripPace] = useState("Moderate");
  const [budgetTier, setBudgetTier] = useState("Mid-Range");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let endDate = startDate;
    if (startDate) {
      let dateObj = new Date(startDate);
      dateObj.setDate(dateObj.getDate() + parseInt(days));
      endDate = dateObj.toISOString().split("T")[0];
    }

    const payload = {
    destination: destination,
    days: parseInt(days) || 5,
    client_name: clientName || "Valued Client",
    client_email: clientEmail || "N/A",
    start_date: startDate || "TBD",
    adults: parseInt(adults) || 2,
    trip_pace: tripPace,
    kids: parseInt(kids) || 0,
    budget_tier: budgetTier
  };

    try {
      const response = await fetch("/api/itinerary/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate itinerary.");
      }

      onGenerated(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "550px", margin: "40px auto", padding: "32px", backgroundColor: "#ffffff", borderRadius: "16px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "20px", fontFamily: "system-ui, sans-serif" }}>
      {/* 1. Destination Field */}
      <div>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.5px" }}>
          📍 Destination
        </label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.95rem", color: "#0f172a", backgroundColor: "#f8fafc", boxSizing: "border-box" }}
          required
        />
      </div>

      {/* 2. Number of Days Field */}
      <div>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.5px" }}>
          📅 Number of Days
        </label>
        <input
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.95rem", color: "#0f172a", backgroundColor: "#f8fafc", boxSizing: "border-box" }}
          required
        />
      </div>
      {/* 3. Client Name Field */}
      <div>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.5px" }}>
          👤 Client Name
        </label>
        <input
          type="text"
          placeholder="e.g. John Doe"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.95rem", color: "#0f172a", backgroundColor: "#f8fafc", boxSizing: "border-box" }}
          required
        />
      </div>

      {/* 4. Client Email Field */}
      <div>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.5px" }}>
          ✉️ Client Email
        </label>
        <input
          type="email"
          placeholder="e.g. client@example.com"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.95rem", color: "#0f172a", backgroundColor: "#f8fafc", boxSizing: "border-box" }}
          required
        />
      </div>

      {/* 5. Travel Start Date Field */}
      <div>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.5px" }}>
          🗓️ Travel Start Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.95rem", color: "#0f172a", backgroundColor: "#f8fafc", boxSizing: "border-box" }}
          required
        />
      </div>

      {/* 6. Number of Adults Field */}
      <div>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.5px" }}>
          👥 Number of Adults
        </label>
        <input
          type="number"
          value={adults}
          onChange={(e) => setAdults(e.target.value)}
          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.95rem", color: "#0f172a", backgroundColor: "#f8fafc", boxSizing: "border-box" }}
          required
        />
      </div>
      {/* 6b. Number of Kids Field */}
      <div>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.5px" }}>
          👶 Number of Kids (Under 12)
        </label>
        <input
          type="number"
          min="0"
          value={kids}
          onChange={(e) => setKids(e.target.value)}
          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.95rem", color: "#0f172a", backgroundColor: "#f8fafc", boxSizing: "border-box" }}
        />
      </div>
      {/* 7. Budget Tier Selection Field */}
      <div>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.5px" }}>
          💎 Budget Tier
        </label>
        <select
          value={budgetTier}
          onChange={(e) => setBudgetTier(e.target.value)}
          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.95rem", color: "#0f172a", backgroundColor: "#f8fafc", boxSizing: "border-box", cursor: "pointer" }}
        >
          <option value="Budget">Budget</option>
          <option value="Mid-Range">Mid-Range</option>
          <option value="Luxury">Luxury</option>
        </select>
      </div>

      {/* 8. Error Message Preview Banner */}
      {error && (
        <div style={{ padding: "10px 14px", backgroundColor: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "8px", color: "#dc2626", fontSize: "0.85rem", fontWeight: "500" }}>
          ⚠️ {error}
        </div>
      )}

      {/* 9. Premium Action Submit Button */}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px 24px",
          backgroundColor: loading ? "#64748b" : "#1e293b",
          color: "#ffffff",
          fontWeight: "700",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background-color 0.2s ease",
          marginTop: "10px"
        }}
      >
        {loading ? "Generating Luxury Plan..." : "✨ Generate Custom Itinerary"}
      </button>
    </form>
  );
}
