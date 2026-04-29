"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Clock, 
  Users, 
  CheckCircle2, 
  ArrowUpRight, 
  MoreHorizontal,
  CalendarDays
} from "lucide-react";

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <div style={{
    backgroundColor: "var(--card-bg)",
    borderRadius: "20px",
    padding: "24px",
    flex: 1,
    border: "1px solid var(--border-color)",
    position: "relative",
    overflow: "hidden"
  }}>
    <div style={{
      width: "48px",
      height: "48px",
      borderRadius: "14px",
      backgroundColor: `${color}15`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "20px",
      color: color
    }}>
      <Icon size={24} />
    </div>
    <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: "0 0 8px" }}>{title}</p>
    <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
      <h3 style={{ color: "var(--text-primary)", fontSize: "28px", fontWeight: 700, margin: 0 }}>{value}</h3>
      <span style={{ color: "#10B981", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center" }}>
        <ArrowUpRight size={14} /> {trend}
      </span>
    </div>
    
    {/* Decorative background element */}
    <div style={{
      position: "absolute",
      bottom: "-20px",
      right: "-20px",
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
    }} />
  </div>
);

export default function DashboardOverview() {
  const schedule = [
    { time: "09:00 AM", class: "Grade 10-A", subject: "Advanced Mathematics", type: "Lecture", status: "Ongoing" },
    { time: "11:30 AM", class: "Grade 12-C", subject: "Quantum Physics", type: "Lab", status: "Upcoming" },
    { time: "02:00 PM", class: "Grade 11-B", subject: "Algebra II", type: "Workshop", status: "Upcoming" },
  ];

  const tasks = [
    { title: "Review Grade 10 Math Papers", deadline: "Today, 5:00 PM", priority: "High" },
    { title: "Prepare Lesson Plan for Monday", deadline: "Tomorrow", priority: "Medium" },
    { title: "Parent-Teacher Meeting (Arun)", deadline: "May 2, 10:00 AM", priority: "Low" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="overview-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div>
          <h2 style={{ color: "var(--text-primary)", fontSize: "24px", fontWeight: 700, margin: "0 0 4px" }}>Sarah Wilson</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0 }}>Senior Math HOD</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }} className="action-buttons">
          <button style={{
            backgroundColor: "var(--card-bg)",
            color: "var(--text-primary)",
            padding: "8px 12px",
            borderRadius: "10px",
            border: "1px solid var(--border-color)",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }} className="btn-secondary">
            <CalendarDays size={16} /> <span className="btn-text">Calendar</span>
          </button>
          <button style={{
            backgroundColor: "#FF6A00",
            color: "white",
            padding: "8px 14px",
            borderRadius: "10px",
            border: "none",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(255, 106, 0, 0.2)"
          }} className="btn-primary">
            + New Task
          </button>
        </div>
      </div>

      {/* Stats Grid - Responsive columns */}
      <div className="stats-grid">
        <StatCard title="Students" value="124" icon={Users} trend="+4%" color="#FF6A00" />
        <StatCard title="Attendance" value="96.2%" icon={CheckCircle2} trend="+1.2%" color="#10B981" />
        <StatCard title="Pending" value="28" icon={Clock} trend="-12%" color="#3B82F6" />
      </div>

      {/* Main Grid: Schedule & Tasks */}
      <div className="main-content-grid">
        {/* Today's Schedule Card */}
        <div style={{
          backgroundColor: "var(--card-bg)",
          borderRadius: "20px",
          padding: "20px",
          border: "1px solid var(--border-color)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ color: "var(--text-primary)", fontSize: "16px", fontWeight: 600, margin: 0 }}>Schedule</h3>
            <button style={{ color: "#FF7A1A", background: "none", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>View All</button>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {schedule.map((item, i) => (
              <div 
                key={i}
                className={`schedule-item ${item.status === "Ongoing" ? "active" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  borderRadius: "12px",
                  backgroundColor: item.status === "Ongoing" ? "rgba(255, 106, 0, 0.08)" : "var(--card-hover)",
                  border: item.status === "Ongoing" ? "1px solid rgba(255, 106, 0, 0.2)" : "1px solid transparent",
                }}
              >
                <div style={{
                  minWidth: "65px",
                  color: item.status === "Ongoing" ? "#FF7A1A" : "var(--text-secondary)",
                  fontSize: "12px",
                  fontWeight: 600
                }}>
                  {item.time}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: "var(--text-primary)", fontSize: "14px", fontWeight: 600, margin: "0 0 2px" }}>{item.subject}</h4>
                  <p style={{ color: "var(--text-secondary)", fontSize: "12px", margin: 0 }}>{item.class}</p>
                </div>
                <div>
                  {item.status === "Ongoing" && (
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#FF6A00", boxShadow: "0 0 10px #FF6A00" }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks Card */}
        <div style={{
          backgroundColor: "var(--card-bg)",
          borderRadius: "20px",
          padding: "20px",
          border: "1px solid var(--border-color)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ color: "var(--text-primary)", fontSize: "16px", fontWeight: 600, margin: 0 }}>Tasks</h3>
            <MoreHorizontal size={18} color="var(--text-secondary)" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {tasks.slice(0, 3).map((task, i) => (
              <div key={i} style={{ display: "flex", gap: "12px" }}>
                <div style={{
                  marginTop: "3px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "4px",
                  border: "2px solid #FF6A00",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0
                }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: "var(--text-primary)", fontSize: "13px", fontWeight: 500, margin: "0 0 2px" }}>{task.title}</h4>
                  <p style={{ color: "var(--text-secondary)", fontSize: "11px", margin: 0 }}>Due {task.deadline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .welcome-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .main-content-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }
          .main-content-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        @media (max-width: 640px) {
          .welcome-section {
            flex-direction: row;
            align-items: center;
          }
          .btn-text {
            display: none;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .stats-grid > :last-child {
            grid-column: span 2;
          }
        }
      `}</style>
    </div>
  );
}
