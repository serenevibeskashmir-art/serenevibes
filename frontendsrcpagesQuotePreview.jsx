const UI_THEME = {
  colors: {
    primary: "#1e293b",     // Deep dark slate for primary titles
    accent: "#0284c7",      // Premium sky blue for interactive highlights
    background: "#f8fafc",  // Soft grayish-white layout backdrop
    cardBg: "#ffffff",      // Crisp clean white for cards
    border: "#e2e8f0",      // Thin elegant borders
    textDark: "#0f172a",    // High-contrast readable gray-black body text
    textLight: "#64748b",   // Soft gray for labels and secondary subtitles
    success: "#10b981",    // Vibrant green for chosen/active card status
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  }
};
const TRANSIT_OPTIONS = [  
  "Airport Pickup and Local Sightseeing: Overnight Srinagar",
  "Srinagar Local Sightseeing: Overnight Srinagar",
  "Srinagar to Gulmarg: Overnight Srinagar",
  "Srinagar to Pahalgam: Overnight Pahalgam",
  "Pahalgam to Srinagar: Overnight Srinagar",
  "Srinagar to Sonamarg: Overnight Srinagar",
  "Gulmarg to Pahalgam: Overnight Pahalgam",
  "Srinagar to Doodhpathri: Overnight Srinagar",
  "Airport Drop-Departure"
];
const ROUTE_SCHEDULE_TEMPLATES = {
  "Srinagar Local Sightseeing: Overnight Srinagar": [
    { time_slot: "***", description: "Srinagar, the summer capital of Jammu & Kashmir, is known for its Mughal-era gardens and the scenic Dal Lake." },
    { time_slot: "***", description: "Visit famous Mughal Gardens: Nishat Bagh and Shalimar Bagh." },
    { time_slot: "***", description: "Enjoy a relaxing 1-hour Shikara ride on Dal Lake." },
    { time_slot: "***", description: "Explore the historic Shankaracharya Temple for a panoramic city view." }
  ],
  "Srinagar to Gulmarg: Overnight Srinagar": [
    { time_slot: "***", description: "Gulmarg, the Meadow of Flowers, is a hill station famous for its alpine meadows and one of the world's highest cable car rides." },
    { time_slot: "***", description: "Drive from Srinagar to Gulmarg (Meadow of Flowers)." },
    { time_slot: "***", description: "Enjoy the famous Gondola Cable Car Ride (Phase 1 & Phase 2)." },
    { time_slot: "***", description: "Drive back to Srinagar for overnight stay." }
  ],
  "Srinagar to Pahalgam: Overnight Pahalgam": [
    { time_slot: "***", description: "Pahalgam, the Valley of Shepherds, is reached via Pampore's saffron fields and the ancient Avantipur temple ruins." },
    { time_slot: "***", description: "Proceed towards Pahalgam past the saffron fields of Pampore, the marvelous ruins of Awantipur and the village of Bijbehara which remains famous as the breadbasket of Kashmir." },
    { time_slot: "***", description: "Check-in at Pahalgam hotel and head out for local sightseeing." },
    { time_slot: "***", description: "Visit Aru Valley, Betaab Valley, and Chandanwari via local cabs." }
  ],
  "Pahalgam to Srinagar: Overnight Srinagar": [
    { time_slot: "***", description: "Returning to Srinagar retraces the same scenic saffron-field and riverside route from Pahalgam." },
    { time_slot: "***", description: "Proceed towards Srinagar past the saffron fields of Pampore, the marvelous ruins of Awantipur and the village of Bijbehara which remains famous as the breadbasket of Kashmir." },
    { time_slot: "***", description: "Check-in at Srinagar hotel and head out for local sightseeing." },
    { time_slot: "***", description: "Visit famous Mughal Gardens: Nishat Bagh and Shalimar Bagh." }
  ],
  "Srinagar to Sonamarg: Overnight Srinagar": [
    { time_slot: "***", description: "Sonamarg, the Meadow of Gold, sits along the Sindh River and is the gateway to the Thajiwas Glacier." },
    { time_slot: "***", description: "Day excursion to Sonamarg (Meadow of Gold) along the Sindh River." },
    { time_slot: "***", description: "Visit Thajiwas Glacier via pony or local union vehicle." },
    { time_slot: "***", description: "Return drive back to Srinagar for overnight stay." }
  ],
  "Gulmarg to Pahalgam: Overnight Pahalgam": [
    { time_slot: "***", description: "This route connects Kashmir's premier hill station to the Valley of Shepherds via scenic village roads." },
    { time_slot: "***", description: "Drive from Gulmarg down to Pahalgam via scenic village routes." },
    { time_slot: "***", description: "Explore the local Pahalgam market and riverside walk." }
  ],
  "Airport Pickup and Local Sightseeing: Overnight Srinagar": [
    { time_slot: "Arrival", description: "Your Kashmir journey begins in Srinagar, set on the banks of Dal Lake amid the Mughal gardens." },
    { time_slot: "***", description: "Welcome to Kashmir, Paradise on Earth! Our representative will meet you at the Srinagar International Airport and take you to your hotel." },
    { time_slot: "***", description: "On the beginning of Day-1, you will head out for local sightseeing that includes a visit to the famous Mughal gardens of Nishat and Shalimar, Chashma Shahi Garden and Pari Mahal.You can spend the evening exploring Dal Lake and then head back to your hotel or houseboat for the overnight stay." }
  ],
  "Srinagar to Doodhpathri: Overnight Srinagar": [
    { time_slot: "***", description: "Doodhpathri, the Valley of Milk, is a pristine offbeat meadow fed by the Shaliganga river stream." },
    { time_slot: "***", description: "Drive to Doodhpathri (Valley of Milk), a pristine offbeat meadow." },
    { time_slot: "***", description: "Enjoy walks along the roaring Shaliganga river stream." },
    { time_slot: "***", description: "Drive back to Srinagar." }
  ],
  "Airport Drop-Departure": [
    { time_slot: "Departure", description: "Your Kashmir tour concludes with departure from Srinagar International Airport." },
    { time_slot: "***", description: "Breakfast at hotel and complete check-out formalities." },
    { time_slot: "***", description: "Transfer to Srinagar International Airport for departure flight." }
  ]
};

import React, { useState, useEffect } from "react";
// ── STEP 1: Hotel Knowledge Base ──────────────────────────────────────────
// "images": fill in 2+ real photo URLs per hotel. These are sent to the
// backend alongside hotelSelections and used to render the "Hotel Reference
// Photos" section in the generated PDF (right after the day-wise plan).
const HOTEL_KB = {
  srinagar: [
    {id: "ngm", name: "Hotel New Green Meadows", place: "Srinagar", images: []},
    {id: "nclr", name: "New Classic Luxury Resorts", place: "Srinagar", images: []},
    {id: "hsp", name: "Hotel Sideeq Palace", place: "Srinagar", images: []},
    {id: "htv", name: "Hotel The Victory", place: "Srinagar", images: []},
    {id: "htk", name: "Hotel The Karims", place: "Srinagar", images: []},
    {id: "hgr", name: "Hotel Gurcoo Residency", place: "Srinagar", images: []},
    {id: "hdw", name: "Hotel Deewan", place: "Srinagar", images: []},
    {id: "hsd", name: "Hotel Sadaf", place: "Srinagar", images: []},
    {id: "sghb", name: "Srinagar Group of House-Boats", place: "Srinagar", images: []},
    {id: "hicl", name: "Hotel Iceland", place: "Srinagar", images: []},
  ],
  
  pahalgam: [
    {id: "hri", name: "Hotel Riverside Inn", place: "Pahalgam", images: []},
    {id: "hsr", name: "Hotel Supreme Resorts", place: "Pahalgam", images: []},
    {id: "hhr", name: "Hotel Highland Resorts", place: "Pahalgam", images: []},
    {id: "hfh", name: "Hotel Falcon Heights", place: "Pahalgam", images: []},
    {id: "hlr", name: "Hotel Lavish Residency", place: "Pahalgam", images: []},
    {id: "hil", name: "Hotel Ice Land", place: "Pahalgam", images: []},
    {id: "her", name: "Hotel Eden Resorts and Spa", place: "Pahalgam", images: []},
  ],
  gulmarg: [
    {id: "hatr", name: "Hotel Apple Tree Resorts", place: "Gulmarg", images: []},
    {id: "ggr", name: "Gulmarg Gateway Resorts", place: "Gulmarg", images: []},
    {id: "hghv", name: "Hotel Grand Hill View", place: "Gulmarg", images: []},
    {id: "hmsp", name: "Hotel Marina By Stay Pattern", place: "Gulmarg", images: []},
  ],
  
};

// Maps each overnight_stay value (from backend) → which KB key to show
function getHotelGroup(overnight_stay = "") {
  const s = overnight_stay.toLowerCase();
  
  if (s.includes("pahalgam"))   return "pahalgam";
  if (s.includes("gulmarg"))    return "gulmarg";
  if (s.includes("sonamarg"))   return "sonamarg"
  return "srinagar"; // default
}
// ──────────────────────────────────────────────────────────────────────────

// ── Hotel Cost Dashboard (inline — no separate file needed) ───────────────
// Formula per hotel row: (Nights × Rooms × RoomRate) + (Nights × EB × EBRate)
function calcRowTotal(row) {
  const n  = Number(row.stays)    || 0;
  const r  = Number(row.rooms)    || 0;
  const eb = Number(row.eb)       || 0;
  const rr = Number(row.roomRate) || 0;
  const er = Number(row.ebRate)   || 0;
  return (n * r * rr) + (n * eb * er);
}

function fmtINR(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

// Flat lookup built from HOTEL_KB already defined in this file
const ALL_HOTELS_FLAT = Object.values(HOTEL_KB).flat().reduce((acc, h) => { acc[h.id] = h; return acc; }, {});

// onTotalChange(grandTotal) → syncs editableCost in QuotePreview
// cabCost = single trip-level cab cost added once to the grand total
function HotelCostDashboard({ hotelSelections = {}, timeline = [], onTotalChange }) {
  const buildRows = (prev = {}) => {
    const next = {};
    Object.values(hotelSelections).forEach((hotelId) => {
      if (!hotelId || !ALL_HOTELS_FLAT[hotelId]) return;
      next[hotelId] = prev[hotelId] || {
        hotelId,
        stays: 1, rooms: 1, eb: 0, cnb: 0, roomRate: 0, ebRate: 0,
      };
    });
    return next;
  };

  const [rows, setRows]       = React.useState(() => buildRows());
  const [cabCost, setCabCost] = React.useState(0); // single trip-level cab cost

  React.useEffect(() => {
    setRows((prev) => buildRows(prev));
  }, [hotelSelections]);

  // Notify parent whenever rows or cabCost changes
  React.useEffect(() => {
    if (onTotalChange) {
      const hotelTotal = Object.values(rows).reduce((sum, r) => sum + calcRowTotal(r), 0);
      onTotalChange(hotelTotal + (Number(cabCost) || 0));
    }
  }, [rows, cabCost]);

  const handleChange = (hotelId, field, value) => {
    setRows((prev) => ({
      ...prev,
      [hotelId]: { ...prev[hotelId], [field]: value },
    }));
  };

  // Map hotelId → which day numbers it's assigned to
  const hotelDaysMap = {};
  Object.entries(hotelSelections).forEach(([dayIdx, hotelId]) => {
    if (!hotelId) return;
    if (!hotelDaysMap[hotelId]) hotelDaysMap[hotelId] = [];
    hotelDaysMap[hotelId].push(Number(dayIdx) + 1);
  });

  const rowList    = Object.values(rows);
  const hotelTotal = rowList.reduce((sum, r) => sum + calcRowTotal(r), 0);
  const grandTotal = hotelTotal + (Number(cabCost) || 0);

  const thStyle = {
    padding: "8px 10px", backgroundColor: "#f1f5f9", color: "#475569",
    fontWeight: "700", fontSize: "0.73rem", textTransform: "uppercase",
    letterSpacing: "0.4px", borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap", textAlign: "left",
  };
  const tdStyle = {
    padding: "8px 10px", borderBottom: "1px solid #f1f5f9",
    color: "#0f172a", verticalAlign: "middle",
  };
  const numInput = {
    width: "72px", padding: "5px 6px", border: "1px solid #cbd5e1",
    borderRadius: "6px", fontSize: "0.82rem", color: "#0f172a",
    backgroundColor: "#f8fafc", textAlign: "center",
  };

  return (
    <div style={{
      marginTop: "32px", backgroundColor: "#ffffff",
      border: "1px solid #e2e8f0", borderRadius: "12px",
      padding: "20px 24px", fontFamily: "system-ui, sans-serif",
    }}>
      {/* Header */}
      <div style={{ marginBottom: "14px", paddingBottom: "12px", borderBottom: "1px solid #e2e8f0" }}>
        <p style={{ margin: 0, fontSize: "1rem", fontWeight: "700", color: "#0f172a" }}>
          🏨 Hotel Cost Breakdown
        </p>
        <p style={{ margin: "3px 0 0", fontSize: "0.78rem", color: "#64748b" }}>
          Hotels auto-fetched from assignments above · Formula: (Nights × Rooms × Room Rate) + (Nights × EB × EB Rate) + Trip Cab Cost
        </p>
      </div>

      {rowList.length === 0 ? (
        <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.85rem", padding: "24px 0" }}>
          No hotels assigned yet. Use the hotel picker above for each day — they will appear here automatically.
        </p>
      ) : (
        <>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Hotel</th>
                  <th style={thStyle}>Assigned Days</th>
                  <th style={thStyle}>Nights</th>
                  <th style={thStyle}>Rooms</th>
                  <th style={thStyle}>EB</th>
                  <th style={thStyle}>CNB</th>
                  <th style={thStyle}>Room Rate/Night (₹)</th>
                  <th style={thStyle}>EB Rate/Night (₹)</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {rowList.map((row) => {
                  const hotel = ALL_HOTELS_FLAT[row.hotelId];
                  const days  = (hotelDaysMap[row.hotelId] || []).sort((a, b) => a - b);
                  return (
                    <tr key={row.hotelId}>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: "600", color: "#1e293b" }}>{hotel.name}</div>
                        <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "1px" }}>📍 {hotel.place}</div>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                          {days.map((d) => (
                            <span key={d} style={{
                              padding: "2px 7px", borderRadius: "999px",
                              backgroundColor: "#eff6ff", color: "#1d4ed8",
                              fontSize: "0.72rem", fontWeight: "700",
                            }}>Day {d}</span>
                          ))}
                        </div>
                      </td>
                      {["stays","rooms","eb","cnb","roomRate","ebRate"].map((field) => (
                        <td key={field} style={tdStyle}>
                          <input
                            type="number" min="0"
                            style={numInput}
                            value={row[field]}
                            onChange={(e) => handleChange(row.hotelId, field, e.target.value)}
                          />
                        </td>
                      ))}
                      <td style={{ ...tdStyle, textAlign: "right", fontWeight: "700", color: "#0284c7" }}>
                        {fmtINR(calcRowTotal(row))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Trip-level Cab Cost + Grand Total footer */}
          <div style={{
            display: "flex", justifyContent: "flex-end", alignItems: "center",
            gap: "20px", marginTop: "14px", paddingTop: "12px",
            borderTop: "2px solid #e2e8f0", flexWrap: "wrap",
          }}>
            {/* Hotel subtotal */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "0.82rem", color: "#475569", fontWeight: "600" }}>🏨 Hotel Subtotal:</span>
              <span style={{ fontSize: "1rem", fontWeight: "700", color: "#0284c7" }}>{fmtINR(hotelTotal)}</span>
            </div>

            <div style={{ width: "1px", height: "24px", backgroundColor: "#e2e8f0" }} />

            {/* Single cab cost input for the full trip */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <label style={{ fontSize: "0.82rem", color: "#854d0e", fontWeight: "600", whiteSpace: "nowrap" }}>
                🚗 Cab Cost – Full Trip (₹):
              </label>
              <input
                type="number"
                min="0"
                value={cabCost}
                onChange={(e) => setCabCost(e.target.value)}
                style={{
                  width: "110px", padding: "6px 8px",
                  border: "1px solid #fde047", borderRadius: "6px",
                  fontSize: "0.88rem", color: "#854d0e",
                  backgroundColor: "#fef9c3", textAlign: "center", fontWeight: "600",
                }}
              />
            </div>

            <div style={{ width: "1px", height: "24px", backgroundColor: "#e2e8f0" }} />

            {/* Grand total = hotel + cab */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "0.9rem", color: "#0f172a", fontWeight: "700" }}>Grand Total (Hotel + Cab):</span>
              <span style={{ fontSize: "1.25rem", fontWeight: "800", color: "#10b981" }}>{fmtINR(grandTotal)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function QuotePreview({ quote }) {
  const [timeline, setTimeline] = useState(quote?.itinerary_timeline || []);
  const [activeDay, setActiveDay] = useState(0); 
  const [editableCost, setEditableCost] = useState(quote?.financial_summary?.total_payable_inr || 38500);
  const [hotelSelections, setHotelSelections] = useState({});

  useEffect(() => {
    if (quote?.financial_summary?.total_payable_inr) {
      setEditableCost(quote.financial_summary.total_payable_inr);
    }
  }, [quote]);

  useEffect(() => {
    if (quote?.itinerary_timeline) {
      setTimeline(quote.itinerary_timeline);
      setActiveDay(0); 
    }
  }, [quote]);

  const handleDescriptionChange = (dayIndex, activityIndex, newValue) => {
    const updatedTimeline = [...timeline];
    updatedTimeline[dayIndex].schedule[activityIndex].description = newValue;
    setTimeline(updatedTimeline);
  };

  return (
    <div style={{ padding: "24px", backgroundColor: UI_THEME.colors.background, minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
      {/* 1. Dashboard Header Banner */}
      <div style={{ marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid" + UI_THEME.colors.border }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: "800", color: UI_THEME.colors.primary, margin: "0 0 6px 0" }}>
          ✨ Live Itinerary Preview & Customizer
        </h2>
        <p style={{ margin: 0, fontSize: "0.9rem", color: UI_THEME.colors.textLight }}>
          Review or edit the day-by-day plan details below before saving.
        </p>
      </div>

      {/* 2. Unified Client Metadata Summary Bar */}
      <div style={{ 
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", 
        backgroundColor: UI_THEME.colors.cardBg, padding: "16px 20px", borderRadius: "12px", 
        boxShadow: UI_THEME.shadows.sm, border: "1px solid" + UI_THEME.colors.border, marginBottom: "24px" 
      }}>
        <div style={{ fontSize: "0.9rem", color: UI_THEME.colors.textDark }}><strong style={{ color: UI_THEME.colors.textLight }}>Client:</strong> {quote?.meta_summary?.client_name || "N/A"}</div>
        <div style={{ fontSize: "0.9rem", color: UI_THEME.colors.textDark }}><strong style={{ color: UI_THEME.colors.textLight }}>Budget Tier:</strong> {quote?.meta_summary?.budget_tier || "N/A"}</div>
        <div style={{ fontSize: "0.9rem", color: UI_THEME.colors.textDark }}><strong style={{ color: UI_THEME.colors.textLight }}>Vehicle:</strong> {quote?.meta_summary?.vehicle_type || "N/A"}</div>
      </div>

      <div style={styles.tabContainer}>
        {timeline.map((dayData, idx) => (
          <button 
            key={idx}
            onClick={() => setActiveDay(idx)}
            style={{
              ...styles.tabButton,
              backgroundColor: activeDay === idx ? "#1e293b" : "#f1f5f9",
              color: activeDay === idx ? "#fff" : "#334155"
            }}
          >
            Day {dayData.day}
          </button>
        ))}
      </div>

      {timeline[activeDay] && (
        <div style={styles.activeDayView}>
          <h3 style={styles.dayTitle}>
            📍 Day {timeline[activeDay].day}: {timeline[activeDay].title || timeline[activeDay].date}
          </h3>

          {/* Travel Routing Option Selector */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ fontWeight: "bold", color: "#334155", display: "block", marginBottom: "5px" }}>
          🚗 Select Day Route / Travel Option:
        </label>
        <select
          value={timeline[activeDay]?.transit_route || ""}
          onChange={(e) => {
            const updatedRoute = e.target.value;
            const automaticSchedule = ROUTE_SCHEDULE_TEMPLATES[updatedRoute] || [];

            // ── Auto-derive overnight city from route label ──────────────
            // Route labels follow the pattern "... Overnight <City>" or have no overnight (departure day)
            const overnightMatch = updatedRoute.match(/Overnight\s+(\w+)/i);
            const derivedCity = overnightMatch ? overnightMatch[1] : null; // e.g. "Srinagar", "Pahalgam", "Gulmarg"

            // ── Auto-select first hotel from that city's KB group ────────
            if (derivedCity) {
              const groupKey = derivedCity.toLowerCase();
              const hotelGroup = HOTEL_KB[groupKey] || HOTEL_KB["srinagar"];
              const firstHotel = hotelGroup[0]; // default to first hotel in the list
              setHotelSelections(prev => ({ ...prev, [activeDay]: firstHotel.id }));
            } else {
              // Departure day or unknown → clear hotel for this day
              setHotelSelections(prev => ({ ...prev, [activeDay]: null }));
            }

            setTimeline(prev => {
              const nextTimeline = [...prev];
              if (nextTimeline[activeDay]) {
                nextTimeline[activeDay] = {
                  ...nextTimeline[activeDay],
                  transit_route: updatedRoute,
                  title: updatedRoute,                              // ← drives the DAY X: heading in PDF
                  schedule: automaticSchedule,
                  ...(derivedCity && { overnight_stay: derivedCity }) // sync the overnight_stay field too
                };
              }
              return nextTimeline;
            });
          }}
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            backgroundColor: "#fff",
            fontSize: "0.9rem",
            color: "#1e293b",
            cursor: "pointer"
          }}
        >
          <option value="">-- Choose Route for Day {activeDay + 1} --</option>
          {TRANSIT_OPTIONS.map((route, i) => (
            <option key={i} value={route}>{route}</option>
          ))}
        </select>
      </div>

          {/* ── STEP 3: Hotel KB Picker ────────────────────────────────────── */}
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "15px" }}>
      <label style={{ fontWeight: "bold", color: "#334155", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
        🏠 Assign Hotel/Stay:
      </label>
      <select
        value={timeline[activeDay]?.overnight_stay || "Srinagar"}
        onChange={(e) => {
          const updatedTimeline = [...timeline];
          if (updatedTimeline[activeDay]) {
            updatedTimeline[activeDay].overnight_stay = e.target.value;
            setTimeline(updatedTimeline);
            setHotelSelections(prev => ({ ...prev, [activeDay]: null }));
          }
        }}
        style={{
          padding: "4px 8px",
          borderRadius: "4px",
          border: "1px solid #cbd5e1",
          backgroundColor: "#fff",
          fontSize: "0.85rem",
          fontWeight: "bold",
          color: "#1e293b",
          cursor: "pointer"
        }}
      >
        <option value="Srinagar">Srinagar</option>
        <option value="Pahalgam">Pahalgam</option>
        <option value="Gulmarg">Gulmarg</option>
        <option value="Sonamarg">Sonamarg</option>
      </select>
    </div>

            {/* Hotel cards from knowledge base */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
              {HOTEL_KB[getHotelGroup(timeline[activeDay].overnight_stay)].map((hotel) => {
                const isSelected = hotelSelections[activeDay] === hotel.id;
                return (
                  <div
                    key={hotel.id}
                    onClick={() => setHotelSelections(prev => ({ ...prev, [activeDay]: hotel.id }))}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "6px",
                      border: isSelected ? "2px solid #6366f1" : "1px solid #cbd5e1",
                      backgroundColor: isSelected ? "#f5f3ff" : "#fff",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: isSelected ? "700" : "500",
                      color: isSelected ? "#4338ca" : "#334155",
                      transition: "all 0.15s"
                    }}
                  >
                    {isSelected ? "✓ " : ""}{hotel.name}
                    <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "2px" }}>
                      📍 {hotel.place} · B&D Included
                    </div>
                  </div>
                );
              })}
            </div>

            

          <div style={styles.activityList}>
            {timeline[activeDay].schedule.map((slot, actIdx) => (
              <div key={actIdx} style={styles.activityCard}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <input
                    type="text"
                    value={slot.time_slot}
                    onChange={(e) => {
                      const updatedTimeline = [...timeline];
                      updatedTimeline[activeDay].schedule[actIdx].time_slot = e.target.value;
                      setTimeline(updatedTimeline);
                    }}
                    style={{ padding: "4px 8px", width: "100px", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                  />
                  <input
                    type="text"
                    value={slot.activity_title}
                    onChange={(e) => {
                      const updatedTimeline = [...timeline];
                      updatedTimeline[activeDay].schedule[actIdx].activity_title = e.target.value;
                      setTimeline(updatedTimeline);
                    }}
                    style={{ padding: "4px 8px", flex: 1, border: "1px solid #cbd5e1", borderRadius: "4px" }}
                  />
                </div>
                <textarea
                  value={slot.description}
                  onChange={(e) => handleDescriptionChange(activeDay, actIdx, e.target.value)}
                  style={styles.editableTextArea}
                  rows={3}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Hotel Cost Breakdown Dashboard ── */}
      <HotelCostDashboard
        hotelSelections={hotelSelections}
        timeline={timeline}
        onTotalChange={(total) => setEditableCost(total)}
      />

      <div style={styles.footerBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h3 style={{ margin: 0 }}>Total Est. Cost (₹):</h3>
          <input
            type="number"
            value={editableCost}
            onChange={(e) => setEditableCost(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '1.1rem', width: '130px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
          />
        </div>
        <div style={{ fontSize: "0.78rem", color: "#475569", lineHeight: "1.7", maxWidth: "260px" }}>
          <strong style={{ color: "#0f172a", display: "block", marginBottom: "4px" }}>🏨 Hotel Assignments:</strong>
          {timeline.map((day, idx) => {
            const group = getHotelGroup(day.overnight_stay);
            const selId = hotelSelections[idx];
            const hotel = HOTEL_KB[group]?.find(h => h.id === selId);
            return (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                <span style={{ color: "#94a3b8" }}>Day {day.day}:</span>
                <span style={{ fontWeight: "600", color: hotel ? "#4338ca" : "#94a3b8" }}>
                  {hotel ? hotel.name : "Not assigned"}
                </span>
              </div>
            );
          })}
        </div>
        
        
        <button 
          style={styles.saveChangesBtn} 
          onClick={async () => {
            try {
              const currentClientName = quote?.meta_summary?.client_name || "Client";
              
              const printRes = await fetch("/api/itinerary/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  client_name: currentClientName,
                  client_email: quote?.meta_summary?.client_email || "N/A",
                  days: quote?.meta_summary?.total_days || 5,
                  start_date: quote?.meta_summary?.start_date || quote?.start_date || "Flexible",
                  adults: quote?.meta_summary?.adults || quote?.adults || 2,
                  kids: quote?.meta_summary?.kids ?? quote?.kids ?? 0,
                  budget_tier: quote?.meta_summary?.budget_tier || "Mid-Range",
                  trip_pace: quote?.meta_summary?.trip_pace || "Moderate",
                  custom_cost: editableCost,
                  timeline: timeline,
                  hotelSelections: hotelSelections
                })
              });
              
              if (printRes.ok) {
                alert("🎉 Custom modifications applied! Initiating file download...");
                
                const safeName = currentClientName.replace(/ /g, "_");
                const fileName = "Kashmir_Tour_" + safeName + ".pdf";
                
                // 1. Fetch binary stream bytes
                const fileResponse = await fetch("/output/" + fileName);
                const fileBlob = await fileResponse.blob();
                
                // 2. Mount stream memory allocation pointer
                const blobUrl = window.URL.createObjectURL(fileBlob);
                
                // 3. Force output drop event
                const downloadLink = document.createElement("a");
                downloadLink.href = blobUrl;
                downloadLink.setAttribute("download", fileName);
                document.body.appendChild(downloadLink);
                downloadLink.click();
                
                // 4. Deallocate memory structures smoothly
                document.body.removeChild(downloadLink);
                window.URL.revokeObjectURL(blobUrl);
              } else {
                alert("Compilation failed on Flask server.");
              }
            } catch (err) {
              console.error(err);
              alert("System Interface Error: Script logic execution crashed.");
            }
          }}
        >
          💾 Lock Changes & Generate PDF
        </button>
      </div>
    </div>
  );
}

const styles = {
  previewContainer: { marginTop: '30px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' },
  headerBanner: { borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' },
  summaryGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' },
  tile: { padding: '10px', backgroundColor: '#f8fafc', borderRadius: '5px', border: '1px solid #e2e8f0', fontSize: '0.9rem' },
  tabContainer: { display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '15px' },
  tabButton: { padding: '8px 16px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' },
  activeDayView: { padding: '20px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' },
  dayTitle: { margin: '0 0 15px 0', color: '#0f172a' },
  activityList: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' },
  activityCard: { backgroundColor: '#fff', padding: '15px', borderRadius: '6px', border: '1px solid #cbd5e1' },
  editableTextArea: { width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' },
  footerBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '2px solid #e2e8f0', paddingTop: '15px' },
  saveChangesBtn: { padding: '10px 20px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};
