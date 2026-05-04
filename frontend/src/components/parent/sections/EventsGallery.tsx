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
    image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80&w=800",
    likes: 1248,
    comments: 48,
    description: "What an incredible display of talent and sportsmanship! 🏆",
    hashtags: ["#SportsDay2026", "#Champions"],
    postedTime: "2h ago"
  },
  { 
    id: 2,
    title: "Science Exhibition", 
    date: "Apr 14, 2026", 
    location: "Block A Hall",
    category: "Academic", 
    color: "#6C63FF",
    icon: <Flask size={16} weight="fill" />,
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800",
    likes: 856,
    comments: 32,
    description: "Exploring the future! 🔬 Our young scientists blew everyone away.",
    hashtags: ["#ScienceFair", "#Innovation"],
    postedTime: "1d ago"
  },
  { 
    id: 3,
    title: "Cultural Fest 2026", 
    date: "Apr 10, 2026", 
    location: "Open Air Theatre",
    category: "Cultural", 
    color: "#10B981",
    icon: <MaskHappy size={16} weight="fill" />,
    image: "https://images.unsplash.com/photo-1514525253361-bee8718a747c?auto=format&fit=crop&q=80&w=800",
    likes: 2432,
    comments: 156,
    description: "A night filled with music, dance, and vibrant performances! 🎭",
    hashtags: ["#CulturalFest", "#SNSPride"],
    postedTime: "3d ago"
  },
  { 
    id: 4,
    title: "Parent-Teacher Meet", 
    date: "Apr 5, 2026", 
    location: "Conference Room",
    category: "Meeting", 
    color: "#F59E0B",
    icon: <Handshake size={16} weight="fill" />,
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800",
    likes: 432,
    comments: 12,
    description: "A productive Parent-Teacher Meet discussing student progress. 🤝",
    hashtags: ["#PTM", "#Education"],
    postedTime: "1w ago"
  },
  {
    id: 5,
    title: "Inter-School Debate",
    date: "Mar 28, 2026",
    location: "Auditorium",
    category: "Academic",
    color: "#8B5CF6",
    icon: <Microphone size={16} weight="fill" />,
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800",
    likes: 176,
    comments: 21,
    description: "Our debate team represented SNS Academy brilliantly! 🎙️",
    hashtags: ["#Debate", "#Leaders"],
    postedTime: "1mo ago"
  },
  {
    id: 6,
    title: "Yoga & Wellness Day",
    date: "Mar 21, 2026",
    location: "Wellness Center",
    category: "Health",
    color: "#10B981",
    icon: <Barbell size={16} weight="fill" />,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
    likes: 203,
    comments: 15,
    description: "Mind, body, and soul — all aligned on Yoga Day! 🧘",
    hashtags: ["#YogaDay", "#Wellness"],
    postedTime: "1mo ago"
  },
];

export default function EventsGallery({ theme }: { theme: DashboardTheme }) {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());
  const [selectedStory, setSelectedStory] = useState<number | null>(null);

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

  const filteredEvents = selectedStory 
    ? events.filter(e => e.id === selectedStory)
    : events;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Stories */}
      <div style={{ 
        display: "flex", 
        gap: 20, 
        overflowX: "auto", 
        paddingBottom: 10,
        paddingLeft: 4
      }} className="hide-scrollbar">
        {/* "All" Story Option */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedStory(null)}
            style={{
              width: 64, height: 64, borderRadius: "50%", padding: 2,
              background: !selectedStory ? "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" : (theme.isDark ? "#333" : "#eee"),
              cursor: "pointer"
            }}
          >
            <div style={{ 
              width: "100%", height: "100%", borderRadius: "50%", 
              border: `2px solid ${theme.cardBg}`,
              overflow: "hidden",
              background: theme.isDark ? "rgba(255,255,255,0.05)" : "#fff",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <span style={{ fontSize: 12, fontWeight: 900, color: theme.text }}>ALL</span>
            </div>
          </motion.div>
          <span style={{ fontSize: 10, fontWeight: 700, color: theme.text }}>Show All</span>
        </div>

        {events.map((event) => (
          <div key={event.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedStory(event.id)}
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                padding: 2,
                background: selectedStory === event.id ? "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" : (theme.isDark ? "#333" : "#eee"),
                cursor: "pointer"
              }}
            >
              <div style={{ 
                width: "100%", 
                height: "100%", 
                borderRadius: "50%", 
                border: `2px solid ${theme.cardBg}`,
                overflow: "hidden",
                background: "#eee"
              }}>
                <img src={event.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </motion.div>
            <span style={{ fontSize: 10, fontWeight: 700, color: theme.text, maxWidth: 64, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {event.title.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>

      {/* Grid Feed */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 24,
        paddingBottom: 60 
      }}>
        <AnimatePresence mode="popLayout">
          {filteredEvents.map((event) => {
            const isLiked = likedPosts.has(event.id);
            const isSaved = savedPosts.has(event.id);

            return (
              <motion.article
                key={event.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                style={{
                  background: theme.cardBg,
                  borderRadius: 20,
                  border: `1px solid ${theme.border}`,
                  overflow: "hidden",
                  boxShadow: theme.isDark ? "0 8px 30px rgba(0,0,0,0.2)" : "0 8px 30px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                {/* Image Area */}
                <div 
                  style={{ 
                    width: "100%", 
                    aspectRatio: "1/1", 
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
                  
                  {/* SNS Logo Overlay */}
                  <div style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    width: 32,
                    height: 32,
                    background: "white",
                    borderRadius: 8,
                    padding: 4,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <img src="/images/logo.png" alt="SNS" style={{ width: "100%", height: "auto" }} />
                  </div>

                  {/* Category Badge */}
                  <div style={{
                    position: "absolute",
                    bottom: 12,
                    right: 12,
                    padding: "4px 10px",
                    background: "rgba(0,0,0,0.4)",
                    backdropFilter: "blur(8px)",
                    borderRadius: 8,
                    color: "white",
                    fontSize: 10,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: 4
                  }}>
                    {event.icon}
                    {event.category}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <motion.button 
                        whileTap={{ scale: 0.7 }}
                        onClick={() => toggleLike(event.id)}
                        style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                      >
                        <Heart size={24} weight={isLiked ? "fill" : "bold"} color={isLiked ? "#ef4444" : theme.text} />
                      </motion.button>
                      <ChatCircle size={24} weight="bold" color={theme.text} />
                      <ShareNetwork size={24} weight="bold" color={theme.text} />
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => toggleSave(event.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      <BookmarkSimple size={24} weight={isSaved ? "fill" : "bold"} color={isSaved ? "#FF7F50" : theme.text} />
                    </motion.button>
                  </div>

                  <div style={{ fontWeight: 800, fontSize: 13, color: theme.text, marginBottom: 4 }}>
                    {event.title}
                  </div>
                  <div style={{ fontSize: 12, color: theme.textMuted, lineHeight: "1.4", marginBottom: 8 }}>
                    {event.description}
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                    {event.hashtags.map((h, hi) => (
                      <span key={hi} style={{ color: event.color, fontWeight: 700, fontSize: 11 }}>{h}</span>
                    ))}
                  </div>

                  <div style={{ 
                    paddingTop: 12, 
                    borderTop: `1px solid ${theme.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: theme.textMuted,
                    fontSize: 11,
                    fontWeight: 700
                  }}>
                    <span>{event.date}</span>
                    <span style={{ color: theme.primary }}>{event.location}</span>
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
