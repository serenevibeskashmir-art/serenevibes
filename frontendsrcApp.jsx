import { useState } from "react";
import LeadForm    from "./frontendsrccomponentsLeadForm.jsx";
import QuotePreview from "./frontendsrcpagesQuotePreview.jsx";

// ─── API helper ───────────────────────────────────────────────────────────────
const API_BASE_URL =
  window.location.origin === "http://localhost:5173"
    ? "http://localhost:5000/api"
    : "/api";

export const sendItineraryEmailApi = async (itineraryData) => {
  try {
    const response = await fetch(API_BASE_URL + "/email/send", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(itineraryData),
    });
    if (!response.ok) throw new Error("Server status: " + response.status);
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// ─── Email button ─────────────────────────────────────────────────────────────
export function EmailButton({ formData, itineraryContent }) {
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!formData.to_email && !formData.email_to) {
      alert("Please enter a client email address first.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        client_name: formData.clientName,
        destination: formData.destination,
        days:        formData.days,
        email_to:    formData.to_email || formData.clientEmail || formData.email_to,
        itinerary:   itineraryContent,
      };
      await sendItineraryEmailApi(payload);
      alert("Success! The itinerary PDF has been generated and emailed.");
    } catch (error) {
      console.error(error);
      alert("Failed to send email. Check Render backend logs for errors.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
      <button onClick={() => window.print()} type="button" className="btn-pdf">
        📄 Save as PDF
      </button>
      <button onClick={handleSendEmail} type="button" className="btn-email" disabled={loading}>
        {loading ? "Sending..." : "✉️ Email Itinerary"}
      </button>
    </div>
  );
}

// ─── App shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [quote, setQuote] = useState(null);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: "32px", fontFamily: "system-ui, sans-serif" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "900", color: "#0f172a", margin: "0 0 4px 0", letterSpacing: "-0.5px" }}>
          Serene Vibes Kashmir
        </h1>
        <p style={{ fontSize: "1.1rem", fontStyle: "italic", fontWeight: "500", color: "#0284c7", margin: "0 0 8px 0" }}>
          "A Poem In Motion"
        </p>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#475569", margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>
          Booking Dashboard
        </h2>
      </div>
      <LeadForm onGenerated={setQuote} />
      {quote && <QuotePreview quote={quote} />}
    </div>
  );
}
