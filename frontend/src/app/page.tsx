"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Books,
  ChalkboardTeacher,
  Trophy,
  UserCircle,
  CalendarCheck,
  Bus,
  Notebook,
  ChartLineUp,
  BellRinging,
  Clock,
  UsersThree,
  Check,
  ArrowRight,
  Star,
  RocketLaunch,
  Buildings,
  Crown,
  Heart,
  Lightbulb,
  UserGear,
  Sparkle,
} from "@phosphor-icons/react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65 },
};

const stats = [
  { value: "1000+", label: "Happy Students" },
  { value: "200+",  label: "Expert Teachers"   },
  { value: "Since",  label: "2014"            },
];

const aboutItems = [
  {
    icon: <Books size={44} weight="duotone" />,
    title: "Academics",
    desc: "Design Thinking integrated CBSE curriculum for holistic student development and global readiness.",
  },
  {
    icon: <ChalkboardTeacher size={44} weight="duotone" />,
    title: "Experienced Teachers",
    desc: "Well trained teachers providing a 10:1 student-teacher ratio with personalised mentorship.",
  },
  {
    icon: <Trophy size={44} weight="duotone" />,
    title: "Achievements",
    desc: "Consistently securing top ranks in national and international competitions year after year.",
  },
];

const features = [
  { icon: <UserCircle size={30} weight="duotone" />, title: "Student Dashboard",     desc: "360-degree view of student progress and activities." },
  { icon: <CalendarCheck size={30} weight="duotone" />, title: "Attendance Tracking", desc: "Real-time updates and monthly attendance reports." },
  { icon: <Bus size={30} weight="duotone" />,          title: "Bus Tracking",        desc: "Live location updates and route management." },
  { icon: <Notebook size={30} weight="duotone" />,      title: "Homework & Diary",   desc: "Daily assignments and teacher notes at your fingertips." },
  { icon: <ChartLineUp size={30} weight="duotone" />,   title: "Academic Reports",   desc: "Detailed performance analytics and exam results." },
  { icon: <BellRinging size={30} weight="duotone" />,   title: "Notifications",      desc: "Instant alerts for school events and emergencies." },
  { icon: <Clock size={30} weight="duotone" />,         title: "Timetable",          desc: "Easy access to class schedules and substitutions." },
  { icon: <UsersThree size={30} weight="duotone" />,    title: "Family Access",       desc: "Manage multiple children from a single parent login." },
];

const schoolHighlights = [
  {
    icon: <RocketLaunch size={44} weight="duotone" color="#FF7F50" />,
    title: "SNS Innovation Hub",
    desc: "Access to SNS iHub—India's Y-Combinator equivalent. Students work with AI, IoT, Robotics, AR/VR labs preparing them for future careers.",
  },
  {
    icon: <Buildings size={44} weight="duotone" color="#4F46E5" />,
    title: "World-Class SPINE Center",
    desc: "5-level activity center with swimming pool, indoor cricket, gym, music studio, dance studio, theater, and more—everything under one roof.",
  },
  {
    icon: <Crown size={44} weight="duotone" color="#F59E0B" />,
    title: "5 Pillars Development",
    desc: "Learning, Upskilling, Innovation, Networking, Character Building—comprehensive development for future leaders.",
  },
  {
    icon: <Heart size={44} weight="duotone" color="#EF4444" />,
    title: "3P Culture Framework",
    desc: "Purpose, Process, People—our holistic approach ensures every child develops academically, socially, emotionally, and ethically.",
  },
  {
    icon: <Lightbulb size={44} weight="duotone" color="#0EA5E9" />,
    title: "Design Thinking Education",
    desc: "India's first school with GenAI-Powered Design Thinking Framework (Patented). Built on Empathy, every child learns to solve problems creatively using AI-enhanced methodologies from an early age.",
  },
  {
    icon: <UserGear size={44} weight="duotone" color="#8B5CF6" />,
    title: "10:1 Personalized Care",
    desc: "Ultra-low student-teacher ratio ensures every child receives individual attention. Over 60% of our faculty have 10+ years of teaching experience.",
  },
];

export default function Home() {
  return (
    <main style={{ overflowX: "hidden", position: "relative" }}>
      <Header />

      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}
      <section className="hero-section mesh-bg" style={{ position: "relative", overflow: "hidden" }}>
        {/* Background Decorative Elements */}
        <div className="bg-glow" style={{ top: "-10%", left: "-10%", width: 600, height: 600, background: "radial-gradient(circle, rgba(255, 127, 80, 0.12), transparent 70%)" }} />
        <div className="bg-glow" style={{ bottom: "-10%", right: "-10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(79, 70, 229, 0.08), transparent 70%)", animationDelay: "-5s" }} />
        
        <div className="page-container" style={{ position: "relative", zIndex: 1 }}>
          <div className="hero-grid">

            {/* ── Left: Text ── */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="hero-badge" style={{ 
                background: "linear-gradient(90deg, rgba(255,127,80,0.15) 0%, rgba(230,106,62,0.05) 100%)",
                border: "1px solid rgba(255,127,80,0.2)",
                padding: "8px 20px",
                fontSize: "13px",
                backdropFilter: "blur(4px)"
              }}>
                <Sparkle size={16} weight="fill" />
                SNS ACADEMY ERP · Innovation Focused
              </div>

              <h1 className="hero-title" style={{ 
                fontSize: "clamp(2.8rem, 5vw, 4.5rem)", 
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
                marginBottom: "1.5rem"
              }}>
                Smart School<br />Management with<br />
                <span className="text-gradient">SNS&nbsp;ERP</span>
              </h1>

              <p className="hero-desc" style={{ 
                fontSize: "1.15rem", 
                maxWidth: 520,
                lineHeight: 1.6,
                color: "#4A5568"
              }}>
                Simplifying communication between parents, teachers, and administration
                through innovation and design thinking — all in one powerful, unified platform.
              </p>

              <div className="hero-btns">
                <Link href="/login" className="btn btn-primary">
                  Access Dashboard <ArrowRight size={18} weight="bold" />
                </Link>
                <Link href="#features" className="btn btn-outline">
                  Explore Features
                </Link>
              </div>

              {/* Stats */}
              <div className="hero-stats">
                {stats.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  >
                    <div className="stat-val">{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── Right: Image ── */}
            <motion.div
              className="hero-image-wrap"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="float-anim">
                <img
                  src="/images/hero-dashboard.png"
                  alt="SNS ERP Dashboard"
                  className="hero-img"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          SCHOOL HIGHLIGHTS
      ════════════════════════════════ */}
      <section className="highlights-section" style={{ padding: "4rem 0 4rem", background: "white" }}>
        <div className="page-container">
          <motion.div className="section-header" {...fadeUp} style={{ marginBottom: "3rem" }}>
            <h2 className="section-title" style={{ fontSize: "3rem", fontWeight: 900 }}>Why Parents Choose SNS Academy</h2>
            <p className="section-desc">
              We don&apos;t just teach subjects—we redesign common minds through design thinking, preparing your child for tomorrow&apos;s challenges.
            </p>
          </motion.div>

          <div className="about-grid" style={{ 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
          }}>
            {schoolHighlights.map((item, i) => (
              <motion.div
                key={i}
                className="about-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div className="about-card-icon" style={{ marginBottom: "1.5rem" }}>
                  {item.icon}
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          ABOUT
      ════════════════════════════════ */}
      <section id="about" style={{ padding: "6rem 0" }}>
        <div className="page-container">
          <motion.div className="section-header" {...fadeUp}>
            <p className="section-label">Who We Are</p>
            <h2 className="section-title">Excellence in Education</h2>
            <p className="section-desc">
              Leading the digital transformation in Coimbatore&apos;s most progressive CBSE school.
            </p>
          </motion.div>

          <div className="about-grid">
            {aboutItems.map((item, i) => (
              <motion.div
                key={i}
                className="about-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <div className="about-card-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FEATURES
      ════════════════════════════════ */}
      <section id="features" style={{ padding: "6rem 0", background: "#FAFAFA" }}>
        <div className="page-container">
          <motion.div className="section-header" {...fadeUp}>
            <p className="section-label">ERP Capabilities</p>
            <h2 className="section-title">Power Features</h2>
            <p className="section-desc">
              Everything you need to manage school life efficiently — in one place.
            </p>
          </motion.div>

          <div className="features-grid">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="feature-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.55 }}
              >
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          EXPERIENCE / ROLES
      ════════════════════════════════ */}
      <section id="experience" style={{ padding: "6rem 0" }}>
        <div className="page-container">
          <div className="exp-grid">

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <img
                src="/images/experience-section.png"
                alt="Tailored for Every Role"
                style={{
                  width: "100%",
                  maxWidth: 480,
                  borderRadius: 24,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.09)",
                  display: "block",
                }}
              />
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <p className="section-label">Built for Everyone</p>
              <h2 className="section-title">Tailored for Every Role</h2>
              <p style={{ fontSize: "1rem", color: "#636E72", lineHeight: 1.75, marginBottom: "2.5rem" }}>
                Whether you&apos;re a parent tracking your child&apos;s growth or a teacher managing a
                classroom, SNS ERP adapts seamlessly to your needs.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                {[
                  { role: "Parents", items: ["Track Academic Progress", "Track Attendance", "Instant Notifications"] },
                  { role: "Teachers", items: ["Manage Classes Easily", "Upload Homework & Notes", "Digital Attendance"] },
                ].map((col, ci) => (
                  <div key={ci}>
                    <p className="role-label">{col.role}</p>
                    <ul className="exp-list">
                      {col.items.map((item, ii) => (
                        <li key={ii}>
                          <span className="exp-check">
                            <Check size={13} weight="bold" />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          CTA
      ════════════════════════════════ */}
      <section style={{ padding: "5rem 0" }}>
        <div className="page-container">
          <motion.div
            className="cta-block"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="cta-inner">
              <p className="cta-label">Get Started Today</p>
              <h2 className="cta-title">
                Ready to transform your<br />school management?
              </h2>
              <p className="cta-desc">
                Join hundreds of educators already using SNS ERP to simplify their daily
                operations and focus on what matters most — the students.
              </p>
              <div className="cta-btns">
                <Link href="/login" className="btn btn-primary">
                  Access Dashboard <ArrowRight size={18} weight="bold" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
