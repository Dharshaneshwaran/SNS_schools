"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, Printer } from "lucide-react";

export default function ScheduleManager() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const times = ["08:30", "09:30", "10:30", "11:30", "12:30", "01:30", "02:30"];
  
  const scheduleData = [
    { day: 0, time: 0, subject: "Maths", class: "10-A", color: "#FF6A00", duration: 1 },
    { day: 0, time: 2, subject: "Physics", class: "12-C", color: "#3B82F6", duration: 2 },
    { day: 1, time: 1, subject: "Algebra", class: "11-B", color: "#10B981", duration: 1 },
    { day: 2, time: 0, subject: "Maths", class: "10-A", color: "#FF6A00", duration: 1 },
    { day: 3, time: 1, subject: "Quantum", class: "12-C", color: "#A855F7", duration: 2 },
    { day: 4, time: 3, subject: "Workshop", class: "11-B", color: "#F59E0B", duration: 1 },
  ];

  const currentDay = 0; // Monday
  const currentTimeIdx = 0; // 08:30

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ color: "var(--text-primary)", fontSize: "24px", fontWeight: 700, margin: "0 0 4px" }}>Weekly Timetable</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0 }}>Academic Year 2023-24 • Semester 2</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{
            display: "flex",
            backgroundColor: "var(--card-bg)",
            borderRadius: "10px",
            padding: "4px",
            border: "1px solid var(--border-color)"
          }}>
            <button style={{ background: "none", border: "none", padding: "4px 8px", color: "var(--text-secondary)", cursor: "pointer" }}><ChevronLeft size={18} /></button>
            <span style={{ color: "var(--text-primary)", fontSize: "14px", fontWeight: 600, padding: "0 8px", display: "flex", alignItems: "center" }}>Week 12</span>
            <button style={{ background: "none", border: "none", padding: "4px 8px", color: "var(--text-secondary)", cursor: "pointer" }}><ChevronRight size={18} /></button>
          </div>
          <button style={{
            backgroundColor: "var(--card-bg)",
            color: "var(--text-secondary)",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid var(--border-color)",
            cursor: "pointer"
          }}><Printer size={18} /></button>
        </div>
      </div>

      <div style={{
        backgroundColor: "var(--card-bg)",
        borderRadius: "24px",
        padding: "24px",
        border: "1px solid var(--border-color)",
        overflowX: "auto"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "80px repeat(6, 1fr)",
          gap: "12px",
          minWidth: "800px"
        }}>
          {/* Header Row */}
          <div />
          {days.map((day, i) => (
            <div key={i} style={{
              textAlign: "center",
              paddingBottom: "16px",
              color: i === currentDay ? "#FF7A1A" : "var(--text-secondary)",
              fontSize: "14px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}>
              {day}
            </div>
          ))}

          {/* Time Rows */}
          {times.map((time, timeIdx) => (
            <React.Fragment key={timeIdx}>
              <div style={{
                color: "var(--text-secondary)",
                opacity: 0.5,
                fontSize: "12px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "80px"
              }}>
                {time}
              </div>
              {days.map((_, dayIdx) => {
                const session = scheduleData.find(s => s.day === dayIdx && s.time === timeIdx);
                const isCurrent = dayIdx === currentDay && timeIdx === currentTimeIdx;
                
                if (session) {
                  return (
                    <motion.div
                      key={`${dayIdx}-${timeIdx}`}
                      whileHover={{ scale: 1.02, zIndex: 10 }}
                      style={{
                        backgroundColor: isCurrent ? "rgba(255, 106, 0, 0.15)" : "var(--card-hover)",
                        borderRadius: "16px",
                        padding: "12px",
                        border: isCurrent ? "2px solid #FF6A00" : `1px solid ${session.color}20`,
                        borderLeft: `4px solid ${session.color}`,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        height: "80px",
                        gridRow: `span ${session.duration}`,
                        boxShadow: isCurrent ? "0 0 20px rgba(255, 106, 0, 0.15)" : "none",
                      }}
                    >
                      <span style={{ color: "var(--text-primary)", fontSize: "14px", fontWeight: 700 }}>{session.subject}</span>
                      <span style={{ color: "var(--text-secondary)", fontSize: "11px", fontWeight: 500, marginTop: "2px" }}>Class {session.class}</span>
                    </motion.div>
                  );
                }

                // Check if this slot is covered by a multi-row session above
                const multiRowSession = scheduleData.find(s => s.day === dayIdx && s.time < timeIdx && s.time + s.duration > timeIdx);
                if (multiRowSession) return null;

                return (
                  <div key={`${dayIdx}-${timeIdx}`} style={{
                    backgroundColor: "var(--bg-primary)",
                    opacity: 0.3,
                    borderRadius: "16px",
                    border: "1px dashed var(--border-color)",
                    height: "80px"
                  }} />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
