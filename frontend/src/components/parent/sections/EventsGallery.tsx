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
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
        {events.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="premium-card"
            style={{
              overflow: "hidden",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {/* Image area */}
            <div style={{
              height: 160,
              background: cardColors[i % cardColors.length],
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 56, position: "relative",
              overflow: "hidden"
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "40%", background: "linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)", pointerEvents: "none" }} />
              
              <motion.span 
                whileHover={{ scale: 1.2, rotate: 5 }}
                style={{ filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.15))" }}
              >
                {event.emoji}
              </motion.span>
              
              <div style={{
                position: "absolute", top: 12, right: 12,
                padding: "4px 10px", borderRadius: 10,
                background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white", fontSize: 10, fontWeight: 800,
                letterSpacing: "0.05em", textTransform: "uppercase"
              }}>{event.category}</div>
            </div>

            {/* Info area */}
            <div style={{ padding: "20px" }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: theme.text, marginBottom: 8, letterSpacing: "-0.01em" }}>{event.title}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: theme.textMuted, fontSize: 13, fontWeight: 600 }}>
                <CalendarBlank size={16} weight="bold" color="#FF7F50" />
                {event.date}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
