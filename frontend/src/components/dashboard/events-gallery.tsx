"use client";

import { motion } from "framer-motion";
import { Heart, ChatCircle, ShareNetwork, BookmarkSimple } from "@phosphor-icons/react";

import { DashboardTheme } from "../../types/theme";

const events = [
  {
    id: 1,
    title: "SNS Academy Athletics",
    category: "Sports",
    time: "9 days ago",
    likes: 248,
    image: "/events/sports-day.png",
    description: "What an incredible day of sportsmanship! 🏆 Our students showcased outstanding athletic abilities across multiple tracks.",
  },
  {
    id: 2,
    title: "Annual Design Thinking Workshop",
    category: "Academic",
    time: "2 weeks ago",
    likes: 185,
    image: "/events/science-exhibition.png",
    description: "Future innovators in action. Students collaborating on real-world problem solving using Design Thinking methodologies.",
  },
];

export function EventsGallery({ theme }: { theme?: DashboardTheme }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-[var(--text-primary)]">Events Gallery</h3>
        <div className="flex gap-2">
          {["All", "Sports", "Academic", "Cultural"].map((cat) => (
            <button 
              key={cat}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                cat === 'All' 
                  ? 'bg-[var(--accent)] text-white shadow-[0_8px_20px_rgba(255,127,80,0.3)]' 
                  : 'bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <motion.div 
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group rounded-[2rem] overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)] shadow-[0_24px_70px_rgba(15,23,42,0.05)]"
          >
            {/* Header */}
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold shadow-[0_8px_20px_rgba(255,127,80,0.2)]">
                  SNS
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--text-primary)] leading-tight">SNS Academy</div>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-0.5 rounded-full font-bold">{event.category}</span>
                     <span className="text-[10px] text-[var(--text-muted)] font-medium">{event.time}</span>
                  </div>
                </div>
              </div>
              <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <ShareNetwork size={20} />
              </button>
            </div>

            {/* Image */}
            <div className="aspect-[4/3] relative overflow-hidden bg-[var(--bg-muted)] border-y border-[var(--border)]">
               <img 
                 src={event.image} 
                 alt={event.title}
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
               />
            </div>

            {/* Actions */}
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-rose-500 transition-colors">
                    <Heart size={22} />
                  </button>
                  <button className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                    <ChatCircle size={22} />
                  </button>
                  <button className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-sky-500 transition-colors">
                    <ShareNetwork size={22} />
                  </button>
                </div>
                <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                  <BookmarkSimple size={22} />
                </button>
              </div>

              <div>
                <div className="text-xs font-bold text-[var(--text-primary)] mb-1">{event.likes} likes</div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  <span className="font-bold text-[var(--text-primary)] mr-2">SNS Academy</span>
                  {event.description}
                  <button className="text-[var(--accent)] font-semibold ml-1 hover:underline">more</button>
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
