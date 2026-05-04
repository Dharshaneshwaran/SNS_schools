"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import { 
  FileText, 
  Calendar, 
  ClipboardText, 
  Headset,
  ArrowLeft
} from "@phosphor-icons/react";
import Link from "next/link";

const resources = [
  {
    title: "Parent Handbook",
    desc: "Complete guide to school policies, dress codes, and academic standards.",
    icon: <FileText size={32} weight="duotone" />,
    color: "#FF7F50"
  },
  {
    title: "Holiday List 2026",
    desc: "Annual calendar featuring all scheduled holidays and term breaks.",
    icon: <Calendar size={32} weight="duotone" />,
    color: "#4F46E5"
  },
  {
    title: "Exam Schedules",
    desc: "Stay updated with the latest timetable for Periodic, Term, and Final exams.",
    icon: <ClipboardText size={32} weight="duotone" />,
    color: "#F59E0B"
  },
  {
    title: "Contact Support",
    desc: "Technical assistance for the ERP portal and administrative queries.",
    icon: <Headset size={32} weight="duotone" />,
    color: "#10B981"
  }
];

export default function ResourcesPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Header />
      
      <section style={{ padding: "120px 0 80px" }}>
        <div className="page-container">
          <Link href="/" style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: 8, 
            color: "#636E72", 
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 32
          }}>
            <ArrowLeft size={16} weight="bold" /> Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{ fontSize: "3rem", fontWeight: 900, color: "#121212", marginBottom: 16 }}>
              School Resources
            </h1>
            <p style={{ fontSize: "1.1rem", color: "#636E72", maxWidth: 600, lineHeight: 1.6, marginBottom: 48 }}>
              Access important documents, calendars, and support channels in one place. 
              These resources are updated regularly by the school administration.
            </p>
          </motion.div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
            gap: 24 
          }}>
            {resources.map((res, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="about-card"
                style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 16 }}
              >
                <div style={{ 
                  width: 56, height: 56, 
                  borderRadius: 16, 
                  background: `${res.color}15`, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  color: res.color
                }}>
                  {res.icon}
                </div>
                <div>
                  <h3 style={{ margin: "0 0 8px 0" }}>{res.title}</h3>
                  <p style={{ margin: 0, fontSize: 14 }}>{res.desc}</p>
                </div>
                <button style={{ 
                  marginTop: "auto", 
                  padding: "10px 16px", 
                  borderRadius: 12, 
                  border: "1px solid #EEE", 
                  background: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#F9FAFB"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
                >
                  Download / View
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
