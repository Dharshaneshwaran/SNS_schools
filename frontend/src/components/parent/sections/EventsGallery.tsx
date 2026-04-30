"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Images, CalendarBlank, Heart, ChatCircle, ShareNetwork,
  BookmarkSimple, DotsThreeOutline, Trophy, Flask, MaskHappy,
  Handshake, Microphone, Barbell, GraduationCap,
} from "@phosphor-icons/react";
import { DashboardTheme } from "../../../types/theme";

const events = [
  {
    id: 1,
    title: "Annual Sports Day 2026",
    date: "Apr 20, 2026",
    timeAgo: "9 days ago",
    category: "Sports",
    color: "#FF7F50",
    icon: <Trophy size={16} weight="fill" />,
    image: "/events/sports-day.png",
    caption: "What an incredible day of sportsmanship! 🏆 Our students showcased outstanding athletic abilities across track, field, and team sports. Proud of every participant who gave their best!",
    likes: 248,
    comments: 32,
    postedBy: "SNS Academy",
    avatar: "SA",
    hashtags: ["#SportsDay2026", "#SNSAcademy", "#Champions"],
  },
  {
    id: 2,
    title: "Science Exhibition",
    date: "Apr 14, 2026",
    timeAgo: "2 weeks ago",
    category: "Academic",
    color: "#6C63FF",
    icon: <Flask size={16} weight="fill" />,
    image: "/events/science-exhibition.png",
    caption: "Young scientists blew everyone away at this year's Science Exhibition! 🔬 From renewable energy models to AI-powered robots — the future is bright with these innovators.",
    likes: 189,
    comments: 24,
    postedBy: "SNS Academy",
    avatar: "SA",
    hashtags: ["#ScienceExhibition", "#Innovation", "#FutureScientists"],
  },
  {
    id: 3,
    title: "Cultural Fest 2026",
    date: "Apr 10, 2026",
    timeAgo: "2 weeks ago",
    category: "Cultural",
    color: "#10B981",
    icon: <MaskHappy size={16} weight="fill" />,
    image: "/events/cultural-fest.png",
    caption: "Colors, music, and dance filled the campus during Cultural Fest 2026! 🎭 From classical performances to modern fusion — our students proved that art knows no boundaries.",
    likes: 312,
    comments: 45,
    postedBy: "SNS Academy",
    avatar: "SA",
    hashtags: ["#CulturalFest", "#ArtAndCulture", "#SNSPride"],
  },
  {
    id: 4,
    title: "Parent-Teacher Meet",
    date: "Apr 5, 2026",
    timeAgo: "3 weeks ago",
    category: "Meeting",
    color: "#F59E0B",
    icon: <Handshake size={16} weight="fill" />,
    image: "/events/parent-teacher-meet.png",
    caption: "A productive Parent-Teacher Meet where we discussed academic progress, goals, and the holistic development of every student. 🤝 Together, we build a better future!",
    likes: 134,
    comments: 18,
    postedBy: "SNS Academy",
    avatar: "SA",
    hashtags: ["#PTM", "#ParentTeacher", "#Education"],
  },
  {
    id: 5,
    title: "Inter-School Debate",
    date: "Mar 28, 2026",
    timeAgo: "1 month ago",
    category: "Academic",
    color: "#8B5CF6",
    icon: <Microphone size={16} weight="fill" />,
    image: "/events/debate-competition.png",
    caption: "Our debate team represented SNS Academy brilliantly at the Inter-School Debate Championship! 🎙️ Articulate, confident, and well-prepared — these students are natural leaders.",
    likes: 176,
    comments: 21,
    postedBy: "SNS Academy",
    avatar: "SA",
    hashtags: ["#DebateChampionship", "#PublicSpeaking", "#Leaders"],
  },
  {
    id: 6,
    title: "Yoga & Wellness Day",
    date: "Mar 21, 2026",
    timeAgo: "1 month ago",
    category: "Health",
    color: "#10B981",
    icon: <Barbell size={16} weight="fill" />,
    image: "/events/yoga-wellness.png",
    caption: "Mind, body, and soul — all aligned on Yoga & Wellness Day! 🧘 Students and teachers came together for a rejuvenating session of yoga, meditation, and mindfulness.",
    likes: 203,
    comments: 15,
    postedBy: "SNS Academy",
    avatar: "SA",
    hashtags: ["#YogaDay", "#Wellness", "#MindfulSchool"],
  },
];

export default function EventsGallery({ theme }: { theme: DashboardTheme }) {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>(
    Object.fromEntries(events.map(e => [e.id, e.likes]))
  );
  const [expandedCaptions, setExpandedCaptions] = useState<Set<number>>(new Set());

  const toggleLike = (id: number) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setLikeCounts(c => ({ ...c, [id]: (c[id] ?? 0) - 1 }));
      } else {
        next.add(id);
        setLikeCounts(c => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
      }
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
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Images size={26} weight="duotone" color="#FF7F50" />
          <h1 style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)", fontSize: 24, fontWeight: 700, color: theme.text }}>Events Gallery</h1>
        </div>
        <p style={{ color: theme.textMuted, fontSize: 14 }}>Explore recent school events and highlights</p>
      </div>

      {/* Category Pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
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
        display: "flex", flexDirection: "column", gap: 24,
        maxWidth: 560, margin: "0 auto",
      }}>
        {events.map((event, i) => {
          const isLiked = likedPosts.has(event.id);
          const isSaved = savedPosts.has(event.id);
          const isExpanded = expandedCaptions.has(event.id);
          const captionPreview = event.caption.length > 100 && !isExpanded
            ? event.caption.slice(0, 100) + "..."
            : event.caption;

          return (
            <motion.article
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              style={{
                borderRadius: 16,
                overflow: "hidden",
                background: theme.cardBg,
                border: `1px solid ${theme.border}`,
                boxShadow: theme.isDark ? "0 2px 12px rgba(0,0,0,0.3)" : "0 2px 20px rgba(0,0,0,0.06)",
                transition: "all 0.3s",
              }}
            >
              {/* Post Header - Like Instagram */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "linear-gradient(135deg,#FF7F50,#e66a3e,#FF7F50)",
                    padding: 2,
                  }}>
                    <div style={{
                      width: "100%", height: "100%", borderRadius: "50%",
                      background: theme.cardBg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <GraduationCap size={18} weight="fill" color="#FF7F50" />
                    </div>
                  </div>
                  <div>
                    <p style={{
                      fontSize: 14, fontWeight: 700, color: theme.text,
                      fontFamily: "var(--font-poppins,'Poppins',sans-serif)",
                    }}>{event.postedBy}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{
                        fontSize: 11, color: "white", fontWeight: 600,
                        background: event.color, padding: "2px 8px",
                        borderRadius: 6,
                      }}>
                        {event.category}
                      </span>
                      <span style={{ fontSize: 12, color: theme.textMuted }}>{event.timeAgo}</span>
                    </div>
                  </div>
                </div>
                <button style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: theme.textMuted, padding: 4,
                }}>
                  <DotsThreeOutline size={20} weight="fill" />
                </button>
              </div>

              {/* Post Image */}
              <div
                onDoubleClick={() => toggleLike(event.id)}
                style={{ position: "relative", cursor: "pointer" }}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  style={{
                    width: "100%", height: 320, objectFit: "cover",
                    display: "block",
                  }}
                />
                {/* Double-tap heart animation overlay */}
                <AnimatePresence>
                  {isLiked && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        position: "absolute", inset: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        pointerEvents: "none",
                      }}
                    >
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Bar - Like Instagram */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 16px 8px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => toggleLike(event.id)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      padding: 0, display: "flex",
                    }}
                  >
                    <Heart
                      size={26}
                      weight={isLiked ? "fill" : "regular"}
                      color={isLiked ? "#EF4444" : theme.text}
                    />
                  </motion.button>
                  <button style={{
                    background: "none", border: "none", cursor: "pointer",
                    padding: 0, display: "flex", color: theme.text,
                  }}>
                    <ChatCircle size={25} weight="regular" />
                  </button>
                  <button style={{
                    background: "none", border: "none", cursor: "pointer",
                    padding: 0, display: "flex", color: theme.text,
                  }}>
                    <ShareNetwork size={24} weight="regular" />
                  </button>
                </div>
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() => toggleSave(event.id)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    padding: 0, display: "flex",
                  }}
                >
                  <BookmarkSimple
                    size={25}
                    weight={isSaved ? "fill" : "regular"}
                    color={isSaved ? "#FF7F50" : theme.text}
                  />
                </motion.button>
              </div>

              {/* Like Count */}
              <div style={{ padding: "0 16px 4px" }}>
                <p style={{
                  fontSize: 14, fontWeight: 700, color: theme.text,
                  fontFamily: "var(--font-inter,'Inter',sans-serif)",
                }}>
                  {(likeCounts[event.id] ?? 0).toLocaleString()} likes
                </p>
              </div>

              {/* Caption - LinkedIn style */}
              <div style={{ padding: "4px 16px 6px" }}>
                <p style={{
                  fontSize: 14, color: theme.text, lineHeight: 1.6,
                  fontFamily: "var(--font-inter,'Inter',sans-serif)",
                }}>
                  <span style={{ fontWeight: 700 }}>{event.postedBy}</span>{" "}
                  {captionPreview}
                  {event.caption.length > 100 && !isExpanded && (
                    <button
                      onClick={() => toggleCaption(event.id)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: theme.textMuted, fontSize: 14, fontWeight: 500, padding: 0,
                        marginLeft: 4,
                      }}
                    >
                      more
                    </button>
                  )}
                </p>
              </div>

              {/* Hashtags */}
              <div style={{ padding: "0 16px 8px", display: "flex", flexWrap: "wrap", gap: 6 }}>
                {event.hashtags.map(tag => (
                  <span key={tag} style={{
                    fontSize: 13, color: event.color, fontWeight: 600, cursor: "pointer",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Comments preview */}
              <div style={{ padding: "0 16px 4px" }}>
                <button style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 13, color: theme.textMuted, padding: 0,
                  fontFamily: "var(--font-inter,'Inter',sans-serif)",
                }}>
                  View all {event.comments} comments
                </button>
              </div>

              {/* Date */}
              <div style={{ padding: "4px 16px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, color: theme.textMuted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  <CalendarBlank size={12} />
                  {event.date}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
