"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  MessageCircle, 
  Megaphone, 
  Send, 
  Search, 
  User,
  MoreVertical,
  Circle
} from "lucide-react";

const recentChats = [
  { name: "Rahul S. (Parent)", message: "When is the next math test?", time: "2m ago", online: true },
  { name: "Grade 10-A Group", message: "Assignment uploaded", time: "1h ago", online: false },
  { name: "Principal", message: "Please check the circular", time: "3h ago", online: true },
];

export default function CommunicationHub() {
  const [activeTab, setActiveTab] = useState("Messages");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Panel: Navigation & Chats */}
      <div className="lg:col-span-1 space-y-6">
        <div className="flex items-center gap-2 p-1.5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)]">
          {["Messages", "Announcements"].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === t 
                  ? "bg-[var(--accent)] text-white" 
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]"
              }`}
            >
              {t === "Messages" ? <MessageCircle size={14} /> : <Megaphone size={14} />}
              {t}
            </button>
          ))}
        </div>

        <div className="p-6 rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)] h-[400px] flex flex-col">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
            <input 
              type="text" 
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border-transparent focus:border-[var(--accent)] text-sm transition-all text-[var(--text-primary)] outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-hide">
            {recentChats.map((chat, i) => (
              <div 
                key={i}
                className="p-3 rounded-2xl hover:bg-[var(--bg-primary)] cursor-pointer transition-all flex items-center gap-3 group border border-transparent hover:border-[var(--border)]"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-glow)] flex items-center justify-center text-[var(--accent)]">
                    <User size={20} />
                  </div>
                  {chat.online && <Circle className="absolute -bottom-0.5 -right-0.5 text-green-500 fill-green-500 border-2 border-[var(--bg-secondary)] rounded-full" size={10} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className="text-sm font-bold text-[var(--text-primary)] truncate">{chat.name}</h4>
                    <span className="text-[10px] text-[var(--text-secondary)]">{chat.time}</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] truncate">{chat.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel: Chat Content (Placeholder) */}
      <div className="lg:col-span-2">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)] h-full min-h-[460px] flex flex-col"
        >
          {activeTab === "Messages" ? (
            <>
              <div className="flex items-center justify-between pb-6 border-b border-[var(--border)] mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--accent-glow)] flex items-center justify-center text-[var(--accent)]">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Rahul S. (Parent)</h3>
                    <p className="text-xs text-green-500 font-bold">Online</p>
                  </div>
                </div>
                <button className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 opacity-50">
                <div className="p-4 rounded-full bg-[var(--bg-primary)]">
                  <MessageCircle size={32} className="text-[var(--text-secondary)]" />
                </div>
                <p className="text-sm text-[var(--text-secondary)]">Select a conversation to start chatting</p>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <input 
                  type="text" 
                  placeholder="Type a message..."
                  className="flex-1 px-5 py-3 rounded-2xl bg-[var(--bg-primary)] border-transparent focus:border-[var(--accent)] transition-all outline-none text-sm"
                />
                <button className="p-3.5 rounded-2xl bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)] hover:scale-105 active:scale-95 transition-all">
                  <Send size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Announcements</h3>
                <button className="px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-bold">New Post</button>
              </div>
              <div className="space-y-4 overflow-y-auto pr-2 scrollbar-hide">
                {[
                  { title: "Sports Day Rescheduled", date: "Apr 28, 2026", type: "Urgent" },
                  { title: "Summer Vacation Dates", date: "Apr 25, 2026", type: "Regular" },
                ].map((post, i) => (
                  <div key={i} className="p-5 rounded-[24px] bg-[var(--bg-primary)] border border-[var(--border)] group hover:border-[var(--accent)] transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{post.title}</h4>
                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${post.type === 'Urgent' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>{post.type}</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">Please note that the upcoming sports day has been rescheduled to next week due to weather forecasts.</p>
                    <span className="text-[10px] text-[var(--text-secondary)] font-medium italic">{post.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
