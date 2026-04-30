"use client";

import { motion } from "framer-motion";
import { 
  Heart, 
  ChatCircle, 
  PaperPlaneTilt, 
  BookmarkSimple, 
  DotsThreeOutlineVertical,
  CalendarBlank,
  MapPin
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
    likes: "1.2k",
    comments: "48",
    description: "What an incredible display of talent and sportsmanship! Congratulations to all winners. #SportsDay #SNSProud",
    postedTime: "2 hours ago"
  },
  { 
    id: 2,
    title: "Science Exhibition", 
    date: "Apr 14, 2026", 
    location: "Block A Hall",
    category: "Academic", 
    image: "/events/science-exhibition.png",
    likes: "856",
    comments: "32",
    description: "Exploring the future! Our students presented some truly innovative projects today. #ScienceFair #Innovation",
    postedTime: "1 day ago"
  },
  { 
    id: 3,
    title: "Cultural Fest 2026", 
    date: "Apr 10, 2026", 
    location: "Open Air Theatre",
    category: "Cultural", 
    image: "/events/cultural-fest.png",
    likes: "2.4k",
    comments: "156",
    description: "A night filled with music, dance, and vibrant performances! #CulturalFest #SNSAcademy",
    postedTime: "3 days ago"
  },
  { 
    id: 4,
    title: "Parent-Teacher Meet", 
    date: "Apr 5, 2026", 
    location: "Conference Room",
    category: "Meeting", 
    image: "/events/parent-teacher-meet.png",
    likes: "432",
    comments: "12",
    description: "Great session discussing student progress and future goals. Thank you parents for your active participation.",
    postedTime: "1 week ago"
  },
];

export default function EventsGallery({ theme }: { theme: DashboardTheme }) {
  const [likedEvents, setLikedEvents] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLikedEvents(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ 
      maxWidth: "600px", 
      margin: "0 auto", 
      display: "flex", 
      flexDirection: "column", 
      gap: 24,
      paddingBottom: 40 
    }}>
      {events.map((event, i) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          style={{
            background: theme.card,
            borderRadius: 16,
            border: `1px solid ${theme.border}`,
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}
        >
          {/* Header */}
          <div style={{ 
            padding: "12px 16px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between" 
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ 
                width: 36, 
                height: 36, 
                borderRadius: "50%", 
                background: "linear-gradient(45deg, #FF7F50, #FFD700)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: 14
              }}>
                S
              </div>
              <div>
                <div style={{ color: theme.text, fontWeight: 700, fontSize: 14 }}>SNS Academy</div>
                <div style={{ color: theme.textMuted, fontSize: 12 }}>{event.location}</div>
              </div>
            </div>
            <DotsThreeOutlineVertical size={20} weight="fill" color={theme.textMuted} />
          </div>

          {/* Image */}
          <div 
            style={{ 
              width: "100%", 
              aspectRatio: "1/1", 
              background: "#f0f0f0",
              position: "relative",
              overflow: "hidden"
            }}
            onDoubleClick={() => toggleLike(event.id)}
          >
            <img 
              src={event.image} 
              alt={event.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Action Bar */}
          <div style={{ padding: "12px 16px 8px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <motion.button 
                  whileTap={{ scale: 0.8 }}
                  onClick={() => toggleLike(event.id)}
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                >
                  <Heart 
                    size={28} 
                    weight={likedEvents.includes(event.id) ? "fill" : "bold"} 
                    color={likedEvents.includes(event.id) ? "#ef4444" : theme.text} 
                  />
                </motion.button>
                <ChatCircle size={28} weight="bold" color={theme.text} style={{ cursor: "pointer" }} />
                <PaperPlaneTilt size={28} weight="bold" color={theme.text} style={{ cursor: "pointer" }} />
              </div>
              <BookmarkSimple size={28} weight="bold" color={theme.text} style={{ cursor: "pointer" }} />
            </div>

            {/* Content */}
            <div style={{ color: theme.text, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
              {event.likes} likes
            </div>
            
            <div style={{ fontSize: 14, lineHeight: "1.4", marginBottom: 6 }}>
              <span style={{ fontWeight: 700, marginRight: 8, color: theme.text }}>SNS Academy</span>
              <span style={{ color: theme.text }}>{event.description}</span>
            </div>

            <div style={{ color: theme.textMuted, fontSize: 14, marginBottom: 8, cursor: "pointer" }}>
              View all {event.comments} comments
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <CalendarBlank size={14} color={theme.textMuted} />
              <span style={{ color: theme.textMuted, fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>
                Event Date: {event.date}
              </span>
            </div>

            <div style={{ color: theme.textMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {event.postedTime}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
