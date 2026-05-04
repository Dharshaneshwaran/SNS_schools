"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bell, Info, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "Quarterly Grades Due",
    message: "Please ensure all Grade 10 Mathematics scores are uploaded by Friday evening.",
    time: "2 hours ago",
    type: "urgent",
    icon: AlertTriangle,
    color: "#EF4444",
  },
  {
    id: 2,
    title: "Parent-Teacher Meeting",
    message: "The PTM for Grade 8B has been scheduled for next Monday at 10:00 AM.",
    time: "5 hours ago",
    type: "info",
    icon: Info,
    color: "#3B82F6",
  },
  {
    id: 3,
    title: "Staff Meeting Canceled",
    message: "The departmental meeting scheduled for this afternoon has been canceled.",
    time: "Yesterday",
    type: "success",
    icon: CheckCircle2,
    color: "#10B981",
  },
  {
    id: 4,
    title: "New Student in 12C",
    message: "A new student, Rahul Mehta, has joined Grade 12C. Please update your attendance registers.",
    time: "2 days ago",
    type: "normal",
    icon: Bell,
    color: "#FF7F50",
  },
];

export default function NotificationsSection() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tight text-[var(--text-primary)]">
            Inbox <span className="text-[var(--accent)]">Notifications</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-medium">Stay updated with school alerts and messages</p>
        </div>
        <button className="px-6 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs font-black uppercase tracking-widest text-[var(--text-primary)] hover:border-[var(--accent)] transition-all">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((notif, i) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all group relative overflow-hidden"
          >
            <div className="flex gap-6 items-start">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${notif.color}15`, color: notif.color }}
              >
                <notif.icon size={24} strokeWidth={2.5} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-black text-[var(--text-primary)] tracking-tight">{notif.title}</h3>
                  <div className="flex items-center gap-2 text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest">
                    <Clock size={12} />
                    {notif.time}
                  </div>
                </div>
                <p className="text-[var(--text-secondary)] text-sm font-medium leading-relaxed max-w-2xl">
                  {notif.message}
                </p>
              </div>

              {notif.type === 'urgent' && (
                <div className="absolute top-0 right-0 p-4">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
