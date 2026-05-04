"use client";

import { motion } from "framer-motion";
import { Bell } from "@phosphor-icons/react";
import { DashboardTheme } from "../../../types/theme";

const notifications = [
  { msg: "Fee due date extended to May 15", time: "2 hrs ago", type: "info" },
  { msg: "Parent-Teacher meeting on May 5 at 10 AM", time: "1 day ago", type: "alert" },
  { msg: "Science project submission reminder", time: "2 days ago", type: "reminder" },
  { msg: "Annual Day photographs are now available in gallery", time: "3 days ago", type: "info" },
  { msg: "School holiday announced for Labour Day - May 1st", time: "4 days ago", type: "info" },
];

export default function NotificationsSection({ theme }: { theme: DashboardTheme }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      style={{ width: "100%", display: "flex", flexDirection: "column", gap: 20 }}
    >
      <div style={{ marginBottom: 8 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: theme.text, marginBottom: 4 }}>Recent Notifications</h3>
        <p style={{ fontSize: 14, color: theme.textMuted }}>Stay updated with the latest school announcements and alerts.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {notifications.map((n, i) => (
          <motion.div
            key={`notif-${i}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="premium-card"
            style={{
              padding: "24px",
              display: "flex",
              alignItems: "flex-start",
              gap: 20,
            }}
          >
            <div style={{ 
              width: 52, height: 52, borderRadius: 16, 
              background: n.type === "alert" ? "rgba(239,68,68,0.1)" : "rgba(255,127,80,0.08)", 
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Bell size={28} color={n.type === "alert" ? "#ef4444" : "#FF7F50"} weight="duotone" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: theme.text, lineHeight: 1.4 }}>{n.msg}</p>
                <span style={{ fontSize: 12, fontWeight: 700, color: theme.textMuted, whiteSpace: "nowrap" }}>{n.time}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ 
                  fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em",
                  color: n.type === "alert" ? "#ef4444" : "#FF7F50",
                  background: n.type === "alert" ? "rgba(239,68,68,0.05)" : "rgba(255,127,80,0.05)",
                  padding: "4px 10px", borderRadius: 6
                }}>
                  {n.type}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
