"use client";

import { motion } from "framer-motion";
import { Images, CalendarBlank } from "@phosphor-icons/react";

const events = [
  { title: "Annual Sports Day", date: "Apr 20, 2026", category: "Sports", color: "#FF7F50", emoji: "🏆" },
  { title: "Science Exhibition", date: "Apr 14, 2026", category: "Academic", color: "#6C63FF", emoji: "🔬" },
  { title: "Cultural Fest 2026", date: "Apr 10, 2026", category: "Cultural", color: "#10B981", emoji: "🎭" },
  { title: "Parent-Teacher Meet", date: "Apr 5, 2026", category: "Meeting", color: "#F59E0B", emoji: "🤝" },
  { title: "Inter-School Debate", date: "Mar 28, 2026", category: "Academic", color: "#6C63FF", emoji: "🎙️" },
  { title: "Yoga & Wellness Day", date: "Mar 21, 2026", category: "Health", color: "#10B981", emoji: "🧘" },
];

const cardColors = [
  "linear-gradient(135deg,#FF7F50,#e66a3e)",
  "linear-gradient(135deg,#6C63FF,#4f46e5)",
  "linear-gradient(135deg,#10B981,#059669)",
  "linear-gradient(135deg,#F59E0B,#d97706)",
  "linear-gradient(135deg,#8B5CF6,#7c3aed)",
  "linear-gradient(135deg,#EC4899,#db2777)",
];

import { DashboardTheme } from "../../../types/theme";

export default function EventsGallery({ theme }: { theme: DashboardTheme }) {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Images size={26} weight="duotone" color="#FF7F50" />
          <h1 style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)", fontSize: 24, fontWeight: 700, color: theme.text }}>Events Gallery</h1>
        </div>
        <p style={{ color: theme.textMuted, fontSize: 14 }}>Explore recent school events and highlights</p>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {events.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            style={{
              borderRadius: 18,
              overflow: "hidden",
              boxShadow: theme.isDark ? "none" : "0 4px 24px rgba(0,0,0,0.08)",
              background: theme.cardBg,
              cursor: "pointer",
              border: `1px solid ${theme.border}`,
              transition: "all 0.3s ease",
            }}
          >
            {/* Image placeholder */}
            <div style={{
              height: 160,
              background: cardColors[i % cardColors.length],
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 56, position: "relative",
            }}>
              {event.emoji}
              <div style={{
                position: "absolute", top: 12, right: 12,
                padding: "4px 10px", borderRadius: 20,
                background: "rgba(255,255,255,0.25)", backdropFilter: "blur(8px)",
                color: "white", fontSize: 11, fontWeight: 600,
              }}>{event.category}</div>
            </div>
            {/* Info */}
            <div style={{ padding: "16px 18px" }}>
              <h3 style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)", fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 8 }}>{event.title}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: theme.textMuted, fontSize: 13 }}>
                <CalendarBlank size={14} />
                {event.date}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
