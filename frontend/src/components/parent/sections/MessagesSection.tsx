"use client";

import { motion } from "framer-motion";
import { Bell, ClockCounterClockwise, Users, UserCircle } from "@phosphor-icons/react";
import { DashboardTheme } from "../../../types/theme";

interface Props {
  theme: DashboardTheme;
}

const messages = [
  { 
    id: 1, 
    title: "Annual Sports Day Announcement", 
    content: "Dear Parents, We are excited to announce our Annual Sports Day on May 15th. All students are requested to participate. Please ensure your child is present by 8:00 AM.",
    date: "2 hours ago",
    type: "general",
    audience: "All Parents"
  },
  { 
    id: 2, 
    title: "Exam Results Published", 
    content: "The results for the mid-term examinations have been published. You can view your child's performance in the Academic Reports section.",
    date: "Yesterday",
    type: "general",
    audience: "All Parents"
  },
  { 
    id: 3, 
    title: "Parent-Teacher Meeting", 
    content: "A parent-teacher meeting is scheduled for May 10th at 3:00 PM. Your presence is highly appreciated to discuss your child's progress.",
    date: "2 days ago",
    type: "class",
    audience: "Class 8-A Parents"
  },
  { 
    id: 4, 
    title: "School Closure Notice", 
    content: "The school will remain closed on May 8th due to a public holiday. Regular classes will resume on May 9th.",
    date: "3 days ago",
    type: "general",
    audience: "All Parents"
  },
  { 
    id: 5, 
    title: "Homework Submission Reminder", 
    content: "This is a reminder that all pending homework assignments must be submitted by May 5th. Please check the Diary section for details.",
    date: "5 days ago",
    type: "class",
    audience: "Class 8-A Parents"
  },
];

export default function MessagesSection({ theme }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div 
            style={{ 
              display: "flex", height: 48, width: 48, alignItems: "center", justifyContent: "center", 
              borderRadius: 14, background: `${theme.accent}15`, 
              border: `1px solid ${theme.accent}30`,
              boxShadow: `0 4px 12px ${theme.accent}10`
            }}
          >
            <Bell size={26} style={{ color: theme.accent }} weight="duotone" />
          </div>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: theme.text, letterSpacing: "-0.03em" }}>
              Messages
            </h2>
            <p style={{ fontSize: 14, fontWeight: 600, color: theme.textMuted }}>
              View all official announcements and notifications
            </p>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="premium-card"
            style={{ 
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: 20
            }}
          >
            {/* Message Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div 
                  style={{ 
                    padding: "12px", borderRadius: 14,
                    background: msg.type === "general" ? `${theme.accent}10` : "#4F46E510",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}
                >
                  {msg.type === "general" ? (
                    <Users size={24} style={{ color: theme.accent }} weight="duotone" />
                  ) : (
                    <UserCircle size={24} style={{ color: "#4F46E5" }} weight="duotone" />
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: theme.text, marginBottom: 4 }}>
                    {msg.title}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span 
                      style={{ 
                        fontSize: 10, fontWeight: 900, textTransform: "uppercase", 
                        padding: "4px 12px", borderRadius: 8,
                        background: `${theme.accent}10`, color: theme.accent,
                        letterSpacing: "0.05em"
                      }}
                    >
                      {msg.type}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted }}>
                      • {msg.audience}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: theme.textMuted }}>
                <ClockCounterClockwise size={16} />
                <span>{msg.date}</span>
              </div>
            </div>

            {/* Message Content */}
            <div 
              style={{ 
                padding: "20px 24px", borderRadius: 18, 
                fontSize: 15, lineHeight: "1.7",
                background: theme.isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
                color: theme.text,
                border: `1px solid ${theme.border}`
              }}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State (if no messages) */}
      {messages.length === 0 && (
        <div 
          className="premium-card"
          style={{ 
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "80px 40px", textAlign: "center"
          }}
        >
          <Bell size={64} style={{ color: theme.textMuted, margin: "0 auto 20px" }} weight="duotone" />
          <h3 style={{ fontSize: 20, fontWeight: 800, color: theme.text }}>
            No Messages Yet
          </h3>
          <p style={{ fontSize: 14, fontWeight: 600, color: theme.textMuted, marginTop: 8 }}>
            You'll see all school announcements here.
          </p>
        </div>
      )}
    </div>
  );
}
