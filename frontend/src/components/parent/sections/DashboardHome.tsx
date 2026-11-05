"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  CalendarCheck,
  ChartBar,
  ArrowRight,
  PaperPlaneTilt,
  Bell,
  Info,
  Clock,
} from "@phosphor-icons/react";
import { DashboardTheme } from "../../../types/theme";
import { AcademicTab, MenuKey } from "../../../types/dashboard";
import { notificationService } from "../../../services/notification-service";
import { useAuth } from "../../../hooks/use-auth";
import { getParentDashboardOverview, ParentDashboardOverview } from "../../../services/dashboard-service";
import { apiRequest } from "../../../services/api-client";

interface Props {
  theme: DashboardTheme;
  onNavigate: (tab: AcademicTab) => void;
  onNavigateMenu?: (menu: MenuKey) => void;
}

export default function DashboardHome({ theme, onNavigate, onNavigateMenu }: Props) {
  const { session } = useAuth();
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const [parentStats, setParentStats] = useState<ParentDashboardOverview | null>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);
  const [gridCols, setGridCols] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sns_dashboard_cols");
      return saved ? parseInt(saved) : 4; // Default to auto-fill (4)
    }
    return 4;
  });

  const saveCols = (cols: number) => {
    setGridCols(cols);
    localStorage.setItem("sns_dashboard_cols", cols.toString());
  };

  // Phone layout: quick-action cards are designed for >=180px, so columns are
  // capped at 2 and every card/padding step shrinks below 640px.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!session?.accessToken) return;
    notificationService
      .getNotifications(session.accessToken)
      .then((list) => setUnreadCount(list.filter((n) => !n.isRead).length))
      .catch(() => setUnreadCount(0));

    // Also fetch parent stats (attendance/exam)
    if (session.user?.studentProfile?.id) {
      getParentDashboardOverview(session.user.studentProfile.id)
        .then(setParentStats)
        .catch(() => {});
    }

    // Fetch announcements
    apiRequest<any[]>('/announcements')
      .then(setAnnouncements)
      .catch(() => {});

    // Fetch Today's Timetable
    if (session.user?.studentProfile?.class && session.user?.studentProfile?.section) {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const today = days[new Date().getDay()];
      apiRequest<any[]>(`/timetable/student?class=${session.user.studentProfile.class}&section=${session.user.studentProfile.section}`)
        .then(list => {
          setTodaySchedule(list.filter(e => e.day === today).sort((a,b) => a.period - b.period));
        })
        .catch(() => {});
    }
  }, [session]);

  const latestAnnouncement = announcements[0];
  const nextHoliday = announcements.find(a => a.title.toLowerCase().includes('holiday'));

  const quickCards = [
    {
      label: "Attendance",
      value: parentStats?.attendance.value || "…",
      sub: parentStats?.attendance.sub || "Calculating…",
      icon: Users,
      color: "#FF7F50",
      onClick: () => onNavigate("attendance" as AcademicTab),
    },
    {
      label: "Exam Reports",
      value: parentStats?.exam.value || "…",
      sub: parentStats?.exam.sub || "No results yet",
      icon: ChartBar,
      color: "#4f46e5",
      onClick: () => onNavigate("exam" as AcademicTab),
    },
    {
      label: "Leave Application",
      value: "Apply Now",
      sub: "Quick Request",
      icon: PaperPlaneTilt,
      color: "#10b981",
      onClick: () => onNavigate("leave" as AcademicTab),
    },
    {
      label: "Notifications",
      value: unreadCount !== null ? unreadCount.toString() : "…",
      sub: unreadCount === 1 ? "1 unread message" : `${unreadCount ?? "…"} unread`,
      icon: Bell,
      color: "#e11d48",
      onClick: () => onNavigateMenu?.("notifications"),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 14 : 20 }}>

      {/* ── Quick Action Cards Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <h3 style={{ fontSize: 11, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Quick Actions</h3>
        <div style={{ display: "flex", background: theme.isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9", borderRadius: 8, padding: 3, gap: 2 }}>
          {[1, 2, 3, 4].map(num => (
            <button
              key={num}
              onClick={() => saveCols(num)}
              style={{
                width: 28,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 6,
                border: "none",
                fontSize: 10,
                fontWeight: 800,
                cursor: "pointer",
                background: gridCols === num ? theme.primary : "transparent",
                color: gridCols === num ? "#fff" : theme.textMuted,
                transition: "0.2s"
              }}
            >
              {num === 4 ? "Auto" : num}
            </button>
          ))}
        </div>
      </div>

      {/* ── Quick Action Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            gridCols === 4
              ? `repeat(auto-fill, minmax(${isMobile ? 150 : 200}px, 1fr))`
              : `repeat(${isMobile ? Math.min(gridCols, 2) : gridCols}, minmax(0, 1fr))`,
          gap: isMobile ? 12 : 20,
        }}
      >
        {quickCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -5, boxShadow: "0 24px 48px rgba(0,0,0,0.10)" }}
              onClick={card.onClick}
              className="premium-card cursor-pointer relative overflow-hidden p-3.5 sm:p-5"
              style={{ borderRadius: isMobile ? 20 : 32 }}
            >
              {/* Background circle */}
              <div
                className="absolute rounded-full"
                style={{
                  top: isMobile ? -18 : -24,
                  right: isMobile ? -18 : -24,
                  width: isMobile ? 76 : 100,
                  height: isMobile ? 76 : 100,
                  background: `${card.color}10`,
                }}
              />
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: card.color }}
              />

              <div className="flex items-start justify-between mb-3 sm:mb-5">
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: isMobile ? 40 : 52,
                    height: isMobile ? 40 : 52,
                    borderRadius: isMobile ? 13 : 16,
                    background: `${card.color}18`,
                    color: card.color,
                    boxShadow: `0 6px 16px ${card.color}18`,
                  }}
                >
                  <Icon size={isMobile ? 22 : 28} weight="bold" />
                </div>
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: isMobile ? 26 : 32,
                    height: isMobile ? 26 : 32,
                    borderRadius: "50%",
                    background: theme.isDark ? "rgba(255,255,255,0.04)" : "#F8FAFC",
                    color: theme.textMuted,
                  }}
                >
                  <ArrowRight size={isMobile ? 13 : 16} weight="bold" />
                </div>
              </div>

              <div>
                <p
                  style={{
                    color: theme.textMuted,
                    fontWeight: 700,
                    fontSize: isMobile ? 9.5 : 11,
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {card.label}
                </p>
                <h3
                  style={{
                    fontSize: isMobile ? 21 : 26,
                    fontWeight: 900,
                    color: theme.text,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.15,
                    marginBottom: 2,
                  }}
                >
                  {card.value}
                </h3>
                <p style={{ fontSize: isMobile ? 10 : 11, color: card.color, fontWeight: 700 }}>{card.sub}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Schedule + Info ── */}
      <div
        className="grid grid-cols-1 sm:grid-cols-[1.2fr_0.8fr]"
        style={{ gap: isMobile ? 12 : 20 }}
      >

        {/* Today's Schedule */}
        <div className="premium-card" style={{ padding: isMobile ? 14 : 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: isMobile ? 16 : 24,
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              <CalendarCheck size={isMobile ? 17 : 20} weight="bold" color={theme.primary} className="shrink-0" />
              <h4 style={{ fontSize: isMobile ? 15 : 18, fontWeight: 800, color: theme.primary }}>
                Today&apos;s Schedule
              </h4>
            </div>
            <span
              style={{
                fontSize: isMobile ? 10 : 11,
                fontWeight: 800,
                color: theme.textMuted,
                background: theme.isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9",
                padding: isMobile ? "3px 8px" : "4px 10px",
                borderRadius: 8,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              April 20, 2026
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {todaySchedule.length > 0 ? todaySchedule.map((item, i) => (
              <div
                key={i}
                style={{
                  padding: isMobile ? "12px 14px" : "16px 20px",
                  borderRadius: isMobile ? 14 : 18,
                  background:
                    i === 0 ? `${theme.primary}0a` : "transparent",
                  border: `1px solid ${
                    i === 0
                      ? `${theme.primary}30`
                      : theme.border
                  }`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  transition: "0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 16, minWidth: 0 }}>
                  <div
                    style={{
                      width: isMobile ? 36 : 42,
                      height: isMobile ? 36 : 42,
                      borderRadius: isMobile ? 10 : 12,
                      flexShrink: 0,
                      background:
                        i === 0
                          ? theme.primary
                          : theme.isDark
                          ? "rgba(255,255,255,0.05)"
                          : "#f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: i === 0 ? "#fff" : theme.textMuted,
                    }}
                  >
                    <Clock size={isMobile ? 16 : 18} weight="bold" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: isMobile ? 13 : 14, fontWeight: 700, color: theme.text }}>{item.subject}</p>
                    <p style={{ fontSize: isMobile ? 11 : 12, fontWeight: 600, color: theme.textMuted }}>
                      {item.startTime} - {item.endTime}
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    flexShrink: 0,
                    color:
                      i === 0 ? theme.primary : theme.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    background:
                      i === 0
                        ? `${theme.primary}12`
                        : "transparent",
                    padding:
                      i === 0 ? (isMobile ? "3px 8px" : "4px 10px") : "0",
                    borderRadius: 6,
                    whiteSpace: "nowrap",
                  }}
                >
                  {i === 0 ? "Current" : "Upcoming"}
                </span>
              </div>
            )) : (
              <div style={{ padding: "20px", textAlign: "center", color: theme.textMuted }}>
                <p style={{ fontSize: 14, fontWeight: 600 }}>No classes scheduled for today.</p>
              </div>
            )}
          </div>
        </div>

        {/* Announcement + Holiday */}
        <div className="premium-card" style={{ padding: isMobile ? 14 : 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 10, marginBottom: isMobile ? 16 : 24 }}>
            <span
              className="shrink-0"
              style={{
                width: isMobile ? 30 : 36,
                height: isMobile ? 30 : 36,
                borderRadius: isMobile ? 9 : 10,
                background: `${theme.primary}15`,
                color: theme.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Info size={isMobile ? 17 : 20} weight="bold" />
            </span>
            <h4 style={{ fontSize: isMobile ? 15 : 18, fontWeight: 800, color: theme.primary }}>Important Note</h4>
          </div>

          <div
            style={{
              padding: isMobile ? 14 : 20,
              borderRadius: isMobile ? 14 : 18,
              background: theme.isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC",
              border: `1px solid ${theme.border}`,
              marginBottom: isMobile ? 16 : 20,
            }}
          >
            <p style={{ fontSize: isMobile ? 13 : 14, lineHeight: "1.65", color: theme.text, fontWeight: 600, marginBottom: isMobile ? 12 : 14 }}>
              {latestAnnouncement ? latestAnnouncement.content : "No new announcements at this time. Stay tuned for school updates."}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: theme.primary, cursor: "pointer" }}>
              <span style={{ fontSize: 12, fontWeight: 800 }}>Read More</span>
              <ArrowRight size={14} weight="bold" />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: theme.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Upcoming Holiday
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
                padding: isMobile ? "10px 12px" : "12px 16px",
                borderRadius: isMobile ? 12 : 14,
                background: theme.isDark ? "rgba(255,255,255,0.03)" : "#f1f5f9",
              }}
            >
              <span style={{ fontSize: isMobile ? 13 : 14, fontWeight: 700, color: theme.text, minWidth: 0 }}>
                {nextHoliday ? nextHoliday.title : "No upcoming holidays"}
              </span>
              <span style={{ fontSize: isMobile ? 12 : 13, fontWeight: 800, color: theme.primary, flexShrink: 0 }}>
                {nextHoliday ? new Date(nextHoliday.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
