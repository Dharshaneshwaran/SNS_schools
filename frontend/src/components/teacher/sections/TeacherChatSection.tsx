"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  Search, 
  Smile, 
  CheckCheck,
  Phone,
  Video,
  User,
  Users,
  Image as ImageIcon,
  FileText
} from "lucide-react";

const initialContacts = [
  { id: 1, name: "Grade 10-A Parents", lastMsg: "When is the next meeting?", time: "10:30", unread: 2, online: true, isGroup: true },
  { id: 2, name: "Grade 12-C Parents", lastMsg: "Thank you for the homework update.", time: "09:15", unread: 0, online: true, isGroup: true },
  { id: 3, name: "Principal Office", lastMsg: "Meeting at 3 PM today.", time: "Yesterday", unread: 0, online: false, isGroup: false },
  { id: 4, name: "Science Dept", lastMsg: "Syllabus draft shared.", time: "Yesterday", unread: 0, online: true, isGroup: true },
];

const initialMessages = [
  { id: 1, text: "Hello parents, please note that the Mathematics homework for today has been uploaded to the portal.", time: "10:00 AM", isMe: true, status: 'read' },
  { id: 2, text: "Thank you sir. My son is working on it.", time: "10:15 AM", isMe: false, sender: "Mrs. Anjali" },
  { id: 3, text: "When is the deadline for submission?", time: "10:30 AM", isMe: false, sender: "Mr. Rakesh" },
];

export default function TeacherChatSection() {
  const [selectedContact, setSelectedContact] = useState(initialContacts[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: messages.length + 1,
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      status: 'sent'
    };
    setMessages([...messages, newMsg]);
    setInput("");
  };

  return (
    <div className="h-[calc(100vh-200px)] -mx-6 lg:-mx-10 -mt-8 flex bg-[var(--bg-primary)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-80 lg:w-96 flex flex-col border-r border-[var(--border)] bg-[var(--bg-secondary)]">
        {/* Sidebar Header */}
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 text-white flex items-center justify-center font-black italic">Y</div>
            <h2 className="text-lg font-black italic text-[var(--text-primary)]">Chats</h2>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-xl hover:bg-[var(--bg-primary)] text-[var(--text-secondary)]"><Users size={20} /></button>
            <button className="p-2 rounded-xl hover:bg-[var(--bg-primary)] text-[var(--text-secondary)]"><MoreVertical size={20} /></button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search or start new chat" 
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-2.5 pl-11 pr-4 text-xs font-medium outline-none focus:border-[var(--accent)] transition-all"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {initialContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`w-full flex items-center gap-4 p-4 transition-all border-b border-[var(--border)]/30 ${
                selectedContact.id === contact.id ? "bg-[var(--accent-glow)] border-l-4 border-l-[var(--accent)]" : "hover:bg-[var(--bg-primary)]"
              }`}
            >
              <div className="relative shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${contact.isGroup ? "bg-orange-500/10 text-orange-500" : "bg-blue-500/10 text-blue-500"}`}>
                  {contact.isGroup ? <Users size={24} /> : <User size={24} />}
                </div>
                {contact.online && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[var(--bg-secondary)]" />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className={`text-sm font-bold truncate ${selectedContact.id === contact.id ? "text-[var(--accent)]" : "text-[var(--text-primary)]"}`}>
                    {contact.name}
                  </h3>
                  <span className="text-[10px] text-[var(--text-secondary)] font-medium">{contact.time}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] truncate font-medium">{contact.lastMsg}</p>
              </div>
              {contact.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-[var(--accent)] text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-[var(--accent-glow)]">
                  {contact.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat View */}
      <div className="flex-1 flex flex-col relative">
        {/* Chat Header */}
        <div className="p-4 px-8 border-b border-[var(--border)] bg-[var(--bg-secondary)] flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedContact.isGroup ? "bg-orange-500/10 text-orange-500" : "bg-blue-500/10 text-blue-500"}`}>
              {selectedContact.isGroup ? <Users size={20} /> : <User size={20} />}
            </div>
            <div>
              <h3 className="text-sm font-black italic text-[var(--text-primary)]">{selectedContact.name}</h3>
              <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">{selectedContact.online ? "Online" : "Last seen recently"}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-[var(--text-secondary)]">
            <button className="hover:text-[var(--accent)] transition-colors"><Video size={20} /></button>
            <button className="hover:text-[var(--accent)] transition-colors"><Phone size={20} /></button>
            <div className="w-px h-6 bg-[var(--border)]" />
            <button className="hover:text-[var(--accent)] transition-colors"><Search size={20} /></button>
            <button className="hover:text-[var(--accent)] transition-colors"><MoreVertical size={20} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-chat-pattern">
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}
            >
              <div 
                className={`max-w-[80%] md:max-w-[60%] p-4 rounded-3xl relative shadow-sm ${
                  msg.isMe 
                    ? "bg-[#DCF8C6] dark:bg-[#056162] text-black dark:text-white rounded-tr-none border border-black/5" 
                    : "bg-white dark:bg-[#202c33] text-[var(--text-primary)] rounded-tl-none border border-[var(--border)]"
                }`}
              >
                {!msg.isMe && selectedContact.isGroup && (
                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">{msg.sender}</p>
                )}
                <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                <div className="flex items-center justify-end gap-1.5 mt-1.5">
                  <span className="text-[9px] opacity-60 font-bold uppercase">{msg.time}</span>
                  {msg.isMe && (
                    <CheckCheck size={14} className={msg.status === 'read' ? "text-blue-500" : "text-gray-400"} />
                  )}
                </div>

                {/* Bubble Tip */}
                <div className={`absolute top-0 w-3 h-3 ${
                  msg.isMe 
                    ? "-right-2 bg-[#DCF8C6] dark:bg-[#056162]" 
                    : "-left-2 bg-white dark:bg-[#202c33]"
                } clip-path-bubble`} />
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 px-8 bg-[var(--bg-secondary)] border-t border-[var(--border)] flex items-center gap-4">
          <div className="flex gap-4 text-[var(--text-secondary)]">
            <button className="hover:text-[var(--accent)] transition-colors"><Smile size={24} /></button>
            <div className="relative">
              <button className="hover:text-[var(--accent)] transition-colors"><Paperclip size={24} /></button>
            </div>
          </div>
          
          <div className="flex-1">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..." 
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-[20px] py-3 px-6 text-sm font-medium outline-none focus:border-[var(--accent)] transition-all"
            />
          </div>

          <button 
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-lg shadow-[var(--accent-glow)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            <Send size={20} strokeWidth={3} className="ml-0.5" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .bg-chat-pattern {
          background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');
          background-repeat: repeat;
          background-size: 400px;
          opacity: 0.4;
        }
        .dark .bg-chat-pattern {
          filter: invert(1) opacity(0.05);
        }
        .clip-path-bubble {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 0);
        }
      `}</style>
    </div>
  );
}
