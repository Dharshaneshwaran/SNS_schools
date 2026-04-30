"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  ChatCircle, 
  PaperPlaneTilt, 
  BookmarkSimple, 
  DotsThreeOutlineVertical,
  CalendarBlank,
  MapPin,
  CheckCircle,
  ShareNetwork,
  Trophy,
  Flask,
  MaskHappy,
  Handshake,
  Microphone,
  Barbell,
  GraduationCap
} from "@phosphor-icons/react";
import { DashboardTheme } from "../../../types/theme";

const events = [
  { 
    id: 1,
    title: "Annual Sports Day 2026", 
    date: "Apr 20, 2026", 
    location: "Main Stadium",
    category: "Sports", 
    color: "#FF7F50",
    icon: <Trophy size={16} weight="fill" />,
    image: "/events/sports-day.png",
    likes: 1248,
    comments: 48,
    description: "What an incredible display of talent and sportsmanship! 🏆 Our students showcased outstanding athletic abilities across track, field, and team sports. Proud of every participant who gave their best!",
    hashtags: ["#SportsDay2026", "#SNSAcademy", "#Champions"],
    postedTime: "2 hours ago"
  },
  { 
    id: 2,
    title: "Science Exhibition", 
    date: "Apr 14, 2026", 
    location: "Block A Hall",
    category: "Academic", 
    color: "#6C63FF",
    icon: <Flask size={16} weight="fill" />,
    image: "/events/science-exhibition.png",
    likes: 856,
    comments: 32,
    description: "Exploring the future! 🔬 Our young scientists blew everyone away at this year's Science Exhibition. From renewable energy models to AI-powered robots — the future is bright!",
    hashtags: ["#ScienceFair", "#Innovation", "#FutureScientists"],
    postedTime: "1 day ago"
  },
  { 
    id: 3,
    title: "Cultural Fest 2026", 
    date: "Apr 10, 2026", 
    location: "Open Air Theatre",
    category: "Cultural", 
    color: "#10B981",
    icon: <MaskHappy size={16} weight="fill" />,
    image: "/events/cultural-fest.png",
    likes: 2432,
    comments: 156,
    description: "A night filled with music, dance, and vibrant performances! 🎭 From classical performances to modern fusion — our students proved that art knows no boundaries.",
    hashtags: ["#CulturalFest", "#ArtAndCulture", "#SNSPride"],
    postedTime: "3 days ago"
  },
  { 
    id: 4,
    title: "Parent-Teacher Meet", 
    date: "Apr 5, 2026", 
    location: "Conference Room",
    category: "Meeting", 
    color: "#F59E0B",
    icon: <Handshake size={16} weight="fill" />,
    image: "/events/parent-teacher-meet.png",
    likes: 432,
    comments: 12,
    description: "A productive Parent-Teacher Meet discussing student progress and future goals. 🤝 Together, we build a better future for our students!",
    hashtags: ["#PTM", "#ParentTeacher", "#Education"],
    postedTime: "1 week ago"
  },
  {
    id: 5,
    title: "Inter-School Debate",
    date: "Mar 28, 2026",
    location: "Auditorium",
    category: "Academic",
    color: "#8B5CF6",
    icon: <Microphone size={16} weight="fill" />,
    image: "/events/debate-competition.png",
    likes: 176,
    comments: 21,
    description: "Our debate team represented SNS Academy brilliantly at the Inter-School Debate Championship! 🎙️ Articulate, confident, and well-prepared — these students are natural leaders.",
    hashtags: ["#DebateChampionship", "#PublicSpeaking", "#Leaders"],
    postedTime: "1 month ago"
  },
  {
    id: 6,
    title: "Yoga & Wellness Day",
    date: "Mar 21, 2026",
    location: "Wellness Center",
    category: "Health",
    color: "#10B981",
    icon: <Barbell size={16} weight="fill" />,
    image: "/events/yoga-wellness.png",
    likes: 203,
    comments: 15,
    description: "Mind, body, and soul — all aligned on Yoga & Wellness Day! 🧘 Students and teachers came together for a rejuvenating session of yoga, meditation, and mindfulness.",
    hashtags: ["#YogaDay", "#Wellness", "#MindfulSchool"],
    postedTime: "1 month ago"
  },
];

export default function EventsGallery({ theme }: { theme: DashboardTheme }) {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());
  const [expandedCaptions, setExpandedCaptions] = useState<Set<number>>(new Set());

  const toggleLike = (id: number) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSave = (id: number) => {
    setSavedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCaption = (id: number) => {
    setExpandedCaptions(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Stories - Inspired by Instagram */}
      <div style={{ 
        display: "flex", 
        gap: 20, 
        overflowX: "auto", 
        paddingBottom: 10,
        paddingLeft: 4
      }} className="hide-scrollbar">
        {events.map((event) => (
          <div key={event.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                padding: 3,
                background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                cursor: "pointer"
              }}
            >
              <div style={{ 
                width: "100%", 
                height: "100%", 
                borderRadius: "50%", 
                border: `3px solid ${theme.cardBg}`,
                overflow: "hidden",
                background: "#eee"
              }}>
                <img src={event.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </motion.div>
            <span style={{ fontSize: 11, fontWeight: 700, color: theme.text, maxWidth: 80, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {event.title.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>

      {/* Category Pills */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }} className="hide-scrollbar">
        {["All", "Sports", "Academic", "Cultural", "Meeting", "Health"].map(cat => (
          <button
            key={cat}
            style={{
              padding: "7px 18px", borderRadius: 20,
              background: cat === "All" ? "linear-gradient(90deg,#FF7F50,#e66a3e)" : theme.cardBg,
              color: cat === "All" ? "white" : theme.textMuted,
              border: cat === "All" ? "none" : `1px solid ${theme.border}`,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              whiteSpace: "nowrap", transition: "all 0.2s",
              fontFamily: "var(--font-inter,'Inter',sans-serif)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed - Instagram/LinkedIn Style Post Cards */}
      <div style={{
        display: "flex", flexDirection: "column", gap: 32,
        maxWidth: 640, margin: "0 auto", width: "100%",
        paddingBottom: 60 
      }}>
        <AnimatePresence mode="popLayout">
          {events.map((event, i) => {
            const isLiked = likedPosts.has(event.id);
            const isSaved = savedPosts.has(event.id);
            const isExpanded = expandedCaptions.has(event.id);
            const text = event.description;

            return (
              <motion.article
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                style={{
                  background: theme.cardBg,
                  borderRadius: 24,
                  border: `1px solid ${theme.border}`,
                  overflow: "hidden",
                  boxShadow: theme.isDark ? "0 10px 40px rgba(0,0,0,0.3)" : "0 10px 40px rgba(0,0,0,0.05)"
                }}
              >
                {/* Header */}
                <div style={{ 
                  padding: "16px 20px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between" 
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ 
                      width: 44, 
                      height: 44, 
                      borderRadius: "15px", 
                      background: "linear-gradient(135deg, #FF7F50, #FFD700)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 800,
                      fontSize: 16,
                      boxShadow: "0 4px 10px rgba(255,127,80,0.3)"
                    }}>
                      S
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ color: theme.text, fontWeight: 800, fontSize: 15 }}>SNS Academy</span>
                        <CheckCircle size={16} weight="fill" color="#4f46e5" />
                      </div>
                      <div style={{ color: theme.textMuted, fontSize: 12, fontWeight: 600 }}>{event.location} • {event.postedTime}</div>
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: theme.textMuted }}
                  >
                    <DotsThreeOutlineVertical size={24} weight="fill" />
                  </motion.button>
                </div>

                {/* Image Area - Double Tap to Like */}
                <div 
                  style={{ 
                    width: "100%", 
                    aspectRatio: "4/5", 
                    background: theme.isDark ? "#121212" : "#f0f0f0",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer"
                  }}
                  onDoubleClick={() => toggleLike(event.id)}
                >
                  <img 
                    src={event.image} 
                    alt={event.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  
                  {/* Category Badge */}
                  <div style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    padding: "6px 14px",
                    background: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: 100,
                    color: "white",
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}>
                    {event.icon}
                    {event.category}
                  </div>
                </div>

                {/* Interaction & Details */}
                <div style={{ padding: "20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                      <motion.button 
                        whileTap={{ scale: 0.7 }}
                        onClick={() => toggleLike(event.id)}
                        style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                      >
                        <Heart 
                          size={30} 
                          weight={isLiked ? "fill" : "bold"} 
                          color={isLiked ? "#ef4444" : theme.text} 
                        />
                      </motion.button>
                      <ChatCircle size={30} weight="bold" color={theme.text} style={{ cursor: "pointer" }} />
                      <ShareNetwork size={30} weight="bold" color={theme.text} style={{ cursor: "pointer" }} />
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => toggleSave(event.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      <BookmarkSimple size={30} weight={isSaved ? "fill" : "bold"} color={isSaved ? "#FF7F50" : theme.text} />
                    </motion.button>
                  </div>

                  {/* Likes and Caption */}
                  <div style={{ color: theme.text, fontWeight: 800, fontSize: 15, marginBottom: 10 }}>
                    {(isLiked ? event.likes + 1 : event.likes).toLocaleString()} likes
                  </div>
                  
                  <div style={{ fontSize: 15, lineHeight: "1.6", color: theme.text }}>
                    <span style={{ fontWeight: 800, marginRight: 10 }}>SNS Academy</span>
                    <span>
                      {isExpanded ? text : (text.length > 100 ? text.substring(0, 100) + "..." : text)}
                    </span>
                    {text.length > 100 && (
                      <button 
                        onClick={() => toggleCaption(event.id)}
                        style={{ 
                          background: "none", 
                          border: "none", 
                          color: theme.textMuted, 
                          fontWeight: 700, 
                          marginLeft: 6,
                          cursor: "pointer" 
                        }}
                      >
                        {isExpanded ? "show less" : "more"}
                      </button>
                    )}
                  </div>

                  {/* Hashtags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                    {event.hashtags.map((h, hi) => (
                      <span key={hi} style={{ color: event.color, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{h}</span>
                    ))}
                  </div>

                  <div style={{ color: theme.textMuted, fontSize: 14, marginTop: 14, fontWeight: 600, cursor: "pointer" }}>
                    View all {event.comments} comments
                  </div>

                  <div style={{ 
                    marginTop: 16, 
                    paddingTop: 16, 
                    borderTop: `1px solid ${theme.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: theme.textMuted }}>
                      <CalendarBlank size={18} weight="bold" />
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{event.date}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: theme.primary }}>
                      <MapPin size={18} weight="fill" />
                      <span style={{ fontSize: 13, fontWeight: 800 }}>{event.location}</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
