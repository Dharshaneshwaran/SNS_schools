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
    <div className="flex flex-col gap-8 h-full overflow-y-auto hide-scrollbar pb-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div 
            className="flex h-10 w-10 items-center justify-center rounded-xl border"
            style={{ 
              background: `${theme.accent}10`, 
              borderColor: `${theme.accent}20` 
            }}
          >
            <Bell size={24} style={{ color: theme.accent }} weight="duotone" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: theme.text }}>
            Messages
          </h2>
        </div>
        <p className="text-sm max-w-2xl" style={{ color: theme.textMuted }}>
          View all official announcements and notifications from SNS Academy.
        </p>
      </div>

      {/* Messages List */}
      <div className="grid grid-cols-1 gap-6">
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-3xl border p-6 shadow-sm"
            style={{ 
              background: theme.cardBg, 
              borderColor: theme.border 
            }}
          >
            {/* Message Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-xl"
                  style={{ 
                    background: msg.type === "general" ? `${theme.accent}10` : "#4F46E510" 
                  }}
                >
                  {msg.type === "general" ? (
                    <Users size={20} style={{ color: theme.accent }} weight="duotone" />
                  ) : (
                    <UserCircle size={20} style={{ color: "#4F46E5" }} weight="duotone" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: theme.text }}>
                    {msg.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span 
                      className="text-xs font-bold uppercase px-2 py-0.5 rounded-full"
                      style={{ 
                        background: `${theme.accent}10`, 
                        color: theme.accent 
                      }}
                    >
                      {msg.type}
                    </span>
                    <span className="text-xs" style={{ color: theme.textMuted }}>
                      • {msg.audience}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: theme.textMuted }}>
                <ClockCounterClockwise size={14} />
                <span>{msg.date}</span>
              </div>
            </div>

            {/* Message Content */}
            <div 
              className="p-4 rounded-2xl text-sm leading-relaxed"
              style={{ 
                background: theme.isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
                color: theme.text 
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
          className="flex flex-col items-center justify-center py-20 rounded-3xl border"
          style={{ 
            background: theme.cardBg, 
            borderColor: theme.border 
          }}
        >
          <Bell size={64} style={{ color: theme.textMuted }} weight="duotone" />
          <h3 className="mt-4 text-lg font-bold" style={{ color: theme.text }}>
            No Messages Yet
          </h3>
          <p className="text-sm mt-2" style={{ color: theme.textMuted }}>
            You'll see all school announcements here.
          </p>
        </div>
      )}
    </div>
  );
}
