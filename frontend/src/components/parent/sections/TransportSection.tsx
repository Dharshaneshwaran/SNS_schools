"use client";

import { motion } from "framer-motion";
import { Bus, MapPin, Clock, Phone, User } from "@phosphor-icons/react";

const busInfo = {
  routeNo: "Route 7B",
  stops: ["SNS Academy", "Saibaba Colony", "Gandhipuram", "RS Puram", "Peelamedu"],
  pickup: "7:45 AM",
  drop: "4:30 PM",
  driver: { name: "Ramesh Kumar", phone: "+91 94440 12345", license: "TN 33 AB 5678" },
  busNo: "TN 33 Z 9901",
};

export default function TransportSection() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Bus size={26} weight="duotone" color="#FF7F50" />
          <h1 style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)", fontSize: 24, fontWeight: 700, color: "#121212" }}>Transport</h1>
        </div>
        <p style={{ color: "#888", fontSize: 14 }}>Bus route, timings and driver information</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Route Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ background: "#fff", borderRadius: 18, padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", gridColumn: "1 / -1" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)", fontWeight: 700, fontSize: 17, color: "#121212" }}>{busInfo.routeNo}</p>
              <p style={{ color: "#888", fontSize: 13, marginTop: 2 }}>Bus No: {busInfo.busNo}</p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { label: "Pick-up", value: busInfo.pickup, icon: <Clock size={14} /> },
                { label: "Drop-off", value: busInfo.drop, icon: <Clock size={14} /> },
              ].map((t, i) => (
                <div key={i} style={{ textAlign: "center", padding: "10px 20px", borderRadius: 12, background: i === 0 ? "rgba(255,127,80,0.08)" : "rgba(16,185,129,0.08)", border: `1px solid ${i === 0 ? "rgba(255,127,80,0.2)" : "rgba(16,185,129,0.2)"}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, color: i === 0 ? "#FF7F50" : "#10B981", justifyContent: "center", marginBottom: 2 }}>{t.icon}<span style={{ fontSize: 11, fontWeight: 600 }}>{t.label}</span></div>
                  <p style={{ fontWeight: 700, fontSize: 16, color: "#222", fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>{t.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Route stops */}
          <p style={{ fontSize: 12, fontWeight: 700, color: "#bbb", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>Route Stops</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {busInfo.stops.map((stop, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: i === 0 ? "#FF7F50" : i === busInfo.stops.length - 1 ? "#10B981" : "#ddd", border: `2px solid ${i === 0 ? "#FF7F50" : i === busInfo.stops.length - 1 ? "#10B981" : "#ccc"}`, flexShrink: 0 }} />
                  {i < busInfo.stops.length - 1 && <div style={{ width: 2, height: 28, background: "#eee" }} />}
                </div>
                <div style={{ padding: "8px 0" }}>
                  <p style={{ fontSize: 14, fontWeight: i === 0 || i === busInfo.stops.length - 1 ? 700 : 500, color: i === 0 ? "#FF7F50" : i === busInfo.stops.length - 1 ? "#10B981" : "#555" }}>
                    {stop}{i === 0 ? " (Start)" : i === busInfo.stops.length - 1 ? " (School)" : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Driver Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
          style={{ background: "#fff", borderRadius: 18, padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
          <p style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)", fontWeight: 700, fontSize: 15, color: "#121212", marginBottom: 18 }}>Driver Information</p>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#FF7F50,#e66a3e)", color: "white", fontWeight: 700, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>R</div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, color: "#222" }}>{busInfo.driver.name}</p>
              <p style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Licensed Driver</p>
            </div>
          </div>
          {[
            { icon: <Phone size={16} />, label: "Phone", value: busInfo.driver.phone },
            { icon: <User size={16} />,  label: "License", value: busInfo.driver.license },
          ].map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i === 0 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
              <span style={{ color: "#FF7F50" }}>{d.icon}</span>
              <div>
                <p style={{ fontSize: 11, color: "#bbb", fontWeight: 600 }}>{d.label}</p>
                <p style={{ fontSize: 14, color: "#333", fontWeight: 500 }}>{d.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Map placeholder */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
          style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
          <div style={{ height: "100%", minHeight: 180, background: "linear-gradient(135deg,#f4f6fb,#e8ecf4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <MapPin size={40} color="#FF7F50" weight="duotone" />
            <p style={{ fontWeight: 600, color: "#888", fontSize: 14 }}>Live Tracking</p>
            <p style={{ fontSize: 12, color: "#bbb" }}>Coming Soon</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
