"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Folder, 
  FileText, 
  Video, 
  Download, 
  Plus, 
  MoreVertical,
  Search,
  Grid,
  List
} from "lucide-react";

export default function LearningResources() {
  const resources = [
    { name: "Calculus Basics.pdf", type: "PDF", size: "2.4 MB", date: "Apr 20, 2024" },
    { name: "Quantum Physics Intro.mp4", type: "Video", size: "45 MB", date: "Apr 18, 2024" },
    { name: "Math Workshop Notes.docx", type: "Document", size: "1.2 MB", date: "Apr 15, 2024" },
    { name: "Semester 2 Syllabus.pdf", type: "PDF", size: "0.8 MB", date: "Apr 10, 2024" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ color: "var(--text-primary)", fontSize: "24px", fontWeight: 700, margin: "0 0 4px" }}>Learning Resources</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0 }}>Upload and manage study materials, notes, and videos.</p>
        </div>
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
          <Plus size={18} /> Upload Resource
        </button>
      </div>

      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
          <input 
            type="text" 
            placeholder="Search resources..." 
            style={{
              width: "100%",
              height: "44px",
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              padding: "0 12px 0 40px",
              color: "var(--text-primary)",
              fontSize: "14px",
              outline: "none"
            }}
          />
        </div>
        <div style={{ display: "flex", backgroundColor: "var(--card-bg)", padding: "4px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
          <button style={{ padding: "6px", backgroundColor: "rgba(255, 106, 0, 0.1)", color: "#FF7A1A", border: "none", borderRadius: "6px", cursor: "pointer" }}><Grid size={18} /></button>
          <button style={{ padding: "6px", background: "none", color: "var(--text-secondary)", border: "none", cursor: "pointer" }}><List size={18} /></button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
        {resources.map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            style={{
              backgroundColor: "var(--card-bg)",
              borderRadius: "20px",
              padding: "20px",
              border: "1px solid var(--border-color)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              position: "relative"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: item.type === "PDF" ? "rgba(239, 68, 68, 0.1)" : item.type === "Video" ? "rgba(59, 130, 246, 0.1)" : "rgba(168, 85, 247, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: item.type === "PDF" ? "#EF4444" : item.type === "Video" ? "#3B82F6" : "#A855F7"
              }}>
                {item.type === "Video" ? <Video size={24} /> : <FileText size={24} />}
              </div>
              <button style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}><MoreVertical size={18} /></button>
            </div>
            
            <div>
              <h4 style={{ color: "var(--text-primary)", fontSize: "15px", fontWeight: 600, margin: "0 0 4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "12px", margin: 0 }}>{item.type} • {item.size}</p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600 }}>{item.date}</span>
              <button style={{
                backgroundColor: "var(--card-hover)",
                color: "var(--text-primary)",
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}>
                <Download size={14} /> Download
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
