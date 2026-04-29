"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Upload, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Filter
} from "lucide-react";

export default function AssignmentsExams() {
  const assignments = [
    { title: "Calculus Worksheet #4", class: "12-C", status: "Active", submissions: "32/38", dueDate: "Tomorrow, 11:59 PM", type: "Assignment" },
    { title: "Mid-Term Examination", class: "10-A", status: "Scheduled", submissions: "0/42", dueDate: "May 15, 2024", type: "Exam" },
    { title: "Ethics Essay", class: "10-A", status: "Grading", submissions: "40/42", dueDate: "Completed", type: "Assignment" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ color: "var(--text-primary)", fontSize: "24px", fontWeight: 700, margin: "0 0 4px" }}>Assignments & Exams</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0 }}>Create, track, and grade student submissions.</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button style={{
            backgroundColor: "var(--card-bg)",
            color: "var(--text-primary)",
            padding: "10px 16px",
            borderRadius: "12px",
            border: "1px solid var(--border-color)",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }} className="desktop-only">
            <Upload size={18} /> Bulk Upload
          </button>
          <button style={{
            backgroundColor: "#FF6A00",
            color: "white",
            padding: "10px 20px",
            borderRadius: "12px",
            border: "none",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 15px rgba(255, 106, 0, 0.3)"
          }}>
            <Plus size={18} /> Create New
          </button>
        </div>
      </div>

      {/* Tabs / Filters */}
      <div style={{ 
        display: "flex", 
        gap: "8px", 
        padding: "4px", 
        backgroundColor: "var(--card-bg)", 
        borderRadius: "12px", 
        width: "fit-content",
        border: "1px solid var(--border-color)"
      }}>
        {["All", "Assignments", "Exams", "Grading"].map((tab, i) => (
          <button key={i} style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: i === 0 ? "rgba(255, 106, 0, 0.1)" : "transparent",
            color: i === 0 ? "#FF7A1A" : "var(--text-secondary)",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer"
          }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Assignments List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {assignments.map((item, i) => (
          <div key={i} style={{
            backgroundColor: "var(--card-bg)",
            borderRadius: "20px",
            padding: "20px",
            border: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            gap: "24px"
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              backgroundColor: item.type === "Exam" ? "rgba(239, 68, 68, 0.1)" : "rgba(255, 106, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: item.type === "Exam" ? "#EF4444" : "#FF7A1A"
            }}>
              <FileText size={24} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <h4 style={{ color: "var(--text-primary)", fontSize: "16px", fontWeight: 600, margin: 0 }}>{item.title}</h4>
                <span style={{ 
                  fontSize: "10px", 
                  fontWeight: 700, 
                  padding: "2px 8px", 
                  borderRadius: "4px", 
                  backgroundColor: "var(--border-color)", 
                  color: "var(--text-secondary)",
                  textTransform: "uppercase"
                }}>
                  {item.class}
                </span>
              </div>
              <div style={{ display: "flex", gap: "16px", marginTop: "4px" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Clock size={14} /> Due: {item.dueDate}
                </span>
                <span style={{ color: "var(--text-secondary)", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <CheckCircle2 size={14} /> Submissions: {item.submissions}
                </span>
              </div>
            </div>

            <div style={{ textAlign: "right" }} className="desktop-only">
              <span style={{
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                backgroundColor: 
                  item.status === "Active" ? "rgba(16, 185, 129, 0.1)" : 
                  item.status === "Scheduled" ? "rgba(59, 130, 246, 0.1)" : 
                  "rgba(245, 158, 11, 0.1)",
                color: 
                  item.status === "Active" ? "#10B981" : 
                  item.status === "Scheduled" ? "#3B82F6" : 
                  "#F59E0B"
              }}>
                {item.status}
              </span>
            </div>

            <button style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
              <MoreVertical size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
