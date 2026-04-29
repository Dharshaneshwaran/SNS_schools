"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Users, 
  Bell, 
  Send, 
  Search,
  Plus,
  Video
} from "lucide-react";

export default function CommunicationHub() {
  const chats = [
    { name: "10-A Parents Group", lastMsg: "Please share the syllabus for...", time: "2m ago", unread: 3, avatar: "P" },
    { name: "John Doe (Student)", lastMsg: "I have a doubt regarding...", time: "1h ago", unread: 0, avatar: "JD" },
    { name: "Staff Room", lastMsg: "Meeting at 3 PM today.", time: "3h ago", unread: 1, avatar: "S" },
  ];

  return (
    <div style={{ display: "flex", height: "calc(100vh - 160px)", gap: "20px" }} className="comm-container">
      {/* Sidebar: Chats List */}
      <div className="chats-sidebar">
        <div style={{ padding: "16px", borderBottom: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ color: "var(--text-primary)", fontSize: "16px", fontWeight: 700, margin: 0 }}>Messages</h3>
            <button style={{ backgroundColor: "#FF6A00", color: "white", border: "none", borderRadius: "8px", padding: "6px", cursor: "pointer" }}><Plus size={16} /></button>
          </div>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
            <input 
              type="text" 
              placeholder="Search..." 
              style={{
                width: "100%",
                height: "36px",
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                padding: "0 12px 0 32px",
                color: "var(--text-primary)",
                fontSize: "13px",
                outline: "none"
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {chats.map((chat, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px",
              borderRadius: "12px",
              backgroundColor: i === 0 ? "rgba(255, 106, 0, 0.05)" : "transparent",
              cursor: "pointer",
              marginBottom: "2px"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: i === 0 ? "#FF6A00" : "var(--border-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: i === 0 ? "white" : "var(--text-secondary)",
                fontWeight: 700,
                fontSize: "14px",
                flexShrink: 0
              }}>
                {chat.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }} className="chat-info">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ color: "var(--text-primary)", fontSize: "13px", fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{chat.name}</h4>
                  <span style={{ color: "var(--text-secondary)", fontSize: "10px" }}>{chat.time}</span>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "11px", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{chat.lastMsg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main: Chat Window */}
      <div className="chat-window">
        {/* Chat Header */}
        <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "#FF6A00", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "12px" }}>P</div>
            <div>
              <h4 style={{ color: "var(--text-primary)", fontSize: "14px", fontWeight: 600, margin: 0 }}>10-A Parents</h4>
              <p style={{ color: "#10B981", fontSize: "11px", margin: 0 }}>Active</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <Video size={18} color="var(--text-secondary)" />
            <Users size={18} color="var(--text-secondary)" />
          </div>
        </div>

        {/* Messages Area */}
        <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>
          <div style={{ alignSelf: "flex-start", maxWidth: "80%" }}>
            <div style={{ backgroundColor: "var(--bg-primary)", padding: "10px 14px", borderRadius: "0 12px 12px 12px", border: "1px solid var(--border-color)" }}>
              <p style={{ color: "var(--text-primary)", fontSize: "13px", margin: 0 }}>Good morning ma'am. Will there be any special classes this Saturday?</p>
            </div>
          </div>

          <div style={{ alignSelf: "flex-end", maxWidth: "80%" }}>
            <div style={{ backgroundColor: "#FF6A00", padding: "10px 14px", borderRadius: "12px 12px 0 12px", boxShadow: "0 4px 15px rgba(255, 106, 0, 0.1)" }}>
              <p style={{ color: "white", fontSize: "13px", margin: 0 }}>Yes, remedial session from 10 AM to 12 PM.</p>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div style={{ padding: "16px", borderTop: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <input 
              type="text" 
              placeholder="Type..." 
              style={{
                flex: 1,
                height: "40px",
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "10px",
                padding: "0 16px",
                color: "var(--text-primary)",
                fontSize: "13px",
                outline: "none"
              }}
            />
            <button style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "#FF6A00",
              color: "white",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .chats-sidebar {
          width: 300px;
          background-color: var(--card-bg);
          border-radius: 20px;
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chat-window {
          flex: 1;
          background-color: var(--card-bg);
          border-radius: 20px;
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .chats-sidebar {
            display: none;
          }
          .comm-container {
            height: calc(100vh - 180px);
          }
        }
      `}</style>
    </div>
  );
}
