"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  ChatCircle, 
  PaperPlaneTilt, 
  BookmarkSimple, 
  DotsThreeOutlineVertical,
  CalendarBlank,
  MapPin,
  CheckCircle
} from "@phosphor-icons/react";
import { useState } from "react";
import { DashboardTheme } from "../../../types/theme";



const events = [
  { 
    id: 1,
    title: "Annual Sports Day 2026", 
    date: "Apr 20, 2026", 
    location: "Main Stadium",
    category: "Sports", 
    image: "/events/sports-day.png",
    likes: 1248,
    comments: 48,
    description: "What an incredible display of talent and sportsmanship! 🏆 Our students showcased outstanding athletic abilities across track, field, and team sports. Proud of every participant who gave their best! #SportsDay2026 #SNSAcademy #Champions",
    postedTime: "2 hours ago"
  },
  { 
    id: 2,
    title: "Science Exhibition", 
    date: "Apr 14, 2026", 
    location: "Block A Hall",
    category: "Academic", 
    image: "/events/science-exhibition.png",
    likes: 856,
    comments: 32,
    description: "Exploring the future! 🔬 Our young scientists blew everyone away at this year's Science Exhibition. From renewable energy models to AI-powered robots — the future is bright! #ScienceFair #Innovation #FutureScientists",
    postedTime: "1 day ago"
  },
  { 
    id: 3,
    title: "Cultural Fest 2026", 
    date: "Apr 10, 2026", 
    location: "Open Air Theatre",
    category: "Cultural", 
    image: "/events/cultural-fest.png",
    likes: 2432,
    comments: 156,
    description: "A night filled with music, dance, and vibrant performances! 🎭 From classical performances to modern fusion — our students proved that art knows no boundaries. #CulturalFest #ArtAndCulture #SNSPride",
    postedTime: "3 days ago"
  },
  { 
    id: 4,
    title: "Parent-Teacher Meet", 
    date: "Apr 5, 2026", 
    location: "Conference Room",
    category: "Meeting", 
    image: "/events/parent-teacher-meet.png",
    likes: 432,
    comments: 12,
    description: "A productive Parent-Teacher Meet discussing student progress and future goals. 🤝 Together, we build a better future for our students! #PTM #ParentTeacher #Education",
    postedTime: "1 week ago"
  },
];

export default function EventsGallery({ theme }: { theme: DashboardTheme }) {

  const [likedEvents, setLikedEvents] = useState<number[]>([]);
  const [expandedCaptions, setExpandedCaptions] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLikedEvents(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleCaption = (id: number) => {
    setExpandedCaptions(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
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
        {events.map((event, i) => (
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



      <div style={{ 
        maxWidth: "500px", 
        margin: "0 auto", 
        width: "100%",
        display: "flex", 
        flexDirection: "column", 
        gap: 24,
        paddingBottom: 60 
      }}>
        <AnimatePresence mode="popLayout">
          {events.map((event, i) => {
            const isLiked = likedEvents.includes(event.id);
            const isExpanded = expandedCaptions.includes(event.id);
            const captionParts = event.description.split(" #");
            const text = captionParts[0];
            const hashtags = captionParts.length > 1 ? captionParts.slice(1).map(h => "#" + h) : [];

            return (
              <motion.div
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
                {/* Header - Stolen from Mobile UI Stagger */}
                <div style={{ 
                  padding: "12px 16px", 
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
                    aspectRatio: "16/10", 
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
                    letterSpacing: "0.05em"
                  }}>
                    {event.category}
                  </div>
                </div>

                {/* Interaction & Details */}
                <div style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <motion.button 
                        whileTap={{ scale: 0.7 }}
                        onClick={() => toggleLike(event.id)}
                        style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                      >
                        <Heart 
                          size={24} 
                          weight={isLiked ? "fill" : "bold"} 
                          color={isLiked ? "#ef4444" : theme.text} 
                        />
                      </motion.button>
                      <ChatCircle size={24} weight="bold" color={theme.text} style={{ cursor: "pointer" }} />
                      <PaperPlaneTilt size={24} weight="bold" color={theme.text} style={{ cursor: "pointer" }} />
                    </div>
                    <BookmarkSimple size={24} weight="bold" color={theme.text} style={{ cursor: "pointer" }} />
                  </div>

                  {/* Likes and Caption */}
                  <div style={{ color: theme.text, fontWeight: 800, fontSize: 15, marginBottom: 10 }}>
                    {isLiked ? (event.likes + 1).toLocaleString() : event.likes.toLocaleString()} likes
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

                  {/* Staggered Hashtags Row */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                    {hashtags.map((h, hi) => (
                      <span key={hi} style={{ color: "#4f46e5", fontWeight: 700, fontSize: 14 }}>{h}</span>
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
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
